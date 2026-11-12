import { Box, InputBase, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { ClockIcon } from '@/icons';

/** Settings card (white, 1px line, optional brass top rule). */
export function SCard({ children, top, sx }: { children: ReactNode; top?: boolean; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        { border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', overflow: 'hidden', ...(top && { borderTop: '2px solid', borderTopColor: 'og.brass' }) },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/** Card heading row: title (+ optional tag), help text, optional action on the right. */
export function SCardHead({ title, tag, description, action }: { title: string; tag?: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px 20px', p: '22px 24px 18px', borderBottom: 1, borderColor: 'og.lineSoft', '@media (max-width:640px)': { px: 4 } }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h2" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 10px', m: 0, fontSize: 21, fontWeight: 300, color: 'og.head' }}>
          {title}
          {tag && <Tag>{tag}</Tag>}
        </Typography>
        {description && <Typography sx={{ mt: '6px', maxWidth: 620, fontSize: 13, lineHeight: 1.55, color: 'og.gray' }}>{description}</Typography>}
      </Box>
      {action}
    </Box>
  );
}

export function SCardBody({ children }: { children: ReactNode }) {
  return <Box sx={{ p: '20px 24px', '@media (max-width:640px)': { px: 4 } }}>{children}</Box>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', height: 22, px: 2, borderRadius: '4px', bgcolor: 'og.pale', border: 1, borderColor: 'og.line', fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'og.gray' }}>
      {children}
    </Box>
  );
}

/** Uppercase field-group label. */
export function SLabel({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'block', mb: 2, fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'og.gray' }}>{children}</Box>;
}

export type PillTone = 'good' | 'risk' | 'mid' | 'blue';
export function Pill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  const c = { good: ['og.goodTint', 'og.good'], risk: ['og.riskTint', 'og.risk'], mid: ['og.pale', 'og.gray'], blue: ['og.blueTint', 'og.blue'] }[tone];
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: 24, px: '10px', borderRadius: '4px', bgcolor: c[0], color: c[1], fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', '&::before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' } }}>
      {children}
    </Box>
  );
}

/** Labelled text input with an inline message under it. */
export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  message,
  ok,
  autoComplete,
  inputMode,
  prefix,
  ariaLabel,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  message?: string;
  ok?: boolean;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'email';
  prefix?: string;
  ariaLabel?: string;
}) {
  return (
    <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
      {label && <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: 'og.head' }}>{label}</Box>}
      <InputBase
        value={value}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={prefix ? <Box component="span" sx={{ mr: 1, fontWeight: 700, color: 'og.gray' }}>{prefix}</Box> : undefined}
        inputProps={{ inputMode, 'aria-label': ariaLabel, 'aria-invalid': !!message && !ok }}
        sx={{
          height: 42,
          px: 3,
          border: 1,
          borderColor: message && !ok ? 'og.risk' : 'og.line',
          borderRadius: '4px',
          bgcolor: 'og.card',
          fontSize: 14,
          color: 'og.ink',
          '&.Mui-focused': { borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.14)' },
        }}
      />
      {message && <Box component="em" aria-live="polite" sx={{ fontStyle: 'normal', fontSize: 12, color: ok ? 'og.good' : 'og.risk' }}>{message}</Box>}
    </Box>
  );
}

/** Centred empty / coming-soon state inside a card. */
export function EmptyCard({ icon, title, children, soon, align = 'center' }: { icon?: ReactNode; title: string; children?: ReactNode; soon?: boolean; align?: 'center' | 'left' }) {
  return (
    <Box sx={{ p: '40px 28px', textAlign: align, '& p': { maxWidth: 480, mx: align === 'center' ? 'auto' : 0 } }}>
      <Box sx={{ display: 'inline-grid', placeItems: 'center', width: 52, height: 52, mb: 3.5, borderRadius: '50%', bgcolor: 'og.blueTint', color: 'og.blue' }}>{icon ?? <ClockIcon size={22} />}</Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'og.head' }}>{title}</Typography>
      {children && <Box sx={{ mt: '6px', fontSize: 13, lineHeight: 1.55, color: 'og.gray', '& p': { m: 0 } }}>{children}</Box>}
      {soon && (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mt: 3.5, height: 24, px: '10px', borderRadius: 999, bgcolor: 'og.brassTint', color: '#9A7740', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Coming soon
        </Box>
      )}
    </Box>
  );
}

/** Pill switch (40×22). */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Box
      component="button"
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      sx={{
        position: 'relative',
        flex: 'none',
        width: 40,
        height: 22,
        p: 0,
        border: 0,
        borderRadius: 11,
        bgcolor: checked ? 'og.blue' : 'og.line',
        cursor: 'pointer',
        transition: 'background .15s',
        '&::after': { content: '""', position: 'absolute', top: 3, left: 3, width: 16, height: 16, borderRadius: '50%', bgcolor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,.25)', transform: checked ? 'translateX(18px)' : 'none', transition: 'transform .15s' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: 2 },
      }}
    />
  );
}
