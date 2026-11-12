import os,shutil,glob,json
exec(open('names.py').read())
D='/home/claude/obligate/prototype'
for f in glob.glob(D+'/*.html'): os.remove(f)
shutil.rmtree(D+'/review',ignore_errors=True); shutil.copytree('review',D+'/review')
for f in glob.glob('site/*.html'):
    b=os.path.basename(f)[:-5]
    t=clean(open(f).read())
    open(f'{D}/{M.get(b,b)}.html','w').write(t)
shutil.copy(D+'/sign-in.html',D+'/index.html')
vj='/home/claude/obligate/vercel.json'; v=json.load(open(vj))
v['cleanUrls']=True; v['trailingSlash']=False
v['redirects']=[{'source':'/'+o+'(.html)?','destination':'/'+n,'permanent':True} for o,n in M.items()]
EXTRA={'my-profile':'profile','notification-settings':'notifications'}
v['redirects']+= [{'source':'/'+o,'destination':'/'+n,'permanent':True} for o,n in EXTRA.items()]
json.dump(v,open(vj,'w'),indent=2)
print(sorted(os.listdir(D)))
