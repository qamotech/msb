const {chromium}=require('C:/Users/qamel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const out=path.resolve(__dirname,'../Organization'),base='http://127.0.0.1:8876/';
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
 for(const file of ['CodeN8R.html','front-end-developer-workbench.html','site-forge-cyber-electric.html','turtlebot-nexus.html']){
  const c=await b.newContext(),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'standalone-sites/'+file,{waitUntil:'domcontentloaded',timeout:15000});await p.waitForTimeout(800);
  results.push({path:'standalone-sites/'+file,serviceWorkers:'allowed in fresh isolated profile',errors});await c.close();
 }
 await b.close();fs.writeFileSync(path.join(out,'browser-recheck.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
})().catch(e=>{console.error(e.message);process.exitCode=1});
