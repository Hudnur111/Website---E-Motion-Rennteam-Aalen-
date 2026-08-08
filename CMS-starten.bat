@echo off
setlocal
title E-Motion CMS
cd /d "%~dp0cms"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js wurde nicht gefunden.
  echo  Bitte installiere es zuerst von https://nodejs.org ^(LTS-Version^)
  echo  und starte dieses Programm danach erneut.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo.
  echo  Erstinstallation laeuft, das dauert einen Moment...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  Die Installation ist fehlgeschlagen. Bitte pruefe deine Internetverbindung
    echo  und versuche es erneut.
    echo.
    pause
    exit /b 1
  )
)

start "E-Motion CMS - bitte offen lassen" cmd /k npm start
timeout /t 3 /nobreak >nul
start "" http://localhost:5757

echo.
echo  Die App laeuft jetzt in einem separaten Fenster ^(E-Motion CMS^).
echo  Lass dieses Fenster geoeffnet, solange du Aenderungen bearbeitest.
echo  Dieses Startfenster hier kannst du schliessen.
echo.
pause
