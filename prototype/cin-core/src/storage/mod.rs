//! Local document storage and transaction services.
mod repository;
mod transactional;

pub use repository::StorageError;
pub use transactional::{
    CommitMarker, CommitReceipt, PreparedTransaction, RecoveryIssue, TransactionMetadata,
    TransactionRecoveryReport, TransactionStatus, TransactionalStore,
};
