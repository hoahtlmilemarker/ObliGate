import json,subprocess,os
from concurrent.futures import ThreadPoolExecutor
jobs=json.load(open('jobs.json'))
def run(j):
  env=dict(os.environ,THEME=j['theme'])
  if j.get('keepld'):env['KEEPLD']='1'
  cmd=['node','snap.js',j['src'],j['out'],j['act'] or '']+(['--fixed'] if j['fixed'] else [])
  r=subprocess.run(cmd,env=env,capture_output=True,text=True,timeout=120)
  ok=os.path.exists(j['out'])
  return j['out'],ok,(r.stderr[-300:] if not ok else '')
with ThreadPoolExecutor(5) as ex:
  for out,ok,err in ex.map(run,jobs):print(out,ok,err.replace('\n',' ')[:200],flush=True)
