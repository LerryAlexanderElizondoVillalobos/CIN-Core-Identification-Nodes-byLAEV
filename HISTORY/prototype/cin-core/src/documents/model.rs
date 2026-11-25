use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Issuer reference. Trust and authorization are checked by their own engines.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DocumentIssuer {
    pub issuer_id: String,
}

/// Reference to another durable CIN record.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DocumentReference {
    pub reference_type: String,
    pub document_id: String,
}

/// Common serializable document envelope. Cryptographic proof fields are added
/// by the certificate/proof layer; payload semantics belong to domain schemas.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DocumentEnvelope {
    pub document_id: String,
    pub document_type: String,
    pub schema_version: String,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub issuer: Option<DocumentIssuer>,
    pub references: Vec<DocumentReference>,
    pub payload: Value,
}

impl DocumentEnvelope {
    pub fn new(
        document_id: impl Into<String>,
        document_type: impl Into<String>,
        schema_version: impl Into<String>,
        created_at: impl Into<String>,
        payload: Value,
    ) -> Self {
        Self {
            document_id: document_id.into(),
            document_type: document_type.into(),
            schema_version: schema_version.into(),
            created_at: created_at.into(),
            issuer: None,
            references: Vec::new(),
            payload,
        }
    }
}
