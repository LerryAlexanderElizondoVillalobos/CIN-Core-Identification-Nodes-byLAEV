import { createPersistentStore } from "./persistent-store.js";

const DEFAULT_CONFIGURATION = Object.freeze({
  lobby_origin: process.env.CIN_LOBBY_ORIGIN ?? "https://lerryalexanderelizondo.github.io",
  pairing_request_ttl_ms: 5 * 60 * 1000,
  pairing_session_ttl_ms: 24 * 60 * 60 * 1000,
  event_history_limit: 2000
});

const RESERVED_DOMAINS = new Set(["pairing", "configuration", "operations"]);

export function createLocalStateManager(options = {}) {
  const store = options.store ?? createPersistentStore(options);
  let snapshot = store.load();
  const domains = { ...(snapshot.domains ?? {}) };

  if (!domains.configuration) domains.configuration = { ...DEFAULT_CONFIGURATION };
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

  // Upgrade the in-memory snapshot on first use; the first subsequent write
  // stores the version-2 envelope while preserving legacy pairing records.
  if (snapshot.schema_version === 1 || !snapshot.domains) {
    commit(domains);
  }

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

  return { load, save, getDomain, setDomain, updateDomain, status, file: store.file };
}
