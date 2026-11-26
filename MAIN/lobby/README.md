# CIN Main Lobby

The Main Lobby is installed with CIN Main and coordinates the three founding certificate processes.

## Process sequence

1. **Genesis Environment Certificate:** audit the permitted environment, generate and validate the Genesis Environment Manifest, and register it as the first logical CIN record in private local storage.
2. **CIN Node Birth Certificate:** import the complete registered Genesis Manifest, derive identifiers under the approved profile, obtain Node Birth Authorization, create the distinct Node Birth Record, commit and independently verify it.
3. **CIN Global Personal Document and Node Marriage Certificate:** consume the authoritative Node Birth Record, derive the personal-document identifier, request explicit external signing of the association, verify the signer and persist the document and agreement separately.

The later CIN Personal Registration and Credential certificate is a subsequent issuance phase, not one of these three founding processes.

## Lobby responsibilities

- Present the actual lifecycle state.
- Orchestrate dedicated certificate modules.
- Show candidate, authorized, registered, signed, issued and verified states distinctly.
- Rebuild its header from persisted records after restart.
- Keep the UI separate from record authority and certificate verification logic.

No missing or preview record may be presented as an authoritative completed process.
