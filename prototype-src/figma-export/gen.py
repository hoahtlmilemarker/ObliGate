import json,os
H='''const T=async(p,txt)=>{const l=p.locator(`button:has-text("${txt}"), a:has-text("${txt}"), [role=button]:has-text("${txt}")`).filter({visible:true}).first();await l.click();};'''
A={
 'account':"await p.click('.hd .av');await p.waitForTimeout(300)",
 'cmdk':"await p.click('.srch');await p.waitForTimeout(350)",
 'loading':"await p.evaluate(()=>window.addEventListener('beforeunload',e=>{e.preventDefault();e.returnValue=''}));const a=p.locator('.hd nav a[href$=\".html\"]:not(.on):not([aria-current]), .rv-bar a[href$=\".html\"]').filter({visible:true}).first();await a.click({noWaitAfter:true}).catch(()=>{});await p.waitForTimeout(350)",
}
def click(t,extra=''):return "await T(p,%s);await p.waitForTimeout(500);%s"%(json.dumps(t),extra)
S={
 '00-sign-in':('09-auth-signin',[]),
 '01-disaster-portfolio':('01-disaster-portfolio',[('Dialog · Declare New Event',click('Declare New Event')),('Toast',click('Active Declarations'))]),
 '02-project-detail':('02-project-detail',[('Modal · Upload documents',click('Upload Documents'))]),
 '03-document-library':('03-document-library',[('Skeleton · switching folder',"await p.evaluate(()=>{const o=window.setTimeout;window.setTimeout=function(f,d){if((d||0)>=200)return 0;return o.apply(this,arguments)}});await p.click('text=Equipment Records');await p.waitForTimeout(700)"),('Dropdown · Batch Actions',"const c=await p.$$('.lb-tbl tbody tr input[type=checkbox]');await c[0].click();await c[1].click();await p.click('.lb-batch');await p.waitForTimeout(300)"),('Toast · Sent to review',"const c=await p.$$('.lb-tbl tbody tr input[type=checkbox]');await c[0].click();await p.click('.lb-batch');await p.waitForTimeout(250);await T(p,'Send to Review Queue');await p.waitForTimeout(500)"),('Search · results',"await p.fill('#df','Aguayo');await p.waitForTimeout(300)"),('Search · no results',"await p.fill('#df','Rodriguez');await p.waitForTimeout(300)"),('Modal · Upload documents',"await p.evaluate(()=>window.ogUploadModal());await p.waitForTimeout(300);const l=await p.$('text=/sample files/i');if(l)await l.click();await p.waitForTimeout(900)"),('Modal · Import payroll',click('Import Payroll (Excel)'))]),
 '03b-document-library-empty':('03b-document-library-empty',[('Modal · Upload documents',click('Upload to this Folder'))]),
 '03c-unplaced-inbox':('03c-unplaced-inbox',[('Toast · Accepted',click('Accept All Suggestions')),('Modal · Upload documents',click('Upload Documents'))]),
 '04-document-review':('04-document-review',[('Dialog · Request re-scan',click('Request Re-Scan')),('Dialog · Reject (danger)',click('Reject Document'))]),
 '05-cross-check':('05-cross-check',[('Dialog · Accept documented',click('Accept Documented')),('Toast',click('Prev Period'))]),
 '06-import-wizard':('06-import-wizard',[('Dialog · Adjust regions',click('Adjust Detected Regions')),('Overlay · Detecting structure',click('Back to Step 1',"await p.waitForTimeout(300);"))]),
 '07-presubmission':('07-presubmission',[('Dialog · Lock & assemble',click('Lock & Assemble Binder')),('Modal · Upload documents',click('Upload SAM.gov Screenshot'))]),
 '08-supervisor-signature':('08-supervisor-signature',[('Dialog · Confirm & seal',click('Confirm & Digitally Seal')),('Toast · Pad cleared',click('Clear Pad'))]),
 '10-my-profile':('10-my-profile',[('Unsaved changes bar',"await p.fill('.st-c input.inp >> nth=0','Rosa M.');await p.waitForTimeout(300)"),('Toast · Sessions signed out',click('Sign Out Other Sessions'))]),
 '11-notification-settings':('11-notification-settings',[('Unsaved changes bar',"await p.click('.sw');await p.waitForTimeout(300)"),('Toast · Settings saved',"await p.click('.sw');await p.waitForTimeout(200);await p.click('.st-save');await p.waitForTimeout(400)")]),
}
jobs=[]
for key,(src,extra) in S.items():
  common=[] if key=='00-sign-in' else [('Loading · page transition',A['loading']),('Dropdown · Account menu',A['account']),('Search · Command palette',A['cmdk'])]
  states=[('Default',None)]+(common if key!='04-document-review' else [common[0]])+extra
  for th in ['light','dark']:
    for i,(nm,code) in enumerate(states):
      fn=None
      if code:
        fn='act/gen/%s_%d.js'%(key,i);open(fn,'w').write('module.exports=async p=>{%s\n%s}\n'%(H,code))
      jobs.append({'key':key,'src':src,'theme':th,'name':nm,'act':fn,'fixed':nm!='Default','out':'out2/%s__%s__%02d.html'%(key,th,i)})
  if key=='00-sign-in':
    for th in ['light','dark']:
      jobs.append({'key':key,'src':src,'theme':th,'name':'Loading · first load','act':None,'fixed':True,'keepld':True,'out':'out2/%s__%s__%02d.html'%(key,th,9)})
json.dump(jobs,open('jobs.json','w'),indent=0)
print(len(jobs))
