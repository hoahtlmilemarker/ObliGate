import { Box, Button, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppShell, routes } from '@/layout';
import { LiftCard, useToast } from '@/components';
import { ArrowRightIcon } from '@/icons';
import { blockingFindings, kpis, preSubmission as ps, ruleFamilies, type CheckItem, type Kpi } from '@/data/preSubmission';
import illustration from './illustration.svg';
import { Masthead, MastheadEyebrow } from './Masthead';
import { ActionDialog, ButtonSpinner, SealIcon, Tag } from './ui';
import { UploadModal } from '@/components/UploadModal';

function KpiCell({ k }: { k: Kpi }) {
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
        '@media (max-width:640px)': { borderRight: 0, borderBottom: 1, borderBottomColor: 'og.lineSoft' },
      }}
    >
      <Typography variant="label" sx={{ fontSize: 10, lineHeight: 1.55 }}>
        {k.label}
      </Typography>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 28,
          fontWeight: 500,
          lineHeight: 1,
          fontVariantNumeric: 'lining-nums tabular-nums',
          color: k.valueTone === 'risk' ? (t.palette.mode === 'dark' ? '#F2978C' : '#A3392D') : t.palette.og.head,
          '@media (max-width:640px)': { fontSize: 24 },
        })}
      >
        {k.value}
      </Box>
      {k.noteTone === 'riskTag' ? (
        <span>
          <Tag tone="risk">{k.note}</Tag>
        </span>
      ) : (
        <Box component="span" sx={{ fontSize: 13, color: k.noteTone === 'good' ? 'og.good' : k.noteTone === 'warn' ? 'og.warn' : 'og.gray', fontWeight: k.noteTone === 'gray' ? 400 : 700 }}>
          {k.note}
        </Box>
      )}
    </Box>
  );
}

/** 07 · Pre-Submission Audit Readiness — rule checklist that gates locking the claim binder. */
export default function PreSubmission() {
  const toast = useToast();
  const [lockOpen, setLockOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const findingRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const runSamSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      toast({ title: 'SAM.gov search submitted', message: 'the dated printout will be attached when it returns' });
    }, 1600);
  };

  const reviewFindings = () => {
    const first = ruleFamilies.flatMap((f) => f.checks).find((c) => c.status !== 'ok');
    if (first) findingRefs.current[first.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const renderCheck = (c: CheckItem) => {
    const bad = c.status === 'bad';
    return (
      <Box
        key={c.id}
        id={`check-${c.id}`}
        ref={(el: HTMLDivElement | null) => {
          findingRefs.current[c.id] = el;
        }}
        sx={{ display: 'flex', gap: 4, p: '20px 16px', borderBottom: 1, borderColor: 'og.lineSoft', borderRadius: '4px', bgcolor: bad ? 'og.riskTint' : 'transparent' }}
      >
        <SealIcon status={c.status} />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: c.actions ? 2 : 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2.5 }}>
            <Box component="strong" sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.55, color: 'og.ink' }}>
              {c.title}
            </Box>
            <Tag sx={bad ? { bgcolor: 'og.card' } : undefined}>{c.citation}</Tag>
          </Box>
          <Box component="span" sx={{ fontSize: 14, lineHeight: 1.55, color: bad ? 'og.ink' : 'og.gray' }}>
            {c.description}
          </Box>
          {c.evidence && (
            <Box component="span" sx={{ fontSize: 13, lineHeight: 1.55, fontWeight: 700, color: 'og.good' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 4 }}>
                <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c.evidence}
            </Box>
          )}
          {c.actions && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {c.actions.map((a) => {
                switch (a.kind) {
                  case 'upload':
                    return (
                      <Button key={a.kind} variant="outlined" onClick={() => setUploadOpen(true)}>
                        {a.label}
                      </Button>
                    );
                  case 'samSearch':
                    return (
                      <Button key={a.kind} variant="text" onClick={runSamSearch} disabled={searching} aria-busy={searching} sx={{ px: 4, color: 'og.blue', '&:hover': { color: 'og.blueHover' }, '&.Mui-disabled': { color: 'og.blue', opacity: 0.85 } }}>
                        {searching ? (
                          <>
                            <ButtonSpinner />
                            Searching SAM.gov…
                          </>
                        ) : (
                          a.label
                        )}
                      </Button>
                    );
                  case 'signature':
                    return (
                      <Button key={a.kind} variant="contained" component={RouterLink} to={routes.signature} endIcon={<ArrowRightIcon size={13} />}>
                        {a.label}
                      </Button>
                    );
                  case 'crossCheck':
                    return (
                      <Button key={a.kind} variant="outlined" component={RouterLink} to={routes.crossCheck}>
                        {a.label}
                      </Button>
                    );
                }
              })}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <AppShell active="preSubmission" searchLabel="Search checklist...">
      <Box sx={{ flex: 1, bgcolor: 'og.pale' }}>
        <Masthead
          illustration={illustration}
          eyebrow={
            <MastheadEyebrow sx={{ lineHeight: '23.25px' }}>
              {ps.eyebrow}
              <Box component="span" aria-hidden sx={{ mx: 2, opacity: 0.6 }}>
                ·
              </Box>
              <Box component={RouterLink} to={routes.project} sx={{ color: 'inherit', '&:hover': { color: '#E2C27E' } }}>
                {ps.projectCrumb}
              </Box>
            </MastheadEyebrow>
          }
          title={ps.title}
          subtitle={ps.subtitle}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
            <Tag tone="warn" dot sx={{ fontSize: 13, p: '6px 14px' }}>
              {ps.readiness}
            </Tag>
            <Box component="span" sx={{ fontSize: 13, color: 'rgba(255,255,255,.68)' }}>
              {ps.readinessNote}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, pt: 2 }}>
            <Button variant="inverse" onClick={() => setLockOpen(true)} sx={{ px: '14px' }}>
              Lock &amp; Assemble Binder
            </Button>
          </Box>
        </Masthead>

        <Box sx={{ position: 'relative', zIndex: 3, px: '28px', pb: 12 }}>
          <LiftCard
            component="section"
            aria-label="Summary"
            sx={{
              mt: '-52px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))',
              '@media (max-width:640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            {kpis.map((k) => (
              <KpiCell key={k.label} k={k} />
            ))}
          </LiftCard>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7, p: '36px 0 64px' }}>
            {ruleFamilies.map((f) => (
              <section key={f.id} aria-label={f.ariaLabel}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2.5, pb: 3, borderBottom: 2, borderColor: 'og.head' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 300, lineHeight: 1.55, letterSpacing: '-0.02em', color: 'og.head' }}>
                      {f.title}
                    </Typography>
                    <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
                      {f.subtitle}
                    </Box>
                  </Box>
                  <Tag tone={f.badgeTone} dot>
                    {f.badge}
                  </Tag>
                </Box>
                {f.checks.map(renderCheck)}
              </section>
            ))}
          </Box>
        </Box>
      </Box>

      <ActionDialog open={lockOpen} onClose={() => setLockOpen(false)} danger noCancel eyebrow="Locked by Findings" title="3 findings must be resolved first" okLabel="Review Findings" onOk={reviewFindings}>
        <p>The binder can only be locked when every critical finding is resolved:</p>
        <p>
          {blockingFindings.map((t, i) => (
            <span key={t}>
              • {t}
              {i < blockingFindings.length - 1 && <br />}
            </span>
          ))}
        </p>
      </ActionDialog>
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        destination={ps.uploadDestination}
        onCommit={(files) => toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: `to ${ps.uploadDestination} · auto-classifying`, inline: true, duration: 6000 })}
      />
    </AppShell>
  );
}
