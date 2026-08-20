#!/bin/bash
# Oeffnet das CMS als eigenstaendiges App-Fenster (ohne Adressleiste, Tabs und
# Lesezeichenleiste), damit es sich wie eine richtige Desktop-Anwendung anfuehlt.
# macOS-Gegenstueck zu scripts/cms-open-app.ps1.
# Wird von CMS-Start.command im Hintergrund gestartet, waehrend der Server hochfaehrt.

port=3000
url="http://localhost:$port/admin/login"

# Warten, bis der Server den Port tatsaechlich bedient.
deadline=$(( $(date +%s) + 180 ))
while [ "$(date +%s)" -lt "$deadline" ]; do
    if nc -z localhost "$port" >/dev/null 2>&1; then
        break
    fi
    sleep 0.5
done

if ! nc -z localhost "$port" >/dev/null 2>&1; then
    # Server kam nicht hoch - das Fehlerbild steht im Hauptfenster.
    exit 1
fi

# Der Port ist offen, Next.js kompiliert die Seite aber erst beim ersten
# Aufruf. Kurz warten, damit das Fenster nicht in einen Ladefehler laeuft.
sleep 2

chrome_app="/Applications/Google Chrome.app"
edge_app="/Applications/Microsoft Edge.app"

if [ -d "$chrome_app" ]; then
    open -na "Google Chrome" --args "--app=$url" "--window-size=1360,900"
elif [ -d "$edge_app" ]; then
    open -na "Microsoft Edge" --args "--app=$url" "--window-size=1360,900"
else
    # Weder Chrome noch Edge gefunden: normaler Standardbrowser als Rueckfall.
    open "$url"
fi
