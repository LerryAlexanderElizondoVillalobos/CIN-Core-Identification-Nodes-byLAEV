# CIN Linux ARM64 Portable — acceptance tests

## Static and build validation
- Build on an ARM64 runner and confirm `uname -m` is `aarch64`.
- Run the existing CIN source tests.
- Validate `AppRun`, `run-cin.sh`, `install.sh`, and packaging script syntax.
- Confirm AppDir contains Main Lobby, installer binary, GTK4 libraries, typelibs, desktop file, and icon.
- Confirm archive includes AppDir, launcher, installer, and documentation.
- Verify SHA-256 manifest.

## No-root install contract
Use a temporary HOME owned by the test user:
- Run `install.sh` without sudo.
- Confirm app files are under `$HOME/.local/share/cin/AppDir`.
- Confirm launchers are under `$HOME/.local/bin` and `$HOME/.local/share/applications`.
- Confirm no writes are made to `/opt`, `/usr`, or `/etc`.
- Launch the installed CIN app in a graphical smoke-test environment.
- Run `cin-uninstall` without sudo.
- Confirm application files and launcher are removed and user data remains.

## LinDesk device acceptance
On a physical ARM64 Android device with LinDesk installed:
1. Record Android version, device SoC, RAM, free storage, LinDesk version, Debian release, kernel, glibc, and display backend.
2. Confirm the Linux userspace reports `aarch64` and Debian/glibc.
3. Extract the archive into the user's home directory.
4. Run `./install.sh` without sudo/root.
5. Launch from LinDesk's desktop menu and from `~/.local/bin/cin`.
6. Verify Lobby and Settings navigation, window sizing, touch interaction, keyboard input, and app exit.
7. Repeat with Android 12+ after completing LinDesk's child-process settings.
8. Test resume after switching Android apps and screen lock.
9. Record idle and active RSS using `/usr/bin/time -v` or `ps`; do not publish an unmeasured RAM requirement.
10. Run `cin-uninstall` and verify user data is preserved.

## Virtualization matrix
- Physical ARM64 Linux: supported target.
- ARM64 virtual machine: supported if the guest provides compatible glibc, kernel, and graphical session.
- LinDesk: ARM64 Debian userspace on Android; not a hardware VM. No nested VM is needed.
- x86_64 or non-ARM64 userspace: not supported by this artifact.

A CI pass is not equivalent to certification on every Android phone or LinDesk release.
