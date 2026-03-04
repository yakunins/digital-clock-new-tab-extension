@echo off
setlocal enabledelayedexpansion

:: Build
echo === Building ===
call npm run build
if errorlevel 1 ( echo ERROR: Build failed & exit /b 1 )

:: Get version from package.json (e.g. 1.0.16 -> 1-0-16)
for /f "tokens=2 delims=:, " %%V in ('findstr /c:"\"version\"" package.json') do set "VER=%%~V"
set "VER_DASHED=%VER:.=-%"

:: Rename chrome -> dist
rename dist\chrome dist
if errorlevel 1 ( echo ERROR: Rename chrome to dist failed & exit /b 1 )

:: Create temp folder and zip
if not exist temp mkdir temp
set "ZIPNAME=digital-clock-v%VER_DASHED%.zip"
if exist "temp\%ZIPNAME%" del "temp\%ZIPNAME%"
powershell -Command "Compress-Archive -Path 'dist\dist\*' -DestinationPath 'temp\%ZIPNAME%' -Force"
if errorlevel 1 ( echo ERROR: Zip failed & exit /b 1 )

:: Rename dist -> chrome
rename dist\dist chrome
if errorlevel 1 ( echo ERROR: Rename dist to chrome failed & exit /b 1 )

echo.
echo === Done: temp\%ZIPNAME% ===
