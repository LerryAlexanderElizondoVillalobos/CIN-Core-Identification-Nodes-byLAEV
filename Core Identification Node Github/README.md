# Core Identification Node Github

This directory is the **exclusive publication source** for the CIN Genesis Lobby GitHub Pages site. The Pages deployment workflow uploads only this directory; no other repository folders are published as the site.

## Directory structure

```text
Core Identification Node Github/
├── index.html
├── CIN Lobby.url
├── Install Genesis Manifest Certificate.url
├── CIN-GENESIS-ENVIRONMENT.cincert
├── CIN-NODE-BIRTH.cincert
└── CIN 001/
    └── README.md
```

## CIN Genesis Lobby

- **GitHub Pages Lobby:** [Open CIN Genesis Lobby](https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/)
- **Local shortcut:** Open `CIN Lobby.url`; it points to the published HTTPS Lobby.
- **Certificate:** [Download CIN Genesis Environment Certificate](https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/Core%20Identification%20Node%20Github/CIN-GENESIS-ENVIRONMENT.cincert).

The Lobby is a static GitHub Pages interface. It can publish and offer the certificate, but it cannot independently inspect a user's operating system, execute a local certificate, or write a manifest to local storage. Those functions require the CIN Certificate Runner and manifest engine.

## Genesis Environment Certificate

`CIN-GENESIS-ENVIRONMENT.cincert` is the declarative Genesis certificate (v1.0.1). It defines the environment collection profile and contains **12 bibliographic references in APA 7th edition** under `bibliographic_references`. The manifest generator is expected to transfer this block into each generated Genesis Environment Manifest, separately from observed environment data.

The declared collection profile includes operating system and architecture, allowlisted runtime configuration, supported hardware capabilities, a SHA-256 package file inventory, network interface names, digest capabilities, and storage-configuration presence. It excludes credentials, private keys, arbitrary environment variables, user file contents, network payloads, and absolute paths.

## CIN Node Birth Certificate

`CIN-NODE-BIRTH.cincert` is the declarative Node Birth Certificate (v1.0.0). It consumes the complete Genesis Environment Manifest and defines canonical SHA-256 fingerprinting, separate raw-byte provenance hashing, and deterministic derivation of CIN-NID, CIN-NSID and CIN-BID. The Lobby exposes this workflow directly below the Genesis interface: paste the full manifest, generate the cryptographic fingerprint, generate the birth-record manifest, download it, and optionally display its identifiers in the current browser's Lobby header.

The current browser implementation marks generated records `PREVIEW_NOT_ISSUED`. The derivation profile is still a candidate; it is not a production-approved issuance profile. The browser does not sign, authorize, register, or persist a birth record to the CIN network. The header action stores identifiers only in the current browser's local storage and does not change the public page for other visitors.

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
