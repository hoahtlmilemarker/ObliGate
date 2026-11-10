import { Box, ButtonBase, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LogoMark, SearchIcon, ThemeIcon } from '@/icons';
import { CountBadge } from '@/components';
import { useColorMode } from '@/theme/ColorModeProvider';
import { brand } from '@/theme/tokens';
import wordmark from '@/assets/obligate-wordmark.svg';
import { AccountMenu } from './AccountMenu';
import { SearchDialog } from './SearchDialog';
import { currentDisaster, mainNav, routes, type MainNavKey } from './nav';

export interface AppHeaderProps {
  active?: MainNavKey;
  /** Placeholder in the header search button, e.g. "Search documents..." */
  searchLabel?: string;
}

/** Navy top bar: brand, org context, primary nav, search (⌘K), theme toggle, account menu. */
export function AppHeader({ active, searchLabel = 'Search documents...' }: AppHeaderProps) {
  const { mode, toggle } = useColorMode();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        display: 'flex',
        flexWrap: { xs: 'wrap', lg: 'nowrap' },
        alignItems: 'center',
        columnGap: 6,
        minHeight: 56,
        px: { xs: 4, md: 9 },
        bgcolor: brand.navy,
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255,255,255,.12)',
        '@media (max-width:900px)': { px: 4 },
      }}
    >
      <Box component={RouterLink} to={routes.disasters} aria-label="ObliGate home" sx={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 56, flex: 'none' }}>
        <LogoMark size={30} style={{ color: '#CFE0EF' }} />
        <Box component="img" src={wordmark} alt="ObliGate" sx={{ height: 17, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', pl: 4, borderLeft: '1px solid rgba(255,255,255,.2)', fontSize: 12, lineHeight: 1.35, flex: 'none' }}>
        <Box component="span" sx={{ color: brand.onDark2 }}>
          {currentDisaster.org}
        </Box>
        <Box component="b" sx={{ letterSpacing: '0.04em' }}>
          {currentDisaster.id}
        </Box>
      </Box>

      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          display: 'flex',
          alignSelf: 'stretch',
          ml: 3,
          '@media (max-width:900px)': {
            order: 9,
            flex: '1 0 100%',
            mx: -4,
            px: 1.5,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            borderTop: '1px solid rgba(255,255,255,.1)',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        {mainNav.map((n) => {
          const on = n.key === active;
          return (
            <Box
              key={n.key}
              component={RouterLink}
              to={n.to}
              aria-current={on ? 'page' : undefined}
              sx={{
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: { xs: 44, lg: 56 },
                minHeight: 44,
                px: '13px',
                fontSize: 13.5,
                fontWeight: on ? 700 : 500,
                whiteSpace: 'nowrap',
                color: on ? '#FFFFFF' : brand.onDark2,
                borderBottom: on ? `3px solid ${brand.gold}` : '3px solid transparent',
                backgroundImage: on ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.09) 100%)' : 'none',
                transition: 'color .15s, background .15s',
                '&:hover': { color: '#FFFFFF', backgroundColor: on ? undefined : 'rgba(255,255,255,.05)' },
              }}
            >
              {n.label}
              {n.count != null && <CountBadge tone={on ? 'gold' : 'onDark'}>{n.count}</CountBadge>}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 'auto', py: 2, flex: 'none' }}>
        <ButtonBase
          onClick={() => setSearchOpen(true)}
          aria-label={searchLabel.replace(/\.\.\.$/, '')}
          sx={{
            height: 36,
            gap: 2,
            px: 3,
            width: { xs: 36, sm: 'auto' },
            minWidth: { sm: 210 },
            justifyContent: { xs: 'center', sm: 'flex-start' },
            border: `1px solid ${brand.onDarkLine}`,
            borderRadius: '4px',
            color: brand.onDark2,
            fontSize: 13,
            fontWeight: 600,
            '&:hover': { borderColor: 'rgba(255,255,255,.6)', color: '#FFFFFF' },
          }}
        >
          <SearchIcon size={14} strokeWidth={2} />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, flex: 1, textAlign: 'left' }}>
            {searchLabel}
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: 12 }}>
            ⌘K
          </Box>
        </ButtonBase>
        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>
          <IconButton
            onClick={toggle}
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
            sx={{ width: 36, height: 36, border: `1px solid ${brand.onDarkLine}`, color: '#FFFFFF', '&:hover': { borderColor: 'rgba(255,255,255,.6)', bgcolor: 'rgba(255,255,255,.05)', color: '#FFFFFF' } }}
          >
            <ThemeIcon size={16} strokeWidth={1.6} />
          </IconButton>
        </Tooltip>
        <AccountMenu onOpenSearch={() => setSearchOpen(true)} />
      </Box>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
