import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import globe from '@/assets/banner-globe.svg';

/**
 * Navy page masthead used by the "solo" (no sidebar) screens 07, 08, 10 and 11.
 *
 * Local stand-in for the shared `PageBanner` because these screens need things the shared
 * banner does not offer yet: a free-form eyebrow (crumb link / status tag), a page-specific
 * illustration, and the settings layout (content column centred at 1040px, 40px title, no overlap).
 */
export interface MastheadProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Extra rows under the subtitle (status line, actions). */
  children?: ReactNode;
  /** Page illustration (SVG url) shown at the top-right from 641px. */
  illustration: string;
  /** `overlap` leaves room for a lift card pulled over the bottom edge; `settings` hugs its content. */
  variant?: 'overlap' | 'settings';
  subtitleSize?: number;
}

const SETTINGS_GUTTER = 'max(28px, calc((100% - 1040px) / 2))';

export function Masthead({ eyebrow, title, subtitle, children, illustration, variant = 'overlap', subtitleSize = 16 }: MastheadProps) {
  const settings = variant === 'settings';
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        color: '#FFFFFF',
        backgroundImage: 'radial-gradient(120% 160% at 85% 0%, #0B3358 0%, #06243F 60%)',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #B08A4E 20%, #B08A4E 80%, transparent)',
          opacity: 0.55,
        },
      }}
    >
      <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.24, pointerEvents: 'none' }} />
      <Box
        component="img"
        src={illustration}
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          pointerEvents: 'none',
          width: 'auto',
          ...(settings
            ? { right: SETTINGS_GUTTER, top: '50%', transform: 'translateY(-50%)', height: 150, maxWidth: 'min(36%, 500px)' }
            : { right: 28, top: 16, height: 164, maxWidth: { xs: 300, lg: '26%' } }),
          '@media (max-width:640px)': { display: 'none' },
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          ...(settings ? { p: '28px 24px 30px', pl: SETTINGS_GUTTER } : { p: '20px 28px 70px' }),
          '@media (min-width:961px)': { '& > *': { maxWidth: '70%' }, '& > h1': { maxWidth: '74%' } },
        }}
      >
        {eyebrow}
        <Typography
          variant="display"
          sx={{
            color: '#FFFFFF',
            overflowWrap: 'anywhere',
            fontSize: settings ? 'clamp(30px, 3.2vw, 40px)' : { xs: 30, md: 32.4 },
          }}
        >
          {title}
        </Typography>
        {subtitle && <Typography sx={{ m: 0, fontSize: subtitleSize, lineHeight: 1.6, color: 'rgba(255,255,255,.68)' }}>{subtitle}</Typography>}
        {children}
      </Box>
    </Box>
  );
}

/** Gold uppercase kicker used inside the masthead. */
export function MastheadEyebrow({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Typography variant="eyebrow" component="div" sx={[{ lineHeight: 1.55 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Typography>
  );
}
