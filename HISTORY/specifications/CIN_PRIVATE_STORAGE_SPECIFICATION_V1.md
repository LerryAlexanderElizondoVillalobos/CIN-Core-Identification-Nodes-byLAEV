# CIN Private Local Storage Specification v1

**Specification ID:** `cin.private-local-storage`  
**Version:** `1.0.0-draft`  
**Status:** Proposed contract — review and prototype evidence required  
**Planning phase:** M0 — Architecture Baseline  
**Related:** Issue #6; [Architecture Baseline](../docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md); [Dependency Map](../docs/architecture/CIN_COMPONENT_DEPENDENCY_MAP.md); [Common Document Model](CIN_COMMON_DOCUMENT_MODEL_V1.md); [Node Lifecycle Specification](CIN_NODE_LIFECYCLE_SPECIFICATION_V1.md)

## 1. Purpose

Define the local storage contract required for CIN's portable-folder execution model. The storage layer must preserve authoritative records, support deterministic lookup and reference resolution, recover safely after interruption, and rebuild the Main Lobby from persisted data after a complete process restart.

This specification defines logical behavior and a proposed file-oriented layout. It does not select a database engine or claim that a storage implementation exists.

## 2. Governing storage principles

1. CIN performs local storage operations without requiring permanent Internet connectivity.
2. The extracted application directory and the user-data root are distinct logical boundaries, even if an explicit portable mode places the data root within the extracted directory.
3. User records must not be included in the distributable ZIP or overwritten by application package updates.
4. Authoritative CIN documents are immutable after commit. Corrections and updates create new records/events and references.
5. Only committed records are visible to normal record queries.
6. A generated file is not a committed record. Commit requires transaction completion and read-back integrity verification.
7. Indexes, caches and Lobby projections are rebuildable and are never the sole source of record truth.
8. The Genesis Manifest is the first logical CIN record. Storage metadata, transaction journals and infrastructure files are not logical CIN records.
9. The storage layer stores public verification material and references as required, but never stores production private signing keys supplied by external signers.
10. Every operation that can create or modify authoritative state has a stable operation ID and idempotency rule.

## 3. Data root and portability

The storage API operates against an explicitly selected `CIN_DATA_ROOT`. The exact default path remains an open decision pending the runtime prototype.

Two compatible operating modes must be evaluated:

| Mode | Data root | Benefit | Concern |
|---|---|---|---|
| Portable data mode | A dedicated data directory inside the extracted CIN folder, excluded from package contents | Application and records can move together as one local folder | Package replacement and backup procedures must preserve the data directory |
| Separate local data mode | A user-selected or OS user-data directory outside the extracted application folder | Application ZIP can be replaced without touching records | Moving the extracted folder does not automatically move the data root |

The first implementation must make the selected data root visible to the operator and must never silently switch to a new empty root when the configured root is unavailable.

### 3.1 Data-root requirements

- The data root has a stable store identifier and format version.
- The application package must not own or delete the data root.
- The user can inspect the configured data root and its available capacity/permissions.
- A missing or inaccessible root produces an explicit storage state; it must not be silently recreated if doing so would hide existing records.
- The storage adapter must support a future user-directed backup, export and restore operation.
- No absolute operating-system path is embedded in immutable CIN documents. Documents use stable record IDs and logical references.

## 4. Logical storage layout

The following is a proposed engine-neutral file layout for the first local backend:

```text
CIN_DATA_ROOT/
├── store-manifest.json
├── records/
│   └── <document-type>/
│       └── <document-id>.json
├── objects/
│   └── <digest-algorithm>/
│       └── <digest>
├── indexes/
│   ├── by-document-id/
│   ├── by-document-type/
│   ├── by-reference/
│   └── by-subject/
├── transactions/
│   ├── journal/
│   ├── staging/
│   └── commits/
├── projections/
│   ├── profile/
│   └── lobby/
├── recovery/
└── backups/
```

### 4.1 Store manifest

The store manifest records:
- storage format and version;
- stable store ID;
- creation timestamp;
- selected data-root mode;
- record serialization profile;
- supported digest profile identifiers;
- storage backend identifier and version.

The store manifest contains no private keys or secret signing material.

### 4.2 Authoritative records

Each committed record is stored under a stable document ID and type. The stored document must conform to the common document model and its type-specific schema.

The record's digest is recomputed during write and read-back. The storage layer preserves the exact serialized bytes and the declared canonicalization/digest profile. A changed document is a new record/version, not an in-place overwrite.

### 4.3 Content objects

Large immutable binary evidence files may be stored as content-addressed objects. The object path is derived from the declared digest algorithm and digest value. Metadata records reference the object and record its media type, size and provenance.

Object existence alone does not mean that the evidence is trusted or verified.

### 4.4 Indexes and projections

Indexes support lookup by document ID, type, subject and reference. They are derived from committed authoritative records and can be rebuilt.

Profile and Lobby projections are caches/read models. They can be deleted and reconstructed from authoritative documents, transaction outcomes and verification reports. A stale projection must never override a newer authoritative record.

## 5. Record lifecycle and transaction contract

A state-changing storage operation follows this logical sequence:

1. **Prepare:** validate the request, document schema, stable IDs, expected references and idempotency key.
2. **Stage:** write the candidate record and transaction metadata into a staging area.
3. **Verify staged bytes:** read the staged bytes back, parse them and recompute the declared digest.
4. **Commit record:** move the staged record into the authoritative records area using an atomic operation supported by the selected backend.
5. **Commit marker:** write a durable commit marker binding operation ID, record ID, digest and transaction version.
6. **Read back:** load the committed record through the normal read path and independently verify its digest and schema.
7. **Index:** update derived indexes. If index update fails, the committed record remains authoritative and the index is rebuildable.
8. **Receipt:** return a structured commit receipt only after the required commit marker and read-back checks succeed.

The exact durability primitive depends on the selected backend and operating system. The implementation must document the guarantees it actually provides; it must not claim stronger atomicity than the backend supports.

### 5.1 Visibility rule

A record is visible to normal queries only when:
- its commit marker exists;
- its transaction status is committed;
- its stored bytes match the recorded digest;
- its document structure passes the required schema validation.

A staged record, partial write or uncertain transaction is not a committed CIN record.

### 5.2 Genesis first-record rule

The Genesis Manifest must be the first logical CIN record committed to a new store. Infrastructure files such as the store manifest, transaction journal and commit marker do not count as logical CIN records.

The storage service must reject a second Genesis registration for the same store unless a separately specified recovery or re-genesis procedure explicitly authorizes it.

## 6. Idempotency and concurrency

Every write operation includes:
- stable `operation_id`;
- operation type;
- idempotency key;
- canonical input digest;
- target store ID;
- expected prior version/reference where applicable.

Rules:
- Same idempotency key + same operation type + same input digest returns the original committed result.
- Same idempotency key with different input is a conflict.
- Duplicate Genesis or Node Birth commits must resolve to the existing valid record or an explicit conflict; they must not create duplicate founding records.
- If commit outcome is uncertain, inspect the transaction journal and authoritative store before retrying.
- The first implementation may use a single-writer lock per data root with concurrent read operations. Multi-writer concurrency is deferred until required by an actual local use case.
- Lock acquisition failure is an explicit busy/retry result, not permission to bypass transaction ordering.

## 7. Recovery after interruption

On startup, the storage service reconciles transaction journal, staging entries, commit markers and authoritative records.

| Observed condition | Required recovery behavior |
|---|---|
| Staged record with no commit marker | Do not expose it; resume or discard according to the operation contract |
| Commit marker and matching authoritative record | Revalidate record and treat transaction as committed |
| Commit marker but record missing or digest mismatch | Enter STORAGE_RECOVERY_REQUIRED; do not report successful read |
| Record exists but no commit marker | Do not expose as committed; resolve against journal/idempotency record |
| Index missing or stale | Rebuild index from committed records |
| Projection missing or stale | Rebuild profile/Lobby projection from authoritative records |
| Unknown transaction state | Preserve evidence, report recovery required and avoid duplicate writes |

Recovery must not rewrite a valid historical record or silently roll back a later-stage failure into a prior lifecycle state.

## 8. Read and reference contract

The storage API must support:
- read by stable document ID;
- list/query by document type and declared index keys;
- resolve a typed reference;
- retrieve immutable object bytes by digest;
- retrieve transaction/commit status by operation ID;
- rebuild indexes and projections.

A read result distinguishes:
- found and structurally valid;
- not found;
- found but digest-invalid;
- schema-invalid;
- reference unresolved;
- storage unavailable;
- recovery required.

File presence alone is never a successful verification result.

## 9. Backup, export and restore

A backup/export package must include:
- store manifest and format version;
- all authoritative committed records;
- required content-addressed evidence objects;
- transaction/commit metadata needed to establish committed state;
- a backup manifest with inventory and digests.

Rebuildable indexes and projections may be omitted if the restore procedure can reconstruct them. Staged/uncommitted operations must be excluded or explicitly represented as incomplete; they must not be exported as committed records.

Restore must validate the backup manifest, every record digest, document schemas and required references before declaring the restored store ready. Backup/restore must not silently overwrite an existing store with a different store ID.

## 10. Privacy and signer boundary

- The storage service does not generate or custody production private signing keys.
- External signer adapters receive a defined signing request and return a proof; private key operations occur outside the CIN package.
- Storage may retain public keys, key IDs, issuer references, authorization documents and verification reports as allowed by the relevant policy.
- Encryption at rest, unlock credentials and local secret protection remain a separate decision; no encryption mechanism is claimed by this draft.
- Logs and recovery reports must not contain private keys, passwords or raw secret material.

## 11. Storage interface contract

The first storage adapter must expose logical operations equivalent to:

- `initialize_store(configuration) -> store_descriptor`
- `prepare_record(operation, document) -> transaction_reference`
- `commit_record(transaction_reference) -> commit_receipt`
- `read_record(document_id) -> record_result`
- `resolve_reference(reference) -> reference_result`
- `get_operation_status(operation_id) -> transaction_status`
- `rebuild_indexes() -> rebuild_report`
- `rebuild_projection(profile_id) -> projection_result`
- `verify_store() -> integrity_report`
- `backup_store(destination) -> backup_receipt`
- `restore_store(source, destination) -> restore_report`

These are logical contracts, not selected programming-language function signatures.

## 12. Open decisions

- Default data-root location and whether portable-data mode is the default.
- Exact storage backend and file/database implementation.
- Atomicity and durability guarantees on each supported operating system.
- Encryption-at-rest and local unlock model.
- Backup format and retention policy.
- Multi-process/multi-writer requirements beyond the initial single-writer local model.

## 13. Completion boundary

This specification defines the storage contract and proposed logical layout. It does not mean the storage engine is implemented. Issue #6 remains open until a prototype can write, close, reopen, read and independently verify a record; interruption/recovery behavior is tested; and the data-root and backend decisions are accepted.

---
*End of specification.*
