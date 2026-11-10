import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { CloseIcon } from '@/icons';

export interface OgDialogProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  /** Footer actions. Defaults to Cancel + confirm when `confirmLabel` is given. */
  actions?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  maxWidth?: number;
}

/** Standard ObliGate dialog: gold eyebrow, title, body, footer actions. */
export function OgDialog({ open, onClose, eyebrow, title, children, actions, confirmLabel, onConfirm, confirmDisabled, maxWidth = 480 }: OgDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="og-dialog-title" slotProps={{ paper: { sx: { width: `min(${maxWidth}px, calc(100vw - 32px))`, m: 2 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, p: '20px 24px 4px' }}>
        <Box>
          {eyebrow && (
            <Typography variant="eyebrow" sx={{ color: '#A57F3C', fontSize: 10.5, mb: 2 }}>
              {eyebrow}
            </Typography>
          )}
          <Typography id="og-dialog-title" component="h3" sx={{ fontSize: 20, fontWeight: 600, color: 'og.head', lineHeight: 1.25 }}>
            {title}
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon size={16} />
        </IconButton>
      </Box>
      <Box sx={{ px: 6, pt: 2, fontSize: 13.5, lineHeight: 1.55, color: 'og.gray', '& b': { color: 'og.head' } }}>{children}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: '16px 24px 20px', flexWrap: 'wrap' }}>
        {actions ?? (
          <>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            {confirmLabel && (
              <Button variant="contained" onClick={onConfirm} disabled={confirmDisabled}>
                {confirmLabel}
              </Button>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
}
