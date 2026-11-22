# Linux installation

Linux is the primary runtime target. The installer works in user space and does not require root.

## Requirements
- Linux
- Python 3.9+ (configuration CLI)
- Rust/Cargo for compiling the primary Rust runtime and domain tools
- systemd user service is optional

## Install
```bash
bash Main/installation/linux/install.sh --prefix "$HOME/.local/share/cin"
```

## Options
- `--prefix PATH`: installation directory (default: `$HOME/.local/share/cin`)
- `--no-build`: skip Rust compilation; only copy source and control CLI
- `--no-service`: skip systemd user service setup
- `--help`: show installer help

The installer copies Main, builds the Rust Linux runtime (cin-linux-main) and the domain command-line tools when Cargo is available, installs launchers in `~/.local/bin`, and optionally enables the systemd user service. It preserves an existing configuration.

## Runtime commands
```bash
cin-main             # launch primary Linux local web runtime
cin-main-cli status   # show configuration/runtime control status
cin-main-cli init     # initialize configuration
cin-main-cli serve    # secondary Python status HTTP endpoint
```

## Service management
```bash
systemctl --user enable --now cin-main.service
systemctl --user status cin-main.service
```

## Uninstall
```bash
bash Main/installation/linux/uninstall.sh --prefix "$HOME/.local/share/cin"
```
Uninstallation removes the service, launcher binaries, and installed Main source. User configuration is retained unless `--remove-data` is explicitly supplied.
