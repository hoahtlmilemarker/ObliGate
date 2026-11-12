const pg=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(pg);let n=0;
for(const node of pg.findAll(x=>'effects' in x&&x.effects.some(e=>e.type==='DROP_SHADOW'&&e.radius>=20))){
 const dark=(()=>{let p=node;while(p&&p.parent&&p.parent.type!=='PAGE')p=p.parent;return p&&p.name&&p.name.startsWith('Dark')})();
 node.effects=node.effects.map(e=>{if(e.type!=='DROP_SHADOW'||e.radius<20)return e;const a=e.color.a;return Object.assign({},e,{offset:{x:0,y:Math.round(e.offset.y*0.5)},radius:Math.round(e.radius*0.62),spread:Math.round(e.spread*0.65),color:Object.assign({},e.color,{a:Math.min(dark?0.45:0.2,a*(dark?0.65:0.45))})})});n++}
return n;
