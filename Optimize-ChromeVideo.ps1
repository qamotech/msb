$ErrorActionPreference = "Stop"

Write-Host "Starting Google Chrome Video Optimization Script..." -ForegroundColor Cyan

# 1. Close Google Chrome
$chromeProcesses = Get-Process -Name "chrome" -ErrorAction SilentlyContinue
if ($chromeProcesses) {
    Write-Host "Closing Google Chrome to apply settings..." -ForegroundColor Yellow
    Stop-Process -Name "chrome" -Force
    Start-Sleep -Seconds 2
}

# 2. Modify Chrome Local State
$localStatePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Local State"

if (Test-Path $localStatePath) {
    Write-Host "Backing up Local State file..." -ForegroundColor Green
    Copy-Item -Path $localStatePath -Destination "$localStatePath.backup" -Force
    
    Write-Host "Reading Chrome configuration..." -ForegroundColor Green
    $localStateJson = Get-Content -Path $localStatePath -Raw | ConvertFrom-Json
    
    # Flags to enable for video playback and performance
    $flagsToAdd = @(
        "enable-gpu-rasterization@1",
        "enable-zero-copy@1",
        "enable-quic@1",
        "ignore-gpu-blocklist@1"
    )
    
    if (-not $localStateJson.browser) {
        $localStateJson | Add-Member -MemberType NoteProperty -Name "browser" -Value @{}
    }
    
    if (-not $localStateJson.browser.enabled_labs_experiments) {
        $localStateJson.browser | Add-Member -MemberType NoteProperty -Name "enabled_labs_experiments" -Value @()
    }
    
    $currentFlags = $localStateJson.browser.enabled_labs_experiments
    
    foreach ($flag in $flagsToAdd) {
        if ($currentFlags -notcontains $flag) {
            $currentFlags += $flag
        }
    }
    
    $localStateJson.browser.enabled_labs_experiments = $currentFlags
    
    Write-Host "Applying new experimental flags..." -ForegroundColor Green
    $localStateJson | ConvertTo-Json -Depth 10 | Set-Content -Path $localStatePath
    
    Write-Host "Chrome configuration updated successfully!" -ForegroundColor Green
} else {
    Write-Host "Could not find Chrome Local State file at $localStatePath. Is Chrome installed?" -ForegroundColor Red
}

# 3. Restart Chrome
Write-Host "Restarting Google Chrome..." -ForegroundColor Yellow
Start-Process "chrome.exe"

Write-Host "Optimization Complete! Hardware acceleration and zero-copy rasterization have been enabled." -ForegroundColor Cyan
