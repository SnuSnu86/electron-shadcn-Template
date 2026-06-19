@echo off
setlocal
set "PORTABLE_ROOT=%~dp0"
set "JOZI_PORTABLE_DATA_DIR=%PORTABLE_ROOT%data"
if not exist "%JOZI_PORTABLE_DATA_DIR%" mkdir "%JOZI_PORTABLE_DATA_DIR%"
start "" "%PORTABLE_ROOT%app\JOZI-Docs.exe"
endlocal
