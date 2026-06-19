$ErrorActionPreference = "Stop"

$RootDir = $PSScriptRoot
$OutDir = Join-Path $RootDir "portable"
$PackageRoot = Join-Path $RootDir "out"
$Platform = "win32"
$Arch = if ($env:ARCH) { $env:ARCH } else { "x64" }
$PortableExeName = "JOZI-Docs.exe"
$DatabaseFileName = "jozi-control-center.db"

Set-Location $RootDir

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js wurde nicht gefunden. Bitte Node.js installieren und erneut ausfuehren."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm wurde nicht gefunden. Bitte npm installieren und erneut ausfuehren."
}

$nodeModules = Join-Path $RootDir "node_modules"
$forgeCli = Join-Path $nodeModules "@electron-forge\cli"

if ($env:FORCE_NPM_CI -eq "1" -or -not (Test-Path $nodeModules) -or -not (Test-Path $forgeCli)) {
  Write-Host "Installiere Dependencies..."
  npm ci
} else {
  Write-Host "Nutze vorhandene Dependencies aus node_modules."
  Write-Host "Fuer eine frische Installation: `$env:FORCE_NPM_CI='1'; .\build-portable.ps1"
}

Write-Host "Baue portable Windows-App fuer $Platform/$Arch..."
npx --no-install electron-forge package --platform=$Platform --arch=$Arch

$packageDir = Get-ChildItem -Path $PackageRoot -Directory -Filter "*-$Platform-$Arch" |
  Select-Object -First 1

if (-not $packageDir) {
  Write-Error "Konnte das Forge-Package unter '$PackageRoot' nicht finden."
}

$exe = Get-ChildItem -Path $packageDir.FullName -File -Filter "*.exe" |
  Select-Object -First 1

if (-not $exe) {
  Write-Error "Konnte keine EXE im Package '$($packageDir.FullName)' finden."
}

$sourceDb = $null
if ($env:JOZI_SOURCE_DB) {
  $sourceDb = Get-Item -LiteralPath $env:JOZI_SOURCE_DB -ErrorAction SilentlyContinue
  if (-not $sourceDb) {
    Write-Error "JOZI_SOURCE_DB ist gesetzt, aber die Datei wurde nicht gefunden: $env:JOZI_SOURCE_DB"
  }
} else {
  $sourceCandidates = @(
    (Join-Path $env:APPDATA "JOZI Control & Documentation Center\$DatabaseFileName"),
    (Join-Path $env:APPDATA "Electron\$DatabaseFileName")
  )

  $sourceDb = $sourceCandidates |
    ForEach-Object { Get-Item -LiteralPath $_ -ErrorAction SilentlyContinue } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

if (-not $sourceDb) {
  Write-Error "Keine bestehende SQLite-Datenbank gefunden. Portable Build abgebrochen, damit keine leere Datenbank ausgeliefert wird. Erwartet z.B.: $env:APPDATA\JOZI Control & Documentation Center\$DatabaseFileName"
}

Write-Host "Erstelle portablen Ordner..."
if (Test-Path $OutDir) {
  Remove-Item -LiteralPath $OutDir -Recurse -Force
}

$portableAppDir = Join-Path $OutDir "app"
$portableDataDir = Join-Path $OutDir "data"
New-Item -ItemType Directory -Path $portableAppDir, $portableDataDir -Force | Out-Null

Copy-Item -Path (Join-Path $packageDir.FullName "*") -Destination $portableAppDir -Recurse -Force
Rename-Item -LiteralPath (Join-Path $portableAppDir $exe.Name) -NewName $PortableExeName -Force

$portableDbPath = Join-Path $portableDataDir $DatabaseFileName
Write-Host "Kopiere aktuelle SQLite-Datenbank:"
Write-Host "  Quelle: $($sourceDb.FullName)"
Write-Host "  Ziel:   $portableDbPath"

$backupScript = @'
const { DatabaseSync } = require('node:sqlite');
const source = process.argv[2];
const target = process.argv[3];
const escapedTarget = target.replace(/'/g, "''");
const db = new DatabaseSync(source, { readOnly: true });
db.exec("VACUUM INTO '" + escapedTarget + "'");
db.close();
'@

$backupScript | node - $sourceDb.FullName $portableDbPath

if (-not (Test-Path $portableDbPath)) {
  Write-Error "Die portable SQLite-Datenbank wurde nicht erstellt: $portableDbPath"
}

$starterPath = Join-Path $OutDir "Start-JOZI-Portable.cmd"
@"
@echo off
setlocal
set "PORTABLE_ROOT=%~dp0"
set "JOZI_PORTABLE_DATA_DIR=%PORTABLE_ROOT%data"
if not exist "%JOZI_PORTABLE_DATA_DIR%" mkdir "%JOZI_PORTABLE_DATA_DIR%"
start "" "%PORTABLE_ROOT%app\$PortableExeName"
endlocal
"@ | Set-Content -Path $starterPath -Encoding ASCII

$readmePath = Join-Path $OutDir "README-PORTABLE.txt"
@"
JOZI Control Center Portable

Start:
  Start-JOZI-Portable.cmd ausfuehren.

EXE:
  app\$PortableExeName

Datenbank:
  Die SQLite-Datenbank liegt portabel unter:
  data\jozi-control-center.db

  Beim Build wurde eine Kopie dieser Quelle erstellt:
  $($sourceDb.FullName)

Hinweis:
  Den gesamten Ordner 'portable' zusammenhalten, wenn die App auf USB-Stick,
  Netzlaufwerk oder einen anderen PC kopiert wird.
"@ | Set-Content -Path $readmePath -Encoding ASCII

Write-Host ""
Write-Host "Portable App erstellt:"
Write-Host "  $OutDir"
Write-Host ""
Write-Host "Startdatei:"
Write-Host "  $starterPath"
Write-Host ""
Write-Host "EXE:"
Write-Host "  $(Join-Path $portableAppDir $PortableExeName)"
Write-Host ""
Write-Host "Datenbank:"
Write-Host "  $portableDbPath"
