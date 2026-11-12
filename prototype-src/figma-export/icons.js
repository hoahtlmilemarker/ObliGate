const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const pages=['01-disaster-portfolio','02-project-detail','03-document-library','03b-document-library-empty','03c-unplaced-inbox','04-document-review','05-cross-check','06-import-wizard','07-presubmission','08-supervisor-signature','09-auth-signin','10-my-profile','11-notification-settings'];
(async()=>{const b=await chromium.launch();const map={};
for(const pg of pages){for(const act of [null,'account','batch','upload']){if(act&&pg!=='03-document-library')continue;const p=await b.newPage({viewport:{width:1440,height:900}});await p.addInitScript(()=>{try{sessionStorage.setItem('og-ld','1')}catch(e){}});await p.goto('file://'+path.resolve('../site/'+pg+'.html'));await p.waitForTimeout(700);
 if(act){try{await require('./act/'+act+'.js')(p)}catch(e){} await p.waitForTimeout(500)}
 const r=await p.evaluate(()=>{const out=[];document.querySelectorAll('svg').forEach(s=>{const bb=s.getBoundingClientRect();const w=parseFloat(s.getAttribute('width'))||bb.width;if(!(w>=10&&w<=26))return;if(s.closest('.cubes,.globe'))return;const c=s.cloneNode(true);['class','style','aria-hidden','focusable','role'].forEach(a=>c.removeAttribute(a));c.setAttribute('width','24');c.setAttribute('height','24');let key=c.outerHTML.replace(/\s+/g,' ');
 let lbl='';let e=s.parentElement;for(let i=0;i<3&&e&&!lbl;i++){lbl=(e.getAttribute('aria-label')||e.getAttribute('title')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,40);e=e.parentElement}
 out.push({key,lbl,vb:s.getAttribute('viewBox')})});return out});
 r.forEach(o=>{if(!map[o.key])map[o.key]={svg:o.key,labels:new Set(),pages:new Set(),vb:o.vb};map[o.key].labels.add(o.lbl);map[o.key].pages.add(pg)});await p.close()}}
const arr=Object.values(map).map(o=>({svg:o.svg,vb:o.vb,labels:[...o.labels].slice(0,4),pages:[...o.pages].length}));
fs.writeFileSync('icons.json',JSON.stringify(arr,null,1));console.log(arr.length);arr.forEach((o,i)=>console.log(i,o.vb,o.pages,JSON.stringify(o.labels).slice(0,110)));await b.close()})();
