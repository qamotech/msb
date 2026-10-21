param(
    [string]$TargetDirectory = $PWD.Path,
    [switch]$Recurse
)

Write-Host "Scanning for HTML files to make GitHub-Pages ready in: $TargetDirectory" -ForegroundColor Cyan

$files = if ($Recurse) {
    Get-ChildItem -Path $TargetDirectory -Filter "*.html" -Recurse
} else {
    Get-ChildItem -Path $TargetDirectory -Filter "*.html"
}

$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix 1: Absolute root paths in href (e.g., href="/style.css" -> href="./style.css")
    # Using regex negative lookahead to ignore href="//" (external links)
    $content = [regex]::Replace($content, 'href="/(?!/)', 'href="./')
    
    # Fix 2: Absolute root paths in src
    $content = [regex]::Replace($content, 'src="/(?!/)', 'src="./')

    # Fix 3: Windows backslashes in href or src (e.g. href="assets\img.png" -> href="assets/img.png")
    # This regex is a bit trickier, we can just replace all backslashes inside href="" or src=""
    $content = [regex]::Replace($content, '(href|src)="([^"]*\\+[^"]*)"', {
        param($match)
        return '{0}="{1}"' -f $match.Groups[1].Value, ($match.Groups[2].Value -replace '\\', '/')
    })

    if ($content -cne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Fixed absolute paths in: $($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "Done! Fixed absolute paths in $fixedCount HTML files." -ForegroundColor Cyan

# Check for index.html
$indexPath = Join-Path $TargetDirectory "index.html"
if (-not (Test-Path $indexPath)) {
    Write-Host "WARNING: No index.html found in $TargetDirectory. GitHub Pages needs an index.html file in the root to load automatically." -ForegroundColor Yellow
} else {
    Write-Host "index.html is present in the root directory. Good to go!" -ForegroundColor Green
}
