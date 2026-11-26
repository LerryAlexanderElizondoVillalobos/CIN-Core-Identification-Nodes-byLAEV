# CIN.deb — User-Space Installation and Acceptance Test

## Purpose

Verify that a normal desktop user can install, launch, navigate and remove CIN without root privileges or `sudo`.

## 1. Record target environment

- Distribution and release:
- CPU architecture (`uname -m`):
- Package architecture (`dpkg --print-architecture`):
- Desktop environment:
- Display session:
- Python 3 version:
- GTK 4 and PyGObject availability:
- Test date:

## 2. Obtain the release artifact

1. Open the repository Actions page.
2. Select the latest successful **CIN Main — Build, Test and Package Debian Installer** run.
3. Confirm source tests, package build and x86_64/ARM64 user-space runtime qualification passed.
4. Download and extract the `CIN-deb-installer` artifact.
5. Confirm it contains `CIN.deb`, `install-user.sh` and `uninstall-user.sh`.

## 3. Install as a normal user

Do not use a root shell, `sudo`, `apt install` or `dpkg -i`.

```bash
bash install-user.sh ./CIN.deb
```

Expected paths:
- `~/.local/opt/cin-main-lobby/cin_main.py`
- `~/.local/bin/cin-main`
- `~/.local/share/applications/cin-main.desktop`

Verify:
```bash
test -f "$HOME/.local/opt/cin-main-lobby/cin_main.py"
test -x "$HOME/.local/bin/cin-main"
test -f "$HOME/.local/share/applications/cin-main.desktop"
```

## 4. Launch and inspect the Lobby

```bash
~/.local/bin/cin-main
```

Verify the native Lobby, required text, disabled Enter and Import controls, informational Create entry, copyright footer and repository link.

## 5. Test Settings

1. Open Settings.
2. Inspect application information and capability status.
3. Use Back to return to the Lobby.
4. Repeat the cycle at least five times.
5. Resize the window and test portrait/landscape layouts where supported.

## 6. Restart and offline test

Close CIN, disconnect the network, launch it again and repeat Lobby → Settings → Lobby. The application screens must not require network access; only opening the repository link requires connectivity.

## 7. Uninstall as the same user

```bash
bash uninstall-user.sh
```

Verify:
```bash
test ! -e "$HOME/.local/opt/cin-main-lobby"
test ! -e "$HOME/.local/bin/cin-main"
test ! -e "$HOME/.local/share/applications/cin-main.desktop"
```

## 8. Acceptance record

| Test | Result | Notes |
|---|---|---|
| User-space installer runs without sudo | Pending | |
| Application installed under home directory | Pending | |
| No system paths modified by installer | Pending | |
| Native Lobby launch | Pending | |
| Settings screen opens | Pending | |
| Back returns to Lobby | Pending | |
| Five navigation cycles | Pending | |
| Layout resizing/orientation | Pending | |
| Offline startup | Pending | |
| User-space uninstall succeeds | Pending | |

**Overall result:** Pending operator test.

A successful CI run does not replace the operator's manual test on the actual target environment.
