"""Bounded, read-only source inventory. Reports go to Organization only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import defaultdict
import os, json, hashlib, re, csv, subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'Organization'
OUT.mkdir(exist_ok=True)
SCOPES = ['1POLY','Aether','AIWS','AXIOM_CODE_AI_WORKSPACE','Clark MSB',
 'Codex','context-hub','culmin8','N8DEV','N8 CyberDev','N8-Pathfinder',
 'omni-architect-os','npp-main','standalone-sites','Assets','Archives',
 'Launcher Art','Cursors','icona-library','LIGHTNIN LIBRARY 🌩️⚡',
 'cyber-core_-svg-character-library-&-combat-engine',
 'cyber-core_-svg-character-library-&-combat-engine (1)',
 'cyber-mecha-svg-sprite-library','cybermech-arena---svg-character-library',
 'advice','scripts','workflows']
SKIP = {'node_modules','.git','--REPOSITORIES--','_ldetest','.tmp.driveupload',
 '.tmp.drivedownload','.playwright-mcp','private','dist','build','.next',
 '.cache','.agent-projects','.codeboarding','.vibecheck','Organization'}
SENSITIVE = re.compile(r'(?i)(secret|secrt|credential|backup.codes|gsk_|api.?key|token|^\.env(?!\.example))')

def rel(p): return p.relative_to(ROOT).as_posix()
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
def files(scope):
    for d, dirs, names in os.walk(scope, followlinks=False):
        dirs[:] = [n for n in dirs if n not in SKIP and not (Path(d)/n).is_junction() and not (Path(d)/n).is_symlink()]
        for n in names:
            p=Path(d)/n
            if p.is_symlink() or n.lower().endswith('.exe') or re.match(r'temp.*\.js$',n,re.I) or SENSITIVE.search(n): continue
            yield p
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=''; self.in_title=False; self.refs=[]; self.buttons=[]; self.headings=[]; self.heading=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag in ('h1','h2'): self.heading=True
        for k in ('src','href','poster'):
            if a.get(k): self.refs.append((tag,k,a[k]))
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
        if tag in ('h1','h2'): self.heading=False
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.heading and data.strip():self.headings.append(data.strip())

def main():
    records=[]; sizes=[]; pages=[]; instructions=[]; errors=[]
    roots=[p for p in ROOT.iterdir() if p.is_file() and p.suffix.lower() in ('.html','.htm','.css')]
    scoped=[]
    for name in SCOPES:
        p=ROOT/name
        if not p.is_dir():continue
        ff=list(files(p)); scoped.extend(ff)
        sizes.append({'folder':name,'files':len(ff),'bytes':sum(f.stat().st_size for f in ff),'scope':'excludes generated, private, credential-named files and junctions'})
    for p in roots+scoped:
        try:
            r={'path':rel(p),'bytes':p.stat().st_size,'sha256':sha(p)};records.append(r)
            if p.name=='AGENTS.md':instructions.append({'path':rel(p),'text':p.read_text(encoding='utf-8',errors='replace')})
            if p.suffix.lower() not in ('.html','.htm'):continue
            s=p.read_text(encoding='utf-8',errors='replace'); hp=Page();hp.feed(s)
            local=[];hosts=set();missing=[]
            for tag,attr,url in hp.refs:
                u=urlsplit(url)
                if u.scheme in ('https','http') or u.netloc:
                    hosts.add(u.hostname or '');continue
                if u.scheme or not u.path or any(c in u.path for c in '${}'):continue
                target=(ROOT/unquote(u.path).lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
                try:t=target.resolve().relative_to(ROOT).as_posix()
                except ValueError:continue
                item={'tag':tag,'attribute':attr,'url':url,'resolved':t,'exists':target.exists()}
                local.append(item)
                if not target.exists():missing.append(item)
            hosts.update(re.findall(r'https?://([a-zA-Z0-9.-]+)',s))
            pages.append({'path':rel(p),'title':hp.title.strip(),'headings':hp.headings[:10],
              'bytes':p.stat().st_size,'sha256':r['sha256'],'local_refs':local,'missing_refs':missing,
              'external_hosts':sorted(hosts),'uses_localStorage':'localStorage' in s,
              'uses_indexedDB':'indexedDB' in s,'uses_fetch':bool(re.search(r'\bfetch\s*\(',s)),
              'has_base':bool(re.search(r'<base\b',s,re.I)),
              'absolute_local_path':bool(re.search(r'(?:[A-Z]:\\\\|file:///)',s,re.I)),
              'uses_relative_css':bool(re.search(r'url\(\s*[\'\"]?(?!data:|https?:|#)',s,re.I))})
        except Exception as e:errors.append({'path':rel(p),'error':type(e).__name__})
    groups=defaultdict(list)
    for r in records:
        if r['bytes'] and Path(r['path']).name.lower() not in ('desktop.ini','agents.md','claude.md','.gitignore'):
            groups[(r['bytes'],r['sha256'])].append(r['path'])
    duplicates=[{'bytes_each':k[0],'sha256':k[1],'paths':v,'potential_bytes':k[0]*(len(v)-1)} for k,v in groups.items() if len(v)>1]
    duplicates.sort(key=lambda g:-g['potential_bytes'])
    result={'root':str(ROOT),'scopes':SCOPES,'excluded':sorted(SKIP),'records':records,'sizes':sizes,'pages':pages,'duplicates':duplicates,'instructions':instructions,'errors':errors}
    (OUT/'inventory.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    for name,rows in [('folder-sizes.csv',sizes),('file-hashes.csv',records)]:
        with (OUT/name).open('w',newline='',encoding='utf-8-sig') as f:
            w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    print(json.dumps({'files':len(records),'pages':len(pages),'duplicate_groups':len(duplicates),'instructions':instructions,'errors':errors,
        'largest':sorted(sizes,key=lambda x:-x['bytes'])[:8],
        'root_pages':[{k:p[k] for k in ['path','title','headings','local_refs','external_hosts','uses_localStorage','uses_indexedDB','uses_fetch','absolute_local_path']} for p in pages if '/' not in p['path']]}))
if __name__=='__main__':main()
