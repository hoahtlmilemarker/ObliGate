import { Box, Button, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { OgDialog, useToast } from '@/components';
import { PlusIcon } from '@/icons';
import { SettingsShell } from './SettingsShell';
import { EmptyCard, Pill, SCard, SCardBody, SCardHead, SLabel } from './ui';

const SAMPLE_KEY = 'JBSW Y3DP EHPK 3PXP 4NQ7 KC2X';

/** Decorative QR-like grid (sample only — the real one encodes the otpauth:// URI from the API). */
function SampleQr() {
  const cells = useMemo(() => {
    const out: [number, number][] = [];
    for (let y = 0; y < 21; y++)
      for (let x = 0; x < 21; x++) {
        const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        const fx = x % 14, fy = y % 14;
        const on = finder ? fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4) : (x * 7 + y * 13 + x * y) % 3 === 0;
        if (on) out.push([x, y]);
      }
    return out;
  }, []);
  return (
    <Box component="svg" viewBox="0 0 21 21" shapeRendering="crispEdges" aria-label="Sample QR code" sx={{ width: 150, height: 150, p: 2, boxSizing: 'border-box', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: '#FFFFFF', fill: '#06243F' }}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
      ))}
    </Box>
  );
}

/** 16 · Settings / Security — TOTP authenticators. */
export default function Security() {
  const toast = useToast();
  const [auths, setAuths] = useState<{ name: string; added: string }[]>([]);
  const [setup, setSetup] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [err, setErr] = useState('');
  const [removing, setRemoving] = useState<number | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const openSetup = () => {
    setDigits(Array(6).fill(''));
    setErr('');
    setSetup(true);
    setTimeout(() => refs.current[0]?.focus(), 80);
  };
  const verify = () => {
    if (!digits.every((d) => /^\d$/.test(d))) return setErr('Enter all 6 digits.');
    setAuths((a) => [...a, { name: 'Authenticator app', added: 'just now' }]);
    setSetup(false);
    toast({ title: 'Two-factor authentication is on', message: 'you’ll be asked for a code at sign-in' });
  };

  return (
    <SettingsShell active="security">
      <SCard top>
        <SCardHead
          title="Authenticator app (TOTP)"
          description="Add a second factor from an app like Google Authenticator, Microsoft Authenticator, Authy, or 1Password. After it’s set up, you’ll enter a 6-digit code from the app when you sign in."
          action={
            <Button variant="contained" startIcon={<PlusIcon size={16} />} onClick={openSetup}>
              Add authenticator
            </Button>
          }
        />
        <SCardBody>
          <SLabel>Your authenticators</SLabel>
          {auths.length ? (
            auths.map((a, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3.5, py: 3, borderTop: i ? 1 : 0, borderColor: 'og.lineSoft' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{a.name}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'og.gray' }}>Added {a.added} · last used never</Typography>
                </Box>
                <Pill tone="good">Active</Pill>
                <Button variant="outlined" size="small" onClick={() => setRemoving(i)}>
                  Remove
                </Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: 13, color: 'og.gray' }}>No authenticator set up yet. Your account is protected by your password only.</Typography>
          )}
        </SCardBody>
      </SCard>
      <SCard>
        <EmptyCard title="More sign-in protection" soon>
          <p>Session management and recovery codes will live here.</p>
        </EmptyCard>
      </SCard>

      <OgDialog open={setup} onClose={() => setSetup(false)} eyebrow="Two-factor authentication" title="Set up your authenticator app" confirmLabel="Verify & Turn On" onConfirm={verify} maxWidth={560}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '150px minmax(0,1fr)', gap: 5, alignItems: 'start', '@media (max-width:560px)': { gridTemplateColumns: '1fr' } }}>
          <SampleQr />
          <div>
            <p style={{ margin: '0 0 8px' }}>1. Scan the code with your authenticator app, or enter this key:</p>
            <Box component="code" sx={{ display: 'inline-block', px: 2.5, py: 1.5, borderRadius: '4px', bgcolor: 'og.pale', fontSize: 12.5, fontWeight: 600, letterSpacing: '.06em', color: 'og.head', wordBreak: 'break-all' }}>
              {SAMPLE_KEY}
            </Box>
            <p style={{ margin: '14px 0 8px' }}>2. Enter the 6-digit code it shows.</p>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {digits.map((d, i) => (
                <Box
                  key={i}
                  component="input"
                  ref={(el: HTMLInputElement | null) => {
                    refs.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  value={d}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const v = e.target.value.replace(/\D/g, '').slice(-1);
                    setDigits((p) => p.map((x, j) => (j === i ? v : x)));
                    setErr('');
                    if (v) refs.current[i + 1]?.focus();
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Backspace' && !d) refs.current[i - 1]?.focus();
                    if (e.key === 'Enter') verify();
                  }}
                  sx={{ width: 40, height: 46, textAlign: 'center', font: '700 18px Manrope, Arial, sans-serif', color: 'og.head', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', '&:focus': { outline: 'none', borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.18)' } }}
                />
              ))}
            </Box>
            {err && <Box sx={{ mt: 2, fontSize: 12, color: 'og.risk' }}>{err}</Box>}
            <Box sx={{ mt: 2.5, fontSize: 12, color: 'og.gray' }}>Prototype: any 6 digits work.</Box>
          </div>
        </Box>
      </OgDialog>

      <OgDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        danger
        eyebrow="Remove authenticator"
        title="Remove this authenticator?"
        confirmLabel="Remove"
        onConfirm={() => {
          setAuths((a) => a.filter((_, i) => i !== removing));
          setRemoving(null);
          toast({ title: 'Authenticator removed' });
        }}
      >
        You’ll sign in with your password only until you add another authenticator.
      </OgDialog>
    </SettingsShell>
  );
}
