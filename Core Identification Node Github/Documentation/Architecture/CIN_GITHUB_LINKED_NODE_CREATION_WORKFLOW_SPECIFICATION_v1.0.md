# CIN GitHub-Connected Genesis Workflow — Setup and Architecture v1.0

**Document ID:** cin.github-linked-genesis-workflow  
**Version:** 1.0.0  
**Status:** Implementation baseline — GitHub App and Worker provisioning required  
**Target UI:** GitHub Pages Genesis Lobby  
**Target node:** CIN 001

---

## 1. Objective

Make the CIN Genesis Lobby the operator's working environment for creating a CIN node and saving each milestone to the GitHub repository. The operator links a GitHub account, the Lobby inspects the repository folder that contains the ecosystem, and the certificate workflow creates and saves the initial manifest, node birth record and subsequent personal-registration record.

The Lobby header must be reconstructed from committed node-profile data, not from browser-only state.

This workflow supplements the portable local CIN architecture. A browser-based GitHub repository audit is not a substitute for the local operating-system audit required by the portable local runtime.

## 2. Fixed repository target

| Parameter | Value |
|---|---|
| Owner | LerryAlexanderElizondoVillalobos |
| Repository | CIN-Core-Identification-Nodes-byLAEV |
| Repository ID | 1458540194 |
| Branch | main |
| Published root | Core Identification Node Github/ |
| Initial node | CIN 001/ |
| GitHub Pages URL | https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/ |

The repository is public. All records committed into this repository are publicly readable. The workflow must display that fact before the first save and before any personal identifier or personal credential is published.

## 3. GitHub account linking

### 3.1 Selected integration

Use a GitHub App user-authorization flow with Authorization Code + PKCE and a small HTTPS token-exchange Worker.

A GitHub App is preferred over an OAuth App because app permissions are fine-grained. The App is installed only on the target CIN repository and requests only:

- Contents: Read and write.
- Metadata: Read-only.

During token exchange, pass the fixed repository ID so the user access token is limited to the intended repository. The GitHub App client secret remains in the Worker environment and is never published to GitHub Pages.

The browser keeps the short-lived user access token in page memory only. It does not write the token to localStorage, sessionStorage, configuration files, manifests or Git commits.

### 3.2 Required provisioning

GitHub App registration and Worker deployment are external account operations and are not completed merely by committing source files.

Required values:

- GitHub App client ID (public configuration).
- GitHub App client secret (Worker secret).
- Deployed Worker URL.
- Fixed repository ID: 1458540194.
- Exact Pages callback URL.

The Worker source and deployment instructions are in services/cin-github-oauth-worker/. Public browser configuration is in Core Identification Node Github/cin-github-config.js.

### 3.3 Account meaning

The linked GitHub account authenticates the operator who is carrying out repository operations. It does not by itself establish a person's attributes, a person-to-node association, a CIN Personal Number or an authorization to issue a CIN credential.

## 4. Certificate sequence

### Certificate 1 — Genesis Environment Certificate

The Genesis certificate supports distinct collection contexts:

- **GitHub repository context:** inspects the selected repository, branch, commit, tree and the file inventory beneath Core Identification Node Github/. It computes SHA-256 for the inventory entries it actually reads. The manifest records the collection scope and limitations. It does not claim to have inspected the operator's local operating system, hardware or network interfaces.
- **Local package context:** the existing local Certificate Runner may perform the full local package/runtime audit when the portable CIN application is used. This remains a separate local workflow.

The repository manifest references the repository snapshot (commit and tree) inspected before it was saved. Its GitHub profile is a public repository progress artifact; it is not the private local DataRoot registration. Its type-specific JSON Schema and the final mapping to the proposed Common Document Model remain pending review.

### Certificate 2 — CIN Node Birth Certificate

Consumes the complete Genesis Environment Manifest. The **local authoritative profile** is intended to produce the CIN Node Birth Record after the required lifecycle conditions pass. The **GitHub repository profile** currently produces only a separate `cin.node-birth-candidate` progress artifact with status `PREVIEW_NOT_ISSUED`.

The current identifier derivation profile remains a proposed candidate until approved and supported by independent conformance vectors. Saving the browser candidate JSON to GitHub records development progress; it does not create a `BORN` state, supply authorization, sign the record or register a local authoritative birth.

A node may be presented as BORN only after the lifecycle contract's separate authorization, record commit and independent verification conditions pass.

### Certificate 3 — CIN Global Personal Document and Node Marriage

The third certificate is `CIN-GLOBAL-PERSONAL-DOCUMENT.cincert`. It consumes the saved CIN 001 Node Birth document and a MetaMask-compatible EVM wallet. It derives the deterministic personal-document identifier from the normalized wallet address and the SHA-256 digest of the complete Node Birth document, then requests an EIP-712 signature accepting the node-to-document marriage agreement. The Lobby recovers the signer and verifies it matches the connected wallet address.

The identifier excludes signature bytes, signature timestamp and chain ID; the same address and same immutable Node Birth document therefore produce the same identifier. The signed agreement binds the identifier, Node Birth digest, CIN-BID, address and terms digest. The wallet signature is an explicit commitment to the association, not a transaction or proof of civil attributes.

The current browser Node Birth artifact is `PREVIEW_NOT_ISSUED`, so the personal document and marriage agreement remain candidates. The Lobby requires explicit confirmation before publishing the address, signature and agreement to the public repository. See `CIN_GLOBAL_PERSONAL_DOCUMENT_AND_NODE_MARRIAGE_CERTIFICATE_v1.0.0.md`.

### Certificate 4 — CIN Personal Registration and Credential

The third certificate is CIN-PERSONAL-REGISTRATION.cincert. It consumes:

- an authoritative, verified Node Birth Record;
- an explicit person-to-node association event;
- a separately verified Personal Issuance Authorization.

It coordinates generation of the CIN Personal Number, a cin.personal-registration record and the subsequent cin.personal-credential issuance/verification process. It does not derive a personal number from the GitHub username or from the technical CIN-NID.

A locally generated CIN Personal Number is marked PERSONAL_REGISTERED_LOCAL. It must not be described as globally unique or reserved without a verified response from a defined coordinating registry. The credential must not be described as issued until the issuer, signer, authorization and independent verification requirements have passed.

## 5. Repository progress records

The initial public repository paths are:

    Core Identification Node Github/
    └── CIN 001/
        ├── README.md
        ├── records/
        │   ├── genesis/
        │   │   └── CIN-001-GENESIS-ENVIRONMENT-MANIFEST.json
        │   ├── birth/
        │   │   └── CIN-001-NODE-BIRTH-CANDIDATE.json
        │   └── personal-registration/
        │       └── CIN-001-PUBLIC-PERSONAL-REGISTRATION.json
        ├── state/
        │   └── CIN-001-PROGRESS.json
        └── registry/
            └── CIN-001-NODE-PROFILE.json

Each successful save is a Git commit. Progress records carry the source document path, document ID, status and Git commit reference. The Lobby must not advance to a completed stage when a GitHub write fails or returns an uncertain result.

The public-personal-registration path is a public projection only. Full personal records and credentials must remain in an approved private store unless the operator explicitly confirms publication of their contents.

## 6. Lobby header

The header is a read model reconstructed from `CIN 001/registry/CIN-001-NODE-PROFILE.json` and the repository records it references. During the web-preview stage these references are public progress artifacts; authoritative local records will become the source only after their issuance and registration contracts are implemented.

Expected fields as they become available:

- Node label: CIN 001.
- Genesis Manifest ID and registration status.
- CIN-NID.
- CIN-NSID.
- CIN-BID.
- CIN-REF.
- CIN-ENID and CIN-PVID when their conditional derivation prerequisites apply.
- CIN Personal Number and allocation status, after personal registration.
- CIN Personal Registration ID and CIN Personal Credential ID/status, when issued and explicitly approved for public display.
- Node lifecycle status and latest record reference.

Before birth authorization and commit succeed, node identifiers must be marked as derived candidate/preview values. The header must never convert a draft into a BORN status merely because it is present in a repository file.

## 7. Public repository disclosure

Because the target repository is public and its Pages workflow publishes the entire Core Identification Node Github directory:

- Genesis repository manifests may contain public repository metadata and a public file inventory.
- Do not include credentials, access tokens, private keys, browser session tokens or unrelated personal data.
- A personal number displayed in the public Lobby header is intentionally public. The operator must explicitly confirm before publishing it.
- The complete personal credential should not be stored in a public path by default.
- GitHub commit history is durable and publicly inspectable; deleting a file does not erase prior commit history.

## 8. Current implementation boundary

This specification and the Worker source prepare the integration. The GitHub App must still be registered, installed on the target repository, and its Worker deployed with the required environment values. Until those steps are completed, the Lobby cannot complete an authenticated GitHub write.

The fourth certificate is a development candidate. Its descriptor does not replace the required Personal Registration Service, authorization engine, number allocator, signer or credential verifier.

## 9. Acceptance sequence

1. The Lobby displays the GitHub connection control and reports configuration readiness.
2. The operator authorizes the GitHub App.
3. The Lobby identifies the authenticated GitHub operator and validates write access to the intended repository.
4. The repository Genesis collector reads the target root directory and creates a complete, scope-labelled manifest.
5. The Lobby commits the manifest and a progress receipt to GitHub.
6. The Node Birth workflow consumes that exact committed manifest and saves its candidate/authorized result according to its true status.
7. The profile projection updates and the public Lobby header reconstructs the saved identifiers.
8. The third certificate becomes executable only when an authoritative birth, explicit person-node association and separate personal-issuance authorization are available.
9. The personal number and credential status are represented according to their actual allocation, signature and verification state.

---

*End of document.*

## 10. Current Lobby implementation

The public Genesis Lobby now contains:
- GitHub App authorization control and OAuth callback processing using PKCE.
- Repository ID and write-permission verification after linking.
- Repository tree inspection and SHA-256 inventory for the selected publication root.
- A Genesis Manifest save workflow with GitHub read-back verification.
- A birth-candidate workflow that consumes the saved Genesis Manifest and the domain labels from the published Node Birth Certificate.
- GitHub progress and node-profile projections.
- A header reconstructed from the saved CIN 001 node profile, including core and conditional node identifiers plus future personal-registration references.
- A MetaMask EIP-712 CIN Global Personal Document and Node Marriage certificate stage.\n- A separate, later-stage Personal Registration and Credential certificate stage.

The connection control remains in a setup-required state until the GitHub App is registered/installed and the OAuth exchange Worker is deployed and configured. The user-facing connection flow must not be reported as operational until that external setup and an end-to-end save test succeed.

The browser-generated birth result is a `cin.node-birth-candidate` with status `PREVIEW_NOT_ISSUED`. The authoritative `cin.node-birth-record` remains pending the reviewed document schema/envelope, birth authorization, issuer/signature policy, private local durable commit and independent verification. The public GitHub commit is a progress record, not proof of any of those authoritative lifecycle events.


## 11. Document-contract boundary

The repository workflow currently saves two public progress artifacts:

- `cin.genesis-environment-manifest` with a GitHub repository snapshot profile and an explicit pending type-specific schema status.
- `cin.node-birth-candidate` with `PREVIEW_NOT_ISSUED` and a pending candidate schema status.

These artifacts permit the web Lobby to preserve sequence and progress. They do not claim conformance to a finalized type-specific JSON Schema or private CIN record registration. The official `cin.node-birth-record`, personal registration record and personal credential must use the reviewed CIN Common Document Model envelope and their approved type-specific schemas when their authoritative engines are implemented.

The existing Common Document Model and ADR-0003 are proposed/draft contracts. Their envelope and cryptographic profile must not be described as production-approved until the repository's review and conformance-vector gates are completed.
