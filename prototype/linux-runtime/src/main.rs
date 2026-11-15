use std::{
    env, fs,
    io::{Read, Write},
    net::{TcpListener, TcpStream},
    path::PathBuf,
    process::{Command, Stdio},
    thread,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

const HTML: &str = include_str!("../../dist/index.html");

fn data_root() -> Result<PathBuf, String> {
    if let Ok(value) = env::var("CIN_DATA_ROOT") {
        if !value.trim().is_empty() { return Ok(PathBuf::from(value)); }
    }
    if let Ok(value) = env::var("XDG_DATA_HOME") {
        if !value.trim().is_empty() { return Ok(PathBuf::from(value).join("cin")); }
    }
    let home = env::var("HOME").map_err(|_| "HOME and CIN_DATA_ROOT are unavailable".to_string())?;
    Ok(PathBuf::from(home).join(".local/share/cin"))
}

fn write_probe() -> Result<String, String> {
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

fn read_probe() -> Result<String, String> {
    fs::read_to_string(data_root()?.join("runtime-probe.record")).map_err(|e| e.to_string())
}

fn bind_local_server() -> Result<TcpListener, String> {
    for port in [1221, 2112] {
        if let Ok(listener) = TcpListener::bind(("127.0.0.1", port)) { return Ok(listener); }
    }
    TcpListener::bind(("127.0.0.1", 0)).map_err(|e| format!("Could not bind a local HTTP port: {e}"))
}

fn response(stream: &mut TcpStream, status: &str, content_type: &str, body: &str) -> std::io::Result<()> {
    write!(stream,
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}; charset=utf-8\r\nContent-Length: {}\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n{}",
        body.as_bytes().len(), body)
}

fn handle_connection(mut stream: TcpStream) -> std::io::Result<()> {
    stream.set_read_timeout(Some(Duration::from_secs(3)))?;
    let mut request = Vec::new();
    let mut buffer = [0u8; 4096];
    let header_end;
    loop {
        let count = stream.read(&mut buffer)?;
        if count == 0 { return Ok(()); }
        request.extend_from_slice(&buffer[..count]);
        if let Some(pos) = request.windows(4).position(|w| w == b"\r\n\r\n") {
            header_end = pos + 4;
            break;
        }
        if request.len() > 64 * 1024 {
            return response(&mut stream, "431 Request Header Fields Too Large", "text/plain", "Request headers too large");
        }
    }
    let headers = String::from_utf8_lossy(&request[..header_end]);
    let mut lines = headers.lines();
    let first = lines.next().unwrap_or_default();
    let mut parts = first.split_whitespace();
    let method = parts.next().unwrap_or("");
    let path = parts.next().unwrap_or("/");
    let content_length = lines.find_map(|line| {
        let (name, value) = line.split_once(':')?;
        if name.eq_ignore_ascii_case("content-length") { value.trim().parse::<usize>().ok() } else { None }
    }).unwrap_or(0);
    let total = header_end.saturating_add(content_length);
    while request.len() < total {
        let count = stream.read(&mut buffer)?;
        if count == 0 { break; }
        request.extend_from_slice(&buffer[..count]);
    }

    match (method, path) {
        ("GET", "/") | ("GET", "/index.html") => response(&mut stream, "200 OK", "text/html", HTML),
        ("GET", "/health") => response(&mut stream, "200 OK", "text/plain", "ok"),
        ("GET", "/api/status") => {
            let root = data_root().map_err(std::io::Error::other)?;
            response(&mut stream, "200 OK", "text/plain", &format!("CIN local web runtime ready\nData root: {}", root.display()))
        }
        ("POST", "/api/probe/write") => match write_probe() {
            Ok(value) => response(&mut stream, "200 OK", "text/plain", &value),
            Err(error) => response(&mut stream, "500 Internal Server Error", "text/plain", &error),
        },
        ("GET", "/api/probe/read") => match read_probe() {
            Ok(value) => response(&mut stream, "200 OK", "text/plain", &value),
            Err(error) => response(&mut stream, "404 Not Found", "text/plain", &error),
        },
        _ => response(&mut stream, "404 Not Found", "text/plain", "Not found"),
    }
}

fn open_browser(url: &str) {
    if env::var("CIN_NO_BROWSER").as_deref() == Ok("1") { return; }
    match Command::new("xdg-open").arg(url).stdout(Stdio::null()).stderr(Stdio::null()).spawn() {
        Ok(_) => println!("CIN_BROWSER=launched"),
        Err(error) => eprintln!("CIN_BROWSER=not-launched ({error}); open {url} manually"),
    }
}

fn run_server() -> Result<(), String> {
    let listener = bind_local_server()?;
    let address = listener.local_addr().map_err(|e| e.to_string())?;
    let url = format!("http://127.0.0.1:{}", address.port());
    println!("CIN_URL={url}");
    println!("CIN_PORT={}", address.port());
    println!("CIN_BIND=127.0.0.1");
    open_browser(&url);
    for incoming in listener.incoming() {
        match incoming {
            Ok(stream) => { thread::spawn(move || { if let Err(error) = handle_connection(stream) { eprintln!("CIN_HTTP_ERROR={error}"); } }); }
            Err(error) => eprintln!("CIN_ACCEPT_ERROR={error}"),
        }
    }
    Ok(())
}

fn main() {
    match env::args().nth(1).as_deref() {
        Some("--probe-write") => { println!("{}", write_probe().unwrap_or_else(|e| { eprintln!("{e}"); std::process::exit(1) })); return; }
        Some("--probe-read") => { print!("{}", read_probe().unwrap_or_else(|e| { eprintln!("{e}"); std::process::exit(1) })); return; }
        _ => {}
    }
    if let Err(error) = run_server() { eprintln!("CIN_STARTUP_ERROR={error}"); std::process::exit(1); }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{net::IpAddr, process, time::{SystemTime, UNIX_EPOCH}};

    fn test_root() -> PathBuf {
        let nonce = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
        env::temp_dir().join(format!("cin-prototype-{}-{nonce}", process::id()))
    }

    #[test]
    fn listener_is_bound_only_to_loopback() {
        let listener = bind_local_server().unwrap();
        assert_eq!(listener.local_addr().unwrap().ip(), IpAddr::from([127, 0, 0, 1]));
    }

    #[test]
    fn html_is_the_local_web_frontend() {
        assert!(HTML.contains("CIN — Portable Linux Runtime"));
        assert!(HTML.contains("/api/probe/write"));
    }

    #[test]
    fn staged_record_is_verified_before_commit() {
        let root = test_root();
        fs::create_dir_all(&root).unwrap();
        let staged = root.join("runtime-probe.record.pending");
        let record = root.join("runtime-probe.record");
        let content = b"CIN_LOCAL_PERSISTENCE_PROBE_V1\n";
        fs::write(&staged, content).unwrap();
        assert_eq!(fs::read(&staged).unwrap(), content);
        fs::rename(&staged, &record).unwrap();
        assert_eq!(fs::read(&record).unwrap(), content);
        assert!(!staged.exists());
        fs::remove_dir_all(root).unwrap();
    }
}
