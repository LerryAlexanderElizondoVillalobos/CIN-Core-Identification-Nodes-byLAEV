#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64) APPIMAGE_ARCH=x86_64 ;;
  aarch64|arm64) APPIMAGE_ARCH=aarch64 ;;
  *) echo "Unsupported build architecture: $ARCH" >&2; exit 2 ;;
esac

for tool in python3 pip3 linuxdeploy; do
  command -v "$tool" >/dev/null || { echo "Missing build dependency: $tool" >&2; exit 1; }
done
if ! command -v appimagetool >/dev/null && [[ -z "${APPIMAGETOOL:-}" ]]; then
  echo "appimagetool is required (set APPIMAGETOOL or add it to PATH)." >&2
  exit 1
fi

BUILD="$ROOT/build/appimage"
APPDIR="$BUILD/AppDir"
DIST="$ROOT/dist"
rm -rf "$BUILD" "$DIST"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/scalable/apps" "$DIST"

python3 -m pip install --user --upgrade pyinstaller
python3 -m PyInstaller --noconfirm --clean --onefile --name cin-main \
  --paths MAIN/app --collect-all gi --collect-all cairo \
  MAIN/app/launcher/cin_main.py
python3 -m PyInstaller --noconfirm --clean --onefile --name cin-appimage-installer \
  --collect-all gi --collect-all cairo MAIN/installer/linux/appimage_installer.py

install -m 0755 dist/cin-main "$APPDIR/usr/bin/cin-main"
install -m 0755 dist/cin-appimage-installer "$APPDIR/usr/bin/cin-appimage-installer"
install -m 0755 MAIN/installer/linux/AppRun "$APPDIR/AppRun"
install -m 0644 MAIN/installer/linux/cin-main-lobby.desktop "$APPDIR/usr/share/applications/cin-main-lobby.desktop"
cp -a MAIN/app/settings "$APPDIR/usr/share/cin-main-lobby-settings"

# Bundle GTK introspection metadata used by PyGObject. linuxdeploy resolves ELF
# shared-library dependencies; typelibs are runtime-loaded and copied explicitly.
GI_DIR="/usr/lib/$([ "$APPIMAGE_ARCH" = x86_64 ] && echo x86_64-linux-gnu || echo aarch64-linux-gnu)/girepository-1.0"
if [[ ! -d "$GI_DIR" ]]; then
  echo "GTK introspection metadata not found at $GI_DIR" >&2
  exit 1
fi
mkdir -p "$APPDIR/usr/lib/girepository-1.0"
for typelib in Gtk-4.0 Gdk-4.0 Gio-2.0 GLib-2.0 GObject-2.0 Pango-1.0 cairo-1.0 GdkPixbuf-2.0 Graphene-1.0; do
  file="$GI_DIR/$typelib.typelib"
  [[ ! -f "$file" ]] || install -m 0644 "$file" "$APPDIR/usr/lib/girepository-1.0/"
done

export APPIMAGE_EXTRACT_AND_RUN=1
linuxdeploy --appdir "$APPDIR" --executable "$APPDIR/usr/bin/cin-main" \
  --executable "$APPDIR/usr/bin/cin-appimage-installer" \
  --desktop-file "$APPDIR/usr/share/applications/cin-main-lobby.desktop" \
  --output appimage
mkdir -p "$DIST"
find "$ROOT" -maxdepth 1 -type f -name '*.AppImage' -exec mv {} "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage" \;
test -s "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
chmod 0755 "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
file "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
sha256sum "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
