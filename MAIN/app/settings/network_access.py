"""Per-application network access policy for the CIN systemd user scope.

CIN is launched inside cin-main-lobby.scope. systemd's IPAddressDeny
cgroup policy applies only to that scope; it does not change host networking.
"""
import shutil
import subprocess


UNIT = "cin-main-lobby.scope"


class NetworkAccessError(RuntimeError):
    """The CIN-only network policy cannot be read or changed."""


class NetworkAccessController:
    def __init__(self, runner=None, command=None, unit=UNIT):
        self.runner = runner or subprocess.run
        self.command = command or shutil.which
        self.unit = unit

    def _run(self, args):
        systemctl = self.command("systemctl")
        if not systemctl:
            raise NetworkAccessError("systemctl is unavailable; CIN network policy cannot be enforced.")
        try:
            result = self.runner([systemctl, "--user", *args],
                                 capture_output=True, text=True, timeout=15, check=False)
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise NetworkAccessError(f"CIN network policy operation failed: {exc}") from exc
        if result.returncode:
            detail = (result.stderr or result.stdout or "No details returned").strip()
            raise NetworkAccessError(f"CIN network policy operation failed: {detail}")
        return result.stdout.strip()

    def status(self):
        value = self._run(["show", self.unit, "--property=IPAddressDeny", "--value"])
        if value == "any" or "0.0.0.0/0" in value or "::/0" in value:
            return "disabled"
        return "enabled"

    def set_enabled(self, enabled):
        # Empty IPAddressDeny clears the runtime override and restores normal access.
        value = "" if enabled else "any"
        self._run(["set-property", "--runtime", self.unit, f"IPAddressDeny={value}"])
        expected = "enabled" if enabled else "disabled"
        if self.status() != expected:
            raise NetworkAccessError(f"systemd did not confirm CIN network access is {expected}.")
        return expected

    def require_enabled(self):
        if self.status() != "enabled":
            raise NetworkAccessError("CIN Internet access is OFF. Turn it ON in Settings to use the official channel.")
