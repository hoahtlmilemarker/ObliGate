import { Box, IconButton, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LogoMark, ThemeIcon } from '@/icons';
import { routes } from '@/layout';
import { useColorMode } from '@/theme/ColorModeProvider';
import { brand } from '@/theme/tokens';
import wordmark from '@/assets/obligate-wordmark.svg';
import { attestation } from '@/data/supervisorSignature';

/**
 * Header of the Field Verification Portal (08). Field supervisors sign in through an emailed link,
 * so there is no primary navigation, search or account menu — only the signer and the theme toggle.
 */
export function PortalHeader() {
  const { mode, toggle } = useColorMode();
  const { supervisor } = attestation;
  const label = `Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 6,
        minHeight: 56,
        px: 9,
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', pl: 4, borderLeft: '1px solid rgba(255,255,255,.2)', fontSize: 12, lineHeight: 1.35, flex: 'none', '@media (max-width:640px)': { display: 'none' } }}>
        <Box component="span" sx={{ color: brand.onDark2 }}>
          {attestation.portal}
        </Box>
        <Box component="b" sx={{ letterSpacing: '0.04em' }}>
          {attestation.disaster}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 'auto', py: '10px', flex: 'none' }}>
        <Box component="span" sx={{ fontSize: 13.5, lineHeight: 1.35, textAlign: 'right', color: brand.onDark2 }}>
          Supervisor:{' '}
          <Box component="strong" sx={{ color: '#FFFFFF' }}>
            {supervisor.name}
          </Box>
          <br />({supervisor.role})
        </Box>
        <Tooltip title={label}>
          <IconButton
            onClick={toggle}
            aria-label={label}
            sx={{ width: 36, height: 36, border: `1px solid ${brand.onDarkLine}`, color: '#FFFFFF', '&:hover': { borderColor: 'rgba(255,255,255,.6)', bgcolor: 'rgba(255,255,255,.05)', color: '#FFFFFF' } }}
          >
            <ThemeIcon size={16} strokeWidth={1.6} />
          </IconButton>
        </Tooltip>
        <Box
          component="span"
          title={supervisor.name}
          sx={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: brand.navy, backgroundImage: brand.avatarGradient }}
        >
          {supervisor.initials}
        </Box>
      </Box>
    </Box>
  );
}
