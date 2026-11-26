import tempfile
import unittest
from pathlib import Path

from MAIN.app.settings.deployment.engine import (
    DeploymentError, compare, fingerprint, local_manifest, stage_and_apply,
)


class DeploymentEngineTests(unittest.TestCase):
    def manifest(self, entries):
        value = {"schema": 1, "application": "cin-main-lobby", "components": entries}
        value["build_hash"] = fingerprint(value)
        return value

    def test_local_manifest_is_reproducible_and_ignores_python_cache(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "one.txt").write_text("CIN")
            cache = root / "__pycache__"
            cache.mkdir()
            (cache / "one.cpython-312.pyc").write_bytes(b"runtime cache")
            first = local_manifest(root)
            self.assertEqual(first, local_manifest(root))
            self.assertEqual([item["path"] for item in first["components"]], ["one.txt"])

    def test_component_comparison_reports_add_replace_remove(self):
        old = self.manifest([
            {"path": "same", "sha256": "a", "size": 1},
            {"path": "remove", "sha256": "b", "size": 1},
        ])
        new = self.manifest([
            {"path": "same", "sha256": "c", "size": 1},
            {"path": "add", "sha256": "d", "size": 1},
        ])
        result = compare(old, new)
        self.assertEqual([x["path"] for x in result["additions"]], ["add"])
        self.assertEqual([x["path"] for x in result["replacements"]], ["same"])
        self.assertEqual(result["removals"], ["remove"])

    def test_manifest_fingerprint_rejects_changed_component(self):
        value = self.manifest([{"path": "x", "sha256": "a", "size": 1}])
        value["components"][0]["sha256"] = "changed"
        with self.assertRaises(DeploymentError):
            compare(self.manifest([]), value)

    def test_apply_requires_explicit_confirmation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "app"
            root.mkdir()
            (root / "old").write_text("old")
            local = local_manifest(root)
            remote = self.manifest([])
            proposal = compare(local, remote)
            with self.assertRaises(DeploymentError):
                stage_and_apply(proposal, remote, confirmed=False, root=root)

    def test_invalid_removal_path_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "app"
            root.mkdir()
            (root.parent / "keep.txt").write_text("keep")
            local = local_manifest(root)
            remote = self.manifest([])
            proposal = compare(local, remote)
            proposal["removals"] = ["../keep.txt"]
            with self.assertRaises(DeploymentError):
                stage_and_apply(proposal, remote, confirmed=True, root=root)


if __name__ == "__main__":
    unittest.main()
