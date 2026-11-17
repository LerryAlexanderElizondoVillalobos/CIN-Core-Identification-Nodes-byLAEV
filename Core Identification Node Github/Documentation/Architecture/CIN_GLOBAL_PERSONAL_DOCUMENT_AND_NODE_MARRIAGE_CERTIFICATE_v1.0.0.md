# CIN Global Personal Document and Node Marriage Certificate — v1.0.0

**Document ID:** cin.global-personal-document-marriage  
**Status:** Development candidate  
**Execution target:** CIN Global Genesis Lobby

## 1. Purpose

Certificate 3 consumes the CIN 001 Node Birth document and uses MetaMask to create a deterministic CIN Global Personal Document identifier and obtain the holder's explicit cryptographic acceptance of the relationship between the CIN node and that personal document.

The signature is the commitment step: the wallet holder accepts the specific node-to-document association represented by the signed agreement.

## 2. Inputs

- Saved CIN 001 Node Birth document, including CIN-BID.
- Active EVM address supplied by MetaMask through EIP-1193.
- Active EVM chain ID.
- Explicit EIP-712 signature approval.

The current Lobby accepts the saved `cin.node-birth-candidate` with status `PREVIEW_NOT_ISSUED` for prototype testing. This cannot produce an authoritative personal document. Production issuance requires `cin.node-birth-record` with status `BORN`.

## 3. Deterministic identifier

The identifier input is the JCS-canonical JSON object containing domain `cin.global-personal-document.identifier`, version `1`, lowercase EVM address and SHA-256 digest of the complete Node Birth document.

The Lobby first derives the proposed identifier from the connected address, then signs a typed-data message that includes that identifier. After signing, it recovers the signer from the EIP-712 signature, requires an exact match with the connected address, and recomputes the identifier using the recovered signer address and the same Node Birth digest. Only the recomputed value is accepted. The identifier is `SHA-256(JCS(identifier_input))`, formatted as `cin:global-personal-document:v1:<lowercase SHA-256 hex>`.

Raw signature bytes, signature timestamp and chain ID are excluded. The signature is nevertheless used to recover and verify the signer address, and that recovered address is the authoritative subject-address input for the final identifier recomputation. The same address and same immutable Node Birth document therefore always produce the same identifier, including when the holder signs again. A different address or Node Birth document produces a different identifier.

## 4. Marriage agreement and MetaMask signature

The Lobby constructs EIP-712 typed data using domain name `CIN Node-Personal Document Marriage`, version `1`, and the active wallet chain ID. The primary type is `CINMarriageAgreement`.

Signed fields: `personalDocumentId`, `nodeBirthRecordSha256`, `cinBid`, `subjectAddress`, `agreementVersion`, and `termsSha256`.

MetaMask signs through `eth_signTypedData_v4`. The Lobby recovers the signer and requires an exact match with the connected wallet address. No transaction or gas payment is requested.

The readable commitment says the wallet holder accepts the association between the CIN node in the referenced Node Birth document and the personal document generated for the connected address.

## 5. Outputs

1. `cin.global-personal-document-candidate`: deterministic document ID, wallet address, Node Birth digest, derivation profile and lifecycle status.
2. `cin.node-personal-document-marriage`: node and personal-document references, accepted terms, EIP-712 domain/message/signature, recovered signer and verification result.

The two artifacts are saved separately after explicit public-publication confirmation, or downloaded locally when GitHub is not connected or publication is declined.

## 6. Lifecycle and authority

When the input is the current browser Node Birth candidate, the personal document remains `PREVIEW_NOT_ISSUED`, the agreement is `SIGNED_CANDIDATE`, and authoritative registration is false.

The signature demonstrates control of the address and acceptance of the signed relationship. It does not establish civil attributes, government recognition, issuer trust or global uniqueness. Production issuance requires an authoritative BORN Node Birth Record, approved schemas, issuer authorization, authoritative storage and independent verification.

## 7. Public repository handling

The CIN repository is public. Before saving, the Lobby discloses that the wallet address, signature and agreement will be publicly readable and requests explicit confirmation. No private key or personal civil attributes are requested or stored.

## 8. Acceptance criteria

1. MetaMask returns a valid address and chain ID.
2. The saved Node Birth document is loaded and CIN-BID validated.
3. Repeating derivation with the same address and exact Node Birth document returns the same identifier.
4. Changing the address or Node Birth document changes the identifier.
5. MetaMask displays the typed-data agreement for approval.
6. Signature recovery matches the connected address.
7. Both outputs reference the same address, document ID and Node Birth digest.
8. Candidate-based outputs remain non-authoritative.
9. Public GitHub writes require explicit confirmation and successful read-back.
10. No private key is requested, exposed or stored.

## 9. Deterministic identifier test vector

The canonical input and expected SHA-256 result are published in `examples/CIN-GLOBAL-PERSONAL-DOCUMENT-IDENTIFIER-TEST-VECTORS.json`. Implementations must reproduce the exact expected document ID before wallet signing is enabled.
