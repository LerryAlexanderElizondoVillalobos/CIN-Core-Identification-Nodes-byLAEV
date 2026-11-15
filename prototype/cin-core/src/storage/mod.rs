//! Authoritative local storage API. Raw document-file access is internal;
//! consumers must use TransactionalStore so uncommitted bytes are never exposed.
mod repository;
mod transactional;

pub use repository::StorageError;
pub use transactional::{
    CommitMarker, CommitReceipt, PreparedTransaction, RecoveryIssue, TransactionMetadata,
    TransactionRecoveryReport, TransactionStatus, TransactionalStore,
};
