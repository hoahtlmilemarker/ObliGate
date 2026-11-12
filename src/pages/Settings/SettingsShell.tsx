import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppShell } from '@/layout';
import { settingsPages, type SettingsKey } from '@/data/settings';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import cubes from './ill-cubes.svg';
import notif from './ill-notif.svg';
import profile from './ill-profile.svg';

const ILL: Record<SettingsKey, string> = { security: profile, profile, scope: cubes, policy: cubes, overrides: cubes, notifications: notif, data: cubes, patterns: cubes };

const ICON: Record<SettingsKey, ReactNode> = {
  security: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  profile: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" /></>,
  scope: <><path d="M12 3 3 8l9 5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
  policy: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  overrides: <><path d="M5 12h14M12 5v14" /><circle cx="12" cy="12" r="9" /></>,
  notifications: <><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z" /><path d="M10 21h4" /></>,
  data: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
  patterns: <path d="M3 17l5-6 4 4 4-7 5 9" />,
};

const NARROW = '@media (max-width:1100px)';

/**
 * Settings frame (prototype pages 10, 11, 16–21): masthead + grouped left nav + content column.
 * Groups and order follow the live app: Account · Organization · Compliance Engine · Workspace · FEMA Pattern Memory.
 */
export function SettingsShell({ active, children }: { active: SettingsKey; children: ReactNode }) {
  const meta = settingsPages.find((p) => p.key === active)!;
  const groups = [...new Set(settingsPages.map((p) => p.group))];
  return (
    <AppShell searchLabel="Search...">
      <Box sx={{ flex: 1, bgcolor: 'og.pale' }}>
        <Masthead variant="settings" illustration={ILL[active]} eyebrow={<MastheadEyebrow>Settings · {meta.group}</MastheadEyebrow>} title={meta.title} subtitle={meta.description} />
        <Box sx={{ px: '28px', pt: 7, pb: 6, '@media (max-width:640px)': { px: 4 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 10, alignItems: 'start', maxWidth: 1040, mx: 'auto', [NARROW]: { gridTemplateColumns: 'minmax(0,1fr)', gap: 4.5 } }}>
            <Box
              component="nav"
              aria-label="Settings"
              sx={{
                position: 'sticky',
                top: 84,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                [NARROW]: { position: 'static', flexDirection: 'row', overflowX: 'auto', gap: 1, pb: 1.5, borderBottom: 1, borderColor: 'og.line', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } },
              }}
            >
              {groups.map((g, gi) => (
                <Box key={g} sx={{ display: 'contents' }}>
                  <Box component="h6" sx={{ m: gi ? '16px 0 6px' : '0 0 6px', px: 3, fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9A7740', [NARROW]: { display: 'none' } }}>
                    {g}
                  </Box>
                  {settingsPages
                    .filter((p) => p.group === g)
                    .map((p) => {
                      const on = p.key === active;
                      return (
                        <Box
                          key={p.key}
                          component={RouterLink}
                          to={p.path}
                          aria-current={on ? 'page' : undefined}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                            flex: 'none',
                            height: 36,
                            px: 3,
                            borderLeft: '2px solid transparent',
                            borderRadius: '4px',
                            fontSize: 13.5,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            color: on ? 'og.blue' : 'og.ink',
                            bgcolor: on ? 'og.blueTint' : 'transparent',
                            ...(on && { borderLeftColor: 'og.blue', borderRadius: '0 4px 4px 0' }),
                            '& svg': { flex: 'none', color: on ? 'og.blue' : 'og.gray' },
                            '&:hover': { bgcolor: on ? 'og.blueTint' : 'og.card', color: on ? 'og.blue' : 'og.head' },
                            [NARROW]: { borderLeft: 0, borderBottom: '2px solid', borderBottomColor: on ? 'og.blue' : 'transparent', borderRadius: '4px 4px 0 0' },
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {ICON[p.key]}
                          </svg>
                          {p.label}
                        </Box>
                      );
                    })}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5.5, minWidth: 0 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
}
