#!/bin/sh
# CIN EPM shared engine — POSIX Shell, analysis-only.
EPM_VERSION="0.2.0"
has() { command -v "$1" >/dev/null 2>&1; }
os_value() { [ -r /etc/os-release ] && sed -n "s/^$1=//p" /etc/os-release | head -n 1 | sed 's/^"//;s/"$//'; }
system_report() {
 os_id=$(os_value ID); os_name=$(os_value PRETTY_NAME); os_version=$(os_value VERSION_ID)
 [ -n "$os_id" ] || os_id=unknown; [ -n "$os_name" ] || os_name=Unknown-Linux
 kernel=$(uname -r 2>/dev/null || echo unknown); machine=$(uname -m 2>/dev/null || echo unknown)
 case "$machine" in x86_64|amd64) arch=x86_64;; aarch64|arm64) arch=arm64;; armv7l|armv6l) arch=arm;; i?86) arch=x86;; *) arch=unknown;; esac
 case "$kernel" in *android*) kernel_family=android;; *) kernel_family=linux;; esac
 if [ -n "${LINDESK_ROOT:-}\" ] || [ -n "${LINDESK_LOADER:-}" ]; then runtime=lindesk
 elif [ -n "${PREFIX:-}" ] && [ -d "${PREFIX:-/nonexistent}/../usr" ]; then runtime=termux
 elif [ -f /.dockerenv ] || grep -qiE 'docker|podman|container' /proc/1/cgroup 2>/dev/null; then runtime=container
 elif [ "$kernel_family" = android ]; then runtime=linux_on_android
 else runtime=native_or_unknown; fi
 proc_pid1=accessible; [ -r /proc/1/status ] || proc_pid1=restricted_or_unavailable
 proc_self_cgroup=unavailable; [ -r /proc/self/cgroup ] && proc_self_cgroup=available
 cgroup_mount=unavailable; [ -d /sys/fs/cgroup ] && cgroup_mount=available
 if has getconf; then libc=$(getconf GNU_LIBC_VERSION 2>/dev/null || echo unknown); else libc=unknown; fi
 if has dpkg-deb; then package_manager=dpkg; elif has rpm; then package_manager=rpm; elif has pacman; then package_manager=pacman; elif has apk; then package_manager=apk; else package_manager=unknown; fi
 gui_session=no; [ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ] && gui_session=yes
 python3_version=missing; has python3 && python3_version=$(python3 --version 2>&1 | sed 's/^Python //')
 py_gobject=missing; gtk4=missing
 if has python3 && python3 -c 'import gi' >/dev/null 2>&1; then py_gobject=available; fi
 if has python3 && python3 -c 'import gi; gi.require_version("Gtk", "4.0"); from gi.repository import Gtk' >/dev/null 2>&1; then gtk4=available; fi
 systemctl_bin=missing; has systemctl && systemctl_bin=available
 systemd_system=unavailable; if has systemctl && systemctl is-system-running >/dev/null 2>&1; then systemd_system=available; fi
 systemd_user=unavailable; if has systemctl && systemctl --user show-environment >/dev/null 2>&1; then systemd_user=available; fi
 dbus_daemon=missing; has dbus-daemon && dbus_daemon=available
 openssl=missing; has openssl && openssl=available
 iproute2=missing; has ip && iproute2=available
 printf 'os_id=%s\nos_name=%s\nos_version=%s\nkernel=%s\nkernel_family=%s\narchitecture=%s\nruntime_environment=%s\nlibc=%s\npackage_manager=%s\nproc_pid1=%s\nproc_self_cgroup=%s\ncgroup_mount=%s\ngui_session=%s\npython3=%s\npygobject=%s\ngtk4=%s\nsystemctl_binary=%s\nsystemd_system=%s\nsystemd_user=%s\ndbus_daemon=%s\nopenssl=%s\niproute2=%s\n' "$os_id" "$os_name" "$os_version" "$kernel" "$kernel_family" "$arch" "$runtime" "$libc" "$package_manager" "$proc_pid1" "$proc_self_cgroup" "$cgroup_mount" "$gui_session" "$python3_version" "$py_gobject" "$gtk4" "$systemctl_bin" "$systemd_system" "$systemd_user" "$dbus_daemon" "$openssl" "$iproute2"
}
compatibility_report() {
 os_id=$(os_value ID); machine=$(uname -m 2>/dev/null || echo unknown)
 status=not_assessed; blockers=; limitations=
 case "$os_id" in debian|ubuntu|linuxmint|pop) :;; *) blockers="${blockers}unsupported_or_unqualified_distribution; ";; esac
 has dpkg-deb || blockers="${blockers}dpkg-deb_missing; "
 has python3 || blockers="${blockers}python3_missing; "
 has openssl || blockers="${blockers}openssl_missing; "
 if has python3 && ! python3 -c 'import gi; gi.require_version("Gtk", "4.0"); from gi.repository import Gtk' >/dev/null 2>&1; then blockers="${blockers}python_gobject_gtk4_missing; "; fi
 case "$machine" in x86_64|amd64|aarch64|arm64) :;; *) blockers="${blockers}unsupported_architecture; ";; esac
 if ! has systemctl || ! systemctl --user show-environment >/dev/null 2>&1; then limitations="${limitations}systemd_user_manager_unavailable; "; fi
 [ -d /sys/fs/cgroup ] || limitations="${limitations}cgroup_filesystem_not_visible; "
 [ -r /proc/1/status ] || limitations="${limitations}pid1_information_restricted; "
 if [ -n "$blockers" ]; then status=not_compatible; elif [ -n "$limitations" ]; then status=compatible_with_limitations; else status=prerequisites_detected; fi
 [ -n "$blockers" ] || blockers=none; [ -n "$limitations" ] || limitations=none
 printf 'lobby_compatibility=%s\nblocking_requirements=%s\nenvironment_limitations=%s\ninstallation_readiness=not_verified\n' "$status" "$blockers" "$limitations"
}
report() { system_report; compatibility_report; printf 'epm_version=%s\nrelease_discovery=not_configured\ninstallation_actions=disabled\n' "$EPM_VERSION"; }
case "${1:---report}" in --version|-V) echo "CIN EPM $EPM_VERSION";; --report|report) report;; --system) system_report;; --compatibility) compatibility_report;; --help|-h) echo 'CIN EPM 0.2.0: --report --system --compatibility --version --help (analysis only)';; *) echo "Unknown command: $1" >&2; exit 2;; esac
