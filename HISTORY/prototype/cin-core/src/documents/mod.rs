//! Common document envelope and structural validation.
mod model;
mod validation;

pub use model::{DocumentEnvelope, DocumentIssuer, DocumentReference};
pub use validation::{validate_document, DocumentValidationError};
