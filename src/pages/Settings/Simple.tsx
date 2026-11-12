import { Box, Button, InputBase, Typography } from '@mui/material';
import { useState } from 'react';
import { useToast } from '@/components';
import { CalendarIcon, ShieldIcon } from '@/icons';
import { importReminders, vendors } from '@/data/settings';
import { SettingsShell } from './SettingsShell';
import { EmptyCard, Pill, SCard, SCardHead, Switch, Tag } from './ui';

/** 17 · Settings / Disasters & scope — not built in the live app yet. */
export function DisastersScope() {
  return (
    <SettingsShell active="scope">
      <SCard>
        <EmptyCard title="Disasters & scope" soon>
          <p>Choose which declarations, applicants and projects this organization manages, and who can see each one.</p>
        </EmptyCard>
      </SCard>
    </SettingsShell>
  );
}

/** 20 · Settings / Data & retention — not built in the live app yet. */
export function DataRetention() {
  return (
    <SettingsShell active="data">
      <SCard>
        <EmptyCard title="Data & retention" soon>
          <p>Retention periods for documents, audit logs and exports, plus organization-wide data export.</p>
        </EmptyCard>
      </SCard>
    </SettingsShell>
  );
}

/** 19 · Settings / Finding overrides — empty state (no create flow in the live app yet). */
export function FindingOverrides() {
  return (
    <SettingsShell active="overrides">
      <SCard top>
        <EmptyCard icon={<ShieldIcon size={22} />} title="No finding overrides configured.">
          <p>Overrides let you suppress or lower the severity of specific compliance findings when your org has a documented policy reason.</p>
        </EmptyCard>
      </SCard>
    </SettingsShell>
  );
}

/** 11 · Settings / Notifications — bi-weekly eCAPS import reminders per department. */
export function Notifications() {
  const toast = useToast();
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(importReminders.map((r) => [r.id, r.enabled])));
  return (
    <SettingsShell active="notifications">
      <SCard top>
        <SCardHead
          title="Bi-weekly import reminders"
          description="ObliGate sends a reminder when the cadence window elapses since your last successful eCAPS import. Reminders fire on the anchor weekday (deferred one weekday on US federal holidays) and go to everyone in the org with the Grants Manager or Grants Analyst role."
        />
        {importReminders.map((r, i) => (
          <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 3.5, px: 6, py: 4, borderTop: i ? 1 : 0, borderColor: 'og.lineSoft', '@media (max-width:640px)': { px: 4 } }}>
            <Box sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '4px', bgcolor: 'og.blueTint', color: 'og.blue' }}>
              <CalendarIcon size={18} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{r.department}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', mt: 1.5, fontSize: 12, color: 'og.gray', '& b': { color: 'og.ink' } }}>
                <span>
                  Every <b>{r.cadenceDays} days</b> on <b>{r.weekday}</b>
                </span>
                <span>
                  Last import <b>{r.lastImport}</b>
                </span>
                <Box component="span" sx={r.overdue ? { color: 'og.risk', fontWeight: 700, '& b': { color: 'inherit' } } : undefined}>
                  Next reminder <b>{r.next}</b>
                </Box>
              </Box>
            </Box>
            <Switch
              checked={on[r.id]}
              label={`Reminders for ${r.department}`}
              onChange={(v) => {
                setOn((p) => ({ ...p, [r.id]: v }));
                toast({ title: v ? 'Reminders on' : 'Reminders paused', message: r.department });
              }}
            />
          </Box>
        ))}
      </SCard>
      <Typography sx={{ fontSize: 12.5, lineHeight: 1.55, color: 'og.gray' }}>
        Cadence and anchor weekday are configured during onboarding and need an administrator to change. Turning a department on or off is the only adjustment available here; it never deletes that department’s reconciliation setup.
      </Typography>
    </SettingsShell>
  );
}

/** 21 · Settings / Reviewer patterns — FEMA pattern memory + vendor familiarity. */
export function ReviewerPatterns() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const list = vendors.filter((v) => !q || `${v.name} ${v.detail}`.toLowerCase().includes(q.toLowerCase()));
  const th = { p: '11px 12px', textAlign: 'left', fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'og.gray', bgcolor: 'og.pale', borderBottom: 1, borderColor: 'og.line', '&:first-of-type': { pl: 6 } } as const;
  const td = { p: '14px 12px', borderTop: 1, borderColor: 'og.lineSoft', fontSize: 13, color: 'og.ink', '&:first-of-type': { pl: 6 } } as const;
  return (
    <SettingsShell active="patterns">
      <SCard top>
        <EmptyCard align="left" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17l5-6 4 4 4-7 5 9" /></svg>} title="No patterns recorded yet">
          <p>ObliGate learns from FEMA return events on your submitted projects. When FEMA returns findings on the same rule across multiple projects, that rule will appear here and receive higher prominence in future pre-submission reviews.</p>
          <Box component="p" sx={{ mt: '12px !important', fontSize: 12 }}>Patterns are specific to your organization — they are never shared with or influenced by data from other organizations.</Box>
        </EmptyCard>
      </SCard>
      <SCard>
        <SCardHead
          title="Vendor familiarity"
          description="What ObliGate has learned from your org’s vendor compliance history. Trusted vendors surface advisory framing on procurement findings; compliance-risk vendors surface a closer-review prompt. Per-org only — no data crosses organizations."
          action={
            <Button
              variant="outlined"
              size="small"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                setTimeout(() => {
                  setBusy(false);
                  toast({ title: 'Vendor history is up to date' });
                }, 800);
              }}
            >
              {busy ? 'Refreshing…' : 'Refresh'}
            </Button>
          }
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, px: 6, py: 3.5, borderBottom: 1, borderColor: 'og.lineSoft' }}>
          <InputBase value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter vendors…" inputProps={{ 'aria-label': 'Filter vendors' }} sx={{ height: 38, width: 280, maxWidth: '100%', px: 3, border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', fontSize: 13.5 }} />
          <Tag>Sample data</Tag>
        </Box>
        {list.length ? (
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Box component="th" sx={th}>Vendor</Box>
                <Box component="th" sx={th}>Standing</Box>
                <Box component="th" sx={th}>History</Box>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.name}>
                  <Box component="td" sx={td}>
                    <Box component="b" sx={{ display: 'block', color: 'og.head' }}>{v.name}</Box>
                    <Box component="small" sx={{ display: 'block', mt: '2px', fontSize: 12, color: 'og.gray' }}>{v.detail}</Box>
                  </Box>
                  <Box component="td" sx={td}>
                    {v.standing === 'trusted' ? <Pill tone="good">Trusted</Pill> : v.standing === 'risk' ? <Pill tone="risk">Compliance risk</Pill> : <Pill tone="mid">Neutral</Pill>}
                  </Box>
                  <Box component="td" sx={td}>{v.history}</Box>
                </tr>
              ))}
            </tbody>
          </Box>
        ) : (
          <EmptyCard title="No vendors match" />
        )}
      </SCard>
    </SettingsShell>
  );
}
