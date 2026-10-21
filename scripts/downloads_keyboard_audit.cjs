const {chromium}=require('C:/Users/qamel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'Organization'),base='http://127.0.0.1:8876/';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
 const targets=['N8DEV/Dev/index.html','AXIOM_CODE_AI_WORKSPACE/AXIOM_CODE_AI_WORKSPACE_v4.html','Clark MSB/index.html','N8Sheetz.html','Educ8.html','CareCirclePRO.html'];
 for(const file of targets){
  const c=await b.newContext(),p=await c.newPage(),errors=[],before=hash(file);
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+file.split('/').map(encodeURIComponent).join('/'),{waitUntil:'domcontentloaded',timeout:15000});await p.waitForTimeout(400);
  const stops=[];
  for(let i=0;i<16;i++){
   await p.keyboard.press('Tab');stops.push(await p.evaluate(()=>{
    const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);
    return {tag:e.tagName,id:e.id,role:e.getAttribute('role'),name:(e.getAttribute('aria-label')||e.getAttribute('title')||e.innerText||e.getAttribute('placeholder')||'').trim().slice(0,90),visible:r.width>0&&r.height>0&&s.visibility!=='hidden',focusVisible:e.matches(':focus-visible'),outline:s.outlineStyle,outlineWidth:s.outlineWidth};
   }));
  }
  const forwardId=await p.evaluate(()=>document.activeElement.id);await p.keyboard.press('Shift+Tab');
  const backward=await p.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id}));
  results.push({path:file,sha256Before:before,sha256After:hash(file),errors,stops,shiftTab:{beforeId:forwardId,after:backward},distinctStops:new Set(stops.map(x=>x.tag+'|'+x.id+'|'+x.name)).size});
  await c.close();
 }
 await b.close();fs.writeFileSync(path.join(out,'keyboard-audit.json'),JSON.stringify({policy:'Fresh isolated profiles; 16 Tab presses and Shift+Tab. No data-entry, remote submissions or original stored data. AIWS needs its server/dependencies and is not a static browser page.',results},null,2));
 console.log(JSON.stringify(results.map(r=>({path:r.path,errors:r.errors,distinctStops:r.distinctStops,hiddenStops:r.stops.filter(s=>!s.visible).length,sourceStable:r.sha256Before===r.sha256After}))));
})().catch(e=>{console.error(e.message);process.exitCode=1});
