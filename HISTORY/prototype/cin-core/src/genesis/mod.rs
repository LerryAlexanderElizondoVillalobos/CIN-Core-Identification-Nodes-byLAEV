//! Pre-birth environment audit and Genesis Manifest generation.
mod environment;
pub use environment::{
    audit_current_environment, build_genesis_manifest, register_genesis_manifest, AuditField,
    GenesisAudit, GenesisError, GENESIS_DOCUMENT_ID, GENESIS_DOCUMENT_TYPE, GENESIS_SCHEMA_VERSION,
};
