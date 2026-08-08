# E-Motion CMS

Eine kleine, eigene Redaktions-App, mit der ihr Texte und Bilder der
Website bearbeiten könnt – **ohne Programmierkenntnisse**. Beim Speichern
wird die Änderung automatisch auf GitHub veröffentlicht, auf einen
eigenen Branch namens `cms-content` (getrennt von `main`).

## Einmalige Einrichtung

### 1. Node.js installieren (falls noch nicht vorhanden)

Node.js ist die Software, die diese App zum Laufen braucht.

- Gehe auf **https://nodejs.org**
- Lade die Version mit der Aufschrift **„LTS"** herunter (empfohlen)
- Installiere sie wie gewohnt (immer „Weiter"/„Next" klicken)

Zum Prüfen, ob es geklappt hat: Terminal (Mac) bzw. Eingabeaufforderung
(Windows) öffnen und `node -v` eingeben – es sollte eine Versionsnummer
erscheinen.

### 2. Die Website-Dateien herunterladen

Falls du den Ordner mit der Website noch nicht auf deinem Rechner hast:

1. Gehe zu https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen-
2. Klicke auf den grünen Button **„Code"** → **„Download ZIP"**
3. Entpacke die ZIP-Datei irgendwo auf deinem Rechner (z. B. auf dem
   Desktop)

### 3. App starten

Im entpackten Ordner findest du im obersten Verzeichnis zwei Dateien:

- **Windows:** Doppelklick auf `CMS-starten.bat`
- **macOS:** Doppelklick auf `CMS-starten.command`
  (Falls macOS beim ersten Mal eine Sicherheitswarnung zeigt: mit
  Rechtsklick → „Öffnen" bestätigen.)

Der erste Start dauert etwas länger (die App richtet sich selbst ein).
Danach öffnet sich automatisch dein Browser mit der App.

### 4. Mit GitHub verbinden (nur beim allerersten Mal)

Die App zeigt dir einen Einrichtungs-Assistenten. Folge den Schritten
darin, um einen kostenlosen GitHub-Zugangsschlüssel (Token) zu erstellen
und einzufügen. Das ist nötig, damit die App Änderungen für dich
speichern kann. Der Schlüssel bleibt nur auf deinem Rechner gespeichert
(Datei `cms/.env`) und wird nirgendwo sonst hin übertragen.

## Benutzung

- Links siehst du alle Bereiche der Website (Team, Fahrzeuge, Sponsoren, …)
- Klicke auf einen Eintrag zum Bearbeiten, oder auf „+ Neuer Eintrag"
- Bilder kannst du direkt hochladen (Button „Hochladen")
- Klick auf **„Speichern & veröffentlichen"** speichert die Änderung
  sofort auf GitHub

## Änderungen live schalten

Die App speichert alles auf dem Branch `cms-content` – bewusst getrennt
von der eigentlichen Live-Website (`main`), damit nichts kaputt gehen
kann. Um Änderungen auf die echte Website zu übernehmen, muss jemand mit
Zugriff auf das Repository den Branch `cms-content` einmal nach `main`
mergen (z. B. über einen Pull Request auf GitHub, oder Claude Code
darum bitten).

## Für Entwickler

Läuft als eigenständige lokale Express-App (`server.js`), die
ausschließlich über die GitHub-REST-API liest/schreibt (kein lokaler
`git`-Client nötig). Das Schema der Collections liegt in `schema.js` und
sollte synchron zu `tina/config.ts` gehalten werden. Konfiguration liegt
in `.env` (siehe `.env.example`), wird von der Setup-Route erzeugt.

```
cd cms
npm install
npm start
```
