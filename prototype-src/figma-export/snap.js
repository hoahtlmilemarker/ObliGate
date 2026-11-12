// usage: node snap.js <page> <out> [actionsJsFile] [--fixed]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [pg,out,act,mode]=process.argv.slice(2);
const RAW=fs.readFileSync(path.join(__dirname,'../site/obligate-wordmark.svg'),'utf8');const SVG='data:image/svg+xml;base64,'+Buffer.from(RAW).toString('base64');const SVGW='data:image/svg+xml;base64,'+Buffer.from(RAW.replace(/fill="#[0-9A-Fa-f]{3,6}"/g,'fill="#FFFFFF"').replace(/fill:#[0-9A-Fa-f]{3,6}/g,'fill:#FFFFFF')).toString('base64');
(async()=>{const b=await chromium.launch();const W=+process.env.W||1440;let H=+process.env.H||900;
async function load(h){const p=await b.newPage({viewport:{width:W,height:h}});p.on('dialog',d=>d.dismiss().catch(()=>{}));await p.addInitScript(()=>{window.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a){const h=a.getAttribute('href')||'';if(h.indexOf('.html')>-1||h.indexOf('#signin')>-1)e.preventDefault()}},false)});
 await p.addInitScript((k)=>{try{if(!k)sessionStorage.setItem('og-ld','1');sessionStorage.removeItem('og-leaf');sessionStorage.removeItem('og-doc')}catch(e){}},!!process.env.KEEPLD);
 await p.goto('file://'+path.resolve(__dirname,'../site/'+pg+'.html'));if(process.env.FONTS){await p.addStyleTag({content:fs.readFileSync(path.join(__dirname,'fonts_all.css'),'utf8')});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250)}await p.waitForTimeout(process.env.KEEPLD?250:900);return p}
let p=await load(H);
if(mode!=='--fixed'){const extra=await p.evaluate(()=>{let m=0;document.querySelectorAll('*').forEach(e=>{const cs=getComputedStyle(e);if((cs.overflowY==='auto'||cs.overflowY==='scroll')&&e.scrollHeight>e.clientHeight+2&&e.clientWidth>innerWidth*0.4)m=Math.max(m,e.scrollHeight-e.clientHeight)});return m});
 if(extra>0){await p.close();H=H+extra;p=await load(H)}}
if(process.env.THEME==='dark'){await p.locator('[aria-label*="theme" i]:visible').first().click();await p.waitForTimeout(350)}
if(act){const fn=require(path.resolve(act));await fn(p);if(!p.__nowait)await p.waitForTimeout(700)}
await p.evaluate(()=>{const els=new Set();document.getAnimations().forEach(a=>{try{const t=a.effect.getComputedTiming();if(t.iterations===Infinity){a.pause()}else{a.finish()}}catch(e){}if(a.effect&&a.effect.target&&a.effect.target.nodeType===1)els.add(a.effect.target)});
 els.forEach(e=>{const cs=getComputedStyle(e);e.style.setProperty('opacity',cs.opacity,'important');if(cs.transform&&cs.transform!=='none'&&!/matrix\(1, 0, 0, 1, 0, 0\)/.test(cs.transform))e.style.setProperty('transform',cs.transform,'important');else e.style.setProperty('transform','none','important')});});
await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});await p.waitForTimeout(150);
await p.evaluate(()=>{document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(cs.position==='sticky'){e.style.setProperty('position','relative','important');e.style.setProperty('top','auto','important');if(cs.overflowY!=='visible'){e.style.setProperty('overflow','visible','important');e.style.setProperty('max-height','none','important')}}});
 document.querySelectorAll('svg').forEach(sv=>{if(getComputedStyle(sv).position==='absolute'&&sv.getBoundingClientRect().width<=48&&sv.parentElement&&sv.nextElementSibling){sv.parentElement.appendChild(sv)}});});

const html=await p.evaluate(([svgA,svgB,__FIX__])=>{const svg=[svgA,svgB];
 // flatten media queries for the current viewport (text-level, keeps original declarations)
 function flatText(css){let out='',i=0;while(true){const j=css.indexOf('@media',i);if(j<0){out+=css.slice(i);break}out+=css.slice(i,j);const b=css.indexOf('{',j);const cond=css.slice(j+6,b).trim();let d=1,k=b+1;while(k<css.length&&d>0){const c=css[k];if(c==='{')d++;else if(c==='}')d--;k++}const inner=css.slice(b+1,k-1);let ok=false;try{ok=matchMedia(cond).matches}catch(e){}if(ok)out+=flatText(inner);i=k}return out}
 document.querySelectorAll('style').forEach(st=>{st.textContent=flatText(st.textContent)});
 const kill=[];document.querySelectorAll('body *:not(style):not(link):not(meta):not(template)').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||(parseFloat(cs.opacity)===0&&!e.closest('svg')))kill.push(e)});kill.forEach(e=>e.remove());
 document.querySelectorAll('[aria-hidden=true]').forEach(e=>{if(e.classList.contains('dz-ov'))e.remove()});
 const VH=innerHeight, FIX=__FIX__, DH=Math.max(document.documentElement.scrollHeight,innerHeight);
 document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(/drop-shadow/.test(cs.filter)){const r=e.getBoundingClientRect();if(r.width<=40&&r.height<=40)e.style.setProperty('filter','none','important')}});
 // bake text colours (converter mis-resolves inherited var() colours)
 document.querySelectorAll('body *').forEach(e=>{if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())){e.style.setProperty('color',getComputedStyle(e).color)}});
 // checkboxes/radios drawn by the converter without their check: replace with explicit markup
 document.querySelectorAll('input[type=checkbox],input[type=radio]').forEach(i=>{if(!i.offsetWidth)return;const cs=getComputedStyle(i);const sp=document.createElement('span');['width','height','margin','border-radius','vertical-align','flex','align-self','position','top','left'].forEach(k=>sp.style.setProperty(k,cs.getPropertyValue(k)));sp.style.display='inline-flex';sp.style.alignItems='center';sp.style.justifyContent='center';sp.style.boxSizing='border-box';
  const on=i.checked;const bg=on?(cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:cs.accentColor):cs.backgroundColor;sp.style.background=bg;sp.style.border=on&&cs.backgroundColor!=='rgba(0, 0, 0, 0)'?'0':cs.border;if(on)sp.innerHTML='<svg width="70%" height="70%" viewBox="0 0 16 16"><path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';i.replaceWith(sp)});
 const ogRoot=document.querySelector('.og')||document.body;if(getComputedStyle(ogRoot).position==='static')ogRoot.style.position='relative';const ogR=ogRoot.getBoundingClientRect();
 const fixedEls=[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed');
 const rects=fixedEls.map(e=>e.getBoundingClientRect());
 fixedEls.forEach((e,i)=>{if(e.parentElement!==ogRoot&&!fixedEls.some(o=>o!==e&&o.contains(e))&&ogRoot.contains(e))ogRoot.appendChild(e);});
 fixedEls.forEach((e,i)=>{const r={left:rects[i].left-ogR.left,top:rects[i].top-ogR.top,width:rects[i].width,height:rects[i].height};['inset','right','bottom','transform','translate'].forEach(k=>e.style.removeProperty(k));e.style.setProperty('position','absolute','important');e.style.setProperty('left',r.left+'px','important');e.style.setProperty('top',r.top+'px','important');e.style.setProperty('right','auto','important');e.style.setProperty('bottom','auto','important');e.style.setProperty('box-sizing','border-box','important');e.style.setProperty('max-width','none','important');e.style.setProperty('max-height','none','important');e.style.setProperty('width',r.width+'px','important');e.style.setProperty('height',r.height+'px','important');e.style.setProperty('transform','none','important');e.style.setProperty('margin','0','important')});
 const rv=t=>t.replace(/(-?\d*\.?\d+)[dsl]?vh\b/g,(m,n)=>(parseFloat(n)*VH/100)+'px');
 document.querySelectorAll('style').forEach(st=>{st.textContent=rv(st.textContent)});
 document.querySelectorAll('[style]').forEach(e=>{const v=e.getAttribute('style');if(/vh\b/.test(v))e.setAttribute('style',rv(v))});
 const st=document.createElement('style');st.textContent='html,body{width:'+innerWidth+'px!important;min-width:'+innerWidth+'px!important;margin:0}body{position:relative!important}'+(FIX?'html,body{height:'+VH+'px!important;overflow:hidden!important}':'html,body{height:'+DH+'px!important}');document.head.appendChild(st);document.querySelectorAll('script,link[rel=preconnect],link[rel=prefetch],noscript').forEach(e=>e.remove());
 
 document.querySelectorAll('img').forEach(i=>{if(/obligate-wordmark/.test(i.getAttribute('src')||'')){const inv=/invert/.test(getComputedStyle(i).filter);i.setAttribute('src',inv?svg[1]:svg[0]);if(inv)i.style.filter='none'}});
 document.querySelectorAll('input').forEach(i=>{i.setAttribute('value',i.value);if(i.checked)i.setAttribute('checked','')});
 return '<!doctype html>'+document.documentElement.outerHTML},[SVG,SVGW,mode==='--fixed']);
fs.writeFileSync(out,html.replace('<head>','<head><meta name="viewport" content="width='+W+'">'));console.log(out,W,H,(html.length/1024|0)+'KB');await b.close()})();
