const PID="67:2";const NAMES=["Light \u00b7 Default", "Dark \u00b7 Default", "Light \u00b7 Loading \u00b7 first load", "Dark \u00b7 Loading \u00b7 first load"];
const pg=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(pg);
await figma.loadFontAsync({family:'Manrope',style:'Bold'});
pg.children.filter(n=>n.type==='TEXT'&&n.name.startsWith('Row label')).forEach(n=>n.remove());
const key=id=>id.split(':').map(Number);const fr=pg.children.filter(n=>n.type==='FRAME').sort((a,b)=>{const x=key(a.id),y=key(b.id);return x[0]-y[0]||x[1]-y[1]});
if(fr.length!==NAMES.length)return {error:'count',frames:fr.length,names:NAMES.length};
fr.forEach((f,i)=>f.name=NAMES[i]);
const L=fr.filter(f=>f.name.startsWith('Light')),D=fr.filter(f=>f.name.startsWith('Dark'));
let x=0;const lh=Math.max(...L.map(f=>f.height));L.forEach(f=>{f.x=x;f.y=0;x+=f.width+160});x=0;const dy=lh+360;D.forEach(f=>{f.x=x;f.y=dy;x+=f.width+160});
for(const [t,y] of [['LIGHT',-120],['DARK',dy-120]]){const tx=figma.createText();tx.name='Row label '+t;tx.fontName={family:'Manrope',style:'Bold'};tx.characters=t;tx.fontSize=56;tx.letterSpacing={unit:'PIXELS',value:8};tx.fills=[{type:'SOLID',color:{r:0.69,g:0.54,b:0.31}}];tx.x=0;tx.y=y}
let fixed=0;for(const f of fr.filter(f=>/Batch Actions/.test(f.name))){const t=f.findOne(n=>n.type==='TEXT'&&n.characters==='Send to Review Queue');if(!t)continue;let m=t;while(m&&m.parent&&m.parent!==f&&!(m.type==='FRAME'&&m.width>200&&m.height>150))m=m.parent;if(m&&m.parent!==f){const bx=m.absoluteBoundingBox,rb=f.absoluteBoundingBox;f.appendChild(m);if(f.layoutMode&&f.layoutMode!=='NONE')m.layoutPositioning='ABSOLUTE';m.x=bx.x-rb.x;m.y=bx.y-rb.y;fixed++}}
return {frames:fr.length,light:L.length,dark:D.length,fixed};