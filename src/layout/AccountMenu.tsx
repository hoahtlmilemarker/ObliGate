import { Box, ButtonBase, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpIcon, KeyboardIcon, SignOutIcon, ThemeIcon, UserIcon, BellIcon } from '@/icons';
import { useColorMode } from '@/theme/ColorModeProvider';
import { useToast } from '@/components';
import { brand } from '@/theme/tokens';
import { currentUser, routes } from './nav';

/** Avatar button in the header + account dropdown. */
export function AccountMenu({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { mode, toggle } = useColorMode();
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
              {currentUser.role}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: 'og.gray', opacity: 0.8 }} noWrap>
              {currentUser.org}
            </Typography>
          </Box>
        </Box>
        <MenuItem onClick={() => go(routes.profile)}>
          <UserIcon /> My Profile
        </MenuItem>
        <MenuItem onClick={() => go(routes.notifications)}>
          <BellIcon /> Notification Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            onOpenSearch();
          }}
        >
          <KeyboardIcon /> Search
          <Box component="kbd" sx={{ ml: 'auto', px: 1.5, border: 1, borderColor: 'og.line', borderRadius: '4px', fontSize: 11, color: 'og.gray', bgcolor: 'og.pale', fontFamily: 'inherit' }}>
            ⌘K
          </Box>
        </MenuItem>
        <MenuItem onClick={toggle}>
          <ThemeIcon /> Theme
          <Box component="span" sx={{ ml: 'auto', fontSize: 12, color: 'og.gray' }}>
            {mode === 'dark' ? 'Dark' : 'Light'}
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            toast({ title: 'Help & Support', message: 'coming soon', tone: 'info' });
          }}
        >
          <HelpIcon /> Help &amp; Support
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'og.lineSoft' }} />
        <MenuItem onClick={() => go(routes.signIn)} sx={{ color: 'og.risk', '&:hover': { color: 'og.risk', bgcolor: 'og.riskTint' } }}>
          <SignOutIcon /> Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}
