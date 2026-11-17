// CIN authorization is a domain decision, separate from GitHub authentication and signing.
const decisions = new Map();
export function createPermissionEngine() {
  return {
    request({ operation, resource, reason }) {
      if (!operation || !resource) throw new Error("operation_and_resource_required");
      const requestId = crypto.randomUUID();
      const item = { request_id: requestId, operation, resource, reason: reason || null, status: "PENDING", created_at: new Date().toISOString() };
      decisions.set(requestId, item);
      return item;
    },
    decide(requestId, decision, actor) {
      const item = decisions.get(requestId);
      if (!item) throw new Error("permission_request_not_found");
      if (!["APPROVED", "REJECTED"].includes(decision)) throw new Error("invalid_permission_decision");
      item.status = decision;
      item.decided_at = new Date().toISOString();
      item.decided_by = actor || "local-operator";
      return item;
    },
    get(requestId) { return decisions.get(requestId) || null; }
  };
}
