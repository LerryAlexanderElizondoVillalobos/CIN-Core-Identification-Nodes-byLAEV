from pathlib import Path
import unittest

SOURCE = Path(__file__).parents[1] / "app" / "launcher" / "cin_main.py"
TEXT = SOURCE.read_text(encoding="utf-8")


class ApplicationContractTests(unittest.TestCase):
    def test_required_lobby_content(self):
        for value in ("Welcome to the Main Lobby", "Core Identification Nodes",
                      "Create", "Enter", "Import", "Settings",
                      "© 2026 Core Identification Nodes byLAEV. All rights reserved."):
            with self.subTest(value=value):
                self.assertIn(value, TEXT)

    def test_settings_information_and_navigation(self):
        for value in ("Application Information", "Current Capabilities",
                      "Project Repository", "Back to Main Lobby",
                      "Linux ARM64 / AArch64", "Not required to open the application",
                      "show_settings", "show_lobby"):
            with self.subTest(value=value):
                self.assertIn(value, TEXT)

    def test_inactive_actions_are_disabled(self):
        self.assertGreaterEqual(TEXT.count("set_sensitive(False)"), 2)

    def test_network_switch_is_limited_to_cin(self):
        self.assertIn("NetworkAccessController", TEXT)
        self.assertIn("Other Linux applications", TEXT)
        self.assertNotIn("NetworkManager", TEXT)
        self.assertNotIn("nmcli", TEXT)
        self.assertIn("self.network.require_enabled()", TEXT)

    def test_no_remote_assets_or_browser_runtime(self):
        self.assertNotIn("WebKit", TEXT)
        self.assertNotIn("http://", TEXT.replace(
            "https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV", ""
        ))


if __name__ == "__main__":
    unittest.main()
