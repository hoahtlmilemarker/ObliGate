"""Copy build/site into ../prototype with clean URLs (no numbers, no .html) and update ../vercel.json redirects."""
import os, shutil, glob, json
H = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(H, 'names.py')).read())          # M = {numbered name: clean name}, clean(text)
SITE = os.path.join(H, 'build', 'site')
D = os.path.join(H, '..', 'prototype')
for f in glob.glob(D + '/*.html'): os.remove(f)
shutil.rmtree(D + '/review', ignore_errors=True); shutil.copytree(os.path.join(H, 'review'), D + '/review')
for f in glob.glob(SITE + '/*.html'):
    b = os.path.basename(f)[:-5]
    open(f'{D}/{M.get(b, b)}.html', 'w').write(clean(open(f).read()))
for f in glob.glob(os.path.join(H, 'assets', '*')): shutil.copy(f, D)
shutil.copy(D + '/sign-in.html', D + '/index.html')
vj = os.path.join(H, '..', 'vercel.json'); v = json.load(open(vj))
v['cleanUrls'] = True; v['trailingSlash'] = False
EXTRA = {'my-profile': 'profile', 'notification-settings': 'notifications'}
v['redirects'] = [{'source': '/' + o + '(.html)?', 'destination': '/' + n, 'permanent': True} for o, n in M.items()] + \
                 [{'source': '/' + o, 'destination': '/' + n, 'permanent': True} for o, n in EXTRA.items()]
json.dump(v, open(vj, 'w'), indent=2)
print('published', len(glob.glob(D + '/*.html')), 'pages to', os.path.normpath(D))
