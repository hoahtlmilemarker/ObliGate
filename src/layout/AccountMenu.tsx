import { Box, ButtonBase, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, SettingsIcon, SignOutIcon, UsersIcon } from '@/icons';
import { useToast } from '@/components';
import { brand } from '@/theme/tokens';
import { currentUser, routes } from './nav';

/** Avatar button in the header + account dropdown. */
export function AccountMenu(_props: { onOpenSearch?: () => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const [privateDevice, setPrivateDevice] = useState(() => {
    try {
      return localStorage.getItem('og-private') === '1';
    } catch {
      return false;
    }
  });
  const toast = useToast();
  const close = () => setAnchor(null);
  const go = (to: string) => {
    close();
    navigate(to);
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
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 296 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: '10px 10px 12px', mb: 1, borderBottom: 1, borderColor: 'og.lineSoft' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundImage: brand.avatarGradient, color: brand.navy, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, flex: 'none' }}>
            {currentUser.initials}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{currentUser.name}</Typography>
            <Typography sx={{ fontSize: 12, color: 'og.gray' }} noWrap>
              {currentUser.email}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: 'og.gray', opacity: 0.8 }} noWrap>
              {currentUser.role} · {currentUser.org}
            </Typography>
          </Box>
        </Box>
        <MenuItem onClick={() => go(routes.importWizard)}>
          <DownloadIcon /> Import Data
        </MenuItem>
        <MenuItem onClick={() => go(routes.team)}>
          <UsersIcon /> Team
        </MenuItem>
        <MenuItem onClick={() => go(routes.settings)}>
          <SettingsIcon /> Settings
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'og.lineSoft' }} />
        <Box component="label" sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', m: '2px 4px', p: '10px', borderRadius: '4px', cursor: 'pointer', '&:hover': { bgcolor: 'og.pale' } }}>
          <Box
            component="input"
            type="checkbox"
            checked={privateDevice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const on = e.target.checked;
              setPrivateDevice(on);
              try {
                localStorage.setItem('og-private', on ? '1' : '0');
              } catch {
                /* storage unavailable */
              }
              toast({ title: on ? 'Private device on' : 'Private device off', message: on ? 'you stay signed in after up to 24 hours idle' : 'idle sessions end after 30 minutes' });
            }}
            sx={{ flex: 'none', width: 16, height: 16, m: '2px 0 0', accentColor: 'var(--mui-palette-primary-main, #005A9C)' }}
          />
          <span>
            <Box component="b" sx={{ display: 'block', fontSize: 13, fontWeight: 700, lineHeight: 1.35, color: 'og.head' }}>Private device: 24-hour idle window</Box>
            <Box component="small" sx={{ display: 'block', mt: 1, fontSize: 11.5, lineHeight: 1.45, color: 'og.gray' }}>
              Off: 30 minutes. Shared across ObliGate tabs; other security rules may end your session earlier.
            </Box>
          </span>
        </Box>
        <Divider sx={{ my: 1, borderColor: 'og.lineSoft' }} />
        <MenuItem onClick={() => go(routes.signIn)} sx={{ color: 'og.risk', '&:hover': { color: 'og.risk', bgcolor: 'og.riskTint' } }}>
          <SignOutIcon /> Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
