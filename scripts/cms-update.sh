#!/bin/bash
# Prueft beim Start automatisch, ob es im GitHub-Repository eine neuere
# Version gibt, und uebernimmt sie per Fast-Forward-Merge. macOS/Linux-
# Gegenstueck zu scripts/cms-update.ps1.
# Wird von CMS-Start.command vor dem Abhaengigkeits-Check aufgerufen.
#
# Schlaegt irgendetwas fehl (kein Git, kein Internet, lokale Aenderungen,
# abweichender Verlauf), wird das einfach uebersprungen - der Start der App
# wird dadurch NIE blockiert, es laeuft dann mit der vorhandenen Version weiter.

if ! command -v git >/dev/null 2>&1; then
    exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    exit 0
fi

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ -z "$branch" ] || [ "$branch" = "HEAD" ]; then
    exit 0
fi

echo "Suche nach Updates..."

if ! git fetch --quiet origin "$branch" >/dev/null 2>&1; then
    echo "Keine Verbindung zu GitHub - Update-Pruefung uebersprungen."
    echo ""
    exit 0
fi

local_rev="$(git rev-parse HEAD 2>/dev/null)"
remote_rev="$(git rev-parse "origin/$branch" 2>/dev/null)"

if [ -z "$remote_rev" ] || [ "$local_rev" = "$remote_rev" ]; then
    echo "Du hast bereits die neueste Version."
    echo ""
    exit 0
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    echo "[HINWEIS] Es gibt lokale Aenderungen an versionierten Dateien."
    echo "Automatisches Update wird uebersprungen, um nichts zu ueberschreiben."
    echo ""
    exit 0
fi

pkg_changed="$(git diff --name-only "$local_rev" "$remote_rev" -- package.json package-lock.json 2>/dev/null)"

echo "Ein Update ist verfuegbar und wird installiert..."
if ! git merge --ff-only "origin/$branch" >/dev/null 2>&1; then
    echo "[HINWEIS] Update konnte nicht automatisch uebernommen werden"
    echo "(lokaler Verlauf weicht vom GitHub-Verlauf ab)."
    echo ""
    exit 0
fi

echo "Update installiert."

if [ -n "$pkg_changed" ]; then
    echo ""
    echo "Abhaengigkeiten wurden aktualisiert, werden neu installiert..."
    if [ -f "package-lock.json" ]; then
        npm ci --no-audit --no-fund
    else
        npm install --no-audit --no-fund
    fi
fi

echo ""
exit 0
