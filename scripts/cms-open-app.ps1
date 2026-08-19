# Oeffnet das CMS als eigenstaendiges App-Fenster (ohne Adressleiste, Tabs und
# Lesezeichenleiste), damit es sich wie eine richtige Desktop-Anwendung anfuehlt.
# Wird von CMS-Start.bat im Hintergrund gestartet, waehrend der Server hochfaehrt.

$ErrorActionPreference = "SilentlyContinue"

$port = 3000
$url = "http://localhost:$port/admin/login"

# Warten, bis der Server den Port tatsaechlich bedient. Eine reine TCP-Pruefung
# ist schneller als ein HTTP-Request und umgeht Proxy-Einstellungen, die in
# Hochschul- und Firmennetzen sonst auch fuer localhost greifen wuerden.
function Test-Port([int]$portNumber) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $async = $client.BeginConnect("127.0.0.1", $portNumber, $null, $null)
        if ($async.AsyncWaitHandle.WaitOne(500)) {
            $client.EndConnect($async)
            return $client.Connected
        }
        return $false
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

$deadline = (Get-Date).AddSeconds(180)
while ((Get-Date) -lt $deadline) {
    if (Test-Port $port) { break }
    Start-Sleep -Milliseconds 500
}

if (-not (Test-Port $port)) {
    # Server kam nicht hoch - das Fehlerbild steht im Hauptfenster.
    exit 1
}

# Der Port ist offen, Next.js kompiliert die Seite aber erst beim ersten
# Aufruf. Kurz warten, damit das Fenster nicht in einen Ladefehler laeuft.
Start-Sleep -Seconds 2

$candidatePaths = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$browserExe = $null
foreach ($candidate in $candidatePaths) {
    if ($candidate -and (Test-Path $candidate)) {
        $browserExe = $candidate
        break
    }
}

if ($browserExe) {
    # --app=<url> startet ein eigenes Fenster ohne Browser-Bedienelemente.
    Start-Process -FilePath $browserExe -ArgumentList @(
        "--app=$url",
        "--window-size=1360,900"
    )
} else {
    # Weder Edge noch Chrome gefunden: normaler Standardbrowser als Rueckfall.
    Start-Process $url
}
