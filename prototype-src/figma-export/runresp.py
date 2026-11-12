import subprocess,os,json
from concurrent.futures import ThreadPoolExecutor
pages=['03-document-library']
jobs=[(pg,th,dev,w,h) for pg in pages for th in ['light','dark'] for dev,w,h in [('Tablet',768,1024),('Mobile',390,844)]]
def run(j):
  pg,th,dev,w,h=j;out='out3/%s__%s__%s.html'%(pg,th,dev)
  env=dict(os.environ,FONTS='1',THEME=th,W=str(w),H=str(h))
  r=subprocess.run(['node','snap.js',pg,out,''],env=env,capture_output=True,text=True,timeout=120)
  return out,os.path.exists(out),r.stdout.strip()[-60:]
with ThreadPoolExecutor(5) as ex:
  for o in ex.map(run,jobs):print(*o,flush=True)
