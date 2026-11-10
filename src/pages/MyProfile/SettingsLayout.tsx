import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppShell, routes } from '@/layout';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';

/**
 * Shared frame for the account settings screens (10 My Profile, 11 Notification Settings):
 * full-bleed masthead, tab strip, two-column sections, dotted gutters and the sticky save bar.
 */
const MOBILE = '@media (max-width:900px)';

function ProfileGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" fill="currentColor" fillOpacity=".18" />
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" />
    </svg>
  );
}

function BellGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z" fill="currentColor" fillOpacity=".18" />
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z" />
      <path d="M10 21h4" />
    </svg>
  );
}

const tabs = [
  { key: 'profile', label: 'My Profile', to: routes.profile, icon: <ProfileGlyph /> },
  { key: 'notifications', label: 'Notification Settings', to: routes.notifications, icon: <BellGlyph /> },
] as const;

export interface SettingsPageProps {
  active: 'profile' | 'notifications';
  title: string;
  subtitle: string;
  illustration: string;
  children: ReactNode;
  /** Save bar rendered under the form column. */
  footer: ReactNode;
}

export function SettingsPage({ active, title, subtitle, illustration, children, footer }: SettingsPageProps) {
  return (
    <AppShell searchLabel="Search...">
      <Box
        sx={(t) => ({
          position: 'relative',
          flex: 1,
          bgcolor: 'og.pale',
          // dotted backdrop in the side gutters
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 320,
            bottom: 0,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(${t.palette.mode === 'dark' ? 'rgba(140,180,230,.22)' : 'rgba(0,90,156,.34)'} 1.3px, transparent 1.6px)`,
            backgroundSize: '16px 16px',
            maskImage:
              'linear-gradient(90deg,#000 0%,rgba(0,0,0,.55) 9%,transparent 15%,transparent 85%,rgba(0,0,0,.55) 91%,#000 100%), linear-gradient(180deg,transparent 0%,#000 120px,#000 70%,transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          },
        })}
      >
        <Masthead variant="settings" illustration={illustration} eyebrow={<MastheadEyebrow>Account Settings</MastheadEyebrow>} title={title} subtitle={subtitle} />

        <Box sx={{ position: 'relative', zIndex: 1, px: '28px', pb: 12 }}>
          <Box sx={{ width: '100%', maxWidth: 1040, mx: 'auto', pb: 24 }}>
            <Box component="nav" aria-label="Account settings" sx={{ display: 'flex', gap: 1, m: '24px 0 8px', borderBottom: 1, borderColor: 'og.line' }}>
              {tabs.map((tab) => {
                const on = tab.key === active;
                return (
                  <Box
                    key={tab.key}
                    component={RouterLink}
                    to={tab.to}
                    aria-current={on ? 'page' : undefined}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      height: 44,
                      px: '14px',
                      mb: '-1px',
                      borderBottom: '2px solid',
                      borderBottomColor: on ? '#B08A4E' : 'transparent',
                      fontSize: 13.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      color: on ? 'og.head' : 'og.gray',
                      '& svg': { color: on ? '#B08A4E' : 'currentColor', opacity: on ? 1 : 0.8, flex: 'none' },
                      '&:hover': { color: on ? 'og.head' : 'og.ink' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: -2 },
                      '@media (max-width:400px)': { px: '10px' },
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </Box>
                );
              })}
            </Box>
            <div>{children}</div>
            {footer}
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
}

/** Two-column section: heading + help text on the left, card on the right. */
export function SettingsSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        display: 'grid',
        gridTemplateColumns: '280px minmax(0,1fr)',
        gap: 8,
        py: 8,
        borderBottom: 1,
        borderColor: 'og.lineSoft',
        '&:last-of-type': { borderBottom: 0 },
        [MOBILE]: { gridTemplateColumns: 'minmax(0,1fr)', gap: 3, py: 6 },
      }}
    >
      <div>
        <Typography component="h2" sx={{ m: '0 0 6px', fontSize: 20, fontWeight: 300, lineHeight: 1.55, letterSpacing: '-0.02em', color: 'og.head' }}>
          {title}
        </Typography>
        <Typography component="p" sx={{ m: 0, fontSize: 13, lineHeight: 1.55, color: 'og.gray' }}>
          {description}
        </Typography>
      </div>
      <Box sx={{ minWidth: 0, border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', overflow: 'hidden' }}>{children}</Box>
    </Box>
  );
}

/** Padded card body. */
export function CardBody({ children }: { children: ReactNode }) {
  return <Box sx={{ p: '20px 24px' }}>{children}</Box>;
}

/** Title + help text on the left, control on the right (prototype `.st-row`). */
export function SettingRow({ title, description, children, labelId }: { title: string; description: string; children?: ReactNode; labelId?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        py: 3.5,
        borderTop: 1,
        borderColor: 'og.lineSoft',
        '&:first-of-type': { borderTop: 0, pt: 0 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box component="b" id={labelId} sx={{ display: 'block', fontSize: 14, lineHeight: 1.55, color: 'og.head' }}>
          {title}
        </Box>
        <Box component="small" sx={{ display: 'block', mt: '3px', fontSize: 12.5, lineHeight: 1.45, color: 'og.gray' }}>
          {description}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

/** Pill toggle (prototype `.sw`, 36×20). */
export function ToggleSwitch({ checked, onChange, label, sx }: { checked: boolean; onChange: (v: boolean) => void; label: string; sx?: object }) {
  return (
    <Box
      component="button"
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      sx={{
        position: 'relative',
        display: 'block',
        flex: 'none',
        width: 36,
        height: 20,
        p: 0,
        border: 0,
        borderRadius: 999,
        bgcolor: checked ? 'og.blue' : 'og.line',
        cursor: 'pointer',
        transition: 'background .18s',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 2,
          left: 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(0,0,0,.25)',
          transform: checked ? 'translateX(16px)' : 'none',
          transition: 'transform .18s',
        },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: 2 },
        ...sx,
      }}
    />
  );
}

/** Save / discard bar under the form column; sticks to the viewport bottom while there are unsaved changes. */
export function SaveBar({ dirty, onSave, onDiscard }: { dirty: boolean; onSave: () => void; onDiscard: () => void }) {
  return (
    <Box
      role="region"
      aria-label="Unsaved changes"
      sx={{ position: dirty ? 'sticky' : 'relative', bottom: 16, zIndex: 20, m: '8px 0 0 312px', [MOBILE]: { ml: 0 } }}
    >
      <Box
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: '10px 10px 10px 18px',
          bgcolor: 'og.card',
          border: 1,
          borderColor: dirty ? '#B08A4E' : t.palette.og.line,
          borderRadius: '4px',
          boxShadow: dirty ? '0 8px 24px -12px rgba(6,36,63,.16)' : '0 1px 2px rgba(6,36,63,.05)',
          transition: 'border-color .2s, box-shadow .2s',
          '& .MuiButton-root.Mui-disabled': { opacity: 0.45 },
        })}
      >
        <Box component="span" aria-live="polite" sx={{ mr: 'auto', alignSelf: 'center', fontSize: 13, lineHeight: 1.55, color: dirty ? 'og.warn' : 'og.gray', fontWeight: dirty ? 700 : 500 }}>
          {dirty ? 'Unsaved changes' : 'No unsaved changes'}
        </Box>
        <Button variant="outlined" disabled={!dirty} onClick={onDiscard} sx={{ '&.Mui-disabled': { color: 'og.head', borderColor: 'og.line', bgcolor: 'og.card' } }}>
          Discard
        </Button>
        <Button variant="contained" disabled={!dirty} onClick={onSave} sx={(t) => ({ '&.Mui-disabled': { color: '#FFFFFF', bgcolor: t.palette.og.buttonBlue, borderColor: t.palette.og.buttonBlue } })}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
