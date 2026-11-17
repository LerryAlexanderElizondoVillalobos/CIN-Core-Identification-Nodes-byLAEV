# MetaMask Acceptance Test — CIN Global Personal Document and Node Marriage v1.0.0

**Target:** CIN Global Genesis Lobby, CIN 001  
**Certificate:** `CIN-GLOBAL-PERSONAL-DOCUMENT.cincert`  
**Test class:** Manual wallet/browser acceptance  
**Status:** Pending real MetaMask execution

## Preconditions

1. PR #41 is merged and the GitHub Pages deployment containing Certificate 3 is complete.
2. The CIN 001 Genesis Manifest and Node Birth candidate are present in the public repository.
3. MetaMask is installed in a supported desktop browser or the MetaMask mobile browser.
4. The operator has an EVM account available for a test signature.
5. No real personal attributes are entered; this prototype uses only the wallet address and Node Birth document reference.

## Test A — Wallet connection

1. Open the published CIN Global Genesis Lobby over HTTPS.
2. Select **Connect MetaMask**.
3. Approve account access in MetaMask.
4. Confirm the Lobby displays the checksummed wallet address and active chain ID.
5. Change accounts in MetaMask and confirm the Lobby updates the displayed address.
6. Change networks and confirm the chain ID updates.

**Expected:** no private key, seed phrase, token or transaction is requested.

## Test B — Agreement presentation and signature

1. Select **Create document and sign marriage agreement**.
2. Review the Lobby's confirmation describing the node-document association.
3. Review the MetaMask typed-data prompt.
4. Confirm the prompt contains the personal document identifier, Node Birth digest, CIN-NID, CIN-NSID, CIN-BID, CIN-REF, conditional CIN-ENID/CIN-PVID, subject address, agreement version and complete readable agreement terms.
5. Approve the signature.
6. Confirm the Lobby recovers the signer and reports an exact match with the connected address.

**Expected:** EIP-712 signature succeeds without a transaction or gas payment.

## Test C — Deterministic identifier

1. Record the generated CIN Global Personal Document identifier.
2. Repeat the creation/signing flow using the same wallet address and unchanged Node Birth document.
3. Compare identifiers.

**Expected:** identifiers match, even if signature bytes or signing timestamps differ.

4. Switch to a different EVM address and repeat.

**Expected:** identifier changes.

5. In a non-production test fixture, change the Node Birth document and repeat with the original address.

**Expected:** identifier changes because the Node Birth digest changed.

6. Reproduce the published vector in `examples/CIN-GLOBAL-PERSONAL-DOCUMENT-IDENTIFIER-TEST-VECTORS.json`.

**Expected:** SHA-256 result matches the vector exactly.

## Test D — Marriage agreement binding

Inspect the generated agreement JSON and confirm:

- `document_type` is `cin.node-personal-document-marriage`.
- The node party references every available node identifier (CIN-NID, CIN-NSID, CIN-BID, CIN-REF and conditional CIN-ENID/CIN-PVID) and the exact Node Birth digest.
- The personal-document party references the generated document ID and wallet address.
- The EIP-712 message contains the same document ID, Node Birth digest, available CIN node identifiers and subject address.
- The recovered signer equals the connected wallet address.
- Signature verification is `VERIFIED`.

**Expected:** both artifacts reference the same node, address, digest and personal document identifier.

## Test E — Candidate lifecycle

The currently published Node Birth source is `PREVIEW_NOT_ISSUED`.

**Expected:**
- Personal document remains `PREVIEW_NOT_ISSUED`.
- Marriage agreement remains `SIGNED_CANDIDATE`.
- Neither output is presented as authoritative issuance or as a completed node birth.

## Test F — Persistence and public disclosure

### Local path

1. Disconnect GitHub or decline public publication.
2. Complete the MetaMask signature.

**Expected:** the Lobby downloads both JSON artifacts locally.

### Public GitHub path

1. Complete GitHub App setup and link an operator account with repository write access.
2. Complete the MetaMask signature.
3. Read the public repository disclosure.
4. Explicitly approve publication.
5. Confirm both JSON files are created and read back.

**Expected:** no existing artifact is overwritten; public wallet address, signature and agreement are disclosed before the operator approves publication.

## Acceptance record

Record the following without publishing any secret material:

- Browser and operating-system version.
- MetaMask version.
- EVM chain ID.
- Test wallet address (only if the operator approves recording it).
- Personal document ID.
- Recovered signer match: PASS/FAIL.
- Same-address repeat: PASS/FAIL.
- Changed-address test: PASS/FAIL.
- Changed-Node-Birth test: PASS/FAIL.
- Local download: PASS/FAIL.
- Public GitHub write/read-back: PASS/FAIL.
- Screenshots of the MetaMask typed-data prompt with any sensitive wallet details redacted.

---

*Do not use a real personal registration record for this prototype acceptance test.*
