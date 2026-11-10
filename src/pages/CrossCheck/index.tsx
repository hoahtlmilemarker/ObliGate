import { Box, Button, ButtonBase, OutlinedInput, Typography, keyframes, type Theme } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LiftCard, StatusTag, useToast } from '@/components';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@/icons';
import { AppShell, routes } from '@/layout';
import { brand } from '@/theme/tokens';
import globe from '@/assets/banner-globe.svg';
import { complianceFinding, crossCheckHeader as H, periodKpis, sources, workerQueue, type SourcePanel, type WorkerFinding } from '@/data/crossCheck';
import { ActionDialog, DialogField, dialogTextareaSx } from '../DocumentReview/ActionDialog';
import cubes from './cubes.svg';

/** Prototype `.tag` metrics (12px / 600 / 3px 10px). */
const tagSx = { fontSize: 12, fontWeight: 600, lineHeight: '18px', p: '3px 10px', letterSpacing: 0, gap: '6px' } as const;
/** "Deep" navy surface (active worker card, resolution bar). */
const deep = (t: Theme) => (t.palette.mode === 'dark' ? '#06101A' : '#00365D');
const spin = keyframes`to{transform:rotate(360deg)}`;

function WorkerCard({ w }: { w: WorkerFinding }) {
  const head = (
    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      {w.link ? <strong>{w.name}</strong> : <span>{w.name}</span>}
      <StatusTag tone={w.tag.tone} noDot sx={tagSx}>
        {w.tag.tone === 'good' && <CheckIcon size={13} strokeWidth={2.2} />}
        {w.tag.label}
      </StatusTag>
    </Box>
  );
  const sx = (t: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 1.5,
    p: '14px 16px',
    mb: '19px',
    border: `1px solid ${w.active ? deep(t) : t.palette.og.line}`,
    borderRadius: '4px',
    bgcolor: w.active ? deep(t) : t.palette.og.card,
    color: w.active ? '#FFFFFF' : t.palette.og.ink,
    fontSize: 15,
    lineHeight: 1.55,
    textDecoration: 'none',
    ...(w.link && { '&:hover': { borderColor: w.active ? deep(t) : t.palette.og.blue, color: w.active ? '#FFFFFF' : t.palette.og.ink } }),
  });
  const body = (
    <>
      {head}
      {w.lines.map((l) => (
        <Box key={l} component="span" sx={{ fontSize: 13, ...(w.active ? { opacity: 0.8 } : { color: 'og.gray' }), fontVariantNumeric: 'tabular-nums' }}>
          {l}
        </Box>
      ))}
      {w.diff && (
        <Box component="span" sx={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {w.diff}
        </Box>
      )}
    </>
  );
  return w.link ? (
    <Box component={RouterLink} to={routes.crossCheck} aria-current={w.active ? 'page' : undefined} sx={sx}>
      {body}
    </Box>
  ) : (
    <Box sx={sx}>{body}</Box>
  );
}

function Sidebar() {
  return (
    <Box>
      <Typography variant="label" component="h2" sx={{ pb: 1, mb: 4.5 }}>
        Worker Findings Queue
      </Typography>
      {workerQueue.map((w) => (
        <WorkerCard key={w.name} w={w} />
      ))}
    </Box>
  );
}

function Kpi({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        p: '14px 24px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRight: 1,
        borderColor: 'og.lineSoft',
        '&:last-of-type': { borderRight: 0 },
        '@media (max-width:960px)': { borderRight: 0, borderBottom: 1, borderColor: 'og.lineSoft' },
      }}
    >
      <Typography variant="label" sx={{ fontSize: 10 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

const bigSx = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: 28,
  fontWeight: 500,
  lineHeight: 1,
  color: 'og.head',
  fontVariantNumeric: 'lining-nums tabular-nums',
  '@media (max-width:960px)': { fontSize: 24 },
} as const;

function Source({ s }: { s: SourcePanel }) {
  return (
    <Box component="section" aria-label={`Source ${s.key}`} sx={{ bgcolor: 'og.card', border: 1, borderColor: 'og.line', borderRadius: '4px', overflow: 'hidden' }}>
      <Box sx={{ p: '18px 20px', borderBottom: '2px solid', borderColor: 'og.head', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="label" sx={{ color: 'og.blue' }}>
            {s.kicker}
          </Typography>
          <StatusTag tone={s.tag.tone} noDot sx={tagSx}>
            {s.tag.label}
          </StatusTag>
        </Box>
        <Typography component="h3" sx={{ fontSize: 18, fontWeight: 600, color: 'og.head', lineHeight: 1.4 }}>
          {s.title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'og.gray' }}>{s.description}</Typography>
      </Box>
      <Box component="dl" sx={{ m: 0 }}>
        {s.rows.map((r, i) => {
          const lastRow = i === s.rows.length - 1;
          const rowSx = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
            p: '13px 20px',
            borderBottom: lastRow ? 0 : 1,
            borderColor: 'og.lineSoft',
            fontSize: 14,
            '& dd': { m: 0, textAlign: 'right' },
          };
          return r.flagged ? (
            <Box key={r.label} sx={[rowSx, { bgcolor: 'og.riskTint', borderBottom: 1, borderColor: 'og.risk' }]}>
              <Box component="dt" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box component="strong" sx={{ color: 'og.risk' }}>
                  {r.label}
                </Box>
                <Box component="span" sx={{ fontSize: 12.5, color: 'og.gray' }}>
                  {r.flagged.sub}
                </Box>
              </Box>
              <Box component="dd" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontVariantNumeric: 'tabular-nums' }}>
                <Box component="strong" sx={{ fontSize: 20, color: 'og.risk' }}>
                  {r.value}
                </Box>
                <Box component="span" sx={{ fontSize: 12.5 }}>
                  {r.flagged.amount}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box key={r.label} sx={rowSx}>
              <Box component="dt" sx={{ color: 'og.gray' }}>
                {r.label}
              </Box>
              <Box component="dd" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {r.value}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const resolvedSx = { display: 'inline-flex', alignItems: 'center', gap: 1.5, p: '6px 10px', borderRadius: '4px', bgcolor: 'og.goodTint', color: 'og.good', fontSize: 13, fontWeight: 700 } as const;
const wrapBtn = { whiteSpace: { xs: 'normal', sm: 'nowrap' }, height: 'auto', minHeight: 36, py: { xs: 2, sm: 0 }, textAlign: 'center', lineHeight: 1.3 } as const;

/** 05 · Cross-Check — claimed payroll vs. field evidence for one worker and pay period. */
export default function CrossCheck() {
  const toast = useToast();
  const [running, setRunning] = useState(false);
  const [dialog, setDialog] = useState<'accept' | 'dismiss' | null>(null);
  const [note, setNote] = useState('');
  const [resolved, setResolved] = useState<string | null>(null);

  const period = (label: string) => toast({ title: label, message: 'only Pay Period 02 has data for this project', tone: 'warning' });
  const run = () => {
    setRunning(true);
    window.setTimeout(() => {
      setRunning(false);
      toast({ title: 'Cross-check complete', message: 'results refreshed for Pay Period 02' });
    }, 1600);
  };
  const accept = () => {
    setDialog(null);
    setResolved('Resolved · claim reduced by $325.20');
    toast({ title: 'Finding resolved', message: 'claim reduced by $325.20' });
  };
  const dismiss = () => {
    setDialog(null);
    setResolved('Dismissed with audit note');
    toast({ title: 'Finding dismissed', message: 'note saved' });
  };

  const linkSx = { color: '#9CC7EC', '&:hover': { color: '#FFFFFF', textDecoration: 'underline' } };
  const periodBtnSx = { color: 'rgba(255,255,255,.72)', px: 2, '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.06)' } };

  return (
    <AppShell active="crossCheck" searchLabel="Search reconciliation..." sidebar={<Sidebar />} sidebarLabel="Worker findings queue">
      {/* Banner */}
      <Box
        component="section"
        sx={{ position: 'relative', overflow: 'hidden', color: '#FFFFFF', backgroundImage: `radial-gradient(120% 160% at 85% 0%, ${brand.navy2} 0%, ${brand.navy} 60%)` }}
      >
        <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.26, pointerEvents: 'none' }} />
        <Box
          component="img"
          src={cubes}
          alt=""
          aria-hidden
          sx={{ position: 'absolute', top: 26, right: 40, height: 150, width: 'auto', pointerEvents: 'none', '@media (max-width:960px)': { opacity: 0.35, right: -40 }, '@media (max-width:640px)': { display: 'none' } }}
        />
        <Box sx={{ position: 'relative', p: { xs: '20px 16px 84px', md: '22px 28px 70px' }, display: 'flex', flexDirection: 'column', gap: 2, '@media (max-width:960px)': { pb: '84px' } }}>
          <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 0.5, fontSize: 13, color: 'rgba(255,255,255,.68)' }}>
            <Box component={RouterLink} to={routes.project} sx={linkSx}>
              {H.crumbs.project}
            </Box>
            <span aria-hidden>/</span>
            <span>{H.crumbs.ledger}</span>
            <span aria-hidden>/</span>
            <Box component="strong" aria-current="page" sx={{ color: '#FFFFFF' }}>
              {H.crumbs.period}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: -2 }}>
            <Button variant="text" size="small" startIcon={<ArrowLeftIcon size={13} />} onClick={() => period(H.prevPeriod)} sx={periodBtnSx}>
              {H.prevPeriod}
            </Button>
            <Button variant="text" size="small" endIcon={<ArrowRightIcon size={13} />} onClick={() => period(H.nextPeriod)} sx={periodBtnSx}>
              {H.nextPeriod}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Typography variant="eyebrow" component="span">
              {H.employee}
            </Typography>
            <StatusTag tone="risk" sx={[tagSx, { fontSize: 11.5 }]}>
              {H.flag}
            </StatusTag>
          </Box>
          <Typography variant="display" sx={{ color: '#FFFFFF', fontSize: { xs: 30, lg: 'clamp(30px, 2.33vw, 34px)' }, overflowWrap: 'anywhere', maxWidth: { md: 'min(980px, 64vw)' } }}>
            {H.title}
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.68)', maxWidth: { md: 'min(760px, 62vw)' } }}>{H.subtitle}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 2 }}>
            <Button variant="inverse" onClick={run} disabled={running} aria-busy={running} sx={{ px: 3.5, '&.Mui-disabled': { color: brand.navy, bgcolor: '#FFFFFF', opacity: 0.85 } }}>
              {running && <Box component="span" aria-hidden sx={{ width: 13, height: 13, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: `${spin} .7s linear infinite`, flex: 'none' }} />}
              {running ? 'Running…' : 'Run Cross-Check Engine'}
            </Button>
            <Button variant="onDark" component={RouterLink} to={routes.review} sx={{ px: 3.5, '&:hover': { color: '#FFFFFF' } }}>
              Inspect Original PDF Timesheet ↗
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', px: { xs: 4, md: 7 }, pb: 14, mt: '-52px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* KPIs */}
        <LiftCard
          component="section"
          aria-label="Pay period summary"
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))', '@media (max-width:960px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' } }}
        >
          <Kpi label={periodKpis.summary.label}>
            <Box component="span" sx={bigSx}>
              {periodKpis.summary.value}
            </Box>
            <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
              {periodKpis.summary.note}
            </Box>
          </Kpi>
          <Kpi label={periodKpis.coverage.label}>
            <Box component="span" sx={bigSx}>
              {periodKpis.coverage.value}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box role="progressbar" aria-label="Coverage" aria-valuenow={periodKpis.coverage.pct} aria-valuemin={0} aria-valuemax={100} sx={{ flex: 1, height: 6, borderRadius: '4px', bgcolor: 'og.lineSoft', overflow: 'hidden' }}>
                <Box sx={{ width: `${periodKpis.coverage.pct}%`, height: 6, bgcolor: 'og.blue' }} />
              </Box>
              <Box component="span" sx={{ fontSize: 13, fontWeight: 700, color: 'og.blue', fontVariantNumeric: 'tabular-nums' }}>
                {periodKpis.coverage.pct}%
              </Box>
            </Box>
            <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
              {periodKpis.coverage.note}
            </Box>
          </Kpi>
          <Kpi label={periodKpis.atRisk.label}>
            <Box component="span" sx={[bigSx, { color: 'og.risk' }]}>
              {periodKpis.atRisk.value}
            </Box>
            <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
              {periodKpis.atRisk.note}
            </Box>
          </Kpi>
        </LiftCard>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: 5 }}>
            {sources.map((s) => (
              <Source key={s.key} s={s} />
            ))}
          </Box>

          <Box component="section" aria-label="Compliance finding" sx={{ p: '20px 24px', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'og.card', border: 1, borderColor: 'og.risk', borderRadius: '4px' }}>
            <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, color: 'og.risk' }}>
              {complianceFinding.title}
            </Typography>
            <Typography sx={{ m: 0, fontSize: 14.5, lineHeight: 1.7, color: 'og.ink' }}>{complianceFinding.body}</Typography>
          </Box>

          <Box component="section" aria-label="Resolution options" sx={(t) => ({ p: '20px 24px', bgcolor: deep(t), color: '#FFFFFF', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3.5, borderRadius: '4px' })}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700 }}>
                Resolution Options:
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: brand.onDark2 }}>How would you like to resolve this discrepancy?</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, minWidth: 0, maxWidth: '100%' }} aria-live="polite">
              {resolved ? (
                <Box component="span" sx={resolvedSx}>
                  ✓ {resolved}
                </Box>
              ) : (
                <>
                  <Button variant="onDark" onClick={() => setDialog('accept')} sx={wrapBtn}>
                    Accept Documented (Reduce Claim by $325.20)
                  </Button>
                  <Button variant="inverse" component={RouterLink} to={routes.signature} endIcon={<ArrowRightIcon size={13} />} sx={[wrapBtn, { '&:hover': { color: brand.navy } }]}>
                    Request Supervisor Attestation
                  </Button>
                  <ButtonBase
                    onClick={() => {
                      setNote('');
                      setDialog('dismiss');
                    }}
                    sx={{ ...wrapBtn, px: 4, borderRadius: '4px', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.78)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.06)' }, '&.Mui-focusVisible': { outline: '2px solid #FFFFFF' } }}
                  >
                    Dismiss Finding (Add Audit Note)
                  </ButtonBase>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <ActionDialog open={dialog === 'accept'} onClose={() => setDialog(null)} eyebrow="Resolve Finding" title="Accept documented hours?" okLabel="Reduce Claim" onOk={accept}>
        <p>
          The claim for Aguayo, Hector is reduced by <b>$325.20</b> to match the 4.0 OT hours in the field log. This is recorded in the audit trail.
        </p>
      </ActionDialog>
      <ActionDialog open={dialog === 'dismiss'} onClose={() => setDialog(null)} eyebrow="Dismiss Finding" title="Dismiss with an audit note" okLabel="Dismiss Finding" onOk={dismiss} okDisabled={!note.trim()}>
        <p>Dismissing keeps the claimed hours. An auditor will see your note.</p>
        <DialogField label="Audit note (required)" htmlFor="dismiss-note">
          <OutlinedInput id="dismiss-note" autoFocus inputComponent="textarea" inputProps={{ rows: 3 }} fullWidth required value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain why the claimed hours are correct" sx={dialogTextareaSx} />
        </DialogField>
      </ActionDialog>
    </AppShell>
  );
}
