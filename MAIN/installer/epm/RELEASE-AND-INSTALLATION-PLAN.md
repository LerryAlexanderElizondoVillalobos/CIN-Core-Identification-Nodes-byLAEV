# CIN EPM — Release Discovery, Trust and Installation Planning

**Target increment:** 0.3.0 · **Status:** Contract and interfaces defined; production release verification not enabled.

## Work sequence
1. Publish a versioned release manifest for each Main Lobby artifact and target tuple.
2. Establish the CIN release-signing key policy; generate the key offline and publish the public-key fingerprint through a separately trusted channel.
3. Pin the public key/fingerprint in EPM. Never trust a key delivered only beside a package.
4. Implement release discovery from the official CIN GitHub Releases/API endpoint with bounded timeouts and clear offline behavior.
5. Verify the detached manifest signature before parsing release fields as trusted metadata.
6. Validate manifest schema and target compatibility.
7. Download to a staging directory; verify SHA-256 against the authenticated manifest.
8. Generate a dry-run dependency and installation plan.
9. Only after separate approval implement package-manager adapters and execute installation.

## Current boundary
EPM 0.2.0 performs environment analysis only. This increment defines the signed-manifest contract and release trust requirements. No official Main Lobby release manifest, release-signing public key, pinned fingerprint, or complete install contract has yet been established in the repository. Therefore EPM must not claim an official version, report an authenticity pass, download a release, or install Main Lobby.

## Required tests before enabling verification
- valid manifest + valid signature + pinned key;
- tampered manifest;
- signature from a different key;
- absent/unconfigured trust anchor;
- tampered artifact digest;
- wrong OS, architecture or runtime profile;
- missing mandatory dependency/capability;
- unavailable network and incomplete download;
- no install action during dry-run.
