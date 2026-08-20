#!/bin/bash
# Interaktive Ersteinrichtung der lokalen CMS-Zugangsdaten (.env.local).
# macOS/Linux-Gegenstueck zu scripts/cms-setup.ps1.
# Wird von CMS-Zugangsdaten-aendern.command und CMS-Start.command aufgerufen.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
env_path="$repo_root/.env.local"

echo ""
echo "=== Einrichtung: CMS-Zugangsdaten ==="
echo ""

if [ -f "$env_path" ]; then
    read -r -p "Es existiert bereits eine .env.local. Ueberschreiben? (j/n) " overwrite
    case "$overwrite" in
        j|J) ;;
        *)
            echo "Abgebrochen. Bestehende Datei bleibt unveraendert."
            exit 0
            ;;
    esac
    echo ""
fi

read -r -p "Benutzername fuer den Login (Enter fuer 'admin'): " username
if [ -z "$username" ]; then
    username="admin"
fi

while true; do
    read -r -s -p "Neues Passwort (mind. 8 Zeichen): " pw1
    echo ""
    if [ -z "$pw1" ] || [ ${#pw1} -lt 8 ]; then
        echo "Das Passwort muss mindestens 8 Zeichen lang sein."
        continue
    fi
    read -r -s -p "Passwort wiederholen: " pw2
    echo ""
    if [ "$pw1" != "$pw2" ]; then
        echo "Die Passwoerter stimmen nicht ueberein. Bitte erneut versuchen."
        continue
    fi
    break
done

echo ""
echo "Passwort-Hash wird erzeugt..."
hash="$(cd "$repo_root" && node "scripts/cms-hash-password.mjs" "$pw1")"
if [ -z "$hash" ]; then
    echo "[FEHLER] Der Passwort-Hash konnte nicht erzeugt werden. Ist Node.js installiert?"
    exit 1
fi

session_secret="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")"

echo ""
echo "--- GitHub-Anbindung (optional, aber empfohlen) ---"
echo "Damit Speicherungen automatisch als Commit ins GitHub-Repository geschrieben werden."
echo "Ohne Token werden Aenderungen NUR lokal auf diesem Rechner gespeichert."
echo "Token erstellen: https://github.com/settings/tokens (fine-grained, 'Contents: Read and write')"
echo "Der Token wird nur lokal in .env.local gespeichert (nicht Teil des Git-Repositorys) und niemals eingegeben."
read -r -s -p "GitHub Personal Access Token (leer lassen zum Ueberspringen): " github_token
echo ""
github_token="$(echo "$github_token" | xargs || true)"

github_owner="Hudnur111"
github_repo="Website---E-Motion-Rennteam-Aalen-"
github_branch="main"

if [ -n "$github_token" ]; then
    read -r -p "GitHub-Benutzer/Organisation (Enter fuer '$github_owner'): " owner_input
    if [ -n "$owner_input" ]; then github_owner="$owner_input"; fi

    read -r -p "Repository-Name (Enter fuer '$github_repo'): " repo_input
    if [ -n "$repo_input" ]; then github_repo="$repo_input"; fi

    read -r -p "Branch, in den committet wird (Enter fuer '$github_branch'): " branch_input
    if [ -n "$branch_input" ]; then github_branch="$branch_input"; fi
fi

cat > "$env_path" <<EOF
CMS_ADMIN_USER=$username
CMS_ADMIN_PASSWORD_HASH=$hash
CMS_SESSION_SECRET=$session_secret
GITHUB_TOKEN=$github_token
GITHUB_OWNER=$github_owner
GITHUB_REPO=$github_repo
GITHUB_BRANCH=$github_branch
EOF

echo ""
echo "Fertig! Zugangsdaten wurden gespeichert."
echo "Benutzername: $username"
if [ -z "$github_token" ]; then
    echo "Hinweis: Kein GitHub-Token gesetzt - Aenderungen werden vorerst nur lokal gespeichert."
    echo "Das kannst du jederzeit spaeter nachholen, indem du die Einrichtung erneut ausfuehrst."
fi
