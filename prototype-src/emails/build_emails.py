"""Builds the ObliGate transactional emails (HTML + plain text) and embeds them in the 27 · Emails prototype page.
Placeholders use {{double_braces}}; the sending service fills them in. Run: python3 emails/build_emails.py"""
import os, re, json, html
D = os.path.dirname(os.path.abspath(__file__))
NAVY, GOLD, INK, GRAY, LINE, PALE, BLUE = '#00365D', '#C9A45C', '#24272B', '#60666C', '#D5D9DC', '#F3F6F8', '#005A9C'
FONT = "Manrope,'Segoe UI',Arial,Helvetica,sans-serif"
MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace"
DARK = """@media (prefers-color-scheme: dark){
.em-bg{background:#0B131C !important}
.em-card{background:#13202C !important;border-color:#263443 !important}
.em-h{color:#DCEAF7 !important}
.em-t{color:#E6EBF0 !important}
.em-m{color:#9AA6B2 !important}
.em-line{border-color:#263443 !important}
.em-box{background:#101B26 !important;border-color:#263443 !important}
.em-code{color:#DCEAF7 !important}
.em-link{color:#86C0EE !important}
.em-btn{background:#2667A3 !important}
}"""

def shell(subject, preheader, body):
    return f"""<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>{html.escape(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap" rel="stylesheet">
<style>
body{{margin:0;padding:0;-webkit-text-size-adjust:100%}}
table{{border-collapse:collapse}}
a{{color:{BLUE}}}
@media (max-width:620px){{.em-wrap{{width:100% !important}}.em-pad{{padding-left:24px !important;padding-right:24px !important}}}}
</style>
<style data-dark>
{DARK}
</style>
</head>
<body class="em-bg" style="margin:0;padding:0;background:{PALE}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">{html.escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-bg" style="background:{PALE}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" class="em-wrap" style="width:600px;max-width:600px">
<tr><td style="background:{NAVY};border-radius:4px 4px 0 0;padding:22px 40px" class="em-pad">
<span style="font:600 22px/1 Georgia,'Times New Roman',serif;color:#FFFFFF;letter-spacing:.2px">ObliGate</span>
</td></tr>
<tr><td style="height:3px;background:{GOLD};line-height:3px;font-size:0">&nbsp;</td></tr>
<tr><td class="em-card em-pad" style="background:#FFFFFF;border:1px solid {LINE};border-top:0;border-radius:0 0 4px 4px;padding:36px 40px 32px">
{body}
</td></tr>
<tr><td class="em-pad" style="padding:20px 40px 0;font:400 12px/1.6 {FONT};color:{GRAY}">
<span class="em-m">This email was sent to {{{{email}}}} by ObliGate for {{{{organization_name}}}}. It is a service message about your account, so it has no unsubscribe link.</span><br>
<span class="em-m">Questions? Contact {{{{support_email}}}}.</span>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
"""

def h1(t): return f'<h1 class="em-h" style="margin:0 0 12px;font:700 22px/1.3 {FONT};color:{NAVY}">{t}</h1>'
def p(t, m=False, mt=0): return f'<p class="{"em-m" if m else "em-t"}" style="margin:{mt}px 0 16px;font:400 {14 if m else 15}px/1.6 {FONT};color:{GRAY if m else INK}">{t}</p>'
def button(label, url): return f"""<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px"><tr><td class="em-btn" style="background:{BLUE};border-radius:4px">
<a href="{url}" style="display:inline-block;padding:13px 22px;font:700 15px/1 {FONT};color:#FFFFFF;text-decoration:none;border-radius:4px">{label}</a></td></tr></table>"""
def fallback(url): return p(f'If the button does not work, copy this link into your browser:<br><a class="em-link" href="{url}" style="color:{BLUE};word-break:break-all">{url}</a>', m=True)
def rule(): return f'<hr class="em-line" style="border:0;border-top:1px solid {LINE};margin:24px 0">'
def rows(items):
    r = ''.join(f'<tr><td class="em-m" style="padding:8px 0;font:400 13px/1.4 {FONT};color:{GRAY};width:120px;vertical-align:top">{k}</td><td class="em-t" style="padding:8px 0;font:600 14px/1.4 {FONT};color:{INK}">{v}</td></tr>' for k, v in items)
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-box" style="background:{PALE};border:1px solid {LINE};border-radius:4px;margin:4px 0 20px"><tr><td style="padding:8px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">{r}</table></td></tr></table>'

E = []
# 1. Email verification (sent when someone registers)
code = '{{code}}'
E.append(dict(
  id='verify-email', name='Verify email', trigger='Sent as soon as someone creates an account. The account stays unverified until the code is entered.',
  subject='Your ObliGate verification code', preheader='Your code is {{code}}. It expires in 10 minutes.',
  vars=['first_name','code','email','organization_name','support_email'],
  body=h1('Verify your email') + p('Hi {{first_name}}, enter this code in ObliGate to finish creating your account.') +
    f'<table role="presentation" cellpadding="0" cellspacing="0" class="em-box" style="background:{PALE};border:1px solid {LINE};border-radius:4px;margin:4px 0 20px"><tr><td class="em-code" style="padding:16px 28px;font:700 30px/1 {MONO};letter-spacing:8px;color:{NAVY}">{code}</td></tr></table>' +
    p('The code expires in <b>10 minutes</b> and works once.') + rule() +
    p('Did not try to create an account? You can ignore this email. No account is created until the code is entered, and ObliGate staff will never ask you for this code.', m=True),
  text="""Verify your email

Hi {{first_name}}, enter this code in ObliGate to finish creating your account.

{{code}}

The code expires in 10 minutes and works once.

Did not try to create an account? You can ignore this email. No account is created until the code is entered, and ObliGate staff will never ask you for this code.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? Contact {{support_email}}."""))
# 2. Invitation
E.append(dict(
  id='invitation', name='Invitation', trigger='Sent when an admin invites someone from Settings › Team & Roles.',
  subject='{{inviter_name}} invited you to {{organization_name}} on ObliGate', preheader='Accept by {{expires_at}} to join as {{role}}.',
  vars=['inviter_name','inviter_email','organization_name','role','invite_url','expires_at','email','support_email'],
  body=h1('You are invited to {{organization_name}}') + p('{{inviter_name}} ({{inviter_email}}) invited you to work in ObliGate.') +
    rows([('Workspace','{{organization_name}}'),('Your role','{{role}}'),('Invited by','{{inviter_name}}'),('Expires','{{expires_at}}')]) +
    button('Accept invitation','{{invite_url}}') + fallback('{{invite_url}}') + rule() +
    p('The invitation works only for {{email}} and expires after 7 days. Not expecting it? Ignore this email or let {{inviter_name}} know.', m=True),
  text="""You are invited to {{organization_name}}

{{inviter_name}} ({{inviter_email}}) invited you to work in ObliGate.

Workspace: {{organization_name}}
Your role: {{role}}
Invited by: {{inviter_name}}
Expires: {{expires_at}}

Accept invitation: {{invite_url}}

The invitation works only for {{email}} and expires after 7 days. Not expecting it? Ignore this email or let {{inviter_name}} know.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? Contact {{support_email}}."""))
# 3. Welcome
steps = [('Upload documents','Add timesheets and activity logs. Clean exports and scans both work.'),
         ('Check what ObliGate read','Review extracted hours against the originals. Unclear entries wait for you.'),
         ('Run reconciliation','See each employee-day with its signed difference and any missing support.'),
         ('Download the workbook','Get the reconciliation workbook and the ZIP of source documents.')]
st = ''.join(f'<tr><td style="width:36px;vertical-align:top;padding:0 0 14px"><span style="display:inline-block;width:24px;height:24px;border-radius:12px;background:{NAVY};color:#FFFFFF;font:700 12px/24px {FONT};text-align:center">{i+1}</span></td><td style="vertical-align:top;padding:2px 0 14px"><b class="em-h" style="font:700 14px/1.4 {FONT};color:{NAVY}">{a}</b><br><span class="em-m" style="font:400 14px/1.5 {FONT};color:{GRAY}">{b}</span></td></tr>' for i,(a,b) in enumerate(steps))
E.append(dict(
  id='welcome', name='Welcome', trigger='Sent once, after the email is verified or the invitation is accepted.',
  subject='Welcome to ObliGate', preheader='Your account for {{organization_name}} is ready.',
  vars=['first_name','organization_name','role','app_url','email','support_email'],
  body=h1('Your account is ready') + p('Hi {{first_name}}, you can now work in <b>{{organization_name}}</b> as <b>{{role}}</b>. Here is how a project goes:') +
    f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 10px">{st}</table>' +
    button('Open ObliGate','{{app_url}}') + rule() +
    p('Keep your account safe: turn on two-factor authentication in <b>Settings › Security</b>.', m=True),
  text="""Your account is ready

Hi {{first_name}}, you can now work in {{organization_name}} as {{role}}. Here is how a project goes:

1. Upload documents. Add timesheets and activity logs. Clean exports and scans both work.
2. Check what ObliGate read. Review extracted hours against the originals. Unclear entries wait for you.
3. Run reconciliation. See each employee-day with its signed difference and any missing support.
4. Download the workbook. Get the reconciliation workbook and the ZIP of source documents.

Open ObliGate: {{app_url}}

Keep your account safe: turn on two-factor authentication in Settings > Security.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? Contact {{support_email}}."""))

for e in E:
    open(os.path.join(D, e['id'] + '.html'), 'w').write(shell(e['subject'], e['preheader'], e['body']))
    open(os.path.join(D, e['id'] + '.txt'), 'w').write('Subject: ' + e['subject'] + '\n\n' + e['text'] + '\n')

# embed into the prototype page
SAMPLE = {'first_name':'Daniel','code':'482 913','email':'d.ortiz@pw.lacounty.gov','organization_name':'LA County Public Works','support_email':'support@obligate.example',
          'inviter_name':'Rosa Keith','inviter_email':'r.keith@pw.lacounty.gov','role':'Grants Analyst','invite_url':'https://app.obligate.example/invite/7Kq2…','expires_at':'Nov 24, 2026','app_url':'https://app.obligate.example'}
data = [dict(id=e['id'], name=e['name'], trigger=e['trigger'], subject=e['subject'], preheader=e['preheader'], vars=e['vars'],
             html=open(os.path.join(D, e['id'] + '.html')).read(), text=open(os.path.join(D, e['id'] + '.txt')).read()) for e in E]
page = os.path.join(D, '..', 'pages', '27-emails.dc.html')
s = open(page).read()
blob = json.dumps({'emails': data, 'sample': SAMPLE}).replace('</', '<\\/').replace('{{', '\\u007b\\u007b')
s = re.sub(r'<script type="application/json" id="og-emails">.*?</script>', lambda m: '<script type="application/json" id="og-emails">' + blob + '</script>', s, count=1, flags=re.S)
open(page, 'w').write(s)
print('built', [e['id'] for e in E])
