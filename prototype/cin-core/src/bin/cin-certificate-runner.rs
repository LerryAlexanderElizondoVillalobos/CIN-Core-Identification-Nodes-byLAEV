use cin_core::{
    data_root::DataRoot,
    genesis::{audit_current_environment, build_genesis_manifest, register_genesis_manifest},
    storage::TransactionalStore,
};
use serde_json::Value;
use std::{
    env,
    error::Error,
    fs, io,
    path::{Path, PathBuf},
};

fn main() -> Result<(), Box<dyn Error>> {
    let args = env::args_os().skip(1).collect::<Vec<_>>();
    if args.is_empty() || args.len() != 1 && args.len() != 3 {
        return Err(
            "usage: cin-certificate-runner <certificate.cincert> [--package-root <directory>]"
                .into(),
        );
    }
    let certificate_path = PathBuf::from(&args[0]);
    let certificate: Value = serde_json::from_slice(&fs::read(&certificate_path)?)?;
    let package_root = if args.len() == 3 {
        if args[1] != "--package-root" {
            return Err("expected --package-root".into());
        }
        Some(PathBuf::from(&args[2]))
    } else {
        None
    };

    execute(&certificate, &certificate_path, package_root)
}

fn execute(
    certificate: &Value,
    certificate_path: &Path,
    package_root_override: Option<PathBuf>,
) -> Result<(), Box<dyn Error>> {
    if certificate["execution"]["instruction"] != "RUN CERTIFICATE"
        || certificate["execution"]["action"] != "generate-genesis-environment-manifest"
        || certificate["certificate_type"] != "cin.genesis-environment"
        || certificate["certificate_version"] != "1.0.0"
        || certificate["collection_profile"]["id"] != "cin.genesis-environment/1.0.0"
        || certificate["output_profile"]["document_type"] != "cin.genesis-environment-manifest"
    {
        return Err("unsupported or invalid CIN certificate definition".into());
    }

    let package_root = match package_root_override {
        Some(path) => path,
        None => {
            let certificate_dir = certificate_path.parent().unwrap_or_else(|| Path::new("."));
            if certificate_dir
                .file_name()
                .is_some_and(|name| name == "certificates")
            {
                certificate_dir
                    .parent()
                    .unwrap_or(certificate_dir)
                    .to_path_buf()
            } else {
                certificate_dir.to_path_buf()
            }
        }
    };

    let audit = audit_current_environment(Some(&package_root));
    let manifest = build_genesis_manifest(&audit, &audit.captured_at)?;
    println!("{}", serde_json::to_string_pretty(&manifest)?);
    println!();
    println!(
        "Certificate: {}",
        certificate["certificate_id"].as_str().unwrap_or("unknown")
    );
    println!("Review the generated manifest. Register it as the first logical CIN record? [y/N]");

    let mut answer = String::new();
    io::stdin().read_line(&mut answer)?;
    if !matches!(answer.trim().to_ascii_lowercase().as_str(), "y" | "yes") {
        println!("Certificate execution completed; manifest was not registered.");
        return Ok(());
    }

    let data_root = DataRoot::resolve(None)?;
    let store = TransactionalStore::open(data_root.path())?;
    let receipt = register_genesis_manifest(&store, &manifest)?;
    let verified = store.read_record(&receipt.document_id)?;
    if verified != manifest {
        return Err("stored manifest did not match the generated document".into());
    }

    println!("Genesis Environment Manifest registered and read-back verified.");
    println!("Document: {}", receipt.document_id);
    println!("Storage digest (SHA-256): {}", receipt.digest);
    println!("The storage digest is not a digital signature.");
    Ok(())
}
