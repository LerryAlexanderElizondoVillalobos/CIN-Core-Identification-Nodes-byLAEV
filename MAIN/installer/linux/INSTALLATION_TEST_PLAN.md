# CIN Linux AppImage — Acceptance Test Plan

## Artifacts

- `Core_Identification_Nodes-x86_64.AppImage`
- `Core_Identification_Nodes-aarch64.AppImage`

Each artifact must be built and tested on its matching architecture.

## 1. Payload inspection

Verify the AppImage contains:
- AppRun entry point
- CIN Main Lobby executable
- graphical first-run installer
- GTK4/PyGObject runtime dependencies and introspection typelibs
- Deploy engine and network controller modules
- desktop integration metadata and icon

## 2. First-run installation

On a clean supported Linux desktop:
- Download the matching AppImage.
- Enable executable permission in the file manager if required.
- Double-click it.
- Confirm the graphical welcome installer appears.
- Select Install for this user.
- Confirm installation under `~/Applications`.
- Confirm desktop entry under `~/.local/share/applications`.
- Confirm no root, sudo, password prompt, terminal, package manager, or system directory modification occurs.

## 3. Main Lobby

Open the installed desktop entry. Verify Main Lobby is the first application screen and Settings navigation works in both directions.

## 4. Deploy

Verify the local manifest can be generated. Remote deployment must remain unavailable until the genuine publisher public key and signed official manifest are independently provisioned. Never trust a key delivered by the same downloaded manifest.

## 5. Network control

On supported systemd environments:
- Verify CIN's own process scope is the only scope affected.
- Toggle OFF and verify CIN network traffic is denied.
- Verify a separate process outside CIN retains network access.
- Toggle ON and verify CIN access returns.
- On unsupported systems, confirm the UI reports unavailable rather than claiming enforcement.

## 6. Uninstall and data preservation

Run `~/.local/bin/cin-uninstall`. Verify the installed AppImage and desktop launcher are removed. Verify user data and publisher trust configuration are preserved.

## 7. Distribution matrix

Test clean desktop environments on supported architectures, prioritizing Ubuntu, Debian, Fedora, and Linux Mint. Record distribution release, glibc version, architecture, GTK runtime behavior, installer result, and Main Lobby smoke-test result.

Do not publish until all required matrix tests pass.
