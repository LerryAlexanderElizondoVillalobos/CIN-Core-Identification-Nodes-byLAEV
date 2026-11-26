#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
ARCH="$(uname -m)"
case "$ARCH" in
  aarch64|arm64) APPIMAGE_ARCH=aarch64 ;;
  *) echo "CIN is currently released only for Linux ARM64; detected: $ARCH" >&2; exit 2 ;;
esac

for tool in python3 linuxdeploy readelf rsvg-convert desktop-file-validate; do
  command -v "$tool" >/dev/null || { echo "Missing build dependency: $tool" >&2; exit 1; }
done

BUILD="$ROOT/build/appimage"
APPDIR="$BUILD/AppDir"
PYDIST="$BUILD/pyinstaller-dist"
DIST="$ROOT/dist"
rm -rf "$BUILD" "$DIST"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" \
  "$APPDIR/usr/share/icons/hicolor/scalable/apps" "$DIST" "$BUILD/venv" "$PYDIST"

python3 -m venv --system-site-packages "$BUILD/venv"
PYTHON="$BUILD/venv/bin/python"
"$PYTHON" -m pip install --disable-pip-version-check pyinstaller

# onedir is intentional: the Python runtime, GI extension modules and resources
# must remain inspectable and discoverable by linuxdeploy.
"$PYTHON" -m PyInstaller --noconfirm --clean --distpath "$PYDIST" --workpath "$BUILD/work-main" \
  --name cin-main --paths MAIN/app --collect-all gi --collect-all cairo \
  --collect-submodules settings MAIN/app/launcher/cin_main.py
"$PYTHON" -m PyInstaller --noconfirm --clean --distpath "$PYDIST" --workpath "$BUILD/work-installer" \
  --name cin-appimage-installer --collect-all gi --collect-all cairo \
  MAIN/installer/linux/appimage_installer.py

install -d "$APPDIR/usr/lib/cin-main" "$APPDIR/usr/lib/cin-appimage-installer"
cp -a "$PYDIST/cin-main/." "$APPDIR/usr/lib/cin-main/"
cp -a "$PYDIST/cin-appimage-installer/." "$APPDIR/usr/lib/cin-appimage-installer/"

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
desktop-file-validate "$APPDIR/usr/share/applications/cin-main-lobby.desktop"
install -m 0644 MAIN/installer/linux/cin-main-lobby.svg "$APPDIR/usr/share/icons/hicolor/scalable/apps/cin-main-lobby.svg"
command -v rsvg-convert >/dev/null || { echo "Missing build dependency: rsvg-convert (librsvg2-bin)" >&2; exit 1; }
mkdir -p "$APPDIR/usr/share/icons/hicolor/256x256/apps"
rsvg-convert -w 256 -h 256 MAIN/installer/linux/cin-main-lobby.svg -o "$APPDIR/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"
test -s "$APPDIR/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png"

# PyGObject loads typelib metadata dynamically; ELF dependency scanning alone
# does not discover these files. Bundle the complete typelib directory.
GI_DIR="/usr/lib/aarch64-linux-gnu/girepository-1.0"
if [[ ! -d "$GI_DIR" ]]; then
  echo "GTK introspection metadata not found at $GI_DIR" >&2
  exit 1
fi
mkdir -p "$APPDIR/usr/lib/girepository-1.0"
find "$GI_DIR" -maxdepth 1 -type f -name '*.typelib' -exec install -m 0644 {} "$APPDIR/usr/lib/girepository-1.0/" \;

# Explicitly seed GTK's dynamically loaded libraries and modules. linuxdeploy
# then resolves their transitive ELF dependencies into the AppDir.
LIB_DIR="/usr/lib/aarch64-linux-gnu"
for pattern in libgtk-4.so* libgdk-4.so* libgsk-4.so* libgraphene-1.0.so*; do
  while IFS= read -r -d '' library; do
    install -m 0644 "$library" "$APPDIR/usr/lib/$(basename "$library")"
  done < <(find "$LIB_DIR" -maxdepth 1 -type f -name "$pattern" -print0)
done
if [[ -d "$LIB_DIR/gtk-4.0" ]]; then
  cp -a "$LIB_DIR/gtk-4.0" "$APPDIR/usr/lib/"
fi
if [[ -f /usr/share/glib-2.0/schemas/gschemas.compiled ]]; then
  mkdir -p "$APPDIR/usr/share/glib-2.0/schemas"
  install -m 0644 /usr/share/glib-2.0/schemas/gschemas.compiled "$APPDIR/usr/share/glib-2.0/schemas/"
fi

chmod -R a+rX "$APPDIR"
mkdir -p "$BUILD/appimage-output"
export APPIMAGE_EXTRACT_AND_RUN=1
# GTK is loaded dynamically by GI typelibs, so seed only the four GTK
# runtime libraries. linuxdeploy follows their ELF dependencies recursively.
# Avoid passing every PyInstaller .so/data file: some bundled resources carry
# .so-like names but are not deployable ELF objects.
LIB_ARGS=()
for library in "$APPDIR"/usr/lib/libgtk-4.so* "$APPDIR"/usr/lib/libgdk-4.so* \
               "$APPDIR"/usr/lib/libgsk-4.so* "$APPDIR"/usr/lib/libgraphene-1.0.so*; do
  [[ -f "$library" ]] || continue
  if readelf -h "$library" >/dev/null 2>&1; then
    LIB_ARGS+=(--library "$library")
  fi
done

(cd "$BUILD/appimage-output" && linuxdeploy --appdir "$APPDIR" \
  --executable "$APPDIR/usr/lib/cin-main/cin-main" \
  --executable "$APPDIR/usr/lib/cin-appimage-installer/cin-appimage-installer" \
  "${LIB_ARGS[@]}" \
  --desktop-file "$APPDIR/usr/share/applications/cin-main-lobby.desktop" \
  --icon-file "$APPDIR/usr/share/icons/hicolor/256x256/apps/cin-main-lobby.png" \
  --output appimage)

# linuxdeploy emits the AppImage in the dedicated build output directory.
mapfile -t CANDIDATES < <(find "$BUILD/appimage-output" -maxdepth 1 -type f -name '*.AppImage' -print)
if [[ "${#CANDIDATES[@]}" -ne 1 ]]; then
  printf 'Expected exactly one generated AppImage, found %s\n' "${#CANDIDATES[@]}" >&2
  printf '%s\n' "${CANDIDATES[@]}" >&2
  exit 1
fi
install -m 0755 "${CANDIDATES[0]}" "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
rm -f "${CANDIDATES[0]}"
test -s "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
file "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
sha256sum "$DIST/Core_Identification_Nodes-$APPIMAGE_ARCH.AppImage"
