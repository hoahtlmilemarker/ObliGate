import { Box, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

export type Tone = 'good' | 'warn' | 'risk' | 'proc' | 'neutral';

export function toneColors(theme: Theme, tone: Tone) {
  const t = theme.palette.og;
  switch (tone) {
    case 'good':
      return { fg: t.good, bg: t.goodTint };
    case 'warn':
      return { fg: t.warn, bg: t.warnTint };
    case 'risk':
      return { fg: t.risk, bg: t.riskTint };
    case 'proc':
      return { fg: t.blue, bg: t.blueTint };
    default:
      return { fg: t.gray, bg: t.pale };
  }
}

export interface StatusTagProps {
  tone: Tone;
  children: ReactNode;
  /** `soft` = tinted pill with dot (tables); `plain` = dot + text only; `outline` = bordered chip. */
  variant?: 'soft' | 'plain' | 'outline';
  /** Hide the leading dot. */
  noDot?: boolean;
  sx?: SxProps<Theme>;
}

/** Status pill used across tables and cards, e.g. "Review Needed (76%)", "Verified (99%)". */
export function StatusTag({ tone, children, variant = 'soft', noDot, sx }: StatusTagProps) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => {
          const c = toneColors(theme, tone);
          return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
            color: c.fg,
            fontWeight: 700,
            fontSize: 11,
            lineHeight: '17px',
            letterSpacing: '0.01em',
            borderRadius: '4px',
            ...(variant === 'soft' && { backgroundColor: c.bg, padding: '4px 8px 4px 7px' }),
            ...(variant === 'outline' && { border: '1px solid currentColor', padding: '2px 8px', fontWeight: 600, fontSize: 11.5 }),
            ...(variant === 'plain' && { fontSize: 12.5, fontWeight: 600 }),
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {!noDot && <Box component="i" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', flex: 'none' }} />}
      {children}
    </Box>
  );
}
