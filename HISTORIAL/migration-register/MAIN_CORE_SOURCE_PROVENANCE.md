# Main Core Source Provenance

**Source branch:** `main`  
**Source baseline commit:** `e5b758539f05edd937de1b1166a26153940fa96c`  
**Destination branch:** `architecture/main-reorganization`  
**Migration PR:** [#46](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/pull/46)

The following source files were fetched from the baseline branch and copied into Main/core. Blob SHAs identify the exact source content used for the port.

| Source | Destination | Source blob SHA |
|---|---|---|
| `prototype/cin-core/Cargo.toml` | `Main/core/Cargo.toml` | `87e6d7f81dd5834721b4f47fd2acd39bcc65e4ff` |
| `prototype/cin-core/src/lib.rs` | `Main/core/src/lib.rs` | `883b77eeb2c9c21aa870d6e1e579a43fb7782515` |
| `prototype/cin-core/src/data_root.rs` | `Main/core/src/data_root.rs` | `2aeae78c1fccbb8f838081b044b7c251b49398ed` |
| `prototype/cin-core/src/error.rs` | `Main/core/src/error.rs` | `f89667ca48a1d0f0ffdb14fa520e6db3026d0ed6` |
| `prototype/cin-core/src/lifecycle.rs` | `Main/core/src/lifecycle.rs` | `976a11f4df89035cef4a7d58ab6ac3c7f3ab5e0a` |
| `prototype/cin-core/src/schema.rs` | `Main/core/src/schema.rs` | `bfdcb6d43a3fcbc436ef867c7f36c58baf08f5c0` |
| `prototype/cin-core/src/recovery.rs` | `Main/core/src/recovery.rs` | `25770a6630298eea998fe8b93f7c530f5fb836d6` |
| `prototype/cin-core/src/documents/mod.rs` | `Main/core/src/documents/mod.rs` | `15860a22ce4fdfa4820ca9aba8566a045d166652` |
| `prototype/cin-core/src/documents/model.rs` | `Main/core/src/documents/model.rs` | `b9c9079c0550747b6c50d5daa67cf926ebf96bc8` |
| `prototype/cin-core/src/documents/validation.rs` | `Main/core/src/documents/validation.rs` | `3007bbcd1c66ee28fa48120f2e8826b9728d6b64` |
| `prototype/cin-core/src/storage/mod.rs` | `Main/core/src/storage/mod.rs` | `3efa9cc43f669af54339f7c06f5698219e2a5d6e` |
| `prototype/cin-core/src/storage/repository.rs` | `Main/core/src/storage/repository.rs` | `d0df8ac705f17568ba60c900468dc93563c9acdd` |
| `prototype/cin-core/src/storage/transactional.rs` | `Main/core/src/storage/transactional.rs` | `d0bd64820b3de74f1e501a77610c5e9366e30e4b` |
| `prototype/cin-core/src/genesis/mod.rs` | `Main/core/src/genesis/mod.rs` | `575c0c005c91be60c57c15608b5a68706291a654` |
| `prototype/cin-core/src/genesis/environment.rs` | `Main/core/src/genesis/environment.rs` | `cf5ce3be7e9a57ba5b61dab43ca95e9e2e0ad1fd` |
| `prototype/cin-core/src/bin/cin-genesis-manifest.rs` | `Main/core/src/bin/cin-genesis-manifest.rs` | `f7af6a842016fb9c5020b0c6e05004ce8ac1c039` |
| `prototype/cin-core/src/bin/cin-certificate-runner.rs` | `Main/core/src/bin/cin-certificate-runner.rs` | `4eede4df89240901f088c2629e0aca410c1904af` |

## Preservation status

The source files under `prototype/cin-core/` remain unchanged. This table records copy provenance; it does not assert runtime parity. The new `Main/core/` CI workflow must pass, and behavior must be compared before the old source is archived or removed.
