import { Box, Button, IconButton, MenuItem, OutlinedInput, Select, Tooltip, Typography, keyframes } from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { StatusTag, useToast, type Tone } from '@/components';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ThemeIcon } from '@/icons';
import { routes } from '@/layout';
import { useColorMode } from '@/theme/ColorModeProvider';
import { rescanReasons, reviewQueue, type ReviewTone } from '@/data/review';
import { ActionDialog, DialogField, dialogTextareaSx, selectSx } from './ActionDialog';
import { ExtractedFields, fieldCount, issueChip, tagSx } from './ExtractedFields';
import { PaperPreview, paperSx } from './PaperPreview';

const N = reviewQueue.length;
/** Zoom cycle used by the toolbar button; +/− step through the sorted list. */
const ZOOMS = [100, 125, 150, 75];
const ZOOM_STEPS = [75, 100, 125, 150];
const STORE_KEY = 'og-doc';

const rvIn = keyframes`from{opacity:.25;transform:translateY(6px)}to{opacity:1;transform:none}`;
const pgIn = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}`;

const toneOf = (t: ReviewTone): Tone => (t === 'blue' ? 'proc' : t);

function readStoredIndex() {
  try {
    const v = Number(sessionStorage.getItem(STORE_KEY));
    if (Number.isInteger(v) && v >= 0 && v < N) return v;
  } catch {
    /* storage unavailable */
  }
  return 0;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <Box component="kbd" sx={{ font: '700 11px/1 Manrope, Arial, sans-serif', p: '3px 5px', border: 1, borderColor: 'og.line', borderBottomWidth: 2, borderRadius: '4px', color: 'og.ink', bgcolor: 'og.card' }}>
      {children}
    </Box>
  );
}

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

/** 04 · Document Review — scanned paper on the left, AI-extracted metadata on the right, 14-document queue. */
export default function DocumentReview() {
  const toast = useToast();
  const { mode, toggle } = useColorMode();
  const [cur, setCur] = useState(readStoredIndex);
  const [status, setStatus] = useState<[ReviewTone, string] | null>(null);
  const [zi, setZi] = useState(0);
  const [rot, setRot] = useState(0);
  const [dialog, setDialog] = useState<'rescan' | 'reject' | null>(null);
  const [reason, setReason] = useState(rescanReasons[0]);
  const [rejectNote, setRejectNote] = useState('');
  const paperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const [margin, setMargin] = useState<string | undefined>();

  const d = reviewQueue[cur];
  const st = status ?? d.st;
  const last = cur === N - 1;
  const chip = issueChip(d);

  const go = useCallback((i: number) => {
    if (i < 0 || i >= N) return;
    setCur(i);
    setStatus(null);
    setRot(0);
    try {
      sessionStorage.setItem(STORE_KEY, String(i));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 0 });
    fieldsRef.current?.scrollTo?.({ top: 0 });
  }, [cur]);

  // Rotated paper keeps its footprint: compensate with margins (same maths as the prototype).
  useLayoutEffect(() => {
    const p = paperRef.current;
    if (!p) return;
    const side = rot % 180 !== 0;
    const dd = side ? (p.offsetHeight - p.offsetWidth) / 2 : 0;
    setMargin(side ? `${-dd}px ${dd}px` : undefined);
  }, [rot, cur, zi]);

  const stepZoom = useCallback((dir: 1 | -1) => {
    setZi((z) => {
      const i = ZOOM_STEPS.indexOf(ZOOMS[z]);
      const n = ZOOM_STEPS[Math.min(3, Math.max(0, i + dir))];
      return ZOOMS.indexOf(n);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialog || isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const onControl = (e.target as HTMLElement | null)?.closest?.('button, a, [role="button"], [role="option"]');
      switch (e.key) {
        case 'j':
          e.preventDefault();
          go(cur + 1);
          break;
        case 'k':
          e.preventDefault();
          go(cur - 1);
          break;
        case 'Enter':
          if (onControl) return; // let the focused control handle Enter itself
          e.preventDefault();
          if (cur < N - 1) go(cur + 1);
          break;
        case '+':
        case '=':
          stepZoom(1);
          break;
        case '-':
        case '_':
          stepZoom(-1);
          break;
        case 'r':
          setRot((r) => (r + 90) % 360);
          break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cur, dialog, go, stepZoom]);

  const closeDialog = () => setDialog(null);
  const openRescan = () => {
    setReason(rescanReasons[0]);
    setDialog('rescan');
  };
  const openReject = () => {
    setRejectNote('');
    setDialog('reject');
  };
  const sendRescan = () => {
    setStatus(['blue', 'Re-scan requested']);
    closeDialog();
    toast({ title: 'Re-scan requested', message: 'uploader notified' });
  };
  const reject = () => {
    setStatus(['risk', 'Rejected']);
    closeDialog();
    toast({ title: 'Document rejected', message: 'reason saved to audit history' });
    const from = cur;
    window.setTimeout(() => {
      if (from < N - 1) go(from + 1);
    }, 900);
  };

  const zoom = ZOOMS[zi];
  const themeLabel = `Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'og.bg',
        '@media (max-width:960px)': { height: 'auto', minHeight: '100vh', overflow: 'visible' },
      }}
    >
      {/* Review toolbar */}
      <Box
        component="header"
        sx={{
          flex: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px 14px',
          p: '10px clamp(16px, 3vw, 36px)',
          bgcolor: 'og.pale',
          borderBottom: 1,
          borderColor: 'og.line',
          '@media (min-width:1000px)': { flexWrap: 'nowrap' },
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, minWidth: 0, '@media (min-width:1000px)': { flex: '1 1 auto', flexWrap: 'nowrap' } }}>
          <Button component={RouterLink} to={routes.library} variant="outlined" startIcon={<ArrowLeftIcon size={13} />} sx={{ flex: 'none' }}>
            Back to Library
          </Button>
          <Typography
            component="span"
            title={d.n}
            sx={{ fontSize: 15, fontWeight: 700, color: 'og.head', letterSpacing: 0, minWidth: 0, overflowWrap: 'anywhere', '@media (min-width:1000px)': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}
          >
            {d.n}
          </Typography>
          <StatusTag tone={toneOf(st[0])} noDot sx={[tagSx, { flex: 'none' }]}>
            <span aria-live="polite">{st[1]}</span>
          </StatusTag>
          <Box component="nav" aria-label="Review queue" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, flex: 'none' }}>
            <Button size="small" variant="outlined" aria-label="Previous document" disabled={cur === 0} onClick={() => go(cur - 1)} sx={{ width: 30, minWidth: 30, p: 0, '&.Mui-disabled': { opacity: 0.4, bgcolor: 'og.card', borderColor: 'og.line', color: 'og.head' } }}>
              <ChevronLeftIcon size={13} />
            </Button>
            <Box component="span" aria-live="polite" sx={{ minWidth: 76, textAlign: 'center', fontSize: 13, color: 'og.gray', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              Doc{' '}
              <Box component="b" sx={{ color: 'og.head' }}>
                {cur + 1}
              </Box>{' '}
              of {N}
            </Box>
            <Button size="small" variant="outlined" aria-label="Next document" disabled={last} onClick={() => go(cur + 1)} sx={{ width: 30, minWidth: 30, p: 0, '&.Mui-disabled': { opacity: 0.4, bgcolor: 'og.card', borderColor: 'og.line', color: 'og.head' } }}>
              <ChevronRightIcon size={13} />
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, '@media (min-width:1000px)': { flex: 'none', flexWrap: 'nowrap' } }}>
          {[
            [
              <>
                <Kbd>j</Kbd>/<Kbd>k</Kbd>
              </>,
              'Next / Prev',
            ],
            [<Kbd>Enter</Kbd>, 'Confirm'],
          ].map(([k, l], i) => (
            <Box key={i} component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: 13, color: 'og.gray', whiteSpace: 'nowrap', '@media (max-width:1380px)': { display: 'none' } }}>
              {k} {l}
            </Box>
          ))}
          <Tooltip title="Click to change zoom (or press + / −)">
            <Button variant="text" onClick={() => setZi((z) => (z + 1) % ZOOMS.length)} sx={{ color: 'og.blue', px: 4, '&:hover': { color: 'og.blue', bgcolor: 'og.blueTint' } }}>
              Zoom: {zoom}%
            </Button>
          </Tooltip>
          <Button variant="outlined" onClick={() => setRot((r) => (r + 90) % 360)} aria-label={`Rotate 90°, currently ${rot}°`}>
            Rotate 90°
          </Button>
          <Tooltip title={themeLabel}>
            <IconButton onClick={toggle} aria-label={themeLabel} sx={{ width: 36, height: 36, border: 1, borderColor: 'og.line', bgcolor: 'og.card', color: 'og.head', '&:hover': { borderColor: 'og.head', bgcolor: 'og.card' } }}>
              <ThemeIcon size={16} strokeWidth={1.6} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Panes */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1, minHeight: 0, animation: `${pgIn} .38s cubic-bezier(.2,.7,.2,1) both`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
        <Box
          component="section"
          ref={scrollRef}
          aria-label="Document scan"
          sx={(t) => ({
            flex: '1.4 1 560px',
            minWidth: 0,
            maxHeight: '100%',
            boxSizing: 'border-box',
            bgcolor: t.palette.mode === 'dark' ? '#08111A' : '#E4EAF0',
            p: '32px clamp(16px, 3vw, 40px)',
            display: 'flex',
            justifyContent: zoom !== 100 || rot ? 'safe center' : 'center',
            alignItems: 'flex-start',
            overflow: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            '@media (max-width:960px)': { maxHeight: 'none' },
            '@media (max-width:820px)': { justifyContent: 'flex-start' },
          })}
        >
          <Box
            key={cur}
            ref={paperRef}
            sx={[
              paperSx,
              {
                zoom: zoom / 100,
                transform: rot ? `rotate(${rot}deg)` : undefined,
                transition: 'transform .25s ease',
                margin,
                animation: `${rvIn} .22s ease-out`,
                '@media (max-width:820px)': { mx: margin ? undefined : 'auto' },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              },
            ]}
          >
            <PaperPreview doc={d} />
          </Box>
        </Box>

        <Box
          component="aside"
          aria-label="Extracted fields"
          sx={{ flex: '1 1 400px', minWidth: 0, maxHeight: '100%', boxSizing: 'border-box', borderLeft: 1, borderColor: 'og.line', bgcolor: 'og.card', display: 'flex', flexDirection: 'column', overflow: 'hidden', '@media (max-width:960px)': { maxHeight: 'none' } }}
        >
          <Box sx={{ p: '18px 24px 14px', borderBottom: 1, borderColor: 'og.line', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="label" sx={{ color: 'og.blue' }}>
              Automated Extraction
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2.5 }}>
              <Typography component="h1" sx={{ fontSize: 23, fontWeight: 300, color: 'og.head', letterSpacing: '-0.02em', lineHeight: 1.55, '@media (max-width:640px)': { fontSize: 30 } }}>
                AI Extracted Metadata ({fieldCount(d)} Fields)
              </Typography>
              {chip && (
                <StatusTag tone="warn" noDot sx={tagSx}>
                  {chip}
                </StatusTag>
              )}
            </Box>
          </Box>
          <Box
            key={cur}
            ref={fieldsRef}
            sx={{ p: '14px 24px', display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
          >
            <ExtractedFields d={d} />
          </Box>
          <Box sx={{ p: '16px 24px 24px', borderTop: 1, borderColor: 'og.line', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button variant="contained" fullWidth onClick={() => !last && go(cur + 1)}>
              {last ? 'Confirm & Finish Queue [Enter]' : 'Confirm & Next Document [Enter]'}
            </Button>
            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Button variant="outlined" onClick={openRescan} sx={{ flex: 1 }}>
                Request Re-Scan
              </Button>
              <Button variant="outlined" onClick={openReject} sx={{ flex: 1, color: 'og.risk', borderColor: 'og.risk', '&:hover': { color: 'og.risk', borderColor: 'og.risk', bgcolor: 'og.riskTint' } }}>
                Reject Document
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <ActionDialog open={dialog === 'rescan'} onClose={closeDialog} eyebrow="Re-Scan" title="Request a new scan" okLabel="Send Request" onOk={sendRescan}>
        <p>
          The uploader is asked to scan the original again. The document stays in the queue as <b>Re-scan requested</b>.
        </p>
        <DialogField label="Reason" labelId="rescan-reason-label">
          <Select labelId="rescan-reason-label" value={reason} onChange={(e) => setReason(e.target.value)} fullWidth input={<OutlinedInput />} sx={selectSx}>
            {rescanReasons.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </DialogField>
        <DialogField label="Note to uploader (optional)" htmlFor="rescan-note">
          <OutlinedInput id="rescan-note" inputComponent="textarea" inputProps={{ rows: 3 }} fullWidth placeholder="Add details for the uploader" sx={dialogTextareaSx} />
        </DialogField>
      </ActionDialog>

      <ActionDialog danger open={dialog === 'reject'} onClose={closeDialog} eyebrow="Reject" title="Reject this document?" okLabel="Reject Document" onOk={reject} okDisabled={!rejectNote.trim()}>
        <p>Rejected documents are removed from the claim and kept in the audit history.</p>
        <DialogField label="Reason (required)" htmlFor="reject-note">
          <OutlinedInput
            id="reject-note"
            autoFocus
            inputComponent="textarea"
            inputProps={{ rows: 3 }}
            fullWidth
            required
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Why is this document being rejected?"
            sx={dialogTextareaSx}
          />
        </DialogField>
      </ActionDialog>
    </Box>
  );
}
