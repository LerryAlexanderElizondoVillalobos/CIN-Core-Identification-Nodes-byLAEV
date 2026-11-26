# Settings Stage — Official Code Deployment and Network Isolation

**Project:** CIN — Core Identification Nodes byLAEV  
**Application:** CIN Main Lobby  
**Scope boundary:** Settings only  
**Status:** Approved development plan; implementation pending  
**Deliverable:** tested Settings functionality and a qualified `CIN.deb` artifact

## 1. Stage objective

Implement two working capabilities exclusively inside the existing Settings screen:

1. **Official Code Deployment:** compare the installed application against a published official code manifest, present component-level changes, and apply an explicitly approved incremental deployment.
2. **Network Isolation:** allow the operator to isolate CIN Main Lobby from Internet connectivity and independently control outbound and inbound application traffic.

The Lobby screen, Create, Enter, Import, certificate processes, Package Engine and other application areas are outside this stage. Only the Settings entry point, its Settings UI, and the dedicated services required to make the two Settings capabilities work may change.

## 2. Existing repository baseline

The active application is a Python 3 / GTK 4 desktop application. The current Settings screen is informational and is implemented in `MAIN/app/launcher/cin_main.py`. The existing Debian payload is architecture-independent and is distributed as a user-space payload container, extracted into the current user's home directory by `install-user.sh`; it is not installed with `apt install` or `dpkg -i`.

The existing package workflow is `.github/workflows/phase1-main-lobby.yml`. This stage adds a separate workflow and does not replace or broaden the existing milestone.

## 3. Functional architecture

### 3.1 Settings presentation

Settings will contain two dedicated sections:

- **Code Deployment**
- **Network Isolation**

Controls must reflect actual service state. No decorative switches, simulated success messages, invented build metadata or enabled Deploy button without a verified deployment proposal.

### 3.2 Official Code Deployment service

Required sequence:

1. Generate a Local Manifest from the installed application.
2. Request the current manifest from the configured official development channel only after the user selects Check for updates.
3. Validate manifest structure, channel/application binding, supported base build and publisher trust.
4. Compare component entries, not only a global build hash.
5. Display available additions, replacements and removals with component name, version/reference, file list and declared hashes.
6. Build a Deployment Manifest that describes the exact proposed changes and required base build.
7. Download/stage only the files required by that proposal.
8. Verify every staged file against its declared cryptographic hash.
9. Enable Deploy only after all checks pass.
10. Require explicit user confirmation.
11. Apply the deployment transactionally: stage first, preserve the previous working build until the new build passes post-apply validation, and retain a local deployment result.
12. Record installed build hash, source manifest reference, deployment manifest reference, timestamp and result locally.

A global hash is a build fingerprint; it cannot identify missing components by itself. Component-level manifest entries are required.

The first implementation must define a versioned JSON manifest schema and deterministic canonicalization before computing its manifest hash. The publisher verification key must be provisioned independently of the downloaded manifest. A public key shipped only inside the same untrusted package is not a trust anchor.

The official development channel may publish continuously, but only explicitly deployable commits/builds are eligible. Arbitrary intermediate repository commits are not automatically deployable.

### 3.3 Network Isolation service

Expose three independent policy controls:

- **Internet connectivity:** allow or deny CIN's network connectivity.
- **Outbound data:** allow or deny CIN-originated network traffic.
- **Inbound data:** allow or deny network traffic addressed to CIN.

The implementation must state and enforce its actual boundary: the CIN Main Lobby process and its managed helper processes, not the host operating system or unrelated applications. It must not claim host-wide isolation.

The service must provide:
- persisted operator-selected policy;
- an observable effective state (active, inactive, partial, unsupported or error);
- a single enforcement adapter used by the application and tests;
- explicit handling of platform capability limitations;
- no automatic disabling of isolation to perform a deployment.

Deployment requires a separately presented, explicit user-authorized network session. The user must be able to end that session and restore the selected isolation policy. No background network check or automatic deployment is permitted.

If the current Linux session cannot enforce a requested policy at the defined application boundary, Settings must report that honestly rather than showing a false isolated state.

### 3.4 Interaction between the two services

Network isolation is the default local operating mode. A Check for updates request while offline must explain that connectivity is required and ask the user before opening a deployment network session. The deployment service must not silently override the isolation policy.

The three network controls remain independently configurable. Their combinations must be validated and reported accurately; an Internet-denied state must not be inferred solely from the outbound/inbound controls.

## 4. Repository implementation layout

Proposed active implementation paths:

```text
MAIN/
├── app/
│   ├── launcher/cin_main.py             # Settings entry and view integration
│   └── settings/
│       ├── deployment/                  # manifest, comparison, staging, apply
│       └── network/                     # policy, enforcement adapter, status
├── tests/
│   ├── settings/
│   │   ├── test_settings_contract.py
│   │   ├── test_deployment_manifest.py
│   │   ├── test_deployment_comparison.py
│   │   ├── test_deployment_apply.py
│   │   ├── test_network_policy.py
│   │   ├── test_network_enforcement.py
│   │   └── test_settings_integration.py
│   └── fixtures/settings/
│       ├── official-manifest.json
│       └── deployment-manifest.json
└── docs/settings/
    ├── SETTINGS_DEPLOYMENT_AND_ISOLATION.md
    └── ACCEPTANCE_MATRIX.md
```

The layout is a target for this stage. Keep the implementation proportionate to the existing application; do not create unrelated frameworks.

## 5. Development work packages

| ID | Work package | Completion evidence |
|---|---|---|
| SET-01 | Settings UI contract | Two sections and truthful state display integrated into Settings only |
| SET-02 | Manifest schema and Local Manifest | Schema validation and deterministic component hashes |
| SET-03 | Official manifest retrieval and trust validation | User-initiated request; invalid/untrusted manifests rejected |
| SET-04 | Component comparison and Deployment Manifest | Exact additions/updates/removals and compatible base build |
| SET-05 | Staging and integrity verification | Files staged and hash-verified before Deploy is enabled |
| SET-06 | Incremental deployment apply | Explicit approval, transactional apply, post-apply validation and local result |
| SET-07 | Network policy model | Independent persisted Internet/inbound/outbound settings |
| SET-08 | Network enforcement adapter | Effective process-boundary enforcement and honest capability reporting |
| SET-09 | Deploy/isolation coordination | Explicit temporary network authorization; policy restored afterward |
| SET-10 | Settings integration and regression | Repeated navigation and existing Lobby behavior unchanged |
| SET-11 | CI qualification | All required test suites pass on supported runners |
| SET-12 | Debian package | `CIN.deb` built and inspected only after all required tests pass |

## 6. Test strategy and acceptance matrix

### Code Deployment tests

- Local manifest is reproducible for unchanged component contents.
- A changed component changes its component hash and the build fingerprint.
- Equal manifests produce no deployment proposal.
- Added, changed and removed components are identified correctly.
- Incompatible base build is rejected.
- Malformed, wrong-application, wrong-channel, untrusted or invalidly signed manifest is rejected.
- A staged file with a mismatched hash prevents Deploy.
- No file is applied before explicit user confirmation.
- Successful deployment updates the local manifest and deployment record.
- Failed application preserves the previous working build and reports failure.

### Network Isolation tests

- Each of the three controls can be changed and persisted independently.
- Effective status matches the enforcement adapter result, not merely the UI selection.
- With isolation active, the managed application cannot establish outbound Internet connections.
- With inbound disabled, no network-originated request reaches a managed CIN listener/helper.
- Unrelated host applications retain their connectivity.
- Unsupported enforcement is reported as unsupported/error, never as isolated.
- Restart reconstructs the selected policy and re-establishes enforcement before network-capable CIN services start.

### Combined tests

- Offline Check for updates does not silently enable connectivity.
- User denial leaves the network policy unchanged.
- User approval opens only the required deployment session.
- Ending or failing a deployment restores the prior isolation policy.
- No background network requests occur when the application is idle/offline.
- Settings → Lobby → Settings navigation continues to work.

### Package acceptance

- Build `CIN.deb` only after source, service, integration, UI and network tests pass.
- Verify Debian metadata and architecture.
- Extract the package and inspect its complete payload.
- Install as an unprivileged CI user using the existing user-space installer.
- Launch under a virtual display and run Settings integration smoke tests.
- Verify uninstallation removes application files but preserves user data.
- Upload `CIN.deb` only from the final successful packaging job.

GitHub-hosted CI success does not replace manual qualification on the operator's actual Debian-compatible Linux ARM64/AArch64 device.

## 7. GitHub Actions workflow

The dedicated workflow is `.github/workflows/settings-deploy-isolation.yml`.

Pipeline order:

```
Checkout
  ↓
Scope and implementation gate
  ↓
Python source and contract tests
  ↓
Deployment manifest/comparison/apply tests
  ↓
Network policy and enforcement tests
  ↓
Settings integration + GTK smoke tests
  ↓
Architecture matrix qualification
  ↓
Build CIN.deb
  ↓
Package metadata and payload inspection
  ↓
Unprivileged install / launch / uninstall
  ↓
Publish CIN-deb-installer artifact
```

The package job depends on every required test job. The publication job depends on package inspection and the unprivileged installation test. A failed or skipped test prevents package publication.

The workflow is deliberately expected to remain red until the required Settings implementation and test suites exist and pass. It must not publish the current informational-only Settings build as if this stage were complete.

## 8. Definition of done

This stage is complete only when:

1. Both capabilities are functional inside Settings.
2. Deploy is user-initiated, component-aware, hash-verified and explicitly authorized.
3. Network isolation is actually enforced at the declared CIN process boundary and independently observable.
4. Deploy and isolation coordinate without silently changing operator policy.
5. All automated tests pass on the configured Linux runner matrix.
6. Existing Lobby behavior and navigation regressions pass.
7. The Debian package is built after tests, inspected, installed and launched successfully by an unprivileged CI user.
8. The successful workflow publishes the `CIN-deb-installer` artifact.
9. Manual ARM64/AArch64 operator qualification is recorded separately.

## 9. Explicit exclusions

No changes to the Lobby's business functionality, Create, Enter, Import, founding certificate workflows, node lifecycle, Package Engine, application-specific Ledgers, external signer manager or other future modules. No host-wide firewall management. No silent network exceptions. No automatic update checks. No package release on a failed or incomplete test run.
