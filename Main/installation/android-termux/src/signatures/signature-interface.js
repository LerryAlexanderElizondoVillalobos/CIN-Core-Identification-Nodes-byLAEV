// Signing is deliberately independent of GitHub OAuth and repository access.
// This interface delegates signing to a future external signer (USB device or local companion).
export function createSignatureInterface(adapter = null) {
  return {
    get status() { return adapter ? "EXTERNAL_SIGNER_CONFIGURED" : "NO_SIGNER_CONFIGURED"; },
    async requestSignature(payload, context = {}) {
      if (!adapter) throw new Error("external_signer_not_configured");
      if (!payload || typeof payload !== "object") throw new Error("signature_payload_required");
      return adapter.sign(payload, context);
    }
  };
}
