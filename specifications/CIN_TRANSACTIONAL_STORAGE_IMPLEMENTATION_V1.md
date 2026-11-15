# CIN Transactional Storage Prototype — Implementation Contract

**Related specification:** `CIN_PRIVATE_STORAGE_SPECIFICATION_V1.md`  
**Related issue:** #6  
**Implementation issue:** #30  
**Status:** Prototype implementation contract; not production acceptance

## 1. Implemented transaction sequence

1. Validate a stable operation ID and the document envelope.
2. Serialize the envelope as UTF-8 JSON using the current repository serializer.
3. Calculate SHA-256 over those exact stored bytes.
4. Write and sync a create-only staging file.
5. Write and sync prepared journal metadata containing operation ID, document ID, digest algorithm and digest.
6. On commit, re-read staged bytes, recalculate the digest, parse and structurally validate the document.
7. Publish the authoritative document using same-filesystem create-only hard-link semantics.
8. Write a commit marker binding the operation ID, document ID, digest and storage format version.
9. Normal reads require the commit marker, matching journal entry, valid document envelope and matching recalculated digest.

## 2. Integrity semantics

The SHA-256 digest protects the exact serialized bytes managed by this storage adapter. It is not a canonical JSON digest, RFC 8785/JCS output, digital signature, issuer trust result or authorization decision. Signature input and canonicalization remain governed by the separate document/crypto contracts.

## 3. Idempotency

- Repeating the same operation ID with the same document bytes returns the same prepared transaction.
- Reusing an operation ID with different document bytes is a conflict.
- Repeating a commit after a valid commit marker returns the original receipt.
- A document ID already occupied by different bytes is a conflict; committed records are never overwritten.

## 4. Visibility and recovery

A document without a valid commit marker and matching journal is not visible through `read_record`. Recovery inspection classifies prepared, committed, incomplete and inconsistent transaction artifacts. Inspection does not delete, rewrite, repair or silently quarantine files.

## 5. Deliberate limitations

- Single-process/single-writer prototype; no multi-process lock.
- Existing `documents/` record layout is retained for this slice.
- No indexes, projections, backup/restore, encryption-at-rest or content-addressed evidence objects.
- The implementation syncs file contents before publication but does not claim directory-fsync or power-loss durability across all operating systems/filesystems.
- The current envelope serialization is not canonical. The digest must not be reused as signature input.
- Genesis-first-record policy is not implemented by this storage slice.

## 6. Acceptance evidence required

Format, Clippy, compilation and tests must pass. Tests cover invisibility before commit, restart/read-back, idempotent retry, operation-ID conflict, staged-byte tampering, committed-byte tampering, unmarked record invisibility and non-destructive recovery of incomplete artifacts.
