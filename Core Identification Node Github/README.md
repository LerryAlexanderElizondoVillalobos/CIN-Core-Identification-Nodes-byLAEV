# Core Identification Node Github

This directory groups the GitHub-operated CIN node entry points, the Genesis Environment Certificate, and the first node directory.

## Directory structure

```text
Core Identification Node Github/
├── CIN Lobby.url
├── Install Genesis Manifest Certificate.url
├── CIN-GENESIS-ENVIRONMENT.cincert
└── CIN 001/
    └── README.md
```

## Direct access

- **CIN Lobby:** [Open the local CIN interface](http://127.0.0.1:1221), or open `CIN Lobby.url`. The local runtime must already be running.
- **Install Genesis Manifest Certificate:** [Download the Genesis Environment Certificate](https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/Core%20Identification%20Node%20Github/CIN-GENESIS-ENVIRONMENT.cincert), or open `Install Genesis Manifest Certificate.url`.

## Genesis Environment Certificate

`CIN-GENESIS-ENVIRONMENT.cincert` is the original declarative certificate created in [PR #33](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/pull/33). Its Genesis Environment Manifest collection depends on the environment collector and manifest registration work introduced in [PR #32](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/pull/32).

The certificate requests a purpose-limited environment manifest. Its declared collection profile includes operating system and architecture, allowlisted runtime configuration, supported hardware capabilities, a SHA-256 inventory of files under the CIN package root, network interface names, digest capabilities, and storage-configuration presence. It explicitly excludes credentials, private keys, arbitrary environment variables, user file contents, network payloads, and absolute paths.

## Current implementation boundary

The certificate file is present here, but the certificate runner and its execution workflow are still part of open PR #33 and have not yet been integrated into `main`. The PR currently provides a command-line execution path; operating-system double-click association and packaged runner installation are subsequent work.

The `CIN Lobby.url` shortcut points to the existing local runtime interface endpoint. The repository's current runtime documentation identifies that interface as a feasibility prototype, not the completed Genesis Lobby or Main Lobby. The link is therefore an entry point to the existing local interface, not evidence that the final Lobby has already been implemented.
