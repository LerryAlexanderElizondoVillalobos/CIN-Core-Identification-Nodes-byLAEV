import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

const REQUEST_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function token(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}
function equalSecret(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createPairingEngine({ now = () => Date.now() } = {}) {
  const requests = new Map();
  const sessions = new Map();

  function expire() {
    const time = now();
    for (const [id, item] of requests) {
      if (item.state === "PENDING" && item.expiresAt <= time) item.state = "EXPIRED";
    }
    for (const [id, item] of sessions) {
      if (item.expiresAt <= time) {
        item.state = "EXPIRED";
        sessions.delete(id);
      }
    }
  }

  function request({ origin, label = "CIN Genesis Lobby" } = {}) {
    expire();
    const id = randomUUID();
    const pollSecret = token();
    const createdAt = now();
    requests.set(id, {
      id, origin, label: String(label).slice(0, 100), pollSecret,
      state: "PENDING", createdAt, expiresAt: createdAt + REQUEST_TTL_MS,
      sessionId: null
    });
    return { request_id: id, poll_secret: pollSecret, state: "PENDING", expires_at: new Date(createdAt + REQUEST_TTL_MS).toISOString() };
  }

  function list() {
    expire();
    return {
      requests: [...requests.values()].map(({ id, origin, label, state, createdAt, expiresAt }) => ({
        request_id: id, origin, label, state,
        created_at: new Date(createdAt).toISOString(),
        expires_at: new Date(expiresAt).toISOString()
      })),
      sessions: [...sessions.values()].map(({ id, origin, label, state, createdAt, expiresAt }) => ({
        session_id: id, origin, label, state,
        created_at: new Date(createdAt).toISOString(),
        expires_at: new Date(expiresAt).toISOString()
      }))
    };
  }

  function poll(id, secret) {
    expire();
    const item = requests.get(id);
    if (!item || !equalSecret(item.pollSecret, secret)) return { state: "NOT_FOUND" };
    if (item.state === "APPROVED") {
      const session = sessions.get(item.sessionId);
      if (!session) return { state: "EXPIRED" };
      if (item.delivered) return { state: "ACTIVE" };
      item.delivered = true;
      return { state: "ACTIVE", session_id: session.id, session_token: session.secret, expires_at: new Date(session.expiresAt).toISOString() };
    }
    return { state: item.state };
  }

  function approve(id) {
    expire();
    const item = requests.get(id);
    if (!item || item.state !== "PENDING") return null;
    const createdAt = now();
    const session = {
      id: randomUUID(), secret: token(), origin: item.origin, label: item.label,
      state: "ACTIVE", createdAt, expiresAt: createdAt + SESSION_TTL_MS
    };
    sessions.set(session.id, session);
    item.state = "APPROVED";
    item.sessionId = session.id;
    return { session_id: session.id, state: "ACTIVE", expires_at: new Date(session.expiresAt).toISOString() };
  }

  function revoke(id) {
    const session = sessions.get(id);
    if (!session) return false;
    session.state = "REVOKED";
    sessions.delete(id);
    return true;
  }

  function authorize(id, secret, origin) {
    expire();
    const session = sessions.get(id);
    return Boolean(session && session.state === "ACTIVE" &&
      equalSecret(session.secret, secret) && session.origin === origin);
  }

  return { request, list, poll, approve, revoke, authorize };
}
