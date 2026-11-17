import { mkdirSync, readFileSync, renameSync, writeFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

export function createPersistentStore({
  directory = process.env.CIN_DATA_DIR || join(homedir(), ".cin-local-backend", "data"),
  filename = "runtime-state.json"
} = {}) {
  const file = join(directory, filename);
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  try { chmodSync(dirname(file), 0o700); } catch {}

  function load() {
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8"));
      if (parsed?.schema_version !== 1) throw new Error("Unsupported runtime state schema.");
      return parsed;
    } catch (error) {
      if (error.code === "ENOENT") return { schema_version: 1, requests: [], sessions: [], events: [] };
      throw new Error("CIN runtime state could not be loaded: " + error.message);
    }
  }

  function save(state) {
    const temporary = file + "." + randomUUID() + ".tmp";
    const data = JSON.stringify({ schema_version: 1, ...state }, null, 2) + "\n";
    try {
      writeFileSync(temporary, data, { encoding: "utf8", mode: 0o600, flag: "wx" });
      chmodSync(temporary, 0o600);
      renameSync(temporary, file);
      try { chmodSync(file, 0o600); } catch {}
    } catch (error) {
      try { renameSync(temporary, temporary + ".failed"); } catch {}
      throw new Error("CIN runtime state could not be saved: " + error.message);
    }
  }

  return { load, save, file };
}
