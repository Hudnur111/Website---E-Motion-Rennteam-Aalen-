# Oeffnet das CMS nach dem Start als eigenstaendiges App-Fenster (ohne
# Adressleiste/Tabs/Lesezeichen), damit es sich wie eine richtige Desktop-App
# anfuehlt statt wie ein Browser-Tab mit "localhost" in der Adressleiste.
# Wird von CMS-Start.bat im Hintergrund aufgerufen, waehrend der Dev-Server hochfaehrt.

$ErrorActionPreference = "SilentlyContinue"

$url = "http://localhost:3000/admin/login"

# Warten, bis der Dev-Server tatsaechlich antwortet, statt eine feste Wartezeit
# zu raten (schneller auf schnellen PCs, zuverlaessiger auf langsamen).
$maxWaitSeconds = 60
$waited = 0
$serverReady = $false
while ($waited -lt $maxWaitSeconds) {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
            $serverReady = $true
            break
        }
    } catch {
        # Server noch nicht bereit - weiter warten.
    }
    Start-Sleep -Seconds 1
    $waited++
}

$candidatePaths = @(
    (Join-Path ${env:ProgramFiles} "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path ${env:ProgramFiles} "Google\Chrome\Application\chrome.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe")
)

$browserExe = $candidatePaths | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if ($browserExe) {
    # --app=URL startet ein eigenstaendiges Fenster ohne Browser-Chrome
    # (keine Adressleiste, keine Tabs, keine Lesezeichenleiste).
    Start-Process -FilePath $browserExe -ArgumentList "--app=$url", "--window-size=1320,860"
} else {
    # Kein Edge/Chrome gefunden: Fallback auf normalen Standardbrowser-Tab.
    Start-Process $url
}
