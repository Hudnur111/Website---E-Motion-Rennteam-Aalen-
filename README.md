# 🏎️ Website – E-Motion Rennteam Aalen

> **Offizielles Repository für den Webauftritt des E-Motion Rennteams der Hochschule Aalen.**  
> *Formel Student Electric Racing Team | Innovation, Dynamics & Performance*

---

### 📌 Projekt-Übersicht

| **Status** | **Technologien** | **Lizenz** |
| :---: | :---: | :---: |
| ![Status](https://img.shields.io/badge/Status-In_Entwicklung-blue?style=flat-square) | ![Tech](https://img.shields.io/badge/Tech-Next.js_%7C_TailwindCSS_%7C_Eigenes_CMS-orange?style=flat-square) | ![Lizenz](https://img.shields.io/badge/Lizenz-MIT-green?style=flat-square) |

---

### ⚡ Hauptmerkmale

* **Responsive Design:** Optimiert für Smartphones, Tablets und Desktops
* **Team- & Fahrzeug-Präsentation:** Übersichtliche Vorstellung von Mitgliedern und Boliden
* **Sponsoren-Integration:** Prominente Einbindung von Partnern und Unterstützern
* **News & Events:** Aktuelle Berichte von Rennen, Events und Konstruktion

---

### 🚀 Quickstart

```bash
# Repository klonen
git clone [https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen.git](https://github.com/Hudnur111/Website---E-Motion-Rennteam-Aalen.git)

# In das Verzeichnis wechseln
cd Website---E-Motion-Rennteam-Aalen

# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev
```

Die Seite ist danach unter `http://localhost:3000` erreichbar.

---

### 🧩 Content-Pflege mit dem eigenen CMS

Die Inhalte (Team, Fahrzeuge, Sponsoren, News, Blog, Galerie, Erfolge, offene Positionen, Seitentexte) liegen als
Markdown-Dateien in `content/` und können direkt bearbeitet werden – oder komfortabel über das eingebaute,
selbst entwickelte Redaktionssystem unter `/admin`. Anders als eine externe SaaS-Lösung läuft das CMS komplett
im eigenen Next.js-Code: eigener Login, eigenes Design, eigene Anbindung an GitHub.

**Funktionsweise:**

- Login unter `/admin/login` mit Benutzername/Passwort (serverseitig, signierte Session-Cookies).
- Nach dem Login: Übersicht aller Inhaltsbereiche, Texte bearbeiten, Bilder hochladen, Einträge anlegen/löschen.
- Jede Speicherung wird – sofern konfiguriert – automatisch als **Commit direkt ins GitHub-Repository** geschrieben
  (über die GitHub Contents API), inklusive Bild-Uploads nach `public/uploads/`.

**Einrichtung (lokal & Produktion):**

1. `.env.local.example` nach `.env.local` kopieren.
2. Login-Zugangsdaten setzen:
   - `CMS_ADMIN_USER=admin`
   - Passwort-Hash erzeugen: `npm run cms:hash-password -- "mein-passwort"` und das Ergebnis in
     `CMS_ADMIN_PASSWORD_HASH` eintragen.
   - `CMS_SESSION_SECRET` auf einen zufälligen, langen String setzen (z. B. `openssl rand -hex 32`).
3. Für die GitHub-Anbindung ein *fine-grained* GitHub Personal Access Token mit `Contents: Read and write` auf
   dieses Repository erzeugen und in `GITHUB_TOKEN` eintragen; `GITHUB_OWNER`, `GITHUB_REPO` und `GITHUB_BRANCH`
   entsprechend setzen (Beispielwerte sind bereits vorausgefüllt).
4. `npm run dev` starten, dann `http://localhost:3000/admin/login` öffnen.

Ohne gesetzte GitHub-Variablen funktioniert das CMS weiterhin (Änderungen werden lokal auf der Festplatte
gespeichert), zeigt im Dashboard aber deutlich an, dass nichts auf GitHub gesichert wurde.

### 📁 Projektstruktur

```
content/            # Markdown-Inhalte (Team, Fahrzeuge, Sponsoren, News, Seiten, …)
src/app/            # Next.js App Router Seiten
src/app/admin/       # Eigenes CMS: Login + Redaktionsbereich
src/app/api/admin/   # CMS-Backend: Auth, Content-CRUD, Bild-Upload
src/components/admin/ # CMS-UI-Komponenten (Formulare, Bild-Upload, Sidebar)
src/lib/cms/          # CMS-Kernlogik (Schema, Auth, GitHub-Anbindung, Content-I/O)
src/components/     # Wiederverwendbare UI-Komponenten
```

### 🧪 Qualitätssicherung

| Befehl | Zweck |
| :--- | :--- |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript-Typprüfung |
| `npm test` | Vitest (Unit-/Komponententests) |
| `npm run test:a11y` | axe-core-Scan gegen den Produktions-Build (`npm run build` vorher ausführen) |
| `npm run analyze` | Bundle-Analyse via Next.js' eingebautem `--experimental-analyze` (Turbopack-basiert; das ältere `@next/bundle-analyzer`-Paket funktioniert hier **nicht**, da es auf Webpack-Hooks aufbaut und dieses Projekt mit Turbopack baut). Ergebnis liegt danach in `.next/diagnostics/analyze/index.html`. |
