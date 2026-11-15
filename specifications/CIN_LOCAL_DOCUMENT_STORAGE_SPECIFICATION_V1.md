# CIN Local Document Storage Specification v1

**Status:** Initial local implementation contract  
**Scope:** Filesystem JSON repository, atomic create, read and recovery  
**Out of scope:** Encryption at rest, multi-process locking, database indexes, backup/restore UI, signed storage manifest and global uniqueness.

## 1. Root separation
The storage root is supplied by the application/data-root resolver. The repository must never infer that the executable directory is the user data root. Package extraction/update must not overwrite records.

## 2. Layout
- documents/: one serialized envelope per stable document ID.
- File names are deterministic hex encoding of UTF-8 document ID followed by .json; arbitrary IDs cannot become path traversal.
- Temporary files are created in the same directory as final records and removed after failed commit where possible.

## 3. Create semantics
1. Validate envelope structurally.
2. Serialize UTF-8 JSON.
3. Create a unique temporary file using exclusive create.
4. Write all bytes and sync file.
5. Rename within same directory to final record path.
6. A retry with identical logical document is idempotent.
7. Existing ID with different document content returns conflict; it is never overwritten.

## 4. Read semantics
- Missing record → NotFound.
- Invalid JSON → Serialization error.
- Invalid envelope → InvalidDocument.
- Requested ID differs from stored ID → InvalidDocument.
- Read does not silently repair or rewrite original bytes.

## 5. Recovery and durability
The first implementation guarantees same-filesystem atomic rename and file sync before rename. Directory fsync, concurrent process coordination, crash-injection tests, platform-specific durability guarantees and migration tooling remain open hardening/acceptance items. A restart test proves process-level recovery, not every power-loss scenario.

## 6. Error taxonomy
InvalidDocument, NotFound, Conflict, Serialization and Io. Errors must not be converted into successful writes or missing-record defaults.

## 7. Acceptance
- Persist/read exact envelope across repository reopen.
- Identical retry succeeds without duplicate logical record.
- Same ID with changed content conflicts and preserves original.
- Missing ID returns NotFound.
- Invalid document is not persisted.
- Malformed persisted JSON is surfaced, not overwritten.
- Temporary files are not mistaken for records.
- Root relocation/reopen test is part of portable acceptance.
