import { Box, Button, Checkbox, FormControlLabel, IconButton, MenuItem, OutlinedInput, Select, Tooltip, Typography, type Theme } from '@mui/material';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { LiftCard, StatusTag, useToast } from '@/components';
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, ThemeIcon } from '@/icons';
import { routes } from '@/layout';
import { useColorMode } from '@/theme/ColorModeProvider';
import { brand } from '@/theme/tokens';
import globe from '@/assets/banner-globe.svg';
import {
  SAMPLE_IMPORT_FILE,
  columnMappings,
  commitRowCount,
  detectedRegions,
  detectedStructure,
  importDestination,
  importSteps,
  sheetLegend,
  sheetName,
  sheetRows,
  type SheetRow,
} from '@/data/importWizard';
import { ActionDialog, DialogField, selectSx } from '../DocumentReview/ActionDialog';
import { DetectOverlay } from './DetectOverlay';
import cubes from './cubes.svg';

const tagSx = { fontSize: 12, fontWeight: 600, lineHeight: '18px', p: '3px 10px', letterSpacing: 0, gap: '6px' } as const;
const deep = (t: Theme) => (t.palette.mode === 'dark' ? '#06101A' : '#00365D');
const IMPORT_KEY = 'og-import';

const legendColor = (t: Theme, k: (typeof sheetLegend)[number]['key']) =>
  ({ meta: '#C9CED3', head: t.palette.og.blue, rec: t.palette.og.good, carry: '#C9A45C', sub: '#C0392B' })[k];

function readImportName() {
  try {
    return sessionStorage.getItem(IMPORT_KEY) || SAMPLE_IMPORT_FILE;
  } catch {
    return SAMPLE_IMPORT_FILE;
  }
}

function SheetTag({ kind, children }: { kind: 'carry' | 'sub'; children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        px: '7px',
        mr: '9px',
        verticalAlign: '1px',
        borderRadius: '4px',
        font: '700 10px/1 Manrope, Arial, sans-serif',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...(kind === 'carry'
          ? { bgcolor: 'rgba(201,164,92,.18)', color: t.palette.mode === 'dark' ? '#E2C27E' : '#74561F' }
          : { bgcolor: 'rgba(192,57,43,.1)', color: t.palette.mode === 'dark' ? '#F2978C' : '#A3392D' }),
      })}
    >
      {children}
    </Box>
  );
}

function Row({ r }: { r: SheetRow }) {
  switch (r.kind) {
    case 'group':
      return (
        <tr className={`g g-${r.group}`}>
          <td colSpan={5}>
            <Box component="span" sx={{ fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 11 }}>
              {r.title}
            </Box>
            <Box component="span" sx={{ ml: 2.5, fontWeight: 600, color: 'og.gray' }}>
              {r.meta}
            </Box>
          </td>
        </tr>
      );
    case 'meta':
      return (
        <tr className={r.more ? 'r-meta r-more' : 'r-meta'}>
          <th scope="row" className="rn">
            {r.rn}
          </th>
          <td colSpan={4}>{r.text}</td>
        </tr>
      );
    case 'head':
      return (
        <tr className="r-head">
          <th scope="row" className="rn">
            {r.rn}
          </th>
          {r.cells.map((c, i) => (
            <td key={i}>{c}</td>
          ))}
        </tr>
      );
    case 'merge':
      return (
        <tr className="r-merge">
          <th scope="row" className="rn">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-label="Merged header">
              <path d="M3 3v5a2 2 0 0 0 2 2h8m-3-3 3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </th>
          {r.cells.map((c, i) => (
            <td key={i}>
              {i === 0 && (
                <Box component="span" sx={{ font: '700 10px/1 Manrope, Arial, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: 'og.blue', mr: 2.5 }}>
                  Merged
                </Box>
              )}
              {c}
            </td>
          ))}
        </tr>
      );
    case 'record':
      return (
        <tr>
          <th scope="row" className="rn">
            {r.rn}
          </th>
          <td>{r.cells[0]}</td>
          <td>{r.cells[1]}</td>
          <td className="num">{r.cells[2]}</td>
          <td className="num">{r.cells[3]}</td>
        </tr>
      );
    case 'carry':
      return (
        <tr className="r-carry">
          <th scope="row" className="rn">
            {r.rn}
          </th>
          <td>
            <SheetTag kind="carry">Carry-down</SheetTag>
            <Box component="span" sx={{ color: 'og.gray', textDecoration: 'line-through', mr: 2 }}>
              {r.raw}
            </Box>
            <Box component="span" sx={{ fontWeight: 700, color: 'og.head' }}>
              {r.to}
            </Box>
          </td>
          <td>{r.cells[0]}</td>
          <td className="num">{r.cells[1]}</td>
          <td className="num">{r.cells[2]}</td>
        </tr>
      );
    case 'subtotal':
      return (
        <tr className="r-sub">
          <th scope="row" className="rn">
            {r.rn}
          </th>
          <td>
            <SheetTag kind="sub">Skipped</SheetTag>
            <s>{r.label}</s>
          </td>
          <td>
            <s>{r.cells[0]}</s>
          </td>
          <td className="num">
            <s>{r.cells[1]}</s>
          </td>
          <td className="num">
            <s>{r.cells[2]}</s>
          </td>
        </tr>
      );
  }
}

const sheetSx = (t: Theme) => {
  const o = t.palette.og;
  const dark = t.palette.mode === 'dark';
  return {
    width: '100%',
    minWidth: 560,
    borderCollapse: 'collapse' as const,
    tableLayout: 'fixed' as const,
    fontSize: 13,
    '& thead th': { position: 'sticky', top: 0, p: '8px 12px', bgcolor: o.pale, borderBottom: `1px solid ${o.line}`, font: '700 11px/1 Manrope, Arial, sans-serif', letterSpacing: '.08em', color: o.gray, textAlign: 'left' },
    '& thead th:nth-of-type(n+3)': { letterSpacing: '.14em' },
    '& td, & th.rn': { textAlign: 'left', p: '9px 12px', borderBottom: `1px solid ${o.lineSoft}`, color: o.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 400 },
    '& tbody > tr > * + *': { borderLeft: `1px solid ${o.lineSoft}` },
    '& .rn': { textAlign: 'right !important', font: '600 12px/1 "SFMono-Regular", Menlo, Consolas, monospace !important', color: `${o.gray} !important`, bgcolor: o.pale },
    '& .num': { fontVariantNumeric: 'tabular-nums' },
    '& tr.g td': { p: '7px 12px', bgcolor: o.card, borderTop: `1px solid ${o.line}`, fontSize: 12 },
    '& tr.g td::before': { content: '""', display: 'inline-block', width: 3, height: 12, mr: '9px', borderRadius: '2px', verticalAlign: '-1px', bgcolor: 'currentColor' },
    '& tr.g-meta td': { color: o.gray },
    '& tr.g-head td': { color: o.blue },
    '& tr.g-rec td': { color: o.good },
    '& tr.r-meta td': { color: o.gray, fontStyle: 'italic' },
    '& tr.r-more td': { fontStyle: 'normal', fontSize: 12 },
    '& tr.r-head td': { bgcolor: o.blueTint, color: o.blue, fontWeight: 700, fontSize: 12, letterSpacing: '.04em' },
    '& tr.r-merge td, & tr.r-merge th': { bgcolor: o.card, borderBottom: `2px solid ${o.blue}`, color: o.head, fontWeight: 700, whiteSpace: 'normal' },
    '& tr.r-merge .rn': { color: `${o.blue} !important`, textAlign: 'center !important', bgcolor: o.card },
    '& tr.r-carry td': { bgcolor: 'rgba(201,164,92,.07)' },
    '& tr.r-sub td': { bgcolor: 'rgba(192,57,43,.05)', color: dark ? '#E8A39A' : '#A3392D' },
    '& tr.r-sub s': { textDecorationThickness: '1px' },
  };
};

function StepDot({ n, state }: { n: number; state: 'done' | 'current' | 'todo' }) {
  return (
    <Box
      component="span"
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        ...(state === 'done' && { background: 'linear-gradient(145deg,#3DBE78,#1A7F49)', color: '#fff', boxShadow: '0 2px 6px -1px rgba(26,127,73,.45), inset 0 1px 0 rgba(255,255,255,.35)' }),
        ...(state === 'current' && { bgcolor: '#B08A4E', color: '#FFFFFF' }),
        ...(state === 'todo' && { border: '1px solid rgba(255,255,255,.26)' }),
      }}
    >
      {state === 'done' ? <CheckIcon size={13} strokeWidth={2.4} /> : n}
    </Box>
  );
}

/** 06 · Import Wizard — spreadsheet structure detection and column-role mapping (step 2 of 3). */
export default function ImportWizard() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggle } = useColorMode();
  const [fileName, setFileName] = useState(SAMPLE_IMPORT_FILE);
  const [detecting, setDetecting] = useState(false);
  const [dialog, setDialog] = useState<'regions' | 'commit' | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [maps, setMaps] = useState<Record<string, string>>(() => Object.fromEntries(columnMappings.map((m) => [m.id, m.options[0]])));

  // Arriving from the upload modal with #detect runs step 1 first.
  useEffect(() => {
    if (location.hash !== '#detect') return;
    setFileName(readImportName());
    setDetecting(true);
    navigate({ pathname: location.pathname, search: location.search, hash: '' }, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate]);

  const finishDetect = useCallback(() => setDetecting(false), []);
  const themeLabel = `Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`;

  const commit = () => {
    setDialog(null);
    toast({ title: `${commitRowCount} records committed`, message: 'returning to the folder' });
    window.setTimeout(() => navigate(routes.library), 1200);
  };

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'og.pale', pb: 12 }}>
      {/* Banner */}
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', color: '#FFFFFF', backgroundImage: `radial-gradient(120% 160% at 85% 0%, ${brand.navy2} 0%, ${brand.navy} 60%)` }}>
        <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.26, pointerEvents: 'none' }} />
        <Box
          component="img"
          src={cubes}
          alt=""
          aria-hidden
          sx={{ position: 'absolute', top: 26, right: 40, height: 150, width: 'auto', pointerEvents: 'none', '@media (max-width:960px)': { opacity: 0.35, right: -40 }, '@media (max-width:640px)': { display: 'none' } }}
        />
        <Box sx={{ position: 'relative', p: { xs: '20px 16px 84px', md: '20px 28px 70px' }, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              component={RouterLink}
              to={routes.library}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: 30, p: '0 12px 0 9px', fontSize: 12, fontWeight: 600, color: '#E2C27E', border: '1px solid rgba(226,194,126,.35)', borderRadius: '4px', bgcolor: 'rgba(255,255,255,.04)', '&:hover': { color: '#FFFFFF', borderColor: '#E2C27E', bgcolor: 'rgba(226,194,126,.1)' } }}
            >
              <ChevronLeftIcon size={14} />
              Back to folder
            </Box>
            <Tooltip title={themeLabel}>
              <IconButton onClick={toggle} aria-label={themeLabel} sx={{ width: 30, height: 30, border: '1px solid rgba(255,255,255,.25)', bgcolor: 'rgba(255,255,255,.06)', color: '#FFFFFF', '&:hover': { borderColor: '#FFFFFF', color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.1)' } }}>
                <ThemeIcon size={16} strokeWidth={1.6} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="eyebrow">Spreadsheet Parsing Pipeline</Typography>
          <Typography variant="display" sx={{ color: '#FFFFFF', fontSize: { xs: 30, lg: 'clamp(30px, 2.33vw, 34px)' }, overflowWrap: 'anywhere', maxWidth: { md: 'min(980px, 64vw)' } }}>
            Importing: {fileName}
            {fileName !== SAMPLE_IMPORT_FILE && (
              <Box component="span" sx={{ display: 'inline-block', ml: 2.5, p: '3px 8px', borderRadius: '4px', bgcolor: 'rgba(201,164,92,.18)', font: '700 11px/1.3 Manrope, Arial, sans-serif', letterSpacing: '.04em', color: '#E2C27E', verticalAlign: 'middle' }}>
                Sample data shown
              </Box>
            )}
          </Typography>
          <Typography sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 1.5, fontSize: 13.5, color: 'rgba(255,255,255,.72)', mt: 0.5 }}>
            Importing payroll records into
            <Box component="b" sx={{ color: '#FFFFFF', fontWeight: 700, ml: 1 }}>
              {importDestination}
            </Box>
          </Typography>
          <Box component="ol" aria-label="Import steps" sx={{ listStyle: 'none', m: 0, p: '6px 0 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, fontSize: 14 }}>
            {importSteps.map((s, i) => {
              const state = i === 0 ? 'done' : i === 1 ? 'current' : 'todo';
              return [
                i > 0 && (
                  <Box component="li" key={`a${i}`} aria-hidden sx={{ color: 'rgba(255,255,255,.68)' }}>
                    →
                  </Box>
                ),
                <Box
                  component="li"
                  key={s}
                  aria-current={state === 'current' ? 'step' : undefined}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: state === 'todo' ? 400 : 700, color: state === 'done' ? '#7DD8A6' : state === 'current' ? '#FFFFFF' : 'rgba(255,255,255,.68)' }}
                >
                  <StepDot n={i + 1} state={state} />
                  {s}
                </Box>,
              ];
            })}
          </Box>
          <Box sx={{ pt: 3 }}>
            <Button variant="onDark" component={RouterLink} to={routes.library} sx={{ px: 4, '&:hover': { color: '#FFFFFF' } }}>
              Cancel Import
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 4, md: 7 } }}>
        {/* Detected structure */}
        <LiftCard component="section" aria-label="Detected structure" sx={{ mt: '-52px', p: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3.5 }}>
          <Box sx={{ display: 'flex', gap: 3.5, alignItems: 'flex-start', maxWidth: 920 }}>
            <Box component="span" sx={(t) => ({ flex: 'none', width: 36, height: 36, borderRadius: '50%', bgcolor: deep(t), display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, color: "og.head", lineHeight: 1.55 }}>
                {detectedStructure.title}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: 'og.gray' }}>{detectedStructure.summary}</Typography>
            </Box>
          </Box>
          <Button variant="outlined" onClick={() => setDialog('regions')} sx={{ ml: { xs: '50px', sm: 0 } }}>
            Adjust Detected Regions
          </Button>
        </LiftCard>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 7, pt: 9, pb: 8, alignItems: 'flex-start' }}>
          {/* Raw sheet */}
          <Box component="section" aria-label="Raw spreadsheet" sx={{ flex: '1.3 1 560px', minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2.5, pb: 2.5 }}>
              <Typography variant="label" component="h2">
                Raw Spreadsheet with Parsing Masks
              </Typography>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, p: '4px 9px', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', fontSize: 12.5, fontWeight: 600, color: 'og.gray', flex: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M4 10h16M10 4v16" />
                </svg>
                {sheetName}
              </Box>
            </Box>
            <Box component="ul" aria-label="Legend" sx={{ listStyle: 'none', m: 0, display: 'flex', flexWrap: 'wrap', gap: '6px 16px', p: '0 0 12px', fontSize: 12, color: 'og.gray' }}>
              {sheetLegend.map((l) => (
                <Box component="li" key={l.key} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                  <Box component="i" sx={(t) => ({ width: 10, height: 10, borderRadius: '2px', bgcolor: legendColor(t, l.key) })} />
                  {l.label}
                </Box>
              ))}
            </Box>
            <Box tabIndex={0} role="region" aria-label="Spreadsheet preview (scrolls horizontally)" sx={{ overflowX: 'auto', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue' } }}>
              <Box component="table" sx={sheetSx}>
                <colgroup>
                  <col style={{ width: 72 }} />
                  <col />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        Row
                      </Box>
                    </th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                  </tr>
                </thead>
                <tbody>
                  {sheetRows.map((r, i) => (
                    <Row key={i} r={r} />
                  ))}
                </tbody>
              </Box>
            </Box>
          </Box>

          {/* Column mappings */}
          <Box component="section" aria-label="Reconstructed logical columns" sx={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="label" component="h2">
                Reconstructed Logical Columns
              </Typography>
              <StatusTag tone="good" noDot sx={tagSx}>
                4 / 4 Auto-Mapped
              </StatusTag>
            </Box>
            {columnMappings.map((m) => (
              <Box key={m.id} sx={{ p: '16px 18px', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'og.card', border: 1, borderColor: 'og.line', borderRadius: '4px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2.5 }}>
                  <Box component="strong" sx={{ fontSize: 13.5, color: 'og.head' }}>
                    {m.source}
                  </Box>
                  <StatusTag tone="good" sx={[tagSx, { alignSelf: 'flex-start' }]}>
                    {m.match}
                  </StatusTag>
                </Box>
                <Box component="label" id={`${m.id}-label`} sx={{ fontSize: 13, color: 'og.gray' }}>
                  Maps to Target Field:
                </Box>
                <Select labelId={`${m.id}-label`} value={maps[m.id]} onChange={(e) => setMaps((s) => ({ ...s, [m.id]: e.target.value }))} input={<OutlinedInput />} fullWidth sx={selectSx}>
                  {m.options.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </Select>
                {m.note && <Box sx={{ fontSize: 12.5, color: 'og.gray' }}>{m.note}</Box>}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 3, pt: 5, pb: 2, borderTop: 1, borderColor: 'og.line' }}>
          <Button variant="outlined" onClick={() => setDetecting(true)} sx={{ px: 4.5 }}>
            Back to Step 1
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowRightIcon size={13} />}
            onClick={() => {
              setReviewed(false);
              setDialog('commit');
            }}
            sx={{ px: 4.5, whiteSpace: { xs: 'normal', sm: 'nowrap' }, height: 'auto', minHeight: 36, py: { xs: 2, sm: 0 } }}
          >
            Next: Final Review &amp; Commit ({commitRowCount} Rows)
          </Button>
        </Box>
      </Box>

      <ActionDialog
        open={dialog === 'regions'}
        onClose={() => setDialog(null)}
        eyebrow="Detected Regions"
        title="Adjust row ranges"
        okLabel="Re-parse"
        onOk={() => {
          setDialog(null);
          toast({ title: 'Regions updated', message: 'spreadsheet re-parsed' });
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <DialogField label="Metadata rows" htmlFor="rg-meta">
            <OutlinedInput id="rg-meta" defaultValue={detectedRegions.metadata} fullWidth />
          </DialogField>
          <DialogField label="Header rows" htmlFor="rg-head">
            <OutlinedInput id="rg-head" defaultValue={detectedRegions.header} fullWidth />
          </DialogField>
        </Box>
        <DialogField label="Data rows" htmlFor="rg-data">
          <OutlinedInput id="rg-data" defaultValue={detectedRegions.data} fullWidth />
        </DialogField>
        {['Skip subtotal rows', 'Fill blank names from the row above'].map((l) => (
          <FormControlLabel key={l} control={<Checkbox defaultChecked sx={{ mr: 2 }} />} label={l} sx={{ display: 'flex', m: '0 0 12px', '& .MuiFormControlLabel-label': { fontSize: 13, fontWeight: 600, color: 'og.ink' } }} />
        ))}
      </ActionDialog>

      <ActionDialog open={dialog === 'commit'} onClose={() => setDialog(null)} eyebrow="Step 3 · Review & Commit" title={`Commit ${commitRowCount} labor records?`} okLabel="Commit Records" onOk={commit} okDisabled={!reviewed}>
        <p>
          {commitRowCount} rows from <b>{SAMPLE_IMPORT_FILE}</b> will be added to <b>{importDestination}</b> as the DeRS claimed baseline.
        </p>
        <FormControlLabel
          control={<Checkbox checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} required sx={{ mr: 2 }} />}
          label="I reviewed the column mapping"
          sx={{ display: 'flex', m: '0 0 12px', '& .MuiFormControlLabel-label': { fontSize: 13, fontWeight: 600, color: 'og.ink' } }}
        />
      </ActionDialog>

      {detecting && <DetectOverlay fileName={fileName} onDone={finishDetect} />}
    </Box>
  );
}
