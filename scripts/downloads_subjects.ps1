$ErrorActionPreference = 'Stop'
$downloadsRoot = [IO.Path]::GetFullPath('C:\Users\qamel\Downloads')
$report = Join-Path $downloadsRoot 'Organization\subject-moves.json'
$moves = [System.Collections.Generic.List[object]]::new()
if (Test-Path -LiteralPath $report) { Get-Content -LiteralPath $report -Raw | ConvertFrom-Json | ForEach-Object { $moves.Add($_) } }
function Move-PreservePath([string]$relativeSource,[string]$relativeTarget) {
    $source = [IO.Path]::GetFullPath((Join-Path $downloadsRoot $relativeSource))
    $target = [IO.Path]::GetFullPath((Join-Path $downloadsRoot $relativeTarget))
    if (!$source.StartsWith($downloadsRoot + '\') -or !$target.StartsWith($downloadsRoot + '\')) { throw 'Path escaped Downloads' }
    if (!(Test-Path -LiteralPath $source)) { return }
    if ((Get-Item -LiteralPath $source).LinkType) { return }
    if (Test-Path -LiteralPath $target) { throw "Destination already exists: $relativeTarget" }
    $instruction = Join-Path $source 'AGENTS.md'
    if (Test-Path -LiteralPath $instruction) { throw "Read nested instructions before relocation: $relativeSource" }
    New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
    Move-Item -LiteralPath $source -Destination $target
    $moves.Add(@{action='move-directory';source=$source;destination=$target})
    ConvertTo-Json -InputObject @($moves.ToArray()) -Depth 4 | Set-Content -LiteralPath $report -Encoding utf8
    New-Item -ItemType Junction -Path $source -Target $target | Out-Null
    $moves.Add(@{action='compatibility-junction';path=$source;target=$target})
    ConvertTo-Json -InputObject @($moves.ToArray()) -Depth 4 | Set-Content -LiteralPath $report -Encoding utf8
}
Move-PreservePath 'documents\CFLife' 'documents\Business\CFLife'
Move-PreservePath 'documents\godot' 'documents\Development\godot'
foreach ($name in @('FAVICONS','PNG Packs','monopoly_3d_pbr_texture_atlas','svg-asset-studio-&-400-library','cyber-mecha-svg-sprite-library')) {
    Move-PreservePath (Join-Path 'Assets' $name) (Join-Path 'Assets\Shared' $name)
}
Move-PreservePath 'Assets\CFP Assets' 'Assets\Project-Specific\CFP\CFP Assets'
$archiveChildren = @(Get-ChildItem -LiteralPath (Join-Path $downloadsRoot 'Archives') -Directory | Where-Object { $_.Name -like 'npp-master-*' -and !$_.LinkType })
foreach ($item in $archiveChildren) {
    Move-PreservePath (Join-Path 'Archives' $item.Name) (Join-Path 'Archives\2026-09-24' $item.Name)
}
Write-Output "Recorded $($moves.Count) subject organization actions."
