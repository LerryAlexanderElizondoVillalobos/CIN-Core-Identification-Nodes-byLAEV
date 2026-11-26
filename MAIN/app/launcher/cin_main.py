#!/usr/bin/python3
"""CIN Main Lobby — lightweight native GTK4 application."""

import argparse
import json
import sys
import gi
from pathlib import Path

from settings.deployment.engine import APP_DIR, KEY_PATH, compare, fetch_official, local_manifest, stage_and_apply

gi.require_version("Gtk", "4.0")
from gi.repository import Gtk, Gio, GLib

REPOSITORY_URL = "https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV"
APP_TITLE = "CIN Main Lobby"


class CinMainWindow(Gtk.ApplicationWindow):
    def __init__(self, app):
        super().__init__(application=app, title=APP_TITLE)
        self.set_default_size(720, 520)
        self.set_size_request(280, 360)
        self.set_resizable(True)
        self.current_screen = "lobby"
        self.set_child(self.build_lobby())

    def make_page(self):
        page = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=18)
        page.set_margin_top(28)
        page.set_margin_bottom(22)
        page.set_margin_start(28)
        page.set_margin_end(28)
        return page

    def make_footer(self):
        footer = Gtk.Label(label="© 2026 Core Identification Nodes byLAEV. All rights reserved.")
        footer.set_wrap(True)
        footer.add_css_class("dim-label")
        footer.set_justify(Gtk.Justification.CENTER)
        return footer

    def make_link(self):
        link = Gtk.LinkButton.new_with_label(REPOSITORY_URL, "Project repository")
        link.set_halign(Gtk.Align.CENTER)
        return link

    def build_lobby(self):
        page = self.make_page()
        top = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        top.set_halign(Gtk.Align.END)
        settings = Gtk.Button.new_from_icon_name("emblem-system-symbolic")
        settings.set_tooltip_text("Settings")
        settings.connect("clicked", lambda _button: self.show_settings())
        top.append(settings)
        page.append(top)

        page.append(Gtk.Box())
        title = Gtk.Label(label="Welcome to the Main Lobby")
        title.add_css_class("title-1")
        title.set_wrap(True)
        page.append(title)
        subtitle = Gtk.Label(label="Core Identification Nodes")
        subtitle.add_css_class("title-3")
        page.append(subtitle)

        actions = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=8)
        actions.set_halign(Gtk.Align.CENTER)
        create = Gtk.Button(label="Create")
        create.add_css_class("suggested-action")
        create.connect("clicked", lambda _button: self.show_create_information())
        actions.append(create)
        enter = Gtk.Button(label="Enter")
        enter.set_sensitive(False)
        enter.set_tooltip_text("Not available in this milestone")
        actions.append(enter)
        import_button = Gtk.Button(label="Import")
        import_button.set_sensitive(False)
        import_button.set_tooltip_text("Not available in this milestone")
        actions.append(import_button)
        page.append(actions)
        page.append(Gtk.Box())
        page.append(self.make_link())
        page.append(self.make_footer())
        return page

    def build_settings(self):
        page = self.make_page()
        header = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=12)
        back = Gtk.Button.new_from_icon_name("go-previous-symbolic")
        back.set_tooltip_text("Back to Main Lobby")
        back.connect("clicked", lambda _button: self.show_lobby())
        header.append(back)
        heading = Gtk.Label(label="Settings")
        heading.add_css_class("title-1")
        heading.set_hexpand(True)
        heading.set_halign(Gtk.Align.START)
        header.append(heading)
        page.append(header)

        content = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        content.set_margin_top(8)
        content.append(self.section_heading("Application Information"))
        for key, value in (
            ("Application", "CIN Main Lobby"),
            ("Project", "Core Identification Nodes byLAEV"),
            ("Application phase", "Phase 1 — Main Lobby"),
            ("Milestone", "Milestone 1 — Lobby and Settings Navigation"),
            ("Target platform", "Linux ARM64 / AArch64"),
            ("Network requirement", "Not required to open the application"),
        ):
            row = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
            name = Gtk.Label(label=key)
            name.set_xalign(0)
            name.set_hexpand(True)
            name.add_css_class("dim-label")
            value_label = Gtk.Label(label=value)
            value_label.set_xalign(1)
            value_label.set_wrap(True)
            row.append(name)
            row.append(value_label)
            content.append(row)

        content.append(self.section_heading("Current Capabilities"))
        for line in (
            "Create — available entry point; node creation and certificate issuance are not yet implemented.",
            "Enter — not available in this milestone.",
            "Import — not available in this milestone.",
        ):
            label = Gtk.Label(label=line)
            label.set_xalign(0)
            label.set_wrap(True)
            content.append(label)

        content.append(self.section_heading("Code Deployment"))
        deployment_status = Gtk.Label(label=self.deployment_status_text())
        deployment_status.set_xalign(0)
        deployment_status.set_wrap(True)
        content.append(deployment_status)
        manifest_button = Gtk.Button(label="Generate Local Manifest")
        manifest_button.connect("clicked", lambda _button: self.show_deployment_result(
            "Local Manifest", self.local_manifest_summary()))
        content.append(manifest_button)
        check_button = Gtk.Button(label="Check Official Development Channel")
        check_button.connect("clicked", lambda _button: self.check_deployment_channel())
        content.append(check_button)

        content.append(self.section_heading("Project Repository"))
        content.append(self.make_link())
        scroll = Gtk.ScrolledWindow()
        scroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
        scroll.set_child(content)
        scroll.set_vexpand(True)
        page.append(scroll)
        page.append(self.make_footer())
        return page


    @staticmethod
    def deployment_status_text():
        if not KEY_PATH.is_file():
            return ("Deployment engine installed. Publisher trust is not configured. "
                    f"Provision the official Ed25519 public key at {KEY_PATH}; "
                    "no update can be trusted or applied yet.")
        return "Deployment engine installed. Publisher key found; check the official channel manually."

    def local_manifest_summary(self):
        manifest = local_manifest(APP_DIR)
        return (f"Local build: {manifest['build_hash']}\\n"
                f"Components: {len(manifest['components'])}\\n"
                "Manifest generated locally from installed files.")

    def show_deployment_result(self, title, message):
        dialog = Gtk.Window(title=title)
        dialog.set_transient_for(self)
        dialog.set_modal(True)
        dialog.set_default_size(520, 220)
        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
        box.set_margin_top(18)
        box.set_margin_bottom(18)
        box.set_margin_start(18)
        box.set_margin_end(18)
        label = Gtk.Label(label=message)
        label.set_wrap(True)
        label.set_selectable(True)
        box.append(label)
        close = Gtk.Button(label="Close")
        close.connect("clicked", lambda _button: dialog.close())
        close.set_halign(Gtk.Align.END)
        box.append(close)
        dialog.set_child(box)
        dialog.present()

    def check_deployment_channel(self):
        try:
            manifest, _signature = fetch_official()
            proposal = compare(local_manifest(APP_DIR), manifest)
            changes = len(proposal["additions"]) + len(proposal["replacements"]) + len(proposal["removals"])
            if not changes:
                self.show_deployment_result("Code Deployment", "CIN is already at the official channel build.")
                return
            summary = (f"Proposed changes: {changes}\\n"
                       f"Additions: {len(proposal['additions'])}; replacements: {len(proposal['replacements'])}; "
                       f"removals: {len(proposal['removals'])}.\\n"
                       f"Target build: {proposal['target_build_hash']}\\n\\n"
                       "Deploy this exact verified proposal?")
            dialog = Gtk.Window(title="Authorize CIN Deployment")
            dialog.set_transient_for(self)
            dialog.set_modal(True)
            dialog.set_default_size(480, 240)
            box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
            box.set_margin_top(18)
            box.set_margin_bottom(18)
            box.set_margin_start(18)
            box.set_margin_end(18)
            label = Gtk.Label(label=summary)
            label.set_wrap(True)
            box.append(label)
            actions = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
            cancel = Gtk.Button(label="Cancel")
            cancel.connect("clicked", lambda _button: dialog.close())
            deploy = Gtk.Button(label="Authorize and Deploy")
            deploy.add_css_class("suggested-action")
            def apply(_button):
                try:
                    record = stage_and_apply(proposal, manifest, confirmed=True, root=APP_DIR)
                    dialog.close()
                    self.show_deployment_result("Deployment complete", json.dumps(record, indent=2))
                except Exception as exc:
                    dialog.close()
                    self.show_deployment_result("Deployment failed", str(exc))
            deploy.connect("clicked", apply)
            actions.append(cancel)
            actions.append(deploy)
            box.append(actions)
            dialog.set_child(box)
            dialog.present()
        except Exception as exc:
            self.show_deployment_result("Deployment unavailable", str(exc))

    @staticmethod
    def section_heading(text):
        label = Gtk.Label(label=text)
        label.add_css_class("heading")
        label.set_xalign(0)
        label.set_margin_top(8)
        return label

    def show_lobby(self):
        self.current_screen = "lobby"
        self.set_child(self.build_lobby())

    def show_settings(self):
        self.current_screen = "settings"
        self.set_child(self.build_settings())

    def show_create_information(self):
        dialog = Gtk.Window(title="Create")
        dialog.set_transient_for(self)
        dialog.set_modal(True)
        dialog.set_default_size(380, 180)
        content = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=12)
        content.set_margin_top(20)
        content.set_margin_bottom(20)
        content.set_margin_start(20)
        content.set_margin_end(20)
        message = Gtk.Label(
            label="The initial creation entry point is reserved for the founding CIN processes. "
                  "Node creation and certificate issuance are not implemented in this milestone."
        )
        message.set_wrap(True)
        content.append(message)
        close = Gtk.Button(label="Close")
        close.connect("clicked", lambda _button: dialog.close())
        close.set_halign(Gtk.Align.END)
        content.append(close)
        dialog.set_child(content)
        dialog.present()


class CinApplication(Gtk.Application):
    def __init__(self, smoke_test=False):
        super().__init__(application_id="bylaev.cin.main", flags=Gio.ApplicationFlags.DEFAULT_FLAGS)
        self.smoke_test = smoke_test
        self.window = None

    def do_activate(self):
        if self.window is None:
            self.window = CinMainWindow(self)
        self.window.present()
        if self.smoke_test:
            GLib.idle_add(self.run_navigation_smoke_test)

    def run_navigation_smoke_test(self):
        self.window.show_settings()
        assert self.window.current_screen == "settings"
        self.window.show_lobby()
        assert self.window.current_screen == "lobby"
        self.window.show_settings()
        assert self.window.current_screen == "settings"
        self.window.show_lobby()
        assert self.window.current_screen == "lobby"
        print("PASS: Lobby → Settings → Lobby navigation works.")
        self.quit()
        return GLib.SOURCE_REMOVE


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke-test", action="store_true")
    args, remaining = parser.parse_known_args()
    app = CinApplication(smoke_test=args.smoke_test)
    return app.run([sys.argv[0], *remaining])


if __name__ == "__main__":
    raise SystemExit(main())
