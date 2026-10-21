$apps = @(
    "AIWS",
    "Clark MSB",
    "culmin8",
    "cyber-core_-svg-character-library-&-combat-engine",
    "cyber-mecha-svg-sprite-library",
    "cybermech-arena---svg-character-library",
    "icona-library",
    "N8 CyberDev",
    "N8-Pathfinder",
    "npp-main",
    "trucking-app"
)

foreach ($app in $apps) {
    $dir = Join-Path "C:\Users\qamel\Downloads" $app
    if (-not (Test-Path $dir)) { continue }

    Write-Host "Processing $app..."
    Set-Location $dir

    # Check for Vite
    $hasViteConfig = Test-Path "vite.config.ts"
    $configExt = ".ts"
    if (-not $hasViteConfig) {
        $hasViteConfig = Test-Path "vite.config.js"
        $configExt = ".js"
    }

    if ($hasViteConfig) {
        # Check if singlefile is already there
        $configContent = Get-Content "vite.config$configExt" -Raw
        if ($configContent -notmatch "vite-plugin-singlefile") {
            Write-Host "Adding vite-plugin-singlefile to $app config..."
            
            # Very basic string replace to inject the plugin
            $configContent = "import { viteSingleFile } from 'vite-plugin-singlefile';`n" + $configContent
            $configContent = $configContent -replace "plugins:\s*\[(.*?)\]", "plugins: [`$1, viteSingleFile()]"
            
            # Disable minification if it's there to prevent Windows lock issues
            if ($configContent -notmatch "build:\s*\{") {
                $configContent = $configContent -replace "\}\s*\)\s*$", "  build: { minify: false }`n})"
            }

            Set-Content -Path "vite.config$configExt" -Value $configContent
            
            # Add to package.json
            Write-Host "Installing vite-plugin-singlefile in $app..."
            npm install vite-plugin-singlefile -D --force
        }
        
        Write-Host "Building $app..."
        npm install --force
        npx vite build
        
        if (Test-Path "dist\index.html") {
            Write-Host "Copying and cleaning up $app..."
            Copy-Item -Path "dist\index.html" -Destination "..\$app.html" -Force
            Set-Location "C:\Users\qamel\Downloads"
            Remove-Item -Path $dir -Recurse -Force
        } else {
            Write-Host "Build failed or no dist/index.html for $app."
            Set-Location "C:\Users\qamel\Downloads"
        }
    } else {
        # It's not a Vite app, check if it's just a static HTML app
        if (Test-Path "index.html") {
            # Maybe just copy the index.html? If it has linked CSS/JS, it will break.
            # But let's copy it anyway.
            Write-Host "No Vite config. Copying index.html for $app..."
            Copy-Item -Path "index.html" -Destination "..\$app.html" -Force
            Set-Location "C:\Users\qamel\Downloads"
            Remove-Item -Path $dir -Recurse -Force
        } else {
            Write-Host "No index.html found in $app."
            Set-Location "C:\Users\qamel\Downloads"
        }
    }
}
Write-Host "All done!"
