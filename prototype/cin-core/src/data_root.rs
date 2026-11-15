//! Resolve a user data directory independently from the application/package directory.
use std::{env, ffi::OsString, fmt, path::PathBuf};

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
        Self::resolve_with(explicit, &|key| env::var_os(key))
    }

    fn resolve_with<F>(explicit: Option<PathBuf>, get_env: &F) -> Result<Self, DataRootError>
    where
        F: Fn(&str) -> Option<OsString>,
    {
        if let Some(path) = explicit {
            return Ok(Self {
                path,
                source: DataRootSource::Explicit,
            });
        }
        if let Some(path) = get_env(DATA_DIR_ENV).filter(|value| !value.is_empty()) {
            return Ok(Self {
                path: path.into(),
                source: DataRootSource::Environment,
            });
        }
        Ok(Self {
            path: platform_default_with(get_env).ok_or(DataRootError::NoPlatformDataDirectory)?,
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

fn platform_default_with<F>(get_env: &F) -> Option<PathBuf>
where
    F: Fn(&str) -> Option<OsString>,
{
    #[cfg(target_os = "windows")]
    {
        return get_env("APPDATA")
            .map(PathBuf::from)
            .map(|path| path.join(APP_DATA_NAME));
    }
    #[cfg(target_os = "macos")]
    {
        return get_env("HOME").map(PathBuf::from).map(|path| {
            path.join("Library")
                .join("Application Support")
                .join(APP_DATA_NAME)
        });
    }
    #[cfg(all(unix, not(target_os = "macos")))]
    {
        if let Some(xdg) = get_env("XDG_DATA_HOME").filter(|value| !value.is_empty()) {
            return Some(PathBuf::from(xdg).join(APP_DATA_NAME));
        }
        return get_env("HOME")
            .map(PathBuf::from)
            .map(|path| path.join(".local").join("share").join(APP_DATA_NAME));
    }
    #[allow(unreachable_code)]
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    fn env_value(key: &str, values: &[(&str, &str)]) -> Option<OsString> {
        values
            .iter()
            .find(|(name, _)| *name == key)
            .map(|(_, value)| OsString::from(value))
    }

    #[test]
    fn explicit_root_has_highest_precedence() {
        let explicit = PathBuf::from("/cin/explicit");
        let root = DataRoot::resolve_with(Some(explicit.clone()), &|key| {
            env_value(key, &[(DATA_DIR_ENV, "/cin/environment")])
        })
        .unwrap();

        assert_eq!(root.path(), &explicit);
        assert_eq!(root.source(), &DataRootSource::Explicit);
    }

    #[test]
    fn cin_data_dir_overrides_platform_default() {
        let root = DataRoot::resolve_with(None, &|key| {
            env_value(
                key,
                &[
                    (DATA_DIR_ENV, "/cin/environment"),
                    ("HOME", "/home/test"),
                    ("XDG_DATA_HOME", "/home/test/.local/share"),
                    ("APPDATA", "C:/Users/test/AppData/Roaming"),
                ],
            )
        })
        .unwrap();

        assert_eq!(root.path(), &PathBuf::from("/cin/environment"));
        assert_eq!(root.source(), &DataRootSource::Environment);
    }

    #[cfg(all(unix, not(target_os = "macos")))]
    #[test]
    fn xdg_data_home_is_the_linux_platform_default() {
        let root = DataRoot::resolve_with(None, &|key| {
            env_value(
                key,
                &[("XDG_DATA_HOME", "/home/test/data"), ("HOME", "/home/test")],
            )
        })
        .unwrap();

        assert_eq!(root.path(), &PathBuf::from("/home/test/data/CIN"));
        assert_eq!(root.source(), &DataRootSource::PlatformDefault);
    }

    #[cfg(all(unix, not(target_os = "macos")))]
    #[test]
    fn home_local_share_is_the_linux_fallback() {
        let root =
            DataRoot::resolve_with(None, &|key| env_value(key, &[("HOME", "/home/test")])).unwrap();

        assert_eq!(root.path(), &PathBuf::from("/home/test/.local/share/CIN"));
        assert_eq!(root.source(), &DataRootSource::PlatformDefault);
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn home_application_support_is_the_macos_default() {
        let root = DataRoot::resolve_with(None, &|key| env_value(key, &[("HOME", "/Users/test")]))
            .unwrap();

        assert_eq!(
            root.path(),
            &PathBuf::from("/Users/test/Library/Application Support/CIN")
        );
        assert_eq!(root.source(), &DataRootSource::PlatformDefault);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn appdata_is_the_windows_default() {
        let root = DataRoot::resolve_with(None, &|key| {
            env_value(key, &[("APPDATA", "C:/Users/test/AppData/Roaming")])
        })
        .unwrap();

        assert_eq!(
            root.path(),
            &PathBuf::from("C:/Users/test/AppData/Roaming/CIN")
        );
        assert_eq!(root.source(), &DataRootSource::PlatformDefault);
    }

    #[test]
    fn missing_platform_environment_returns_explicit_error() {
        let result = DataRoot::resolve_with(None, &|_| None);
        assert_eq!(result, Err(DataRootError::NoPlatformDataDirectory));
    }
}
