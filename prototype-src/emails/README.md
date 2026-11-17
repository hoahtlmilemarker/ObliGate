# Account emails

Transactional emails sent when someone joins ObliGate. Each has an HTML file (table layout, inline styles, 600px, light and dark) and a plain-text file.

| File | When it is sent |
| --- | --- |
| `verify-email` | As soon as someone creates an account. Holds a 6-digit code that expires in 10 minutes. |
| `invitation` | When an admin invites someone from Settings › Team & Roles. Expires after 7 days. |
| `welcome` | Once, after the email is verified or the invitation is accepted. |

Fields use `{{double_braces}}` and are filled by the sending service (for example from WorkOS events, with WorkOS's own emails turned off): `logo_url`, `logo_dark_url`, `first_name`, `code`, `email`, `organization_name`, `support_email`, `inviter_name`, `inviter_email`, `role`, `invite_url`, `expires_at`, `app_url`.

Edit `build_emails.py`, then run `python3 emails/build_emails.py`. It rewrites the six files and refreshes the preview page `pages/27-emails.dc.html` (`/emails` in the prototype). `make_page.py` and `page_body.html` create that page's shell.

## Logo

The wordmark sits above the card: `assets/obligate-logo.png` (navy) for light mail apps and `assets/obligate-logo-white.png` for dark mode. Both are 234×48, shown at 117×24 so they stay sharp on retina screens.

- `logo_url` and `logo_dark_url` must be public HTTPS addresses. The Vercel prototype is password protected, so it cannot host them; use a CDN or the email provider's asset storage.
- Use PNG, not SVG: Gmail and Outlook do not show SVG in email.
- The white logo swaps in only where the mail app supports `prefers-color-scheme` (Apple Mail, Outlook for Mac). Gmail ignores it and recolours the page itself; the navy logo stays readable there.
- Many mail apps, including Outlook and government mail, block images until the reader allows them. The `alt="ObliGate"` text is styled as a bold navy word, so the header still reads correctly.
- The preview page fills both fields with the PNGs inlined as data URIs.
