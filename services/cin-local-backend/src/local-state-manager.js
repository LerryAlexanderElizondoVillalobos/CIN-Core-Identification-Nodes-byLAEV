import { createPersistentStore } from "./persistent-store.js";

const DEFAULT_CONFIGURATION = Object.freeze({
  lobby_origin: process.env.CIN_LOBBY_ORIGIN ?? "https://lerryalexanderelizondo.github.io",
  backend_port: 2112,
  pairing_request_ttl_ms: 5 * 60 * 1000,
  pairing_session_ttl_ms: 24 * 60 * 60 * 1000,
  event_history_limit: 2000
});

const RESERVED_DOMAINS = new Set(["pairing", "configuration", "operations"]);

export function createLocalStateManager(options = {}) {
  const store = options.store ?? createPersistentStore(options);
  let snapshot = store.load();
  const domains = { ...(snapshot.domains ?? {}) };

  domains.configuration = { ...DEFAULT_CONFIGURATION, ...(domains.configuration ?? {}) };
  if (!domains.operations) domains.operations = { schema_version: 1, entries: [] };

  function commit(nextDomains, pairingState = {}) {
    const next = {
      schema_version: 2,
      requests: pairingState.requests ?? snapshot.requests ?? [],
      sessions: pairingState.sessions ?? snapshot.sessions ?? [],
      events: pairingState.events ?? snapshot.events ?? [],
      domains: nextDomains
    };
    store.save(next);
    snapshot = next;
  }

  // Migrate schema v1 in place while preserving all existing pairing records.
  if (snapshot.schema_version === 1 || !snapshot.domains || !snapshot.domains.configuration?.backend_port) commit(domains);

  function getDomain(name) {
    if (!Object.hasOwn(domains, name)) return null;
    return structuredClone(domains[name]);
  }

  function setDomain(name, value) {
    if (typeof name !== "string" || !/^[a-z][a-z0-9_-]{1,63}$/.test(name)) {
      throw new TypeError("Invalid state domain name.");
    }
    if (RESERVED_DOMAINS.has(name)) throw new Error("This state domain is managed by CIN.");
    const next = { ...domains, [name]: structuredClone(value) };
    commit(next);
    Object.assign(domains, next);
    return getDomain(name);
  }

  function updateDomain(name, updater, initialValue = {}) {
    if (typeof updater !== "function") throw new TypeError("A domain updater function is required.");
    const current = getDomain(name) ?? structuredClone(initialValue);
    const updated = updater(current);
    if (updated === undefined) throw new TypeError("A domain updater must return its next value.");
    return setDomain(name, updated);
  }

  function load() {
    return {
      schema_version: 1,
      requests: structuredClone(snapshot.requests ?? []),
      sessions: structuredClone(snapshot.sessions ?? []),
      events: structuredClone(snapshot.events ?? [])
    };
  }

  function save(pairingState) {
    commit({ ...domains }, pairingState);
  }

  function updateConfiguration(patch) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      throw new TypeError("A configuration object is required.");
    }
    const current = getDomain("configuration");
    const next = { ...current, ...patch };
    const allowed = new Set(Object.keys(DEFAULT_CONFIGURATION));
    for (const key of Object.keys(patch)) {
      if (!allowed.has(key)) throw new Error("Unknown runtime configuration field: " + key);
    }
    if (typeof next.lobby_origin !== "string") throw new TypeError("lobby_origin must be a URL origin.");
    const parsedOrigin = new URL(next.lobby_origin);
    if (!["http:", "https:"].includes(parsedOrigin.protocol) || parsedOrigin.origin !== next.lobby_origin) {
      throw new TypeError("lobby_origin must contain only an HTTP(S) origin.");
    }
    if (!Number.isInteger(next.backend_port) || next.backend_port < 1 || next.backend_port > 65535) {
      throw new TypeError("backend_port must be an integer between 1 and 65535.");
    }
    for (const key of ["pairing_request_ttl_ms", "pairing_session_ttl_ms", "event_history_limit"]) {
      if (!Number.isSafeInteger(next[key]) || next[key] < 1) {
        throw new TypeError(key + " must be a positive integer.");
      }
    }
    const updated = { ...domains, configuration: next };
    commit(updated);
    Object.assign(domains, updated);
    return getDomain("configuration");
  }

  function status() {
    return {
      enabled: true,
      schema_version: 2,
      storage_path: store.file,
      domains: Object.keys(domains).sort(),
      pairing_requests: snapshot.requests?.length ?? 0,
      sessions: snapshot.sessions?.length ?? 0,
      lifecycle_events: snapshot.events?.length ?? 0
    };
  }

  return { load, save, getDomain, setDomain, updateDomain, updateConfiguration, status, file: store.file };
}
