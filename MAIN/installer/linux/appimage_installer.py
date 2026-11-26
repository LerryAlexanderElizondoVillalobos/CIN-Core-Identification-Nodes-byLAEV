#!/usr/bin/env python3
"""First-run graphical installer for the CIN AppImage (per-user, no privilege escalation)."""
import os
import shutil
import subprocess
from pathlib import Path

import gi
gi.require_version("Gtk", "4.0")
from gi.repository import Gtk, Gio

APP_NAME = "Core Identification Nodes"
APPIMAGE_NAME = "Core_Identification_Nodes.AppImage"


class Installer(Gtk.Application):
    def __init__(self):
        super().__init__(application_id="bylaev.cin.appimage.installer",
                         flags=Gio.ApplicationFlags.NON_UNIQUE)

    def do_activate(self):
        window = Gtk.ApplicationWindow(application=self, title=APP_NAME)
        window.set_default_size(520, 300)
        window.set_resizable(False)
        page = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=16)
        for setter in (page.set_margin_top, page.set_margin_bottom,
                       page.set_margin_start, page.set_margin_end):
            setter(28)

        title = Gtk.Label(label="Welcome to Core Identification Nodes")
        title.add_css_class("title-1")
        title.set_wrap(True)
        page.append(title)
        detail = Gtk.Label(label=(
            "Install the complete CIN Main Lobby for this user only. "
            "No root access, sudo, administrator password, or system-wide changes are required. "
            "You can also run it without installing."
        ))
        detail.set_wrap(True)
        page.append(detail)

        install = Gtk.Button(label="Install for this user")
        install.add_css_class("suggested-action")
        install.connect("clicked", lambda _button: self.install(window))
        page.append(install)
        run = Gtk.Button(label="Run without installing")
        run.connect("clicked", lambda _button: self.run_app(window))
        page.append(run)
        note = Gtk.Label(label="Installation location: ~/Applications")
        note.add_css_class("dim-label")
        page.append(note)
        window.set_child(page)
        window.present()

    def source_appimage(self):
        source = os.environ.get("APPIMAGE")
        if not source or not Path(source).is_file():
            raise RuntimeError("The AppImage runtime did not provide its source file path.")
        return Path(source).resolve()

    def install(self, window):
        try:
            source = self.source_appimage()
            apps = Path.home() / "Applications"
            apps.mkdir(parents=True, exist_ok=True)
            target = apps / APPIMAGE_NAME
            temporary = apps / (APPIMAGE_NAME + ".new")
            shutil.copy2(source, temporary)
            temporary.chmod(temporary.stat().st_mode | 0o111)
            temporary.replace(target)

            applications = Path.home() / ".local/share/applications"
            applications.mkdir(parents=True, exist_ok=True)
            icons = Path.home() / ".local/share/icons/hicolor/scalable/apps"
            icons.mkdir(parents=True, exist_ok=True)
            icon = icons / "cin-main-lobby.svg"
            appdir = os.environ.get("APPDIR")
            bundled_icon = (Path(appdir) / "usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
                            if appdir else None)
            if bundled_icon and bundled_icon.is_file():
                shutil.copy2(bundled_icon, icon)

            desktop = applications / "cin-main-lobby.desktop"
            desktop.write_text(
                "[Desktop Entry]\n"
                "Type=Application\n"
                "Name=Core Identification Nodes\n"
                "Comment=CIN Main Lobby\n"
                f'Exec="{target}" --run\n'
                "Icon=cin-main-lobby\n"
                "Terminal=false\n"
                "Categories=Utility;\n"
                "StartupNotify=true\n",
                encoding="utf-8",
            )
            desktop.chmod(0o644)

            bin_dir = Path.home() / ".local/bin"
            bin_dir.mkdir(parents=True, exist_ok=True)
            uninstall = bin_dir / "cin-uninstall"
            uninstall.write_text(
                "#!/bin/sh\n"
                f'rm -f "{target}" "$HOME/.local/share/applications/cin-main-lobby.desktop"\n'
                'rm -f "$HOME/.local/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"\n'
                'rm -f "$HOME/.local/bin/cin-uninstall"\n'
                'echo "CIN launcher removed. User data and configuration were preserved."\n',
                encoding="utf-8",
            )
            uninstall.chmod(0o755)
            self.launch(target)
            window.close()
            self.quit()
        except Exception as exc:
            self.show_error(window, str(exc))

    def run_app(self, window):
        try:
            self.launch(self.source_appimage())
            window.close()
            self.quit()
        except Exception as exc:
            self.show_error(window, str(exc))

    @staticmethod
    def launch(path):
        subprocess.Popen([str(path), "--run"], start_new_session=True)

    @staticmethod
    def show_error(parent, message):
        dialog = Gtk.Window(title="CIN could not be started")
        dialog.set_transient_for(parent)
        dialog.set_modal(True)
        dialog.set_default_size(420, 180)
        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
        for setter in (box.set_margin_top, box.set_margin_bottom,
                       box.set_margin_start, box.set_margin_end):
            setter(18)
        label = Gtk.Label(label=message)
        label.set_wrap(True)
        label.set_selectable(True)
        box.append(label)
        close = Gtk.Button(label="Close")
        close.set_halign(Gtk.Align.END)
        close.connect("clicked", lambda _button: dialog.close())
        box.append(close)
        dialog.set_child(box)
        dialog.present()


if __name__ == "__main__":
    raise SystemExit(Installer().run([]))
