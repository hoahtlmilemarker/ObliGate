import re
T=open('og/project/15-team-management.dc.html').read()
def ill(n):
    s=open('ill/'+n+'.svg').read()
    return re.sub(r'<svg class="ill ill-(\w+)"',r'<svg class="cubes ill ill-\1" preserveAspectRatio="xMidYMid meet"',s,count=1)
P=[('22-cross-check-projects','Cross-Check','All disasters','Cross-Check','All active cross-check projects. Find what needs reconciling across every disaster, then open a project to work its flagged rows.','scan','<div class="xq" data-cxl><div class="tm-loading">Loading projects…</div></div>','All Disasters'),
   ('23-import','Import','Document Library · Import','Import','Bulk-import cost items, labor records, equipment records, or projects from a spreadsheet or CSV file.','up','<div class="xq" data-imp><div class="tm-loading">Loading…</div></div>','DR-4683-CA')]
for f,title,eb,h1,desc,il,body,dr in P:
    t=T
    t=re.sub(r'<title>.*?</title>','<title>'+title+'</title>',t,count=1)
    i=t.index('<div class="band-in">');j=t.index('</div>',i)
    t=t[:i]+'<div class="band-in">\n      <span class="lbl" style="color: var(--blue)">'+eb+'</span>\n      <h1 style="font-weight: 300; line-height: 1.08">'+h1+'</h1>\n      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: var(--gray); max-width: 640px">'+desc+'</p>\n      '+t[j:]
    t=re.sub(r'<svg class="cubes".*?</svg>(?=\s*<div class="band-in">)',lambda m:ill(il),t,count=1,flags=re.S)
    t=t.replace('<div class="st-c tm"><div class="tm-main" data-tm><div class="tm-loading">Loading team…</div></div></div>','<div class="st-c">'+body+'</div>',1)
    if dr!='DR-4683-CA': t=t.replace('<b>DR-4683-CA','<b>'+dr,1)
    open(f'og/project/{f}.dc.html','w').write(t)
    print(f, 'data-cxl' in t or 'data-imp' in t, 'ill-' in t)
