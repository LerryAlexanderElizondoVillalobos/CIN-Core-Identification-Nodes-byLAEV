# CIN Main — State Model V1

States are independent records of progress, not a single boolean "installed" or "ready" flag. The Lobby derives its display from persisted evidence.

## Installer state

`RELEASE_NOT_OBTAINED → RELEASE_OBTAINED → PACKAGE_VERIFIED → EXTRACTED → USER_INTEGRATED → APPLICATION_LAUNCHABLE`

A failed verification does not advance to extraction. Installation success does not imply node birth.

## Node lifecycle state

`UNINITIALIZED → ENVIRONMENT_AUDIT_AVAILABLE → GENESIS_MANIFEST_VALIDATED → GENESIS_MANIFEST_REGISTERED → BIRTH_PENDING → BIRTH_AUTHORIZED → BIRTH_RECORD_COMMITTED → BIRTH_RECORD_VERIFIED → BORN`

The Genesis Manifest must be the first logical CIN record in private local storage. The Node Birth Record is a separate record referencing it.

## Personal document association state

`PERSONAL_DOCUMENT_NOT_STARTED → PERSONAL_DOCUMENT_CANDIDATE → SIGNATURE_REQUESTED → SIGNATURE_VERIFIED → ASSOCIATION_PERSISTED`

A candidate or signature request is not a completed association. The persisted record must reference the exact Node Birth Record and verified signer result.

## Subsequent personal issuance state

`PERSONAL_ISSUANCE_NOT_STARTED → ISSUANCE_AUTHORIZATION_VERIFIED → PERSONAL_NUMBER_ALLOCATED → REGISTRATION_RECORDED → CREDENTIAL_ISSUED → CREDENTIAL_VERIFIED`

A local number allocation must preserve its allocation scope. It is not a global reservation unless a coordinating registry confirms it.

## Package Engine state

Package state:

`DISCOVERED → VERIFIED → RESOLVED → STAGED → INSTALLED → CONFIGURED → ENABLED`

Additional lifecycle states:

`DISABLED`, `UPDATE_PENDING`, `UPDATED`, `REMOVED`.

An installed engine may remain disabled or unconfigured. A package being discovered does not mean it is installed or trusted.

## Recovery and restart

After a full process restart, the Lobby and Package Engine reconstruct their state from persistent records and operation outcomes. In-memory UI state is never the sole source of lifecycle truth.

When a required record is missing, corrupt, unverified or references a missing predecessor, the UI presents the corresponding incomplete/recovery state. It must not infer success from a filename, candidate artifact or prior screen state.
