# CIN Main Services

Services are deployable integration processes distinct from the CIN Main Linux runtime.

## Local backend service
The local pairing/state backend has been source-migrated from the legacy root service directory:
- package: `cin-local-backend`
- runtime: Node.js 22+
- launch: `npm start`
- tests: `npm test`

Location: `Main/services/cin-local-backend/`.

This service remains a local backend integration; it is not the Linux Main runtime or an authoritative issuance engine.
