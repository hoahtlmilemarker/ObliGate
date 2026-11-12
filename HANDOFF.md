# Dev handoff – prototype vs React (`src/`)

The prototype (`/prototype`, source in `/prototype-src`) is ahead of the React app. Port in this order; each item names the prototype page to copy behaviour from.

## 1. Account menu and Settings (match the live app) — ✅ ported (`src/pages/Settings`, `src/layout/AccountMenu.tsx`)
- **Account menu** (`AccountMenu.tsx`): header with name + email; items **Import Data** (`/import`), **Team** (`/team`), **Settings** (`/settings/security`); checkbox **"Private device: 24-hour idle window"** (off = 30-minute idle timeout, persisted per browser); **Sign out**. Remove My Profile / Notification Settings / Search / Theme / Help items (search and theme stay in the header).
- **Settings shell**: left nav grouped as in the live app – Account: Security · Organization: Profile & branding, Disasters & scope · Compliance Engine: Policy & thresholds, Finding overrides · Workspace: Notifications, Data & retention · FEMA Pattern Memory: Reviewer patterns. Below 1100px the nav becomes a horizontal scrolling tab row.
- **Security**: TOTP authenticator list; "Add authenticator" dialog (QR, secret key, 6-digit code, validation); remove with confirm.
- **Profile & branding**: Profile (full name, job title, Save enabled only when dirty); Account (new + confirm password, ≥ 12 chars, must match; change email sends verification link and shows "change pending").
- **Policy & thresholds**: Micro-purchase 15,000 / Simplified acquisition 350,000 / Large project 1,000,000 vs FEMA floor; status chip At floor / +N% above / Below floor (blocks save); sticky save bar; Reset to FEMA defaults (confirm); after save offer Rescan.
- **Finding overrides**: empty state (no create flow in the live app yet).
- **Notifications**: bi-weekly eCAPS import reminders per department (cadence, anchor weekday, last import, next reminder / overdue, enable switch). Replaces the old per-event notification matrix.
- **Disasters & scope**, **Data & retention**: "Coming soon" state.
- **Reviewer patterns**: "No patterns recorded yet" + Vendor familiarity table (filter, refresh; Trusted / Compliance risk / Neutral).

## 2. Team (`/team`, page 15) — ✅ ported (`src/pages/Team`)
Overview counts, prototype-only "Viewing as" switch (manager vs analyst), invite form (email validation, duplicate member / pending invite checks, Department required for Department Liaison, role description + capability chips), pending invitations (Resend / Send Again / Revoke with confirm), members table (search incl. role, role filter, inline role select with Undo, confirm when granting or removing Grants Manager, remove with confirm + Undo, cannot remove yourself), role × capability matrix. Read-only notice for non-managers.

## 3. Upload → Analysis → Report (pages 12–14) and Unplaced Inbox
Duplicate detection (Skip / Replace / Skip all / Replace all with compare dialog), 6-row preview with Show more, cancel restores the list, per-project grouping by PW and DR, tiers auto ≥ 85% / check 60–84% / inbox < 60%, folder picker popover, Library rows for filed uploads. Real API replaces `classify()`; keep the same tiers and states.

## 4. Smaller behaviour already in the prototype
- Disasters: lifecycle tabs filter the table; search + quick filters with empty state; Archive/Restore buttons; Columns picker persisted per page; tablet drawer as tiles; KPI 2×2 on tablet.
- Library: in-page upload uses the same AI rules as the upload flow; action button shows the actual fix (Resolve, Request Signature, Request Attestation, Review); Employee/Value columns sized from content and table width (no viewport-based widths); header band shrinks when the checklist card is hidden.
- Cross-Check: "Request Attestation" button on Missing Log workers.
- Global: responsive type scale (tablet 94%, mobile 88%, small-text floor); thin scrollbars with transparent track; disaster switcher dropdown in the header.

## Not yet in the prototype (from the live app screenshots)
Header nav (Document Library / Cross-Check / Disasters, "+ New", "Jump to project", bell) and the live All disasters list columns (Status, Disaster, Region · declared, Status & next action, Exposure; Add filter; Sorted: Priority).
