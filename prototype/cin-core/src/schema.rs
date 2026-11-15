//! JSON Schema validation for versioned CIN contracts.
use jsonschema::{Draft, Validator};
use serde_json::Value;
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SchemaIssue {
    pub instance_path: String,
    pub message: String,
}

impl fmt::Display for SchemaIssue {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {}", self.instance_path, self.message)
    }
}

#[derive(Debug)]
pub enum SchemaError {
    InvalidSchema(String),
}

impl fmt::Display for SchemaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidSchema(s) => write!(f, "invalid JSON Schema: {s}"),
        }
    }
}

impl std::error::Error for SchemaError {}

/// Compiled validator. Schema construction is explicit and reusable.
pub struct SchemaValidator {
    validator: Validator,
}

impl SchemaValidator {
    pub fn from_value(schema: &Value) -> Result<Self, SchemaError> {
        let validator = jsonschema::options()
            .with_draft(Draft::Draft202012)
            .build(schema)
            .map_err(|e| SchemaError::InvalidSchema(e.to_string()))?;
        Ok(Self { validator })
    }

    pub fn validate(&self, instance: &Value) -> Vec<SchemaIssue> {
        self.validator
            .iter_errors(instance)
            .map(|error| SchemaIssue {
                instance_path: error.instance_path.to_string(),
                message: error.to_string(),
            })
            .collect()
    }

    pub fn is_valid(&self, instance: &Value) -> bool {
        self.validator.is_valid(instance)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn schema() -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "required": ["id"],
            "properties": {"id": {"type": "string"}}
        })
    }

    #[test]
    fn accepts_valid_instance() {
        assert!(SchemaValidator::from_value(&schema())
            .unwrap()
            .is_valid(&json!({"id": "cin:1"})));
    }

    #[test]
    fn reports_invalid_instance() {
        let validator = SchemaValidator::from_value(&schema()).unwrap();
        let errors = validator.validate(&json!({"other": true}));
        assert!(!errors.is_empty());
        assert!(errors.iter().any(|error| error.message.contains("id")));
    }

    #[test]
    fn rejects_invalid_schema() {
        assert!(SchemaValidator::from_value(&json!({"type": "not-a-type"})).is_err());
    }
}
