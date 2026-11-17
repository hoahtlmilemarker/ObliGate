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
open(os.path.join(P, '27-emails.dc.html'), 'w').write(s)
print('page written')
