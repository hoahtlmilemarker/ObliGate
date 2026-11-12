import re, sys, os, glob
src = sys.argv[1]; out = sys.argv[2]
PREFETCH = """<script>
(function(){
  var done={};
  function pf(h){if(!h||done[h]||h.indexOf('.html')<0||h.indexOf('://')>-1)return;done[h]=1;
    var l=document.createElement('link');l.rel='prefetch';l.href=h;document.head.appendChild(l);}
  function on(e){var a=e.target.closest&&e.target.closest('a[href]');if(a)pf(a.getAttribute('href'));}
  document.addEventListener('mouseover',on,{passive:true});
  document.addEventListener('touchstart',on,{passive:true});
  document.addEventListener('focusin',on);
  var idle=window.requestIdleCallback||function(cb){setTimeout(cb,1200);};
  idle(function(){document.querySelectorAll('.mainnav a[href],.hd a[href]').forEach(function(a){pf(a.getAttribute('href'));});});
})();
</script>"""
SEARCH = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"search.js")).read()
LOADER = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"loader.html")).read()
PRECONNECT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
JS = """<script>
(function(){function u(){var h=document.querySelector('.hd');if(!h)return;document.querySelectorAll('.og').forEach(function(o){o.style.setProperty('--hd-h',h.offsetHeight+'px');});}u();window.addEventListener('resize',u);})();
</script>
<script>
(function(){
  function cur(){var t=null;try{t=localStorage.getItem('og-theme');}catch(e){}
    if(t!=='light'&&t!=='dark'){var r=document.documentElement.getAttribute('data-theme');
      t=(r==='dark'||r==='light')?r:'light';}
    return t;}
  function apply(t){document.querySelectorAll('.og').forEach(function(el){el.setAttribute('data-theme',t);});
    document.body.style.background=(t==='dark')?'#0E151D':'#FFFFFF';
    document.querySelectorAll('.og-theme-label').forEach(function(el){el.textContent=(t==='dark')?'Light':'Dark';});
    document.querySelectorAll('[data-og-toggle]').forEach(function(el){el.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' theme');});}
  window.ogToggle=function(){var n=cur()==='dark'?'light':'dark';try{localStorage.setItem('og-theme',n);}catch(e){}apply(n);};
  apply(cur());
  window.addEventListener('storage',function(e){if(e.key==='og-theme')apply(cur());});
})();
</script>"""
for f in sorted(glob.glob(os.path.join(src,'[012][0-9]*.dc.html'))):
    s = open(f).read()
    title = re.search(r'<title>(.*?)</title>', s).group(1)
    helmet = re.search(r'<helmet>(.*?)</helmet>', s, re.S).group(1).strip()
    body = re.search(r'<x-dc>.*?</helmet>(.*)</x-dc>', s, re.S).group(1).strip()
    body = body.replace('data-theme="{{theme}}"', 'data-theme="light"')
    body = body.replace('onClick="{{toggleTheme}}"', 'onclick="ogToggle()" data-og-toggle')
    body = body.replace('{{nextTheme}}', 'dark').replace('{{themeLabel}}', '<span class="og-theme-label">Dark</span>')
    body = body.replace('/_blob/8cfa11a04b8e7f1a0a8159c51c90be37', 'obligate-wordmark.svg')
    body = re.sub(r'href="([0-9A-Za-z-]+)\.dc\.html(#[\w-]*)?"', r'href="\1.html\2"', body)
    body = re.sub(r'<form action="#"', '<form action="#" onsubmit="event.preventDefault()"', body)
    for _i,_k in enumerate(['active','closeout','appeals','archived']):
        body = body.replace('class="{{c_'+_k+'}}"', 'class="side side-on"' if _i==0 else 'class="side"').replace('aria-pressed="{{p_'+_k+'}}"', 'aria-pressed="'+('true' if _i==0 else 'false')+'"').replace(' onClick="{{pick_'+_k+'}}"', '')
    body = body.replace('{{lcMeta}}', 'Showing 4 active declarations')
    for _a,_b in [('{{n_active}}','4'),('{{n_closeout}}','2'),('{{n_appeals}}','1'),('{{n_archived}}','18'),('{{tblClass}}','tbl dtbl lc-active'),('{{lc4558}}','active'),('{{dlgClass}}','ad'),('{{toastClass}}','ad-tst'),('{{toastText}}','')]:
        body = body.replace(_a,_b)
    body = re.sub(r' onClick="\{\{(openArch|cancelArch|confirmArch|restore)\}\}"', '', body)
    body = re.sub(r'<button class="\{\{umBd\}\}".*?<span class="umd-end" hidden="hidden"></span></div>', '', body, flags=re.S)
    body = re.sub(r'<button class="av" type="button" aria-haspopup="menu" aria-expanded="\{\{umExp\}\}" aria-label="[^"]*" title="([^"]*)" onClick="\{\{toggleUm\}\}">([^<]+)</button>', r'<span class="av" title="\1">\2</span>', body)
    assert '{{' not in body, (f, re.findall(r'\{\{.*?\}\}', body)[:5])
    # speed: drop the hidden hero photo (it is display:none on pages using the logo cubes)
    for _k in ('helmet','body'):
        _v = locals()[_k] if False else (helmet if _k=='helmet' else body)
        if '.hero-photo{display:none!important}' in helmet+body:
            _v = re.sub(r'url\("data:image/[a-z]+;base64,[A-Za-z0-9+/=]+"\)', 'none', _v)
        _v = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1)+re.sub(r'\s*\n\s*', '', m.group(2))+m.group(3), _v, flags=re.S)
        if _k=='helmet': helmet=_v
        else: body=_v
    name = os.path.basename(f).replace('.dc.html', '.html')
    remember = "<script>try{sessionStorage.setItem('og-page','"+name+"');}catch(e){}</script>"
    restore = "<script>document.documentElement.lang='en';try{var _p=sessionStorage.getItem('og-page');if(_p&&_p!=='09-auth-signin.html'&&location.hash!=='#signin'){location.replace(_p);}}catch(e){}</script>"
    inner = f"<title>{title}</title>\n<link rel=\"icon\" type=\"image/svg+xml\" href=\"favicon.svg\">\n{restore}\n{PRECONNECT}\n{helmet}\n<style>body{{background:#FFFFFF}}</style>\n{LOADER}\n{body}\n{JS}\n{PREFETCH}\n"
    if name == '09-auth-signin.html':
        open(os.path.join(out, name), 'w').write(inner)
    else:
        doc = f'<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>{title}</title>\n<link rel="icon" type="image/svg+xml" href="favicon.svg">\n{remember}\n{PRECONNECT}\n{helmet}\n<style>body{{margin:0;background:#FFFFFF}}img{{max-width:100%}}</style>\n</head>\n<body>\n{LOADER}\n{body}\n{JS}\n{PREFETCH}\n{SEARCH if 'class="btn btn-ghost srch"' in body else ''}\n</body>\n</html>\n'
        open(os.path.join(out, name), 'w').write(doc)
    print(name, len(open(os.path.join(out, name)).read()))
