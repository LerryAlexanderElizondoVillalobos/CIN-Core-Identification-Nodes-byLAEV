# Test Plan and Acceptance

**Version:** 1.3.0 · **Status:** Specification tests are being introduced; runtime tests await implementation

## Test layers

1. **Specification CI:** validates the documented architecture, constants, API contract and workflow syntax.
2. **Unit tests:** pairing, path policy, API validation, Device Flow state handling and token lifecycle once modules exist.
3. **Mocked integration:** GitHub Device Flow responses, Contents API operations, SHA conflicts and rate limits.
4. **Android acceptance:** actual Termux process, Android browser loopback permission, GitHub mobile authorization and device lifecycle.
5. **Migration acceptance:** deployed Pages Lobby uses Termux without exposing GitHub credentials and retains a rollback path.

A specification test is not a runtime test. A mocked GitHub response is not proof of actual Android/browser compatibility.

## Initial acceptance matrix

| ID | Test | Expected |
|---|---|---|
| S01 | Repository constants | Owner/name/ID and existing root match this repository |
| S02 | Network defaults | Loopback 127.0.0.1, port 2112, alternative 1221 |
| S03 | Cloudflare exclusion | No Worker dependency in target architecture |
| S04 | Authentication boundary | Device Flow and tokens remain in Termux |
| S05 | GitHub permission boundary | Contents read/write, Metadata read-only; no Actions |
| S06 | Public-data warning | Pages publication root clearly disclosed |
| S07 | CI permissions | contents: read only |
| S08 | Existing integration | PKCE/Worker migration is explicit and not silently removed |
| R01 | Runtime binds loopback | Awaiting server implementation |
| R02 | Pairing and revocation | Awaiting pairing implementation |
| R03 | Device Flow lifecycle | Awaiting auth implementation |
| R04 | Path allowlist | Awaiting repository adapter |
| R05 | Create/update SHA conflict | Awaiting repository adapter |
| B01 | Pages-to-loopback | Must pass on target Android browser |
| B02 | Termux restart recovery | Must pass on target device |

## Mandatory early gate

Before the full Lobby connector, deploy a harmless local health endpoint and call it from the actual GitHub Pages origin in the target Android browser. Test user gesture, local-network permission, preflight, PWA mode and denied-permission UX. If unsupported, pause the browser connector and evaluate local-served Lobby mode.

## Acceptance

No phase is accepted merely because its workflow is green. Attach actual Android/browser evidence for device-specific requirements. Skipped tests remain skipped and do not count as passed.
