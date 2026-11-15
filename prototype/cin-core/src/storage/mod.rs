//! Local JSON document repository with atomic replacement and recovery-friendly writes.
mod repository;

pub use repository::{DocumentRepository, StorageError};
