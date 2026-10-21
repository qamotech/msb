const {chromium}=require('C:/Users/qamel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'Organization');
const apps=JSON.parse(fs.readFileSync(path.join(out,'apps.json'),'utf8'));
const inventory=JSON.parse(fs.readFileSync(path.join(out,'inventory.json'),'utf8'));
const base='http://127.0.0.1:8876/';
function clean(s){return String(s).replace(/https?:\/\/[^\s"')]+/g,m=>{try{let u=new URL(m);return u.origin+u.pathname}catch{return '[URL]'}}).slice(0,500)}
async function main(){
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 const targets=[...apps.map(a=>({path:a.path,slug:a.slug,shot:a.path!=='CareCirclePRO.html'})),
 ...inventory.pages.filter(a=>a.path.startsWith('Clark MSB/')&&a.path.split('/').length===2).map(a=>({path:a.path,slug:'clark-'+path.basename(a.path,'.html'),shot:false}))];
 const tasks=targets.flatMap(t=>[{...t,width:1440,height:1000},{...t,width:390,height:844}]);
 let cursor=0;
 async function worker(){
  const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
  await context.route('**/*',route=>{
   const req=route.request(),u=new URL(req.url());
   if(!['http:','https:'].includes(u.protocol))return route.continue();
   const local=u.hostname==='127.0.0.1'&&u.port==='8876';
   const staticHost=['cdn.jsdelivr.net','cdnjs.cloudflare.com','unpkg.com','fonts.googleapis.com','fonts.gstatic.com','cdn.tailwindcss.com'].includes(u.hostname);
   if(req.method()!=='GET'||(!local&&!staticHost))return route.abort('blockedbyclient');
   return route.continue();
  });
  while(cursor<tasks.length){
   const t=tasks[cursor++],page=await context.newPage(),errors=[],consoleErrors=[],failed=[];
   await page.setViewportSize({width:t.width,height:t.height});
   page.on('pageerror',e=>errors.push(clean(e.message)));
   page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('net::ERR_BLOCKED_BY_CLIENT'))consoleErrors.push(clean(m.text()))});
   page.on('requestfailed',r=>{if(r.url().startsWith(base))failed.push(clean(r.url()))});
   const result={path:t.path,width:t.width,errors,consoleErrors,failedLocalRequests:failed};
   try{
    await page.goto(base+t.path.split('/').map(encodeURIComponent).join('/'),{waitUntil:'domcontentloaded',timeout:15000});
    await page.waitForTimeout(500);
    Object.assign(result,await page.evaluate(()=>({title:document.title,bodyTextLength:document.body?.innerText.length||0,
     overflow:document.documentElement.scrollWidth>innerWidth+1,scrollWidth:document.documentElement.scrollWidth,
     controls:document.querySelectorAll('button,input,select,textarea,a[href]').length,
     unnamedButtons:[...document.querySelectorAll('button')].filter(x=>!x.innerText.trim()&&!x.getAttribute('aria-label')&&!x.getAttribute('title')&&!x.querySelector('img[alt]')).length,
     unlabeledInputs:[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(x=>!x.getAttribute('aria-label')&&!x.getAttribute('aria-labelledby')&&!x.getAttribute('title')&&!(x.labels&&x.labels.length)).length
    })));
    if(t.width===390||['N8Sheetz.html','Educ8.html','EchoScribe.html','Clark MSB/index.html'].includes(t.path)){
      result.tabStops=[];
      for(let i=0;i<8;i++){await page.keyboard.press('Tab');result.tabStops.push(await page.evaluate(()=>{let e=document.activeElement;return {tag:e.tagName,id:e.id,role:e.getAttribute('role'),name:(e.getAttribute('aria-label')||e.innerText||e.getAttribute('placeholder')||'').trim().slice(0,80)}}));}
    }
    if(t.shot&&t.width===1440)await page.screenshot({path:path.join(out,'screenshots',t.slug+'.png'),timeout:6000,animations:'disabled'});
    if(t.width===390&&['Educ8.html','Clark MSB/index.html','N8Sheetz.html'].includes(t.path))await page.screenshot({path:path.join(out,'screenshots',t.slug+'-mobile.png'),timeout:6000,animations:'disabled'});
   }catch(e){result.auditError=clean(e.message)}
   results.push(result);await page.close();
   fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify({policy:'Fresh isolated Chrome profile; GET only; external network limited to listed library/font CDNs; no model downloads, submissions, credentials or existing browser storage. Eight Tab presses are a keyboard smoke test, not a full accessibility audit.',results},null,2));
   if(results.length%20===0)console.log('Audited',results.length,'/',tasks.length);
  }
  await context.close();
 }
 await Promise.all([worker(),worker(),worker()]);await browser.close();
 console.log(JSON.stringify({cases:results.length,pages:targets.length,scriptErrorCases:results.filter(r=>r.errors.length).length,overflowCases:results.filter(r=>r.overflow).length,auditErrors:results.filter(r=>r.auditError).length}));
}
main().catch(e=>{console.error(clean(e.stack));process.exitCode=1});
