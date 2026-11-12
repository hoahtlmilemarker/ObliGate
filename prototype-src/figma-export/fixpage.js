const pg=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(pg);
const top=n=>{let p=n;while(p.parent.type!=='PAGE')p=p.parent;return p};
let s=0;for(const node of pg.findAll(x=>'effects' in x&&x.effects.some(e=>e.type==='DROP_SHADOW'&&e.radius>=20))){const dk=top(node).name.startsWith('Dark');node.effects=node.effects.map(e=>{if(e.type!=='DROP_SHADOW'||e.radius<20)return e;const big=e.radius>=50;return Object.assign({},e,{offset:{x:0,y:big?14:8},radius:big?36:24,spread:big?-14:-14,color:Object.assign({},e.color,{a:dk?(big?0.5:0.45):(big?0.2:0.16)})})});s++}
pg.children.filter(n=>n.type==='TEXT'&&n.name.startsWith('Row label')).forEach(t=>{if(t.y>-200&&t.y%10===0||true){}});
const labels=pg.children.filter(n=>n.type==='TEXT'&&n.name.startsWith('Row label'));const fr=pg.children.filter(n=>n.type==='FRAME');
for(const t of labels){const row=fr.filter(f=>f.name.startsWith(t.name.includes('LIGHT')?'Light':'Dark'));const y0=Math.min(...row.map(f=>f.y));t.y=y0-230}
let d=0;for(const t of pg.findAll(n=>n.type==='TEXT'&&(n.characters==='Drag & drop documents here'||n.characters==='No documents in this folder yet'))){let c=t.parent;while(c&&c.parent&&!(c.width>=240&&c.height>=110))c=c.parent;if(!c||c.type==='PAGE')continue;const dk=top(c).name.startsWith('Dark');c.strokes=[{type:'SOLID',color:dk?{r:0.24,g:0.32,b:0.41}:{r:0.66,g:0.73,b:0.80}}];c.strokeWeight=1.5;c.strokeAlign='INSIDE';c.dashPattern=[6,5];if(!c.cornerRadius)c.cornerRadius=4;d++}
return {s,d,labels:labels.length};
