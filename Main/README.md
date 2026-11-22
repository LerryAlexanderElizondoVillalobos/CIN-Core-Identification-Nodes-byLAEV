# CIN Main — Linux-first installation and runtime

CIN Main is being restructured around **Linux as the primary runtime environment** and **Lindesk on Android as the intended installation/control entry point**.

## Roles
- Linux host: runs CIN, local data, services, and engines.
- Lindesk Android: initiates and supervises the installation/control workflow. Its transport/API is not assumed; integration remains behind a documented bridge contract until verified.
- Main: installation lifecycle, runtime configuration, service/module lifecycle, and CLI entry points.
- Engines and applications: separately installable capabilities that Main manages.

## Status
This is the initial migration scaffold. It does not replace the existing legacy application tree yet. Existing functionality is retained until each component is inventoried, mapped, migrated, and validated.

## Start here
- [Installation for Linux](installation/linux/README.md)
- [Lindesk bridge contract](installation/lindesk/README.md)
- [Architecture and migration plan](architecture/README.md)
- [Runtime](core/runtime/README.md)
- [Configuration](core/configuration/README.md)
- [Modules](core/module-manager/README.md)

## Local development
From the repository root:
```bash
bash Main/installation/linux/install.sh --prefix "$HOME/.local/share/cin"
```
This installs a user-space copy and creates a user systemd service when systemd is available. It does not require root.
