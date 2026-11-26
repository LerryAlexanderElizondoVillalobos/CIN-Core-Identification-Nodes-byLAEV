# CIN EPM — Environment Preparation Manager

CIN EPM provides two Linux editions over one shared POSIX Shell engine:
- **Terminal:** minimal, no graphical dependencies.
- **Desktop:** minimal Tk presentation; delegates all analysis to the same engine.

## Version 0.2.0 — adaptive environment detection
Detects distribution, kernel family, architecture, Lindesk/Termux/container markers, process visibility, cgroup visibility, GUI session, Python/PyGObject/GTK, systemd system/user availability, D-Bus, OpenSSL and iproute2.

Compatibility output distinguishes blocking prerequisites from environmental limitations. Missing systemd user services are not treated as proof that all Linux execution is impossible. They remain a limitation for any Lobby feature whose service contract requires them.

**Important:** EPM does not yet have the official Main Lobby compatibility manifest or installation contract connected. It therefore reports `installation_readiness=not_verified`. It does not select releases, install packages, download software or modify the host.

## Terminal
```sh
./epm --report
./epm --system
./epm --compatibility
sh tests/test-epm.sh
```
Terminal requires POSIX sh and standard basic utilities. It does not require Python, GTK, Tk, Node or a graphical session.

## Desktop
Requires Python 3 with Tk and an active graphical session:
```sh
./epm-desktop
```

## Release discovery and authenticity (next implementation phase)
The signed release-manifest contract is documented in [RELEASE-MANIFEST-SPEC.md](RELEASE-MANIFEST-SPEC.md), with an explicitly unsigned schema example in [RELEASE-MANIFEST.example](RELEASE-MANIFEST.example). The signing key and fingerprint are not yet published/pinned, and no official Main Lobby release manifest is configured. EPM therefore cannot currently authenticate an official release, select a verified Main Lobby version, or install it. See [RELEASE-AND-INSTALLATION-PLAN.md](RELEASE-AND-INSTALLATION-PLAN.md).
