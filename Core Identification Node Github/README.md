# Core Identification Node Github

This directory is the **exclusive publication source** for the CIN Genesis Lobby GitHub Pages site. The Pages deployment workflow uploads only this directory; no other repository folders are published as the site.

## Directory structure

```text
Core Identification Node Github/
├── index.html
├── CIN Lobby.url
├── Install Genesis Manifest Certificate.url
├── CIN-GENESIS-ENVIRONMENT.cincert
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

## Pages deployment

Workflow: `.github/workflows/cin-genesis-lobby-pages.yml`

The workflow publishes **only** `Core Identification Node Github/` as the GitHub Pages artifact. To activate deployment, repository Settings → Pages → Build and deployment → Source must be set to **GitHub Actions**. The first workflow deployment will publish the Lobby at the URL above.

## CIN Node Birth Certificate

- **Certificate descriptor:** [CIN Node Birth Certificate](CIN-NODE-BIRTH.cincert)
- **Technical specification:** [CIN Node Birth Certificate Specification v1](../specifications/CIN_NODE_BIRTH_CERTIFICATE_SPEC_V1.md)
- **Output schema:** [CIN Node Birth Record v1](../specifications/schemas/cin-node-birth-record-v1.schema.json)

The Node Birth Certificate consumes the complete registered Genesis Environment Manifest and creates a separate Node Birth Record. Its descriptor is currently at specification stage: the runner action and production issuance remain pending P2 storage, P3 cryptography/verification, P5 Genesis and P6 authorization acceptance. Do not treat the descriptor as an executable certificate until the runner implementation and end-to-end tests are complete.
