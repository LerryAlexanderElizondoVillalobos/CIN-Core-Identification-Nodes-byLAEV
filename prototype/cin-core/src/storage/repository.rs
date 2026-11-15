use crate::documents::{validate_document, DocumentEnvelope};
use serde_json;
use std::fmt;
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};

static TEMP_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[derive(Debug)]
pub enum StorageError {
    InvalidDocument(String),
    NotFound(String),
    Conflict(String),
    Serialization(String),
    Io(String),
}

impl fmt::Display for StorageError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidDocument(s) => write!(f, "invalid document: {s}"),
            Self::NotFound(s) => write!(f, "document not found: {s}"),
            Self::Conflict(s) => write!(f, "document id conflict: {s}"),
            Self::Serialization(s) => write!(f, "serialization error: {s}"),
            Self::Io(s) => write!(f, "storage I/O error: {s}"),
        }
    }
}
impl std::error::Error for StorageError {}

/// Filesystem repository. It owns the storage root, never the application's UI/runtime.
#[derive(Debug, Clone)]
pub struct DocumentRepository {
    root: PathBuf,
}

impl DocumentRepository {
    pub fn open(root: impl Into<PathBuf>) -> Result<Self, StorageError> {
        let root = root.into();
        fs::create_dir_all(root.join("documents")).map_err(io_error)?;
        Ok(Self { root })
    }

    pub fn root(&self) -> &Path {
        &self.root
    }

    pub fn put(&self, document: &DocumentEnvelope) -> Result<(), StorageError> {
        validate_document(document).map_err(|e| StorageError::InvalidDocument(e.to_string()))?;
        let target = self.document_path(&document.document_id);
        let bytes = serde_json::to_vec_pretty(document)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        if target.exists() {
            let existing = self.get(&document.document_id)?;
            if existing == *document {
                return Ok(()); // idempotent retry of the exact same logical document
            }
            return Err(StorageError::Conflict(document.document_id.clone()));
        }

        let sequence = TEMP_SEQUENCE.fetch_add(1, Ordering::Relaxed);
        let temp = target.with_extension(format!("tmp-{}-{sequence}", std::process::id()));
        let mut file = OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&temp)
            .map_err(io_error)?;
        file.write_all(&bytes).map_err(io_error)?;
        file.sync_all().map_err(io_error)?;
        drop(file);

        // Same-directory rename is atomic on the supported local filesystem.
        // hard_link atomically creates the destination without replacing an existing
        // record. Unlike rename, this preserves create-only semantics under races.
        match fs::hard_link(&temp, &target) {
            Ok(()) => {
                fs::remove_file(&temp).map_err(io_error)?;
                Ok(())
            }
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {
                let _ = fs::remove_file(&temp);
                let existing = self.get(&document.document_id)?;
                if existing == *document {
                    Ok(())
                } else {
                    Err(StorageError::Conflict(document.document_id.clone()))
                }
            }
            Err(error) => {
                let _ = fs::remove_file(&temp);
                Err(io_error(error))
            }
        }
    }

    pub fn get(&self, document_id: &str) -> Result<DocumentEnvelope, StorageError> {
        let path = self.document_path(document_id);
        let mut file = File::open(&path).map_err(|e| {
            if e.kind() == std::io::ErrorKind::NotFound {
                StorageError::NotFound(document_id.to_owned())
            } else {
                io_error(e)
            }
        })?;
        let mut bytes = Vec::new();
        file.read_to_end(&mut bytes).map_err(io_error)?;
        let document: DocumentEnvelope = serde_json::from_slice(&bytes)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;
        validate_document(&document).map_err(|e| StorageError::InvalidDocument(e.to_string()))?;
        if document.document_id != document_id {
            return Err(StorageError::InvalidDocument(
                "stored document id does not match requested id".into(),
            ));
        }
        Ok(document)
    }

    pub fn contains(&self, document_id: &str) -> bool {
        self.document_path(document_id).is_file()
    }

    fn document_path(&self, document_id: &str) -> PathBuf {
        // Hex encoding makes arbitrary IDs safe as filenames and deterministic.
        let encoded: String = document_id
            .as_bytes()
            .iter()
            .map(|byte| format!("{byte:02x}"))
            .collect();
        self.root.join("documents").join(format!("{encoded}.json"))
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

    fn test_root() -> PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("cin-storage-test-{}-{nonce}", std::process::id()))
    }

    fn sample() -> DocumentEnvelope {
        DocumentEnvelope::new(
            "cin:document:storage-test-001",
            "cin.test",
            "1.0.0",
            "2026-11-15T12:00:00Z",
            json!({"value": 7}),
        )
    }

    #[test]
    fn persists_and_recovers_document() {
        let root = test_root();
        let repo = DocumentRepository::open(&root).unwrap();
        let doc = sample();
        repo.put(&doc).unwrap();
        drop(repo);
        let reopened = DocumentRepository::open(&root).unwrap();
        assert_eq!(reopened.get(&doc.document_id).unwrap(), doc);
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn identical_retry_is_idempotent_but_changed_content_conflicts() {
        let root = test_root();
        let repo = DocumentRepository::open(&root).unwrap();
        let doc = sample();
        repo.put(&doc).unwrap();
        assert!(repo.put(&doc).is_ok());

        let mut changed = doc.clone();
        changed.payload = json!({"value": 8});
        assert!(matches!(repo.put(&changed), Err(StorageError::Conflict(_))));
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn reports_missing_document() {
        let root = test_root();
        let repo = DocumentRepository::open(&root).unwrap();
        assert!(matches!(
            repo.get("cin:missing"),
            Err(StorageError::NotFound(_))
        ));
        let _ = fs::remove_dir_all(root);
    }
}
