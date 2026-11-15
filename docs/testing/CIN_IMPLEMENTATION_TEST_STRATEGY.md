# CIN Implementation Test Strategy and Acceptance

## Test dimensions
Every component covers normal path, empty/minimal/max/boundary input, malformed/inconsistent data, invalid signature/wrong issuer/key/authorization, duplicate/retry/idempotency, interruption/restart/recovery, missing/unavailable dependency, version/reference compatibility and explicit error/status rather than false success.

## Critical invariants
1. Genesis Manifest is not Node Birth Record.
2. Node Identifier is not CIN Personal Number.
3. Birth authorization and personal issuance authorization are separate.
4. Signature validity is not issuer trust or operation authorization.
5. Local number is not automatically globally unique/reserved.
6. Evidence association does not automatically verify evidence.
7. Attribute update preserves history and does not create a new birth.
8. Main Lobby is a projection of persisted records, not authority.
9. Missing/corrupt/untrusted references yield incomplete/invalid state.
10. Retries do not duplicate births, registrations or number allocations.
11. Production private keys never reside in ZIP, repository or ordinary CI artifacts.
12. Offline authority/revocation remains pending/unavailable if it cannot be checked.

## E2E acceptance
From a clean machine/profile:
1. Download release ZIP; verify digest and publisher signature/trust.
2. Reject modified ZIP and untrusted publisher key.
3. Extract and run portable app.
4. Audit environment and review provenance/status.
5. Build, validate and register Genesis Manifest as first logical record.
6. Close/relaunch and recover Genesis.
7. Request birth; test rejected/expired/out-of-scope and approved authorization.
8. Generate Node Identifier and Node Birth Record; independently verify and persist.
9. Explicitly associate person/node; request separate personal issuance.
10. Generate number through allocator and display allocation status.
11. Issue, serialize, store, reload and verify CIN credential.
12. Associate synthetic evidence; distinguish pending/verified/rejected/unavailable.
13. Update attributes and verify append-preserving history.
14. Assemble profile/Main Lobby from persisted records.
15. Close process, relaunch, reconstruct Lobby and verify references/digests.
16. Relocate application folder without moving/overwriting data root; repeat recovery.

## Physical acceptance
Record OS/version, package digest, runtime, operator/date, steps/results, sanitized logs, defects and approval. USB signer acceptance records device/firmware, transport, algorithm, cancellation/disconnect/error and independent signature verification. Hosted CI may test protocol mocks, not claim device acceptance.
