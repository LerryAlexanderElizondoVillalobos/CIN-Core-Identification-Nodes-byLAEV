# Core Identification Node Github

This directory is the **exclusive publication source** for the CIN Genesis Lobby GitHub Pages site. The Pages deployment workflow uploads only this directory; no other repository folders are published as the site.

## Directory structure

```text
Core Identification Node Github/
├── index.html
├── cin-github-config.js
├── cin-github-lobby.js
├── service-worker.js
├── Documentation/
├── CIN Lobby.url
├── Install Genesis Manifest Certificate.url
├── CIN-GENESIS-ENVIRONMENT.cincert
├── CIN-NODE-BIRTH.cincert
├── CIN-PERSONAL-REGISTRATION.cincert
└── CIN 001/
    └── README.md
```

## CIN Genesis Lobby

- **GitHub Pages Lobby:** [Open CIN Genesis Lobby](https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/)
- **Local shortcut:** Open `CIN Lobby.url`; it points to the published HTTPS Lobby.
- **Certificate:** [Download CIN Genesis Environment Certificate](https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/Core%20Identification%20Node%20Github/CIN-GENESIS-ENVIRONMENT.cincert).

The Lobby is a static GitHub Pages interface. It can publish and offer the certificate, but it cannot independently inspect a user's operating system, execute a local certificate, or write a manifest to local storage. Those functions require the CIN Certificate Runner and manifest engine.

## Genesis Environment Certificate

`CIN-GENESIS-ENVIRONMENT.cincert` is the declarative Genesis certificate (v1.1.0). It defines the environment collection profile and contains **12 bibliographic references in APA 7th edition** under `bibliographic_references`. The manifest generator is expected to transfer this block into each generated Genesis Environment Manifest, separately from observed environment data.

The certificate defines two separate execution profiles. The GitHub repository profile records repository metadata, source commit/tree and SHA-256 inventory beneath this publication root; it does not inspect the operator's local operating system, hardware or host network interfaces. The local package profile retains the local collection profile for the portable Certificate Runner. Both profiles exclude credentials and private keys.

## CIN Node Birth Certificate

`CIN-NODE-BIRTH.cincert` is the declarative Node Birth Certificate (v1.0.0). It consumes the complete saved Genesis Environment Manifest, calculates the canonical SHA-256 digest and raw-byte provenance digest, and derives candidate CIN-NID, CIN-NSID, CIN-BID and CIN-REF values under the certificate's declared derivation profile.

The GitHub Pages Lobby now loads the saved Genesis Manifest from the repository and generates a birth candidate from that exact document. It commits the candidate and updates the CIN 001 node profile so the Lobby header can reconstruct the candidate identifiers from GitHub after reload.

The candidate remains `PREVIEW_NOT_ISSUED`. The derivation profile is not production-approved, and this GitHub repository commit does not supply birth authorization, issuer signature, authoritative private local storage registration or independent birth verification. The header shows candidate status and must not present CIN 001 as BORN.

## CIN Personal Registration Certificate

`CIN-PERSONAL-REGISTRATION.cincert` is the third certificate descriptor and remains a development candidate. It requires an authoritative verified Node Birth Record, an explicit person-to-node association event and a separate Personal Issuance Authorization. The linked GitHub account identifies the operator only; it does not register a person.

The certificate defines the later CIN Personal Number and CIN Personal Credential flow. Full personal registration records and credentials are not written to this public repository by default.

## Pages deployment

Workflow: `.github/workflows/cin-genesis-lobby-pages.yml`

The workflow publishes **only** `Core Identification Node Github/` as the GitHub Pages artifact. To activate deployment, repository Settings → Pages → Build and deployment → Source must be set to **GitHub Actions**. The first workflow deployment will publish the Lobby at the URL above.


## GitHub-linked CIN 001 creation workflow

The Genesis Lobby now includes the GitHub connection and repository-progress workflow.

- [GitHub-linked node creation workflow specification](Documentation/Architecture/CIN_GITHUB_LINKED_NODE_CREATION_WORKFLOW_SPECIFICATION_v1.0.md)
- [Public GitHub App configuration](cin-github-config.js)
- [Browser GitHub integration](cin-github-lobby.js)
- [GitHub OAuth exchange Worker source and deployment instructions](../services/cin-github-oauth-worker/README.md)
- [CIN Personal Registration Certificate candidate](CIN-PERSONAL-REGISTRATION.cincert)

The Lobby workflow is designed to connect the operator's GitHub account, inspect the repository snapshot beneath this publication root, and save the CIN 001 Genesis Manifest and Node Birth candidate as GitHub progress records.

**Activation is still required:** create and install the GitHub App on this repository, deploy the OAuth exchange Worker, and configure the public Client ID and Worker URL in `cin-github-config.js`. The source code and documentation are committed, but the GitHub App and Worker have not been provisioned or deployed by this repository change.

Because this repository is public and the Pages workflow publishes the entire directory, saved repository manifests, progress records, node profile projections and birth candidates are public. Personal records and complete credentials must not be committed to public paths by default.

The web repository audit is not the local package/operating-system audit. The local Certificate Runner remains a separate execution profile.


## Current Genesis Lobby implementation status

- The published page includes the GitHub account-link control, OAuth callback processing, repository snapshot collector, GitHub Contents API save/read-back flow, node progress record and registry-driven header.
- The Genesis certificate has separate `github_repository` and `local_package` execution profiles. The repository profile describes the GitHub tree snapshot; the local profile retains the separate local package/runtime collection contract.
- The browser birth operation saves only a `PREVIEW_NOT_ISSUED` candidate and marks the identifiers as candidates in the node profile.
- The Personal Registration certificate is a development candidate. Personal issuance requires an authoritative born node, explicit person-to-node association and separately verified authorization.
- GitHub linking is not active until the GitHub App is created/installed and the OAuth exchange Worker is deployed and configured. See [Worker setup](../services/cin-github-oauth-worker/README.md).
- The GitHub repository and published Pages site are public. Public progress records are not a private DataRoot registration; do not commit private personal records or credentials here.
