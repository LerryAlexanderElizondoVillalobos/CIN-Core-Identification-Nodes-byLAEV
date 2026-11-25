use std::fmt;

/// Shared result type for CIN domain services.
pub type CinResult<T> = Result<T, CinError>;

/// Typed errors that callers can preserve without turning failures into approvals.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CinError {
    InvalidInput(String),
    InvalidState(String),
    NotFound(String),
    Conflict(String),
    Unavailable(String),
    Integrity(String),
    Unauthorized(String),
    Storage(String),
}

impl fmt::Display for CinError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidInput(s) => write!(f, "invalid input: {s}"),
            Self::InvalidState(s) => write!(f, "invalid state: {s}"),
            Self::NotFound(s) => write!(f, "not found: {s}"),
            Self::Conflict(s) => write!(f, "conflict: {s}"),
            Self::Unavailable(s) => write!(f, "unavailable: {s}"),
            Self::Integrity(s) => write!(f, "integrity failure: {s}"),
            Self::Unauthorized(s) => write!(f, "unauthorized: {s}"),
            Self::Storage(s) => write!(f, "storage failure: {s}"),
        }
    }
}

impl std::error::Error for CinError {}
