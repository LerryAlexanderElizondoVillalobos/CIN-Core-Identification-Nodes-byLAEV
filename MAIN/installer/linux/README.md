# Phase 1 — CIN Main Lobby ARM64 Debian Package

## Purpose

Deliver CIN Main Lobby as a Debian package (.deb) targeting **arm64 / AArch64**. The primary deployment target includes Debian-compatible Linux userspaces running locally on Android, including LinDesk, as well as conventional ARM64 Debian/Ubuntu systems.

Virtualization is optional. The package is installed inside the Linux userspace provided by the host environment; it is not an Android APK and does not install a Linux distribution or virtual machine.

## Deployment model

The same ARM64 Debian package is tested in two execution profiles:

1. **Android-hosted Linux userspace, without a VM:** Debian userspace provided by an Android Linux environment such as LinDesk. This may use PRoot or another userspace isolation layer and shares the Android device's Linux kernel.
2. **Virtualized ARM64 Linux:** Debian/Ubuntu ARM64 running inside a virtual machine.

The package architecture remains arm64 in both cases. Compatibility is determined by the guest userspace, available libraries, kernel interfaces and display integration—not by the package architecture alone.

## Package contract

- Debian package architecture: arm64.
- Artifact: cin-main-lobby_<version>_arm64.deb.
- Package metadata declares actual runtime dependencies; no blanket dependency on systemd, a VM, root access or a particular desktop environment.
- Installation and application data remain inside the target Linux userspace.
- Persistent CIN node records, configuration and cache use separate XDG locations.
- Package removal must not silently delete persistent node records.
- The package contains the Main Lobby and its three founding certificate processes.
- It does not contain or install the CIN Package Engine (Phase 2).

## LinDesk / Android qualification

LinDesk is described by its publisher as a local Debian-based Linux environment on Android and supports importing .deb packages. CIN will qualify the package by installing and launching it in that environment. Android device model, Android version, LinDesk version, userspace architecture and display mode must be recorded with test evidence.

A successful package build or metadata inspection does not prove runtime compatibility. The CI pipeline can validate package structure and install behavior in an ARM64 Debian runner; a real LinDesk device test remains a separate qualification step.

## Installer / package flow

1. Build the application payload for ARM64.
2. Assemble Debian control metadata and declared dependencies.
3. Build .deb with dpkg-deb.
4. Inspect package metadata and contents.
5. Install into a clean ARM64 Debian-compatible userspace.
6. Launch the Lobby and verify XDG paths and persistent data behavior.
7. Run the three certificate processes and restart/recovery tests as they become implemented.

## Functional boundaries

- Installing the package is not node birth.
- The package does not issue certificates or personal documents merely by being installed.
- CIN Main does not hold private signing keys.
- Virtualization is supported as one test profile, not a prerequisite.
- LinDesk-specific compatibility must be established by actual device testing; ARM64 package metadata alone is insufficient.
