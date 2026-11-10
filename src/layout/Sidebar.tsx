import { Box, ButtonBase, Collapse, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDownIcon } from '@/icons';
import { CountBadge } from '@/components';

/** Collapsible sidebar section with uppercase label and optional scope line. */
export function SidebarSection({ label, scope, children, defaultOpen = true, collapsible = true }: { label: string; scope?: string; children: ReactNode; defaultOpen?: boolean; collapsible?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const head = (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', mb: 2.5 }}>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="label">{label}</Typography>
        {scope && <Typography sx={{ fontSize: 11, color: 'og.gray', mt: 0.5 }}>{scope}</Typography>}
      </Box>
      {collapsible && (
        <Box sx={{ color: 'og.gray', display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform .15s', mt: 0.5 }}>
          <ChevronDownIcon size={12} />
        </Box>
      )}
    </Box>
  );
  return (
    <Box component="section" sx={{ mb: 5 }}>
      {collapsible ? (
        <ButtonBase onClick={() => setOpen((o) => !o)} aria-expanded={open} sx={{ width: '100%', display: 'block', borderRadius: '4px' }}>
          {head}
        </ButtonBase>
      ) : (
        head
      )}
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
}

/** Queue button (e.g. "To Review (Extraction) 14"). `active` = filled blue. */
export function QueueItem({ icon, label, count, to, active }: { icon?: ReactNode; label: string; count?: number; to: string; active?: boolean }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      aria-current={active ? 'page' : undefined}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        height: 40,
        px: '9px',
        mb: 2,
        borderRadius: '4px',
        fontSize: 13,
        fontWeight: 600,
        border: '1px solid transparent',
        ...(active
          ? { bgcolor: theme.palette.og.buttonBlue, color: '#FFFFFF', borderColor: theme.palette.og.buttonBlue }
          : { bgcolor: theme.palette.mode === 'dark' ? 'rgba(120,170,230,.12)' : theme.palette.og.blueTint, color: theme.palette.mode === 'dark' ? '#CFE3F5' : theme.palette.og.blue }),
        '&:hover': { color: active ? '#FFFFFF' : undefined, filter: 'brightness(0.97)' },
      })}
    >
      {icon && <Box sx={{ display: 'flex', flex: 'none' }}>{icon}</Box>}
      <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
        {label}
      </Box>
      {count != null && (
        <CountBadge tone={active ? 'onPrimary' : 'neutral'} sx={(t) => (active ? {} : { bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,.08)' : '#FFFFFF', color: t.palette.mode === 'dark' ? '#CFE3F5' : t.palette.og.blue })}>
          {count}
        </CountBadge>
      )}
    </Box>
  );
}

/** Simple navigation row (Disaster Portfolio lifecycle list). */
export function SidebarNavItem({ label, count, active, tone, onClick }: { label: string; count?: number; active?: boolean; tone?: 'risk'; onClick?: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      sx={(theme) => ({
        width: '100%',
        justifyContent: 'space-between',
        height: 44,
        px: 4,
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        borderRadius: '0 4px 4px 0',
        borderLeft: `3px solid ${active ? theme.palette.og.blue : theme.palette.og.line}`,
        color: active ? theme.palette.og.blue : theme.palette.og.gray,
        bgcolor: active ? theme.palette.og.blueTint : 'transparent',
        '&:hover': { color: theme.palette.og.head, bgcolor: active ? theme.palette.og.blueTint : theme.palette.og.pale },
      })}
    >
      <span>{label}</span>
      {count != null && (
        <Box component="span" sx={(t) => ({ fontSize: 12, fontWeight: 700, color: tone === 'risk' ? t.palette.og.risk : active ? t.palette.og.blue : t.palette.og.gray })}>
          {count}
        </Box>
      )}
    </ButtonBase>
  );
}
