# CIN Node Lifecycle Architecture

**Project:** CIN — Core Identification Nodes  
**Status:** Proposed architecture; implementation pending  
**Related:** [Foundational Principles](../foundations/CIN_FOUNDATIONAL_PRINCIPLES.md) · [Genesis Preparation](GENESIS_PREPARATION_ARCHITECTURE.md) · [Package Verification](PACKAGE_ORIGIN_VERIFICATION.md)

## 1. Purpose

Defines the proposed lifecycle of a portable CIN instance, from receipt of its distribution package through pre-birth preparation, formal node birth, Lobby activation, and later ecosystem participation. Package verification and node genesis are separate operations.

## 2. Lifecycle

```text
Package received
      |
      v
Package origin and integrity verification
      |
      v
Portable package extracted
      |
      +------------------------------+
      |                              |
      v                              v
Enter Lobby                    Run pre-birth audit
                                     |
                                     v
                              Genesis Manifest
                                     |
                                     v
                              Private local storage
                                     |
                                     v
                              Node birth procedure
                                     |
                                     v
                              Node Birth Record
                                     |
                                     v
                              Lobby activation
                                     |
                                     v
                        Guided ecosystem preparation
                                     |
                                     v
                 Human association / certificates / ledgers /
                      permissions / network services
```

The two post-extraction paths are intentional. A user may enter the Lobby without first performing full genesis preparation. The project must define which Lobby functions are available before formal birth and which require a born-node state.

## 3. Stages

### Package verification
The Package Origin Verification Engine checks the ZIP against separately obtained release metadata and independently configured trust material. Its results distinguish archive digest, manifest validity, signature validity, publisher-key trust, metadata match, and installation authorization. A successful package check does not mean a node has been born.

### Extraction
The portable package is extracted to a configured location. Extraction provides the software structure from which the future node operates; it is not formal node birth.

### Pre-birth audit
The Environment Audit process examines relevant, technically accessible information subject to operating-system permissions and explicit collection rules. It distinguishes observed, declared, derived, external, unavailable, and not-collected data.

### Genesis Manifest
The manifest records the environment and CIN package context before formal birth. It is not the Node Birth Record, a human registration record, a certificate, or proof that every discovered capability is installed or active. Exact fields and serialization belong in a versioned specification.

### First local registration
The Genesis Manifest is intended to be the first logical record in private local storage. Minimal technical initialization (directory, database file, metadata structure) may precede it, but must not create an earlier application record. The implementation must test this ordering and specify atomicity, recovery, access control, integrity checks, and references.

### Node birth
The Node Birth process consumes the registered manifest and creates a distinct Node Birth Record. It should establish a node identifier under a specified profile, manifest reference and digest, birth timestamp and time basis, software and schema versions, initial state, public-key references if provisioned, authorization method, and integrity information.

Key generation, external signing, and certificate issuance must be explicitly assigned to birth or later setup. Private keys must never be embedded in the manifest or birth record. Node birth does not establish human registration, legal personality, state recognition, or network admission.

### Lobby
Before birth, the Lobby should state that the node is prepared and awaiting its birth procedure. After a valid birth record is created and verified, it may present the node as born. Displayed status must reflect records and checks that actually exist.

### Ecosystem preparation
After birth, the operator may configure storage, certificates, external signing, request and permission services, ledgers, Merkle services, and network connectivity. Discovery of a component does not mean it is installed, configured, trusted, or active.

## 4. Proposed high-level states

| State | Meaning |
|---|---|
| PACKAGE_UNVERIFIED | Package checks incomplete or unsuccessful |
| PACKAGE_VERIFIED | Required origin and integrity checks passed |
| EXTRACTED | Portable directory available |
| AUDIT_NOT_RUN | Pre-birth audit not executed |
| AUDIT_COMPLETED | Audit results available |
| GENESIS_MANIFEST_CREATED | Valid manifest generated |
| GENESIS_MANIFEST_REGISTERED | Manifest is first logical CIN record |
| BIRTH_PENDING | Prepared, but no verified birth record |
| BORN | Valid Node Birth Record exists and is verified |
| LOBBY_ACTIVE | Lobby accurately presents node state |
| ECOSYSTEM_SETUP_IN_PROGRESS | Post-birth configuration underway |
| OPERATIONAL | A defined operational profile passed its checks |

These are proposed states, not an implementation contract. Do not collapse package verification, genesis, birth, human association, and network admission into one “installed” state.

## 5. Human registration boundary

Human registration is a separate lifecycle. It must define evidence, consent, representation, duplicate and conflict handling, correction, appeal, recovery, credential lifecycle, privacy-preserving verification, and association changes.

A personal identifier must not be derived by naively concatenating device fingerprints, biometrics, or other sensitive raw attributes. Uniqueness, persistence, privacy, recovery, and governance must be specified before implementation.

## 6. Network boundary

A locally born node is not automatically a trusted or admitted network participant. Network participation requires separate protocol, key, policy, and admission conditions. Consensus must define evidence exchange, validation, conflict handling, governance, and review paths.

## 7. Architectural invariants

1. Package verification precedes trusting a distribution for installation.
2. Extraction is not node birth.
3. The Genesis Manifest describes pre-birth conditions.
4. The Genesis Manifest is the first logical CIN record in private local storage.
5. The Node Birth Record is distinct from the Genesis Manifest.
6. Node birth does not equal human registration or network admission.
7. Founding records remain distinguishable from later events.
8. Private keys and secrets are excluded from portable genesis records.
9. User-facing status reflects verifiable system state.

## 8. Status and next work

This is a proposed lifecycle architecture, not evidence that engines, records, storage guarantees, or Lobby states are implemented. Next work: specify the Genesis Manifest data model, first-record storage contract, and Node Birth Record format.

---
*End of document.*