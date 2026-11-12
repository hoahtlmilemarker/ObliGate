import { Box, Button, InputBase, Typography } from '@mui/material';
import { useState } from 'react';
import { OgDialog, useToast } from '@/components';
import { procurementThresholds as R } from '@/data/settings';
import { SettingsShell } from './SettingsShell';
import { SCard, SCardHead } from './ui';

const fmt = (n: number) => n.toLocaleString('en-US');
const parse = (s: string) => {
  const n = parseInt(s.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? null : n;
};
const ROW = { display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) 200px 120px 110px', gap: 4, alignItems: 'center', px: 6, '@media (max-width:760px)': { gridTemplateColumns: '1fr 1fr', rowGap: 2.5, px: 4 } } as const;

/** 18 · Settings / Policy & thresholds — agency procurement thresholds vs the FEMA floor. */
export default function PolicyThresholds() {
  const toast = useToast();
  const floors = R.map((r) => r.floor);
  const [saved, setSaved] = useState<number[]>(floors);
  const [text, setText] = useState<string[]>(floors.map(fmt));
  const [confirmReset, setConfirmReset] = useState(false);

  const vals = text.map(parse);
  const errs = vals.map((v, i) => (v === null ? 'Enter a dollar amount.' : v < R[i].floor ? `Can’t be lower than the federal floor of $${fmt(R[i].floor)}.` : ''));
  const bad = errs.some(Boolean);
  const dirty = vals.some((v, i) => v !== saved[i]);
  const atDefaults = vals.every((v, i) => v === R[i].floor);

  const chip = (i: number) => {
    const v = vals[i];
    if (v === null) return ['Required', 'og.riskTint', 'og.risk'];
    if (v < R[i].floor) return ['Below floor', 'og.riskTint', 'og.risk'];
    if (v === R[i].floor) return ['At floor', 'og.pale', 'og.gray'];
    return [`+${Math.round((v / R[i].floor - 1) * 100)}% above`, 'og.blueTint', 'og.blue'];
  };

  return (
    <SettingsShell active="policy">
      <SCard top>
        <SCardHead
          title="Procurement thresholds"
          tag="2 CFR 200.320 · agency override allowed above federal floor"
          description="Dollar thresholds that trigger competitive procurement requirements. Findings fire when a project exceeds a threshold without matching documentation."
        />
        <Box sx={{ ...ROW, py: 2.5, bgcolor: 'og.pale', fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'og.gray', '@media (max-width:760px)': { display: 'none' } }}>
          <span>Threshold</span>
          <span>Your policy</span>
          <span>FEMA floor</span>
          <span />
        </Box>
        {R.map((r, i) => {
          const [label, bg, fg] = chip(i);
          return (
            <Box key={r.id} sx={{ ...ROW, py: 4.5, borderTop: 1, borderColor: 'og.lineSoft' }}>
              <Box sx={{ '@media (max-width:760px)': { gridColumn: '1 / -1' } }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{r.label}</Typography>
                <Typography sx={{ mt: '3px', fontSize: 12.5, color: 'og.gray' }}>{r.help}</Typography>
              </Box>
              <InputBase
                value={text[i]}
                onChange={(e) => setText((t) => t.map((x, j) => (j === i ? e.target.value : x)))}
                onBlur={() => vals[i] !== null && setText((t) => t.map((x, j) => (j === i ? fmt(vals[i]!) : x)))}
                startAdornment={<Box component="span" sx={{ mr: 1, fontWeight: 700, color: 'og.gray' }}>$</Box>}
                inputProps={{ inputMode: 'numeric', 'aria-label': `${r.label} threshold`, 'aria-invalid': !!errs[i] }}
                sx={{ height: 40, px: 3, border: 1, borderColor: errs[i] ? 'og.risk' : 'og.line', borderRadius: '4px', bgcolor: 'og.card', fontWeight: 700, color: 'og.head', fontVariantNumeric: 'tabular-nums', '&.Mui-focused': { borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.14)' } }}
              />
              <Typography sx={{ fontSize: 13.5, color: 'og.gray', fontVariantNumeric: 'tabular-nums' }}>${fmt(r.floor)}</Typography>
              <Box component="span" sx={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: '6px', height: 24, px: '10px', borderRadius: '4px', bgcolor: bg, color: fg, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap', '&::before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' } }}>
                {label}
              </Box>
              {errs[i] && <Typography sx={{ gridColumn: '2 / -1', mt: -1, fontSize: 12, color: 'og.risk', '@media (max-width:760px)': { gridColumn: '1 / -1' } }}>{errs[i]}</Typography>}
            </Box>
          );
        })}
      </SCard>

      <Box
        role="region"
        aria-label="Save thresholds"
        sx={{
          position: 'sticky',
          bottom: 16,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          p: '12px 16px 12px 20px',
          border: 1,
          borderColor: dirty || bad ? 'og.brass' : 'og.line',
          borderRadius: '4px',
          bgcolor: 'og.card',
          boxShadow: '0 10px 30px -18px rgba(6,36,63,.45)',
          '& .MuiButton-root.Mui-disabled': { opacity: 0.45 },
          '@media (max-width:640px)': { position: 'static', flexDirection: 'column', alignItems: 'stretch', '& > div': { flexDirection: 'column' } },
        }}
      >
        <Typography aria-live="polite" sx={{ fontSize: 13, fontWeight: dirty || bad ? 700 : 500, color: dirty || bad ? 'og.head' : 'og.gray' }}>
          {bad ? 'Fix the highlighted threshold' : dirty ? 'Unsaved changes' : 'No unsaved changes'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" disabled={atDefaults} onClick={() => setConfirmReset(true)}>
            Reset to FEMA defaults
          </Button>
          <Button
            variant="contained"
            disabled={!dirty || bad}
            onClick={() => {
              setSaved(vals as number[]);
              toast({ title: 'Thresholds saved', message: 'they apply on the next project scan', action: { label: 'Rescan now', onClick: () => toast({ title: 'Rescan started', message: '12 projects in DR-4683-CA' }) } });
            }}
          >
            Save changes
          </Button>
        </Box>
      </Box>

      <OgDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        eyebrow="Policy & thresholds"
        title="Reset to FEMA defaults?"
        confirmLabel="Reset"
        onConfirm={() => {
          setText(floors.map(fmt));
          setConfirmReset(false);
        }}
      >
        All three thresholds go back to the federal floor. Nothing changes until you save.
      </OgDialog>
    </SettingsShell>
  );
}
