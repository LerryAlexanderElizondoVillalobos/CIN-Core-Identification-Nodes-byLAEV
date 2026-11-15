# ADR-0005 — Zero-Cost Node Operation

- **Status:** Proposed — owner approval and implementation evidence required
- **Date:** 2026-11-15
- **Decision owner:** CIN project owner
- **Related:** M0 Architecture Baseline; [ADR-0002: Portable Runtime and ZIP Packaging Model](0002-portable-runtime-and-zip-packaging-model.md); [Project Status and Development Roadmap](../project/PROJECT_STATUS_AND_ROADMAP.md)

## Context

CIN is intended to operate as a distributed system whose individual node owners should not be required to pay recurring fees merely to install, launch, maintain or use the fundamental local capabilities of their own nodes.

The first delivery must prioritize a working, portable local node. Architectural choices must therefore be evaluated not only for technical feasibility, but also for their direct and indirect monetary requirements on node operators. A framework may be free to use while an implementation built around it still introduces mandatory paid hosting, subscriptions, proprietary services, per-node licensing or paid update infrastructure. Those dependencies must be evaluated separately.

This requirement does not mean that operating a computer has no real-world cost. Hardware, electricity, Internet access where used, storage media, maintenance time and optional equipment remain the responsibility of the operator. The requirement concerns monetary charges imposed by CIN's architecture or made mandatory by its implementation.

## Proposed decision

Adopt **Zero-Cost Node Operation** as a governing product and architecture requirement for the first functional CIN generation:

> A node owner must be able to obtain, install by extraction, launch, operate and maintain the fundamental local CIN node capabilities without mandatory software license payments, per-node fees, subscriptions, paid centralized services or recurring payments imposed by CIN.

The following rules apply:

1. **No per-node charges.** CIN must not impose a fee, royalty, activation payment or subscription for creating or operating a fundamental node.
2. **No mandatory paid services.** Core local workflows must not require a paid API, hosted database, SaaS account, commercial identity provider, paid certificate service or vendor-operated server.
3. **Local-first operation.** Capabilities that are defined as local must remain usable without permanent Internet connectivity. Network-dependent operations must be clearly distinguished and must not silently become prerequisites for unrelated local functions.
4. **Portable distribution.** Preserve the ZIP delivery model established by ADR-0002: download, verify, extract and run locally. Do not require an app store, conventional installer or paid distribution channel.
5. **License transparency.** Runtime, framework and dependency choices must permit the intended use and redistribution without mandatory per-node or per-user license payments. Required notices and license obligations must be documented.
6. **Optional paid extensions only.** Commercial hosting, managed services, premium support, optional integrations and advanced services may be offered in the future, but they must remain optional and must not disable or degrade the fundamental local node lifecycle when absent.
7. **No mandatory paid update channel.** Operators must have a viable way to obtain and verify releases without depending exclusively on a paid update service. Update integrity and publisher trust must be handled independently of the hosting provider.
8. **External equipment remains optional unless explicitly scoped.** A paid hardware signer or other accessory must not be required for basic local operation unless a separately approved capability explicitly requires it. Production private keys must remain outside the portable package.
9. **No framework is selected by this ADR.** Tauri, a browser-based local interface, Electron or another candidate must be assessed against this requirement; this ADR does not approve any particular stack.

## Scope of fundamental operation

For the first functional generation, the cost requirement applies to the capabilities that the project declares part of the local first-release acceptance path, including:

- extracting and launching the portable application;
- running local environment checks;
- preparing and validating local records;
- storing and recovering local records;
- executing local lifecycle operations where their required authorization material is available locally;
- verifying locally available documents, digests and signatures;
- closing and restarting the application without losing committed local data.

An operation that genuinely requires an external authority, a remote counterparty, a network resource or a physical signer must declare that dependency and its availability state. This ADR does not promise that every future network, institutional or globally coordinated service can be delivered without cost.

## Alternatives considered

### A. Zero-cost local core with optional paid extensions — proposed

The fundamental node remains independently usable. Operators may choose external paid services for convenience or additional capabilities without making them mandatory.

**Advantages:** aligns with node-owner autonomy; supports local operation; limits recurring operational dependencies; allows future commercial services without gating the core.

**Trade-off:** the project must maintain clear boundaries between local capabilities and genuinely external services.

### B. Mandatory hosted platform or subscription

Require every node to use a centrally hosted service, paid account or recurring subscription.

**Not adopted:** creates a permanent operational dependency, introduces a cost barrier for every operator and weakens the portable local-node model.

### C. Free framework but unrestricted reliance on commercial infrastructure

Choose a permissively licensed framework while allowing mandatory paid APIs, hosting or update services.

**Not adopted:** framework license cost alone does not establish zero-cost node operation. The complete dependency and release path must be evaluated.

## Acceptance criteria

This ADR may be marked Accepted only after the project owner approves the policy and the implementation evidence demonstrates all applicable criteria below:

1. **License audit:** inventory the runtime, framework, libraries and bundled assets; record licenses and confirm that no mandatory per-node, per-user or recurring software payment is required for the fundamental node.
2. **Clean portable launch:** on a supported host, obtain the release ZIP, verify it, extract it and launch the application without a paid account, paid installer, app-store purchase or vendor activation.
3. **Local operation:** demonstrate the defined local acceptance workflows with external network access disabled, except for operations explicitly classified as network-dependent.
4. **Persistence and recovery:** create and commit local records, close the application, relaunch it and recover the records without a hosted database or subscription.
5. **No required paid endpoint:** inspect runtime configuration and execution traces for mandatory paid APIs, SaaS endpoints, telemetry gates, commercial identity providers or vendor-controlled activation.
6. **Update independence:** document and demonstrate at least one release acquisition and integrity-verification path that does not require a paid update service or a single mandatory commercial host.
7. **Dependency transparency:** publish host prerequisites, optional equipment, external service requirements and any unavoidable operator expenses. Do not describe hardware, electricity or Internet access as free.
8. **Feature separation:** verify that absence or failure of an optional paid extension does not block the fundamental local node lifecycle.
9. **Reproducibility:** retain build instructions, dependency versions, test results and the exact release artifact digest used for acceptance.

A green documentation workflow, a framework's open-source license or a successful build alone is not sufficient evidence of acceptance.

## Consequences

- Runtime and packaging comparisons must include license obligations, host prerequisites, mandatory network calls, update delivery and total operator cost—not only development convenience.
- The core must have explicit boundaries between local engines and optional remote adapters.
- CI and release processes should favor reproducible builds and verifiable artifacts without requiring a paid service for node operation.
- Any proposed new dependency must state whether it introduces a mandatory payment, account, remote endpoint, hardware purchase or recurring maintenance cost.
- Optional commercial offerings may be added later through separately specified interfaces and must not redefine the zero-cost fundamental core.
- The requirement must be reflected in runtime, storage, update, trust, signer and integration acceptance tests.

## Limitations and interpretation

“Zero-cost” in this ADR means **no mandatory monetary payment imposed by CIN for fundamental node operation**. It does not mean zero total cost of ownership, zero resource consumption, free hardware, free Internet access, guaranteed availability of third-party hosting, or a promise that every future optional service will be free.

No specific framework, operating system support matrix, certificate authority, hosting provider or commercial model is approved by this ADR.

## Reconsideration

Any proposal to introduce a mandatory paid dependency into the fundamental node lifecycle requires an explicit replacement or amendment ADR, a documented impact analysis for existing node owners and approval by the project owner. A paid convenience or optional service does not by itself justify changing this decision.

---
*End of ADR.*
