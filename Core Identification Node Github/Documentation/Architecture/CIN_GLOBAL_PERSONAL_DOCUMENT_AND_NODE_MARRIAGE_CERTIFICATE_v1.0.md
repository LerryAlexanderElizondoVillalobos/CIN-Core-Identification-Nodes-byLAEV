# CIN Global Personal Document and Node Marriage Certificate — v1.0.0

**Document ID:** cin.global-personal-document-marriage  
**Status:** Development candidate  
**Execution target:** CIN Global Genesis Lobby  
**Certificate file:** `CIN-GLOBAL-PERSONAL-DOCUMENT.cincert`

## 1. Purpose

Certificate 3 consumes the CIN 001 Node Birth document and a MetaMask-compatible EVM wallet. It derives a deterministic CIN Global Personal Document identifier for the recovered wallet address and obtains the holder's explicit cryptographic acceptance of the relationship between the CIN node and that personal document.

The signature is the commitment step: the holder accepts the exact node-to-document association encoded in the EIP-712 agreement.

## 2. Inputs and lifecycle

Inputs:
- Saved CIN 001 Node Birth document, including CIN-BID.
- Active EVM address and chain ID supplied by MetaMask through EIP-1193.
- Explicit EIP-712 signature approval.

The GitHub Lobby accepts the existing `cin.node-birth-candidate` with status `PREVIEW_NOT_ISSUED` for prototype testing. Outputs based on that input remain non-authoritative candidates.

Production issuance requires an authoritative `cin.node-birth-record` with status `BORN`, together with approved schemas, issuer authorization, authoritative storage and independent verification.

## 3. Deterministic personal-document identifier

The identifier input is the RFC 8785 JCS canonicalization of:

```json
{
  "domain": "cin.global-personal-document.identifier",
  "version": "1",
  "subject_address": "<lowercase EVM address>",
  "node_birth_record_sha256": "<SHA-256 of JCS canonical Node Birth document>"
}
```

The identifier is:

```text
SHA-256(JCS(identifier_input))
```

Output format:

```text
cin:global-personal-document:v1:<lowercase SHA-256 hex>
```

The address used for derivation is the address recovered from the EIP-712 signature, normalized to lowercase. Signature bytes, signature timestamp and chain ID are excluded from identifier derivation. Therefore, the same recovered address and the same immutable Node Birth document always produce the same identifier. A different address or a different Node Birth document produces a different identifier.

## 4. Node-personal-document marriage agreement

The Lobby builds an EIP-712 typed-data agreement:

- Domain name: `CIN Node-Personal Document Marriage`
- Domain version: `1`
- Domain chain ID: active wallet chain
- Primary type: `CINMarriageAgreement`

Signed fields:
- `personalDocumentId`
- `nodeBirthRecordSha256`
- `cinBid`
- `subjectAddress`
- `agreementVersion`
- `terms`
- `termsSha256`

The agreement's human-readable terms state that the holder confirms control of the connected EVM address and accepts its association with the CIN Global Personal Document generated for that address and the referenced CIN node birth record.

MetaMask signs using `eth_signTypedData_v4`. The Lobby recovers the signer from the EIP-712 signature and requires an exact match with the connected address. It then recomputes the deterministic identifier using the recovered address.

This is a wallet signature, not a blockchain transaction; no gas payment is requested.

## 5. Outputs

### 5.1 CIN Global Personal Document candidate

Type: `cin.global-personal-document-candidate`

Contains the deterministic document ID, wallet address and chain reference, Node Birth digest, identifier derivation profile and lifecycle status.

### 5.2 CIN Node-Personal Document Marriage agreement

Type: `cin.node-personal-document-marriage`

Contains the node and personal-document references, accepted terms, EIP-712 domain and message, signature, recovered signer and verification result.

The two JSON artifacts are saved to separate repository paths only after explicit confirmation that their wallet address, signature and agreement will be publicly readable. If GitHub is not connected or publication is declined, the Lobby downloads both JSON artifacts locally.

## 6. Authority and meaning

When the input is the current browser Node Birth candidate:
- Personal document status: `PREVIEW_NOT_ISSUED`.
- Marriage agreement status: `SIGNED_CANDIDATE`.
- Authoritative registration: false.

The signature demonstrates control of the signing address and acceptance of the exact signed relationship. It does not establish civil attributes, proof of personhood, government recognition, issuer trust or global uniqueness.

Production issuance requires an authoritative BORN Node Birth Record, approved document schemas, separately defined issuer authorization, authoritative storage and independent verification.

## 7. Public repository handling

The CIN GitHub repository is public. Before saving, the Lobby must disclose that the wallet address, EIP-712 signature and marriage agreement will be publicly readable. The operator must explicitly confirm publication. If publication is declined or GitHub is not connected, both JSON artifacts are downloaded locally.

No private key or personal civil attributes are requested or stored by this prototype.

## 8. Acceptance criteria

1. MetaMask connection returns a valid EVM address and chain ID.
2. The Lobby loads the saved CIN 001 Node Birth document and validates CIN-BID.
3. Repeating identifier derivation with the same recovered address and exact Node Birth document returns the same identifier.
4. Changing the recovered address or Node Birth document changes the identifier.
5. MetaMask displays the typed-data agreement for explicit approval.
6. The signature recovers to the connected wallet address.
7. The personal document and marriage agreement reference the same address, document ID and Node Birth digest.
8. Outputs from the current Node Birth candidate remain clearly marked non-authoritative.
9. Public GitHub publication requires explicit confirmation and successful read-back; otherwise local JSON downloads are produced.
10. No private key is requested, exposed or stored.

---

*End of specification.*
