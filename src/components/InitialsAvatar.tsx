import { Box } from '@mui/material';
import { brand } from '@/theme/tokens';

/** Round initials avatar. `outline` = neutral ring style used for crews / vendors / equipment. */
export function InitialsAvatar({ initials, size = 30, outline }: { initials: string; size?: number; outline?: boolean }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={(theme) => ({
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size >= 34 ? 12 : 10.5,
        fontWeight: 600,
        letterSpacing: '0.03em',
        ...(outline
          ? { color: theme.palette.og.head, border: `1px solid ${theme.palette.og.line}`, backgroundColor: theme.palette.og.card }
          : { color: '#06243F', backgroundImage: brand.initialsGradient }),
      })}
    >
      {initials}
    </Box>
  );
}
