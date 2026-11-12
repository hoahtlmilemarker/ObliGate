const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [pg,outf]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const styles=[];const seen=new Set();let bodies='';const names=[];
for(const th of ['light','dark'])for(const [dev,w] of [['Tablet',768],['Mobile',390]]){const f=`out3/${pg}__${th}__${dev}.html`;const p=await b.newPage({viewport:{width:w,height:800}});await p.goto('file://'+path.resolve(f));await p.waitForTimeout(100);
 const r=await p.evaluate(()=>{const st=[...document.querySelectorAll('style')].map(s=>s.textContent);const h=document.documentElement.scrollHeight;const c=document.body.cloneNode(true);c.querySelectorAll('style,script').forEach(e=>e.remove());return {st,h,html:c.innerHTML,bs:document.body.getAttribute('style')||'',bc:document.body.className,hc:document.documentElement.className}});
 for(const s of r.st){if(/min-width:\d+px!important/.test(s)&&/html,body\{width/.test(s))continue;if(!seen.has(s)){seen.add(s);styles.push(s)}}
 const nm=(th==='dark'?'Dark':'Light')+' · '+dev+' '+w;names.push(nm);
 bodies+=`<section class="fig-state ${r.hc} ${r.bc}" data-name="${nm}" style="${r.bs};position:relative;width:${w}px;height:${r.h}px;overflow:hidden;margin:0 0 80px 0">${r.html}</section>\n`;await p.close()}
fs.writeFileSync(outf,`<!doctype html><html lang="en"><head><meta charset="utf-8">${styles.map(s=>'<style>'+s+'</style>').join('\n')}<style>html,body{width:768px!important;margin:0;height:auto!important;overflow:visible!important}</style></head><body>${bodies}</body></html>`);console.log(outf,names.length);await b.close()})();
