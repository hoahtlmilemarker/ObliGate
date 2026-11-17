import { Box, ButtonBase, Popover, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingIcon, ChevronRightIcon, ClockIcon, GearIcon, ImportIcon, PrivateDeviceIcon, SignOutIcon, UsersIcon } from '@/icons';
import { useToast } from '@/components';
import { brand } from '@/theme/tokens';
import { currentUser, routes } from './nav';

const PRIVATE_KEY = 'og-private';

/** Gold label colours — slightly deeper than `og.brass` in light mode for AA contrast on white. */
const goldLabel = (t: Theme) => (t.palette.mode === 'dark' ? '#E2C27E' : '#A57F3C');
const goldInk = (t: Theme) => (t.palette.mode === 'dark' ? '#E2C27E' : '#8A6A2E');

const tileSx = (size: number): SxProps<Theme> => ({
  flex: 'none',
  width: size,
  height: size,
  display: 'grid',
  placeItems: 'center',
  borderRadius: '4px',
  transition: 'background-color .15s, box-shadow .15s',
});

/** One row in the Workspace group: icon tile, title + description, chevron revealed on hover/focus. */
function MenuRow({ icon, title, description, onClick }: { icon: ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <ButtonBase
      role="menuitem"
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: 48,
        p: '7px 10px 7px 7px',
        gap: '12px',
        justifyContent: 'flex-start',
        textAlign: 'left',
        borderRadius: '4px',
        '& .um-tile': { bgcolor: 'og.blueTint', color: 'og.blue' },
        '& .um-ch': { color: 'og.gray', opacity: 0, transform: 'translateX(-4px)', transition: 'opacity .15s, transform .15s' },
        '&:hover, &.Mui-focusVisible': {
          bgcolor: 'og.pale',
          '& .um-title': { color: 'og.blue' },
          '& .um-tile': { bgcolor: 'og.card', boxShadow: (t) => `0 0 0 1px ${t.palette.mode === 'dark' ? 'rgba(90,167,230,.35)' : 'rgba(0,90,156,.25)'}` },
          '& .um-ch': { opacity: 1, transform: 'none', color: 'og.blue' },
        },
      }}
    >
      <Box className="um-tile" sx={tileSx(34)}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Typography className="um-title" sx={{ font: '700 13.5px/1.25 Manrope, Arial, sans-serif', color: 'og.head' }}>
          {title}
        </Typography>
        <Typography noWrap sx={{ font: '500 11.5px/1.35 Manrope, Arial, sans-serif', color: 'og.gray' }}>
          {description}
        </Typography>
      </Box>
      <ChevronRightIcon className="um-ch" size={14} strokeWidth={1.8} />
    </ButtonBase>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <Typography component="span" sx={{ display: 'block', p: '4px 10px 6px', font: '800 10px/1 Manrope, Arial, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: goldLabel }}>
      {children}
    </Typography>
  );
}

/** Avatar button in the header + account menu (Workspace links, Private device session switch, Sign out). */
export function AccountMenu(_props: { onOpenSearch?: () => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [privateDevice, setPrivateDevice] = useState(() => {
    try {
      return localStorage.getItem(PRIVATE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const close = () => setAnchor(null);
  const go = (to: string) => {
    close();
    navigate(to);
  };
  const togglePrivate = () => {
    const on = !privateDevice;
    setPrivateDevice(on);
    try {
      localStorage.setItem(PRIVATE_KEY, on ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
    // Menu stays open so the user sees the new state; the toast confirms the idle window.
    toast({ title: on ? 'Private device on' : 'Private device off', message: on ? 'you stay signed in after up to 24 hours idle' : 'idle sessions end after 30 minutes' });
  };
  const signOut = () => {
    try {
      sessionStorage.removeItem('og-page');
      sessionStorage.removeItem('og-ld');
    } catch {
      /* storage unavailable */
    }
    go(routes.signIn);
  };

  /** Arrow / Home / End move focus between menu items, like a native menu. */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []);
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
    }
  };

  return (
    <>
      <ButtonBase
        aria-label={`Account menu for ${currentUser.name}`}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          backgroundImage: brand.avatarGradient,
          color: brand.navy,
          fontSize: 12,
          fontWeight: 800,
          transition: 'box-shadow .15s',
          '&:hover, &[aria-expanded="true"]': { boxShadow: '0 0 0 2px rgba(255,255,255,.18), 0 0 0 4px rgba(201,164,92,.55)' },
          '&.Mui-focusVisible': { boxShadow: '0 0 0 2px #fff, 0 0 0 4px #C9A45C' },
        }}
      >
        {currentUser.initials}
      </ButtonBase>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionProps={{
          onEntered: () => panel.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus(),
        }}
        slotProps={{
          paper: {
            sx: (t: Theme) => ({
              mt: 1,
              width: 320,
              maxWidth: 'calc(100vw - 16px)',
              overflow: 'hidden',
              border: `1px solid ${t.palette.og.line}`,
              borderTop: `2px solid ${t.palette.og.brass}`,
              borderRadius: '4px',
              boxShadow: t.palette.mode === 'dark' ? t.palette.og.menuShadow : '0 22px 50px -22px rgba(6,36,63,.38), 0 2px 8px rgba(6,36,63,.06)',
            }),
          },
        }}
      >
        <Box ref={panel} role="menu" aria-label="Account" onKeyDown={onKeyDown}>
          {/* Identity */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              p: '18px 18px 16px',
              borderBottom: 1,
              borderColor: 'og.lineSoft',
              background: (t) => `linear-gradient(180deg, ${t.palette.og.blueTint}, transparent 90%)`,
            }}
          >
            <Box
              aria-hidden
              sx={{
                flex: 'none',
                width: 46,
                height: 46,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundImage: brand.avatarGradient,
                color: brand.navy,
                fontSize: 14,
                fontWeight: 800,
                boxShadow: (t) => `0 0 0 2px ${t.palette.og.card}, 0 0 0 3.5px #C9A45C, 0 6px 14px -8px rgba(6,36,63,.5)`,
              }}
            >
              {currentUser.initials}
            </Box>
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.01em', color: 'og.head' }}>{currentUser.name}</Typography>
                <Box
                  component="span"
                  sx={{ display: 'inline-flex', alignItems: 'center', height: 20, px: '7px', borderRadius: '4px', bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(226,194,126,.12)' : 'rgba(176,138,78,.13)'), color: goldInk, font: '800 10.5px/1 Manrope, Arial, sans-serif', letterSpacing: '.04em' }}
                >
                  {currentUser.role}
                </Box>
              </Box>
              <Typography noWrap sx={{ fontSize: 12.5, color: 'og.gray' }}>
                {currentUser.email}
              </Typography>
              <Box sx={{ mt: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: 12, fontWeight: 600, lineHeight: 1.35, color: 'og.gray' }}>
                <BuildingIcon size={12} strokeWidth={2} style={{ flex: 'none', opacity: 0.75 }} />
                {currentUser.org}
              </Box>
            </Box>
          </Box>

          {/* Workspace */}
          <Box sx={{ p: '8px 8px 6px', borderBottom: 1, borderColor: 'og.lineSoft' }}>
            <GroupLabel>Workspace</GroupLabel>
            <MenuRow icon={<ImportIcon size={18} />} title="Import Data" description="Spreadsheets & payroll exports" onClick={() => go(routes.importWizard)} />
            <MenuRow icon={<UsersIcon size={18} />} title="Team" description="Members, roles & invites" onClick={() => go(routes.team)} />
            <MenuRow icon={<GearIcon size={18} />} title="Settings" description="Security, policy & notifications" onClick={() => go(routes.settings)} />
          </Box>

          {/* Session */}
          <Box sx={{ p: '8px 8px 6px', borderBottom: 1, borderColor: 'og.lineSoft' }}>
            <GroupLabel>Session</GroupLabel>
            <ButtonBase
              role="menuitemcheckbox"
              aria-checked={privateDevice}
              title="Shared across ObliGate tabs. Other security rules may end your session earlier."
              onClick={togglePrivate}
              sx={{
                width: '100%',
                minHeight: 52,
                p: '6px 10px',
                gap: '12px',
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: '4px',
                '&:hover': { bgcolor: 'og.pale' },
                '&.Mui-focusVisible .um-sw': { boxShadow: '0 0 0 3px rgba(0,90,156,.25)' },
              }}
            >
              <Box
                sx={{
                  ...tileSx(34),
                  bgcolor: privateDevice ? 'og.goodTint' : (t: Theme) => (t.palette.mode === 'dark' ? t.palette.og.brassTint : 'rgba(176,138,78,.12)'),
                  color: privateDevice ? 'og.good' : goldInk,
                }}
              >
                <PrivateDeviceIcon size={18} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography sx={{ font: '700 13.5px/1.25 Manrope, Arial, sans-serif', color: 'og.head' }}>Private device</Typography>
                <Typography noWrap sx={{ font: '500 11.5px/1.35 Manrope, Arial, sans-serif', color: privateDevice ? 'og.good' : 'og.gray' }}>
                  {privateDevice ? 'On · stays signed in up to 24 h idle' : 'Off · signs out after 30 min idle'}
                </Typography>
              </Box>
              <Box
                className="um-sw"
                aria-hidden
                sx={{
                  flex: 'none',
                  position: 'relative',
                  width: 36,
                  height: 20,
                  borderRadius: '10px',
                  bgcolor: privateDevice ? 'og.good' : 'og.line',
                  transition: 'background-color .18s',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 2,
                    top: 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    boxShadow: '0 1px 3px rgba(6,36,63,.3)',
                    transform: privateDevice ? 'translateX(16px)' : 'none',
                    transition: 'transform .2s cubic-bezier(.3,.7,.4,1)',
                  },
                }}
              />
            </ButtonBase>
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: '6px 8px', bgcolor: 'og.pale' }}>
            <ButtonBase
              role="menuitem"
              onClick={signOut}
              sx={{ flex: 'none', minHeight: 38, p: '4px 12px 4px 6px', gap: '12px', borderRadius: '4px', '&:hover, &.Mui-focusVisible': { bgcolor: 'og.riskTint' } }}
            >
              <Box sx={{ ...tileSx(28), bgcolor: 'og.riskTint', color: 'og.risk' }}>
                <SignOutIcon size={16} />
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'og.risk' }}>Sign out</Typography>
            </ButtonBase>
            <Box
              component="span"
              title="For security, ObliGate signs you out after 30 minutes without activity."
              sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', pr: 1, fontSize: 11, fontWeight: 600, color: 'og.gray', whiteSpace: 'nowrap' }}
            >
              <ClockIcon size={12} />
              Auto sign-out after 30 min idle
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
