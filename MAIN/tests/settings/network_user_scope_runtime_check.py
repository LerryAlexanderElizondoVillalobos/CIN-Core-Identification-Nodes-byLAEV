"""Verify a non-root systemd user manager can toggle CIN scope IP filtering."""
import os
import subprocess
import sys
import time


UNIT = "cin-network-user-scope-runtime-test.scope"


def run(args, env):
    return subprocess.run(
        ["systemctl", "--user", *args],
        env=env, capture_output=True, text=True, timeout=15, check=True,
    )


def main():
    env = os.environ.copy()
    env["XDG_RUNTIME_DIR"] = f"/run/user/{os.getuid()}"
    env["DBUS_SESSION_BUS_ADDRESS"] = f"unix:path={env['XDG_RUNTIME_DIR']}/bus"

    process = subprocess.Popen([
        "systemd-run", "--user", "--scope", "--unit=cin-network-user-scope-runtime-test",
        "--", sys.executable, "-c", "import time; time.sleep(60)",
    ], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)

    try:
        active = False
        for _ in range(30):
            result = run(["show", UNIT, "--property=ActiveState", "--value"], env)
            if result.stdout.strip() == "active":
                active = True
                break
            time.sleep(0.5)
        if not active:
            detail = process.stderr.read() if process.poll() is not None else "scope did not become active"
            raise RuntimeError(f"Could not start the user scope: {detail}")

        run(["set-property", "--runtime", UNIT, "IPAddressDeny=any"], env)
        denied = run(["show", UNIT, "--property=IPAddressDeny", "--value"], env).stdout.strip()
        # systemd normalizes the 'any' token to the equivalent IPv4/IPv6 CIDRs.
        denied_networks = set(denied.split())
        if denied != "any" and not {"0.0.0.0/0", "::/0"}.issubset(denied_networks):
            raise RuntimeError(f"User manager did not apply full IP denial: {denied!r}")

        run(["set-property", "--runtime", UNIT, "IPAddressDeny="], env)
        restored = run(["show", UNIT, "--property=IPAddressDeny", "--value"], env).stdout.strip()
        restored_networks = set(restored.split())
        if restored == "any" or {"0.0.0.0/0", "::/0"}.issubset(restored_networks):
            raise RuntimeError("User manager did not restore CIN network access.")

        print("PASS: non-root systemd user manager can disable and restore CIN scope networking.")
    finally:
        subprocess.run(["systemctl", "--user", "kill", UNIT], env=env,
                       capture_output=True, text=True, timeout=10)
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=5)


if __name__ == "__main__":
    main()
