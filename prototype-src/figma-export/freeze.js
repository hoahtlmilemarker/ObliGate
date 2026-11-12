const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();for(const f of process.argv.slice(2)){const w=/Mobile/.test(f)?390:768;const p=await b.newPage({viewport:{width:w,height:900}});
await p.goto('file://'+path.resolve(f));await p.waitForTimeout(300);
const n=await p.evaluate(()=>{let c=0;document.querySelectorAll('[hidden]').forEach(e=>e.remove());document.querySelectorAll('.hd .srch svg').forEach(v=>{v.style.cssText+=';width:16px!important;height:16px!important;display:block!important;flex:none!important'});
 document.querySelectorAll('.fv-crumb').forEach(a=>{const s=a.parentElement;if(s.dataset.fz)return;s.dataset.fz=1;[...s.childNodes].forEach(t=>{if(t.nodeType===3&&t.textContent.trim()){const sp=document.createElement('span');sp.textContent=t.textContent.trim();t.replaceWith(sp)}else if(t.nodeType===3)t.remove()});s.style.display='flex';s.style.flexWrap='wrap';s.style.alignItems='baseline';s.style.columnGap='6px';});
 const rows=[...document.querySelectorAll('.lb-tbl tr,.ux-t tr')].filter(tr=>getComputedStyle(tr).display!=='table-row'&&tr.offsetParent);
 const m=rows.map(tr=>{const r=tr.getBoundingClientRect();return {tr,r,tds:[...tr.children].filter(td=>getComputedStyle(td).display!=='none').map(td=>{const q=td.getBoundingClientRect();return {td,l:q.left-r.left,t:q.top-r.top,w:q.width,h:q.height}})}});
 for(const x of m){x.tr.style.cssText+=';display:block!important;position:relative!important;height:'+x.r.height+'px!important;box-sizing:border-box';for(const d of x.tds){d.td.style.cssText+=`;position:absolute!important;left:${d.l}px!important;top:${d.t}px!important;width:${d.w}px!important;height:${d.h}px!important;margin:0!important;box-sizing:border-box`;}c++}
 return c});
fs.writeFileSync(f,'<!doctype html>'+await p.evaluate(()=>document.documentElement.outerHTML));console.log(f,n);await p.close()}await b.close()})();
