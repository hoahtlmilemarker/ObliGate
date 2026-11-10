import { Box, type BoxProps } from '@mui/material';
import { forwardRef } from 'react';

/** Elevated card with the brass top rule — sits over the banner ("lift" in the prototype). */
export const LiftCard = forwardRef<HTMLDivElement, BoxProps>(function LiftCard({ sx, ...rest }, ref) {
  return (
    <Box
      ref={ref}
      sx={[
        (theme) => ({
          position: 'relative',
          backgroundColor: theme.palette.og.card,
          border: `1px solid ${theme.palette.og.line}`,
          borderTop: `2px solid ${theme.palette.og.brass}`,
          borderRadius: '4px',
          boxShadow: theme.palette.og.lift,
          overflow: 'hidden',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
});

/** Plain bordered surface (tables, side panels). */
export const Panel = forwardRef<HTMLDivElement, BoxProps>(function Panel({ sx, ...rest }, ref) {
  return (
    <Box
      ref={ref}
      sx={[
        (theme) => ({
          backgroundColor: theme.palette.og.card,
          border: `1px solid ${theme.palette.og.line}`,
          borderRadius: '4px',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
});
