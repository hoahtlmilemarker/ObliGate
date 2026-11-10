import { Box, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

export interface CountBadgeProps {
  children: ReactNode;
  /** primary = filled blue, warn = tinted orange, neutral = gray tint, gold = header active nav, onDark = header idle nav */
  tone?: 'primary' | 'warn' | 'neutral' | 'gold' | 'onDark' | 'onPrimary' | 'plain';
  sx?: SxProps<Theme>;
}

/** Small numeric counter used in tabs, nav and queue items. */
export function CountBadge({ children, tone = 'neutral', sx }: CountBadgeProps) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => {
          const t = theme.palette.og;
          const map = {
            primary: { color: '#FFFFFF', bg: t.buttonBlue },
            warn: { color: t.warn, bg: t.warnTint },
            neutral: { color: t.gray, bg: t.pale },
            gold: { color: '#06243F', bg: '#C9A266' },
            onDark: { color: '#FFFFFF', bg: 'rgba(255,255,255,.14)' },
            onPrimary: { color: '#FFFFFF', bg: 'rgba(4,24,48,.32)' },
            plain: { color: t.gray, bg: 'transparent' },
          } as const;
          const c = map[tone];
          return {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: tone === 'plain' ? 'auto' : 18,
            px: tone === 'plain' ? 0 : '7px',
            borderRadius: '4px',
            fontSize: tone === 'plain' ? 12 : 11,
            fontWeight: tone === 'plain' ? 600 : 700,
            fontVariantNumeric: 'tabular-nums',
            color: c.color,
            backgroundColor: c.bg,
            flex: 'none',
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
