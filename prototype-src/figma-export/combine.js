// node combine.js <key> <outfile> [themeFilter]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [key,outf,tf]=process.argv.slice(2);const jobs=JSON.parse(fs.readFileSync('jobs.json')).filter(j=>j.key===key&&(!tf||j.theme===tf)&&fs.existsSync(j.out));
(async()=>{const b=await chromium.launch();const styles=[];const seen=new Set();let bodies='';const names=[];
for(const j of jobs){const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('file://'+path.resolve(j.out));await p.waitForTimeout(100);
 const r=await p.evaluate(()=>{const st=[...document.querySelectorAll('style')].map(s=>s.textContent);const h=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  const c=document.body.cloneNode(true);c.querySelectorAll('style,script').forEach(e=>e.remove());return {st,h,html:c.innerHTML,bs:document.body.getAttribute('style')||'',bc:document.body.className,hc:document.documentElement.className}});
 for(const s of r.st){if(/min-width:1440px!important/.test(s))continue;if(!seen.has(s)){seen.add(s);styles.push(s)}}
 const H=j.fixed?900:r.h;const nm=(j.theme==='dark'?'Dark':'Light')+' · '+j.name;names.push(nm);
 bodies+=`<section class="fig-state ${r.hc} ${r.bc}" data-name="${nm}" style="${r.bs};position:relative;width:1440px;height:${H}px;overflow:hidden;margin:0 0 80px 0">${r.html}</section>\n`;await p.close()}
const doc=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1440">${styles.map(s=>'<style>'+s+'</style>').join('\n')}<style>html,body{width:1440px!important;min-width:1440px!important;margin:0;height:auto!important;overflow:visible!important}</style></head><body>${bodies}</body></html>`;
fs.writeFileSync(outf,doc);fs.writeFileSync(outf+'.names.json',JSON.stringify(names));console.log(outf,names.length,(doc.length/1048576).toFixed(1)+'MB');await b.close()})();
