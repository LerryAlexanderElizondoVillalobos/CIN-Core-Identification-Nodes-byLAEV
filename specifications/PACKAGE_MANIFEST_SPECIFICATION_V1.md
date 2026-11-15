# CIN Package Manifest Specification — Version 1

**Project:** CIN — Core Identification Nodes  
**Component:** Package Origin Verification Engine  
**Specification ID:** `cin.package-manifest`  
**Version:** 1.0.0  
**Status:** Proposed normative specification — implementation and interoperability testing pending  
**Author:** LAEV — Lerry Alexander Elizondo Villalobos

---

## 1. Scope

This specification defines the release manifest used by CIN to describe a ZIP distribution and authenticate that description before extraction and local execution.

Version 1 defines:

- a JSON manifest data model;
- deterministic serialization using JSON Canonicalization Scheme (JCS), RFC 8785;
- SHA-256 as the archive digest algorithm;
- Ed25519 as the manifest signature algorithm;
- a detached JSON signature envelope;
- publisher key identification and out-of-band trust requirements;
- verification and acceptance rules.

This specification authenticates the manifest and binds the exact ZIP byte sequence to it. It does not establish that package contents are safe, bug-free, or appropriate for a particular installation.

## 2. Normative profile

A conforming CIN Package Manifest v1 implementation MUST use the following profile:

| Function | Required profile |
|---|---|
| Manifest format | UTF-8 JSON |
| Canonical serialization | RFC 8785 JSON Canonicalization Scheme (JCS) |
| Archive digest | SHA-256 |
| Digest representation | 64 lowercase hexadecimal characters |
| Manifest signature | Ed25519 |
| Signature representation | Base64url without padding |
| Public key representation | 32 raw Ed25519 public-key bytes, Base64url without padding |
| Signature representation size | 64 raw signature bytes before Base64url encoding |
| Signature mode | Detached signature over canonical manifest bytes with CIN domain separation |

Implementations MUST NOT silently substitute another digest, canonicalization scheme, or signature algorithm under version 1. A future profile or specification version is required to introduce alternatives.

## 3. Distribution artifacts

A release consists of three logically separate artifacts:

```text
release/
├── cin-portable-package.zip
├── package-manifest.json
└── package-manifest.sig.json
```

The manifest and signature MUST be obtained as release metadata, not trusted merely because they are located beside the archive. The verifier MUST establish trust in the publisher public key through a separately provisioned trust store or another independently authenticated trust process.

The ZIP MUST NOT be treated as the authority for the public key that authenticates itself.

## 4. Manifest data model

The v1 manifest is a JSON object with exactly these top-level members:

| Member | Type | Requirement | Meaning |
|---|---|---|---|
| `specification` | string | Required | Exact value `cin.package-manifest` |
| `specification_version` | string | Required | Exact value `1.0.0` |
| `package` | object | Required | Package and archive description |
| `publisher` | object | Required | Publisher key reference |

### 4.1. Package object

The `package` object MUST contain:

| Member | Type | Requirement | Meaning |
|---|---|---|---|
| `id` | string | Required | Stable package identifier, lowercase reverse-DNS style recommended |
| `version` | string | Required | Release version, using the project's declared versioning policy |
| `filename` | string | Required | Exact ZIP filename, without directory path |
| `media_type` | string | Required | Exact value `application/zip` |
| `size_bytes` | integer | Required | Exact archive size in bytes |
| `digest_algorithm` | string | Required | Exact value `sha-256` |
| `digest` | string | Required | SHA-256 digest of the complete ZIP file bytes, lowercase hexadecimal |

The `filename` MUST be a single filename, not a path. The `size_bytes` value MUST be a non-negative integer representable exactly in the interoperable JSON integer range (0 through 9007199254740991).

The digest is calculated over the complete ZIP archive as received, byte for byte. It is not a digest of extracted files, the ZIP directory listing, or an uncompressed content stream.

### 4.2. Publisher object

The `publisher` object MUST contain:

| Member | Type | Requirement | Meaning |
|---|---|---|---|
| `key_id` | string | Required | Identifier of the public key used to sign this manifest |
| `signature_algorithm` | string | Required | Exact value `ed25519` |

The key identifier MUST resolve to a public key in the verifier's independently configured trust store. The key identifier is a lookup reference, not proof of trust.

### 4.3. Example manifest

The following is illustrative. Its digest, key identifier, and values are placeholders and MUST be replaced with values calculated for an actual release.

```json
{
  "specification": "cin.package-manifest",
  "specification_version": "1.0.0",
  "package": {
    "id": "org.bylaev.cin.portable",
    "version": "0.1.0",
    "filename": "cin-portable-package.zip",
    "media_type": "application/zip",
    "size_bytes": 123456,
    "digest_algorithm": "sha-256",
    "digest": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  "publisher": {
    "key_id": "ed25519:REPLACE_WITH_KEY_FINGERPRINT",
    "signature_algorithm": "ed25519"
  }
}
```

The example is not a valid signed release manifest.

## 5. Canonical serialization

The manifest MUST be parsed as JSON and serialized using RFC 8785 JCS to obtain the exact byte sequence to be signed.

Requirements:

1. The input MUST be valid UTF-8 JSON.
2. Duplicate object member names MUST be rejected.
3. Values MUST conform to the data model and constraints in this specification.
4. Strings MUST be Unicode NFC before publication; verifiers MUST reject strings that are not NFC rather than silently normalize them.
5. The canonical representation MUST be UTF-8 bytes produced by RFC 8785.
6. No byte-order mark, trailing newline, or additional bytes are included in the canonical representation.
7. The signature MUST be verified against the canonical representation reconstructed from the parsed manifest, not against arbitrary whitespace or key ordering in the received JSON file.

The manifest JSON file itself may be pretty-printed for readability. Its whitespace and object-member order do not affect the signed representation because JCS is used.

## 6. Key identifier

For this v1 profile, the publisher key identifier MUST be calculated as follows:

1. Obtain the 32 raw bytes of the Ed25519 public key.
2. Calculate SHA-256 over those 32 bytes.
3. Encode the 32-byte digest as 64 lowercase hexadecimal characters.
4. Prefix the result with `ed25519:`.

The resulting value is the `publisher.key_id`. The trust store MUST map this identifier to the corresponding public key and publisher trust metadata.

The key identifier does not convey authorization by itself. The trust store or authenticated key-provisioning process determines whether the key is trusted, permitted for package publication, active, expired, or revoked.

## 7. Detached signature envelope

The detached signature file `package-manifest.sig.json` MUST be a UTF-8 JSON object containing exactly:

| Member | Type | Required value |
|---|---|---|
| `format` | string | `cin.detached-signature` |
| `format_version` | string | `1.0.0` |
| `signature_algorithm` | string | `ed25519` |
| `key_id` | string | Same value as `publisher.key_id` in the manifest |
| `signature` | string | Base64url encoding without padding of the 64-byte Ed25519 signature |

The signature envelope is detached: the signature bytes are not embedded in the manifest being signed. The envelope's `key_id` MUST match the manifest's `publisher.key_id`.

Example shape (signature value is a placeholder):

```json
{
  "format": "cin.detached-signature",
  "format_version": "1.0.0",
  "signature_algorithm": "ed25519",
  "key_id": "ed25519:REPLACE_WITH_KEY_FINGERPRINT",
  "signature": "REPLACE_WITH_BASE64URL_SIGNATURE"
}
```

## 8. Exact signature input

To avoid ambiguity and cross-protocol reuse, v1 uses the following domain-separation prefix as literal ASCII bytes:

```text
CIN-PACKAGE-MANIFEST-V1\0
```

The signature input is the concatenation:

```text
signature_input =
    ASCII("CIN-PACKAGE-MANIFEST-V1\0")
    || JCS(manifest)
```

The publisher signs these exact bytes using Ed25519. The verifier reconstructs the same bytes and verifies the detached signature using the public key resolved from the trusted key identifier.

The signature does not cover the detached signature envelope. The manifest itself contains the algorithm and key identifier, and the envelope MUST repeat those values consistently.

## 9. Publisher-side release procedure

The release publisher MUST perform these operations in order:

1. Finalize the ZIP archive. No later repacking, metadata change, or byte modification is permitted.
2. Calculate the exact ZIP file size in bytes.
3. Calculate SHA-256 over the complete ZIP file.
4. Construct the manifest using the measured filename, size, digest, package identifier, version, and publisher key identifier.
5. Validate the manifest against this specification.
6. Serialize the manifest using RFC 8785 JCS.
7. Prefix the canonical bytes with the v1 domain-separation string.
8. Sign the resulting byte sequence using the publisher's Ed25519 private key, held outside the portable package.
9. Encode the 64-byte signature using Base64url without padding.
10. Write the detached signature envelope.
11. Publish the ZIP, manifest, and signature as one release set.

If the ZIP changes after step 3, the publisher MUST repeat the release procedure. A signature MUST NOT be reused for a modified archive or modified manifest.

## 10. Verifier procedure

A conforming verifier MUST:

1. Read the ZIP as bytes and calculate its size and SHA-256 digest. Streaming calculation SHOULD be supported so the complete archive need not be loaded into memory.
2. Parse the manifest as UTF-8 JSON, reject duplicate keys, and validate its exact v1 structure and field constraints.
3. Reconstruct the JCS canonical manifest bytes.
4. Validate the detached signature envelope and require its algorithm and key identifier to match the manifest.
5. Resolve the key identifier using the independently configured trust store.
6. Apply the trust policy for that key, including its package-publication authorization and current status.
7. Reconstruct the domain-separated signature input and verify the Ed25519 signature.
8. Compare the received ZIP filename, byte size, and calculated SHA-256 digest with the authenticated manifest values.
9. Return separate machine-readable results for manifest validity, signature validity, key trust, metadata match, and archive digest match.

The package is **verified for origin and byte integrity** only if all required checks succeed. Installation authorization remains a separate decision made by the local execution policy.

## 11. Failure states

At minimum, implementations MUST distinguish:

- `INVALID_MANIFEST`
- `UNSUPPORTED_SPECIFICATION_VERSION`
- `INVALID_SIGNATURE_ENVELOPE`
- `SIGNATURE_INVALID`
- `UNKNOWN_KEY`
- `UNTRUSTED_KEY`
- `REVOKED_OR_EXPIRED_KEY`
- `PUBLISHER_NOT_AUTHORIZED`
- `PACKAGE_METADATA_MISMATCH`
- `ARCHIVE_SIZE_MISMATCH`
- `ARCHIVE_DIGEST_MISMATCH`
- `VERIFICATION_INCOMPLETE`
- `VERIFIED`

A valid Ed25519 signature under an unknown key is not a trusted publisher signature. A digest match without a valid trusted signature is not a verified distribution. Any failed or incomplete required check MUST prevent the verifier from returning `VERIFIED`.

## 12. Trust lifecycle

The v1 manifest references a publisher key; it does not define the complete trust-store lifecycle. Before production deployment, CIN must specify how publisher keys are provisioned, authenticated, rotated, suspended, revoked, and recovered.

The initial trust anchor MUST be established independently of the ZIP and its accompanying manifest/signature. A key distributed only within the package being verified MUST NOT be accepted as a trust anchor for that same package.

The private signing key MUST remain outside the portable package. It may be held by an offline signing environment, hardware security module, external signing device, or another controlled publisher-side signing service. The verifier requires only the corresponding trusted public key.

## 13. Relationship to CIN architecture

The Package Manifest Specification is consumed by the Package Origin Verification Engine. It is separate from ESMT:

- the package manifest binds an exact software archive to authenticated release metadata;
- ESMT provides Merkle commitments and proofs for structured records and ledger data;
- the Certificate Engine manages certificate-related operations and trust material;
- the Request & Permission Engine governs operations requiring authorization;
- the Ledger Installation Engine consumes verification results and applies local execution policy.

The verifier is not required to possess a private key. Publisher-side signing and verifier-side validation are separate operational roles.

## 14. Conformance test requirements

Before an implementation is described as conforming, it MUST pass test vectors covering:

1. Valid manifest and valid signature with trusted publisher key.
2. ZIP modified by one byte.
3. ZIP with matching digest but invalid signature.
4. Valid signature under an unknown key.
5. Key known but not trusted for package publication.
6. Revoked or expired key according to trust policy.
7. Manifest filename mismatch.
8. Manifest size mismatch.
9. Malformed digest, malformed Base64url, and malformed JSON.
10. Duplicate JSON member names.
11. Non-NFC strings.
12. Unsupported specification version.
13. Manifest whitespace and key-order changes that preserve the same JCS canonical representation.
14. Signature alteration and key-identifier mismatch.

Test vectors MUST include exact input artifacts, expected canonical bytes, expected signature input, expected digest, and expected verification result. Implementations must not claim conformance solely because a happy-path test succeeds.

## 15. Status and next work

This document defines the proposed CIN Package Manifest v1 profile. It is a specification, not evidence that a verifier or publisher tool has already been implemented.

The next implementation work is:

1. produce independently reproducible manifest and signature test vectors;
2. implement a publisher-side manifest builder and signer;
3. implement the ZIP Origin Verification Engine;
4. validate interoperability between independent implementations;
5. integrate verified results with the portable package installation workflow.

---

## 16. Normative references

- **RFC 8785 — JSON Canonicalization Scheme (JCS):** https://www.rfc-editor.org/rfc/rfc8785
- **RFC 8032 — Edwards-Curve Digital Signature Algorithm (EdDSA):** https://www.rfc-editor.org/rfc/rfc8032
- **RFC 4648 — Base-N Encodings:** https://www.rfc-editor.org/rfc/rfc4648
- **FIPS 180-4 — Secure Hash Standard (SHA-256):** https://csrc.nist.gov/pubs/fips/180-4/upd1/final

These references define the underlying serialization, signature, encoding, and digest primitives. The CIN-specific manifest structure, domain-separation string, key identifier, and verification workflow are defined by this document.

---

*End of specification.*
