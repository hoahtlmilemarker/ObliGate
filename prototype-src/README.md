# ObliGate prototype – source

This folder is the **source** of the static HTML prototype that Vercel serves from `/prototype`.
The React app in `/src` is the production handoff; use this prototype as the behaviour and visual reference while porting.

All names, emails, amounts and IDs are **sample data**.

## Build

```bash
cd prototype-src
./build.sh        # pages/*.dc.html + loader.html  ->  ../prototype/*.html (clean URLs) + ../vercel.json redirects
```

Requires Python 3 only. Commit `../prototype` and `../vercel.json` after building; Vercel deploys from `main`.

## Files

| Path | What |
|---|---|
| `pages/NN-*.dc.html` | One file per screen: page markup, page CSS, sample data. Numbered names are only used here; published URLs are clean (see `names.py`). |
| `loader.html` | Shared runtime injected into every page: header, account menu, theme, toasts, dialogs, upload/AI flow, settings pages, Team page, responsive type scale, scrollbars. Most interaction logic lives here, grouped by `/* ===== section ===== */` comments. |
| `search.js` | ⌘K search and the in-library Upload Documents modal. |
| `convert.py` | Builds a page: strips the design-tool wrapper and injects `search.js` + `loader.html`. |
| `names.py` | Numbered file → clean URL map (`10-my-profile` → `/profile`, …) and the link rewriter. |
| `publish.py` | Writes the build into `../prototype` and regenerates redirects in `../vercel.json`. |
| `review/` | On-page comment layer (Supabase table `obligate_review_comments`, publishable key only). Loaded on Vercel only. `supabase-setup.sql` creates the table and RLS policies. |
| `illustrations/` | Generators for the isometric banner illustrations (`team.py`, `set2.py`) and the resulting SVGs. |
| `test-files/` | Generators for the sample upload files (`mkdocs.py` → 14 Force-Account documents used by Cross-Check; `mksamples.py` → 12 placement test files). |
| `assets/` | Favicon and wordmark. |

## Screens (published URL → source page)

| URL | Page | Notes |
|---|---|---|
| `/sign-in` | 09-auth-signin | |
| `/disasters` | 01-disaster-portfolio | Lifecycle tabs, search, quick filters, Columns picker (remembered), Archive/Restore, onboarding tour |
| `/project-overview` | 02-project-detail | |
| `/document-library` | 03-document-library | Filing cabinet, queues strip, checklist, upload modal with AI rules, column auto-fit |
| `/library-empty` | 03b-document-library-empty | |
| `/unplaced-inbox` | 03c-unplaced-inbox | Folder picker, remove with confirm |
| `/document-review` | 04-document-review | |
| `/cross-check` | 05-cross-check | Worker findings queue, Request Attestation |
| `/import-wizard` | 06-import-wizard | "Import Data" in the account menu |
| `/pre-submission` | 07-presubmission | |
| `/supervisor-signature` | 08-supervisor-signature | Draw / Type / Upload signature, certificate PDF (jsPDF) |
| `/upload` → `/analyzing` → `/analysis-report` | 12, 13, 14 | Upload flow; AI placement is simulated from the file name (`classify()` in loader.html) |
| `/team` | 15-team-management | Invite, pending invites, members, role matrix |
| `/security`, `/profile`, `/disaster-scope`, `/policy-thresholds`, `/finding-overrides`, `/notifications`, `/data-retention`, `/reviewer-patterns` | 16, 10, 17, 18, 19, 11, 20, 21 | Settings, same information architecture as the live app |
