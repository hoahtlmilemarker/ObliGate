# ObliGate — Web UI (React + MUI)

> **Deployment:** Vercel serves the static HTML design prototype in `/prototype` (see `vercel.json`). The React app in `/src` is the dev handoff source; run it locally with `npm run dev`.

React 19 + TypeScript + Vite + MUI 7 implementation of the approved ObliGate UI (13 screens, Light/Dark, responsive 1440 / 768 / 390).
All names, amounts and IDs on screen are **sample data** from the approved prototype (`src/data/*`) — replace with the typed API.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/ (also copies /prototype)
```

## Structure
| Path | What |
|---|---|
| `src/theme/tokens.ts` | Design tokens (Light/Dark) — same values as the Figma "Color" variables |
| `src/theme/index.ts` | MUI theme: palette (`theme.palette.og.*`), typography variants (`display`, `eyebrow`, `label`), button variants (`brass`, `inverse`, `onDark`), 4px radius |
| `src/theme/ColorModeProvider.tsx` | Light/Dark toggle, persisted in `localStorage['og-theme']` |
| `src/layout/` | `AppShell` (header + collapsible sidebar), `AppHeader`, `AccountMenu`, `SearchDialog` (⌘K), `PageBanner`/`PageBody`, sidebar primitives, `routes` |
| `src/components/` | Shared UI: `StatusTag`, `CountBadge`, `FileTypeBadge`, `InitialsAvatar`, `LiftCard`/`Panel`, `SearchField`, `ResponsiveTable` (table → cards < 820px), `UploadModal`, `OgDialog`, `useToast`, `Spinner`/`PageLoader`, `EmptyState` |
| `src/icons/` | Icon set (stroke 1.7, 24px grid) |
| `src/pages/<Screen>/` | One folder per screen (page-specific components live next to the page) |
| `src/data/` | Sample data per screen |
| `prototype/` | Original static HTML prototype, served at `/prototype/` |

## Routes
`/sign-in` · `/disasters` · `/projects/:projectId` · `/library` · `/library/:projectId/:folder` · `/inbox` · `/review` · `/cross-check` · `/import` · `/pre-submission` · `/signature` · `/account/profile` · `/account/notifications`

## Notes for integration
- Breakpoints: `sm` 640, `md` 820, `lg` 1024, `xl` 1320. Spacing unit 4px.
- Tables use `ResponsiveTable` (MUI Table). Swap in `@mui/x-data-grid` where server-side paging/sorting is needed; keep the stacked-card layout below 820px.
- Some screens still carry page-local variants that can be promoted to shared components: banners with custom eyebrows (`ProjectDetail/ProjectBanner`, `DocumentLibrary/FolderBanner`, `PreSubmission/Masthead`), danger dialogs (`DocumentReview/ActionDialog`, `PreSubmission/ui`), `DisasterPortfolio/parts` (`BusyButton`, KPI cells).
