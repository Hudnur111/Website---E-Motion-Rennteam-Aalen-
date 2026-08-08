#!/bin/bash
cd "$(dirname "$0")/cms" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js wurde nicht gefunden."
  echo "  Bitte installiere es zuerst von https://nodejs.org (LTS-Version)"
  echo "  und starte dieses Programm danach erneut."
  echo ""
  read -r -p "Drücke Enter zum Beenden..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo ""
  echo "  Erstinstallation läuft, das dauert einen Moment..."
  echo ""
  npm install || {
    echo "Die Installation ist fehlgeschlagen. Bitte prüfe deine Internetverbindung."
    read -r -p "Drücke Enter zum Beenden..."
    exit 1
  }
fi

(sleep 2 && open "http://localhost:5757") &

echo ""
echo "  E-Motion CMS startet … Lass dieses Fenster offen, solange du arbeitest."
echo ""
npm start
