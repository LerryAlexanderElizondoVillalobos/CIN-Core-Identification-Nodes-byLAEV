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

for tool in python3 linuxdeploy; do
  command -v "$tool" >/dev/null || { echo "Missing build dependency: $tool" >&2; exit 1; }
done

BUILD="$ROOT/build/appimage"
APPDIR="$BUILD/AppDir"
DIST="$ROOT/dist"
rm -rf "$BUILD" "$DIST"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/scalable/apps" "$DIST" "$BUILD/venv"

python3 -m venv --system-site-packages "$BUILD/venv"
PYTHON="$BUILD/venv/bin/python"
"$PYTHON" -m pip install --upgrade pip pyinstaller
"$PYTHON" -m PyInstaller --noconfirm --clean --name cin-main \
  --paths MAIN/app --collect-all gi --collect-all cairo \
  MAIN/app/launcher/cin_main.py
"$PYTHON" -m PyInstaller --noconfirm --clean --name cin-appimage-installer \
  --collect-all gi --collect-all cairo MAIN/installer/linux/appimage_installer.py

install -d "$APPDIR/usr/lib/cin-main" "$APPDIR/usr/lib/cin-appimage-installer"
cp -a dist/cin-main/. "$APPDIR/usr/lib/cin-main/"
cp -a dist/cin-appimage-installer/. "$APPDIR/usr/lib/cin-appimage-installer/"
cat > "$APPDIR/usr/bin/cin-main" <<'EOF'
#!/bin/sh
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec "$HERE/../lib/cin-main/cin-main" "$@"
EOF
cat > "$APPDIR/usr/bin/cin-appimage-installer" <<'EOF'
#!/bin/sh
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec "$HERE/../lib/cin-appimage-installer/cin-appimage-installer" "$@"
EOF
chmod 0755 "$APPDIR/usr/bin/cin-main" "$APPDIR/usr/bin/cin-appimage-installer"
install -m 0755 MAIN/installer/linux/AppRun "$APPDIR/AppRun"
install -m 0644 MAIN/installer/linux/cin-main-lobby.desktop "$APPDIR/usr/share/applications/cin-main-lobby.desktop"
install -m 0644 MAIN/installer/linux/cin-main-lobby.svg "$APPDIR/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
cp -a MAIN/app/settings "$APPDIR/usr/share/cin-main-lobby-settings"

# Bundle GTK introspection metadata used by PyGObject. linuxdeploy resolves ELF
# shared-library dependencies; typelibs are runtime-loaded and copied explicitly.
GI_DIR="/usr/lib/$([ "$APPIMAGE_ARCH" = x86_64 ] && echo x86_64-linux-gnu || echo aarch64-linux-gnu)/girepository-1.0"
if [[ ! -d "$GI_DIR" ]]; then
  echo "GTK introspection metadata not found at $GI_DIR" >&2
  exit 1
fi
mkdir -p "$APPDIR/usr/lib/girepository-1.0"
for typelib in Gtk-4.0 Gdk-4.0 Gsk-4.0 Gio-2.0 GioUnix-2.0 GLib-2.0 GModule-2.0 GObject-2.0 Pango-1.0 cairo-1.0 GdkPixbuf-2.0 Graphene-1.0; do
  file="$GI_DIR/$typelib.typelib"
  [[ ! -f "$file" ]] || install -m 0644 "$file" "$APPDIR/usr/lib/girepository-1.0/"
done

# GTK4 is loaded by GObject Introspection at runtime, so include its ELF
# libraries explicitly; linuxdeploy then follows their transitive dependencies.
LIB_DIR="/usr/lib/$([ "$APPIMAGE_ARCH" = x86_64 ] && echo x86_64-linux-gnu || echo aarch64-linux-gnu)"
for library in libgtk-4.so.1 libgdk-4.so.1 libgsk-4.so.1 libgraphene-1.0.so.0; do
  [[ ! -e "$LIB_DIR/$library" ]] || install -m 0644 "$LIB_DIR/$library" "$APPDIR/usr/lib/"
done
if [[ -d "$LIB_DIR/gtk-4.0" ]]; then
  cp -a "$LIB_DIR/gtk-4.0" "$APPDIR/usr/lib/"
fi
if [[ -f /usr/share/glib-2.0/schemas/gschemas.compiled ]]; then
  mkdir -p "$APPDIR/usr/share/glib-2.0/schemas"
  install -m 0644 /usr/share/glib-2.0/schemas/gschemas.compiled "$APPDIR/usr/share/glib-2.0/schemas/"
fi

export APPIMAGE_EXTRACT_AND_RUN=1
LIB_ARGS=()
while IFS= read -r library; do LIB_ARGS+=(--library "$library"); done < <(find "$APPDIR/usr/lib" -type f -name '*.so*')
linuxdeploy --appdir "$APPDIR" --executable "$APPDIR/usr/lib/cin-main/cin-main" \
  --executable "$APPDIR/usr/lib/cin-appimage-installer/cin-appimage-installer" "${LIB_ARGS[@]}" \
  --desktop-file "$APPDIR/usr/share/applications/cin-main-lobby.desktop" \
  --icon-file "$APPDIR/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg" \
  --output appimage
mkdir -p "$DIST"
find "$ROOT" -maxdepth 1 -type f -name '*.AppImage' -exec mv {} "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage" \;
test -s "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
chmod 0755 "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
file "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
sha256sum "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
