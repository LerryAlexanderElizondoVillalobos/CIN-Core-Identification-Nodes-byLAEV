# CIN EPM — Workplan

**Location:** `MAIN/installer/epm/` · **Version:** 0.1.0 · **Status:** Prototype

## 1. Objective
Deliver two Linux applications over one functional engine:
- **CIN EPM Terminal:** POSIX Shell, no graphical environment, minimal resources and no mandatory Python/Node/GTK.
- **CIN EPM Desktop:** minimal graphical presentation that invokes the exact same engine; no duplicated detection or compatibility logic.

## 2. Architecture
`epm` is the shared command entry point. `core/epm-core.sh` owns environment detection, compatibility evaluation and reporting. Terminal calls it directly. Desktop invokes `epm` as a subprocess and renders its output. The engine is independent of presentation.

## 3. Main Lobby compatibility baseline
Current repository installation documentation specifies Debian-compatible Linux desktop, Python 3, PyGObject, GTK 4, OpenSSL, `dpkg-deb`, systemd user manager and systemd/cgroup support for the CIN network scope. Package architecture is documented for x86_64 and ARM64/AArch64. EPM must not invent kernel or library minimum versions.

## 4. Delivery phases
1. **Shared engine + Terminal:** POSIX Shell entry point; detect distribution, kernel, architecture, libc, package manager, GUI session and relevant runtimes; evaluate actual Lobby prerequisites; stable line-oriented report; no host changes.
2. **Desktop:** minimal text-and-controls UI; delegate every operation to the same engine; GUI dependencies isolated from Terminal.
3. **Release discovery:** define versioned Main Lobby compatibility manifest; discover official GitHub Releases/assets; compare architecture, distribution, runtime, libraries and package requirements; choose newest compatible release rather than blindly newest; explain incompatibility.
4. **Authenticity + plan:** compare digest against authenticated reference; validate publisher signature against independently trusted keys; distinguish integrity from authenticity; present plan and request operator approval.
5. **Installation + verification:** use supported package/user-space contract; install only after compatibility and authenticity checks; verify installed files and launch readiness; final report.
6. **Qualification + release:** test real distributions/architectures; publish separate Terminal/Desktop bundles; promote only after CI and qualification pass.

## 5. Prototype acceptance
- POSIX syntax and functional tests pass.
- Terminal works without GUI and without Python/Node/GTK as EPM dependencies.
- Desktop delegates to the same engine.
- Detection/compatibility fields are stable and testable.
- No host modifications in prototype.
- Missing/unsupported capabilities reported honestly.
- GitHub Actions publishes separate downloadable archives.

## 6. Boundaries
EPM is not Main Lobby and not the CIN Package Engine. Terminal's POSIX Shell requirement is mandatory. Desktop toolkit can evolve without changing the engine contract. No Linux distribution is declared supported until qualified on a real environment.
