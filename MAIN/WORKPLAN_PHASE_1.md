# Phase 1 Workplan — Core Identification Nodes Official Debian Package

## Milestone objective

Deliver one downloadable file: Core_Identification_Nodes.deb, Debian package version 0.3.0, package name core-identification-nodes, architecture all. The single archive contains the CIN application, the user-space installer and uninstaller, the Deploy engine, and the application-scoped network controller.

The normal desktop user must be able to extract and run the embedded installer without root privileges, sudo, system package registration or writes to system directories. CIN must open Main Lobby first and demonstrate Settings navigation and the network OFF/ON policy from inside its dedicated systemd user scope.

This milestone does not claim that the founding certificate engines, node creation, Enter, Import or the CIN Package Engine are implemented.

## Technology and installation decisions

- UI: GTK 4 native desktop interface through Python GObject Introspection.
- Application language: Python 3.
- Official file: Core_Identification_Nodes.deb.
- Debian package metadata: core-identification-nodes, version 0.3.0, architecture all.
- The archive contains /opt/cin-main-lobby and /opt/cin-installer.
- Installation is performed by extracting the archive with dpkg-deb --extract and running its embedded user installer.
- The installer writes only to the current user's home directory. It refuses root execution and does not use sudo, apt install or dpkg -i.
- Runtime prerequisites: Python 3, PyGObject, GTK 4, OpenSSL, dpkg-deb, a running systemd user manager and systemd/cgroup support for IPAddressDeny.
- CIN launches inside cin-main-lobby.scope; the network switch controls only this scope.
- Persistent user data and publisher trust configuration are kept separately from replaceable application files.

The .deb is a portable payload container, not a registered system package. It is deliberately extracted and installed per-user.

## Included functionality

### Main Lobby and Settings
- Main Lobby is the initial screen.
- Settings opens from the Lobby and Back returns to the Lobby.
- Create reports honestly that node creation and certificate issuance are not implemented.
- Enter and Import remain disabled.

### Deploy engine
- Generates a deterministic local component manifest with SHA-256 hashes.
- Validates application/schema metadata and official manifest fingerprint.
- Verifies detached Ed25519 signatures against a public key provisioned independently at ~/.config/cin-main-lobby/deploy.pub.
- Compares component additions, replacements and removals.
- Stages HTTPS component downloads and verifies their SHA-256 hashes.
- Requires explicit operator confirmation before applying a proposal.
- Verifies the resulting build and restores the prior application tree if post-apply verification fails.
- Records the deployment result under ~/.local/share/cin-main-lobby/deployment-record.json.

The Deploy engine is included and its source tests are part of CI. Remote deployment is not live until the genuine publisher public key and a signed official manifest are provisioned and published.

### CIN network switch
- ON/OFF is enforced by systemd IPAddressDeny on cin-main-lobby.scope.
- OFF blocks IP networking for CIN's scope only.
- ON clears the CIN scope override.
- Host networking, NetworkManager and other applications are not modified.
- If the user manager or cgroup policy cannot be used, installation or the UI reports the limitation; CIN must not claim isolation that is not enforced.

## GitHub Actions qualification

1. Run all source and Deploy tests.
2. Compile-check Python source.
3. On x86_64 and ARM64, verify user-manager policy toggling and prove that denied scope networking does not affect host networking.
4. Run the native application smoke test inside the actual CIN systemd scope.
5. Build and inspect the one Debian file.
6. Verify the package contains the application, Deploy engine, network controller, embedded installer and uninstaller.
7. Extract the embedded installer and install as an unprivileged user.
8. Launch the installed application and test Lobby → Settings → Lobby and network OFF → ON.
9. Uninstall and verify user data and publisher configuration remain.
10. Publish only Core_Identification_Nodes.deb after every required gate succeeds.

CI may use administrator privileges to provision its disposable test environment. That is not part of the user's installation procedure.

## Operator installation

Download the single Core_Identification_Nodes.deb artifact. From the directory containing the file, run as the normal desktop user:

~~~bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
~~~

Launch:

~~~bash
~/.local/bin/cin-main
~~~

Uninstall:

~~~bash
bash ~/.local/opt/cin-main-lobby/uninstall-user.sh
~~~

## Definition of done

The milestone is complete only when:
- GitHub Actions publishes the single .deb artifact.
- The installer runs as a normal user and refuses root execution.
- The installed app and launcher remain under the user's home directory.
- Deploy engine and network controller are present in the package.
- Main Lobby is the initial screen and Settings navigation works.
- CIN's actual scope network switch turns OFF and ON successfully.
- Another process outside CIN retains network access while CIN is OFF.
- Uninstall removes application files but preserves user data and publisher configuration.
- The operator confirms installation and behavior on the target Linux desktop, including ARM64 if that is the target.

## Deferred scope

The three founding certificate processes, authoritative node records, external signing connectors, full Create workflow, Enter, Import and Phase 2 Package Engine remain later work.
