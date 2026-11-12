import math
T=(300.0,244.5);U=(99.6,57.5);V=(-71.7,41.4)
def P(a,b,z=0): return (T[0]+a*U[0]+b*V[0], T[1]+a*U[1]+b*V[1]-z)
def f(p): return f'{p[0]:.1f},{p[1]:.1f}'
def person(a,b,s,top,side_l,side_r,head,head_hi,ring=None):
    cx,cy=P(a,b); rx=11*s; ry=rx*.56; hb=20*s; rh=7.6*s
    o=f'<ellipse cx="{cx:.1f}" cy="{cy+2:.1f}" rx="{rx*1.35:.1f}" ry="{ry*1.35:.1f}" fill="#061A2E" fill-opacity=".35"/>'
    if ring: o+=f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx*1.7:.1f}" ry="{ry*1.7:.1f}" fill="none" stroke="{ring}" stroke-opacity=".75" stroke-width="1.2"/>'
    gid=f'pg{int(a*100)}{int(b*100)}'
    o+=f'<defs><linearGradient id="{gid}" x1="0" x2="1"><stop offset="0" stop-color="{side_l}"/><stop offset="1" stop-color="{side_r}"/></linearGradient><radialGradient id="{gid}h" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="{head_hi}"/><stop offset="1" stop-color="{head}"/></radialGradient></defs>'
    # body: rounded shoulders (cylinder with dome-ish top)
    o+=f'<path d="M{cx-rx:.1f} {cy:.1f} L{cx-rx:.1f} {cy-hb:.1f} A{rx:.1f} {ry:.1f} 0 0 1 {cx+rx:.1f} {cy-hb:.1f} L{cx+rx:.1f} {cy:.1f} A{rx:.1f} {ry:.1f} 0 0 1 {cx-rx:.1f} {cy:.1f}Z" fill="url(#{gid})"/>'
    o+=f'<ellipse cx="{cx:.1f}" cy="{cy-hb:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{top}"/>'
    hy=cy-hb-rh-2.2*s
    o+=f'<circle cx="{cx:.1f}" cy="{hy:.1f}" r="{rh:.1f}" fill="url(#{gid}h)"/>'
    return (cy,o),(cx,cy)
def build():
    s='<svg class="cubes" xmlns="http://www.w3.org/2000/svg" viewBox="210 188 225 179" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    s+='<defs><radialGradient id="tmgl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2F7CC0" stop-opacity=".24"/><stop offset="1" stop-color="#2F7CC0" stop-opacity="0"/></radialGradient></defs><ellipse cx="323" cy="278" rx="113" ry="89" fill="url(#tmgl)"/>'
    # base slab (same as settings illustration)
    s+='<polygon points="300.0,244.5 399.6,302.0 327.9,343.4 228.3,285.9" fill="#1A5689"/><polygon points="228.3,285.9 327.9,343.4 327.9,348.9 228.3,291.4" fill="#12436F"/><polygon points="399.6,302.0 327.9,343.4 327.9,348.9 399.6,307.5" fill="#0D3558"/><polyline points="228.3,291.4 228.3,285.9 300.0,244.5 399.6,302.0 399.6,307.5" fill="none" stroke="#2A5C8C" stroke-opacity=".4" stroke-width=".8"/>'
    # inner plate
    pts=[P(.12,.12),P(.88,.12),P(.88,.88),P(.12,.88)]
    s+='<polygon points="'+' '.join(f(p) for p in pts)+'" fill="#16507F" stroke="#3A78B0" stroke-opacity=".35" stroke-width=".8"/>'
    people=[ # a,b,scale,colors
     (.28,.28,1.3,'#7FA9D6','#3E6FA6','#21487A','#5E8FC8','#A9CBEF',None),
     (.74,.30,1.3,'#7FA9D6','#3E6FA6','#21487A','#5E8FC8','#A9CBEF',None),
     (.28,.72,1.3,'#7FA9D6','#3E6FA6','#21487A','#5E8FC8','#A9CBEF',None),
     (.62,.62,1.6,'#CFE6FB','#8CC0F1','#3F7FD9','#8CC0F1','#E4F1FD','#E2C27E')]
    lead=P(.62,.62)
    # links from leader to each member (dashed)
    for a,b,*_ in people[:3]:
        q=P(a,b);s+=f'<line x1="{lead[0]:.1f}" y1="{lead[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" stroke="#8CC0F1" stroke-opacity=".55" stroke-width="1.1" stroke-dasharray="2.5 3"/>'
        s+=f'<circle cx="{q[0]:.1f}" cy="{q[1]:.1f}" r="1.8" fill="#8CC0F1" fill-opacity=".8"/>'
    items=[person(*p)[0] for p in people]
    for _,o in sorted(items): s+=o
    # floating role badge (shield + check), brass
    bx,by=392,226
    s+=f'<g transform="translate({bx} {by}) scale(1.25)"><ellipse cx="0" cy="26" rx="12" ry="4" fill="#061A2E" fill-opacity=".35"/>'
    s+='<path d="M0 -15 L13 -10 V0 C13 9 7 15 0 18 C-7 15 -13 9 -13 0 V-10 Z" fill="#1D3E64" stroke="#E2C27E" stroke-width="1.4"/>'
    s+='<path d="M0 -11 L9.5 -7.3 V0 C9.5 6.6 5.2 11 0 13.4 C-5.2 11 -9.5 6.6 -9.5 0 V-7.3 Z" fill="#2E5784"/>'
    s+='<path d="M-4.6 0.6 L-1.2 4 L5 -2.6" fill="none" stroke="#E2C27E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>'
    # small key/plus badge left
    kx,ky=244,238
    s+=f'<g transform="translate({kx} {ky}) scale(1.15)"><ellipse cx="0" cy="20" rx="9" ry="3" fill="#061A2E" fill-opacity=".3"/><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#1D3E64" stroke="#8CC0F1" stroke-opacity=".8" stroke-width="1.2"/><path d="M0 -5V5M-5 0H5" stroke="#8CC0F1" stroke-width="2" stroke-linecap="round"/></g>'
    s+='</svg>'
    return s
open('ill/team.svg','w').write(build())
print(len(build()))
