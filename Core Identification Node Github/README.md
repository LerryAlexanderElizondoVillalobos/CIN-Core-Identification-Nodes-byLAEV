# Core Identification Node Github

This directory is the **GitHub Pages publication source** for the CIN Genesis Lobby. The Pages workflow publishes this directory only. The source code and local runtime prototype are maintained elsewhere in the repository.

## Published application structure

```text
Core Identification Node Github/
├── index.html
├── cin-github-config.js
├── cin-github-lobby.js
├── service-worker.js
├── CIN-GENESIS-ENVIRONMENT.cincert
├── CIN-NODE-BIRTH.cincert
├── CIN-GLOBAL-PERSONAL-DOCUMENT.cincert
├── CIN-PERSONAL-REGISTRATION.cincert
├── CIN Lobby.url
├── Documentation/
└── CIN 001/
    └── README.md
```

## Open the Lobby

- **CIN Genesis Lobby:** https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/
- **Local shortcut:** open `CIN Lobby.url`; it points to the published HTTPS Lobby.

## Creation sequence in the Lobby

The intended first-node workflow is performed from the published Lobby:

1. Link the operator's GitHub account.
2. Inspect the repository snapshot beneath `Core Identification Node Github/` using Genesis Certificate 1.
3. Save the complete GitHub repository Genesis Manifest and progress receipt.
4. Consume the saved Manifest with Node Birth Certificate 2, generate the CIN identifier candidate and save the birth candidate.
5. Run Personal Document and Node Marriage Certificate 3: connect MetaMask, derive the deterministic CIN Global Personal Document identifier from the wallet address and exact Node Birth document digest, then sign the EIP-712 marriage agreement.
6. Reconstruct the CIN 001 header from the saved node profile and its record references.
7. Continue to Personal Registration and Credential Certificate 4 only after authoritative node birth, the signed association and separate issuance authorization are available.

### Current implementation status

The page contains the GitHub connection control, OAuth callback processing, repository collector, SHA-256 file inventory, GitHub save/read-back workflow, progress record and registry-driven header.

**GitHub linking is prepared but not yet active.** Before the button can complete authorization, the GitHub App must be registered and installed on this repository, the OAuth exchange Worker must be deployed, and `cin-github-config.js` must be populated with the public App Client ID and deployed Worker endpoint. Follow the [GitHub App and Worker setup instructions](../services/cin-github-oauth-worker/README.md).

## Certificate 1 — Genesis Environment Certificate

`CIN-GENESIS-ENVIRONMENT.cincert` is version 1.1.0 and defines two separate execution profiles:

- **GitHub repository:** records the repository owner/name/id, branch, source commit/tree and SHA-256 inventory beneath this publication root. This profile does not inspect the operator's local operating system, hardware or host network interfaces.
- **Local package:** retains the separate local package/runtime collection profile for the portable CIN Certificate Runner.

A Genesis Manifest created by the GitHub Pages profile is a public repository progress record. It is not the private local DataRoot registration.

## Certificate 2 — CIN Node Birth Certificate

`CIN-NODE-BIRTH.cincert` is version 1.1.0. The GitHub Lobby consumes the saved Genesis Manifest and generates a birth candidate using the labels declared by this certificate.

The browser-generated result is saved as a separate `cin.node-birth-candidate` progress artifact in `CIN-001-NODE-BIRTH-CANDIDATE.json`, with status `PREVIEW_NOT_ISSUED`. It is not the authoritative `cin.node-birth-record` document. The identifier derivation profile remains a candidate and is not production-approved. Saving the JSON to GitHub does not supply birth authorization, issuer signature, authoritative private local storage registration or independent birth verification. The header marks all derived identifiers as candidates and must not present CIN 001 as BORN.

## Certificate 3 — CIN Global Personal Document and Node Marriage

`CIN-GLOBAL-PERSONAL-DOCUMENT.cincert` is the third certificate development candidate. It consumes the saved CIN 001 Node Birth document and a MetaMask-compatible EVM wallet. It derives a deterministic personal-document identifier from the normalized wallet address and the SHA-256 digest of the complete Node Birth document, then requests an EIP-712 signature accepting the association between the node and the generated personal document. Signature bytes are not used as identifier entropy, so the same address and same immutable Node Birth document always produce the same identifier.

The current Node Birth artifact is `PREVIEW_NOT_ISSUED`; therefore the generated personal document and marriage agreement remain non-authoritative candidates. The wallet signature proves control of the address and acceptance of the displayed association, not civil attributes or government recognition. Public repository publication requires explicit confirmation.

## Certificate 4 — CIN Personal Registration and Credential

`CIN-PERSONAL-REGISTRATION.cincert` remains a later-stage development candidate. It requires:

- an authoritative, verified Node Birth Record;
- an explicit person-to-node association event;
- a separately verified Personal Issuance Authorization.

The linked GitHub account identifies the operator only. It does not register a person or authorize issuance. The certificate describes the subsequent CIN Personal Number and CIN Personal Credential process. A locally allocated number must not be represented as globally reserved without a verified coordinating-registry reservation.

## Public repository and data handling

The repository is public, and the Pages workflow publishes this directory. Genesis manifests, node-birth candidates, progress records and node-profile projections committed here are publicly readable.

Do not commit GitHub access tokens, refresh tokens, client secrets, private signing keys, full personal registration records or complete personal credentials to this public directory. Public display of a CIN Personal Number must be an explicit publication decision. GitHub commit history remains publicly inspectable after a file is changed or deleted.

## Web and Local environments are separate

The GitHub Pages Lobby is a static web environment. It does not require or assume a local server at `127.0.0.1`, and it cannot independently inspect the operator's host operating system or local hardware.

The future portable local CIN application is a separate execution profile. Its local Certificate Runner and private DataRoot workflows must not be represented as completed merely because the web repository workflow has saved a public progress record.

## Certificate 3 — technical specification and schemas

- [CIN Global Personal Document and Node Marriage Certificate v1.0.0](Documentation/Architecture/CIN_GLOBAL_PERSONAL_DOCUMENT_AND_NODE_MARRIAGE_CERTIFICATE_v1.0.0.md)
- [Global Personal Document JSON Schema](Documentation/Architecture/schemas/CIN-GLOBAL-PERSONAL-DOCUMENT.schema.json)
- [Node-Personal Document Marriage JSON Schema](Documentation/Architecture/schemas/CIN-NODE-PERSONAL-DOCUMENT-MARRIAGE.schema.json)
- [MetaMask manual acceptance test](Documentation/Testing/CIN_GLOBAL_PERSONAL_DOCUMENT_METAMASK_ACCEPTANCE_v1.0.md)

## Development documentation

- [Documentation index](Documentation/README.md)
- [GitHub-linked node creation workflow specification](Documentation/Architecture/CIN_GITHUB_LINKED_NODE_CREATION_WORKFLOW_SPECIFICATION_v1.0.md)
- [Configuration documentation](Documentation/Configuration/README.md)
- [OAuth exchange Worker source and setup](../services/cin-github-oauth-worker/README.md)

## Pages deployment

Workflow: `.github/workflows/cin-genesis-lobby-pages.yml`

The workflow publishes **only** `Core Identification Node Github/`. Repository Settings → Pages → Build and deployment → Source must be set to **GitHub Actions**.
