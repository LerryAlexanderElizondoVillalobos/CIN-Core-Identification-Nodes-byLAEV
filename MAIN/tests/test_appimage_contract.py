from pathlib import Path
import unittest

ROOT = Path(__file__).parents[1]
INSTALLER = ROOT / "installer" / "linux" / "appimage_installer.py"
APPRUN = ROOT / "installer" / "linux" / "AppRun"
BUILD = ROOT / "installer" / "linux" / "build-appimage.sh"


class AppImageContractTests(unittest.TestCase):
    def test_user_space_install_contract(self):
        text = INSTALLER.read_text(encoding="utf-8")
        for expected in ("Install for this user", "Run without installing",
                         "Path.home() / \"Applications\"",
                         ".local/share/applications", "APPIMAGE"):
            self.assertIn(expected, text)
        self.assertNotIn("sudo ", text)
        self.assertNotIn("pkexec", text)

    def test_apprun_has_installer_and_lobby_modes(self):
        text = APPRUN.read_text(encoding="utf-8")
        self.assertIn("cin-appimage-installer", text)
        self.assertIn("cin-main", text)
        self.assertIn("--run", text)

    def test_build_targets_supported_architectures(self):
        text = BUILD.read_text(encoding="utf-8")
        self.assertIn("aarch64", text)
        self.assertNotIn("x86_64", text)
        self.assertIn("linuxdeploy", text)


if __name__ == "__main__":
    unittest.main()
