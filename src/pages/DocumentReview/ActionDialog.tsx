import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { CloseIcon } from '@/icons';

export interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  okLabel: string;
  onOk: () => void;
  okDisabled?: boolean;
  /** Red top rule, red eyebrow and red confirm button (destructive actions). */
  danger?: boolean;
}

/**
 * Prototype "shared dialog" (`ogDialog`): gold/red eyebrow, title, body, Cancel + confirm.
 * Local to screens 04–06 because the shared OgDialog has no danger variant.
 */
export function ActionDialog({ open, onClose, eyebrow, title, children, okLabel, onOk, okDisabled, danger }: ActionDialogProps) {
  const titleId = `act-dlg-${eyebrow.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      slotProps={{ paper: { sx: { width: 'min(480px, calc(100vw - 32px))', m: 2, ...(danger && { borderTopColor: '#C0392B' }) } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, p: '18px 22px 6px' }}>
        <Box>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1, letterSpacing: '0.18em', textTransform: 'uppercase', color: danger ? '#B4473A' : '#A57F3C', mb: 2 }}>{eyebrow}</Typography>
          <Typography id={titleId} component="h3" sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: 'og.head' }}>
            {title}
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ width: 30, height: 30, flex: 'none' }}>
          <CloseIcon size={14} />
        </IconButton>
      </Box>
      <Box sx={{ p: '8px 22px 4px', fontSize: 13.5, lineHeight: 1.55, color: 'og.gray', '& p': { m: '0 0 12px' }, '& b': { color: 'og.head' } }}>{children}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: '14px 22px 18px' }}>
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={onOk}
          disabled={okDisabled}
          sx={danger ? { bgcolor: '#B4473A', borderColor: '#B4473A', '&:hover': { bgcolor: '#9C3B30', borderColor: '#9C3B30' } } : undefined}
        >
          {okLabel}
        </Button>
      </Box>
    </Dialog>
  );
}

/** Uppercase field label wrapping a control (prototype `.dlg-c label`). */
export function DialogField({ label, children, htmlFor, labelId }: { label: string; children: ReactNode; htmlFor?: string; labelId?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
      <Box component="label" id={labelId} htmlFor={htmlFor} sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'og.gray' }}>
        {label}
      </Box>
      {children}
    </Box>
  );
}

/** Textarea styling for dialog notes. */
export const dialogTextareaSx = { '&.MuiOutlinedInput-root': { p: '10px 12px', alignItems: 'flex-start' }, '& textarea': { p: 0, height: 'auto', minHeight: 64, resize: 'vertical', font: 'inherit' } } as const;

/** Select sized like the prototype `.sel` (36px, chevron with right padding). */
export const selectSx = {
  fontSize: 14,
  '& .MuiSelect-select.MuiSelect-select': { height: '36px', minHeight: '0 !important', boxSizing: 'border-box', display: 'flex', alignItems: 'center', p: '0 40px 0 12px !important' },
  '& .MuiSelect-icon': { right: 10, color: 'og.gray' },
} as const;
