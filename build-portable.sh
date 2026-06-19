#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$ROOT_DIR/portable"
PACKAGE_ROOT="$ROOT_DIR/out"
PLATFORM="win32"
ARCH="${ARCH:-x64}"

cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js wurde nicht gefunden. Bitte Node.js installieren und erneut ausfuehren." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm wurde nicht gefunden. Bitte npm installieren und erneut ausfuehren." >&2
  exit 1
fi

if [[ "${FORCE_NPM_CI:-0}" == "1" ||
  ! -d "$ROOT_DIR/node_modules" ||
  ! -d "$ROOT_DIR/node_modules/@electron-forge/cli" ]]; then
  echo "Installiere Dependencies..."
  npm ci
else
  echo "Nutze vorhandene Dependencies aus node_modules."
  echo "Fuer eine frische Installation: FORCE_NPM_CI=1 ./build-portable.sh"
fi

echo "Baue portable Windows-App fuer $PLATFORM/$ARCH..."
npm run package -- --platform="$PLATFORM" --arch="$ARCH"

PACKAGE_DIR="$(find "$PACKAGE_ROOT" -maxdepth 1 -type d -name "*-$PLATFORM-$ARCH" | head -n 1)"
if [[ -z "$PACKAGE_DIR" ]]; then
  echo "Konnte das Forge-Package unter '$PACKAGE_ROOT' nicht finden." >&2
  exit 1
fi

EXE_PATH="$(find "$PACKAGE_DIR" -maxdepth 1 -type f -name "*.exe" | head -n 1)"
if [[ -z "$EXE_PATH" ]]; then
  echo "Konnte keine EXE im Package '$PACKAGE_DIR' finden." >&2
  exit 1
fi

EXE_NAME="$(basename "$EXE_PATH")"

echo "Erstelle portablen Ordner..."
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/app" "$OUT_DIR/data"
cp -R "$PACKAGE_DIR"/. "$OUT_DIR/app/"

cat > "$OUT_DIR/Start-JOZI-Portable.cmd" <<EOF
@echo off
setlocal
set "PORTABLE_ROOT=%~dp0"
set "JOZI_PORTABLE_DATA_DIR=%PORTABLE_ROOT%data"
if not exist "%JOZI_PORTABLE_DATA_DIR%" mkdir "%JOZI_PORTABLE_DATA_DIR%"
start "" "%PORTABLE_ROOT%app\\$EXE_NAME"
endlocal
EOF

cat > "$OUT_DIR/README-PORTABLE.txt" <<EOF
JOZI Control Center Portable

Start:
  Start-JOZI-Portable.cmd ausfuehren.

Datenbank:
  Die SQLite-Datenbank liegt portabel unter:
  data\\jozi-control-center.db

Hinweis:
  Den gesamten Ordner 'portable' zusammenhalten, wenn die App auf USB-Stick,
  Netzlaufwerk oder einen anderen PC kopiert wird.
EOF

echo
echo "Portable App erstellt:"
echo "  $OUT_DIR"
echo
echo "Startdatei:"
echo "  $OUT_DIR/Start-JOZI-Portable.cmd"
