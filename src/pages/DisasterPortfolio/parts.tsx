/**
 * Small building blocks used by the Disaster Portfolio (01) and Project Detail (02) screens.
 * Candidates for promotion to `src/components` (see agent report).
 */
import { Box, Button, type ButtonProps, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { fonts } from '@/theme/tokens';

const spin = keyframes`to { transform: rotate(360deg); }`;

/** 13px ring spinner used inside busy buttons (prototype `.bspin`). */
export function ButtonSpinner() {
  return <Box component="span" aria-hidden sx={{ width: 13, height: 13, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: `${spin} .7s linear infinite`, flex: 'none' }} />;
}

/**
 * Button that shows a spinner + busy label for `ms`, then calls `onDone`
 * (prototype `busy(b, label, ms, done)`).
 */
export function BusyButton({ busyLabel, ms, onDone, children, startIcon, endIcon, ...rest }: ButtonProps & { busyLabel: string; ms: number; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <Button
      {...rest}
      aria-busy={busy || undefined}
      startIcon={busy ? <ButtonSpinner /> : startIcon}
      endIcon={busy ? undefined : endIcon}
      onClick={() => {
        if (busy) return;
        setBusy(true);
        timer.current = window.setTimeout(() => {
          setBusy(false);
          onDone();
        }, ms);
      }}
      sx={[{ ...(busy && { pointerEvents: 'none', opacity: 0.85 }) }, ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx])]}
    >
      {busy ? busyLabel : children}
    </Button>
  );
}

/** One KPI cell of the lifted ledger card (small label, serif figure, meta line). */
export function KpiCell({ label, value, valueColor, children }: { label: string; value: string; valueColor?: string; children?: ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        p: '14px 24px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: 0,
        boxShadow: `1px 0 0 ${t.palette.og.lineSoft}, 0 1px 0 ${t.palette.og.lineSoft}`,
        [t.breakpoints.down('sm')]: { p: '14px 20px 15px' },
      })}
    >
      <Box component="span" sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'og.gray', lineHeight: 1.55 }}>
        {label}
      </Box>
      <Box component="span" sx={{ fontFamily: fonts.serif, fontSize: { xs: 24, sm: 28 }, fontWeight: 500, lineHeight: 0.95, color: valueColor ?? 'og.head', fontVariantNumeric: 'lining-nums tabular-nums', py: '2px' }}>
        {value}
      </Box>
      {children}
    </Box>
  );
}

/** Grid wrapper for KpiCell — auto-fit at desktop, 2-up below 1024px. */
export const kpiGridSx: SxProps<Theme> = (t) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
  // hide the outer edges of the cell hairlines
  mr: '-1px',
  mb: '-1px',
  [t.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
});

/** Thin progress meter. */
export function Meter({ pct, color, height = 3, radius = 0 }: { pct: number; color: string; height?: number; radius?: number }) {
  return (
    <Box role="presentation" sx={{ height, borderRadius: `${radius}px`, bgcolor: 'og.lineSoft', overflow: 'hidden', flex: '1 1 auto' }}>
      <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: `${radius}px` }} />
    </Box>
  );
}

/** Small right arrow used in "Open Projects →" style buttons. */
export function ArrowSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Plus glyph used in banner buttons. */
export function PlusSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Uppercase label + control, as used in prototype dialogs (`.dlg-c label`). */
export function DialogField({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mb: 3, minWidth: 0 }}>
      <Box component="label" htmlFor={htmlFor} id={`${htmlFor}-label`} sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'og.gray' }}>
        {label}
      </Box>
      {children}
    </Box>
  );
}

/**
 * Table → stacked rows below 820px, like the prototype's `.dtbl/.ctbl`
 * (rows become wrapping flex lines; first cell full width, last cell pushed right).
 */
export const stackingTableSx = (t: Theme) => ({
  [t.breakpoints.down('md')]: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    '& thead, & colgroup': { display: 'none' },
    '& tbody': { display: 'block' },
    '& tr': { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px', p: '14px 16px', borderBottom: `1px solid ${t.palette.og.lineSoft}` },
    '& td': { display: 'block', p: '0 !important', border: 0, width: 'auto !important', maxWidth: '100%', textAlign: 'left !important' },
    '& td:first-of-type': { flex: '1 1 100%' },
    '& td:last-of-type': { ml: 'auto' },
  },
});

/** Banner action buttons (prototype `.hero .btn`): 14px side padding, 6px icon gap. */
export const bannerActionsSx = { display: 'contents', '& .MuiButton-root': { px: '14px', gap: '6px' } } as const;
