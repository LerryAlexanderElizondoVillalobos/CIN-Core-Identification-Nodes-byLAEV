//! CIN domain foundation. This crate deliberately contains no UI, HTTP or persistence backend.
#![forbid(unsafe_code)]

pub mod documents;
pub mod error;
pub mod lifecycle;
pub mod storage;

pub use error::{CinError, CinResult};
pub use lifecycle::{LifecycleState, TransitionError};
