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

if not exist "node_modules" (
    echo Erstinstallation: Abhaengigkeiten werden installiert.
    echo Das kann beim ersten Mal ein paar Minuten dauern, bitte warten...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [FEHLER] "npm install" ist fehlgeschlagen. Siehe Meldung oben.
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
echo Der Browser oeffnet sich automatisch in wenigen Sekunden unter:
echo   http://localhost:3000/admin/login
echo.
echo Zum Beenden: dieses Fenster schliessen oder STRG+C druecken.
echo.

start "" /min powershell -NoProfile -Command "Start-Sleep -Seconds 5; Start-Process 'http://localhost:3000/admin/login'"

call npm run dev

echo.
echo Der Server wurde beendet.
pause
