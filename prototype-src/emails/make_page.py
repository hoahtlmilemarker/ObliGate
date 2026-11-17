"""One-time: creates pages/27-emails.dc.html from the Toasts page shell. The email data is filled in by build_emails.py."""
import re, os
D = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(D, '..', 'pages')
s = open(os.path.join(P, '26-toasts.dc.html')).read()
s = re.sub(r'<title>.*?</title>', '<title>Emails · ObliGate</title>', s, count=1)
old = '<div class="st-c"><div class="tg" data-toasts><div class="tm-loading">Loading…</div></div></div>'
assert s.count(old) == 1
NEW = open(os.path.join(D, 'page_body.html')).read().strip()
s = s.replace(old, NEW)
# The preview mimics a mail app, so the page drops the ObliGate app header.
s = re.sub(r'\s*<header class="hd">.*?</header>', '', s, count=1, flags=re.S)
s = s.replace('style="min-height: 1100px"', '', 1)
open(os.path.join(P, '27-emails.dc.html'), 'w').write(s)
print('page written')
