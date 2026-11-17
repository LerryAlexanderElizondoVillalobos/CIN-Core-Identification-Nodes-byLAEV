# CIN Certificate and Certificate Runner — Initial Implementation

**Status:** First executable vertical slice  
**Version:** 1.0.0  
**Scope:** One certificate type only: Genesis Environment

## Components

- **Certificate**: a declarative JSON document with the `.cincert` extension. It describes the certificate type, version, collection profile, output profile and the execution instruction `RUN CERTIFICATE`.
- **Certificate Runner**: the local Rust executable `cin-certificate-runner`. It reads the certificate, checks that the instruction and supported profile match the implemented operation, invokes the existing Genesis Environment collector, presents the generated manifest, and registers it through DataRoot and TransactionalStore after operator confirmation.

The certificate does not contain executable code or private keys. The Runner implements the operation. This first slice deliberately supports exactly one certificate profile; it is not yet a general-purpose plugin or permission engine.

## Run

From the repository root:

```sh
cargo run --manifest-path prototype/cin-core/Cargo.toml --bin cin-certificate-runner -- certificates/CIN-GENESIS-ENVIRONMENT.cincert
```

To specify the extracted package directory explicitly:

```sh
cargo run --manifest-path prototype/cin-core/Cargo.toml --bin cin-certificate-runner -- certificates/CIN-GENESIS-ENVIRONMENT.cincert --package-root ./path/to/extracted-cin
```

The runner prints the candidate manifest and asks for confirmation. Answering anything other than `y` or `yes` leaves storage unchanged. On confirmation, it registers the Genesis Manifest and reads it back to verify that the stored document matches the generated document.

## Current boundaries

- The Runner accepts only the Genesis Environment certificate type, version and action implemented here.
- The existing purpose-limited Genesis collector defines the actual collected fields; certificate profile declarations are descriptive and are not an arbitrary code execution language.
- No private keys are stored or generated.
- SHA-256 storage digest is an integrity check over stored JSON bytes, not a digital signature or issuer trust proof.
- OS double-click association and packaged Runner installation are subsequent integration work. The CLI is the first functional execution path.
