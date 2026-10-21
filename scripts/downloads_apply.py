"""Create reversible Downloads organization from the recorded inventory."""
from pathlib import Path
from urllib.parse import quote
from collections import Counter
import json, os, csv, re, shutil, hashlib, datetime, html, subprocess

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Organization'
D=json.loads((OUT/'inventory.json').read_text(encoding='utf-8'))
STAMP='2026-09-24'
BACK=ROOT/'scratch'/('downloads-organization-'+STAMP)
BACK.mkdir(parents=True,exist_ok=True)
MANIFEST=OUT/'change-manifest.json'
changes=json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else []
def save():MANIFEST.write_text(json.dumps(changes,indent=2,ensure_ascii=False),encoding='utf-8')
def write(p,s):
    p=Path(p);p.parent.mkdir(parents=True,exist_ok=True)
    old=p.read_bytes() if p.exists() else None
    data=s.encode('utf-8')
    if old==data:return
    backup=None
    if old is not None:
        backup=BACK/p.relative_to(ROOT);backup.parent.mkdir(parents=True,exist_ok=True)
        if not backup.exists():backup.write_bytes(old)
    p.write_bytes(data)
    changes.append({'action':'write','path':str(p),'backup':str(backup) if backup else None,'sha256':hashlib.sha256(data).hexdigest()});save()
def mkdir(p):
    if not p.exists():
        p.mkdir(parents=True);changes.append({'action':'mkdir','path':str(p)});save()
def csvwrite(p,rows,fields):
    import io
    stream=io.StringIO(newline='');w=csv.DictWriter(stream,fieldnames=fields);w.writeheader();w.writerows(rows);write(p,stream.getvalue())
def mdlink(path):return '<'+quote(path,safe='/.:')+'>'
def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

for p in [ROOT/'Inbox',ROOT/'Archives'/STAMP,ROOT/'Assets'/'Shared',ROOT/'Assets'/'Project-Specific',
 ROOT/'documents'/'Business',ROOT/'documents'/'Development',ROOT/'documents'/'Reference',
 OUT/'screenshots',OUT/'guides',OUT/'contact-sheets']:
    mkdir(p)
write(ROOT/'Inbox'/'README.md','# Inbox\n\nPut new downloads here. Review weekly: assign to an existing project, documents subject folder, reusable assets, or dated archive. Do not auto-delete.\n')
write(ROOT/'Archives'/STAMP/'README.md','# Dated archive\n\nArchive reviewed, inactive items here with their original path and restore instructions. This folder currently contains no relocated user files.\n')

ignore=ROOT/'.gitignore';s=ignore.read_text(encoding='utf-8')
extra='\n# Local organization and confidential material\n/private/\n/documents/\n/DRIVE FOLDER/\n/client_sync/\n/.tmp.drivedownload/\n/.tmp.driveupload/\n/Organization/\n/Downloads-Launcher.html\n.env\n.env.*\n!.env.example\n'
if '# Local organization and confidential material' not in s:write(ignore,s.rstrip()+'\n'+extra)

# Preserve original URLs and file-mode storage by keeping an NTFS hard link at
# the original path. Launch wrappers always point to that original URL.
apps=[]
for page in D['pages']:
    path=page['path'];pp=Path(path)
    if '/' in path and not (pp.parent.as_posix()=='standalone-sites'):continue
    p=ROOT/pp
    folder=ROOT/'standalone-sites'/'apps'/slug(pp.stem)
    mkdir(folder)
    dest=folder/pp.name
    if not dest.exists():
        # Both locations stay on the same volume. Hardlink creation is reversible
        # and retains one set of bytes; no original path is deleted or renamed.
        os.link(p,dest)
        changes.append({'action':'hardlink','original':str(p),'path':str(dest),'sha256':page['sha256']});save()
    elif not os.path.samefile(p,dest):raise RuntimeError('Conflicting app destination: '+str(dest))
    target=quote(os.path.relpath(p,folder).replace('\\','/'),safe='/')
    write(folder/'launch.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Open '+html.escape(page['title'] or pp.stem)+'</title><meta http-equiv="refresh" content="0;url='+html.escape(target,quote=True)+'"><p><a href="'+html.escape(target,quote=True)+'">Open app</a></p></html>\n')
    write(folder/'README.md',f'# {page["title"] or pp.stem}\n\nOpen [launch.html](launch.html). Original compatibility URL: `{path}`.\n\nThe source file here and its original path are NTFS hard links to the same bytes. In-place edits update both; editors that replace a file atomically can break that relationship. Check `os.path.samefile` after editing or refresh the link deliberately. Do not open the source through the new folder URL: relative resources and file-mode browser storage belong to the original URL.\n\nExternal hosts found in source: '+(', '.join(h for h in page['external_hosts'] if h not in ('www.w3.org','example.com','...')) or 'none')+'.\n\nBrowser persistence: '+('localStorage present' if page['uses_localStorage'] else 'no localStorage detected')+'. Source inspection is not a complete functional test.\n')
    mkdir(folder/'assets')
    apps.append({**page,'slug':slug(pp.stem),'organized_path':dest.relative_to(ROOT).as_posix(),'launch_path':(folder/'launch.html').relative_to(ROOT).as_posix()})
write(OUT/'apps.json',json.dumps(apps,indent=2,ensure_ascii=False))

favorites=['AIWS','N8DEV','Clark MSB','AXIOM_CODE_AI_WORKSPACE','N8Sheetz.html']
purpose={
 'AIWS':'Google AI Studio Workshop: React/Vite UI with an Express Gemini API server.',
 'AXIOM_CODE_AI_WORKSPACE':'Two standalone AXIOM coding-workspace HTML variants; separate from the AIWS server app.',
 'N8DEV':'Categorized collection: Arcade, Business, Dev, Kids, Music and project assets.',
 'N8 CyberDev':'N8 Nexus launcher, animation hub, and nested dashboard pages.',
 'N8-Pathfinder':'Flat browser-playground collection with its own index; overlaps in names with N8DEV, but versions may differ.',
 'context-hub':'Prompt resources and HTML asset-library shells.',
 'Clark MSB':'Science classroom website, lessons, worksheets and supporting documents.',
 'standalone-sites':'Independent HTML apps, organized source links and compatibility launchers.',
 'Aether':'No non-generated source files found in scoped inventory.',
 'Codex':'No non-generated source files found in scoped inventory.',
 'omni-architect-os':'Only a minimal metadata file found; no runnable entry verified.'}
index=['# Downloads project index','','Generated from local files on '+STAMP+'. Status is an initial organization choice, not inferred activity history.','','## Five favorites','',*['- '+v for v in favorites],'','## Projects','','| Project | Status | Purpose | Launch |','|---|---|---|---|']
rows=[]
for r in D['sizes']:
    name=r['folder'];status='active' if name in favorites else ('archived' if name=='Archives' else ('paused' if not r['files'] or name=='omni-architect-os' else 'reference'))
    entry=next((p['path'] for p in D['pages'] if p['path']==name+'/index.html'),None)
    if name=='N8DEV':entry='N8DEV/Dev/index.html'
    if name=='AXIOM_CODE_AI_WORKSPACE':entry='AXIOM_CODE_AI_WORKSPACE/AXIOM_CODE_AI_WORKSPACE_v4.html'
    if name=='AIWS':launch='From AIWS: `npm run dev` (dependencies and GEMINI_API_KEY required; server not started)'
    elif entry:launch=f'Open [{Path(entry).name}]({mdlink("../"+entry)})'
    else:launch='No single entry verified; open project folder'
    desc=purpose.get(name,'See scoped file inventory; no purpose inferred from name alone.')
    index.append(f'| {name} | {status} | {desc} | {launch} |')
    rows.append({'project':name,'status':status,'purpose':desc,'entry':entry or '', 'files':r['files'],'bytes':r['bytes']})
write(OUT/'PROJECT-INDEX.md','\n'.join(index)+'\n')
csvwrite(OUT/'project-status.csv',rows,list(rows[0]))

write(OUT/'guides'/'N8Sheetz.md','# N8Sheetz quick start\n\nOpen the original `N8Sheetz.html` or its launcher card. Create or edit cells, use File > Open (CSV) for a CSV, and File > Import Workbook (.json) for a workbook backup. Export CSV for interchange; use the workbook JSON export when available to preserve more workbook state. The source uses localStorage, so keep the same browser profile and original URL. Export a backup before clearing browser data. Import from URL fetches remote CSV/JSON and depends on network access and server CORS rules. These labels were verified in source; browser smoke testing is reported separately.\n')
write(OUT/'guides'/'EchoScribe.md','# EchoScribe input, output and storage\n\nOpen the original `EchoScribe.html`. Choose an audio/video file, select a Whisper model, then transcribe and use the app export controls. The source imports Hugging Face Transformers from jsDelivr; initial library/model loading requires network access. Audio processing is designed to run in the browser via WebGPU/WASM; no audio upload was performed during this organization task. Settings and transcript history use localStorage (`es_` keys and `es_history_list`). Export needed transcripts before clearing site data. Model downloads and full transcription have not been exercised.\n')
write(OUT/'guides'/'CareCirclePRO.md','# CareCirclePRO service requirements\n\nThe inspected source is a standalone family-care app. It stores state in localStorage under `carecircle_grams_data`. It references Google Fonts and an Unsplash image; those presentation resources need network access. User-entered patient-portal links open external websites. No `fetch()` call or application backend was detected in this file; this is source-level evidence, not a network-security audit. Keep care records out of shared launcher screenshots. Back up app data before clearing browser storage or switching origins.\n')
write(OUT/'guides'/'project-boundaries.md','# Project and version boundaries\n\n'+ '\n\n'.join('## '+k+'\n\n'+purpose[k] for k in ['N8DEV','N8 CyberDev','N8-Pathfinder','AIWS','AXIOM_CODE_AI_WORKSPACE'])+'\n\n## SEO dashboards\n\n`seoDash.html`: SEO Pro Dashboard, 11,001 bytes, meta/SERP preview and keyword-density headings. `seoDashWired.html`: SEO Architect Studio Pro, 70,656 bytes, includes fetch and an AllOrigins endpoint. These are different files, not duplicates. The launcher labels Wired as the primary feature-rich variant and the smaller page as the lightweight reference; maintenance history was not established. Both are retained.\n\n## Ambiguous filenames\n\n`2cntxt.html` is titled File2Context | AI Context Builder, with source-file and generated-context panels. `82the8th.html` is titled 8 - Escape to the 8th. The launcher uses these titles without renaming their original URLs.\n')

refs=[{'page':p['path'],**ref} for p in D['pages'] for ref in p['missing_refs']]
write(OUT/'broken-links.json',json.dumps(refs,indent=2,ensure_ascii=False))
css=[p['path'] for p in D['pages'] if any(r['resolved']=='accessibility.css' for r in p['local_refs'])]
write(OUT/'guides'/'accessibility-css.md','# Root accessibility.css references\n\n'+('\n'.join('- '+p for p in css) if css else 'No static HTML href/src reference to the root accessibility.css was found in the 209 inventoried pages.')+'\n\nThis does not rule out dynamic script imports or CSS @imports. Clark MSB has its own separate stylesheet. The root stylesheet was retained.\n')

write(OUT/'duplicates.json',json.dumps(D['duplicates'],indent=2,ensure_ascii=False))
cleanup=['# Cleanup review — no deletions executed','','Hashes describe the pre-organization snapshot. Re-hash before any approved deletion. Identical bytes do not establish that a path is unused.','','## Exact duplicate candidates','','| Candidate path | Retain matching path | Bytes | SHA-256 |','|---|---|---:|---|']
for g in D['duplicates']:
    for candidate in g['paths'][1:]:cleanup.append(f'| `{candidate}` | `{g["paths"][0]}` | {g["bytes_each"]:,} | `{g["sha256"]}` |')
cleanup+=['','These are comparison candidates, not an executable deletion list. Project configs, app entrypoints and separately referenced assets may need every copy. The current organization intentionally adds hard links, which must not be counted as wasted disk space.','','## Cyber/mecha comparison','','The two named cyber-core folders have byte-identical 311-byte index.html files. Those shells also match the other cyber/mecha and icona shells. Their referenced source entry is absent in the inventory; this is not evidence of complete duplicate asset libraries.','','## Confirmation boundary','','After dependency review, authorize exact paths before deletion. No files or branches were deleted.']
write(OUT/'CLEANUP-REVIEW.md','\n'.join(cleanup)+'\n')

write(ROOT/'Assets'/'README-ORGANIZATION.md','# Asset organization\n\nUse Shared for reusable assets and Project-Specific/<project> for assets owned by one project. Existing assets remain in place to preserve URLs. The current Assets inventory mostly contains placeholder metadata, so no substantive shared assets were moved. Keep a record in ASSET-LICENSES.csv when adding files; unknown is not permission to redistribute.\n')
assetroots=['Assets','Launcher Art','Cursors','icona-library','LIGHTNIN LIBRARY 🌩️⚡','cyber-core_-svg-character-library-&-combat-engine','cyber-core_-svg-character-library-&-combat-engine (1)','cyber-mecha-svg-sprite-library','cybermech-arena---svg-character-library']
csvwrite(ROOT/'Assets'/'ASSET-LICENSES.csv',[{'collection':n,'license':'unknown — no license file found','source_url':'','author':'','attribution':'unverified','redistribution':'not established'} for n in assetroots],['collection','license','source_url','author','attribution','redistribution'])
for folder in ['Launcher Art','Cursors']:
    write(OUT/'contact-sheets'/(slug(folder)+'.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+folder+' contact sheet</title><style>body{font:18px system-ui;padding:40px;max-width:900px;background:#101827;color:#edf2ff}h1{color:#7ce4c4}</style><h1>'+folder+'</h1><p>No images or cursors were present in this folder when inventoried. Add assets, then regenerate this contact sheet.</p></html>')
write(ROOT/'documents'/'README-ORGANIZATION.md','# Document subjects\n\nUse Business for client/business documents, Development for programming references, and Reference for general material. Existing CFLife and godot folders remain in place. Credential-related files were detected at the top level but were not opened or placed in public reports. This entire folder is now ignored by the Downloads Git repository. Ignore rules do not encrypt files or change cloud sharing; existing sync permissions require a separate provider-specific check.\n')
write(OUT/'guides'/'sync-and-privacy.md','# Sync and privacy audit\n\n`DRIVE FOLDER` and `client_sync` are ordinary local directories, not filesystem links. `client_sync` contained no top-level items at inspection. `DRIVE FOLDER` and `documents` both contain a CFLife folder and a CyberThrow HTML file; authority and active cloud sync cannot be inferred from names. Neither folder was recursively inspected. Do not merge them until provider ownership and sync rules are known.\n\n`git ls-files -- private` returned no tracked files. `private` was initially not ignored; .gitignore now excludes private, documents, DRIVE FOLDER and client_sync. Credential-related document filenames were seen but contents were not opened. Cloud sharing was not verified and cannot be controlled by .gitignore.\n\nThe local preview server serves only inventoried public HTML/assets and organization outputs. It blocks private folders, dotfiles, environment files and arbitrary directory listings.\n')
write(OUT/'guides'/'git-and-instructions.md','# Git and instruction audit\n\nThe Downloads root Git repository tracks N8DEV files, standalone apps, AXIOM v4, and a Clark MSB gitlink. It already had modified files and deleted legacy Clark MSB paths before this task. No commit, index change, history rewrite or remote operation was performed.\n\nThe root has node_modules but no root package.json or lockfile in the inspected top-level listing or tracked package-file results. Its owner was not established without traversing the excluded directory; it was retained.\n\nRoot AGENTS.md and CLAUDE.md contain matching multi-project scoping and exclusion rules, differing only in their tool settings path. No nested AGENTS.md was found in the scoped source inventory. The user-provided advisor and confirmation rules remain authoritative. No instruction file was rewritten.\n')
write(OUT/'RESTORE.md','# Restore and compatibility\n\nSee change-manifest.json for every generated file and hard link. Original .gitignore is backed up under scratch/downloads-organization-'+STAMP+'/.gitignore. Original application paths and bytes were preserved. Organized source links and their originals initially refer to the same NTFS file.\n\nTo undo organization, first inspect the manifest and authorize exact cleanup targets; remove only generated links/files and restore backed-up edited files. Never delete both names of a source file. Workspace relocation and pinning are recorded separately in workspace-actions.json. No automatic recursive-delete rollback script is provided.\n')
print(json.dumps({'apps_organized':len(apps),'changes':len(changes),'broken_references':len(refs),'duplicate_groups':len(D['duplicates'])}))
