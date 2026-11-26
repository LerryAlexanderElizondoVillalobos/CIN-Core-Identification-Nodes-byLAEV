# CIN EPM — Workplan
**Version:** 0.2.0 · **Status:** Adaptive environment detection increment

## Objective
Provide Terminal (POSIX Shell) and Desktop (minimal UI) editions using exactly one shared engine. EPM analyzes the host and prepares a transparent compatibility report; it must not assume a conventional init system or require host changes to perform detection.

## 0.2.0 scope
- Detect OS distribution, release, kernel family and CPU architecture independently.
- Identify known runtime markers: Lindesk, Termux, container, Linux-on-Android, or native/unknown.
- Probe capabilities instead of inferring them from command presence: systemd system/user availability, D-Bus binary, GTK/PyGObject, GUI session, cgroup visibility, /proc access, OpenSSL and iproute2.
- Report unavailable versus inaccessible capabilities separately where the environment allows.
- Classify documented Lobby prerequisites as blockers versus environmental limitations.
- Explicitly report that installation readiness is unverified until the official Main Lobby compatibility manifest and install contract are connected.
- Preserve no-install/no-host-mutation behavior.
- Keep Terminal independent of Python, GTK, Tk, Node and GUI session.

## Architecture
`core/epm-core.sh` owns all detection, evaluation and line-oriented reporting. `epm` is the stable CLI contract. Desktop invokes the same CLI and only presents its output.

## Acceptance
- POSIX syntax and functional tests pass.
- Reports runtime, kernel family, architecture, /proc, cgroups and service capabilities.
- Absence of systemd user bus is reported as a limitation, not automatically as proof the whole Linux environment cannot run.
- True mandatory Lobby dependencies remain blockers until product requirements explicitly permit alternatives.
- No downloads, package installs, privilege escalation or host modifications.
- CI tests Terminal and Desktop and produces separate artifacts.

## Next phases
1. Official versioned Main Lobby compatibility manifest.
2. Release discovery and architecture/runtime selection.
3. Authenticated checksum and publisher-signature verification.
4. Dry-run installation plan and explicit approval.
5. Installation adapters qualified for native Debian and Lindesk.
6. Real-device qualification before support claims.
