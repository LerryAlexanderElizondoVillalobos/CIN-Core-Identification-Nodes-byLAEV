# CIN EPM — Environment Preparation Manager

Two Linux editions share one functional engine:
- **Terminal:** POSIX Shell, no GUI, no mandatory Python/Node/GTK.
- **Desktop:** minimal Tk interface that delegates every analysis operation to the same `epm` engine.

## Prototype 0.1.0
This increment detects the Linux environment and evaluates the currently documented Main Lobby prerequisites. It is analysis-only: it does not install packages, download releases or modify the host.

The repository's current Lobby documentation specifies a Debian-compatible desktop, Python 3, PyGObject, GTK 4, OpenSSL, `dpkg-deb`, a systemd user manager and systemd/cgroup network-scope support. The documented package architectures are x86_64 and ARM64/AArch64. EPM reports these requirements without inventing minimum versions.

### Terminal
```sh
chmod +x epm
./epm --report
sh tests/test-epm.sh
```
Commands: `--report`, `--system`, `--compatibility`, `--version`, `--help`.

### Desktop
Requires Python 3 with Tk support and a graphical session:
```sh
./epm-desktop
```
Desktop invokes the same `epm` command. Terminal does not require Tk or Python.

GitHub Actions tests both editions and publishes separate downloadable archives. Release manifests, official release discovery, version selection, signature verification, installation planning and installation are subsequent phases; this prototype makes no release-authenticity claim.
