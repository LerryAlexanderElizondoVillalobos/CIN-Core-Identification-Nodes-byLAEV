//! Resolve a user data directory independently from the application/package directory.
use std::{env, fmt, path::PathBuf};

pub const DATA_DIR_ENV: &str = "CIN_DATA_DIR";
pub const APP_DATA_NAME: &str = "CIN";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DataRoot {
    path: PathBuf,
    source: DataRootSource,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DataRootSource {
    Explicit,
    Environment,
    PlatformDefault,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DataRootError {
    NoPlatformDataDirectory,
}

impl fmt::Display for DataRootError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NoPlatformDataDirectory => write!(
                f,
                "cannot resolve platform user data directory; set CIN_DATA_DIR"
            ),
        }
    }
}

impl std::error::Error for DataRootError {}

impl DataRoot {
    /// Priority: explicit config > CIN_DATA_DIR > platform user-data directory.
    pub fn resolve(explicit: Option<PathBuf>) -> Result<Self, DataRootError> {
        if let Some(path) = explicit {
            return Ok(Self {
                path,
                source: DataRootSource::Explicit,
            });
        }
        if let Some(path) = env::var_os(DATA_DIR_ENV).filter(|value| !value.is_empty()) {
            return Ok(Self {
                path: path.into(),
                source: DataRootSource::Environment,
            });
        }
        Ok(Self {
            path: platform_default().ok_or(DataRootError::NoPlatformDataDirectory)?,
            source: DataRootSource::PlatformDefault,
        })
    }

    pub fn path(&self) -> &PathBuf {
        &self.path
    }

    pub fn source(&self) -> &DataRootSource {
        &self.source
    }
}

fn platform_default() -> Option<PathBuf> {
    #[cfg(target_os = "windows")]
    {
        return env::var_os("APPDATA")
            .map(PathBuf::from)
            .map(|path| path.join(APP_DATA_NAME));
    }
    #[cfg(target_os = "macos")]
    {
        return env::var_os("HOME").map(PathBuf::from).map(|path| {
            path.join("Library")
                .join("Application Support")
                .join(APP_DATA_NAME)
        });
    }
    #[cfg(all(unix, not(target_os = "macos")))]
    {
        if let Some(xdg) = env::var_os("XDG_DATA_HOME").filter(|value| !value.is_empty()) {
            return Some(PathBuf::from(xdg).join(APP_DATA_NAME));
        }
        return env::var_os("HOME")
            .map(PathBuf::from)
            .map(|path| path.join(".local").join("share").join(APP_DATA_NAME));
    }
    #[allow(unreachable_code)]
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn explicit_root_wins() {
        let path = PathBuf::from("/tmp/cin-data-root-test");
        let root = DataRoot::resolve(Some(path.clone())).unwrap();
        assert_eq!(root.path(), &path);
        assert_eq!(root.source(), &DataRootSource::Explicit);
    }
}
