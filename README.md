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

### 🧩 Content-Pflege

Die Inhalte (Team, Fahrzeuge, Sponsoren, News, Blog, Galerie, Erfolge, offene Positionen, Seitentexte) liegen als
Markdown-Dateien in `content/` und werden direkt im Repository gepflegt.

Das eigene Redaktionssystem (Login, Editor, GitHub-Commits) ist **nicht** Teil dieses Branches. Es lebt separat im
`cms-app`-Branch und wird dort als eigenes, unabhängiges Deployment betrieben – dadurch enthält die öffentliche
Website keinen Admin-/Login-Code und keine CMS-Abhängigkeiten.

### 📁 Projektstruktur

```
content/            # Markdown-Inhalte (Team, Fahrzeuge, Sponsoren, News, Seiten, …)
src/app/            # Next.js App Router Seiten
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
