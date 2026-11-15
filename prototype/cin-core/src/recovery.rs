//! Non-destructive storage inspection and recovery report.
use crate::{
    documents::{validate_document, DocumentEnvelope},
    storage::{DocumentRepository, StorageError},
};
use std::{fs, path::PathBuf};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RecoveryIssueKind {
    OrphanTemporary,
    InvalidJson,
    InvalidEnvelope,
    FilenameIdMismatch,
    Unreadable,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RecoveryIssue {
    pub path: PathBuf,
    pub kind: RecoveryIssueKind,
    pub detail: String,
}

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct RecoveryReport {
    pub inspected: usize,
    pub valid: usize,
    pub issues: Vec<RecoveryIssue>,
}

impl RecoveryReport {
    pub fn is_clean(&self) -> bool {
        self.issues.is_empty()
    }
}

/// Inspection only: never deletes, rewrites, or silently quarantines user records.
pub fn inspect_storage(repo: &DocumentRepository) -> Result<RecoveryReport, StorageError> {
    let entries = fs::read_dir(repo.root().join("documents"))
        .map_err(|error| StorageError::Io(error.to_string()))?;
    let mut report = RecoveryReport::default();

    for entry in entries {
        let entry = entry.map_err(|error| StorageError::Io(error.to_string()))?;
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("");
        if name.contains(".tmp-") {
            report.issues.push(RecoveryIssue {
                path,
                kind: RecoveryIssueKind::OrphanTemporary,
                detail: "temporary file left by interrupted write".into(),
            });
            continue;
        }
        if path.extension().and_then(|extension| extension.to_str()) != Some("json") {
            continue;
        }
        report.inspected += 1;

        let bytes = match fs::read(&path) {
            Ok(bytes) => bytes,
            Err(error) => {
                report.issues.push(RecoveryIssue {
                    path,
                    kind: RecoveryIssueKind::Unreadable,
                    detail: error.to_string(),
                });
                continue;
            }
        };
        let document: DocumentEnvelope = match serde_json::from_slice(&bytes) {
            Ok(document) => document,
            Err(error) => {
                report.issues.push(RecoveryIssue {
                    path,
                    kind: RecoveryIssueKind::InvalidJson,
                    detail: error.to_string(),
                });
                continue;
            }
        };
        if let Err(error) = validate_document(&document) {
            report.issues.push(RecoveryIssue {
                path,
                kind: RecoveryIssueKind::InvalidEnvelope,
                detail: error.to_string(),
            });
            continue;
        }

        if path != repo.document_path(&document.document_id) {
            report.issues.push(RecoveryIssue {
                path,
                kind: RecoveryIssueKind::FilenameIdMismatch,
                detail: "record filename does not match its document ID".into(),
            });
            continue;
        }

        match repo.get(&document.document_id) {
            Ok(readback) if readback == document => report.valid += 1,
            Ok(_) => report.issues.push(RecoveryIssue {
                path,
                kind: RecoveryIssueKind::InvalidEnvelope,
                detail: "repository readback differs from scanned record".into(),
            }),
            Err(error) => report.issues.push(RecoveryIssue {
                path,
                kind: RecoveryIssueKind::Unreadable,
                detail: error.to_string(),
            }),
        }
    }
    Ok(report)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn root() -> PathBuf {
        std::env::temp_dir().join(format!(
            "cin-recovery-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ))
    }

    fn document() -> DocumentEnvelope {
        DocumentEnvelope::new(
            "cin:recovery:1",
            "cin.test",
            "1.0.0",
            "2026-11-15T12:00:00Z",
            json!({"ok": true}),
        )
    }

    #[test]
    fn reports_clean_store_after_reopen() {
        let path = root();
        let repository = DocumentRepository::open(&path).unwrap();
        repository.put(&document()).unwrap();
        let report = inspect_storage(&repository).unwrap();
        assert_eq!(report.valid, 1);
        assert!(report.is_clean());
        drop(repository);

        let reopened = DocumentRepository::open(&path).unwrap();
        assert_eq!(inspect_storage(&reopened).unwrap().valid, 1);
        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn detects_corruption_and_temp_without_mutating() {
        let path = root();
        let repository = DocumentRepository::open(&path).unwrap();
        let documents = path.join("documents");
        fs::write(documents.join("bad.json"), b"{not json").unwrap();
        fs::write(documents.join("interrupted.tmp-1"), b"partial").unwrap();

        let report = inspect_storage(&repository).unwrap();
        assert_eq!(report.issues.len(), 2);
        assert!(documents.join("bad.json").exists());
        assert!(documents.join("interrupted.tmp-1").exists());
        let _ = fs::remove_dir_all(path);
    }

    #[test]
    fn detects_filename_id_mismatch_without_mutating() {
        let path = root();
        let repository = DocumentRepository::open(&path).unwrap();
        let document = document();
        repository.put(&document).unwrap();

        let canonical = repository.document_path(&document.document_id);
        let misplaced = path.join("documents").join("misplaced.json");
        fs::rename(&canonical, &misplaced).unwrap();

        let report = inspect_storage(&repository).unwrap();
        assert_eq!(report.valid, 0);
        assert_eq!(report.issues.len(), 1);
        assert_eq!(report.issues[0].kind, RecoveryIssueKind::FilenameIdMismatch);
        assert!(misplaced.exists());
        assert!(!canonical.exists());
        let _ = fs::remove_dir_all(path);
    }
}
