# CIN Main — User-Space Debian Installer

The build produces `CIN.deb`, an architecture-independent payload container. Run the bundled installer as the normal desktop user:

```bash
bash install-user.sh ./CIN.deb
```

The installer extracts the payload and installs it under `~/.local/opt/cin-main-lobby`; it does not use `sudo`, `apt install`, `dpkg -i` or system package scripts. Python 3, PyGObject, GTK 4 and OpenSSL must already be available.

## Bootstrap migration

This package is the initial bootstrap containing the new Settings → Code Deployment engine. The older Lobby cannot deploy itself into this version. Running the installer replaces the old application payload and refreshes the launcher. Operator data and configuration in `~/.local/share/cin-main-lobby` and `~/.config/cin-main-lobby` are preserved.

## Deploy setup

Provision the official Ed25519 public key independently at `~/.config/cin-main-lobby/deploy.pub`. The engine refuses to claim trusted updates if the key is absent. The official channel must publish a signed manifest and HTTPS component files. See `MAIN/app/settings/deployment/README.md`.

## Uninstall

```bash
bash uninstall-user.sh
```

Application files and launcher are removed. Operator data and publisher configuration remain in place.
