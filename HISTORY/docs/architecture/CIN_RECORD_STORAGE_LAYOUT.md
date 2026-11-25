# CIN Record Storage Layout v1

**Status:** Proposed logical layout — implementation pending  
**Related:** [CIN Private Local Storage Specification v1](../../specifications/CIN_PRIVATE_STORAGE_SPECIFICATION_V1.md)

## 1. Proposed directory tree

```text
CIN_DATA_ROOT/
├── store-manifest.json
├── records/
│   ├── genesis-manifest/
│   ├── node-birth-record/
│   ├── personal-registration/
│   ├── personal-credential/
│   ├── evidence-record/
│   ├── attribute-event/
│   └── authorization/
├── objects/
│   └── <digest-algorithm>/<digest>
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

## 2. Authority classification

| Path | Classification | Rebuildable? | Notes |
|---|---|---:|---|
| `store-manifest.json` | Store metadata | No | Identifies store format, ID and backend profile |
| `records/**` | Authoritative documents | No | Immutable committed records |
| `objects/**` | Authoritative referenced content | No | Verify digest before use |
| `transactions/journal/**` | Commit/recovery evidence | No, until safely checkpointed | Supports idempotency and crash recovery |
| `transactions/commits/**` | Commit markers | No | Defines visibility of committed records |
| `indexes/**` | Derived indexes | Yes | Rebuild from committed records |
| `projections/**` | Derived profile and Lobby views | Yes | Rebuild from source records |
| `recovery/**` | Recovery reports and unresolved transaction evidence | No, while unresolved | Never discard unresolved state silently |
| `backups/**` | Backup artifacts | No | Subject to backup/retention policy |

## 3. Genesis ordering

The first logical CIN record in a new store is the Genesis Manifest. The store manifest, journal and commit markers are storage infrastructure and do not count as logical CIN records.

## 4. Naming and references

- Use stable document IDs from the common document model.
- Use a safe storage key derived from the document ID; do not directly trust unvalidated user-provided path fragments.
- Record references use document IDs and digest metadata, never machine-specific absolute paths.
- Binary objects use digest-algorithm plus digest as their storage key.
- A path is a storage implementation detail, not a public CIN document identifier.

## 5. Data-root decision remains open

This layout is relative to `CIN_DATA_ROOT`. It does not decide whether the root is inside the extracted folder or in a separate local data directory. That choice must be tested with package replacement, folder relocation, backup and restart recovery before implementation acceptance.

---
*End of layout.*
