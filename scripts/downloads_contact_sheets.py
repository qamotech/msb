"""Generate contact sheets only for Launcher Art and Cursors; no recursive scan."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
from html import escape
import re
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Organization'/'contact-sheets'
OUT.mkdir(parents=True,exist_ok=True)
for name in ['Launcher Art','Cursors']:
    stem=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-');thumbs=[];unreadable=[]
    for p in (ROOT/name).iterdir():
        if not p.is_file() or p.suffix.lower() not in {'.png','.jpg','.jpeg','.gif','.webp','.bmp','.ico','.cur'}:continue
        try:
            with Image.open(p) as im:thumbs.append((p.name,ImageOps.contain(im.convert('RGBA'),(160,130))))
        except Exception:unreadable.append(p.name)
    if thumbs:
        sheet=Image.new('RGB',(800,180*((len(thumbs)+3)//4)), '#101827');draw=ImageDraw.Draw(sheet)
        for i,(label,im) in enumerate(thumbs):
            x=(i%4)*200;y=(i//4)*180;sheet.paste(im,(x+20,y+10),im);draw.text((x+10,y+145),label[:25],fill='white')
        sheet.save(OUT/(stem+'.png'));body=f'<img src="{stem}.png" alt="{escape(name)} asset contact sheet" style="max-width:100%">'
    else:body='<p>No supported images or cursors are present in this folder. Add assets, then regenerate this contact sheet.</p>'
    if unreadable:body+='<p>Unreadable assets: '+escape(', '.join(unreadable))+'</p>'
    (OUT/(stem+'.html')).write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(name)} contact sheet</title><style>body{{font:18px system-ui;padding:40px;max-width:900px;background:#101827;color:#edf2ff}}h1{{color:#7ce4c4}}</style><h1>{escape(name)}</h1>{body}</html>',encoding='utf-8')
    print(name+': '+str(len(thumbs))+' thumbnails')
