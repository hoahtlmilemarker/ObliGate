import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, routes } from '@/layout';
import { LiftCard, OgDialog } from '@/components';
import { HOME_DR, plural, summarize } from '@/data/classify';
import { cancelBatch, getResults, isDemoBatch } from '@/data/uploadSession';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import { AnTag, CardHead, FileRow, StepList, TwoCol } from './ui';
import illustration from './scan.svg';

/** Total simulated run time; the real app follows the analysis job status instead. */
const DURATION = 5200;

/** 13 · Analysis running — progress, live file feed, steps. Goes to the report when done. */
export default function AnalysisRunning() {
  const nav = useNavigate();
  const { files } = useMemo(getResults, []);
  const s = useMemo(() => summarize(files), [files]);
  const demo = useMemo(isDemoBatch, []);
  const [pct, setPct] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    document.title = 'Analyzing your records';
  }, []);

  useEffect(() => {
    let raf = 0;
    let done = 0;
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!paused.current) elapsed += now - last;
      last = now;
      const v = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setPct(v);
      if (v < 100) raf = requestAnimationFrame(tick);
      else done = window.setTimeout(() => !paused.current && nav(routes.analysisReport, { replace: true }), 700);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [nav]);

  useEffect(() => {
    paused.current = confirm;
  }, [confirm]);

  const step = Math.max(4, Math.floor(90 / Math.max(1, files.length)));
  const checked = Math.round((pct / 100) * s.total);
  const byProject = s.projects.map((pw) => [pw, files.filter((x) => x.placed && x.pw === pw).length] as const);
  const late = pct >= 70;

  return (
    <AppShell>
      <Masthead
        illustration={illustration}
        eyebrow={
          <MastheadEyebrow>
            Analysis in progress · {plural(s.total, 'file')}
            {demo ? ' · sample data' : ''}
          </MastheadEyebrow>
        }
        title="Analyzing your records"
        subtitle="You can leave this page. We will notify you when the report is ready."
      >
        <Box>
          <Button variant="onDark" onClick={() => setConfirm(true)}>
            Cancel Analysis
          </Button>
        </Box>
      </Masthead>

      <TwoCol>
        <LiftCard component="section" aria-label="Progress">
          <Box sx={{ p: 5, borderBottom: 1, borderColor: 'og.line' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 300,
                  color: 'og.head',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {pct}%
              </Typography>
              <Typography aria-live="polite" sx={{ fontSize: 13, color: 'og.gray' }}>
                {pct < 100 ? `About ${Math.max(1, Math.ceil((100 - pct) / 40))} minute${100 - pct > 40 ? 's' : ''} left` : 'Building your report…'}
              </Typography>
            </Box>
            <Box
              role="progressbar"
              aria-label="Analysis progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              sx={{
                mt: 3,
                height: 6,
                borderRadius: '3px',
                bgcolor: 'og.lineSoft',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${pct}%`,
                  height: 1,
                  background: 'linear-gradient(90deg,#0A4E86,#3F7FD9)',
                  transition: 'width .12s linear',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 16px',
                mt: 3.5,
                fontSize: 12.5,
                color: 'og.gray',
                '& b': { color: 'og.head' },
              }}
            >
              {s.placed ? (
                <span>
                  Detected <b>{HOME_DR}</b> · California Severe Winter Storms
                </span>
              ) : (
                <span>No project detected yet</span>
              )}
              {byProject.map(([pw, n]) => (
                <span key={pw}>
                  {plural(n, 'file')} → {pw}
                </span>
              ))}
              {s.otherDrs.map((d) => (
                <span key={d}>
                  Also found <b>{d}</b>
                </span>
              ))}
              {s.unplaced > 0 && <span>{plural(s.unplaced, 'file')} → Needs a folder</span>}
            </Box>
          </Box>
          <CardHead title="Files" sx={{ borderBottom: 0 }}>
            <Typography sx={{ fontSize: 13, color: 'og.gray' }}>
              {checked} of {s.total} checked
            </Typography>
          </CardHead>
          <Box
            component="ul"
            aria-live="off"
            sx={{
              m: 0,
              px: 5,
              pb: 3,
              '& > li:first-of-type': {
                borderTop: 1,
                borderTopColor: 'og.lineSoft',
              },
            }}
          >
            {files.map((x, i) => {
              const done = pct >= (i + 1) * step;
              const reading = !done && (i === 0 || pct >= i * step);
              return (
                <FileRow key={x.name} name={x.name} sub={`${x.kind}${x.why ? ` · ${x.why}` : ''}`}>
                  <AnTag tone={done ? x.tone : reading ? 'run' : 'idle'}>{done ? x.tag : reading ? 'Reading…' : 'Waiting'}</AnTag>
                </FileRow>
              );
            })}
          </Box>
        </LiftCard>

        <LiftCard component="section" aria-label="Steps" sx={{ '@media (min-width:1101px)': { position: 'sticky', top: 84 } }}>
          <CardHead title="Steps" />
          <StepList
            steps={[
              {
                title: 'Read & classify every file',
                state: 'done',
                text: `${s.total} of ${s.total} files read.`,
              },
              {
                title: 'Match to disaster & project',
                state: 'done',
                text: s.placed
                  ? `${HOME_DR} detected across ${plural(s.projects.length, 'project')}. ${s.auto} filed automatically${s.check ? `, ${s.check} filed for you to check` : ''}${s.unplaced ? `, ${s.unplaced} need${s.unplaced === 1 ? 's' : ''} a folder.` : '.'}`
                  : `No DR number or project found. ${plural(s.unplaced, 'file')} need${s.unplaced === 1 ? 's' : ''} a folder.`,
              },
              {
                title: 'Check against FEMA rules',
                state: late ? 'done' : 'run',
                text: late ? `${s.placed} of ${s.placed} filed documents checked.` : `Checking ${plural(s.placed, 'filed document')}.`,
              },
              {
                title: 'Flag costs at risk',
                state: late ? 'run' : 'todo',
                text: late ? 'Adding up costs FEMA could question…' : 'Starts when the rule check finishes.',
              },
            ]}
          />
        </LiftCard>
      </TwoCol>

      <OgDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        eyebrow="Cancel analysis"
        title="Stop analyzing these files?"
        confirmLabel="Stop Analysis"
        cancelLabel="Keep Analyzing"
        danger
        onConfirm={() => {
          cancelBatch();
          nav(routes.upload, { replace: true });
        }}
      >
        Files read so far are kept. Nothing is checked against FEMA rules until you start the analysis again.
      </OgDialog>
    </AppShell>
  );
}
