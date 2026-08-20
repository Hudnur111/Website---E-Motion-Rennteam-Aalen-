# Prueft beim Start automatisch, ob es im GitHub-Repository eine neuere
# Version gibt, und uebernimmt sie per Fast-Forward-Merge.
# Wird von CMS-Start.bat vor dem Abhaengigkeits-Check aufgerufen.
#
# Schlaegt irgendetwas fehl (kein Git, kein Internet, lokale Aenderungen,
# abweichender Verlauf), wird das einfach uebersprungen - der Start der App
# wird dadurch NIE blockiert, es laeuft dann mit der vorhandenen Version weiter.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

if (-not (Test-Command "git")) {
    exit 0
}

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    exit 0
}

$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq "HEAD") {
    exit 0
}
$branch = $branch.Trim()

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
    exit 0
}

$status = git status --porcelain --untracked-files=no
if ($status) {
    Write-Host "[HINWEIS] Es gibt lokale Aenderungen an versionierten Dateien."
    Write-Host "Automatisches Update wird uebersprungen, um nichts zu ueberschreiben."
    Write-Host ""
    exit 0
}

$pkgChanged = git diff --name-only "$localRev" "$remoteRev" -- package.json package-lock.json 2>$null

Write-Host "Ein Update ist verfuegbar und wird installiert..."
git merge --ff-only "origin/$branch" *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[HINWEIS] Update konnte nicht automatisch uebernommen werden"
    Write-Host "(lokaler Verlauf weicht vom GitHub-Verlauf ab)."
    Write-Host ""
    exit 0
}

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
exit 0
