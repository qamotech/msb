$ErrorActionPreference = 'Stop'
$downloadsRoot = [IO.Path]::GetFullPath('C:\Users\qamel\Downloads')
$workspaceRoot = [IO.Path]::GetFullPath('C:\Users\qamel\Documents\Downloads-Projects')
$reportPath = Join-Path $downloadsRoot 'Organization\workspace-actions.json'
$actions = [System.Collections.Generic.List[object]]::new()
if (Test-Path -LiteralPath $reportPath) { Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json | ForEach-Object { $actions.Add($_) } }
function Save-Actions { ConvertTo-Json -InputObject @($actions.ToArray()) -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding utf8 }
if (!(Test-Path -LiteralPath $workspaceRoot)) { New-Item -ItemType Directory -Path $workspaceRoot | Out-Null }
$source = [IO.Path]::GetFullPath((Join-Path $downloadsRoot 'AIWS'))
$destination = [IO.Path]::GetFullPath((Join-Path $workspaceRoot 'AIWS'))
if (!$source.StartsWith($downloadsRoot + '\') -or !$destination.StartsWith($workspaceRoot + '\')) { throw 'Path boundary failed' }
$tracked = @(git -C $downloadsRoot ls-files -- AIWS)
if ($tracked.Count -ne 0) { throw 'AIWS is tracked by Downloads root; relocation stopped' }
if (!(Test-Path -LiteralPath $destination)) {
    if ((Get-Item -LiteralPath $source).LinkType) { throw 'Source is already a link' }
    Move-Item -LiteralPath $source -Destination $destination
    $actions.Add(@{action='move-directory';source=$source;destination=$destination;reason='Independent AIWS repository, not tracked by Downloads root'}); Save-Actions
}
if (!(Test-Path -LiteralPath $source)) {
    New-Item -ItemType Junction -Path $source -Target $destination | Out-Null
    $actions.Add(@{action='compatibility-junction';path=$source;target=$destination}); Save-Actions
}
foreach ($name in @('N8DEV','Clark MSB','AXIOM_CODE_AI_WORKSPACE','N8 CyberDev','N8-Pathfinder','1POLY','context-hub','npp-main')) {
    $target = Join-Path $downloadsRoot $name
    $link = Join-Path $workspaceRoot $name
    if (!(Test-Path -LiteralPath $link)) {
        New-Item -ItemType Junction -Path $link -Target $target | Out-Null
        $actions.Add(@{action='workspace-junction';path=$link;target=$target;reason='Preserve existing repository and path ownership'}); Save-Actions
    }
}
$sheetLink = Join-Path $workspaceRoot 'N8Sheetz'
$sheetTarget = Join-Path $downloadsRoot 'standalone-sites\apps\n8sheetz'
if (!(Test-Path -LiteralPath $sheetLink)) {
    New-Item -ItemType Junction -Path $sheetLink -Target $sheetTarget | Out-Null
    $actions.Add(@{action='workspace-junction';path=$sheetLink;target=$sheetTarget}); Save-Actions
}
$shell = New-Object -ComObject Shell.Application
$qa = $shell.Namespace('shell:::{679f85cb-0220-4080-b29b-5540cc05aab6}')
foreach ($name in @('AIWS','N8DEV','Clark MSB','AXIOM_CODE_AI_WORKSPACE','N8Sheetz')) {
    $target = Join-Path $workspaceRoot $name
    $already = @($qa.Items() | Where-Object { $_.Path -eq $target }).Count -gt 0
    if (!$already) {
        $folder = $shell.Namespace($target)
        if ($null -ne $folder) { $folder.Self.InvokeVerb('pintohome') }
    }
    $verified = @($qa.Items() | Where-Object { $_.Path -eq $target }).Count -gt 0
    $actions.Add(@{action='pin-quick-access';path=$target;alreadyPresent=$already;verified=$verified}); Save-Actions
}
$actions.ToArray() | Select-Object action,path,verified | ConvertTo-Json -Compress
