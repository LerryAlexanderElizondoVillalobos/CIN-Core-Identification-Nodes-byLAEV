# CIN Desktop End-to-End Test Plan

**Scope:** Linux x86_64 portable runtime feasibility prototype  
**Execution:** GitHub-hosted Ubuntu 24.04 virtual machines  
**Automation:** GitHub Actions + WebdriverIO + Tauri WebDriver  
**Status:** Harness proposed in PR; acceptance remains pending until the workflow runs successfully.

## Purpose

Exercise the same fundamental sequence an operator follows to obtain and run the current Linux prototype. This is a desktop application test on a clean GitHub-hosted VM, not only a Rust unit test or a headless command-line persistence probe.

## Automated operator journey

1. Build the Linux x86_64 ZIP and its SHA-256 checksum.
2. Upload the ZIP as a workflow artifact.
3. Start a separate, clean Ubuntu 24.04 GitHub-hosted VM.
4. Download the ZIP and checksum artifact onto that VM.
5. Verify the downloaded ZIP checksum.
6. Extract the ZIP into a user-writable directory.
7. Launch the packaged `run-cin.sh` entry point under a virtual X display.
8. Verify the desktop window, application heading and runtime status through WebDriver.
9. Click **Write persistence probe** and verify the GUI reports a committed record.
10. End the first WebDriver run so the application process is terminated.
11. Verify the record is outside the application directory.
12. Move the extracted application directory without moving the data root.
13. Launch the moved package in a new WebDriver run.
14. Click **Read persisted probe** and verify the original record is returned.
15. Confirm the record remains in the external data root.

The package is downloaded from the build job's artifact store onto a different VM. This tests the actual artifact handoff, not merely the build workspace.

## What this proves

- The downloaded ZIP and checksum are mutually consistent.
- The extracted launcher and executable can be started in the Ubuntu desktop runtime.
- The GUI is interactive through WebDriver.
- The GUI invokes the actual Tauri backend commands.
- Data survives termination of the first application process.
- Moving the extracted application folder does not move or erase the external data root.
- A second application process can read the persisted record.

## What this does not prove

- Physical hardware or GPU behavior on every Linux distribution.
- A production CIN Storage Engine; the current record is a prototype persistence probe.
- Package publisher authenticity; the checksum detects corruption but is not a publisher signature.
- Offline operation under an enforced network-deny policy.
- Windows or macOS compatibility.
- Linux ARM64 compatibility.
- USB signing, production cryptography, Genesis, Node Birth, Personal Registration or Main Lobby.

## Platform expansion

The current application package and launcher target Linux x86_64 and require host GTK/WebKitGTK libraries. Windows and macOS jobs must not be reported as supported merely because GitHub offers Windows and macOS runners.

After the runtime and package layout are made platform-neutral, add native VM jobs:
- Windows: native Windows runner, WebView2, Windows package and Windows data-root behavior.
- macOS: native macOS runner, WKWebView, macOS application/package and macOS data-root behavior.

WebdriverIO's Tauri service supports Windows, Linux and macOS. Its embedded WebDriver provider is the cross-platform route, including macOS; native `tauri-driver` is limited to Windows and Linux. Enabling the embedded provider requires test-only Tauri plugin configuration and must not leak into production builds.

## Cost and isolation

GitHub-hosted runners are ephemeral virtual machines. The Linux E2E job uses a virtual X display (Xvfb), not a physical monitor. GitHub Actions usage may consume the repository/account's included minutes or incur charges depending on repository visibility and plan. These CI costs are separate from the node owner's operating costs and must never become a runtime dependency of CIN.
