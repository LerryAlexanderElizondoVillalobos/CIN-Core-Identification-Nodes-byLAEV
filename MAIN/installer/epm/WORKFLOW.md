# CIN EPM — Development and Test Workflow

1. Implement all environment logic in the shared POSIX Shell engine.
2. Add tests for normal, missing, inaccessible and restricted capabilities.
3. Run POSIX syntax checks, ShellCheck and functional tests.
4. Verify Terminal with DISPLAY and WAYLAND_DISPLAY unset.
5. Verify Desktop delegates to the shared engine and starts under a virtual display in CI.
6. Build separate Terminal and Desktop archives; publish SHA-256 checksums.
7. Inspect all GitHub Actions jobs and manually test artifacts on Debian native and Lindesk.
8. Do not claim a Lobby release is installable until its signed compatibility manifest and installation contract are available.

## Stable CLI
- `epm --report`
- `epm --system`
- `epm --compatibility`
- `epm --version`
- `epm --help`

Output is line-oriented key=value. EPM 0.2.0 remains analysis-only; release discovery, authenticity checks and installation are not enabled.
