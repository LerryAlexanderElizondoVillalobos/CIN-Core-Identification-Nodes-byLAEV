# Linux installation

The initial installer is user-space and designed to be invoked from a Linux shell or from a future verified Lindesk deployment workflow.

## Requirements
- Linux
- Python 3.9+
- systemd user service is optional

## Install
```bash
bash Main/installation/linux/install.sh --prefix "$HOME/.local/share/cin"
```

## Options
- `--prefix PATH`: installation directory (defaults to `$HOME/.local/share/cin`)
- `--no-service`: do not install a systemd user service
- `--help`: show usage

The script copies Main into the destination, creates a user configuration directory and initializes a sample configuration if one does not exist. It avoids overwriting existing configuration.

## Service management
If systemd user services are available:
```bash
systemctl --user enable --now cin-main.service
systemctl --user status cin-main.service
```

## Uninstall
```bash
bash Main/installation/linux/uninstall.sh --prefix "$HOME/.local/share/cin"
```
Uninstallation removes the service and installed runtime files, but intentionally leaves user configuration/data unless `--remove-data` is explicitly specified.
