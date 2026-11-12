<style>
.ogk{position:fixed;inset:0;z-index:999;display:none;align-items:flex-start;justify-content:center;padding:12vh 16px 16px;background:rgba(6,20,34,.55);backdrop-filter:blur(3px)}
.ogk.on{display:flex}
.ogk-box{width:min(640px,100%);background:#FFFFFF;border:1px solid #D5D9DC;border-top:2px solid #B08A4E;border-radius:4px;box-shadow:0 30px 60px -20px rgba(0,20,40,.45);font-family:Manrope,Arial,sans-serif;color:#24272B;overflow:hidden}
.ogk-in{display:flex;align-items:center;gap:12px;padding:0 18px;border-bottom:1px solid #E8ECEF}
.ogk-in svg{flex:none;color:#60666C}
.ogk-in input{flex:1;min-width:0;height:56px;border:0;outline:0;background:transparent;font:500 16px Manrope,Arial,sans-serif;color:#24272B}
.ogk-esc{font:700 11px Manrope,Arial,sans-serif;padding:3px 6px;border:1px solid #D5D9DC;border-bottom-width:2px;border-radius:4px;color:#60666C}
.ogk-list{max-height:min(420px,56vh);overflow-y:auto;padding:8px}
.ogk-grp{padding:10px 10px 6px;font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#60666C}
.ogk-it{display:flex;align-items:center;gap:12px;padding:10px;border-radius:4px;color:#24272B;text-decoration:none;cursor:pointer}
.ogk-it .ic{flex:none;width:30px;height:30px;display:grid;place-items:center;border-radius:4px;background:rgba(0,90,156,.08);color:#005A9C;font-size:9px;font-weight:800;letter-spacing:.06em}
.ogk-it .tx{display:flex;flex-direction:column;min-width:0;flex:1}
.ogk-it b{font-size:13.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ogk-it small{font-size:12px;color:#60666C;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ogk-it .go{flex:none;font-size:12px;color:#005A9C;opacity:0}
.ogk-it.sel{background:#F2F6FA;box-shadow:inset 2px 0 0 #005A9C}
.ogk-it.sel .go{opacity:1}
.ogk-empty{padding:28px 12px;text-align:center;font-size:13.5px;color:#60666C}
.ogk-ft{display:flex;gap:16px;padding:10px 18px;border-top:1px solid #E8ECEF;font-size:11.5px;color:#60666C;background:#F9FBFD}
.ogk-ft span b{font:700 10.5px Manrope,Arial,sans-serif;padding:2px 5px;margin-right:5px;border:1px solid #D5D9DC;border-radius:4px;color:#24272B;background:#fff}
.ogk mark{background:rgba(176,138,78,.22);color:inherit;border-radius:1px}
.ogk.dark .ogk-box{background:#13202C;border-color:#263443;color:#E6EBF0}
.ogk.dark .ogk-in,.ogk.dark .ogk-ft{border-color:#1B2834}
.ogk.dark .ogk-in input,.ogk.dark .ogk-it{color:#E6EBF0}
.ogk.dark .ogk-ft{background:#101B26}
.ogk.dark .ogk-it.sel{background:#1A2A3A;box-shadow:inset 2px 0 0 #5AA7E6}
.ogk.dark .ogk-it .ic{background:rgba(90,167,230,.14);color:#86C0EE}
.ogk.dark .ogk-it .go{color:#86C0EE}
.ogk.dark .ogk-ft span b{background:#13202C;color:#E6EBF0;border-color:#263443}
</style>
<div class="ogk" role="dialog" aria-modal="true" aria-label="Search">
 <div class="ogk-box">
  <div class="ogk-in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="text" placeholder="Search documents, projects, disasters..." aria-label="Search"><span class="ogk-esc">ESC</span></div>
  <div class="ogk-list"></div>
  <div class="ogk-ft"><span><b>↑↓</b>Navigate</span><span><b>Enter</b>Open</span><span><b>Esc</b>Close</span></div>
 </div>
</div>
<script>
(function(){
 var D=[
  ['Documents','PDF','Timesheet_Aguayo_PayPeriod_02.pdf','Force-Account Timesheet · Review Needed (76%)','04-document-review.html'],
  ['Documents','LOG','ActivityLog_PW00428_Jan12_Crew3.pdf','Daily Activity Log · Verified (99%)','04-document-review.html'],
  ['Documents','XLSX','eCAPS_Labor_Export_F7060865.xlsx','DeRS Baseline Export · Ingested (167 rows)','06-import-wizard.html'],
  ['Projects','PW','PW-00428 Malibu Canyon','Storm Drainage & Culvert Repair · 38 documents','02-project-detail.html'],
  ['Projects','PW','PW-00429 Topanga Creek Debris','24 documents','02-project-detail.html'],
  ['Disasters','DR','DR-4683-CA','California Severe Winter Storms, Flooding, Landslides & Mudslides','01-disaster-portfolio.html'],
  ['Disasters','DR','DR-4758-CA','February 2024 Atmospheric River & High Winds','01-disaster-portfolio.html'],
  ['Disasters','DR','DR-4699-CA','Northern California Severe Storms & Flooding','01-disaster-portfolio.html'],
  ['Disasters','DR','DR-4558-CA','Bobcat Fire Complex Recovery','01-disaster-portfolio.html'],
  ['Pages','→','Document Library','Force-Account Labor Evidence','03-document-library.html'],
  ['Pages','→','Labor Cross-Check','Aguayo, Hector · Pay Period 02','05-cross-check.html'],
  ['Pages','→','Pre-Submission Audit Readiness','PW-00428 · 86% Audit Ready','07-presubmission.html'],
  ['Pages','→','Supervisor Attestation Request','SIG-2026-PW428-09','08-supervisor-signature.html']
 ];
 var k=document.querySelector('.ogk'),inp=k.querySelector('input'),list=k.querySelector('.ogk-list'),sel=0,cur=[];
 function esc(t){return t.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
 function hl(t,q){t=esc(t);if(!q)return t;var i=t.toLowerCase().indexOf(q.toLowerCase());return i<0?t:t.slice(0,i)+'<mark>'+t.slice(i,i+q.length)+'</mark>'+t.slice(i+q.length);}
 function render(){var q=inp.value.trim();cur=D.filter(function(r){return !q||(r[2]+' '+r[3]).toLowerCase().indexOf(q.toLowerCase())>-1;});
  if(sel>=cur.length)sel=0;
  if(!cur.length){list.innerHTML='<div class="ogk-empty">No results for “'+esc(q)+'”</div>';return;}
  var h='',g='';cur.forEach(function(r,i){if(r[0]!==g){g=r[0];h+='<div class="ogk-grp">'+g+'</div>';}
   h+='<a class="ogk-it'+(i===sel?' sel':'')+'" href="'+r[4]+'" data-i="'+i+'"><span class="ic">'+r[1]+'</span><span class="tx"><b>'+hl(r[2],q)+'</b><small>'+hl(r[3],q)+'</small></span><span class="go">Open →</span></a>';});
  list.innerHTML=h;}
 function open(){var d=document.querySelector('.og[data-theme="dark"]');k.classList.toggle('dark',!!d);k.classList.add('on');inp.value='';sel=0;render();setTimeout(function(){inp.focus();},10);}
 function close(){k.classList.remove('on');}
 document.querySelectorAll('.srch').forEach(function(b){b.addEventListener('click',open);});
 k.addEventListener('mousedown',function(e){if(e.target===k)close();});
 inp.addEventListener('input',function(){sel=0;render();});
 list.addEventListener('mousemove',function(e){var a=e.target.closest('.ogk-it');if(a&&+a.dataset.i!==sel){sel=+a.dataset.i;render();}});
 document.addEventListener('keydown',function(e){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();k.classList.contains('on')?close():open();return;}
  if(!k.classList.contains('on'))return;
  if(e.key==='Escape'){close();}
  else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,cur.length-1);render();list.querySelector('.sel')&&list.querySelector('.sel').scrollIntoView({block:'nearest'});}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);render();list.querySelector('.sel')&&list.querySelector('.sel').scrollIntoView({block:'nearest'});}
  else if(e.key==='Enter'&&cur[sel]){location.href=cur[sel][4];}
 });
})();
</script>
<style>
@keyframes ogNew{0%{background:#FFF4DC}100%{background:var(--card)}}
@keyframes ogIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.tbl.dl tr.just td,.lb-tbl tr.just td{animation:ogNew 2.4s ease-out 1}
.tbl.dl tr.just td:first-child,.lb-tbl tr.just td:first-child{box-shadow:inset 3px 0 0 #B08A4E!important}
.tbl.dl tr.just,.lb-tbl tr.just{animation:ogIn .35s ease-out}
.new-pill{display:inline-flex;align-items:center;padding:1px 6px;border-radius:4px;background:#B08A4E;color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-right:8px;vertical-align:1px}
.st2-proc{color:var(--blue);background:var(--blue-t)}
.st2-proc i{animation:ogPulse 1s ease-in-out infinite}
@keyframes ogPulse{50%{opacity:.25}}
.og-toast{position:fixed;right:24px;bottom:24px;z-index:998;display:flex;align-items:center;gap:14px;max-width:min(460px,calc(100vw - 32px));padding:14px 16px 14px 18px;background:#06243F;color:#fff;border-top:2px solid #B08A4E;border-radius:4px;box-shadow:0 20px 40px -16px rgba(0,20,40,.5);font:500 13.5px Manrope,Arial,sans-serif;animation:ogIn .3s ease-out}
.og-toast svg{flex:none;color:#5CC08C}
.og-toast b{font-weight:700}
.og-toast button{flex:none;margin-left:auto;padding:7px 12px;border:1px solid rgba(255,255,255,.35);border-radius:4px;background:transparent;color:#fff;font:700 12.5px Manrope,Arial,sans-serif;cursor:pointer}
.og-toast button:hover{border-color:#fff}
.og-toast .x{border:0;padding:4px 6px;opacity:.6;margin-left:0}
</style>
<script>
(function(){var h=document.querySelector('.dz-host');if(!h)return;var n=0,tb=h.querySelector('.lb-tbl tbody, .tbl.dl tbody'),cnt=h.querySelector('.dl-count');
 var FOLDER='PW-00428 › 1. Force-Account Labor';
 function esc(t){return t.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function size(b){return b>1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';}
 function kind(name){var e=(name.split('.').pop()||'').toLowerCase();if(e==='pdf')return['PDF','#B4473A'];if(e==='xlsx'||e==='xls'||e==='csv')return['XLSX','#2F6FB0'];return[e.toUpperCase().slice(0,4)||'FILE','#60666C'];}
 function row(f){var k=kind(f.name);
  return '<tr class="just"><td class="lb-ck"><input type="checkbox" aria-label="Select document"></td>'+
  '<td><div class="lb-doc"><span class="lb-ft" style="--ft:'+k[1]+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg><b>'+k[0]+'</b></span>'+
  '<div class="lb-dt"><a href="#">'+esc(f.name)+'</a><span class="lb-meta"><span class="lb-kind"><span class="new-pill">New</span>Classifying…</span>Uploaded just now · '+size(f.size||0)+'</span></div></div></td>'+
  '<td class="lb-per"><span class="per-d">—</span></td><td><div class="lb-who"><div><span style="color:var(--gray);font-weight:500">Detecting…</span></div></div></td><td class="lb-val">—</td>'+
  '<td><span class="st2 st2-proc"><i></i>Extracting…</span></td><td class="lb-act"><span style="font-size:12px;color:var(--gray)">Processing</span></td></tr>';}
 function toast(c){var o=document.querySelector('.og-toast');if(o)o.remove();var t=document.createElement('div');t.className='og-toast';t.setAttribute('role','status');
  t.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.7"/></svg><span><b>'+c+' file'+(c>1?'s':'')+' uploaded</b> to '+FOLDER+'</span><button type="button" class="v">View</button><button type="button" class="x" aria-label="Dismiss">✕</button>';
  document.body.appendChild(t);t.querySelector('.v').onclick=function(){var r=tb.querySelector('tr.just');r&&r.scrollIntoView({behavior:'smooth',block:'center'});};
  t.querySelector('.x').onclick=function(){t.remove();};setTimeout(function(){t.remove();},7000);}
 window.ogAddFiles=function(f){add(f);};
 function add(files){files=Array.prototype.slice.call(files||[]);if(!files.length||!tb)return;
  tb.querySelectorAll('tr.just').forEach(function(r){r.classList.remove('just');});
  tb.insertAdjacentHTML('afterbegin',files.map(row).join(''));
  if(cnt){var m=cnt.textContent.match(/\d+/);if(m)cnt.textContent=(+m[0]+files.length)+' Documents';}var q=document.querySelector('.q-item[data-q=review] .cnt-chip');if(q){q.textContent=+q.textContent+files.length;q.classList.remove('cnt-bump');void q.offsetWidth;q.classList.add('cnt-bump');}
  var first=tb.querySelector('tr.just');first&&first.scrollIntoView({behavior:'smooth',block:'center'});
  toast(files.length);
  var rows=[].slice.call(tb.querySelectorAll('tr.just'));analyze(rows,files);}
 var AR='<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 function rules(name){var C=window.ogClassify&&window.ogClassify(name);
  if(C){var D={'No supervisor signature on timesheet':'FEMA requires a supervisor signature or attestation for force-account hours.','Field log is not signed':'FEMA requires the supervisor to sign daily field logs.','Payroll hours not yet matched to field logs':'Claimed hours must match daily activity logs before submission.','Procurement record not attached':'Contracts need the procurement record that shows how the vendor was chosen.'};
   return {kind:C.kind,meta:C.meta,f:C.f?[{sev:C.f.sev==='c'?'risk':'warn',st:C.f.st,t:C.f.t,r:C.f.r,d:D[C.f.t]||'',fix:C.f.fix,href:C.f.href}]:[]};}
  var e=(name.split('.').pop()||'').toLowerCase();
  if(/timesheet/i.test(name))return {kind:'Force-Account Timesheet',f:[{sev:'risk',t:'No supervisor signature',r:'PAPPG v4.0 Ch. 2 § II.B',d:'FEMA requires a supervisor signature or attestation for force-account hours.',fix:'Request Attestation',href:'08-supervisor-signature.html'}]};
  if(['jpg','jpeg','png','heic','tif','tiff'].indexOf(e)>-1)return {kind:'Site photo',f:[]};
  if(['xlsx','xls','csv'].indexOf(e)>-1)return {kind:'Payroll export',f:[{sev:'warn',t:'Hours not yet matched to field logs',r:'PAPPG v4.0 Ch. 2 § II.B.1',d:'Claimed hours must match daily activity logs before submission.',fix:'Open Cross-Check',href:'05-cross-check.html'}]};
  return {kind:'Supporting document',f:[{sev:'warn',t:'Low-confidence read',r:'Data review',d:'Some values were hard to read. Confirm them before they are used in the claim.',fix:'Review',href:'04-document-review.html'}]};}
 var last=[];
 function findingsDlg(list){if(!window.ogDialog)return;var n=0;list.forEach(function(x){n+=x.f.length;});
  var body=list.map(function(x){return '<div class="fd-file"><div class="fd-fh"><b>'+esc(x.name)+'</b><span>'+x.kind+'</span></div>'+(x.f.length?x.f.map(function(f){return '<div class="fd-f"><span class="fd-sev '+f.sev+'">'+(f.sev==='risk'?'Critical':'Review')+'</span><div class="fd-ft"><b>'+f.t+'</b><small>'+f.d+' · '+f.r+'</small></div><a class="btn btn-o btn-sm" href="'+f.href+'">'+f.fix+AR+'</a></div>';}).join(''):'<div class="fd-ok">No issues found against FEMA rules</div>')+'</div>';}).join('');
  window.ogDialog({eyebrow:'AI check · FEMA Public Assistance rules',title:n?(n+' finding'+(n>1?'s':'')+' in '+list.length+' file'+(list.length>1?'s':'')):'No findings',ok:'Done',noCancel:1,body:'<div class="fd">'+body+'</div>'});}
 window.ogFindingsDlg=findingsDlg;
 function analyze(rows,files){var res=[];
  rows.forEach(function(r,k){var f=files[k]||{name:''};var R=rules(f.name);var x={name:f.name,kind:R.kind,f:R.f};res.push(x);
   var s=r.querySelector('.st2'),kd=r.querySelector('.lb-kind'),act=r.lastElementChild;
   s.className='st2 st2-proc';s.innerHTML='<i></i>Reading…';
   setTimeout(function(){kd.innerHTML='<span class="new-pill">New</span>'+R.kind;s.innerHTML='<i></i>Checking FEMA rules…';act.innerHTML='<span style="font-size:12px;color:var(--gray)">AI checking</span>';},1200+k*250);
   setTimeout(function(){var M=R.meta,wb=r.querySelector('.lb-who'),pc=r.querySelector('.lb-per'),vc=r.querySelector('.lb-val');
    if(M){if(pc)pc.innerHTML='<span class="per-d">'+M[0]+'</span><span class="per-y">'+M[1]+'</span>';if(wb)wb.innerHTML='<span class="ini">'+M[4]+'</span><div><span title="'+M[2]+'">'+M[2]+'</span><small title="'+M[3]+'">'+M[3]+'</small></div>';if(vc)vc.textContent=M[5];}
    else{var who=r.querySelector('.lb-who span');if(who&&/Detecting/.test(who.textContent))who.textContent='Not detected';if(pc)pc.innerHTML='<span class="per-d lb-na">No date found</span>';}
    if(!R.f.length){s.className='st2 st2-good';s.innerHTML='<i></i>Verified · no findings';act.innerHTML='<a class="lb-btn" href="04-document-review.html">View'+AR+'</a>';}
    else{var z0=R.f[0],risk=z0.sev==='risk';s.className='st2 '+(risk?'st2-risk':'st2-warn');s.innerHTML='<i></i>'+(z0.st||(risk?'Critical finding':'Needs review'));s.title=z0.t;
     act.innerHTML='<a class="lb-btn lb-btn-p'+(risk?'':' lb-btn-r')+'" href="'+z0.href+'" title="'+z0.t+'">'+z0.fix.replace(/ in Cross-Check$/,'')+AR+'</a>';}
    try{dispatchEvent(new Event('resize'));}catch(_){}
    if(k===rows.length-1){if(window.ogTabCounts)window.ogTabCounts();last=res;var n=0;res.forEach(function(z){n+=z.f.length;});
     var o=document.querySelector('.og-toast');if(o)o.remove();var t=document.createElement('div');t.className='og-toast';t.setAttribute('role','status');
     t.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.7"/></svg><span><b>'+res.length+' file'+(res.length>1?'s':'')+' checked against FEMA rules</b> · '+(n?n+' finding'+(n>1?'s':''):'no findings')+'</span>'+(n?'<button type="button" class="v">View Findings</button>':'')+'<button type="button" class="x" aria-label="Dismiss">✕</button>';
     document.body.appendChild(t);var v=t.querySelector('.v');if(v)v.onclick=function(){t.remove();findingsDlg(res);};t.querySelector('.x').onclick=function(){t.remove();};setTimeout(function(){if(t.parentNode)t.remove();},12000);}
   },3000+k*450);});}
 h.querySelectorAll('.lb-tab').forEach(function(t){t.addEventListener('click',function(){h.querySelectorAll('.lb-tab').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false');});t.classList.add('on');t.setAttribute('aria-selected','true');});});
 function has(e){return e.dataTransfer&&Array.prototype.indexOf.call(e.dataTransfer.types||[],'Files')>-1;}
 document.addEventListener('dragenter',function(e){if(!has(e))return;n++;h.classList.add('dragging');});
 document.addEventListener('dragleave',function(e){if(!has(e))return;n=Math.max(0,n-1);if(!n)h.classList.remove('dragging');});
 document.addEventListener('dragover',function(e){if(has(e))e.preventDefault();});
 document.addEventListener('drop',function(e){if(!has(e))return;e.preventDefault();n=0;h.classList.remove('dragging');if(e.target.closest&&e.target.closest('.upm'))return;if(window.ogUploadModal)window.ogUploadModal(e.dataTransfer.files);else add(e.dataTransfer.files);});
 document.querySelectorAll('.dz-host input[type=file], .dz-side input[type=file]').forEach(function(i){i.addEventListener('change',function(){if(window.ogUploadModal)window.ogUploadModal(i.files);else add(i.files);i.value='';});});
})();
</script>
<script>
(function(){function go(id){var r=document.getElementById(id);if(!r)return;if(window.ogGotoRow)window.ogGotoRow(id);r.scrollIntoView({behavior:'smooth',block:'center'});r.classList.remove('focus');void r.offsetWidth;r.classList.add('focus');}
document.querySelectorAll('[data-goto-row]').forEach(function(a){if(!document.getElementById(a.dataset.gotoRow))return;a.addEventListener('click',function(e){e.preventDefault();go(a.dataset.gotoRow);});});
if(location.hash&&location.hash.length>1)setTimeout(function(){go(location.hash.slice(1));},300);})();
</script>
<script>
/* pagination + search filter + status tabs */
(function(){var tb=document.querySelector('.lb-tbl tbody');if(!tb)return;var nav=document.querySelector('.lb-pg'),cur=1,per=10,q='',tab='all';
var inp=document.getElementById('df'),cols=document.querySelectorAll('.lb-tbl thead th').length||7;
function all(){return [].slice.call(tb.querySelectorAll('tr:not(.lb-nores)'));}
function txt(tr){return (tr.textContent||'').replace(/\s+/g,' ').toLowerCase();}
function st(tr){var s=tr.querySelector('.st2');return s?s.textContent.toLowerCase():'';}
function cat(tr){var s=st(tr);return /review needed|queued for review/.test(s)?'review':/missing signature|extracting/.test(s)?'action':/verified/.test(s)?'verified':/ingested/.test(s)?'ingested':'';}
function key(t){if(t.dataset.tab)return t.dataset.tab;var l=t.textContent.toLowerCase();return /review/.test(l)?'review':/action/.test(l)?'action':/verified/.test(l)?'verified':/ingested/.test(l)?'ingested':'all';}
function ok(tr){if(q&&txt(tr).indexOf(q)<0)return false;
 if(tab!=='all')return cat(tr)===tab;return true;}
function counts(){if(tb.querySelector('tr.sk-row'))return;var A=all(),c={all:A.length,review:0,action:0,verified:0,ingested:0};A.forEach(function(tr){var k=cat(tr);if(k)c[k]++;});
 document.querySelectorAll('.lb-tab').forEach(function(t){var sp=t.querySelector('span'),k=key(t);if(sp&&k in c)sp.textContent=c[k];});}
window.ogTabCounts=counts;
/* select-all bar: page -> whole folder */
var bar=null,selMode='';
function cb(tr){return tr.querySelector('.lb-ck input');}
function pageRows(){return rows().filter(function(tr){return tr.style.display!=='none';});}
function hdr(){return document.querySelector('.lb-tbl thead .lb-ck input');}
function docs(n){return n+' document'+(n===1?'':'s');}
function mkbar(){if(bar)return bar;var w=document.querySelector('.lb-wrap');if(!w)return null;bar=document.createElement('div');bar.className='lb-selbar';bar.setAttribute('role','status');bar.hidden=true;w.parentNode.insertBefore(bar,w);
 bar.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.sa==='all'){rows().forEach(function(tr){var c=cb(tr);if(c)c.checked=true;});selMode='folder';paint();}else clearSel();if(window.ogBatchSync)window.ogBatchSync();});return bar;}
function paint(){mkbar();if(!bar)return;if(!selMode){bar.hidden=true;bar.innerHTML='';return;}var r=rows(),pr=pageRows(),filt=q||tab!=='all';
 if(selMode==='page'&&r.length>pr.length)bar.innerHTML='All '+docs(pr.length)+' on this page are selected. <button type="button" data-sa="all">Select all '+r.length+(filt?' matching documents':' in this folder')+'</button>';
 else bar.innerHTML='All '+docs(r.length)+(filt?' matching this view':' in this folder')+(r.length===1?' is':' are')+' selected. <button type="button" data-sa="clear">Clear selection</button>';
 bar.hidden=false;}
function clearSel(){tb.querySelectorAll('.lb-ck input').forEach(function(c){c.checked=false;});var h=hdr();if(h){h.checked=false;h.indeterminate=false;}selMode='';paint();}
function syncHdr(){var h=hdr();if(!h)return;var pr=pageRows(),n=pr.filter(function(tr){var c=cb(tr);return c&&c.checked;}).length;h.checked=pr.length>0&&n===pr.length;h.indeterminate=n>0&&n<pr.length;}
function allChecked(){var r=rows();return r.length>0&&r.every(function(tr){var c=cb(tr);return c&&c.checked;});}
document.addEventListener('change',function(e){var t=e.target;if(!t.matches||!t.matches('.lb-tbl input[type=checkbox]'))return;
 if(t.closest('thead')){if(t.checked){selMode='page';setTimeout(paint,0);}else{clearSel();}return;}
 if(!t.checked&&selMode){selMode='';paint();}setTimeout(syncHdr,0);});
window.ogLibClearSel=clearSel;
function rows(){return all().filter(ok);}
function nores(n){var r=tb.querySelector('.lb-nores');if(n){if(r)r.remove();return;}
 if(!r){r=document.createElement('tr');r.className='lb-nores';tb.appendChild(r);}
 r.innerHTML='<td colspan="'+cols+'"><div class="nores"><svg class="nores-ico" width="44" height="44" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M26.5 6H12a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26.5 6 35 14.5V23" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 16h8M15 21.5h11M15 27h6" stroke="currentColor" stroke-opacity=".32" stroke-width="2.2" stroke-linecap="round"/><circle cx="35" cy="35" r="9.5" fill="var(--card,#FFFFFF)" stroke="currentColor" stroke-opacity=".32" stroke-width="2.4"/><circle cx="34" cy="34" r="3.6" stroke="currentColor" stroke-width="2.2"/><path d="m36.7 36.7 2.6 2.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><b><span>No documents match</span>'+(q?'<q>'+q.replace(/</g,'&lt;')+'</q>':' this tab')+'</b><span>Try a file name, document type or employee.</span>'+(q?'<button type="button" class="btn btn-o btn-sm nores-x">Clear search</button>':'')+'</div></td>';
 var x=r.querySelector('.nores-x');if(x)x.onclick=function(){if(inp){inp.value='';inp.dispatchEvent(new Event('input'));inp.focus();}q='';show(1);};}
function show(p){var A=all(),r=rows(),pages=Math.max(1,Math.ceil(r.length/per));cur=Math.min(Math.max(1,p),pages);
 A.forEach(function(tr){tr.style.display='none';});r.forEach(function(tr,i){tr.style.display=(Math.floor(i/per)+1===cur)?'table-row':'none';});
 nores(r.length);
 if(nav){nav.style.display=r.length?'':'none';nav.querySelectorAll('.pg-n').forEach(function(b){var on=+b.dataset.pg===cur;b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');b.style.display=+b.dataset.pg<=pages?'':'none';});
 nav.querySelector('.pg-prev').disabled=cur===1;nav.querySelector('.pg-next').disabled=cur===pages;
 var a=(cur-1)*per+1,b=Math.min(cur*per,r.length);var sh=document.querySelector('.lb-showing');
 var filt=q||tab!=='all';if(sh&&!r.length){sh.innerHTML='<b>0</b> matching documents';}else if(sh)sh.innerHTML='Showing <b>'+a+'–'+b+'</b> of <b class="lb-total">'+(filt?r.length:(document.querySelector('.dl-count')?(document.querySelector('.dl-count').textContent.match(/\d+/)||[A.length])[0]:A.length))+'</b> '+(filt?'matching ':'')+'documents';}
 if(q)hl();else unhl();
 counts();if(selMode&&!(selMode==='folder'&&allChecked()))selMode='';paint();syncHdr();}
function unhl(){tb.querySelectorAll('mark.qh').forEach(function(m){m.replaceWith(document.createTextNode(m.textContent));});tb.normalize&&tb.normalize();}
function hl(){unhl();var re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');
 tb.querySelectorAll('.lb-dt > a, .lb-kind, .lb-who > div > span, .lb-who small').forEach(function(el){if(el.children.length)return;var t=el.textContent;if(!re.test(t))return;re.lastIndex=0;el.innerHTML=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(re,'<mark class="qh">$1</mark>');});}
if(nav)nav.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.pg)show(+b.dataset.pg);else if(b.classList.contains('pg-prev'))show(cur-1);else if(b.classList.contains('pg-next'))show(cur+1);var t=document.querySelector('.lb-head');t&&t.scrollIntoView({behavior:'smooth',block:'start'});});
if(inp){var tm,wrap=inp.closest('.lb-srch'),cx=document.createElement('button');cx.type='button';cx.className='srch-x';cx.setAttribute('aria-label','Clear search');cx.innerHTML='<svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><path d="M1.5 1.5l5 5m0-5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if(wrap)wrap.appendChild(cx);function sv(){if(wrap)wrap.classList.toggle('has-v',!!inp.value);}cx.addEventListener('click',function(){inp.value='';q='';sv();show(1);inp.focus();});inp.addEventListener('input',sv);inp.setAttribute('type','search');inp.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){q=inp.value.trim().toLowerCase();show(1);},120);});
 inp.addEventListener('keydown',function(e){if(e.key==='Escape'){inp.value='';q='';sv();show(1);}});}
document.querySelectorAll('.lb-tab').forEach(function(t){t.addEventListener('click',function(){tab=key(t);show(1);});});
window.ogLibRefresh=function(){show(cur);};
new MutationObserver(function(m){if(m.some(function(x){return [].some.call(x.addedNodes,function(n){return n.nodeType===1&&!n.classList.contains('lb-nores');});}))show(1);}).observe(tb,{childList:true});
window.ogGotoRow=function(id){q='';tab='all';if(inp)inp.value='';document.querySelectorAll('.lb-tab').forEach(function(x,i){x.classList.toggle('on',i===0);x.setAttribute('aria-selected',i===0?'true':'false');});var r=rows(),i=r.indexOf(document.getElementById(id));if(i>=0)show(Math.floor(i/per)+1);};
show(1);})();
</script>
<style>
.og mark.qh{background:rgba(201,164,92,.32);color:inherit;border-radius:2px;padding:0 1px}
.og .lb-nores td{padding:0!important;border:0!important}
.og .nores{display:flex;flex-direction:column;align-items:center;gap:6px;padding:48px 16px;text-align:center;color:var(--gray);font-size:13px}
.og .nores .nores-ico{color:var(--blue);margin-bottom:6px}
.og .nores b{display:flex;max-width:min(520px,90%);gap:6px;justify-content:center}
.og .nores b>span{flex:none;white-space:nowrap}
.og .nores q{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.og .nores b{font-size:15px;color:var(--head)}
.og .nores .btn{margin-top:8px}
.og #df::-webkit-search-cancel-button,.og #df::-webkit-search-decoration{-webkit-appearance:none;appearance:none;display:none}
.og .lb-srch .inp{padding-right:34px!important}
.og .srch-x{position:absolute;right:9px;top:50%;transform:translateY(-50%);display:none;place-items:center;width:18px;height:18px;padding:0;border:0;border-radius:50%;background:var(--gray);color:var(--card);opacity:.55;cursor:pointer;transition:opacity .15s}
.og .srch-x:hover{opacity:.9}
.og .lb-srch.has-v .srch-x{display:grid}
.og .lb-srch .srch-x svg{position:static;transform:none;color:inherit}
</style>
<script>
/* tree accordion fallback (browsers without <details name>) */
document.addEventListener('toggle',function(e){var d=e.target;if(!d||d.tagName!=='DETAILS'||!d.open)return;var n=d.getAttribute('name');if(!n||!d.parentNode)return;
  Array.prototype.forEach.call(d.parentNode.children,function(s){if(s!==d&&s.tagName==='DETAILS'&&s.getAttribute('name')===n&&s.open)s.open=false;});},true);
</script>
<script>
/* batch actions menu */
(function(){var b=document.querySelector('.lb-batch[aria-controls="bmenu"]'),m=document.getElementById('bmenu');if(!b||!m)return;
function selRows(){return [].slice.call(document.querySelectorAll('.lb-tbl tbody .lb-ck input:checked')).map(function(c){return c.closest('tr');});}
function sel(){return selRows().length;}
function stt(tr){var x=tr.querySelector('.st2');return x?x.textContent.toLowerCase():'';}
var RULE={review:function(s){return !/verified|ingested/.test(s);},sign:function(s){return /missing signature/.test(s);}};
function applies(i){var r=selRows(),f=RULE[i.dataset.act];return f?r.filter(function(tr){return f(stt(tr));}):r;}
function base(i){var sp=i.querySelector('span');if(!i.dataset.label)i.dataset.label=sp.textContent.trim();return i.dataset.label;}
function sync(){var n=sel();m.querySelector('.bm-n').textContent=n;m.classList.toggle('has',n>0);m.querySelectorAll('.bm-i').forEach(function(i){var b=base(i),c=n?applies(i).length:0;i.querySelector('span').textContent=n?b+' ('+c+')':b;i.disabled=c===0;});}
window.ogBatchSync=sync;
function open(o){m.hidden=!o;b.setAttribute('aria-expanded',o?'true':'false');if(o)sync();}
b.addEventListener('click',function(e){e.stopPropagation();open(m.hidden);});
document.addEventListener('click',function(e){if(!m.hidden&&!m.contains(e.target))open(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')open(false);});
document.addEventListener('change',function(e){var t=e.target;if(!t.matches||!t.matches('.lb-tbl input[type=checkbox]'))return;
 if(t.closest('thead')){document.querySelectorAll('.lb-tbl tbody tr:not([hidden]) .lb-ck input').forEach(function(c){if(c.offsetParent)c.checked=t.checked;});}
 setTimeout(sync,0);});
function docs(n){return n+' document'+(n===1?'':'s');}
function note(h){if(window.ogToast2){window.ogToast2(h);return;}var o=document.querySelector('.og-toast');if(o)o.remove();var t=document.createElement('div');t.className='og-toast';t.setAttribute('role','status');t.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.7"/></svg><span>'+h+'</span><button type="button" class="x" aria-label="Dismiss">✕</button>';document.body.appendChild(t);t.querySelector('.x').onclick=function(){t.remove();};setTimeout(function(){t.remove();},4500);}
function del(rs){var n=rs.length;rs.forEach(function(tr){tr.remove();});
 var dl=document.querySelector('.dl-count');if(dl){var k=dl.textContent.match(/\d+/);if(k)dl.textContent=Math.max(0,+k[0]-n)+' Documents';}
 var h1=document.querySelector('.band h1');if(h1)h1.textContent=h1.textContent.replace(/\((\d+) Documents\)/,function(_,x){return '('+Math.max(0,+x-n)+' Documents)';});
 if(window.ogLibClearSel)window.ogLibClearSel();if(window.ogLibRefresh)window.ogLibRefresh();sync();
 note('<b>'+docs(n)+' deleted</b> · recorded in audit log');}
m.addEventListener('click',function(e){var i=e.target.closest('.bm-i');if(!i||i.disabled)return;open(false);
 var rs=applies(i),n=rs.length,lab=base(i);
 if(i.dataset.act==='delete'){var where=window.ogDest||'PW-00428 › Force-Account Labor';
  var go=function(){del(rs);};
  if(window.ogDialog)window.ogDialog({danger:1,eyebrow:'Delete documents',title:'Delete '+docs(n)+'?',ok:'Delete',body:'<p>They will be removed from '+where+' and from the FEMA package. This can\'t be undone. The deletion is recorded in the audit log.</p>',onOk:go});
  else if(confirm('Delete '+docs(n)+'?'))go();
  return;}
 note('<b>'+lab+'</b> · '+docs(n));});
})();
</script>

<style>
.og .fd{display:flex;flex-direction:column;gap:12px;max-height:min(60vh,520px);overflow:auto}
.og .fd-file{border:1px solid var(--line);border-radius:4px}
.og .fd-fh{display:flex;justify-content:space-between;gap:12px;padding:10px 12px;background:var(--pale);border-bottom:1px solid var(--line-soft);font-size:13px}
.og .fd-fh b{color:var(--head);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.og .fd-fh span{flex:none;color:var(--gray);font-size:12px}
.og .fd-f{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:6px 14px;padding:12px}
.og .dlg-b:has(.fd){width:min(640px,calc(100vw - 32px))!important;max-width:none!important}
.og .fd-ft{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;text-transform:none;letter-spacing:0}
.og .fd-ft b{font-size:14px;color:var(--head)}
.og .fd-ft small{font-size:12.5px;color:var(--gray);line-height:1.5}
.og .fd-sev{flex:none;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:4px 8px;border-radius:4px}
.og .fd-sev.risk{background:var(--risk-t);color:var(--risk)}.og .fd-sev.warn{background:var(--warn-t);color:var(--warn)}
.og .fd-ok{padding:12px;font-size:13px;color:var(--good);font-weight:600}
@media (max-width:560px){.og .fd-f{grid-template-columns:minmax(0,1fr)}.og .fd-sev{justify-self:start}.og .fd-f .btn{justify-self:start}}
</style>
