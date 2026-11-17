"""Builds the ObliGate transactional emails (HTML + plain text) and embeds them in the 27 · Emails prototype page.
Placeholders use {{double_braces}}; the sending service fills them in. Run: python3 emails/build_emails.py"""
import os, re, json, html, base64
D = os.path.dirname(os.path.abspath(__file__))
NAVY, INK, BODY, GRAY, LINE, PALE, TINT, TINTLN, GOLDTX = '#00365D', '#0B2540', '#3C444C', '#66707A', '#DCE3E9', '#EEF2F5', '#F1F6FB', '#D5E2EE', '#8A6A2F'
FONT = "Manrope,'Segoe UI',Arial,Helvetica,sans-serif"
MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace"
DARK = """@media (prefers-color-scheme: dark){
.em-bg{background:#0B131C !important}
.em-card{background:#121E2A !important;border-color:#233242 !important;border-top-color:#3B7BBF !important}
.em-lg{display:none !important}
.em-lgd{display:block !important;max-height:none !important;overflow:visible !important}
.em-eb{color:#D9B977 !important}
.em-h{color:#E3EDF6 !important}
.em-t{color:#C9D3DC !important}
.em-m{color:#8F9BA7 !important}
.em-line{border-color:#233242 !important}
.em-box{background:#0F1A24 !important;border-color:#233242 !important}
.em-code{color:#E3EDF6 !important}
.em-chip{background:#1B2C3D !important;color:#9CC5EC !important}
.em-num{background:#1B2C3D !important;color:#9CC5EC !important}
.em-tip{background:#1C1912 !important;border-color:#3A3122 !important}
.em-link{color:#86C0EE !important}
.em-btn{background:#2B6CB0 !important}
}"""

def shell(subject, preheader, eyebrow, body):
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
a{{color:{NAVY}}}
@media (max-width:620px){{.em-wrap{{width:100% !important}}.em-pad{{padding-left:24px !important;padding-right:24px !important}}.em-card{{padding-top:32px !important}}.em-btnw{{width:100% !important}}.em-btnw a{{display:block !important;text-align:center !important}}.em-h1{{font-size:23px !important}}}}
</style>
<style data-dark>
{DARK}
</style>
</head>
<body class="em-bg" style="margin:0;padding:0;background:{PALE}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">{html.escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-bg" style="background:{PALE}">
<tr><td align="center" style="padding:36px 12px 40px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" class="em-wrap" style="width:560px;max-width:560px">
<tr><td style="padding:0 4px 20px">
<img class="em-lg" src="{{{{logo_url}}}}" width="117" height="24" alt="ObliGate" style="display:block;border:0;outline:none;width:117px;height:24px;font:700 20px/24px {FONT};color:{NAVY}">
<!--[if !mso]><!--><img class="em-lgd" src="{{{{logo_dark_url}}}}" width="117" height="24" alt="ObliGate" style="display:none;max-height:0;overflow:hidden;border:0;outline:none;width:117px;height:24px;font:700 20px/24px {FONT};color:#FFFFFF"><!--<![endif]-->
</td></tr>
<tr><td class="em-card em-pad" style="background:#FFFFFF;border:1px solid {LINE};border-top:3px solid {NAVY};border-radius:4px;padding:40px 44px 36px">
<p class="em-eb" style="margin:0 0 10px;font:700 11px/1 {FONT};letter-spacing:1.4px;text-transform:uppercase;color:{GOLDTX}">{eyebrow}</p>
{body}
</td></tr>
<tr><td class="em-pad" align="center" style="padding:24px 32px 0;font:400 12px/1.7 {FONT};color:{GRAY};text-align:center">
<span class="em-m">Sent to {{{{email}}}} by ObliGate for {{{{organization_name}}}}.<br>This is a service message about your account, so it has no unsubscribe link.<br>Questions? <a class="em-link" href="mailto:{{{{support_email}}}}" style="color:{GRAY};text-decoration:underline">{{{{support_email}}}}</a></span>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
"""

def h1(t): return f'<h1 class="em-h em-h1" style="margin:0 0 14px;font:700 26px/1.25 {FONT};letter-spacing:-.3px;color:{INK}">{t}</h1>'
def p(t, m=False, mt=0, mb=18): return f'<p class="{"em-m" if m else "em-t"}" style="margin:{mt}px 0 {mb}px;font:400 {13.5 if m else 15}px/1.65 {FONT};color:{GRAY if m else BODY}">{t}</p>'
def button(label, url): return f"""<table role="presentation" cellpadding="0" cellspacing="0" class="em-btnw" style="margin:6px 0 22px"><tr><td class="em-btn" style="background:{NAVY};border-radius:4px">
<a href="{url}" style="display:inline-block;padding:15px 28px;font:700 15px/18px {FONT};color:#FFFFFF;text-decoration:none;border-radius:4px">{label}</a></td></tr></table>"""
def fallback(url): return p(f'Button not working? Paste this link into your browser:<br><a class="em-link" href="{url}" style="color:{NAVY};word-break:break-all">{url}</a>', m=True, mb=0)
def rule(): return f'<hr class="em-line" style="border:0;border-top:1px solid {LINE};margin:28px 0 22px">'
def chip(t): return f'<span class="em-chip" style="display:inline-block;padding:5px 10px;border-radius:4px;background:#EAF1F8;font:700 12.5px/1 {FONT};color:{NAVY}">{t}</span>'
def tip(t): return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-tip" style="background:#FBF7EE;border:1px solid #EADFC6;border-radius:4px"><tr><td class="em-t" style="padding:14px 18px;font:400 13.5px/1.6 {FONT};color:{BODY}">{t}</td></tr></table>'

E = []
# 1. Email verification (sent when someone registers)
E.append(dict(
  id='verify-email', name='Verify email', eyebrow='Verify your email', trigger='Sent as soon as someone creates an account. The account stays unverified until the code is entered.',
  subject='Your ObliGate verification code', preheader='Your code is {{code}}. It expires in 10 minutes.',
  vars=['logo_url','logo_dark_url','first_name','code','email','organization_name','support_email'],
  body=h1('Enter this code to finish signing up') + p('Hi {{first_name}}, use the code below in ObliGate to confirm this is your email address.', mb=22) +
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-box" style="background:{TINT};border:1px solid {TINTLN};border-radius:4px;margin:0 0 22px"><tr><td align="center" style="padding:24px 16px 20px;text-align:center">'
    f'<div class="em-code" style="font:700 34px/1 {MONO};letter-spacing:10px;color:{INK};padding-left:10px">{{{{code}}}}</div>'
    f'<div class="em-m" style="margin-top:12px;font:600 12.5px/1 {FONT};color:{GRAY}">Expires in 10 minutes · Works once</div></td></tr></table>' +
    p('Didn’t try to create an account? You can ignore this email. No account is created until the code is entered, and ObliGate staff will never ask you for this code.', m=True, mb=0),
  text="""Enter this code to finish signing up

Hi {{first_name}}, use the code below in ObliGate to confirm this is your email address.

{{code}}

Expires in 10 minutes. Works once.

Didn't try to create an account? You can ignore this email. No account is created until the code is entered, and ObliGate staff will never ask you for this code.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? {{support_email}}"""))
# 2. Invitation
E.append(dict(
  id='invitation', name='Invitation', eyebrow='Team invitation', trigger='Sent when an admin invites someone from Settings › Team & Roles.',
  subject='{{inviter_name}} invited you to {{organization_name}} on ObliGate', preheader='Accept by {{expires_at}} to join as {{role}}.',
  vars=['logo_url','logo_dark_url','inviter_name','inviter_email','organization_name','role','invite_url','expires_at','email','support_email'],
  body=h1('Join {{organization_name}} on ObliGate') +
    p('<b class="em-h" style="color:' + INK + '">{{inviter_name}}</b> (<a class="em-link" href="mailto:{{inviter_email}}" style="color:' + NAVY + '">{{inviter_email}}</a>) invited you to work on the team’s FEMA Public Assistance projects.', mb=22) +
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="em-box" style="border:1px solid {LINE};border-radius:4px;margin:0 0 24px"><tr><td style="padding:18px 20px">'
    f'<div class="em-m" style="font:700 11px/1 {FONT};letter-spacing:1px;text-transform:uppercase;color:{GRAY}">Workspace</div>'
    f'<div class="em-h" style="margin:8px 0 14px;font:700 18px/1.3 {FONT};color:{INK}">{{{{organization_name}}}}</div>'
    f'{chip("{{role}}")}<div class="em-m" style="margin-top:12px;font:400 13px/1.4 {FONT};color:{GRAY}">Invite expires {{{{expires_at}}}}</div></td></tr></table>' +
    button('Accept invitation','{{invite_url}}') + fallback('{{invite_url}}') + rule() +
    p('This invitation works only for {{email}}. Not expecting it? Ignore this email or let {{inviter_name}} know.', m=True, mb=0),
  text="""Join {{organization_name}} on ObliGate

{{inviter_name}} ({{inviter_email}}) invited you to work on the team's FEMA Public Assistance projects.

Workspace: {{organization_name}}
Your role: {{role}}
Invite expires: {{expires_at}}

Accept invitation: {{invite_url}}

This invitation works only for {{email}}. Not expecting it? Ignore this email or let {{inviter_name}} know.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? {{support_email}}"""))
# 3. Welcome
steps = [('Upload documents','Add timesheets and activity logs. Clean exports and scans both work.'),
         ('Check what ObliGate read','Review extracted hours against the originals. Unclear entries wait for you.'),
         ('Run reconciliation','See each employee-day with its signed difference and any missing support.'),
         ('Download the workbook','Get the reconciliation workbook and the ZIP of source documents.')]
st = ''.join(f'<tr><td class="em-line" style="width:42px;vertical-align:top;padding:14px 0;{"border-top:1px solid " + LINE if i else ""}"><span class="em-num" style="display:inline-block;width:26px;height:26px;border-radius:4px;background:#EAF1F8;color:{NAVY};font:700 13px/26px {FONT};text-align:center">{i+1}</span></td>'
             f'<td class="em-line" style="vertical-align:top;padding:14px 0;{"border-top:1px solid " + LINE if i else ""}"><div class="em-h" style="font:700 14.5px/1.4 {FONT};color:{INK}">{a}</div><div class="em-m" style="margin-top:3px;font:400 13.5px/1.55 {FONT};color:{GRAY}">{b}</div></td></tr>' for i,(a,b) in enumerate(steps))
E.append(dict(
  id='welcome', name='Welcome', eyebrow='Welcome to ObliGate', trigger='Sent once, after the email is verified or the invitation is accepted.',
  subject='Welcome to ObliGate', preheader='Your account for {{organization_name}} is ready.',
  vars=['logo_url','logo_dark_url','first_name','organization_name','role','app_url','email','support_email'],
  body=h1('Your account is ready') + p('Hi {{first_name}}, you can now work in <b>{{organization_name}}</b> as <b>{{role}}</b>. A project takes four steps:', mb=8) +
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px">{st}</table>' +
    button('Open ObliGate','{{app_url}}') +
    tip('<b>Keep your account safe.</b> Turn on two-factor authentication in Settings › Security.'),
  text="""Your account is ready

Hi {{first_name}}, you can now work in {{organization_name}} as {{role}}. A project takes four steps:

1. Upload documents. Add timesheets and activity logs. Clean exports and scans both work.
2. Check what ObliGate read. Review extracted hours against the originals. Unclear entries wait for you.
3. Run reconciliation. See each employee-day with its signed difference and any missing support.
4. Download the workbook. Get the reconciliation workbook and the ZIP of source documents.

Open ObliGate: {{app_url}}

Keep your account safe. Turn on two-factor authentication in Settings > Security.

Sent to {{email}} by ObliGate for {{organization_name}}. Questions? {{support_email}}"""))

for e in E:
    open(os.path.join(D, e['id'] + '.html'), 'w').write(shell(e['subject'], e['preheader'], e['eyebrow'], e['body']))
    open(os.path.join(D, e['id'] + '.txt'), 'w').write('Subject: ' + e['subject'] + '\n\n' + e['text'] + '\n')

# embed into the prototype page
def uri(f): return 'data:image/png;base64,' + base64.b64encode(open(os.path.join(D, 'assets', f), 'rb').read()).decode()
SAMPLE = {'logo_url': uri('obligate-logo.png'), 'logo_dark_url': uri('obligate-logo-white.png'), 'first_name':'Daniel','code':'482 913','email':'d.ortiz@pw.lacounty.gov','organization_name':'LA County Public Works','support_email':'support@obligate.example',
          'inviter_name':'Rosa Keith','inviter_email':'r.keith@pw.lacounty.gov','role':'Grants Analyst','invite_url':'https://app.obligate.example/invite/7Kq2…','expires_at':'Nov 24, 2026','app_url':'https://app.obligate.example'}
data = [dict(id=e['id'], name=e['name'], trigger=e['trigger'], subject=e['subject'], preheader=e['preheader'], vars=e['vars'],
             html=open(os.path.join(D, e['id'] + '.html')).read(), text=open(os.path.join(D, e['id'] + '.txt')).read()) for e in E]
page = os.path.join(D, '..', 'pages', '27-emails.dc.html')
s = open(page).read()
blob = json.dumps({'emails': data, 'sample': SAMPLE}).replace('</', '<\\/').replace('{{', '\\u007b\\u007b')
s = re.sub(r'<script type="application/json" id="og-emails">.*?</script>', lambda m: '<script type="application/json" id="og-emails">' + blob + '</script>', s, count=1, flags=re.S)
open(page, 'w').write(s)
print('built', [e['id'] for e in E])
