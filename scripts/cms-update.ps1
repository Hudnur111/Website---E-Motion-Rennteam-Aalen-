# Prueft beim Start automatisch, ob es im GitHub-Repository eine neuere
# Version gibt, und uebernimmt sie per Fast-Forward-Merge.
# Wird von CMS-Start.bat vor dem Abhaengigkeits-Check aufgerufen.
#
# Schlaegt irgendetwas fehl (kein Git, kein Internet, lokale Aenderungen,
# abweichender Verlauf), wird das einfach uebersprungen - der Start der App
# wird dadurch NIE blockiert, es laeuft dann mit der vorhandenen Version weiter.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Marker fuer den Inhalte-Abgleich weiter unten (Sync-Content). Muss vor dem
# Code-Update-Check geprueft/entfernt werden - siehe dortigen Kommentar.
$ContentSyncMarker = "[cms-content-sync]"

function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# Inhalte, die ueber das CMS gespeichert werden, landen als Commit auf dem in
# .env.local konfigurierten GITHUB_BRANCH (Standard: main) - nicht
# zwingend auf dem Branch, von dem diese CMS-Installation selbst laeuft
# (typischerweise cms-app, ein separates Deployment). Ohne diesen Abgleich
# zeigt die lokale content/-Kopie dieser Installation zunehmend veraltete
# Inhalte, sobald von einem anderen Geraet oder einer anderen
# CMS-Installation aus gespeichert wurde. Rein lokal (nie gepusht) und nur
# als bester Versuch: schlaegt irgendetwas fehl oder gibt es eine noch
# ungesicherte lokale Bearbeitung, wird das einfach uebersprungen.
function Sync-Content([string]$repoRoot) {
    $contentBranch = "main"
    $envPath = Join-Path $repoRoot ".env.local"
    if (Test-Path $envPath) {
        $line = Select-String -Path $envPath -Pattern '^GITHUB_BRANCH=' -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($line) {
            $value = ($line.Line -replace '^GITHUB_BRANCH=', '').Trim()
            if ($value) { $contentBranch = $value }
        }
    }

    $contentStatus = git status --porcelain --untracked-files=no -- content
    if ($contentStatus) {
        return
    }

    git fetch --quiet origin $contentBranch *> $null
    if ($LASTEXITCODE -ne 0) {
        return
    }

    git diff --quiet HEAD "origin/$contentBranch" -- content
    if ($LASTEXITCODE -eq 0) {
        return
    }

    Write-Host "Gleiche Inhalte mit '$contentBranch' ab..."
    git checkout --quiet "origin/$contentBranch" -- content 2>$null
    if ($LASTEXITCODE -ne 0) {
        return
    }
    git add content
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        git reset --quiet HEAD -- content *> $null
        return
    }
    # -c user.name/user.email: this may be the first commit ever made in this
    # checkout, and this is a self-hosted, no-dev-environment CMS install -
    # git identity can't be assumed to be configured. Scoped to this one
    # command only, never touches the user's own git config.
    git -c user.name="CMS Auto-Sync" -c user.email="cms-sync@localhost" `
        commit --quiet -m $ContentSyncMarker *> $null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Inhalte aktualisiert."
    } else {
        # Commit failed (e.g. disk full) - don't leave a half-applied,
        # staged-but-uncommitted content/ that would block every future run.
        git reset --quiet HEAD -- content *> $null
        git checkout --quiet HEAD -- content *> $null
    }
    Write-Host ""
}

if (-not (Test-Command "git")) {
    exit 0
}

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    exit 0
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq "HEAD") {
    exit 0
}
$branch = $branch.Trim()

# Ein vorheriger Lauf dieses Skripts kann einen lokalen Inhalte-Abgleich-
# Commit hinterlassen haben (siehe Sync-Content oben). Der ist absichtlich
# nie gepusht und wuerde jeden weiteren "git merge --ff-only" unten daran
# hindern, ueberhaupt noch ein Fast-Forward zu sein - deshalb erst wieder
# entfernen. Nur wenn HEAD genau dieser Marker-Commit ist UND seitdem nichts
# geaendert wurde: sonst koennte das eine noch ungesicherte lokale
# Bearbeitung verwerfen, die seitdem obendrauf gekommen ist.
$headSubject = (git log -1 --format=%s 2>$null)
$fullStatus = git status --porcelain --untracked-files=no
if ($headSubject -eq $ContentSyncMarker -and -not $fullStatus) {
    git reset --quiet --hard HEAD~1 *> $null
}

Write-Host "Suche nach Updates..."

git fetch --quiet origin $branch *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Keine Verbindung zu GitHub - Update-Pruefung uebersprungen."
    Write-Host ""
    exit 0
}

$localRev = (git rev-parse HEAD 2>$null).Trim()
$remoteRev = (git rev-parse "origin/$branch" 2>$null).Trim()

if ([string]::IsNullOrWhiteSpace($remoteRev) -or $localRev -eq $remoteRev) {
    Write-Host "Du hast bereits die neueste Version."
    Write-Host ""
} else {
    $status = git status --porcelain --untracked-files=no
    if ($status) {
        Write-Host "[HINWEIS] Es gibt lokale Aenderungen an versionierten Dateien."
        Write-Host "Automatisches Update wird uebersprungen, um nichts zu ueberschreiben."
        Write-Host ""
    } else {
        $pkgChanged = git diff --name-only "$localRev" "$remoteRev" -- package.json package-lock.json 2>$null

        Write-Host "Ein Update ist verfuegbar und wird installiert..."
        git merge --ff-only "origin/$branch" *> $null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[HINWEIS] Update konnte nicht automatisch uebernommen werden"
            Write-Host "(lokaler Verlauf weicht vom GitHub-Verlauf ab)."
            Write-Host ""
        } else {
            Write-Host "Update installiert."

            if ($pkgChanged) {
                Write-Host ""
                Write-Host "Abhaengigkeiten wurden aktualisiert, werden neu installiert..."
                if (Test-Path "package-lock.json") {
                    npm ci --no-audit --no-fund
                } else {
                    npm install --no-audit --no-fund
                }
            }
            Write-Host ""
        }
    }
}

Sync-Content $repoRoot

exit 0
