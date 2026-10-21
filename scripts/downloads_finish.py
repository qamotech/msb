from pathlib import Path
import json,hashlib,os,csv,collections,datetime
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'Organization'
D=json.loads((OUT/'inventory.json').read_text(encoding='utf-8'))
audit=json.loads((OUT/'browser-audit.json').read_text(encoding='utf-8'))
rechecks=json.loads((OUT/'browser-recheck.json').read_text(encoding='utf-8'))
apps=json.loads((OUT/'apps.json').read_text(encoding='utf-8'))
cleared={r['path'] for r in rechecks if not r['errors']}
real=[r for r in audit['results'] if r['errors'] and r['path'] not in cleared]
errorpages=sorted({r['path'] for r in real});overflowpages=sorted({r['path'] for r in audit['results'] if r.get('overflow')})
def write(p,t):p.write_text(t,encoding='utf-8')

md=['# Browser audit — 2026-09-24','','61 pages, 122 desktop/mobile cases. Desktop: 1440×1000; phone: 390×844. These are startup, layout and keyboard smoke tests, not complete application end-to-end tests.','','## Results','',f'- {len(errorpages)} pages produced startup errors unrelated to the service-worker test setting.',f'- {len(overflowpages)} pages overflowed at one or both tested widths.', '- Educ8: no startup errors or document overflow at either width. Input-label heuristics need manual accessibility review.', '- Clark MSB home: desktop passed these smoke checks; phone document width was 417px at a 390px viewport.', '- N8Sheetz: no startup errors; phone document width was 1,135px at a 390px viewport.', '- 45 app screenshots were captured. CareCirclePRO was deliberately omitted from thumbnails because it is a care-record application.', '', '## Startup errors', '', '| Page | Width | Error |','|---|---:|---|']
for r in real:md.append(f'| `{r["path"]}` | {r["width"]} | '+ '; '.join(e.replace('|','/') for e in r['errors'])+' |')
md+=['','## Overflow','','| Page | Viewport | Document width |','|---|---:|---:|']
for r in audit['results']:
    if r.get('overflow'):md.append(f'| `{r["path"]}` | {r["width"]} | {r["scrollWidth"]} |')
md+=['','## Environment-sensitive findings','','CodeN8R, front-end-developer-workbench, site-forge-cyber-electric, and turtlebot-nexus reported service-worker errors under the initial blocked-service-worker test setting. All four had no page errors on a fresh desktop-profile recheck with the normal service-worker setting. Mobile behavior was not rerun under that setting. These initial errors are not asserted as application defects.','','## Limits','','External requests in the initial audit were limited to library/font CDNs; POST requests, model downloads, media permissions, and remote service submissions were not exercised. Console resource errors may therefore be caused by this test policy. Eight Tab presses record focus reachability, not full keyboard usability or accessibility compliance. Unnamed-control counts are heuristics and include hidden controls. Existing personal browser storage was not used.','','## Source references','','The HTML attribute audit found 2,106 unresolved references in 209 pages. This includes anchors to missing pages and source-module references in incomplete app shells. It is not a count of unique broken resources. CSS URLs, dynamically constructed links, and application functionality are outside that static count. See broken-links.json for every occurrence.']
md += ['','## Additional keyboard and concurrent-change checks','','Six selected apps were tested with 16 Tab presses plus Shift+Tab. Every recorded stop was visible. See keyboard-audit.json for focus names, focus-visible state and source hashes. AIWS was excluded because its server/dependencies were not started. CareCirclePRO changed outside this task during organization; its current file was rechecked and still produced Invalid or unexpected token. Its recorded hash stayed stable during that recheck.']
write(OUT/'BROWSER-REPORT.md','\n'.join(md)+'\n')

status=[
 (1,'Done','Inbox created with a review workflow.'),
 (2,'Adapted','AIWS physically relocated to Documents/Downloads-Projects with its old path preserved by a junction. Eight other project folders are linked into the workspace to preserve Git ownership and paths.'),
 (3,'Done','Five project folders pinned to Quick Access; all five verified through the Windows shell.'),
 (4,'Done','PROJECT-INDEX.md records purpose, status and verified entrypoints or launch prerequisites.'),
 (5,'Done','project-status.csv applies initial active, paused, reference and archived categories; these are editable defaults.'),
 (6,'Done','Archives/2026-09-24 created; the existing npp-master archive moved inside with a compatibility junction.'),
 (7,'Adapted','46 app sources consolidated through NTFS hard links under standalone-sites/apps. Original URLs remain to preserve links and browser storage; no duplicate source bytes were created.'),
 (8,'Done','Each app has its own folder, assets folder, README and launch.html wrapper.'),
 (9,'Done','Downloads-Launcher.html provides search, category filters, five favorites and app links.'),
 (10,'Done','45 app screenshots added; CareCirclePRO uses a neutral placeholder to avoid care-record imagery.'),
 (11,'Done','Both cyber-core shells are hash-identical at 311 bytes. Contents compared; neither was deleted.'),
 (12,'Done','Related cyber/mecha shells compared. Missing substantive source/assets prevent a useful shared-library extraction.'),
 (13,'Done','N8DEV, N8 CyberDev and N8-Pathfinder boundaries documented from their actual files.'),
 (14,'Done','AIWS server-backed React/Vite app distinguished from AXIOM standalone HTML variants.'),
 (15,'Unresolved','SEO versions compared and labeled. Maintenance authority cannot be established from current files; Wired has a startup error, so it is not promoted as the working default.'),
 (16,'Done','2cntxt and 82the8th are labeled by their actual HTML titles in the launcher.'),
 (17,'Done','N8Sheetz source-based quick-start guide created; CSV/JSON and localStorage behavior noted.'),
 (18,'Done','EchoScribe input, browser inference, network prerequisites and localStorage documented; full transcription not tested.'),
 (19,'Done','CareCircle source-level font/image/portal dependencies and local storage documented; startup error recorded.'),
 (20,'Done','Educ8 tested at 1440px and 390px; no startup errors or overflow in either smoke test.'),
 (21,'Done','15 top-level Clark MSB pages browser-tested at both widths; mobile and archived-page failures documented.'),
 (22,'Done','209 HTML pages checked for static local href/src/poster targets; 2,106 unresolved occurrences recorded.'),
 (23,'Done','61 pages checked for startup, console and local-request errors; environment artifacts separated.'),
 (24,'Done','Keyboard smoke tests completed: 16 Tab presses plus Shift+Tab for N8DEV, AXIOM, Clark MSB, N8Sheetz, Educ8 and CareCircle. All recorded stops visible; full workflows and AIWS server UI remain unverified.'),
 (25,'Done','No static references to root accessibility.css found in scanned HTML; stylesheet retained and dynamic-reference limitation noted.'),
 (26,'Done','Prompt category and prompt-resource guide group prompt builders, context tools and the prompt text file.'),
 (27,'Done','Shared and Project-Specific structures created. Five asset collections moved into Shared; CFP Assets moved under its project, with old paths preserved.'),
 (28,'Done','ASSET-LICENSES.csv records unknown licenses and missing provenance; no redistribution rights invented.'),
 (29,'Unavailable','Both art/cursor folders were empty. Honest empty contact sheets and a reusable contact-sheet generator were created; there are no images to tile.'),
 (30,'Done','Business, Development and Reference folders created; CFLife and godot moved to their subject folders with old paths preserved.'),
 (31,'Partial','Local folder roles and overlap documented; cloud sync ownership cannot be established from local names alone.'),
 (32,'Partial','private is untracked and now ignored, along with documents and sync folders. Cloud sharing permissions remain unverified.'),
 (33,'Done','Root Git cross-project tracking and pre-existing changes documented; no commits, index changes or history rewrites.'),
 (34,'Unresolved','Root node_modules has no root/parent package manifest or matching package history in the inspected root repository. Ownership remains unknown; excluded directory was not traversed.'),
 (35,'Done','Root AGENTS.md/CLAUDE.md compared; equivalent scoping rules. No nested AGENTS.md found in scoped source inventory.'),
 (36,'Done','Change, workspace and subject manifests record edits, hard links, moves and compatibility junctions; original edited files backed up.'),
 (37,'Done','folder-sizes.csv reports 27 explicitly scoped folders, excluding generated/private paths. These are scoped source sizes, not total disk usage.'),
 (38,'Done','19 SHA-256 duplicate groups reported; newly created hard links are excluded from duplicate savings claims.'),
 (39,'Done','AIWS, N8DEV, Clark MSB, AXIOM and N8Sheetz selected as the five editable starting favorites.'),
 (40,'Prepared for review','CLEANUP-REVIEW.md lists exact duplicate candidate paths, matching copies, sizes and hashes. Deletions require path-specific approval after dependency review; none executed.')]
counts=collections.Counter(s for _,s,_ in status)
lines=['# Downloads implementation status','','All 40 suggestions are accounted for below. Adapted and unresolved items are not claimed as fully completed.','','## Open the result','','- Double-click `Downloads-Launcher.html` to use the local launcher with existing file URLs.', '- Use `scripts/Start-DownloadsLauncher.ps1` for the allowlisted loopback preview. HTTP browser storage is separate from file-mode storage.', '- Workspace: `C:\\Users\\qamel\\Documents\\Downloads-Projects`.', '- Browser findings: BROWSER-REPORT.md. Cleanup candidates: CLEANUP-REVIEW.md.', '', '## Status totals','',', '.join(f'{v} {k.lower()}' for k,v in counts.items())+'.','','| # | Status | Result |','|---:|---|---|']
lines += [f'| {n} | {s} | {detail} |' for n,s,detail in status]
lines+=['','## Remaining decisions and evidence gaps','','- Identify the maintained SEO variant if you have a preferred source or repository.', '- Supply real assets to create nonempty art/cursor contact sheets.', '- Identify the active cloud-sync provider/folder mapping before verifying sharing permissions.', '- Identify the owner of the root dependency folder without traversing excluded paths.', '- Complete app-specific keyboard workflows and repair reported pre-existing application failures separately.', '- Approve exact candidate paths only if you want deletion after dependency review.']
write(OUT/'IMPLEMENTATION-STATUS.md','\n'.join(lines)+'\n')
write(OUT/'implementation-status.json',json.dumps([{'number':n,'status':s,'result':t} for n,s,t in status],indent=2))

# Refresh documentation to describe executed subject moves, not the initial plan.
write(ROOT/'Assets'/'README-ORGANIZATION.md','# Asset organization\n\nShared contains FAVICONS, PNG Packs, monopoly_3d_pbr_texture_atlas, svg-asset-studio-&-400-library and cyber-mecha-svg-sprite-library. Project-Specific/CFP contains CFP Assets. Original paths are compatibility junctions. Most collections were empty or contained only placeholder metadata; no substantive reusable library was inferred. Consult ASSET-LICENSES.csv before redistribution.\n')
write(ROOT/'documents'/'README-ORGANIZATION.md','# Document subjects\n\nBusiness contains CFLife; Development contains godot; Reference is ready for general documents. Original CFLife and godot paths remain as compatibility junctions. Credential-related top-level files were not opened or placed in public reports. The entire documents folder is ignored by the Downloads Git repository. This does not change cloud sharing or encrypt files.\n')
write(ROOT/'Archives'/'2026-09-24'/'README.md','# Archive date: 2026-09-24\n\nThe existing npp-master archive was relocated here on this organization date; its old path is a compatibility junction. The folder date records relocation, not original creation. Exact source and destination are in Organization/subject-moves.json.\n')
bound=OUT/'guides'/'project-boundaries.md'
s=bound.read_text(encoding='utf-8').replace('The launcher labels Wired as the primary feature-rich variant and the smaller page as the lightweight reference; maintenance history was not established. Both are retained.','Maintenance history was not established. Browser testing found a startup error in Wired; the launcher marks it for review. The lightweight variant had no startup error in the smoke tests. Both are retained.')
write(bound,s)
write(OUT/'guides'/'prompt-resources.md','# Prompt resources\n\n- [PromptGen](../../PromptGen.html): Local AI Prompt Enhancer Pro.\n- [masterPrompt](../../masterPrompt-upd8.html): animated webbuilding prompt deck.\n- [File2Context](../../2cntxt.html): source-file context builder.\n- [AI Quota Bridge](../../AI_N8R_HUB.html): Gemini bridge; remote services require their own credentials/quota.\n- The `N8_APP_BUILDER` text file in Downloads remains at its original path as a prompt reference.\n\nUse the Prompts filter in Downloads-Launcher.html. No credential-bearing files were included.\n')
index=OUT/'PROJECT-INDEX.md';s=index.read_text(encoding='utf-8')
if '## Workspace organization' not in s:s+='\n## Workspace organization\n\nAIWS now lives in `C:\\Users\\qamel\\Documents\\Downloads-Projects\\AIWS`; its Downloads path remains a junction. Other workspace projects use junctions to existing locations so root Git ownership stays intact. All five favorites are pinned in Quick Access.\n'
write(index,s)

# Verify original source bytes and each hard link without traversing excluded trees.
checks=[]
for r in D['records']:
    if r['path']=='scripts/downloads_inventory.py':continue
    p=ROOT/r['path'];actual=hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
    checks.append({'path':r['path'],'matches_before':actual==r['sha256']})
links=[{'path':a['organized_path'],'same_file':os.path.samefile(ROOT/a['path'],ROOT/a['organized_path'])} for a in apps]
verify={'original_source_files_checked':len(checks),'source_mismatches':[r for r in checks if not r['matches_before']],'hardlinks_checked':len(links),'hardlink_failures':[r for r in links if not r['same_file']]}
write(OUT/'source-preservation.json',json.dumps(verify,indent=2))
if verify['source_mismatches']:
    write(OUT/'CONCURRENT-CHANGES.md','# Source changes observed during organization\n\nThe following originals changed after the baseline inventory, outside this task\'s source-writing operations. Their current contents were preserved; no rollback was attempted. Organized hard links still point to the same files. Earlier browser results for these files describe a prior snapshot unless explicitly rechecked.\n\n'+'\n'.join('- `'+r['path']+'`' for r in verify['source_mismatches'])+'\n')
assert not verify['hardlink_failures'],verify

# Register newly generated outputs omitted by the first implementation pass.
manifest=json.loads((OUT/'change-manifest.json').read_text(encoding='utf-8'))
known={x.get('path') for x in manifest}
generated=[ROOT/'Downloads-Launcher.html']+list(OUT.rglob('*'))+list((ROOT/'scripts').glob('downloads_*'))+[ROOT/'scripts'/'Start-DownloadsLauncher.ps1']
for p in generated:
    if p.is_file() and str(p) not in known and p.name!='change-manifest.json':
        manifest.append({'action':'generated-output','path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
write(OUT/'change-manifest.json',json.dumps(manifest,indent=2,ensure_ascii=False))
print(json.dumps({'statuses':counts,'preservation':verify,'startup_error_pages':len(errorpages),'overflow_pages':len(overflowpages)}))
