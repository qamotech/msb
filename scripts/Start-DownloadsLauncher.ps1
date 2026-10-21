$ErrorActionPreference = 'Stop'
$launcherUrl = 'http://127.0.0.1:8876/Downloads-Launcher.html'
$serverScript = Join-Path $PSScriptRoot 'downloads_server.py'
$ready = $false
try { $ready = (Invoke-WebRequest -Uri $launcherUrl -TimeoutSec 2).StatusCode -eq 200 } catch { }
if (!$ready) {
    Start-Process -FilePath 'C:\Python314\python.exe' -ArgumentList @('"' + $serverScript + '"') -WindowStyle Hidden
    for ($attempt=0; $attempt -lt 20; $attempt++) {
        Start-Sleep -Milliseconds 200
        try { $ready = (Invoke-WebRequest -Uri $launcherUrl -TimeoutSec 1).StatusCode -eq 200; if ($ready) { break } } catch { }
    }
}
if (!$ready) { throw 'Downloads preview did not become available on port 8876.' }
Start-Process $launcherUrl
