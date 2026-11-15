use std::{env, fs, path::PathBuf, time::{SystemTime, UNIX_EPOCH}};

fn data_root() -> Result<PathBuf, String> {
    if let Ok(value) = env::var("CIN_DATA_ROOT") {
        if !value.trim().is_empty() { return Ok(PathBuf::from(value)); }
    }
    if let Ok(value) = env::var("XDG_DATA_HOME") {
        if !value.trim().is_empty() { return Ok(PathBuf::from(value).join("cin-prototype")); }
    }
    let home = env::var("HOME").map_err(|_| "HOME and CIN_DATA_ROOT are unavailable".to_string())?;
    Ok(PathBuf::from(home).join(".local/share/cin-prototype"))
}

#[tauri::command]
fn runtime_status() -> Result<String, String> {
    let root = data_root()?;
    Ok(format!("Linux prototype runtime ready\nData root: {}", root.display()))
}

#[tauri::command]
fn write_persistence_probe() -> Result<String, String> {
    let root = data_root()?;
    fs::create_dir_all(&root).map_err(|e| e.to_string())?;
    let stamp = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_secs();
    let payload = format!("CIN_LOCAL_PERSISTENCE_PROBE_V1\nwritten_at_unix={stamp}\n");
    let target = root.join("runtime-probe.record");
    let staged = root.join("runtime-probe.record.pending");
    fs::write(&staged, payload.as_bytes()).map_err(|e| e.to_string())?;
    let read_back = fs::read(&staged).map_err(|e| e.to_string())?;
    if read_back != payload.as_bytes() { return Err("staged record read-back mismatch".into()); }
    fs::rename(&staged, &target).map_err(|e| e.to_string())?;
    Ok(format!("Probe committed and read-back verified at {}", target.display()))
}

#[tauri::command]
fn read_persistence_probe() -> Result<String, String> {
    fs::read_to_string(data_root()?.join("runtime-probe.record")).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![runtime_status, write_persistence_probe, read_persistence_probe])
        .run(tauri::generate_context!())
        .expect("error while running CIN Linux prototype");
}

#[cfg(test)]
mod tests {
    use std::{fs, path::PathBuf, process, time::{SystemTime, UNIX_EPOCH}};
    fn test_root() -> PathBuf {
        let nonce = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
        std::env::temp_dir().join(format!("cin-prototype-{}-{nonce}", process::id()))
    }
    #[test]
    fn record_is_readable_after_a_new_file_read() {
        let root = test_root();
        fs::create_dir_all(&root).unwrap();
        let record = root.join("runtime-probe.record");
        let staged = root.join("runtime-probe.record.pending");
        let content = b"CIN_LOCAL_PERSISTENCE_PROBE_V1\n";
        fs::write(&staged, content).unwrap();
        assert_eq!(fs::read(&staged).unwrap(), content);
        fs::rename(&staged, &record).unwrap();
        assert_eq!(fs::read(&record).unwrap(), content);
        fs::remove_dir_all(root).unwrap();
    }
}
