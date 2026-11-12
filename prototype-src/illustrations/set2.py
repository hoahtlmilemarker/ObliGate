import importlib.util,sys
sp=importlib.util.spec_from_file_location('tm','ill/team.py');
T=(300.0,244.5);U=(99.6,57.5);V=(-71.7,41.4)
def P(a,b,z=0): return (T[0]+a*U[0]+b*V[0], T[1]+a*U[1]+b*V[1]-z)
def f(p): return f'{p[0]:.1f},{p[1]:.1f}'
HEAD='<svg class="cubes" xmlns="http://www.w3.org/2000/svg" viewBox="210 188 225 179" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
BASE='<defs><radialGradient id="{g}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2F7CC0" stop-opacity=".24"/><stop offset="1" stop-color="#2F7CC0" stop-opacity="0"/></radialGradient></defs><ellipse cx="323" cy="278" rx="113" ry="89" fill="url(#{g})"/><polygon points="300.0,244.5 399.6,302.0 327.9,343.4 228.3,285.9" fill="#1A5689"/><polygon points="228.3,285.9 327.9,343.4 327.9,348.9 228.3,291.4" fill="#12436F"/><polygon points="399.6,302.0 327.9,343.4 327.9,348.9 399.6,307.5" fill="#0D3558"/><polyline points="228.3,291.4 228.3,285.9 300.0,244.5 399.6,302.0 399.6,307.5" fill="none" stroke="#2A5C8C" stroke-opacity=".4" stroke-width=".8"/>'
def plate(a0,b0,a1,b1,z,t,top,l,r,stroke='#3A78B0'):
    A=P(a0,b0,z);B=P(a1,b0,z);C=P(a1,b1,z);D=P(a0,b1,z)
    o=f'<polygon points="{f(D)} {f(C)} {f((C[0],C[1]+t))} {f((D[0],D[1]+t))}" fill="{l}"/>'
    o+=f'<polygon points="{f(B)} {f(C)} {f((C[0],C[1]+t))} {f((B[0],B[1]+t))}" fill="{r}"/>'
    o+=f'<polygon points="{f(A)} {f(B)} {f(C)} {f(D)}" fill="{top}" stroke="{stroke}" stroke-opacity=".5" stroke-width=".8"/>'
    return o
def onplate(a0,b0,a1,b1,z,inner):
    # map unit square (x along a, y along b) to plate top via matrix
    A=P(a0,b0,z);ua=((U[0])*(a1-a0),(U[1])*(a1-a0));vb=(V[0]*(b1-b0),V[1]*(b1-b0))
    return f'<g transform="matrix({ua[0]:.3f} {ua[1]:.3f} {vb[0]:.3f} {vb[1]:.3f} {A[0]:.1f} {A[1]:.1f})">{inner}</g>'
def badge(x,y,inner,stroke='#8CC0F1',sc=1.15):
    return f'<g transform="translate({x} {y}) scale({sc})"><ellipse cx="0" cy="20" rx="9" ry="3" fill="#061A2E" fill-opacity=".3"/><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#1D3E64" stroke="{stroke}" stroke-opacity=".85" stroke-width="1.2"/>{inner}</g>'
def shield(x,y,sc=1.25,inner='<path d="M-4.6 0.6 L-1.2 4 L5 -2.6" fill="none" stroke="#E2C27E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'):
    return f'<g transform="translate({x} {y}) scale({sc})"><ellipse cx="0" cy="26" rx="12" ry="4" fill="#061A2E" fill-opacity=".35"/><path d="M0 -15 L13 -10 V0 C13 9 7 15 0 18 C-7 15 -13 9 -13 0 V-10 Z" fill="#1D3E64" stroke="#E2C27E" stroke-width="1.4"/><path d="M0 -11 L9.5 -7.3 V0 C9.5 6.6 5.2 11 0 13.4 C-5.2 11 -9.5 6.6 -9.5 0 V-7.3 Z" fill="#2E5784"/>{inner}</g>'
PERSON_SRC=1
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

L='vector-effect="non-scaling-stroke"'
def profile():
    s=HEAD+BASE.format(g='pfgl')
    s+=plate(.12,.12,.88,.88,0,0,'#16507F','#16507F','#16507F')
    # ID card raised (two layers)
    s+=plate(.1,.3,.56,.92,14,4,'#2E5784','#284F7A','#1D3E64')
    s+=plate(.12,.26,.58,.88,30,5,'#8CC0F1','#3F7FD9','#2A64B8','#CFE6FB')
    inner=(f'<circle cx=".22" cy=".5" r=".14" fill="#E2C27E"/><circle cx=".22" cy=".44" r=".05" fill="#1D3E64"/><path d="M.15 .6 Q.22 .52 .29 .6" fill="#1D3E64"/>'
     f'<g stroke-linecap="round" fill="none"><path d="M.45 .32H.86" stroke="#1E4F8F" stroke-opacity=".75" stroke-width="2.2" {L}/><path d="M.45 .5H.78" stroke="#1E4F8F" stroke-opacity=".45" stroke-width="2" {L}/><path d="M.45 .68H.7" stroke="#1E4F8F" stroke-opacity=".45" stroke-width="2" {L}/></g>')
    s+=onplate(.12,.26,.58,.88,30,inner)
    s+=person(.8,.4,1.7,'#CFE6FB','#8CC0F1','#3F7FD9','#8CC0F1','#E4F1FD','#E2C27E')[0][1]
    s+=shield(392,226,1.25,'<rect x="-4.5" y="-1.5" width="9" height="7.5" rx="1.5" fill="none" stroke="#E2C27E" stroke-width="1.6"/><path d="M-2.6 -1.5V-4a2.6 2.6 0 0 1 5.2 0v2.5" fill="none" stroke="#E2C27E" stroke-width="1.6"/>')
    s+=badge(244,238,'<circle cx="0" cy="-2.5" r="3" fill="none" stroke="#8CC0F1" stroke-width="1.8"/><path d="M-5 5.5c1-2.6 2.8-3.8 5-3.8s4 1.2 5 3.8" fill="none" stroke="#8CC0F1" stroke-width="1.8" stroke-linecap="round"/>')
    return s+'</svg>'
def notif():
    s=HEAD+BASE.format(g='ntgl')
    s+=plate(.12,.12,.88,.88,0,0,'#16507F','#16507F','#16507F')
    # stacked message cards
    for i,(z,top,l,r,st) in enumerate([(12,'#2E5784','#284F7A','#1D3E64','#3A78B0'),(30,'#3E6FA6','#2E5784','#21487A','#5E8FC8'),(48,'#8CC0F1','#3F7FD9','#2A64B8','#CFE6FB')]):
        s+=plate(.18,.2,.74,.66,z,4,top,l,r,st)
        ln='#1E4F8F' if i==2 else '#8FB6DC'
        op='.7' if i==2 else '.35'
        s+=onplate(.18,.2,.74,.66,z,f'<circle cx=".14" cy=".5" r=".08" fill="{"#E2C27E" if i==2 else "#8FB6DC"}" fill-opacity="{1 if i==2 else .4}"/><g fill="none" stroke-linecap="round"><path d="M.3 .38H.86" stroke="{ln}" stroke-opacity="{op}" stroke-width="2" {L}/><path d="M.3 .62H.7" stroke="{ln}" stroke-opacity="{op}" stroke-width="2" {L}/></g>')
    # bell floating with gold badge dot
    bx,by=384,236
    s+=f'<g transform="translate({bx} {by}) scale(1.6)"><ellipse cx="0" cy="24" rx="12" ry="4" fill="#061A2E" fill-opacity=".35"/><path d="M-11 6 V-2 a11 11 0 0 1 22 0 V6 l3 4 h-28z" fill="#2E5784" stroke="#8CC0F1" stroke-width="1.3" stroke-linejoin="round"/><path d="M-4 13 a4 4 0 0 0 8 0" fill="none" stroke="#8CC0F1" stroke-width="1.4"/><circle cx="10" cy="-10" r="5" fill="#E2C27E" stroke="#0A2440" stroke-width="1.5"/></g>'
    s+=badge(244,238,'<rect x="-6" y="-4.5" width="12" height="9" rx="1.5" fill="none" stroke="#8CC0F1" stroke-width="1.6"/><path d="M-6 -3.5 0 1l6-4.5" fill="none" stroke="#8CC0F1" stroke-width="1.6" stroke-linejoin="round"/>')
    return s+'</svg>'
open('ill/profile.svg','w').write(profile());open('ill/notif.svg','w').write(notif())
