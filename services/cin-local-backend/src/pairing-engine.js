import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

const REQUEST_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function token(bytes = 32) { return randomBytes(bytes).toString("base64url"); }
function equalSecret(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createPairingEngine({ now = () => Date.now(), store, configuration = {} } = {}) {
  let requestTtlMs = configuration.pairing_request_ttl_ms ?? REQUEST_TTL_MS;
  let sessionTtlMs = configuration.pairing_session_ttl_ms ?? SESSION_TTL_MS;
  let eventHistoryLimit = configuration.event_history_limit ?? 2000;

  function configure(next = {}) {
    requestTtlMs = next.pairing_request_ttl_ms ?? requestTtlMs;
    sessionTtlMs = next.pairing_session_ttl_ms ?? sessionTtlMs;
    eventHistoryLimit = next.event_history_limit ?? eventHistoryLimit;
    if (events.length > eventHistoryLimit) events.splice(0, events.length - eventHistoryLimit);
    persist();
  }
  const initial = store?.load?.() ?? {};
  const requests = new Map((initial.requests ?? []).map(item => [item.id, item]));
  const sessions = new Map((initial.sessions ?? []).map(item => [item.id, item]));
  const events = Array.isArray(initial.events) ? initial.events : [];

  function record(type, details = {}) {
    events.push({ event_id: randomUUID(), type, at: new Date(now()).toISOString(), ...details });
    if (events.length > eventHistoryLimit) events.splice(0, events.length - eventHistoryLimit);
  }
  function persist() {
    store?.save?.({
      requests: [...requests.values()],
      sessions: [...sessions.values()],
      events
    });
  }
  function expire() {
    const time = now();
    let changed = false;
    for (const item of requests.values()) {
      if (item.state === "PENDING" && item.expiresAt <= time) {
        item.state = "EXPIRED"; record("PAIRING_REQUEST_EXPIRED", { request_id: item.id }); changed = true;
      }
    }
    for (const item of sessions.values()) {
      if (item.state === "ACTIVE" && item.expiresAt <= time) {
        item.state = "EXPIRED"; item.secret = null;
        record("SESSION_EXPIRED", { session_id: item.id }); changed = true;
      }
    }
    if (changed) persist();
  }

  function request({ origin, label = "CIN Genesis Lobby" } = {}) {
    expire();
    const id = randomUUID(), pollSecret = token(), createdAt = now();
    requests.set(id, {
      id, origin, label: String(label).slice(0, 100), pollSecret,
      state: "PENDING", createdAt, expiresAt: createdAt + requestTtlMs, sessionId: null
    });
    record("PAIRING_REQUEST_CREATED", { request_id: id, origin });
    persist();
    return { request_id: id, poll_secret: pollSecret, state: "PENDING", expires_at: new Date(createdAt + requestTtlMs).toISOString() };
  }

  function list() {
    expire();
    return {
      requests: [...requests.values()].map(({ id, origin, label, state, createdAt, expiresAt }) => ({
        request_id: id, origin, label, state, created_at: new Date(createdAt).toISOString(), expires_at: new Date(expiresAt).toISOString()
      })).sort((a,b) => b.created_at.localeCompare(a.created_at)),
      sessions: [...sessions.values()].map(({ id, origin, label, state, createdAt, expiresAt }) => ({
        session_id: id, origin, label, state, created_at: new Date(createdAt).toISOString(), expires_at: new Date(expiresAt).toISOString()
      })).sort((a,b) => b.created_at.localeCompare(a.created_at)),
      events: events.slice(-100).reverse()
    };
  }

  function poll(id, secret) {
    expire();
    const item = requests.get(id);
    if (!item || !equalSecret(item.pollSecret, secret)) return { state: "NOT_FOUND" };
    if (item.state === "APPROVED") {
      const session = sessions.get(item.sessionId);
      if (!session || session.state !== "ACTIVE") return { state: session?.state ?? "EXPIRED" };
      return { state: "ACTIVE", session_id: session.id, session_token: session.secret, expires_at: new Date(session.expiresAt).toISOString() };
    }
    return { state: item.state };
  }

  function approve(id) {
    expire();
    const item = requests.get(id);
    if (!item || item.state !== "PENDING") return null;
    const createdAt = now();
    const session = { id: randomUUID(), secret: token(), origin: item.origin, label: item.label, state: "ACTIVE", createdAt, expiresAt: createdAt + sessionTtlMs };
    sessions.set(session.id, session);
    item.state = "APPROVED"; item.sessionId = session.id;
    record("PAIRING_REQUEST_APPROVED", { request_id: id, session_id: session.id });
    persist();
    return { session_id: session.id, state: "ACTIVE", expires_at: new Date(session.expiresAt).toISOString() };
  }

  function reject(id) {
    const item = requests.get(id);
    if (!item || item.state !== "PENDING") return false;
    item.state = "REJECTED";
    record("PAIRING_REQUEST_REJECTED", { request_id: id });
    persist();
    return true;
  }

  function revoke(id) {
    const session = sessions.get(id);
    if (!session || session.state !== "ACTIVE") return false;
    session.state = "REVOKED"; session.secret = null;
    record("SESSION_REVOKED", { session_id: id });
    persist();
    return true;
  }

  function authorize(id, secret, origin) {
    expire();
    const session = sessions.get(id);
    return Boolean(session && session.state === "ACTIVE" && equalSecret(session.secret, secret) && session.origin === origin);
  }

  expire();
  return { request, list, poll, approve, reject, revoke, authorize, persist, configure };
}
