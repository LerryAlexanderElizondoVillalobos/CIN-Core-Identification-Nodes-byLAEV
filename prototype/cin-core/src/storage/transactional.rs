//! Transactional local record writes with staging, SHA-256 read-back and commit markers.
//!
//! The digest in this module covers the exact UTF-8 JSON bytes written by this
//! storage adapter. It is not a JCS signature input and does not establish issuer
//! trust, signature validity or authorization.
use crate::{
    documents::{validate_document, DocumentEnvelope},
    storage::{DocumentRepository, StorageError},
};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

const STORAGE_FORMAT_VERSION: u32 = 1;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct TransactionMetadata {
    pub storage_format_version: u32,
    pub operation_id: String,
    pub document_id: String,
    pub digest_algorithm: String,
    pub digest: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CommitMarker {
    pub storage_format_version: u32,
    pub operation_id: String,
    pub document_id: String,
    pub digest_algorithm: String,
    pub digest: String,
    pub committed_at_unix_seconds: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PreparedTransaction {
    pub operation_id: String,
    pub document_id: String,
    pub digest: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommitReceipt {
    pub operation_id: String,
    pub document_id: String,
    pub digest: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TransactionStatus {
    Prepared,
    Committed,
    Incomplete,
    Inconsistent,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RecoveryIssue {
    pub operation_id: String,
    pub status: TransactionStatus,
    pub detail: String,
}

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct TransactionRecoveryReport {
    pub inspected: usize,
    pub prepared: usize,
    pub committed: usize,
    pub incomplete: usize,
    pub inconsistent: usize,
    pub issues: Vec<RecoveryIssue>,
}

/// Transactional writer/reader over the existing document repository layout.
///
/// This first implementation is a single-process, single-writer prototype. It
/// uses same-filesystem hard-link publication to prevent replacement of existing
/// records and markers. It does not claim multi-process locking or directory-fsync
/// power-loss guarantees.
#[derive(Debug, Clone)]
pub struct TransactionalStore {
    repository: DocumentRepository,
}

impl TransactionalStore {
    pub fn open(root: impl Into<PathBuf>) -> Result<Self, StorageError> {
        let repository = DocumentRepository::open(root)?;
        for directory in ["staging", "journal", "commits"] {
            fs::create_dir_all(repository.root().join("transactions").join(directory))
                .map_err(io_error)?;
        }
        Ok(Self { repository })
    }

    pub fn prepare_record(
        &self,
        operation_id: &str,
        document: &DocumentEnvelope,
    ) -> Result<PreparedTransaction, StorageError> {
        validate_operation_id(operation_id)?;
        validate_document(document).map_err(|error| StorageError::InvalidDocument(error.to_string()))?;

        let bytes = serde_json::to_vec_pretty(document)
            .map_err(|error| StorageError::Serialization(error.to_string()))?;
        let digest = digest_hex(&bytes);
        let metadata = TransactionMetadata {
            storage_format_version: STORAGE_FORMAT_VERSION,
            operation_id: operation_id.to_owned(),
            document_id: document.document_id.clone(),
            digest_algorithm: "sha-256".into(),
            digest: digest.clone(),
        };

        let stage_path = self.stage_path(operation_id);
        let journal_path = self.journal_path(operation_id);

        if journal_path.exists() {
            let existing = read_json::<TransactionMetadata>(&journal_path)?;
            if existing != metadata {
                return Err(StorageError::Conflict(format!(
                    "operation ID {operation_id} was already used with different input"
                )));
            }
            let staged = fs::read(&stage_path).map_err(io_error)?;
            if digest_hex(&staged) != digest {
                return Err(StorageError::Integrity(format!(
                    "staged bytes for operation {operation_id} do not match journal digest"
                )));
            }
            return Ok(prepared(&metadata));
        }

        if stage_path.exists() {
            let staged = fs::read(&stage_path).map_err(io_error)?;
            if staged != bytes {
                return Err(StorageError::Conflict(format!(
                    "orphan staging file for operation {operation_id} contains different bytes"
                )));
            }
        } else {
            write_new_synced(&stage_path, &bytes)?;
        }

        write_json_new(&journal_path, &metadata)?;
        Ok(prepared(&metadata))
    }

    pub fn commit_record(&self, operation_id: &str) -> Result<CommitReceipt, StorageError> {
        validate_operation_id(operation_id)?;
        let metadata: TransactionMetadata = read_json(&self.journal_path(operation_id))?;
        if metadata.storage_format_version != STORAGE_FORMAT_VERSION
            || metadata.operation_id != operation_id
        {
            return Err(StorageError::Integrity("unsupported or mismatched transaction journal".into()));
        }

        let marker_path = self.marker_path(&metadata.document_id);
        if marker_path.exists() {
            let marker: CommitMarker = read_json(&marker_path)?;
            self.validate_marker_and_record(&metadata, &marker)?;
            return Ok(receipt(&metadata));
        }

        let staged = fs::read(self.stage_path(operation_id)).map_err(io_error)?;
        if digest_hex(&staged) != metadata.digest {
            return Err(StorageError::Integrity(format!(
                "staged record digest mismatch for operation {operation_id}"
            )));
        }
        let document: DocumentEnvelope = serde_json::from_slice(&staged)
            .map_err(|error| StorageError::Serialization(error.to_string()))?;
        validate_document(&document).map_err(|error| StorageError::InvalidDocument(error.to_string()))?;
        if document.document_id != metadata.document_id {
            return Err(StorageError::Integrity("staged document ID differs from journal".into()));
        }

        let record_path = self.repository.document_path(&metadata.document_id);
        if record_path.exists() {
            let existing = fs::read(&record_path).map_err(io_error)?;
            if digest_hex(&existing) != metadata.digest {
                return Err(StorageError::Conflict(format!(
                    "document ID {} already contains different bytes",
                    metadata.document_id
                )));
            }
        } else {
            publish_create_only(&self.stage_path(operation_id), &record_path)?;
        }

        let committed_at = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|error| StorageError::Io(error.to_string()))?
            .as_secs();
        let marker = CommitMarker {
            storage_format_version: STORAGE_FORMAT_VERSION,
            operation_id: metadata.operation_id.clone(),
            document_id: metadata.document_id.clone(),
            digest_algorithm: metadata.digest_algorithm.clone(),
            digest: metadata.digest.clone(),
            committed_at_unix_seconds: committed_at,
        };
        write_json_atomic_create(&marker_path, &marker)?;

        // The marker is the commit decision. A leftover stage file is harmless
        // and is reported by recovery; cleanup is not part of commit visibility.
        Ok(receipt(&metadata))
    }

    /// Normal reads expose only records with a valid commit marker and digest.
    pub fn read_record(&self, document_id: &str) -> Result<DocumentEnvelope, StorageError> {
        let marker_path = self.marker_path(document_id);
        if !marker_path.exists() {
            return Err(StorageError::NotFound(format!(
                "document {document_id} has no commit marker"
            )));
        }
        let marker: CommitMarker = read_json(&marker_path)?;
        if marker.storage_format_version != STORAGE_FORMAT_VERSION
            || marker.document_id != document_id
            || marker.digest_algorithm != "sha-256"
        {
            return Err(StorageError::Integrity("commit marker metadata is invalid".into()));
        }
        let metadata: TransactionMetadata =
            read_json(&self.journal_path(&marker.operation_id))?;
        self.validate_marker_and_record(&metadata, &marker)?;
        let record_path = self.repository.document_path(document_id);
        let bytes = fs::read(record_path).map_err(io_error)?;
        if digest_hex(&bytes) != marker.digest {
            return Err(StorageError::Integrity(format!(
                "committed document {document_id} failed SHA-256 verification"
            )));
        }
        let document: DocumentEnvelope = serde_json::from_slice(&bytes)
            .map_err(|error| StorageError::Serialization(error.to_string()))?;
        validate_document(&document).map_err(|error| StorageError::InvalidDocument(error.to_string()))?;
        if document.document_id != marker.document_id {
            return Err(StorageError::Integrity("record ID differs from commit marker".into()));
        }
        Ok(document)
    }

    pub fn operation_status(&self, operation_id: &str) -> Result<TransactionStatus, StorageError> {
        validate_operation_id(operation_id)?;
        let journal_path = self.journal_path(operation_id);
        if !journal_path.exists() {
            return Err(StorageError::NotFound(format!(
                "transaction {operation_id} has no journal entry"
            )));
        }
        let metadata: TransactionMetadata = read_json(&journal_path)?;
        let marker_path = self.marker_path(&metadata.document_id);
        if !marker_path.exists() {
            if self.repository.document_path(&metadata.document_id).exists() {
                return Ok(TransactionStatus::Inconsistent);
            }
            return if self.stage_path(operation_id).exists() {
                Ok(TransactionStatus::Prepared)
            } else {
                Ok(TransactionStatus::Incomplete)
            };
        }
        let marker: CommitMarker = read_json(&marker_path)?;
        match self.validate_marker_and_record(&metadata, &marker) {
            Ok(()) => Ok(TransactionStatus::Committed),
            Err(_) => Ok(TransactionStatus::Inconsistent),
        }
    }

    /// Inspect journal entries without deleting, repairing or rewriting evidence.
    pub fn inspect_recovery(&self) -> Result<TransactionRecoveryReport, StorageError> {
        let journal_dir = self.transactions_dir().join("journal");
        let mut report = TransactionRecoveryReport::default();
        for entry in fs::read_dir(journal_dir).map_err(io_error)? {
            let entry = entry.map_err(io_error)?;
            if !entry.file_type().map_err(io_error)?.is_file() {
                continue;
            }
            let path = entry.path();
            let Some(operation_id) = path.file_stem().and_then(|value| value.to_str()) else {
                continue;
            };
            report.inspected += 1;
            let metadata: TransactionMetadata = match read_json(&path) {
                Ok(metadata) => metadata,
                Err(error) => {
                    report.inconsistent += 1;
                    report.issues.push(RecoveryIssue {
                        operation_id: operation_id.to_owned(),
                        status: TransactionStatus::Inconsistent,
                        detail: error.to_string(),
                    });
                    continue;
                }
            };
            let status = self.operation_status(&metadata.operation_id)?;
            match status {
                TransactionStatus::Prepared => report.prepared += 1,
                TransactionStatus::Committed => report.committed += 1,
                TransactionStatus::Incomplete => report.incomplete += 1,
                TransactionStatus::Inconsistent => {
                    report.inconsistent += 1;
                    report.issues.push(RecoveryIssue {
                        operation_id: metadata.operation_id,
                        status,
                        detail: "commit marker or authoritative record does not match journal".into(),
                    });
                }
            }
        }

        // A staged file without a journal has no recoverable operation metadata.
        // Preserve it and report it as incomplete instead of treating it as a record.
        let staging_dir = self.transactions_dir().join("staging");
        for entry in fs::read_dir(staging_dir).map_err(io_error)? {
            let entry = entry.map_err(io_error)?;
            if !entry.file_type().map_err(io_error)?.is_file() {
                continue;
            }
            let path = entry.path();
            let Some(stem) = path.file_stem().and_then(|value| value.to_str()) else {
                continue;
            };
            let operation_path = self
                .transactions_dir()
                .join("journal")
                .join(format!("{stem}.json"));
            if !operation_path.exists() {
                report.inspected += 1;
                report.incomplete += 1;
                report.issues.push(RecoveryIssue {
                    operation_id: stem.to_owned(),
                    status: TransactionStatus::Incomplete,
                    detail: "staging file has no matching transaction journal".into(),
                });
            }
        }

        // A commit marker without its journal cannot establish a complete
        // transaction history. Keep the marker and report the missing journal.
        let commits_dir = self.transactions_dir().join("commits");
        for entry in fs::read_dir(commits_dir).map_err(io_error)? {
            let entry = entry.map_err(io_error)?;
            if !entry.file_type().map_err(io_error)?.is_file() {
                continue;
            }
            let marker_path = entry.path();
            let marker: CommitMarker = match read_json(&marker_path) {
                Ok(marker) => marker,
                Err(_) => continue,
            };
            if !self.journal_path(&marker.operation_id).exists() {
                report.inspected += 1;
                report.inconsistent += 1;
                report.issues.push(RecoveryIssue {
                    operation_id: marker.operation_id,
                    status: TransactionStatus::Inconsistent,
                    detail: "commit marker has no matching transaction journal".into(),
                });
            }
        }
        Ok(report)
    }

    fn validate_marker_and_record(
        &self,
        metadata: &TransactionMetadata,
        marker: &CommitMarker,
    ) -> Result<(), StorageError> {
        if marker.storage_format_version != STORAGE_FORMAT_VERSION
            || marker.operation_id != metadata.operation_id
            || marker.document_id != metadata.document_id
            || marker.digest_algorithm != metadata.digest_algorithm
            || marker.digest != metadata.digest
        {
            return Err(StorageError::Integrity("commit marker does not match journal".into()));
        }
        let bytes = fs::read(self.repository.document_path(&metadata.document_id)).map_err(io_error)?;
        if digest_hex(&bytes) != metadata.digest {
            return Err(StorageError::Integrity("committed record digest mismatch".into()));
        }
        Ok(())
    }

    fn transactions_dir(&self) -> PathBuf {
        self.repository.root().join("transactions")
    }

    fn stage_path(&self, operation_id: &str) -> PathBuf {
        self.transactions_dir()
            .join("staging")
            .join(format!("{}.json", encode_id(operation_id)))
    }

    fn journal_path(&self, operation_id: &str) -> PathBuf {
        self.transactions_dir()
            .join("journal")
            .join(format!("{}.json", encode_id(operation_id)))
    }

    fn marker_path(&self, document_id: &str) -> PathBuf {
        self.transactions_dir()
            .join("commits")
            .join(format!("{}.json", encode_id(document_id)))
    }
}

fn prepared(metadata: &TransactionMetadata) -> PreparedTransaction {
    PreparedTransaction {
        operation_id: metadata.operation_id.clone(),
        document_id: metadata.document_id.clone(),
        digest: metadata.digest.clone(),
    }
}

fn receipt(metadata: &TransactionMetadata) -> CommitReceipt {
    CommitReceipt {
        operation_id: metadata.operation_id.clone(),
        document_id: metadata.document_id.clone(),
        digest: metadata.digest.clone(),
    }
}

fn validate_operation_id(operation_id: &str) -> Result<(), StorageError> {
    if operation_id.trim().is_empty() {
        return Err(StorageError::Conflict("operation ID must not be empty".into()));
    }
    Ok(())
}

fn encode_id(value: &str) -> String {
    value
        .as_bytes()
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn digest_hex(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn read_json<T: for<'de> Deserialize<'de>>(path: &Path) -> Result<T, StorageError> {
    let mut file = File::open(path).map_err(io_error)?;
    let mut bytes = Vec::new();
    file.read_to_end(&mut bytes).map_err(io_error)?;
    serde_json::from_slice(&bytes).map_err(|error| StorageError::Serialization(error.to_string()))
}

fn write_new_synced(path: &Path, bytes: &[u8]) -> Result<(), StorageError> {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)
        .map_err(io_error)?;
    file.write_all(bytes).map_err(io_error)?;
    file.sync_all().map_err(io_error)?;
    Ok(())
}

fn write_json_new<T: Serialize>(path: &Path, value: &T) -> Result<(), StorageError> {
    let bytes = serde_json::to_vec_pretty(value)
        .map_err(|error| StorageError::Serialization(error.to_string()))?;
    write_new_synced(path, &bytes)
}

fn write_json_atomic_create<T: Serialize>(path: &Path, value: &T) -> Result<(), StorageError> {
    let bytes = serde_json::to_vec_pretty(value)
        .map_err(|error| StorageError::Serialization(error.to_string()))?;
    let parent = path
        .parent()
        .ok_or_else(|| StorageError::Io("commit marker has no parent directory".into()))?;
    let temp = parent.join(format!(
        ".marker-{}-{}.tmp",
        std::process::id(),
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos()
    ));
    write_new_synced(&temp, &bytes)?;
    publish_create_only(&temp, path)?;
    fs::remove_file(temp).map_err(io_error)?;
    Ok(())
}

fn publish_create_only(source: &Path, target: &Path) -> Result<(), StorageError> {
    match fs::hard_link(source, target) {
        Ok(()) => Ok(()),
        Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {
            Err(StorageError::Conflict(format!(
                "create-only publication target already exists: {}",
                target.display()
            )))
        }
        Err(error) => Err(io_error(error)),
    }
}

fn io_error(error: std::io::Error) -> StorageError {
    StorageError::Io(error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn root() -> PathBuf {
        std::env::temp_dir().join(format!(
            "cin-transactional-{}-{}",
            std::process::id(),
            SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos()
        ))
    }

    fn document(id: &str, value: u64) -> DocumentEnvelope {
        DocumentEnvelope::new(
            id,
            "cin.test",
            "1.0.0",
            "2026-11-15T12:00:00Z",
            json!({"value": value}),
        )
    }

    #[test]
    fn staged_record_is_invisible_until_commit_and_survives_reopen() {
        let root = root();
        let store = TransactionalStore::open(&root).unwrap();
        let doc = document("cin:transaction:1", 1);
        store.prepare_record("operation-1", &doc).unwrap();
        assert!(matches!(
            store.read_record(&doc.document_id),
            Err(StorageError::NotFound(_))
        ));
        assert_eq!(
            store.operation_status("operation-1").unwrap(),
            TransactionStatus::Prepared
        );
        store.commit_record("operation-1").unwrap();
        drop(store);

        let reopened = TransactionalStore::open(&root).unwrap();
        assert_eq!(reopened.read_record(&doc.document_id).unwrap(), doc);
        assert_eq!(
            reopened.operation_status("operation-1").unwrap(),
            TransactionStatus::Committed
        );
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn same_operation_retry_is_idempotent_and_changed_input_conflicts() {
        let root = root();
        let store = TransactionalStore::open(&root).unwrap();
        let doc = document("cin:transaction:2", 2);
        store.prepare_record("operation-2", &doc).unwrap();
        store.prepare_record("operation-2", &doc).unwrap();
        store.commit_record("operation-2").unwrap();
        store.commit_record("operation-2").unwrap();

        let changed = document("cin:transaction:2", 3);
        assert!(matches!(
            store.prepare_record("operation-2", &changed),
            Err(StorageError::Conflict(_))
        ));
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn digest_mismatch_prevents_commit_and_read() {
        let root = root();
        let store = TransactionalStore::open(&root).unwrap();
        let doc = document("cin:transaction:3", 3);
        store.prepare_record("operation-3", &doc).unwrap();
        fs::write(store.stage_path("operation-3"), b"tampered").unwrap();

        assert!(matches!(
            store.commit_record("operation-3"),
            Err(StorageError::Integrity(_))
        ));
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn recovery_inspection_is_non_destructive_for_prepared_transactions() {
        let root = root();
        let store = TransactionalStore::open(&root).unwrap();
        let doc = document("cin:transaction:4", 4);
        store.prepare_record("operation-4", &doc).unwrap();

        let report = store.inspect_recovery().unwrap();
        assert_eq!(report.inspected, 1);
        assert_eq!(report.prepared, 1);
        assert!(store.stage_path("operation-4").exists());
        assert!(store.journal_path("operation-4").exists());
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn committed_record_tampering_is_detected_on_read() {
        let root = root();
        let store = TransactionalStore::open(&root).unwrap();
        let doc = document("cin:transaction:5", 5);
        store.prepare_record("operation-5", &doc).unwrap();
        store.commit_record("operation-5").unwrap();
        fs::write(store.repository.document_path(&doc.document_id), b"tampered").unwrap();

        assert!(matches!(
            store.read_record(&doc.document_id),
            Err(StorageError::Integrity(_))
        ));
        assert_eq!(
            store.operation_status("operation-5").unwrap(),
            TransactionStatus::Inconsistent
        );
        let _ = fs::remove_dir_all(root);
    }
}
