# Android-Hosted Linux and Virtualization Compatibility

## Goal

CIN Main is a Linux user-mode application. One required execution target is a Linux distribution launched from the Android APK environment known as Lindesk. Lindesk is the Android application layer that provides and runs different Linux distributions.

The expected execution chain is:

Android host -> Lindesk Android APK -> selected Linux distribution/environment -> CIN Main user-space process -> CIN Lobby.

CIN is not itself the Android APK and is not a Linux distribution. CIN runs inside the Linux environment made available by Lindesk.

## Environment layers

1. Android host: the physical device operating system and hardware.
2. Lindesk APK: the Android application responsible for providing/running Linux distributions.
3. Linux environment: the selected distribution and its user-space tools, libraries, filesystem view, and process environment.
4. CIN Main: an ordinary user-space Linux application running within that distribution.
5. CIN Lobby and installable engines: user-facing CIN components hosted by Main.

CIN Main must not assume it can directly control Android, Lindesk, the host kernel, or the virtualization/containerization mechanism. It should operate through the Linux user-space interfaces available inside the selected distribution.

## Virtualization and isolation compatibility

The exact implementation mechanism used by Lindesk has not been established here. It may provide a container-like, namespace-based, proot/chroot-style, virtual-machine, or another isolated Linux environment. Do not label it as a full virtual machine or assume a specific technology without technical verification.

The platform probe should identify observable capabilities and limitations from inside the Linux environment. It should not rely solely on product names or guess the isolation technology.

Relevant capabilities to inspect include:
- Linux kernel and userspace architecture information exposed to the process.
- Process and user permissions, including whether the process has ordinary user privileges or elevated capabilities within its environment.
- Filesystem paths, write permissions, storage availability, and persistence behavior.
- Process creation, signals, IPC, and background-process behavior.
- Network availability and local socket support.
- Display server/session variables and available graphical integration.
- Available shared directories or file exchange paths, when exposed by the environment.
- Resource limits and relevant namespace/container indicators, where discoverable.

## Runtime design implications

- Main remains a Linux user-mode application and must not require Android APIs to perform its core Linux runtime functions.
- Main must not require root or privileged host access for normal operation.
- Main must not assume systemd, desktop services, a conventional Linux boot process, or unrestricted access to host devices.
- The Lobby must be able to run using the graphical capabilities actually exposed by the selected Linux environment.
- The engine manager must install engines into user-writable persistent storage inside the Linux environment.
- If the environment provides shared storage with Android, that is an optional integration capability, not a prerequisite for the core runtime.
- Host/Android integration must be isolated behind optional adapters and must not contaminate the Linux core.

## Validation matrix

The first reference environment should be Lindesk running one selected Linux distribution on Android. Validate:
- CIN launch as a normal Linux user.
- User-writable persistent configuration, state, data, cache, logs, and engine directories.
- Local process management and communication.
- Lobby graphical startup using the display path provided by Lindesk.
- Engine installation and activation without privileged host access.
- Restart and persistence behavior.
- Network and filesystem limitations exposed by the selected Linux environment.

Additional Linux desktop and conventional Linux VM targets may be supported, but the Lindesk-on-Android execution path is a specifically required compatibility target.

## Open technical facts to verify

Before implementing environment-specific integration, identify the exact Lindesk version, supported Linux distributions, how it launches Linux, display forwarding mechanism, filesystem persistence model, networking behavior, and whether it exposes shared storage or Android integration APIs. Do not invent these properties.
