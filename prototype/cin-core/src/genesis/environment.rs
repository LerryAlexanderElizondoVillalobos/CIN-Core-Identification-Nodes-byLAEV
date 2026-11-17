//! Pre-birth environment audit and Genesis Environment Manifest builder.
//!
//! The audit is purpose-limited: it records technical capabilities and the CIN
//! package inventory, not arbitrary process environment or user-file contents.
use crate::{
    documents::DocumentEnvelope,
    storage::{CommitReceipt, StorageError, TransactionalStore},
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::BTreeMap,
    fs,
    io::Read,
    path::Path,
    time::{SystemTime, UNIX_EPOCH},
};

pub const GENESIS_DOCUMENT_ID: &str = "cin:genesis:initial";
pub const GENESIS_DOCUMENT_TYPE: &str = "cin.genesis-environment-manifest";
pub const GENESIS_SCHEMA_VERSION: &str = "1.0.0";

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AuditField {
    pub value: Option<Value>,
    pub source: String,
    pub method: String,
    pub observed_at: String,
    pub status: String,
    pub sensitivity: String,
    pub limitation: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GenesisAudit {
    pub captured_at: String,
    pub fields: BTreeMap<String, AuditField>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum GenesisError {
    InvalidTimestamp,
    InvalidDocument(String),
}

impl std::fmt::Display for GenesisError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidTimestamp => write!(f, "timestamp is not a supported UTC RFC3339 value"),
            Self::InvalidDocument(message) => write!(f, "invalid Genesis Manifest: {message}"),
        }
    }
}
impl std::error::Error for GenesisError {}

/// Collects only purpose-limited technical metadata. A supplied package root
/// should be the extracted CIN distribution directory. If omitted, the
/// executable's parent directory is used as the inventory root.
pub fn audit_current_environment(package_root: Option<&Path>) -> GenesisAudit {
    let captured_at = now_rfc3339();
    let mut fields = BTreeMap::new();

    insert_observed(
        &mut fields,
        "execution.os.family",
        json!(std::env::consts::FAMILY),
        "rust-std",
        "std::env::consts::FAMILY",
        &captured_at,
        "public",
    );
    insert_observed(
        &mut fields,
        "execution.os.name",
        json!(std::env::consts::OS),
        "rust-std",
        "std::env::consts::OS",
        &captured_at,
        "public",
    );
    insert_observed(
        &mut fields,
        "execution.architecture",
        json!(std::env::consts::ARCH),
        "rust-std",
        "std::env::consts::ARCH",
        &captured_at,
        "public",
    );
    insert_observed(
        &mut fields,
        "execution.pointer_width",
        json!(usize::BITS),
        "rust-std",
        "usize::BITS",
        &captured_at,
        "public",
    );
    let executable_name = std::env::current_exe().ok().and_then(|path| {
        path.file_name()
            .map(|name| json!(name.to_string_lossy().to_string()))
    });
    insert_field(
        &mut fields,
        "execution.executable_name",
        executable_name,
        "operating-system",
        "current_exe filename only; absolute path excluded",
        &captured_at,
        "internal",
    );
    insert_observed(
        &mut fields,
        "execution.current_directory_available",
        json!(std::env::current_dir().is_ok()),
        "operating-system",
        "current_dir availability check; path excluded",
        &captured_at,
        "public",
    );

    let os_version = os_version();
    insert_field(
        &mut fields,
        "execution.os.version",
        os_version,
        "operating-system",
        "platform release metadata",
        &captured_at,
        "public",
    );
    for key in ["LANG", "LC_ALL", "LC_MESSAGES", "TZ"] {
        let field = format!("execution.configuration.{}", key.to_ascii_lowercase());
        match std::env::var(key).ok().filter(|v| !v.is_empty()) {
            Some(value) => {
                let safe_value =
                    if key == "TZ" && (value.starts_with('/') || value.contains(":\\\\")) {
                        "custom-timezone-file-configured".to_owned()
                    } else {
                        value
                    };
                insert_observed(
                    &mut fields,
                    &field,
                    json!(safe_value),
                    "process-environment",
                    "explicit allowlist lookup; absolute timezone paths redacted",
                    &captured_at,
                    "internal",
                );
            }
            None => insert_unavailable(
                &mut fields,
                &field,
                "process-environment",
                "explicit allowlist lookup",
                &captured_at,
                "internal",
                "not set or not exposed",
            ),
        }
    }

    match std::thread::available_parallelism() {
        Ok(count) => insert_observed(
            &mut fields,
            "hardware.logical_cpu_count",
            json!(count.get()),
            "operating-system",
            "std::thread::available_parallelism",
            &captured_at,
            "public",
        ),
        Err(error) => insert_unavailable(
            &mut fields,
            "hardware.logical_cpu_count",
            "operating-system",
            "std::thread::available_parallelism",
            &captured_at,
            "public",
            &error.to_string(),
        ),
    }
    let memory = total_memory_bytes();
    insert_field(
        &mut fields,
        "hardware.memory_total_bytes",
        memory,
        "operating-system",
        "platform memory metadata",
        &captured_at,
        "public",
    );
    let cpu_model = cpu_model();
    insert_field(
        &mut fields,
        "hardware.cpu_model",
        cpu_model,
        "operating-system",
        "platform CPU metadata",
        &captured_at,
        "internal",
    );

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(Path::to_path_buf));
    let root = package_root.map(Path::to_path_buf).or(exe_dir);
    match root {
        Some(root) if root.is_dir() => {
            insert_observed(
                &mut fields,
                "package.inventory_root",
                json!("extracted-package-directory"),
                "CIN-runtime",
                "explicit package root or executable parent; absolute path omitted",
                &captured_at,
                "internal",
            );
            let (inventory, skipped_count) = package_inventory(&root);
            let file_count = inventory.len();
            insert_observed(
                &mut fields,
                "package.files",
                json!(inventory),
                "filesystem",
                "recursive inventory of regular files under package root; symlinks skipped",
                &captured_at,
                "internal",
            );
            insert_observed(
                &mut fields,
                "package.file_count",
                json!(file_count),
                "filesystem",
                "count of inventoried regular files",
                &captured_at,
                "public",
            );
            insert_observed(
                &mut fields,
                "package.inventory_skipped_entries",
                json!(skipped_count),
                "filesystem",
                "count of inaccessible or unsupported entries skipped during inventory",
                &captured_at,
                "internal",
            );
        }
        Some(_) => {
            insert_unavailable(
                &mut fields,
                "package.files",
                "filesystem",
                "package root inspection",
                &captured_at,
                "internal",
                "package root does not exist or is not a directory",
            );
        }
        None => {
            insert_unavailable(
                &mut fields,
                "package.files",
                "operating-system",
                "current_exe",
                &captured_at,
                "internal",
                "cannot resolve executable directory or supplied package root",
            );
        }
    }
    insert_unavailable(
        &mut fields,
        "package.archive_origin",
        "operator or package-verifier",
        "no archive provenance input was supplied",
        &captured_at,
        "internal",
        "the extracted process cannot infer which ZIP file was used or authenticate its origin",
    );
    insert_unavailable(
        &mut fields,
        "filesystem.type_and_free_capacity",
        "operating-system",
        "platform-specific filesystem query",
        &captured_at,
        "internal",
        "not implemented by the current portable standard-library adapter",
    );

    let interfaces = network_interfaces();
    match interfaces {
        Some(names) => insert_observed(
            &mut fields,
            "network.interface_names",
            json!(names),
            "operating-system",
            "interface-name enumeration; addresses and traffic excluded",
            &captured_at,
            "internal",
        ),
        None => insert_unavailable(
            &mut fields,
            "network.interface_names",
            "operating-system",
            "platform interface enumeration",
            &captured_at,
            "internal",
            "interface enumeration is not implemented on this platform",
        ),
    }
    insert_not_collected(
        &mut fields,
        "network.connectivity",
        "operating-system",
        "active connectivity probe",
        &captured_at,
        "public",
        "no connectivity probe was run; no external request is made by the audit",
    );
    insert_observed(
        &mut fields,
        "cryptography.digest_algorithms",
        json!(["sha-256"]),
        "CIN-build",
        "compiled cryptographic dependency inventory",
        &captured_at,
        "public",
    );
    insert_unavailable(
        &mut fields,
        "cryptography.signature_providers",
        "CIN-runtime",
        "provider discovery",
        &captured_at,
        "internal",
        "signature provider and external signer discovery are not implemented",
    );
    insert_not_collected(
        &mut fields,
        "trust_store.metadata",
        "operating-system",
        "authorized trust-store metadata inspection",
        &captured_at,
        "confidential",
        "not collected by this initial audit",
    );
    insert_not_collected(
        &mut fields,
        "peripherals.external_signers",
        "operating-system",
        "supported signer-interface discovery",
        &captured_at,
        "internal",
        "USB and external signer discovery are not implemented",
    );
    insert_observed(
        &mut fields,
        "storage.data_root_override_configured",
        json!(std::env::var_os("CIN_DATA_DIR").is_some()),
        "process-environment",
        "presence check only; path value excluded",
        &captured_at,
        "public",
    );
    insert_not_collected(
        &mut fields,
        "operator.declarations",
        "operator",
        "explicit operator input",
        &captured_at,
        "internal",
        "no node label, purpose or organization was supplied",
    );

    GenesisAudit {
        captured_at,
        fields,
    }
}

/// Builds a candidate document. It does not sign it, claim issuer trust, or
/// register it in storage. Registration is a separate transactional operation.
pub fn build_genesis_manifest(
    audit: &GenesisAudit,
    created_at: &str,
) -> Result<DocumentEnvelope, GenesisError> {
    if !is_utc_timestamp_shape(created_at) {
        return Err(GenesisError::InvalidTimestamp);
    }
    let document = DocumentEnvelope::new(
        GENESIS_DOCUMENT_ID,
        GENESIS_DOCUMENT_TYPE,
        GENESIS_SCHEMA_VERSION,
        created_at,
        json!({
            "manifest_profile": "cin.genesis-environment-manifest/1.0.0",
            "lifecycle_stage": "pre-birth",
            "capture_scope": "purpose-limited-technical-environment-and-extracted-cin-package",
            "audit": audit,
            "privacy": {
                "absolute_paths_collected": false,
                "arbitrary_environment_variables_collected": false,
                "user_file_contents_collected": false,
                "credentials_or_private_keys_collected": false,
                "network_payloads_collected": false
            },
            "limitations": [
                "This manifest describes observations available to this process at capture time.",
                "Unavailable and uncollected values are not negative assertions.",
                "Package archive origin is not established by inspecting an extracted directory.",
                "This document is not a Node Birth Record, personal registration, signature, or trust decision."
            ]
        }),
    );
    crate::documents::validate_document(&document)
        .map_err(|error| GenesisError::InvalidDocument(error.to_string()))?;
    Ok(document)
}

/// Registers the Genesis Manifest as the first logical CIN document.
/// Repeating the same committed operation is idempotent; a different existing
/// document prevents genesis registration.
pub fn register_genesis_manifest(
    store: &TransactionalStore,
    document: &DocumentEnvelope,
) -> Result<CommitReceipt, StorageError> {
    if document.document_id != GENESIS_DOCUMENT_ID
        || document.document_type != GENESIS_DOCUMENT_TYPE
    {
        return Err(StorageError::InvalidDocument(
            "first-record registration requires the Genesis Environment Manifest".into(),
        ));
    }

    const OPERATION_ID: &str = "cin-genesis-initial-registration";
    if store.has_records()? {
        match store.read_record(GENESIS_DOCUMENT_ID) {
            Ok(existing) if existing == *document => {
                store.prepare_record(OPERATION_ID, document)?;
                return store.commit_record(OPERATION_ID);
            }
            _ => {
                return Err(StorageError::Conflict(
                    "Genesis Manifest must be the first logical CIN record".into(),
                ))
            }
        }
    }

    store.prepare_record(OPERATION_ID, document)?;
    store.commit_record(OPERATION_ID)
}

fn insert_observed(
    fields: &mut BTreeMap<String, AuditField>,
    name: &str,
    value: Value,
    source: &str,
    method: &str,
    at: &str,
    sensitivity: &str,
) {
    insert_field(fields, name, Some(value), source, method, at, sensitivity);
}

fn insert_field(
    fields: &mut BTreeMap<String, AuditField>,
    name: &str,
    value: Option<Value>,
    source: &str,
    method: &str,
    at: &str,
    sensitivity: &str,
) {
    let (status, limitation) = if value.is_some() {
        ("observed", None)
    } else {
        (
            "unavailable",
            Some("the platform adapter did not expose this value".into()),
        )
    };
    fields.insert(
        name.into(),
        AuditField {
            value,
            source: source.into(),
            method: method.into(),
            observed_at: at.into(),
            status: status.into(),
            sensitivity: sensitivity.into(),
            limitation,
        },
    );
}

fn insert_unavailable(
    fields: &mut BTreeMap<String, AuditField>,
    name: &str,
    source: &str,
    method: &str,
    at: &str,
    sensitivity: &str,
    limitation: &str,
) {
    fields.insert(
        name.into(),
        AuditField {
            value: None,
            source: source.into(),
            method: method.into(),
            observed_at: at.into(),
            status: "unavailable".into(),
            sensitivity: sensitivity.into(),
            limitation: Some(limitation.into()),
        },
    );
}

fn insert_not_collected(
    fields: &mut BTreeMap<String, AuditField>,
    name: &str,
    source: &str,
    method: &str,
    at: &str,
    sensitivity: &str,
    limitation: &str,
) {
    fields.insert(
        name.into(),
        AuditField {
            value: None,
            source: source.into(),
            method: method.into(),
            observed_at: at.into(),
            status: "not_collected".into(),
            sensitivity: sensitivity.into(),
            limitation: Some(limitation.into()),
        },
    );
}

fn os_version() -> Option<Value> {
    #[cfg(target_os = "linux")]
    {
        if let Ok(contents) = fs::read_to_string("/etc/os-release") {
            for line in contents.lines() {
                if let Some(value) = line.strip_prefix("PRETTY_NAME=") {
                    return Some(json!(value.trim_matches('"')));
                }
            }
        }
    }
    #[cfg(target_os = "windows")]
    {
        if let Ok(value) = std::env::var("OS") {
            return Some(json!(value));
        }
    }
    None
}

fn total_memory_bytes() -> Option<Value> {
    #[cfg(target_os = "linux")]
    {
        let contents = fs::read_to_string("/proc/meminfo").ok()?;
        let line = contents
            .lines()
            .find(|line| line.starts_with("MemTotal:"))?;
        let kb = line.split_whitespace().nth(1)?.parse::<u64>().ok()?;
        return Some(json!(kb * 1024));
    }
    #[allow(unreachable_code)]
    None
}

fn cpu_model() -> Option<Value> {
    #[cfg(target_os = "linux")]
    {
        let contents = fs::read_to_string("/proc/cpuinfo").ok()?;
        let line = contents
            .lines()
            .find(|line| line.starts_with("model name"))?;
        return line.split_once(':').map(|(_, value)| json!(value.trim()));
    }
    #[allow(unreachable_code)]
    None
}

fn network_interfaces() -> Option<Vec<String>> {
    #[cfg(target_os = "linux")]
    {
        let entries = fs::read_dir("/sys/class/net").ok()?;
        let mut names = entries
            .filter_map(Result::ok)
            .filter_map(|entry| entry.file_name().into_string().ok())
            .collect::<Vec<_>>();
        names.sort();
        return Some(names);
    }
    #[allow(unreachable_code)]
    None
}

fn package_inventory(root: &Path) -> (Vec<Value>, usize) {
    fn visit(root: &Path, directory: &Path, entries: &mut Vec<Value>, skipped: &mut usize) {
        let Ok(children) = fs::read_dir(directory) else {
            *skipped += 1;
            return;
        };
        for child in children {
            let Ok(child) = child else {
                *skipped += 1;
                continue;
            };
            let path = child.path();
            let Ok(metadata) = fs::symlink_metadata(&path) else {
                *skipped += 1;
                continue;
            };
            if metadata.file_type().is_symlink() {
                continue;
            }
            if metadata.is_dir() {
                visit(root, &path, entries, skipped);
            } else if metadata.is_file() {
                let Ok(relative) = path.strip_prefix(root) else {
                    *skipped += 1;
                    continue;
                };
                let Ok(mut file) = fs::File::open(&path) else {
                    *skipped += 1;
                    continue;
                };
                let mut hasher = Sha256::new();
                let mut buffer = [0_u8; 16 * 1024];
                let mut read_ok = true;
                loop {
                    match file.read(&mut buffer) {
                        Ok(0) => break,
                        Ok(count) => hasher.update(&buffer[..count]),
                        Err(_) => {
                            read_ok = false;
                            break;
                        }
                    }
                }
                if read_ok {
                    entries.push(json!({
                        "path": relative.to_string_lossy().replace('\\', "/"),
                        "size_bytes": metadata.len(),
                        "digest_algorithm": "sha-256",
                        "digest": format!("{:x}", hasher.finalize())
                    }));
                } else {
                    *skipped += 1;
                }
            }
        }
    }
    let mut entries = Vec::new();
    let mut skipped = 0;
    visit(root, root, &mut entries, &mut skipped);
    entries.sort_by(|a, b| a["path"].as_str().cmp(&b["path"].as_str()));
    (entries, skipped)
}

fn is_utc_timestamp_shape(value: &str) -> bool {
    value.len() == 20
        && value.ends_with('Z')
        && value.as_bytes().get(10) == Some(&b'T')
        && value.as_bytes().get(4) == Some(&b'-')
        && value.as_bytes().get(7) == Some(&b'-')
}

fn now_rfc3339() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let days = (seconds / 86_400) as i64;
    let day_seconds = seconds % 86_400;
    let (year, month, day) = civil_from_days(days);
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        day_seconds / 3600,
        (day_seconds % 3600) / 60,
        day_seconds % 60
    )
}

fn civil_from_days(days_since_epoch: i64) -> (i64, i64, i64) {
    let z = days_since_epoch + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let mut year = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = mp + if mp < 10 { 3 } else { -9 };
    year += if month <= 2 { 1 } else { 0 };
    (year, month, day)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn builds_manifest_with_explicit_observation_provenance() {
        let audit = GenesisAudit {
            captured_at: "2026-11-15T12:00:00Z".into(),
            fields: BTreeMap::from([(
                "execution.architecture".into(),
                AuditField {
                    value: Some(json!("x86_64")),
                    source: "rust-std".into(),
                    method: "std::env::consts::ARCH".into(),
                    observed_at: "2026-11-15T12:00:00Z".into(),
                    status: "observed".into(),
                    sensitivity: "public".into(),
                    limitation: None,
                },
            )]),
        };
        let manifest = build_genesis_manifest(&audit, "2026-11-15T12:00:01Z").unwrap();
        assert_eq!(manifest.document_id, GENESIS_DOCUMENT_ID);
        assert_eq!(
            manifest.payload["audit"]["fields"]["execution.architecture"]["value"],
            "x86_64"
        );
        assert_eq!(manifest.payload["lifecycle_stage"], "pre-birth");
        assert_eq!(
            manifest.payload["privacy"]["credentials_or_private_keys_collected"],
            false
        );
    }

    #[test]
    fn audit_does_not_copy_arbitrary_environment_or_absolute_paths() {
        let audit = audit_current_environment(None);
        assert!(!audit.fields.contains_key("execution.environment"));
        assert!(!audit.fields.contains_key("execution.executable_path"));
        assert!(audit.fields.contains_key("package.archive_origin"));
        assert_eq!(audit.fields["package.archive_origin"].status, "unavailable");
    }

    #[test]
    fn rejects_timestamp_without_utc_suffix() {
        let audit = GenesisAudit {
            captured_at: "2026-11-15T12:00:00Z".into(),
            fields: BTreeMap::new(),
        };
        assert_eq!(
            build_genesis_manifest(&audit, "2026-11-15T12:00:00+00:00"),
            Err(GenesisError::InvalidTimestamp)
        );
    }

    #[test]
    fn validates_generated_manifest_against_repository_schema() {
        let audit = GenesisAudit {
            captured_at: "2026-11-15T12:00:00Z".into(),
            fields: BTreeMap::new(),
        };
        let document = build_genesis_manifest(&audit, "2026-11-15T12:00:00Z").unwrap();
        let schema: Value = serde_json::from_str(include_str!(
            "../../../../schemas/cin-genesis-environment-manifest-v1.schema.json"
        ))
        .unwrap();
        let validator = crate::schema::SchemaValidator::from_value(&schema).unwrap();
        assert!(validator.is_valid(&serde_json::to_value(document).unwrap()));
    }

    #[test]
    fn registers_genesis_as_first_record_and_allows_identical_retry() {
        let root = std::env::temp_dir().join(format!(
            "cin-genesis-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let store = TransactionalStore::open(&root).unwrap();
        let audit = GenesisAudit {
            captured_at: "2026-11-15T12:00:00Z".into(),
            fields: BTreeMap::new(),
        };
        let document = build_genesis_manifest(&audit, "2026-11-15T12:00:00Z").unwrap();
        let first = register_genesis_manifest(&store, &document).unwrap();
        let retry = register_genesis_manifest(&store, &document).unwrap();
        assert_eq!(first, retry);
        assert_eq!(store.read_record(GENESIS_DOCUMENT_ID).unwrap(), document);
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn refuses_genesis_when_another_document_is_already_committed() {
        let root = std::env::temp_dir().join(format!(
            "cin-genesis-order-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let store = TransactionalStore::open(&root).unwrap();
        let existing = DocumentEnvelope::new(
            "cin:other:first",
            "cin.test",
            "1.0.0",
            "2026-11-15T12:00:00Z",
            json!({"test": true}),
        );
        store.prepare_record("existing-first", &existing).unwrap();
        store.commit_record("existing-first").unwrap();
        let audit = GenesisAudit {
            captured_at: "2026-11-15T12:00:00Z".into(),
            fields: BTreeMap::new(),
        };
        let genesis = build_genesis_manifest(&audit, "2026-11-15T12:00:00Z").unwrap();
        assert!(matches!(
            register_genesis_manifest(&store, &genesis),
            Err(StorageError::Conflict(_))
        ));
        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn converts_epoch_to_utc_timestamp() {
        assert_eq!(now_rfc3339().len(), 20);
        assert_eq!(civil_from_days(0), (1970, 1, 1));
    }
}
