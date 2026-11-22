#!/usr/bin/env python3
import importlib.util
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parent / "cin_module.py"
spec = importlib.util.spec_from_file_location("cin_module", MODULE_PATH)
cin_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cin_module)

class ModuleRegistryTests(unittest.TestCase):
    def setUp(self):
        self.modules = cin_module.load_registry()
        self.enabled = set()

    def test_enabling_optional_backend_enables_runtime_dependency(self):
        cin_module.resolve_enable("cin-local-backend", self.modules, self.enabled)
        self.assertEqual(self.enabled, {"cin-main-runtime", "cin-local-backend"})

    def test_merkle_engine_enablement_includes_domain_dependency(self):
        cin_module.resolve_enable("cin-merkle-engine", self.modules, self.enabled)
        self.assertEqual(self.enabled, {"cin-domain-core", "cin-merkle-engine"})

    def test_android_module_cannot_be_enabled_from_linux(self):
        with self.assertRaisesRegex(ValueError, "targets android"):
            cin_module.resolve_enable("lindesk-android-bridge", self.modules, self.enabled)

    def test_unknown_module_rejected(self):
        with self.assertRaisesRegex(ValueError, "Unknown module"):
            cin_module.resolve_enable("not-a-module", self.modules, self.enabled)

    def test_default_modules_are_enabled_without_config_file(self):
        with tempfile.TemporaryDirectory() as temp:
            defaults = cin_module.load_config(Path(temp) / "missing.json")
            self.assertIn("cin-main-runtime", defaults["enabled"])
            self.assertIn("cin-domain-core", defaults["enabled"])

    def test_config_round_trip(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "modules.json"
            config = {"enabled": ["cin-main-runtime"]}
            cin_module.save_config(path, config)
            self.assertEqual(cin_module.load_config(path), config)

if __name__ == "__main__":
    unittest.main()
