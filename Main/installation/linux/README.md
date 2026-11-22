# Linux installation

Linux is the primary runtime target. The installer works in user space and does not require root.

## Requirements
- Linux
- Python 3.9+ (secondary control CLI)
- Rust/Cargo for compiling the primary runtime and domain tools
- Node.js 22+ for the optional local backend service tests/runtime
- systemd user service is optional

## Install
```bash
bash Main/installation/linux/install.sh --prefix "$HOME/.local/share/cin"
```

## Options
- `--prefix PATH`: installation directory (default: `$HOME/.local/share/cin`)
- `--no-build`: skip Rust compilation; copy source and install control CLI
- `--no-service`: skip systemd user service setup
- `--help`: show installer help

The installer copies Main, builds the Rust Linux runtime (`cin-linux-main`) and domain tools when Cargo is available, installs launchers in `~/.local/bin`, and optionally enables the systemd user service. Existing configuration is preserved.

## Runtime commands
```bash
cin-main             # launch primary Linux local web runtime
cin-main-cli status   # secondary configuration/status CLI
cin-main-cli init     # initialize configuration
cin-module list      # list Main modules and enablement
cin-module enable cin-local-backend
cin-module disable cin-local-backend
``

## Service management
```bash
systemctl --user enable --now cin-main.service
systemctl --user status cin-main.service
```

## Uninstall
```bash
bash Main/installation/linux/uninstall.sh --prefix "$HOME/.local/share/cin"
``
Uninstallation removes the service, launchers, compiled binaries and installed Main source. User configuration is retained unless `--remove-data` is explicitly supplied.
