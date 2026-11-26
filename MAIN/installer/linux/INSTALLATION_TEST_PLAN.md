# CIN Linux Installer — Installation and Acceptance Test

## Purpose

Verify that the single downloadable installer installs, launches, navigates and removes CIN as a normal desktop user without root privileges.

## 1. Obtain and verify the one release artifact

Download the latest successful `CIN-Linux-Installer` artifact from the repository Actions page. It must contain one archive: `CIN-Linux-Installer.zip`.

Extract it, then verify:

```bash
cd CIN-Linux-Installer
sha256sum -c SHA256SUMS
```

The archive contains `CIN.deb` as an internal application payload, plus install and uninstall scripts. Do not download or install a separate legacy `.deb`.

## 2. Install as a normal user

Do not use a root shell, `sudo`, `apt install` or `dpkg -i`.

```bash
bash install-user.sh ./CIN.deb
```

Expected paths:
- `~/.local/opt/cin-main-lobby/cin_main.py`
- `~/.local/bin/cin-main`
- `~/.local/share/applications/cin-main.desktop`

## 3. Launch and inspect Main Lobby

```bash
~/.local/bin/cin-main
```

Verify Main Lobby is the first screen. Settings must appear only after selecting its control in Main Lobby.

## 4. Navigation, restart and offline checks

- Open Settings and use Back to return to Main Lobby.
- Repeat at least five times.
- Close and relaunch; confirm Main Lobby is still the first screen.
- Disconnect the network and relaunch; local screens must remain available.

## 5. Uninstall

```bash
bash uninstall-user.sh
```

Verify application files and launcher are removed. User data and publisher configuration are intentionally preserved.

## 6. Acceptance record

| Test | Result |
|---|---|
| One downloadable ZIP only | Pending |
| SHA-256 verification | Pending |
| User-space install without sudo | Pending |
| No system paths modified | Pending |
| Main Lobby is initial screen | Pending |
| Settings opens from Lobby | Pending |
| Back returns to Lobby | Pending |
| Five navigation cycles | Pending |
| Offline startup | Pending |
| User-space uninstall | Pending |

A successful CI run does not replace the operator's manual test on the actual target Linux desktop.
