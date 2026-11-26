#!/bin/sh
# CIN EPM shared functional engine. POSIX sh; no graphical/runtime dependency.
EPM_VERSION="0.1.0"

has() { command -v "$1" >/dev/null 2>&1; }
read_os_value() {
    key=$1
    if [ -r /etc/os-release ]; then
        sed -n "s/^${key}=//p" /etc/os-release | head -n 1 | sed 's/^"//;s/"$//'
    fi
}
system_report() {
    os_id=$(read_os_value ID); os_name=$(read_os_value PRETTY_NAME); os_version=$(read_os_value VERSION_ID)
    [ -n "$os_id" ] || os_id=unknown
    [ -n "$os_name" ] || os_name=Unknown-Linux
    kernel=$(uname -r 2>/dev/null || printf unknown)
    machine=$(uname -m 2>/dev/null || printf unknown)
    case "$machine" in x86_64|amd64) arch=x86_64 ;; aarch64|arm64) arch=arm64 ;; armv7l|armv6l) arch=arm ;; i?86) arch=x86 ;; *) arch=unknown ;; esac
    if has getconf; then libc=$(getconf GNU_LIBC_VERSION 2>/dev/null || printf unknown); else libc=unknown; fi
    if has dpkg-deb; then package_manager=dpkg
    elif has rpm; then if has dnf; then package_manager=dnf; elif has zypper; then package_manager=zypper; else package_manager=rpm; fi
    elif has pacman; then package_manager=pacman
    elif has apk; then package_manager=apk
    else package_manager=unknown; fi
    if [ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]; then gui_session=yes; else gui_session=no; fi
    python3_version=missing
    if has python3; then python3_version=$(python3 --version 2>&1 | sed 's/^Python //'); fi
    gtk4=missing
    if has python3 && python3 -c 'import gi; gi.require_version("Gtk", "4.0"); from gi.repository import Gtk' >/dev/null 2>&1; then gtk4=available; fi
    systemd_user=missing
    if has systemctl && systemctl --user show-environment >/dev/null 2>&1; then systemd_user=available; fi
    printf 'os_id=%s\nos_name=%s\nos_version=%s\nkernel=%s\narchitecture=%s\nlibc=%s\npackage_manager=%s\ngui_session=%s\npython3=%s\ngtk4=%s\nsystemd_user=%s\n' "$os_id" "$os_name" "$os_version" "$kernel" "$arch" "$libc" "$package_manager" "$gui_session" "$python3_version" "$gtk4" "$systemd_user"
}
compatibility_report() {
    os_id=$(read_os_value ID); compatible=yes; reasons=
    case "$os_id" in debian|ubuntu|linuxmint|pop) : ;; *) compatible=no; reasons="${reasons}Distribution is not documented as Debian-compatible; " ;; esac
    has dpkg-deb || { compatible=no; reasons="${reasons}dpkg-deb is missing; "; }
    has python3 || { compatible=no; reasons="${reasons}Python 3 is missing; "; }
    if has python3 && ! python3 -c 'import gi; gi.require_version("Gtk", "4.0"); from gi.repository import Gtk' >/dev/null 2>&1; then compatible=no; reasons="${reasons}Python PyGObject with GTK 4 is unavailable; "; fi
    has openssl || { compatible=no; reasons="${reasons}OpenSSL is missing; "; }
    if ! has systemctl || ! systemctl --user show-environment >/dev/null 2>&1; then compatible=no; reasons="${reasons}systemd user manager is unavailable; "; fi
    machine=$(uname -m 2>/dev/null || printf unknown)
    case "$machine" in x86_64|amd64|aarch64|arm64) : ;; *) compatible=no; reasons="${reasons}CPU architecture is not documented for the current package; " ;; esac
    if [ "$compatible" = yes ]; then reasons='All currently documented Main Lobby prerequisites detected.'; fi
    printf 'lobby_compatible=%s\ncompatibility_reason=%s\n' "$compatible" "$reasons"
}
report() {
    system_report
    compatibility_report
    printf 'epm_version=%s\nrelease_discovery=not_configured\nrelease_note=No published compatibility manifest is wired into this prototype; no release is selected.\n' "$EPM_VERSION"
}
case "${1:-report}" in
    --version|-V) printf 'CIN EPM %s\n' "$EPM_VERSION" ;;
    --report|report) report ;;
    --system) system_report ;;
    --compatibility) compatibility_report ;;
    --help|-h) cat <<'HELP'
CIN EPM — Environment Preparation Manager
Usage: epm [command]
  --report         Analyze Linux and current Main Lobby prerequisites (default)
  --system         Display detected environment
  --compatibility  Evaluate documented Main Lobby requirements
  --version        Display EPM version
  --help           Display this help
This increment is analysis-only. It does not install packages or modify the host.
HELP
        ;;
    *) printf 'Unknown command: %s\n' "$1" >&2; exit 2 ;;
esac
