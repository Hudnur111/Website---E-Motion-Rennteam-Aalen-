@echo off
setlocal
title E-Motion Rennteam Aalen - CMS starten
cd /d "%~dp0"
chcp 65001 >nul

echo ============================================
echo   E-Motion Rennteam Aalen - Redaktions-CMS
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [FEHLER] Node.js wurde nicht gefunden.
    echo Bitte installiere Node.js von https://nodejs.org/ ^(LTS-Version^)
    echo und starte dieses Fenster danach neu.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\.bin\next.cmd" (
    echo Erstinstallation ^(oder unvollstaendige Installation erkannt^):
    echo Abhaengigkeiten werden installiert.
    echo Das kann beim ersten Mal ein paar Minuten dauern, bitte warten...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [FEHLER] "npm install" ist fehlgeschlagen. Siehe Meldung oben.
        pause
        exit /b 1
    )
    if not exist "node_modules\.bin\next.cmd" (
        echo.
        echo [FEHLER] "next" wurde auch nach "npm install" nicht gefunden.
        echo Bitte loesche den Ordner "node_modules" manuell und starte dieses
        echo Fenster erneut.
        pause
        exit /b 1
    )
    echo.
)

if not exist ".env.local" (
    echo Es wurden noch keine Zugangsdaten eingerichtet.
    echo Der Einrichtungsassistent startet jetzt...
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\cms-setup.ps1"
    if errorlevel 1 (
        echo.
        echo [FEHLER] Die Einrichtung wurde abgebrochen oder ist fehlgeschlagen.
        pause
        exit /b 1
    )
    if not exist ".env.local" (
        echo.
        echo Einrichtung wurde abgebrochen. Der Server wird nicht gestartet.
        pause
        exit /b 1
    )
    echo.
)

echo Der Server wird gestartet. Dieses Fenster waehrend der Nutzung bitte geoeffnet lassen.
echo Das CMS oeffnet sich automatisch in einem eigenen App-Fenster, sobald der
echo Server bereit ist.
echo.
echo Zum Beenden: dieses Fenster schliessen oder STRG+C druecken.
echo.

start "" /min powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\cms-open-app.ps1"

call npm run dev

echo.
echo Der Server wurde beendet.
pause
