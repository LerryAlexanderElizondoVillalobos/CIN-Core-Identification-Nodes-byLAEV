use super::DocumentEnvelope;
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DocumentValidationError {
    EmptyField(&'static str),
    InvalidTimestamp,
    DuplicateReference(String),
    EmptyReferenceField,
}

impl fmt::Display for DocumentValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::EmptyField(field) => write!(f, "document field {field} must not be empty"),
            Self::InvalidTimestamp => write!(f, "created_at must be an RFC3339 UTC timestamp ending in Z"),
            Self::DuplicateReference(id) => write!(f, "duplicate document reference: {id}"),
            Self::EmptyReferenceField => write!(f, "reference type and document id must not be empty"),
        }
    }
}
impl std::error::Error for DocumentValidationError {}

/// Structural validation only. Schema, signature, issuer trust and authorization
/// are deliberately separate verification stages.
pub fn validate_document(document: &DocumentEnvelope) -> Result<(), DocumentValidationError> {
    for (name, value) in [
        ("document_id", document.document_id.as_str()),
        ("document_type", document.document_type.as_str()),
        ("schema_version", document.schema_version.as_str()),
    ] {
        if value.trim().is_empty() {
            return Err(DocumentValidationError::EmptyField(name));
        }
    }

    // Initial strict UTC shape check. Full RFC3339/calendar validation belongs
    // to the time/contract layer and will replace this guard.
    let timestamp = document.created_at.as_str();
    if timestamp.len() < 20
        || !timestamp.ends_with('Z')
        || !timestamp.contains('T')
        || !timestamp.contains('-')
        || !timestamp.contains(':')
    {
        return Err(DocumentValidationError::InvalidTimestamp);
    }

    let mut seen = std::collections::HashSet::new();
    for reference in &document.references {
        if reference.reference_type.trim().is_empty() || reference.document_id.trim().is_empty() {
            return Err(DocumentValidationError::EmptyReferenceField);
        }
        if !seen.insert(reference.document_id.as_str()) {
            return Err(DocumentValidationError::DuplicateReference(reference.document_id.clone()));
        }
    }
    if let Some(issuer) = &document.issuer {
        if issuer.issuer_id.trim().is_empty() {
            return Err(DocumentValidationError::EmptyField("issuer.issuer_id"));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn sample() -> DocumentEnvelope {
        DocumentEnvelope::new(
            "cin:document:test-001",
            "cin.test",
            "1.0.0",
            "2026-11-15T12:00:00Z",
            json!({"sample": true}),
        )
    }

    #[test]
    fn accepts_a_structurally_valid_document() {
        assert!(validate_document(&sample()).is_ok());
    }

    #[test]
    fn rejects_empty_document_type() {
        let mut doc = sample();
        doc.document_type.clear();
        assert_eq!(validate_document(&doc), Err(DocumentValidationError::EmptyField("document_type")));
    }

    #[test]
    fn rejects_duplicate_references() {
        let mut doc = sample();
        doc.references = vec![
            super::super::DocumentReference { reference_type: "birth".into(), document_id: "cin:birth:1".into() },
            super::super::DocumentReference { reference_type: "profile".into(), document_id: "cin:birth:1".into() },
        ];
        assert_eq!(validate_document(&doc), Err(DocumentValidationError::DuplicateReference("cin:birth:1".into())));
    }
}
