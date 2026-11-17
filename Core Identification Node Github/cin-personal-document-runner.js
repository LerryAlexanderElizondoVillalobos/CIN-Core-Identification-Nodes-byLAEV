(() => {
  "use strict";

  const cfg = window.CIN_GITHUB_CONFIG || {};
  const repo = cfg.repository || {};
  const root = "Core Identification Node Github/CIN 001/records/birth/CIN-001-NODE-BIRTH-CANDIDATE.json";
  const certificateUrl = "./CIN-PERSONAL-REGISTRATION.cincert";
  const $ = id => document.getElementById(id);

  const setStatus = (message, kind) => {
    const el = $("personalDocumentStatus");
    if (!el) return;
    el.textContent = message;
    el.className = "status " + (kind || "info");
  };

  const utf8 = value => new TextEncoder().encode(value);
  const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  const canonicalize = value => {
    if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new Error("Non-finite number in source document.");
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) return "[" + value.map(canonicalize).join(",") + "]";
    if (typeof value === "object") {
      return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + canonicalize(value[k])).join(",") + "}";
    }
    throw new Error("Unsupported source document value.");
  };
  const sha256 = async bytes => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)));
  const jcsDigest = value => sha256(utf8(canonicalize(value)));
  const addressBytes = address => {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new Error("MetaMask returned an invalid Ethereum address.");
    return Uint8Array.from(address.slice(2).match(/.{2}/g), byte => parseInt(byte, 16));
  };
  const concat = (a, b) => {
    const out = new Uint8Array(a.length + b.length);
    out.set(a); out.set(b, a.length);
    return out;
  };

  async function loadBirthCandidate() {
    if (!repo.owner || !repo.name || !repo.branch) throw new Error("The public CIN repository configuration is incomplete.");
    const path = root.split("/").map(encodeURIComponent).join("/");
    const url = "https://raw.githubusercontent.com/" + encodeURIComponent(repo.owner) + "/" +
      encodeURIComponent(repo.name) + "/" + encodeURIComponent(repo.branch) + "/" + path;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load the saved CIN 001 Node Birth candidate (HTTP " + response.status + ").");
    const raw = await response.text();
    let birth;
    try { birth = JSON.parse(raw); } catch { throw new Error("The saved Node Birth candidate is not valid JSON."); }
    if (birth.document_type !== "cin.node-birth-candidate") throw new Error("The source is not a CIN Node Birth candidate.");
    if (birth.candidate_status !== "PREVIEW_NOT_ISSUED") throw new Error("Unexpected source birth-candidate status.");
    if (!birth.node || !birth.node.cin_bid || !birth.node.cin_nid) throw new Error("The Node Birth candidate does not contain the required CIN-BID and CIN-NID references.");
    return { birth, raw, digest: await jcsDigest(birth) };
  }

  async function loadCertificate() {
    const response = await fetch(certificateUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load Certificate 3.");
    const certificate = await response.json();
    if (certificate.certificate_type !== "cin.personal-registration" ||
        !certificate.wallet_approval || !certificate.identifier_derivation) {
      throw new Error("Certificate 3 does not contain the MetaMask personal-document execution profile.");
    }
    return certificate;
  }

  async function derivePersonalDocumentId(address) {
    const domain = utf8("CIN\0PERSONAL-DOCUMENT-ID\0v1\0");
    const digest = await sha256(concat(domain, addressBytes(address.toLowerCase())));
    return {
      digest,
      documentId: "cin:personal-document:v1:" + digest,
      personalNumber: "CIN-P-" + digest.slice(0, 24).toUpperCase()
    };
  }

  async function createPersonalDocument() {
    const button = $("createPersonalDocumentButton");
    button.disabled = true;
    try {
      if (!window.isSecureContext || !crypto.subtle) throw new Error("MetaMask signing requires the HTTPS Lobby and Web Crypto.");
      if (!window.ethereum || typeof window.ethereum.request !== "function") {
        throw new Error("MetaMask was not detected. Open this Lobby in a browser with the MetaMask extension or compatible wallet enabled.");
      }
      setStatus("Loading Certificate 3 and the saved CIN 001 Node Birth candidate…", "info");
      const [certificate, source] = await Promise.all([loadCertificate(), loadBirthCandidate()]);

      setStatus("Requesting account access from MetaMask…", "info");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!Array.isArray(accounts) || !accounts[0]) throw new Error("No wallet account was authorized.");
      const address = accounts[0].toLowerCase();
      addressBytes(address);
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      if (!/^0x[0-9a-f]+$/i.test(chainIdHex)) throw new Error("MetaMask returned an invalid chain ID.");
      const chainId = Number(BigInt(chainIdHex));
      if (!Number.isSafeInteger(chainId) || chainId < 0) throw new Error("The connected chain ID is outside the supported range.");

      const derived = await derivePersonalDocumentId(address);
      const requestedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const nonceBytes = crypto.getRandomValues(new Uint8Array(32));
      const nonce = hex(nonceBytes);

      const typedData = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" }
          ],
          CINPersonalDocumentApproval: [
            { name: "operation", type: "string" },
            { name: "certificateId", type: "string" },
            { name: "certificateVersion", type: "string" },
            { name: "nodeBirthDocumentType", type: "string" },
            { name: "nodeBirthCandidateStatus", type: "string" },
            { name: "nodeBirthDigest", type: "string" },
            { name: "cinBid", type: "string" },
            { name: "personalDocumentId", type: "string" },
            { name: "walletAddress", type: "address" },
            { name: "nonce", type: "string" },
            { name: "requestedAt", type: "string" },
            { name: "expiresAt", type: "string" }
          ]
        },
        primaryType: "CINPersonalDocumentApproval",
        domain: {
          name: "CIN Personal Document",
          version: "1",
          chainId
        },
        message: {
          operation: "APPROVE_CIN_PERSONAL_DOCUMENT_CREATION_AND_NODE_BINDING",
          certificateId: certificate.certificate_id,
          certificateVersion: certificate.certificate_version,
          nodeBirthDocumentType: source.birth.document_type,
          nodeBirthCandidateStatus: source.birth.candidate_status,
          nodeBirthDigest: source.digest,
          cinBid: source.birth.node.cin_bid,
          personalDocumentId: derived.documentId,
          walletAddress: address,
          nonce,
          requestedAt,
          expiresAt
        }
      };

      setStatus("Review the MetaMask typed-data request. It asks for approval of this CIN personal document and its association with the referenced CIN 001 birth candidate. It does not submit a blockchain transaction.", "info");
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [address, JSON.stringify(typedData)]
      });
      if (typeof signature !== "string" || !/^0x[0-9a-fA-F]+$/.test(signature)) {
        throw new Error("MetaMask did not return a valid signature payload.");
      }
      const accountsAfter = await window.ethereum.request({ method: "eth_accounts" });
      if (!Array.isArray(accountsAfter) || !accountsAfter.some(item => item.toLowerCase() === address)) {
        throw new Error("The selected wallet account changed or was disconnected during approval. No document was generated.");
      }

      const createdAt = new Date().toISOString();
      const personalDocument = {
        document_type: certificate.wallet_approval.output_document_type,
        schema_version: certificate.wallet_approval.schema_version,
        document_id: derived.documentId,
        document_status: "WALLET_APPROVED_CANDIDATE_NOT_ISSUED",
        generated_at: createdAt,
        certificate: {
          certificate_id: certificate.certificate_id,
          certificate_type: certificate.certificate_type,
          certificate_version: certificate.certificate_version
        },
        personal_document: {
          cin_personal_document_id: derived.documentId,
          cin_personal_number_candidate: derived.personalNumber,
          derivation_profile: certificate.identifier_derivation.profile_id,
          derivation_algorithm: certificate.identifier_derivation.algorithm,
          derivation_input: "normalized_evm_wallet_address",
          wallet_address: address,
          chain_id_at_approval: chainId,
          derivation_digest: derived.digest
        },
        node_binding: {
          agreement_type: "cin.node-personal-document-binding",
          agreement_status: "WALLET_APPROVED_CANDIDATE_PENDING_AUTHORITATIVE_NODE_BIRTH",
          node_id: source.birth.node.source_node_label || "CIN 001",
          source_node_birth_document_type: source.birth.document_type,
          source_node_birth_status: source.birth.candidate_status,
          source_node_birth_digest: source.digest,
          source_node_birth_path: root,
          cin_nid: source.birth.node.cin_nid,
          cin_bid: source.birth.node.cin_bid,
          personal_document_id: derived.documentId,
          statement: "The wallet controller approves creation of this CIN personal-document candidate and its technical association with the referenced CIN node birth candidate. This statement does not establish civil facts, legal personhood, an authoritative node birth, or a government-issued credential."
        },
        authorization: {
          operation: typedData.message.operation,
          method: "EIP-712 eth_signTypedData_v4",
          status: "SIGNATURE_RETURNED_BY_WALLET_PENDING_INDEPENDENT_VERIFICATION",
          domain: typedData.domain,
          message: typedData.message,
          signature,
          signer_address: address,
          chain_id: chainId,
          nonce,
          requested_at: requestedAt,
          expires_at: expiresAt
        },
        verification: {
          wallet_provider_returned_signature: true,
          cryptographic_signature_independently_verified: false,
          signer_address_recovered: false,
          issuer_signature: "NOT_PRESENT",
          authoritative_person_registration: false,
          authoritative_node_birth: false,
          global_number_reservation: false
        },
        storage: {
          mode: "LOCAL_DOWNLOAD_ONLY",
          public_github_commit: false,
          note: "This document contains a wallet address and signature. It is not committed to the public CIN repository."
        },
        lifecycle_limitations: [
          "The source Node Birth document is currently a PREVIEW_NOT_ISSUED candidate, not an authoritative BORN record.",
          "The wallet signature records approval and control of the signing address; it does not prove civil identity, legal personhood or the truth of personal attributes.",
          "The personal document identifier is derived deterministically from the normalized wallet address, not from the signature bytes.",
          "The signature contains a fresh nonce and expiry, so approval signatures may differ between requests while the personal document identifier remains the same for the same address.",
          "The signature must be independently verified and the person-to-node association must pass the authoritative registration process before issuance."
        ]
      };

      const blob = new Blob([JSON.stringify(personalDocument, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CIN-PERSONAL-DOCUMENT-CANDIDATE-" + derived.digest.slice(0, 16) + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      $("personalDocumentPreview").hidden = false;
      $("personalDocumentPreview").textContent = JSON.stringify({
        document_id: personalDocument.document_id,
        document_status: personalDocument.document_status,
        cin_personal_number_candidate: personalDocument.personal_document.cin_personal_number_candidate,
        wallet_address: address,
        chain_id_at_approval: chainId,
        source_cin_bid: source.birth.node.cin_bid,
        source_birth_status: source.birth.candidate_status,
        signature_status: personalDocument.authorization.status,
        binding_status: personalDocument.node_binding.agreement_status,
        storage: personalDocument.storage.mode
      }, null, 2);
      $("personalDocumentState").textContent = "Wallet approved · candidate downloaded";
      setStatus("MetaMask approval received. The CIN personal-document candidate and node-binding agreement have been generated and downloaded. The same wallet address produces the same document identifier; the approval signature is a separate, nonce-bound proof. No public GitHub record was created.", "ok");
    } catch (error) {
      if (error && error.code === 4001) setStatus("The wallet request was rejected by the user. No document was generated.", "error");
      else setStatus((error && error.message) || String(error), "error");
    } finally {
      button.disabled = false;
    }
  }

  const button = $("createPersonalDocumentButton");
  if (button) {
    button.addEventListener("click", createPersonalDocument);
    if (!window.ethereum) {
      $("personalDocumentWalletHint").textContent = "MetaMask was not detected in this browser. Install/open MetaMask or use a compatible wallet browser to run this certificate.";
    } else {
      $("personalDocumentWalletHint").textContent = "Wallet provider detected. The account is requested only after you press Create CIN personal document.";
    }
  }
})();
