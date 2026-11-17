# Account emails

Transactional emails sent when someone joins ObliGate. Each has an HTML file (table layout, inline styles, 600px, light and dark) and a plain-text file.

| File | When it is sent |
| --- | --- |
| `verify-email` | As soon as someone creates an account. Holds a 6-digit code that expires in 10 minutes. |
| `invitation` | When an admin invites someone from Settings › Team & Roles. Expires after 7 days. |
| `welcome` | Once, after the email is verified or the invitation is accepted. |

Fields use `{{double_braces}}` and are filled by the sending service (for example from WorkOS events, with WorkOS's own emails turned off): `first_name`, `code`, `email`, `organization_name`, `support_email`, `inviter_name`, `inviter_email`, `role`, `invite_url`, `expires_at`, `app_url`.

Edit `build_emails.py`, then run `python3 emails/build_emails.py`. It rewrites the six files and refreshes the preview page `pages/27-emails.dc.html` (`/emails` in the prototype). `make_page.py` and `page_body.html` create that page's shell.
