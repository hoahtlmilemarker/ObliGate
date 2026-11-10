import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/** Centered empty state: icon, title, description and optional actions. */
export function EmptyState({ icon, title, description, actions, dashed }: { icon?: ReactNode; title: string; description?: ReactNode; actions?: ReactNode; dashed?: boolean }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        px: 6,
        py: 12,
        ...(dashed && { border: `1.5px dashed ${theme.palette.og.line}`, borderRadius: '4px', backgroundColor: theme.palette.og.pale }),
      })}
    >
      {icon && <Box sx={{ color: 'og.blue', mb: 1 }}>{icon}</Box>}
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'og.head' }}>{title}</Typography>
      {description && <Typography sx={{ fontSize: 13.5, color: 'og.gray', maxWidth: 420 }}>{description}</Typography>}
      {actions && <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>{actions}</Box>}
    </Box>
  );
}
