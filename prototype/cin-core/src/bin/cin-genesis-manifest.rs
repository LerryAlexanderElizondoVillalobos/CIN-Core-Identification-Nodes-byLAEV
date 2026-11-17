use cin_core::{
    data_root::DataRoot,
    genesis::{audit_current_environment, build_genesis_manifest, register_genesis_manifest},
    storage::TransactionalStore,
};
use std::{error::Error, io};

fn main() -> Result<(), Box<dyn Error>> {
    let executable = std::env::current_exe()?;
    let args = std::env::args_os().collect::<Vec<_>>();
    let package_root = match args.len() {
        1 => executable
            .parent()
            .ok_or("cannot resolve executable directory")?
            .to_path_buf(),
        3 if args[1].to_string_lossy() == "--package-root" => args[2].clone().into(),
        _ => {
            return Err(
                "usage: cin-genesis-manifest [--package-root <extracted-CIN-directory>]".into(),
            )
        }
    };
    let audit = audit_current_environment(Some(&package_root));
    let manifest = build_genesis_manifest(&audit, &audit.captured_at)?;

    println!("{}", serde_json::to_string_pretty(&manifest)?);
    println!();
    println!("Review the manifest above.");
    println!("Register it as the first logical CIN record? [y/N]");

    let mut answer = String::new();
    io::stdin().read_line(&mut answer)?;
    if !matches!(answer.trim().to_ascii_lowercase().as_str(), "y" | "yes") {
        println!("Genesis Manifest was not registered.");
        return Ok(());
    }

    let data_root = DataRoot::resolve(None)?;
    let store = TransactionalStore::open(data_root.path())?;
    let receipt = register_genesis_manifest(&store, &manifest)?;

    println!("Genesis Manifest registered and read-back can be verified.");
    println!("Document: {}", receipt.document_id);
    println!("Storage digest (SHA-256): {}", receipt.digest);
    println!("This digest covers stored JSON bytes; it is not a digital signature.");

    Ok(())
}
