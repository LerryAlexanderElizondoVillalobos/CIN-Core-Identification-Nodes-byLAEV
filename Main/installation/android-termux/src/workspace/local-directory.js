import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { resolve, relative, sep, dirname } from "node:path";

export function createLocalWorkspace(rootDirectory) {
  const root = resolve(rootDirectory);
  function resolveInside(relativePath = "") {
    const target = resolve(root, relativePath);
    const rel = relative(root, target);
    if (rel === ".." || rel.startsWith(".." + sep) || resolve(target) === root && relativePath) {
      const error = new Error("workspace_path_outside_root"); error.status = 400; throw error;
    }
    return target;
  }
  return {
    root,
    async list(relativeDirectory = "") {
      const directory = resolveInside(relativeDirectory);
      const entries = await readdir(directory, { withFileTypes: true });
      const output = [];
      for (const entry of entries) {
        const path = relative(root, resolve(directory, entry.name)).split(sep).join("/");
        const info = await stat(resolve(directory, entry.name));
        output.push({ path, type: entry.isDirectory() ? "directory" : "file", size_bytes: info.size, modified_at: info.mtime.toISOString() });
      }
      return output.sort((a, b) => a.path.localeCompare(b.path));
    },
    async read(relativePath) {
      if (!relativePath) { const error = new Error("workspace_file_path_required"); error.status = 400; throw error; }
      const target = resolveInside(relativePath);
      const info = await stat(target);
      if (!info.isFile()) { const error = new Error("workspace_target_not_file"); error.status = 400; throw error; }
      return { path: relative(root, target).split(sep).join("/"), content: await readFile(target, "utf8"), size_bytes: info.size };
    },
    async write(relativePath, content) {
      if (!relativePath || typeof content !== "string") { const error = new Error("workspace_path_and_text_content_required"); error.status = 400; throw error; }
      const target = resolveInside(relativePath);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content, "utf8");
      return { path: relative(root, target).split(sep).join("/"), saved: true, size_bytes: Buffer.byteLength(content, "utf8") };
    }
  };
}
