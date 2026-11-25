# CIN Implementation Directory Map

Status: proposed ownership map; directories become authoritative as contracts/code/tests land. Runtime remains subject to P0 review.

## Repository structure
    .github/
      ISSUE_TEMPLATE/              # bounded Issues
      PULL_REQUEST_TEMPLATE.md    # contract, tests, maturity, evidence
      workflows/                  # CI, integration, E2E and release
    docs/
      architecture/               # boundaries and maps
      decisions/                  # ADR history
      project/                    # master plan, backlog, status, workflow catalog
      testing/                    # test strategy and manual acceptance
    specifications/
      schemas/                    # versioned JSON Schema
      examples/                   # valid, invalid and boundary examples
      test-vectors/               # canonical bytes, digest, signatures
    prototype/
      linux-runtime/               # portable launch/UI shell; no domain authority
      cin-core/                    # Rust library independent of UI/runtime
        src/
          lib.rs                   # stable public exports
          error.rs                 # typed errors/results
          lifecycle.rs              # transitions/invariants
          modules/
            documents/              # envelope, registry, references
            validation/             # schema and semantic validation
            storage/                # repository, atomic commit, recovery
            crypto/                 # canonicalization, digest, signing bytes
            trust/                 # anchor, authority, issuer, key status
            signing/                # signer interface and adapters
            verification/           # independent checks and report
            authorization/          # scoped operation decisions
            package/                # ZIP manifest/origin verification
            environment/            # audit and provenance
            genesis/                # manifest builder/registrar
            birth/                  # node ID, authorization, birth record
            personal_registration/  # association, number, credential
            evidence/               # provenance and verification state
            profile/                # attributes/history/assembly
            esmt/                   # optional Merkle subsystem
            lobby/                  # read model; not source of truth
        tests/
    tests/
      contracts/                    # schema/contract fixtures
      integration/                  # storage, crypto, engine boundaries
      e2e/                          # ZIP-to-Lobby scenarios
      performance/                  # benchmark after correctness
      fixtures/                     # synthetic data, never secrets/PII
    scripts/
      ci/                           # repository/schema/workplan validators
      package/                      # reproducible package/verification
    dist/                           # generated output, not source

## Module ownership
| Module | Owns | Must not own |
|---|---|---|
| core | errors, IDs, time, invariants | UI/backend detail |
| documents | envelope, type/version, references | authorization policy |
| storage | records, atomic commits, indexes, recovery | trust decisions |
| crypto | canonical bytes, digest, signing payload | issuer authorization |
| trust | anchors, issuer/key status/policy | private key export |
| signing | signer capability/request/response | lifecycle policy |
| verification | independent checks/report | silently approving missing checks |
| authorization | scoped operation decisions | key custody |
| package | archive/manifest integrity and publisher trust | node birth |
| environment | observations/declarations/provenance | personal attribute inference |
| genesis | Genesis Manifest | birth record |
| birth | node identifier and birth event | personal number |
| personal_registration | association, allocation, credential | global uniqueness claim |
| evidence | evidence association/status | auto-verification |
| profile | attributes/history/projection | replacing original records |
| esmt | Merkle roots/proofs | signature, issuer, authorization |
| lobby | render read model | authoritative records |

## Module contract
Every implemented module should contain mod.rs (public interface), types.rs (models), service.rs (real implementation), errors.rs (domain errors if not shared), tests.rs or module-local tests, and README.md (scope, dependencies, maturity, tests, limitations). Do not create empty service files and call them engines. Introduce each module when the first functional slice is ready.

## Integration boundaries
- Runtime calls application services; it never writes authoritative records directly.
- Domain services depend on storage/document/trust interfaces, not HTTP/browser types.
- Profile assembly resolves persisted references and verification outcomes; Lobby displays it.
- Signer adapter supplies signature/result; CIN evaluates issuer policy and authorization.
- ESMT is supplementary integrity metadata; signatures/trust remain independent.


## Future independently installed engine packages

The following Phase 2 engine package boundaries are architectural targets, not directories or implemented modules in the current runtime baseline. Introduce each package when its first functional slice and reviewed contract are ready; do not create empty engine directories and label them implemented.

| Engine package | Planned responsibility | Key boundaries |
|---|---|---|
| Networks | Node discovery, network profiles, CIN addressing, domain resolution, network certificates and communication transports | Uses Requests & Permissions for authorization; does not decide disclosure policy |
| Requests & Permissions | Request lifecycle, operation scopes and authorization decisions | Does not own transport or private-key custody |
| Storage | Shared storage interfaces and controlled data availability | Does not decide trust or network admission |
| Evidence & Proof | Evidence references, proof creation and verification workflows | Does not treat cryptographic integrity alone as factual truth |
| Cryptography | Cryptographic primitives, signature verification and proof support | Does not independently authorize operations |
| Consensus | Agreement on network-specific shared state | Does not replace operation-level authorization |

### Networks Engine documentation and planned boundaries

Canonical architecture specification: [CIN-NET-001 v1.2](CIN_NETWORKS_NATIVE_ADDRESSING_AND_DOMAIN_REGISTRY_v1.2.md).

The Networks Engine specification defines these planned components: CIN Network Certificates, CIN Native Addressing, CIN Address Resolver, local web routing through the shared runtime, P2P communication interface and CIN Domain Registry & Management.

The local example `http://127.0.0.1:1221/laev.cin` is a virtual route handled by the local CIN runtime; it does not imply public DNS resolution. Public use such as `https://laev.cin` depends on external name resolution, a reachable service endpoint and compatible TLS trust. The proposed namespace registry is limited to eligible CIN nodes under governance rules that remain to be defined.

The Networks Engine must be installed and managed as an independent package through the CIN Engine Manager. Its package must not be embedded into the Phase 1 foundational CIN document or the Motor de Motores.
