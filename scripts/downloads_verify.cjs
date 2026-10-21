const {chromium}=require('C:/Users/qamel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const out=path.resolve(__dirname,'../Organization'),base='http://127.0.0.1:8876/';
async function main(){
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext();
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'Downloads-Launcher.html');
 assert.equal(await p.locator('.card').count(),46);
 await p.locator('#search').fill('N8Sheetz');assert.equal(await p.locator('.card:visible').count(),1);
 await p.locator('#search').fill('no-such-app-zz');assert(await p.locator('#empty').isVisible());
 await p.locator('#search').fill('');await p.getByRole('button',{name:'Prompts',exact:true}).click();
 const prompts=await p.locator('.card:visible').count();assert(prompts>=3&&prompts<46);
 await p.getByRole('button',{name:'All apps',exact:true}).click();assert.equal(await p.locator('.card:visible').count(),46);
 const layouts=[];
 for(const width of [1440,390]){
  await p.setViewportSize({width,height:1000});
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow);
  await p.screenshot({path:path.join(out,'screenshots',`launcher-${width}.png`),fullPage:false});layouts.push({width,overflow});
 }
 await p.reload();await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.className),'skip');
 await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,'#library');
 const links=await p.locator('a[href]').evaluateAll(a=>[...new Set(a.map(e=>e.getAttribute('href')).filter(v=>!v.startsWith('#')))]);
 const missing=[];
 for(const link of links){const r=await context.request.get(base+link);if(r.status()!==200)missing.push({link,status:r.status()})}
 for(const x of ['private/probe','documents/README-ORGANIZATION.md','.git/config','.env','scripts/downloads_apply.py']){
  const r=await context.request.get(base+x);assert.equal(r.status(),403);
 }
 const wrapper=JSON.parse(fs.readFileSync(path.join(out,'apps.json'),'utf8')).find(x=>x.path==='N8Sheetz.html');
 await p.goto(base+wrapper.launch_path);await p.waitForURL(base+'N8Sheetz.html');
 const report={cards:46,promptFilterCards:prompts,search:true,emptyState:true,keyboardSkipLink:true,layouts,missingLinks:missing,errors,privateRoutesBlocked:true,wrapperRedirect:true};
 fs.writeFileSync(path.join(out,'launcher-verification.json'),JSON.stringify(report,null,2));
 await browser.close();console.log(JSON.stringify(report));assert.equal(missing.length,0);assert.equal(errors.length,0);
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
