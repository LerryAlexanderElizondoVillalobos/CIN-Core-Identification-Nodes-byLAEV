"""Component-aware, user-authorized CIN deployment primitives.

The official channel supplies a JSON manifest and detached Ed25519 signature.
The public key is provisioned locally at ~/.config/cin-main-lobby/deploy.pub;
it is never accepted from the downloaded manifest.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from ..network_access import NetworkAccessController, NetworkAccessError

APP_ID = "cin-main-lobby"
MANIFEST_VERSION = 1
DEFAULT_CHANNEL = "https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/MAIN/deploy/official-manifest.json"
APP_DIR = Path.home() / ".local/opt/cin-main-lobby"
CONFIG_DIR = Path.home() / ".config/cin-main-lobby"
DATA_DIR = Path.home() / ".local/share/cin-main-lobby"
KEY_PATH = CONFIG_DIR / "deploy.pub"
RECORD_PATH = DATA_DIR / "deployment-record.json"


class DeploymentError(RuntimeError):
    pass


def _canonical(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def _relative_component_path(value: str) -> Path:
    path = Path(value)
    if not value or path.is_absolute() or ".." in path.parts or "." in path.parts:
        raise DeploymentError(f"Invalid component path: {value!r}")
    return path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(manifest: dict) -> str:
    components = [{"path": item["path"], "sha256": item["sha256"], "size": item["size"]}
                  for item in sorted(manifest.get("components", []), key=lambda x: x["path"])]
    core = {"schema": manifest.get("schema"), "application": manifest.get("application"),
            "components": components}
    return hashlib.sha256(_canonical(core)).hexdigest()


def local_manifest(root: Path = APP_DIR) -> dict:
    components = []
    if root.exists():
        files = (
            path for path in root.rglob("*")
            if path.is_file()
            and "__pycache__" not in path.parts
            and path.suffix != ".pyc"
            and ".deploy-staging" not in path.parts
        )
        for path in sorted(files):
            rel = path.relative_to(root).as_posix()
            components.append({"path": rel, "sha256": sha256_file(path), "size": path.stat().st_size})
    body = {"schema": MANIFEST_VERSION, "application": APP_ID, "components": components}
    body["build_hash"] = fingerprint(body)
    return body


def verify_official_manifest(manifest: dict, signature: bytes, public_key: Path = KEY_PATH) -> None:
    if manifest.get("schema") != MANIFEST_VERSION or manifest.get("application") != APP_ID:
        raise DeploymentError("Official manifest schema or application mismatch.")
    if not public_key.is_file():
        raise DeploymentError(f"Publisher key is not configured: {public_key}")
    with tempfile.TemporaryDirectory(prefix="cin-verify-") as tmp:
        data = Path(tmp) / "manifest.json"
        sig = Path(tmp) / "manifest.sig"
        data.write_bytes(_canonical(manifest))
        sig.write_bytes(signature)
        result = subprocess.run(
            ["openssl", "pkeyutl", "-verify", "-pubin", "-inkey", str(public_key),
             "-rawin", "-in", str(data), "-sigfile", str(sig)],
            capture_output=True, text=True,
        )
        if result.returncode:
            raise DeploymentError("Official manifest signature verification failed.")


def fetch_official(channel_url: str = DEFAULT_CHANNEL) -> tuple[dict, bytes]:
    try:
        NetworkAccessController().require_enabled()
    except NetworkAccessError as exc:
        raise DeploymentError(str(exc)) from exc
    request = urllib.request.Request(channel_url, headers={"User-Agent": "CIN-Main-Lobby-Deploy/1"})
    with urllib.request.urlopen(request, timeout=20) as response:
        manifest = json.loads(response.read().decode("utf-8"))
    signature_url = manifest.get("signature_url")
    if not signature_url:
        raise DeploymentError("Official manifest does not declare signature_url.")
    with urllib.request.urlopen(signature_url, timeout=20) as response:
        signature = response.read()
    verify_official_manifest(manifest, signature)
    return manifest, signature


def compare(local: dict, remote: dict) -> dict:
    if remote.get("schema") != MANIFEST_VERSION or remote.get("application") != APP_ID:
        raise DeploymentError("Manifest does not describe this CIN application.")
    if fingerprint(remote) != remote.get("build_hash"):
        raise DeploymentError("Official manifest build fingerprint is invalid.")
    old = {x["path"]: x for x in local.get("components", [])}
    new = {x["path"]: x for x in remote.get("components", [])}
    additions = [new[p] for p in sorted(new.keys() - old.keys())]
    replacements = [new[p] for p in sorted(new.keys() & old.keys()) if new[p]["sha256"] != old[p]["sha256"]]
    removals = sorted(old.keys() - new.keys())
    return {"base_build_hash": local.get("build_hash"), "target_build_hash": remote.get("build_hash"),
            "additions": additions, "replacements": replacements, "removals": removals}


def stage_and_apply(proposal: dict, remote: dict, confirmed: bool, root: Path = APP_DIR) -> dict:
    if not confirmed:
        raise DeploymentError("Deployment requires explicit operator confirmation.")
    if proposal.get("base_build_hash") != local_manifest(root).get("build_hash"):
        raise DeploymentError("Installed build changed after comparison; check again.")
    entries = {x["path"]: x for x in remote.get("components", [])}
    changes = proposal["additions"] + proposal["replacements"]
    removals = [_relative_component_path(path) for path in proposal["removals"]]
    change_paths = [_relative_component_path(item["path"]) for item in changes]
    try:
        NetworkAccessController().require_enabled()
    except NetworkAccessError as exc:
        raise DeploymentError(str(exc)) from exc
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    root.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="cin-deploy-", dir=str(root.parent)) as tmp:
        stage = Path(tmp) / "stage"
        backup = Path(tmp) / "backup"
        stage.mkdir()
        backup.mkdir()
        for item, rel in zip(changes, change_paths):
            url = entries[item["path"]].get("url")
            if not url or not url.startswith("https://"):
                raise DeploymentError(f"Missing HTTPS component URL: {item['path']}")
            target = stage / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            with urllib.request.urlopen(url, timeout=30) as response, target.open("wb") as out:
                shutil.copyfileobj(response, out)
            if sha256_file(target) != item["sha256"]:
                raise DeploymentError(f"Component hash mismatch: {item['path']}")
        existed = root.exists()
        if existed:
            shutil.copytree(root, backup, dirs_exist_ok=True)
        try:
            root.mkdir(parents=True, exist_ok=True)
            for rel in removals:
                target = root / rel
                if target.is_file():
                    target.unlink()
            for rel in change_paths:
                target = root / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(stage / rel, target)
            if local_manifest(root).get("build_hash") != remote.get("build_hash"):
                raise DeploymentError("Post-deployment build fingerprint does not match official manifest.")
        except Exception:
            if existed:
                shutil.rmtree(root, ignore_errors=True)
                shutil.copytree(backup, root)
            else:
                shutil.rmtree(root, ignore_errors=True)
            raise
    record = {"timestamp": datetime.now(timezone.utc).isoformat(), "result": "success",
              "base_build_hash": proposal["base_build_hash"], "target_build_hash": proposal["target_build_hash"]}
    RECORD_PATH.write_text(json.dumps(record, indent=2), encoding="utf-8")
    return record
