# Linux Desktop and Virtualization Compatibility

## Goal

CIN is a Linux user-mode application. It must be usable on a Linux desktop and inside a Linux virtual machine. Virtualization is an execution environment to support, not a dependency that the core application controls.

## Compatibility model

The platform probe collects facts available from user space, such as Linux kernel information, CPU architecture, process permissions, filesystem behavior, display/session variables, available IPC facilities, network availability, and virtualization indicators where exposed.

The compatibility layer converts those facts into capabilities consumed by the runtime. Higher layers must ask for capabilities rather than infer behavior from a distribution name or hypervisor brand.

## Linux desktop integration

Keep desktop integration behind replaceable adapters. The core host must remain independent of a specific desktop shell, display server, service manager, or file manager. The Lobby should be launchable through the supported desktop session and through a direct user command.

## Virtualized Linux environments

The first compatibility objective is to run CIN as a guest user-space application in a Linux VM. The host-side hypervisor is outside CIN's control. CIN must not require privileged guest operations or special virtual devices unless a later, explicitly scoped integration needs them.

## Lindesk integration

The term Linux Lindesk is retained as the named compatibility target supplied in the product direction. Its exact interface, distribution/base system, packaging expectations, desktop integration points, and virtualization model have not yet been specified. No proprietary or platform-specific API is assumed until those details are provided.

## Validation matrix to establish

- Native Linux desktop session.
- Linux guest VM with graphical session.
- Linux guest VM without graphical session, for runtime diagnostics.
- Standard user account with no elevated privileges.
- Different user-writable filesystem locations.

Exact distributions, architectures, desktop environments, and hypervisors will be added after the Lindesk target is clarified and the first test environment is selected.
