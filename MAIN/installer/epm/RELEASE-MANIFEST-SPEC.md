# CIN EPM Release Manifest Contract
**Contract version:** 1.0 · **Status:** Draft for implementation

## Purpose
Define the metadata EPM must consume to discover a CIN Main Lobby release, evaluate the target environment, verify the exact downloaded bytes and prepare a transparent installation plan.

## Trust model
A release is official only when all of these checks succeed:
1. The manifest is signed by a CIN release-signing key already trusted by the EPM distribution.
2. The signing key fingerprint matches the locally pinned trust anchor.
3. The detached signature verifies over the exact manifest bytes.
4. The downloaded artifact SHA-256 matches the digest in that verified manifest.
5. The artifact target (OS family, distribution constraints, CPU architecture and runtime profile) matches the detected environment.

A public key downloaded beside a manifest is not a trust anchor. A key supplied by an arbitrary mirror or user is not sufficient to establish official provenance. Until LAEV publishes and pins the release public key/fingerprint, EPM must report authenticity as `unconfigured` and must not label a package official.

## Encoding
The signed manifest is UTF-8, LF line endings, key-value format, one key per line. No comments, duplicate keys, whitespace around keys, shell evaluation, variable expansion, or command substitution. Values are plain strings. The exact bytes are signed; do not normalize before signature verification.

Required fields:
- `manifest_format`: fixed value `cin-epm-release-v1`
- `product`: `cin-main-lobby`
- `release_version`: semantic version string
- `release_channel`: `stable`, `beta`, or `development`
- `artifact_file`: basename only
- `artifact_url`: HTTPS URL
- `artifact_sha256`: exactly 64 lowercase hexadecimal characters
- `artifact_format`: `deb`, `AppImage`, or `tar.gz`
- `os_family`: e.g. `debian`
- `architecture`: e.g. `arm64`
- `runtime_profiles`: comma-separated qualified runtime identifiers
- `minimum_kernel`: minimum Linux kernel version or `none`
- `libc`: required libc family/version or `none`
- `required_capabilities`: comma-separated capability identifiers
- `optional_capabilities`: comma-separated capability identifiers
- `dependencies`: comma-separated package names, or `none`

The publisher may add optional `release_notes_url` and `published_at`. Unknown fields are ignored by readers but remain covered by the signature.

## Detached signature
The detached signature is stored as `manifest.sig`. The signing algorithm and key format must be fixed by the release-key policy before production signing is enabled. Initial implementation target: OpenSSL Ed25519 with a PEM public key and detached signature. The public key fingerprint is pinned in the EPM source/configuration delivered through a trusted channel.

## Installation planning
EPM must produce a dry-run plan containing:
- detected target profile;
- selected release and artifact;
- mandatory dependency packages and current availability;
- missing required capabilities;
- optional dependencies;
- download destination and required disk space where measurable;
- signature, key-fingerprint and artifact-digest status;
- explicit statement that no installation has been performed.

The plan is installable only if compatibility is established, the signature and pinned key pass, the artifact digest passes, and every mandatory dependency/capability is satisfied. No package manager is invoked during planning.

## Failure states
Use distinct states: `manifest_missing`, `manifest_invalid`, `signature_missing`, `trust_anchor_unconfigured`, `untrusted_signing_key`, `signature_invalid`, `artifact_missing`, `digest_mismatch`, `target_mismatch`, `dependencies_missing`, `plan_ready`.

Never downgrade any authenticity failure to a warning or permit installation.

## Example
See `RELEASE-MANIFEST.example`. It is illustrative only and deliberately unsigned; it is not a published release and must never be treated as installable.
