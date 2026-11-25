# CIN Workflow Catalog

Purpose: repository progressively builds and tests the implementation it describes. Green checks never imply an unimplemented engine works.

## Workflow map
| Workflow | Scope | Gate |
|---|---|---|
| ci.yml | every PR/main push | repository, docs, references, YAML |
| specification-validation.yml | specs/docs/schemas/scripts | schema and references |
| cin-core.yml | prototype/cin-core | fmt, clippy, check, unit tests |
| contract-vectors.yml | schemas/vectors/documents/crypto | fixtures and deterministic vectors |
| storage-integration.yml | storage code/tests | atomic commit, recovery, restart |
| crypto-verification.yml | crypto/trust/signing/verification | vectors, tamper, wrong key, trust distinctions |
| engine-integration.yml | authorization/genesis/birth/registration | authorized and rejected flows |
| desktop-smoke.yml | runtime/package/UI | launch and process smoke |
| end-to-end.yml | accepted runtime/core | clean ZIP → Lobby → close/reopen |
| release.yml | tag/manual after gates | reproducible build, manifest, hash, signature and independent verification |

## Policy
- Pin third-party Actions to full commit SHA; minimal permissions.
- Use persist-credentials=false unless authenticated write is needed.
- Never pass production private keys or personal data to runners.
- Test signers are deterministic fixtures; USB hardware acceptance is controlled/manual.
- Use path filters and concurrency groups.
- Upload synthetic reports only; never user data or private keys.
- If code does not exist, workflow stays planned; it is not reported active.

## CI maturity gates
A documentation/spec gate validates references, YAML, schemas and examples. Core gate runs cargo fmt/check/clippy/test. Component gate requires unit, contract, boundary and failure tests. Integration gate tests actual consumers and recovery. Release gate builds ZIP from clean checkout, verifies hash/signature, relocation and full lifecycle.

Every workflow reports component/contract version, commit SHA, suite/count, result, skipped gates/reasons and synthetic report location. Skipped is not passed; mocks are not physical USB validation.
