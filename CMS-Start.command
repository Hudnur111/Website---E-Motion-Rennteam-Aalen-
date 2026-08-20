#!/bin/bash
# Doppelklick-Start des Redaktions-CMS fuer macOS.
# Gegenstueck zu CMS-Start.bat (Windows).

cd "$(dirname "$0")"

echo "============================================"
echo "  E-Motion Rennteam Aalen - Redaktions-CMS"
echo "============================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[FEHLER] Node.js wurde nicht gefunden."
    echo "Bitte installiere Node.js von https://nodejs.org/ (LTS-Version)"
    echo "und starte dieses Fenster danach neu."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "[FEHLER] npm wurde nicht gefunden, obwohl Node.js vorhanden ist."
    echo "Bitte installiere Node.js von https://nodejs.org/ neu (LTS-Version)"
    echo "und starte dieses Fenster danach neu."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "[FEHLER] Diese Datei liegt nicht im Projektordner."
    echo "CMS-Start.command muss im selben Ordner liegen wie \"package.json\"."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

# Nur die tatsaechlich vorhandene next-Startdatei zaehlt. Ein blosser
# node_modules-Ordner kann von einem abgebrochenen Lauf uebrig sein.
if [ ! -f "node_modules/.bin/next" ]; then
    if [ -d "node_modules" ]; then
        echo "Eine unvollstaendige Installation wurde gefunden und wird"
        echo "aufgeraeumt. Das dauert einen Moment..."
        rm -rf "node_modules"
        if [ -d "node_modules" ]; then
            echo ""
            echo "[FEHLER] Der Ordner \"node_modules\" liess sich nicht loeschen."
            echo "Vermutlich laeuft das CMS noch in einem anderen Fenster."
            echo ""
            echo "Bitte alle anderen CMS-Fenster schliessen und diese Datei"
            echo "erneut starten."
            echo ""
            read -r -p "Zum Beenden Enter druecken..." _
            exit 1
        fi
        echo "Aufgeraeumt."
        echo ""
    fi

    echo "Abhaengigkeiten werden installiert."
    echo ""
    echo "  WICHTIG: Das dauert beim ersten Mal 2 bis 10 Minuten."
    echo "  Waehrenddessen passiert oft minutenlang scheinbar nichts -"
    echo "  das ist normal. Bitte dieses Fenster NICHT schliessen."
    echo ""

    if [ -f "package-lock.json" ]; then
        if ! npm ci --no-audit --no-fund; then
            echo ""
            echo "Hinweis: \"npm ci\" war nicht moeglich, versuche \"npm install\"..."
            echo ""
            npm install --no-audit --no-fund
        fi
    else
        npm install --no-audit --no-fund
    fi

    if [ ! -f "node_modules/.bin/next" ]; then
        echo ""
        echo "[FEHLER] Die Installation ist unvollstaendig geblieben."
        echo ""
        echo "Das deutet fast immer auf die Internetverbindung hin."
        echo "Bitte Verbindung pruefen und diese Datei erneut starten -"
        echo "aufgeraeumt wird dann automatisch."
        echo ""
        read -r -p "Zum Beenden Enter druecken..." _
        exit 1
    fi
    echo ""
    echo "Installation abgeschlossen."
    echo ""
fi

if [ ! -f ".env.local" ]; then
    echo "Es wurden noch keine Zugangsdaten eingerichtet."
    echo "Der Einrichtungsassistent startet jetzt..."
    echo ""
    bash "scripts/cms-setup.sh"
    if [ ! -f ".env.local" ]; then
        echo ""
        echo "Einrichtung wurde abgebrochen. Der Server wird nicht gestartet."
        read -r -p "Zum Beenden Enter druecken..." _
        exit 1
    fi
    echo ""
fi

# Laeuft schon ein CMS auf Port 3000? Dann wuerde Next.js auf einen anderen
# Port ausweichen und das App-Fenster ins Leere zeigen.
if lsof -iTCP:3000 -sTCP:LISTEN -Pn >/dev/null 2>&1; then
    echo "[HINWEIS] Auf Port 3000 laeuft bereits ein Programm."
    echo "Vermutlich ist das CMS schon in einem anderen Fenster gestartet."
    echo ""
    echo "Bitte das andere CMS-Fenster schliessen und es erneut versuchen."
    echo ""
    read -r -p "Zum Beenden Enter druecken..." _
    exit 1
fi

echo "Der Server wird gestartet. Dieses Fenster waehrend der Nutzung bitte"
echo "geoeffnet lassen."
echo ""
echo "Das CMS oeffnet sich gleich automatisch in einem eigenen Fenster."
echo "Zum Beenden: dieses Fenster schliessen oder STRG+C druecken."
echo ""

bash "scripts/cms-open-app.sh" &

npm run dev -- -p 3000

echo ""
echo "Der Server wurde beendet."
read -r -p "Zum Beenden Enter druecken..." _
