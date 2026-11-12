# Isometric document-stack illustration with 3 variants: up (upload), scan (analyzing), ok (report)
def rh(cx,cy,w,h):  # rhombus points centered
    return f"{cx},{cy-h} {cx+w},{cy} {cx},{cy+h} {cx-w},{cy}"
def sheet(cx,cy,w,h,t,fill,edge1,edge2,stroke):
    # top face + two side faces (thickness t)
    top=rh(cx,cy,w,h)
    left=f"{cx-w},{cy} {cx},{cy+h} {cx},{cy+h+t} {cx-w},{cy+t}"
    right=f"{cx},{cy+h} {cx+w},{cy} {cx+w},{cy+t} {cx},{cy+h+t}"
    return f'<polygon points="{left}" fill="{edge1}"/><polygon points="{right}" fill="{edge2}"/><polygon points="{top}" fill="{fill}" stroke="{stroke}" stroke-width=".8"/>'
def lines(cx,cy,w,h,n,start=.18,col='#9CC7EC',op=.55):
    # text lines running along the left->top edge direction, placed across the sheet
    out=''
    for i in range(n):
        f=start+i*(0.62/(n-1))
        # point along left-bottom edge from left vertex towards bottom vertex
        x0=cx-w+ (w)*f; y0=cy+h*f
        L=0.55 if i%3==2 else 0.78
        x1=x0+w*L; y1=y0-h*L
        out+=f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{col}" stroke-opacity="{op}" stroke-width="2.2" stroke-linecap="round"/>'
    return out
def build(v):
    cx,W,H,T=170,96,52,5
    s=f'<svg class="ill ill-{v}" xmlns="http://www.w3.org/2000/svg" viewBox="40 6 260 236" aria-hidden="true">'
    s+='''<defs>
<radialGradient id="ilGlow{v}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3B8FD6" stop-opacity=".45"/><stop offset="1" stop-color="#3B8FD6" stop-opacity="0"/></radialGradient>
<linearGradient id="ilTop{v}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F8FC"/><stop offset="1" stop-color="#C9DCEE"/></linearGradient>
<linearGradient id="ilMid{v}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2C6BA6"/><stop offset="1" stop-color="#174A7A"/></linearGradient>
<linearGradient id="ilBrass{v}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7C98B"/><stop offset="1" stop-color="#A97F3E"/></linearGradient>
<linearGradient id="ilBeam{v}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD0FF" stop-opacity="0"/><stop offset=".5" stop-color="#7FD0FF" stop-opacity=".75"/><stop offset="1" stop-color="#7FD0FF" stop-opacity="0"/></linearGradient>
</defs>'''.replace('{v}',v)
    # glow + base tray
    s+=f'<ellipse cx="{cx}" cy="188" rx="128" ry="44" fill="url(#ilGlow{v})"/>'
    s+=sheet(cx,176,W+18,H+10,9,'#0E3A63','#0A2C4D','#082440','#2E6CA5')
    s+=f'<polygon points="{rh(cx,176,W+6,H+4)}" fill="none" stroke="#B08A4E" stroke-opacity=".55" stroke-width="1" stroke-dasharray="3 4"/>'
    # stack of sheets
    ys=[160,146,132]
    fills=[f'url(#ilMid{v})','#3A7DBA',f'url(#ilMid{v})']
    for i,y in enumerate(ys):
        s+=sheet(cx,y,W,H,T,fills[i],'#123F69','#0D3357','#4F8FCB')
        s+=lines(cx,y,W,H,4,col='#BFDDF7',op=.28)
    # top sheet (paper)
    ty=86 if v=='up' else 116
    if v=='up':
        s+=f'<g class="il-float">'
    else:
        s+='<g>'
    s+=sheet(cx,ty,W,H,T,f'url(#ilTop{v})','#9DB9D3','#86A6C4','#FFFFFF')
    s+=lines(cx,ty,W,H,6,col='#1F5D97',op=.5)
    # brass corner tab
    s+=f'<polygon points="{cx+W-30},{ty-16} {cx+W-12},{ty-6} {cx+W-30},{ty+4} {cx+W-48},{ty-6}" fill="url(#ilBrass{v})" opacity=".95"/>'
    s+='</g>'
    if v=='up':
        # motion trails from the stack to the rising sheet
        for (dx,dy) in [(-W,0),(W,0),(0,H)]:
            s+=f'<line x1="{cx+dx}" y1="{132+dy}" x2="{cx+dx}" y2="{ty+dy+T+2}" stroke="#9CC7EC" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="2 4"/>'
        ax,ay=cx+82,32
        s+=f'<defs><radialGradient id="ilBadge" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#F6E3B4"/><stop offset=".55" stop-color="#D2AA62"/><stop offset="1" stop-color="#9A7136"/></radialGradient><filter id="ilSh" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter></defs>'
        s+=f'<g class="il-arrow">'
        s+=f'<circle class="il-ring" cx="{ax}" cy="{ay}" r="22" fill="none" stroke="#E7C98B" stroke-width="1.2"/>'
        s+=f'<circle cx="{ax}" cy="{ay+3}" r="18" fill="#000" opacity=".35" filter="url(#ilSh)"/>'
        s+=f'<circle cx="{ax}" cy="{ay}" r="18" fill="url(#ilBadge)"/>'
        s+=f'<circle cx="{ax}" cy="{ay}" r="17.3" fill="none" stroke="#FFF4D6" stroke-opacity=".55" stroke-width=".8"/>'
        s+=f'<path d="M{ax} {ay+6}V{ay-7}M{ax-5.5} {ay-1.5}l5.5-5.5 5.5 5.5" fill="none" stroke="#0B2E50" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
        s+=f'<path d="M{ax-6} {ay+9.5}h12" stroke="#0B2E50" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>'
        s+='</g>'
        for (x,y,r) in [(92,70,2.2),(250,96,1.8),(212,22,1.4),(120,30,1.6),(270,60,1.4),(80,120,1.2),(150,18,1.2)]:
            s+=f'<circle class="il-dot" cx="{x}" cy="{y}" r="{r}" fill="#9CC7EC"/>'
    if v=='scan':
        s+=f'<g class="il-beam"><rect x="{cx-W-8}" y="{ty-H-6}" width="{2*W+16}" height="16" fill="url(#ilBeam{v})"/><line x1="{cx-W-8}" y1="{ty-H+2}" x2="{cx+W+8}" y2="{ty-H+2}" stroke="#BFEAFF" stroke-width="1.4" stroke-opacity=".9"/></g>'
        s+=f'<g transform="translate({cx-74} 30)"><rect width="58" height="22" rx="4" fill="#0B2E50" stroke="#2E6CA5"/><circle cx="12" cy="11" r="3.4" fill="#7FD0FF" class="il-dot"/><path d="M21 8h28M21 14h20" stroke="#9CC7EC" stroke-width="2" stroke-linecap="round"/></g>'
    if v=='ok':
        sx,sy=cx+34,ty-58
        s+=f'<circle cx="{sx}" cy="{sy}" r="24" fill="#0B2E50" stroke="url(#ilBrass{v})" stroke-width="2"/><circle cx="{sx}" cy="{sy}" r="18" fill="none" stroke="#E7C98B" stroke-opacity=".45" stroke-dasharray="2 3"/><path d="M{sx-8} {sy}l5.5 5.5L{sx+9} {sy-6}" fill="none" stroke="#F4E2BC" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
        s+=f'<path d="M{sx} {sy+24}V{ty-26}" stroke="#E7C98B" stroke-opacity=".6" stroke-width="1.2" stroke-dasharray="2 4"/>'
    s+='</svg>'
    return s
css='''.og .band .ill{position:absolute;z-index:1;pointer-events:none;right:clamp(28px,6vw,110px);top:6px;height:calc(100% - 64px);max-height:250px;width:auto;max-width:30%}
.og .col > .band .ill{height:calc(100% - 90px)}
.og .ill .il-float{animation:ilF 4.5s ease-in-out infinite}
.og .ill .il-arrow{animation:ilF 4.5s ease-in-out infinite .2s}
.og .ill .il-dot{animation:ilD 3s ease-in-out infinite}
.og .ill .il-dot:nth-child(odd){animation-delay:1.2s}
.og .ill .il-beam{animation:ilS 2.6s ease-in-out infinite}
@keyframes ilF{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ilD{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes ilS{0%{transform:translateY(0)}50%{transform:translateY(56px)}100%{transform:translateY(0)}}
@media (max-width:960px){.og .band .ill{opacity:.35;right:-30px}}
@media (max-width:640px){.og .band .ill{display:none}}
@media (prefers-reduced-motion:reduce){.og .ill *{animation:none!important}}
'''
open('css.txt','w').write(css)
for v in ['up','scan','ok']:
    open(v+'.svg','w').write(build(v))
ST='<svg style="width:100%;height:100%" '
html='<html><body style="margin:0;background:radial-gradient(120% 160% at 85% 0%,#0B3358 0%,#06243F 60%);display:flex;gap:30px;padding:30px">'+''.join('<div style="width:330px;height:300px">'+build(v).replace('<svg ',ST)+'</div>' for v in ['up','scan','ok'])+'</body></html>'
open('prev.html','w').write(html)
