# CIN Genesis Environment Manifest v1

**Specification ID:** `cin.genesis-environment-manifest`  
**Version:** `1.0.0`  
**Status:** Initial implementation proposal — review and conformance testing required  
**Lifecycle stage:** Pre-birth / after extraction

## 1. Purpose

The Genesis Environment Manifest records the relevant technical conditions observed by a CIN process after the portable distribution has been extracted and before formal node birth. It is intended to be the first logical CIN document committed to private local storage.

The manifest is a structured environment report, not the Node Birth Record, a personal registration record, proof of legal status, a publisher certificate, or a production-signed credential.

## 2. Collection principles

Every field is represented with:

- `value`: observed value or null;
- `source`: operating system, CIN runtime/build, filesystem, operator, or external verifier;
- `method`: the exact API or collection method;
- `observed_at`: UTC observation time;
- `status`: observed, declared, derived, external, unavailable, not_collected, or not_applicable;
- `sensitivity`: public, internal, confidential, or sensitive;
- `limitation`: reason a value is incomplete or unavailable.

Unknown values must not be converted into false, zero, empty, or a negative assertion.

## 3. Collection domains

The initial implementation collects, where supported:

1. Execution environment: OS family/name/version, architecture, pointer width, executable filename, current-directory availability, locale and time environment allowlist.
2. Hardware capabilities: available logical CPU count, CPU model and total memory where the platform adapter exposes them.
3. Package context: relative file inventory under the supplied extracted package root (or executable directory), file sizes and SHA-256 digests.
4. Network metadata: interface names on supported Linux systems; no addresses, packet content, traffic inspection or connectivity probe.
5. Cryptographic capability: digest algorithms compiled into this build.
6. Storage configuration: whether CIN_DATA_DIR is configured, without recording its path.
7. Explicit unavailable entries for unsupported or uncollected data, including archive origin, filesystem capacity/type, signature providers, external signers and trust-store metadata.

The package inventory hashes regular files below the package root and skips symbolic links. The operator must supply the correct extracted package root when the executable's parent directory is not the distribution root.

## 4. Privacy boundary

The initial collector does not enumerate arbitrary environment variables, read user documents, collect browser history or messages, inspect network payloads, read credentials, tokens, private keys, recovery phrases, biometric data or unrelated personal files. Absolute paths are excluded from the manifest. The package inventory is limited to the declared CIN package root.

The inventory does read bytes of regular files within that declared package root to calculate their digest. The package root must therefore be the extracted CIN distribution, not a general user directory.

## 5. Package origin and extraction boundary

The process running after extraction cannot reliably infer which ZIP archive produced the directory, nor authenticate that archive's publisher. Archive filename, archive digest, signed package manifest, signature validity and publisher trust must be supplied by the separate Package Origin Verification Engine. Until such evidence is provided, `package.archive_origin` is `unavailable`.

Extraction is not proof of package authenticity and is not node birth.

## 6. Operator review, document envelope and first-record registration

The initial command-line entry point prints the complete candidate manifest and requires explicit operator confirmation before it writes anything. Declining leaves storage unchanged. The extracted package directory defaults to the executable's parent directory; the user-data root is resolved independently through the existing DataRoot resolver. A future Lobby UI may provide the same review-and-confirm interaction.

The initial document uses the existing CIN common envelope fields and fixed initial document ID `cin:genesis:initial`. The storage registrar:
- accepts only this document type and ID;
- commits it through the existing TransactionalStore;
- rejects a different existing logical document;
- permits an identical already-committed retry.

The storage implementation is currently documented as a single-process, single-writer prototype. First-record ordering must be revisited if concurrent writers or multi-process storage are introduced.

## 7. Integrity, signature and trust

TransactionalStore currently records SHA-256 over the exact serialized JSON bytes it writes. This storage digest is not RFC 8785 JCS canonicalization and is not a detached signature.

ADR-0003 leaves the production canonicalization/signature profile open pending interoperability evidence. Therefore this first implementation creates and transactionally registers a manifest candidate, but does not claim a production cryptographic certificate, issuer trust, signature validity or external authorization. Signing remains a separate operation with external key custody.

## 8. Schema and implementation

- JSON Schema: `schemas/cin-genesis-environment-manifest-v1.schema.json`
- Illustrative fixture: `examples/cin-genesis-environment-manifest-v1.example.json`
- Rust module: `prototype/cin-core/src/genesis/`

The fixture is illustrative and does not describe an actual user's computer.

## 9. Acceptance tests

- required document type, fixed initial ID and schema version;
- field-level provenance and explicit unavailable status;
- package inventory restricted to the supplied root and regular files;
- no absolute path, arbitrary environment dump or secret collection;
- archive origin remains unavailable without verifier input;
- invalid timestamp rejected;
- manifest registered as first logical document;
- identical registration retry succeeds;
- a different pre-existing logical record blocks Genesis registration;
- storage reopen/read verifies the committed manifest.

## 10. Completion boundary

A passing unit/CI suite demonstrates the implemented scope only. It does not establish cross-platform hardware discovery, archive authenticity, production signature interoperability, trusted issuer status, node birth or Main Lobby acceptance.
