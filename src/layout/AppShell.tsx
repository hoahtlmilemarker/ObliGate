import { Box, ButtonBase, Collapse, useMediaQuery, type Theme } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { ChevronDownIcon, MenuIcon } from '@/icons';
import { AppHeader, type AppHeaderProps } from './AppHeader';
import { PageSkeleton, pageIn, useRouteLoading } from './RouteLoading';

export interface AppShellProps extends AppHeaderProps {
  /** Left rail content (queues, filters, tree). Omit for full-width pages. */
  sidebar?: ReactNode;
  /** Label of the collapsed sidebar toggle shown at ≤1024px, e.g. "Queues & filing cabinet". */
  sidebarLabel?: string;
  children: ReactNode;
}

/**
 * Application frame: sticky navy header, optional 304px left rail, main column.
 * At ≤1024px the rail collapses behind a full-width toggle bar.
 */
export function AppShell({ sidebar, sidebarLabel = 'Filters', children, ...header }: AppShellProps) {
  const compact = useMediaQuery((t: Theme) => t.breakpoints.down('lg'));
  const [open, setOpen] = useState(false);
  const loading = useRouteLoading();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'og.bg' }}>
      <AppHeader {...header} />
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: sidebar && !compact ? '304px minmax(0,1fr)' : 'minmax(0,1fr)' }}>
        {sidebar &&
          (compact ? (
            <Box sx={{ bgcolor: 'og.card', borderBottom: 1, borderColor: 'og.line' }}>
              <ButtonBase
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                sx={{ width: '100%', justifyContent: 'flex-start', gap: 2.5, minHeight: 48, px: 4, fontSize: 13, fontWeight: 700, color: 'og.head' }}
              >
                <MenuIcon size={18} />
                <span>{sidebarLabel}</span>
                <Box sx={{ ml: 'auto', display: 'flex', color: 'og.gray', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                  <ChevronDownIcon size={14} />
                </Box>
              </ButtonBase>
              <Collapse in={open}>
                <Box component="aside" sx={{ p: '8px 16px 16px' }}>
                  {sidebar}
                </Box>
              </Collapse>
            </Box>
          ) : (
            <Box sx={{ bgcolor: 'og.card', borderRight: 1, borderColor: 'og.line' }}>
              {/* Rail sticks under the header and scrolls on its own when taller than the window, so nothing is cut off. */}
              <Box
                component="aside"
                sx={{
                  position: 'sticky',
                  top: 56,
                  maxHeight: 'calc(100vh - 56px)',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  p: '20px 16px 24px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: (t) => `${t.palette.og.line} transparent`,
                }}
              >
                {sidebar}
              </Box>
            </Box>
          ))}
        <Box component="main" aria-busy={loading || undefined} sx={{ position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px)' }}>
          {loading && <PageSkeleton />}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, animation: loading ? 'none' : `${pageIn} .38s cubic-bezier(.2,.7,.2,1) both`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
