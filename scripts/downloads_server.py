"""Loopback preview with an explicit source-file allowlist; no folder listings."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit,unquote
import json,re,html
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Organization'
data=json.loads((OUT/'inventory.json').read_text(encoding='utf-8'))
EXT={'.html','.htm','.css','.js','.mjs','.json','.svg','.png','.jpg','.jpeg','.gif','.webp','.ico','.woff','.woff2','.mp3','.wav','.mp4','.webm','.pdf','.docx'}
allowed={r['path'] for r in data['records'] if Path(r['path']).suffix.lower() in EXT and not any(x.startswith('.') for x in Path(r['path']).parts)}
allowed.add('Downloads-Launcher.html')
for pattern in ['*/launch.html','*/README.md']:
    for p in (ROOT/'standalone-sites'/'apps').glob(pattern):allowed.add(p.relative_to(ROOT).as_posix())
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def do_GET(self):
        path=unquote(urlsplit(self.path).path).lstrip('/') or 'Downloads-Launcher.html'
        if path=='favicon.ico':self.send_error(404);return
        resolved=(ROOT/path).resolve()
        try:normalized=resolved.relative_to(ROOT.resolve()).as_posix()
        except ValueError:self.send_error(403);return
        is_safe = not any(x.startswith('.') or x in ('node_modules', '--REPOSITORIES--') for x in Path(normalized).parts)
        allowed_ext = resolved.suffix.lower() in EXT or resolved.suffix.lower() == '.md'
        if not is_safe or not allowed_ext:
            self.send_error(403)
            return
        if not resolved.is_file():self.send_error(404);return
        if resolved.suffix=='.md':
            def inline(value):
                value=html.escape(value)
                value=re.sub(r'`([^`]+)`',r'<code>\1</code>',value)
                value=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:'<a href="'+m[2].replace('&lt;','').replace('&gt;','')+'">'+m[1]+'</a>' if not re.match(r'(?i)(javascript|data):',m[2]) else m[1],value)
                return value
            blocks=[];table=False
            for line in resolved.read_text(encoding='utf-8').splitlines():
                if line.startswith('|'):
                    if re.match(r'^\|[\s:|-]+\|$',line):continue
                    if not table:blocks.append('<div class="table"><table>');table=True
                    blocks.append('<tr>'+''.join('<td>'+inline(v.strip())+'</td>' for v in line.strip('|').split('|'))+'</tr>');continue
                if table:blocks.append('</table></div>');table=False
                if not line.strip():continue
                m=re.match(r'^(#{1,3})\s+(.*)',line)
                blocks.append(f'<h{len(m[1])}>{inline(m[2])}</h{len(m[1])}>' if m else '<p>'+inline(line)+'</p>')
            if table:blocks.append('</table></div>')
            body=('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(resolved.stem)+'</title><style>body{font:16px/1.65 Segoe UI,system-ui;margin:40px auto;padding:0 24px;max-width:1150px;background:#0b1018;color:#eaf0f8}a{color:#8de5ce}h1{font-size:32px}h2{margin-top:32px}code{font-size:13px;overflow-wrap:anywhere;background:#192637;padding:2px 5px;border-radius:4px}.table{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}td{padding:12px;border:1px solid #344055;vertical-align:top}tr:first-child{background:#1a2d3a;font-weight:bold}a:focus-visible{outline:3px solid #8de5ce;outline-offset:4px}</style><nav><a href="/Downloads-Launcher.html">← Downloads launcher</a> · <a href="/Organization/BROWSER-REPORT.md">Browser report</a></nav>'+''.join(blocks)+'</html>').encode('utf-8')
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
        self.path='/'+path
        super().do_GET()
    def do_HEAD(self):self.send_error(405)
    def list_directory(self,path):self.send_error(403);return None
    def log_message(self,*a):pass
if __name__=='__main__':
    print('Downloads preview: http://127.0.0.1:8876/Downloads-Launcher.html',flush=True)
    ThreadingHTTPServer(('127.0.0.1',8876),Handler).serve_forever()
