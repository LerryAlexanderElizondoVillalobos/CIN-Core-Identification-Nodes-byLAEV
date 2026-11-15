# CIN Android Web App (PWA) — Initial Delivery Profile

**Status:** Initial installable web-app shell published; local Runner bridge not implemented  
**Target:** Android devices without distributing an APK  
**Delivery:** HTTPS-hosted Progressive Web App (PWA)

## 1. Purpose

The CIN Genesis Lobby is delivered to Android as an installable web application. The user opens the official GitHub Pages Lobby in a supported browser and selects the browser's **Install app** or **Add to Home screen** action. The installed PWA launches in a standalone window and can cache its application shell for repeat visits.

## 2. What the PWA provides

- Lobby interface and Genesis workflow presentation.
- Browser-limited environment preview using web platform APIs.
- Certificate retrieval while online.
- Manifest preview and user-initiated download.
- Offline availability of the cached Lobby shell after its first successful load.

## 3. Execution boundary

A PWA runs inside the browser security model. It cannot independently inspect the complete Android operating-system configuration, enumerate all hardware, inspect arbitrary system files, or write to CIN private application storage. User-granted browser file access varies by browser and platform.

Therefore, the Android PWA is the installation and interaction surface, not a replacement for the native Rust Certificate Runner.

## 4. Full collection options

To obtain the full Genesis collection profile on Android without publishing an APK, a separately installed local execution service or a future platform-supported bridge is required. The PWA can request work from that local component only after the user has installed and explicitly authorized it. Until that component exists, the PWA must label its output as browser-limited and must not register it as the authoritative full Genesis Environment Manifest.

## 5. Desktop targets

The Rust Runner remains the authoritative local collector for desktop platforms. Release packaging targets are:

- Windows: signed installer or portable executable.
- macOS: signed/notarized application package or portable command-line bundle.
- Linux: portable archive and distribution packages.

The cross-platform CI build matrix is a compilation and test gate, not proof that release installers, signing, notarization, or runtime hardware collection have passed acceptance.

## 6. Acceptance gates

1. PWA manifest, service worker, and app icon served over HTTPS.
2. Android installation and standalone launch tested on real supported browsers.
3. Browser preview clearly distinguished from full local collection.
4. Rust Runner build, formatting, Clippy, unit tests and Genesis E2E pass on Linux, Windows and macOS.
5. Local Lobby-to-Runner protocol implemented with explicit user authorization.
6. Full environment manifest saved through CIN DataRoot and TransactionalStore, then read back and verified.
7. Desktop packages built and tested on each target OS.
8. Android local-collector capability remains a separate gate; no APK is required for the PWA interface itself.
