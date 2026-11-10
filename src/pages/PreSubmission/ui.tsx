import { Box, Button, Dialog, IconButton, Typography, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/system';
import type { ReactNode } from 'react';
import { CloseIcon } from '@/icons';

/* ------------------------------------------------------------------ */
/* Tag — the prototype's `.tag` chip (12px / 600, 3px 10px padding).   */
/* ------------------------------------------------------------------ */
export type TagTone = 'neutral' | 'good' | 'warn' | 'risk';

export function Tag({ tone = 'neutral', dot, children, sx }: { tone?: TagTone; dot?: boolean; children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => {
          const t = theme.palette.og;
          const dark = theme.palette.mode === 'dark';
          const c = {
            neutral: { fg: t.gray, bg: t.pale },
            good: { fg: t.good, bg: t.goodTint },
            warn: { fg: t.warn, bg: t.warnTint },
            // WCAG AA override from the prototype (a11y v1)
            risk: { fg: dark ? '#F2978C' : '#A3392D', bg: t.riskTint },
          }[tone];
          return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            p: '3px 10px',
            borderRadius: '4px',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.55,
            whiteSpace: 'nowrap',
            color: c.fg,
            bgcolor: c.bg,
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {dot && <Box component="span" aria-hidden sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'currentColor', flex: 'none' }} />}
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Seal status badge (scalloped seal with check / ! / ×).              */
/* ------------------------------------------------------------------ */
const SEAL =
  'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z';

export function SealIcon({ status, size = 26 }: { status: 'ok' | 'warn' | 'bad'; size?: number }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        flex: 'none',
        width: 30,
        height: 30,
        display: 'grid',
        placeItems: 'center',
        color: status === 'ok' ? theme.palette.og.good : status === 'warn' ? '#D9822B' : theme.palette.og.risk,
        '& svg': { display: 'block', filter: 'drop-shadow(0 1px 1.5px rgba(10,40,25,.2))' },
      })}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d={SEAL} fill="currentColor" />
        <path d={SEAL} fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1" transform="translate(12 12) scale(.8) translate(-12 -12)" />
        {status === 'ok' && <path d="m8.6 12.2 2.3 2.3 4.6-4.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {status === 'warn' && (
          <>
            <path d="M12 7.6v5" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
            <circle cx="12" cy="16.1" r="1.25" fill="#fff" />
          </>
        )}
        {status === 'bad' && <path d="m9.2 9.2 5.6 5.6m0-5.6-5.6 5.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
      </svg>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Inline button spinner (prototype `.bspin`).                         */
/* ------------------------------------------------------------------ */
const spin = keyframes`to { transform: rotate(360deg); }`;

export function ButtonSpinner() {
  return <Box component="span" aria-hidden sx={{ width: 13, height: 13, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: `${spin} .7s linear infinite`, flex: 'none' }} />;
}

/* ------------------------------------------------------------------ */
/* Action dialog — prototype `ogDialog` (brass or danger variant).     */
/* ------------------------------------------------------------------ */
export interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  okLabel: string;
  onOk: () => void;
  danger?: boolean;
  noCancel?: boolean;
  okDisabled?: boolean;
  children: ReactNode;
}

export function ActionDialog({ open, onClose, eyebrow, title, okLabel, onOk, danger, noCancel, okDisabled, children }: ActionDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="action-dialog-title"
      sx={{ '& [tabindex="-1"]:focus': { outline: 'none' } }}
      slotProps={{
        paper: {
          sx: (theme: Theme) => ({
            width: 'min(480px, calc(100vw - 32px))',
            m: 2,
            borderTopColor: danger ? '#C0392B' : theme.palette.og.brass,
            boxShadow: '0 16px 40px -16px rgba(0,20,40,.22)',
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, p: '18px 22px 6px' }}>
        <Box>
          <Typography component="small" sx={{ display: 'block', fontSize: 10.5, fontWeight: 700, lineHeight: 1, letterSpacing: '0.18em', textTransform: 'uppercase', color: danger ? '#B4473A' : '#A57F3C', mb: 2 }}>
            {eyebrow}
          </Typography>
          <Typography id="action-dialog-title" component="h3" sx={{ m: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: 'og.head' }}>
            {title}
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ width: 30, height: 30 }}>
          <CloseIcon size={14} />
        </IconButton>
      </Box>
      <Box
        sx={{
          p: '8px 22px 4px',
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'og.gray',
          '& p': { m: '0 0 12px' },
          '& b': { color: 'og.head' },
          '& label.field': { display: 'flex', flexDirection: 'column', gap: '6px', mb: 3, fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'og.gray' },
          '& textarea, & input': { font: '500 13.5px Manrope, Arial, sans-serif', letterSpacing: 0, textTransform: 'none', color: 'og.ink', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', boxSizing: 'border-box', width: '100%' },
          '& input': { height: 36, px: 3 },
          '& textarea': { minHeight: 84, p: '10px 12px', resize: 'vertical' },
          '& textarea:focus, & input:focus': { outline: 'none', borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.14)' },
          '& textarea::placeholder, & input::placeholder': { color: 'og.dim', opacity: 1 },
        }}
      >
        {children}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: '14px 22px 18px' }}>
        {!noCancel && (
          <Button variant="outlined" size="small" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          disabled={okDisabled}
          onClick={() => {
            onOk();
            onClose();
          }}
          sx={(t: Theme) => {
            const bg = danger ? '#B4473A' : t.palette.og.buttonBlue;
            return {
              ...(danger && { bgcolor: bg, borderColor: bg, '&:hover': { bgcolor: '#9C3B30', borderColor: '#9C3B30' } }),
              '&.Mui-disabled': { opacity: 0.45, color: '#FFFFFF', bgcolor: bg, borderColor: bg },
            };
          }}
        >
          {okLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
