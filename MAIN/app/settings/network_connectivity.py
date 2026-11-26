"""Master network connectivity switch backed by NetworkManager."""
import shutil
import subprocess


class NetworkConnectivityError(RuntimeError):
    """Raised when the system network state cannot be read or changed."""


class NetworkConnectivity:
    def __init__(self, runner=None, command=None):
        self.runner = runner or subprocess.run
        self.command = command or shutil.which

    def _run(self, args, privileged=False):
        nmcli = self.command("nmcli")
        if not nmcli:
            raise NetworkConnectivityError("NetworkManager (nmcli) is not installed.")
        command = [nmcli, *args]
        if privileged:
            pkexec = self.command("pkexec")
            if not pkexec:
                raise NetworkConnectivityError("Administrative authorization (pkexec) is unavailable.")
            command = [pkexec, *command]
        try:
            result = self.runner(command, capture_output=True, text=True, timeout=20, check=False)
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise NetworkConnectivityError(f"Network operation failed: {exc}") from exc
        if result.returncode:
            detail = (result.stderr or result.stdout or "No details returned").strip()
            raise NetworkConnectivityError(f"Network operation was not completed: {detail}")
        return result.stdout.strip()

    def status(self):
        value = self._run(["-t", "-f", "NETWORKING", "networking"]).lower()
        if value not in ("enabled", "disabled"):
            raise NetworkConnectivityError(f"Unexpected NetworkManager state: {value or 'empty response'}")
        return value

    def disable(self):
        self._run(["networking", "off"], privileged=True)
        if self.status() != "disabled":
            raise NetworkConnectivityError("NetworkManager did not confirm networking is disabled.")

    def enable(self):
        self._run(["networking", "on"], privileged=True)
        if self.status() != "enabled":
            raise NetworkConnectivityError("NetworkManager did not confirm networking is enabled.")
