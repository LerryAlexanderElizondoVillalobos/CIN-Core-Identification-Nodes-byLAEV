# CIN — Core Identification Nodes byLAEV

CIN is the project for a modular node application and its dedicated engines.

## Current Linux distribution work

The Debian 13 ARM64 User Space Edition is being developed on a dedicated feature branch.

- [Debian 13 package specification and installation](MAIN/installer/debian13/README.md)
- [Debian 13 acceptance test plan](MAIN/installer/debian13/ACCEPTANCE_TEST_PLAN.md)
- [Debian 13 ARM64 CI workflow](.github/workflows/debian13-user-space-arm64.yml)

The planned distribution contains `CIN.deb` and `CIN-Debian13-Installer.zip`. The ZIP supplies per-user install and uninstall scripts. The .deb is extracted using `dpkg-deb -x` into the user's home directory; it is not installed with `dpkg -i` and does not require root.

This work is not a released binary until the ARM64 Debian 13 build and acceptance workflow succeeds.
