use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BrowserLaunch {
    Chromium(PathBuf),
    SystemDefault(PathBuf),
    Manual,
}

fn is_executable(path: &Path) -> bool {
    let Ok(metadata) = path.metadata() else { return false; };
    if !metadata.is_file() { return false; }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        metadata.permissions().mode() & 0o111 != 0
    }
    #[cfg(not(unix))]
    { true }
}

fn find_executable(name: &str, path_value: Option<&std::ffi::OsStr>) -> Option<PathBuf> {
    let candidate = Path::new(name);
    if candidate.components().count() > 1 {
        return is_executable(candidate).then(|| candidate.to_path_buf());
    }
    let paths = env::split_paths(path_value?);
    paths.map(|directory| directory.join(name)).find(|path| is_executable(path))
}

fn chromium_executable() -> Option<PathBuf> {
    if let Some(configured) = env::var_os("CIN_BROWSER") {
        let value = configured.to_string_lossy();
        if let Some(path) = find_executable(&value, env::var_os("PATH").as_deref()) {
            return Some(path);
        }
    }
    let path = env::var_os("PATH");
    ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]
        .iter()
        .find_map(|name| find_executable(name, path.as_deref()))
}

pub fn launch(url: &str) -> BrowserLaunch {
    if env::var("CIN_NO_BROWSER").as_deref() == Ok("1") {
        return BrowserLaunch::Manual;
    }
    if let Some(executable) = chromium_executable() {
        if Command::new(&executable).arg("--new-window").arg(url)
            .stdout(Stdio::null()).stderr(Stdio::null()).spawn().is_ok() {
            return BrowserLaunch::Chromium(executable);
        }
    }
    if let Some(opener) = find_executable("xdg-open", env::var_os("PATH").as_deref()) {
        if Command::new(&opener).arg(url)
            .stdout(Stdio::null()).stderr(Stdio::null()).spawn().is_ok() {
            return BrowserLaunch::SystemDefault(opener);
        }
    }
    BrowserLaunch::Manual
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs, time::{SystemTime, UNIX_EPOCH}};

    #[cfg(unix)]
    #[test]
    fn resolves_chromium_from_path_in_preferred_order() {
        use std::os::unix::fs::PermissionsExt;
        let root = env::temp_dir().join(format!("cin-browser-{}", SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos()));
        fs::create_dir_all(&root).unwrap();
        for name in ["chromium", "google-chrome"] {
            let file = root.join(name);
            fs::write(&file, "#!/bin/sh\nexit 0\n").unwrap();
            fs::set_permissions(&file, fs::Permissions::from_mode(0o755)).unwrap();
        }
        let resolved = find_executable("chromium", Some(root.as_os_str()));
        assert_eq!(resolved, Some(root.join("chromium")));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn rejects_missing_browser_executable() {
        assert_eq!(find_executable("cin-no-such-browser", Some(std::ffi::OsStr::new(""))), None);
    }
}
