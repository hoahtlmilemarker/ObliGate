M={'01-disaster-portfolio':'disasters','02-project-detail':'project-overview','03-document-library':'document-library','03b-document-library-empty':'library-empty','03c-unplaced-inbox':'unplaced-inbox','04-document-review':'document-review','05-cross-check':'cross-check','06-import-wizard':'import-wizard','07-presubmission':'pre-submission','08-supervisor-signature':'supervisor-signature','09-auth-signin':'sign-in','10-my-profile':'profile','11-notification-settings':'notifications','12-upload-start':'upload','13-analysis-running':'analyzing','14-analysis-report':'analysis-report','15-team-management':'team','16-settings-security':'security','17-settings-disasters':'disaster-scope','18-settings-policy':'policy-thresholds','19-settings-overrides':'finding-overrides','20-settings-data':'data-retention','21-settings-patterns':'reviewer-patterns'}
import re
def clean(t):
    t=t.replace('href*="12-upload"','href*="upload"')
    for o in sorted(M,key=len,reverse=True):
        t=t.replace(o+'.html',M[o]).replace(o,M[o])
    return t
