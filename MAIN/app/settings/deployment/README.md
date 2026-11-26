# CIN Settings — Code Deployment

The engine generates component-level local manifests, verifies detached Ed25519 signatures on official manifests using a locally provisioned public key, compares component hashes, stages HTTPS files, and applies an explicitly confirmed proposal with rollback on post-apply failure.

## Publisher trust setup

Provision the publisher's Ed25519 public key independently at:

`~/.config/cin-main-lobby/deploy.pub`

The application never trusts a key delivered by the update manifest. The official channel publishes `official-manifest.json` and its detached signature at the URL declared by `signature_url`. Each component entry declares `path`, `sha256`, `size`, and HTTPS `url`.

The repository's bootstrap installer does not invent or silently install a publisher key. Until the operator provisions the real publisher key and the repository publishes a signed manifest, the UI must report deployment as not configured rather than claiming update availability.
