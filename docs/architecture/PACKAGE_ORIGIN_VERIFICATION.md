# Package Origin Verification Architecture

**Project:** CIN — Core Identification Nodes  
**Architecture:** The Global Blockchain Architecture  
**Author:** LAEV — Lerry Alexander Elizondo Villalobos  
**Classification:** Foundational Architecture  
**Status:** Proposed component — specification and implementation pending

---

## 1. Purpose

CIN requires an independent mechanism to verify software distribution packages before they are admitted to the portable environment or passed to an installation process.

The proposed **Package Origin Verification Engine** verifies a received ZIP archive against an independently obtained, digitally signed package manifest. It separates three questions:

1. **File integrity:** Are the bytes of the received archive identical to the bytes described by the published digest?
2. **Publisher authenticity:** Is the manifest signature valid under a public key that the local trust configuration recognizes?
3. **Installation authorization:** Does the local installation policy permit this verified package to be installed?

These are related but distinct decisions. A successful hash comparison does not identify the publisher. A valid signature does not prove that the received ZIP matches the package described by the signed manifest. Installation authorization remains a separate policy decision.

## 2. Architectural rationale

The design is based on a simple principle:

> A package must not be trusted for installation merely because it was downloaded, copied, or presented as an official distribution. Its origin and integrity must be independently verifiable.

CIN should retain its own ability to perform this verification rather than relying exclusively on a browser, operating system, archive manager, hosting platform, or distribution channel. Those systems may provide additional checks, but they do not replace the verification responsibility of the CIN environment.

This mechanism is intended to:

- establish a verification step before package installation;
- distinguish integrity evidence from publisher authentication;
- avoid placing publisher private keys inside the portable package;
- make verification reproducible and independently inspectable;
- preserve a result that can later be referenced by installation records and audit mechanisms.

This is not an assumption that every distribution channel is malicious. It is an architectural decision that trust should be based on verifiable evidence rather than an implicit assumption about the channel.

## 3. Verification inputs

The verifier operates on three logically separate inputs.

### 3.1. Received package

The ZIP archive selected for verification. The verifier calculates its digest from the exact archive bytes. It does not need to extract or execute the archive to perform this check.

### 3.2. Package manifest

A manifest distributed alongside the archive or retrieved through an independently selected publication channel. It describes the expected package and contains at least:

- package identifier;
- package version;
- exact archive filename;
- digest algorithm identifier;
- digest of the complete ZIP archive;
- publisher key identifier;
- publication metadata;
- optional compatibility and release metadata.

The manifest must be encoded deterministically before signing. The specification must define the canonical serialization and signature envelope so that independent implementations verify the same bytes.

### 3.3. Publisher signature and trust material

A detached digital signature over the canonical manifest, plus the public key or certificate required to verify it.

The verifier must not treat a public key supplied only inside the untrusted ZIP as trusted. The public key must be obtained or authenticated through a separately configured trust source, such as a locally provisioned trust store or an independently verified publisher-key distribution process.

The publisher's private signing key remains outside the portable package and outside the verifier.

## 4. Verification workflow

1. The operator selects the ZIP archive.
2. The verifier reads the archive as data and calculates its digest using the algorithm declared by the supported package profile.
3. The verifier obtains the corresponding manifest and detached signature.
4. The verifier validates the manifest signature using a public key whose trust status is established independently of the package being checked.
5. The verifier checks that the signed manifest describes the selected package, including its package identifier, version, filename and digest.
6. The verifier compares the locally calculated digest with the digest in the authenticated manifest.
7. The verifier produces a structured result for the installation policy and user interface.

A package is eligible to proceed to installation only when the signature is valid, the signing key is trusted for the relevant purpose, the manifest is valid and applicable, and the locally calculated archive digest matches the signed digest. The installation policy may impose additional requirements.

## 5. Result states

The user interface and machine-readable result must distinguish at least the following outcomes:

| Result | Meaning |
|---|---|
| Verified | Manifest signature is valid and trusted, manifest is applicable, and archive digest matches. |
| Digest mismatch | Received archive differs from the archive described by the signed manifest. |
| Invalid signature | Manifest signature cannot be validated. |
| Unknown or untrusted key | Signature may be mathematically valid, but the signing key is not trusted by the configured trust policy. |
| Manifest mismatch | Manifest package identifier, version, filename, or other required metadata does not describe the selected package. |
| Verification incomplete | Required manifest, signature, algorithm support, or trust material is unavailable. |

An incomplete or failed verification must never be displayed as a successful verification. The interface should show the separate outcomes for digest comparison, signature validation, key trust, and manifest applicability.

## 6. Relationship to installation

Package verification is a gate before extraction for installation and before execution of package-provided content.

The verifier does not itself install the package, execute its contents, or decide every installation permission. Its responsibility is to return evidence about the archive and its signed origin metadata.

The Ledger Installation Engine or package manager consumes that result and applies the installation policy. A failed or incomplete result does not authorize installation.

## 7. Relationship to other CIN components

| Component | Responsibility |
|---|---|
| Package Origin Verification Engine | Verify received distribution archives against signed origin manifests. |
| ESMT Core Engine | Provide Merkle-based commitments and proofs for structured records and ledger data. |
| Certificate Engine | Manage certificates and related trust material according to its own specification. |
| Request & Permission Engine | Determine which operations require authorization and apply permission policies. |
| External Signer Interface | Connect to an external signing capability when a signing operation is required. |
| Ledger Installation Engine | Install and register approved ledger components. |

The Package Origin Verification Engine is not a submodule of ESMT. Hashing a ZIP for exact-file comparison and constructing a Merkle tree for structured records are different operations with different data models and purposes.

The verifier can use public-key cryptography without possessing private signing keys. External signing interfaces may be relevant to publisher-side release production or other authorized signing workflows, but they are not required to verify an existing signature.

## 8. Distribution layout

A release may be distributed as separate artifacts, for example:

```text
release/
├── cin-portable-package.zip
├── package-manifest.json
└── package-manifest.sig
```

The public key or certificate chain is resolved through the configured trust mechanism. It must not become trusted merely because it is included beside the ZIP.

The manifest and signature formats, canonicalization rules, supported algorithms, key identifiers, key rotation, revocation, and trust-store provisioning remain to be specified before implementation.

## 9. Security and operational boundaries

The first implementation should focus on the intended functional workflow: calculate, authenticate, compare, report, and gate installation.

The implementation specification must then define concrete operational requirements, including:

- supported digest and signature algorithms;
- canonical manifest serialization;
- maximum supported archive and manifest sizes;
- streaming hash calculation for large archives;
- key trust, rotation, expiration and revocation behavior;
- handling of duplicate filenames and package-version conflicts;
- audit record format and reproducibility;
- user-visible error states and machine-readable results.

A matching digest proves byte-for-byte equality with the digest reference; it does not by itself prove that the package is safe, benign, or free of vulnerabilities. Signature validity proves that the signed manifest was produced by the holder of the corresponding private key; trust in that publisher depends on the independently configured trust policy.

## 10. Implementation sequence

1. Define the manifest schema and canonical serialization.
2. Select and document the signature format and supported cryptographic profiles.
3. Define public-key trust provisioning and lifecycle.
4. Implement archive digest calculation and manifest-signature verification.
5. Implement manifest-to-package matching and structured result states.
6. Integrate the verification result with the installation authorization workflow.
7. Create test vectors for valid packages, modified archives, invalid signatures, unknown keys, mismatched metadata, and incomplete inputs.
8. Document the implementation separately from this architectural proposal and report test results.

## 11. Architectural principle

**Trust must not be an assumed condition during installation. It must be a verifiable condition before installation.**

The Package Origin Verification Engine gives CIN an independent capability to examine the origin evidence supplied for a distribution, compare the received archive with the authenticated reference, and provide a clear result to the installation process.

---

*This document describes a proposed CIN architectural component. It does not claim that the engine has already been implemented or validated.*
