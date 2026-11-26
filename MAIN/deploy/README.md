# Official CIN development channel

The deploy channel is a release interface, not a mirror of arbitrary Git commits. Only explicitly approved deployable builds may be published here. The channel manifest must be canonical JSON signed with the project's Ed25519 publisher key. Never commit the private signing key.

Manifest shape (illustrative):
```json
{
  "schema": 1,
  "application": "cin-main-lobby",
  "build_hash": "<sha256 of canonical manifest body>",
  "components": [
    {"path":"cin_main.py","sha256":"<sha256>","size":1234,"url":"https://..."}
  ],
  "signature_url":"https://.../official-manifest.sig"
}
```

The public key must be provisioned to the operator independently at `~/.config/cin-main-lobby/deploy.pub`. Do not ship an unverified placeholder key.
