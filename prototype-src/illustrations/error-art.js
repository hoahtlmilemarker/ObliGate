(function(){
var B='#9FB6CC',LN='#C9D7E5',GD='#B08A4E',N='#005A9C',OR='#B4581C',P='var(--er-tint,#E7EFF7)',C='var(--card)';
var S=' stroke="'+B+'" stroke-width="1.3" stroke-linejoin="round"';
function ln(d,w){return '<path d="'+d+'" stroke="'+LN+'" stroke-width="'+(w||1.6)+'" stroke-linecap="round"/>';}
function badge(x,y,inner,c){return '<circle cx="'+x+'" cy="'+y+'" r="13.5" fill="'+C+'"/><circle cx="'+x+'" cy="'+y+'" r="11.5" fill="'+(c||N)+'"/>'+inner;}
function dots(a){return a.map(function(d){return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="'+d[2]+'" fill="'+(d[3]?GD:'#7FB8E6')+'"'+(d[3]?' opacity=".75"':'')+'/>';}).join('');}
function W(inner){return '<svg class="er-art" viewBox="0 0 120 96" fill="none" aria-hidden="true"><ellipse cx="60" cy="88" rx="40" ry="4.5" fill="currentColor" opacity=".08"/>'+inner+'</svg>';}
var A={
'404':'<rect x="28" y="20" width="46" height="58" rx="4" transform="rotate(-7 51 49)" fill="'+P+'"'+S+'/>'
 +'<path d="M38 14h30l10 10v54a3 3 0 0 1-3 3H38a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3Z" fill="'+C+'"'+S+'/><path d="M68 14v10h10"'+S+' fill="'+P+'"/>'
 +'<rect x="42" y="22" width="12" height="3.2" rx="1.2" fill="'+GD+'" opacity=".9"/>'+ln('M42 32h22M42 39h28M42 46h16')
 +'<circle cx="76" cy="58" r="15" fill="'+C+'" stroke="'+N+'" stroke-width="3"/><circle cx="76" cy="58" r="10.5" fill="'+P+'" opacity=".7"/>'
 +'<path d="m87 69 10 10" stroke="'+N+'" stroke-width="5" stroke-linecap="round"/><path d="m88.6 70.6 6.8 6.8" stroke="'+GD+'" stroke-width="2" stroke-linecap="round"/>'
 +'<path d="M72.2 54.6a3.9 3.9 0 1 1 5.6 3.5c-1 .5-1.8 1.2-1.8 2.4v.6" stroke="'+N+'" stroke-width="2" stroke-linecap="round"/><circle cx="76" cy="64.6" r="1.25" fill="'+N+'"/>'
 +dots([[22,30,2,1],[104,22,1.6],[16,70,1.4]]),
'403':'<path d="M20 30a3 3 0 0 1 3-3h18l5 6h37a3 3 0 0 1 3 3v40a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3Z" fill="'+P+'"'+S+'/>'
 +'<rect x="30" y="22" width="46" height="34" rx="2.5" fill="'+C+'"'+S+'/>'+ln('M36 30h20M36 36h30M36 42h24')
 +'<path d="M20 44a3 3 0 0 1 3-3h60a3 3 0 0 1 3 3v32a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3Z" fill="'+C+'"'+S+'/>'
 +'<rect x="28" y="50" width="22" height="5" rx="1.5" fill="'+GD+'" opacity=".85"/>'+ln('M28 63h40M28 70h28')
 +badge(88,64,'<rect x="82.5" y="63" width="11" height="8.5" rx="1.6" fill="#fff"/><path d="M84.8 63v-2.4a3.2 3.2 0 0 1 6.4 0V63" stroke="#fff" stroke-width="1.9"/><circle cx="88" cy="66.8" r="1.2" fill="'+N+'"/>')
 +dots([[16,22,2,1],[104,30,1.6],[106,82,1.4]]),
'500':(function(){var h='';[18,40,62].forEach(function(y,i){h+='<rect x="26" y="'+y+'" width="62" height="18" rx="3" fill="'+C+'"'+S+'/><rect x="26.65" y="'+(y+.65)+'" width="12" height="16.7" rx="2.4" fill="'+P+'"/><path d="M38.65 '+(y+.65)+'v16.7" stroke="'+B+'" stroke-width="1.3"/>'+ln('M45 '+(y+6)+'h14M45 '+(y+12)+'h10',1.5)+'<circle cx="66" cy="'+(y+9)+'" r="2" fill="'+(i===2?OR:i===1?GD:'#4CA77A')+'"/><circle cx="82" cy="'+(y+9)+'" r="2" fill="'+LN+'"/>';});return h;})()
 +'<path d="M32 21v12M32 43v12M32 65v12" stroke="'+B+'" stroke-width="1.2" stroke-dasharray="1.5 2.5" stroke-linecap="round"/>'
 +badge(90,72,'<path d="M90 66.5v6.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="90" cy="77.6" r="1.5" fill="#fff"/>',OR)
 +dots([[16,28,2,1],[104,22,1.6],[14,72,1.4]]),
'502':'<rect x="8" y="26" width="36" height="46" rx="3.5" fill="'+C+'"'+S+'/><path d="M8.65 29.5a2.9 2.9 0 0 1 2.9-2.9h29a2.9 2.9 0 0 1 2.9 2.9V34H8.65Z" fill="'+P+'"/><path d="M8 34h36"'+S+'/><circle cx="13.5" cy="30.3" r="1.2" fill="'+B+'"/><circle cx="17.5" cy="30.3" r="1.2" fill="'+B+'"/>'+ln('M14 42h20M14 48h24M14 54h14')
 +'<rect x="76" y="26" width="36" height="46" rx="3.5" fill="'+C+'"'+S+'/>'+'<path d="M76 41h36M76 56h36"'+S+'/>'+'<circle cx="105" cy="33.5" r="1.8" fill="#4CA77A"/><circle cx="105" cy="48.5" r="1.8" fill="'+GD+'"/><circle cx="105" cy="63.5" r="1.8" fill="'+LN+'"/>'+ln('M82 33.5h14M82 48.5h14M82 63.5h10',1.5)
 +'<path d="M44 49h8M68 49h8" stroke="'+B+'" stroke-width="1.6" stroke-linecap="round"/><path d="M52 45.5h4.5v7H52zM63.5 45.5H68v7h-4.5z" fill="'+C+'"'+S+'/>'
 +'<path d="M56.5 47.5h2M56.5 50.5h2M61.5 47.5h2" stroke="'+B+'" stroke-width="1.2" stroke-linecap="round"/>'
 +badge(60,74,'<path d="m56 70 8 8M64 70l-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',OR)
 +dots([[60,22,2,1],[18,82,1.4],[104,16,1.6]]),
'503':'<rect x="20" y="16" width="70" height="54" rx="4" fill="'+C+'"'+S+'/><path d="M20.65 20a3.4 3.4 0 0 1 3.4-3.4h62a3.4 3.4 0 0 1 3.4 3.4v7.4h-68.8Z" fill="'+P+'"/><path d="M20 28h70"'+S+'/><circle cx="26" cy="22" r="1.3" fill="'+B+'"/><circle cx="30.5" cy="22" r="1.3" fill="'+B+'"/><circle cx="35" cy="22" r="1.3" fill="'+B+'"/>'
 +'<rect x="28" y="35" width="24" height="16" rx="2" fill="'+P+'"'+S+'/>'+ln('M58 37h22M58 43h16M58 49h20')
 +'<g transform="rotate(-4 50 66)"><rect x="14" y="60" width="72" height="11" rx="2" fill="'+C+'" stroke="'+GD+'" stroke-width="1.3"/><path d="M20 71l9-11M32 71l9-11M44 71l9-11M56 71l9-11M68 71l9-11" stroke="'+GD+'" stroke-width="4" opacity=".55"/><path d="M22 71v10M78 71v10" stroke="'+B+'" stroke-width="1.6" stroke-linecap="round"/></g>'
 +badge(94,22,'<path d="M98.2 18.2a4.4 4.4 0 0 0-5.9 5.9l-4.6 4.6 2 2 4.6-4.6a4.4 4.4 0 0 0 5.9-5.9l-2.6 2.6-2.1-.5-.5-2.1z" fill="#fff"/>')
 +dots([[12,30,2,1],[106,58,1.6],[104,80,1.4]]),
'session':'<rect x="30" y="20" width="56" height="62" rx="5" fill="'+C+'"'+S+'/><path d="M30.65 25a4.4 4.4 0 0 1 4.4-4.4h45.9a4.4 4.4 0 0 1 4.4 4.4v6.4H30.65Z" fill="'+P+'"/><path d="M30 32h56"'+S+'/><rect x="50" y="14" width="16" height="10" rx="2.5" fill="'+C+'"'+S+'/><path d="M54 19h8" stroke="'+B+'" stroke-width="1.6" stroke-linecap="round"/>'
 +'<circle cx="46" cy="49" r="8.5" fill="'+P+'"'+S+'/><circle cx="46" cy="47" r="3.2" fill="'+C+'"'+S+'/><path d="M40.4 54.6a6.5 5 0 0 1 11.2 0"'+S+'/>'+ln('M60 44h18M60 50h12M60 56h16')+'<rect x="38" y="66" width="18" height="4" rx="1.5" fill="'+GD+'" opacity=".85"/>'+ln('M60 68h16')
 +badge(88,70,'<circle cx="88" cy="70" r="6.2" stroke="#fff" stroke-width="1.8"/><path d="M88 66.6V70l2.3 1.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>')
 +dots([[20,30,2,1],[102,26,1.6],[16,74,1.4]]),
'offline':'<path d="M33 66h52a15 15 0 0 0 2.3-29.8A22 22 0 0 0 45.6 31 17.5 17.5 0 0 0 33 66Z" fill="'+C+'"'+S+'/><path d="M38 59.5h44a9 9 0 0 0 1.4-17.9" stroke="'+P+'" stroke-width="5" stroke-linecap="round" opacity=".9"/>'
 +'<path d="M44 74.5a22 22 0 0 1 32 0" stroke="'+LN+'" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 3.5"/><path d="M50.5 80a12 12 0 0 1 19 0" stroke="'+LN+'" stroke-width="2" stroke-linecap="round"/><circle cx="60" cy="84" r="1.8" fill="'+B+'"/>'
 +ln('M46 46h16M46 52h24')
 +badge(90,34,'<path d="M84.5 31.5a8 8 0 0 1 11 0M86.8 34.4a4.6 4.6 0 0 1 6.4 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="90" cy="37.6" r="1.2" fill="#fff"/><path d="m84 28 12 12" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>',OR)
 +dots([[18,32,2,1],[106,62,1.6],[22,80,1.4]]),
'workspace':'<path d="M60 14V4" stroke="'+B+'" stroke-width="1.3" stroke-linecap="round"/><path d="M60 4.5h9l-2 2.5 2 2.5h-9Z" fill="'+GD+'" opacity=".9"/>'
 +'<path d="M20 34 60 14l40 20Z" fill="'+P+'"'+S+'/><path d="M33 31.2 60 18l27 13.2Z" fill="'+C+'" stroke="'+B+'" stroke-width="1" stroke-linejoin="round"/><circle cx="60" cy="26.5" r="3.4" fill="'+C+'" stroke="'+GD+'" stroke-width="1.5"/><circle cx="60" cy="26.5" r="1" fill="'+GD+'"/>'
 +'<rect x="18" y="34" width="84" height="4.5" rx=".8" fill="'+C+'"'+S+'/><rect x="21" y="38.5" width="78" height="4" fill="'+P+'"'+S+'/>'
 +(function(){var h='';[29,42,78,91].forEach(function(x){h+='<rect x="'+(x-5)+'" y="42.5" width="10" height="2.4" rx=".6" fill="'+C+'"'+S+'/><rect x="'+(x-3.2)+'" y="44.9" width="6.4" height="21.2" fill="'+C+'"'+S+'/><path d="M'+x+' 47v17" stroke="'+LN+'" stroke-width="1.1" stroke-linecap="round"/><rect x="'+(x-5)+'" y="66.1" width="10" height="2.4" rx=".6" fill="'+C+'"'+S+'/>';});return h;})()
 +'<path d="M51 68.5V55a9 9 0 0 1 18 0v13.5Z" fill="'+P+'"'+S+'/><path d="M60 46.5v8.5M60 60v8.5" stroke="'+B+'" stroke-width="1.1"/><circle cx="57.6" cy="62" r=".9" fill="'+B+'"/><circle cx="62.4" cy="62" r=".9" fill="'+B+'"/>'
 +'<rect x="16" y="68.5" width="88" height="4" rx=".8" fill="'+C+'"'+S+'/><rect x="12" y="72.5" width="96" height="4" rx=".8" fill="'+C+'"'+S+'/><rect x="8" y="76.5" width="104" height="4.5" rx=".8" fill="'+P+'"'+S+'/>'
 +badge(98,20,'<path d="M102.6 18a5.3 5.3 0 1 0 .3 4.4" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/><path d="M103.2 13.8v4.4h-4.4" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>')
 +dots([[14,24,2,1],[110,48,1.6],[10,58,1.4]])
};
window.ogErArt=function(k){return W(A[k]||A['404']);};
})();
