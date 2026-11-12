const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const pages=['01-disaster-portfolio','02-project-detail','03-document-library','03b-document-library-empty','03c-unplaced-inbox','04-document-review','05-cross-check','06-import-wizard','07-presubmission','08-supervisor-signature','10-my-profile','11-notification-settings','09-auth-signin'];
(async()=>{const b=await chromium.launch();const res={};
for(const pg of pages){const p=await b.newPage({viewport:{width:1440,height:900}});p.on('dialog',d=>d.dismiss().catch(()=>{}));await p.addInitScript(()=>{try{sessionStorage.setItem('og-ld','1')}catch(e){}});
 const url='file://'+path.resolve('../site/'+pg+'.html');await p.goto(url);await p.waitForTimeout(700);
 const cands=await p.evaluate(()=>{const out=[];document.querySelectorAll('.og button, .og a[href="#"], .og a:not([href]), .og [role=button]').forEach((e,i)=>{if(!e.offsetWidth)return;if(e.closest('.hd,.sb-rail nav'))return;const t=(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,40);if(!t||/theme/i.test(t))return;e.setAttribute('data-cand',i);out.push([i,t])});return out});
 const found={};
 for(const [i,t] of cands.slice(0,45)){try{await p.goto(url)}catch(e){continue};await p.waitForTimeout(450);
  const ok=await p.evaluate(i=>{const all=[...document.querySelectorAll('.og button, .og a[href="#"], .og a:not([href]), .og [role=button]')];const e=all[i];if(!e)return false;e.click();return true},i);if(!ok)continue;await p.waitForTimeout(450);
  const st=await p.evaluate(()=>({dlg:!!document.querySelector('.dlg'),toast:!!document.querySelector('.og-toast'),imx:!!document.querySelector('.imx:not([hidden])'),upm:!![...document.querySelectorAll('.upm')].find(e=>e.offsetWidth),imd:!![...document.querySelectorAll('.imd')].find(e=>e.offsetWidth),menu:!![...document.querySelectorAll('[role=menu]')].find(e=>e.offsetWidth)}));
  for(const k in st)if(st[k]&&!found[k])found[k]={i,t}}
 res[pg]={found,n:cands.length};console.log(pg,JSON.stringify(found));await p.close()}
fs.writeFileSync('discover.json',JSON.stringify(res,null,1));await b.close()})();
