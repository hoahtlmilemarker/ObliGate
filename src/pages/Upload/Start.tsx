import { Box, Button, ButtonBase, Link, Typography } from '@mui/material';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppShell, routes } from '@/layout';
import { LiftCard, OgDialog, useToast } from '@/components';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, InfoIcon, WarningIcon } from '@/icons';
import { MAX_UPLOAD_BYTES, UPLOAD_EXT, ext, fileSize, fileType, plural } from '@/data/classify';
import { getHistory, startBatch, takeRestore, type HistFile } from '@/data/uploadSession';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import { AnTag, CardHead, FileRow, StepList, TwoCol } from './ui';
import illustration from './up.svg';

interface Item {
  name: string;
  size: number;
  kind?: string;
  /** Same name + size was uploaded before (from history). */
  prev?: HistFile;
  /** User chose Replace for a duplicate. */
  again?: boolean;
}
interface Notice {
  tone: 'warn' | 'info';
  added?: string[];
  bad?: string[];
  dupes?: number;
  restored?: number;
}

const PREVIEW = 6;
const SAMPLE: [string, string, number][] = [
  ['Timesheet_Aguayo_PP02.pdf', 'Force-Account Timesheet', 412e3],
  ['ActivityLog_PW00428_Jan18.pdf', 'Daily Activity Log', 268e3],
  ['eCAPS_Labor_Export_PP01-04.xlsx', 'DeRS payroll export', 1.9e6],
  ['SupervisorLog_Jan14-16_Unsigned.pdf', 'Supervisor Field Log', 534e3],
  ['EquipLog_CAT320_EQ-PW-109_Jan.pdf', 'Equipment log', 301e3],
  ['FieldPhoto_MalibuCyn_Jan09.jpg', 'Site photo', 3.4e6],
];
function sampleFiles(): Item[] {
  const W = ['Aguayo', 'Delgado', 'Nguyen', 'Ramirez', 'Chen', 'Okafor', 'Patel', 'Lopez', 'Brooks', 'Kim'];
  const K: [string, string, number][] = [
    ['Timesheet_{w}_PP0{p}.pdf', 'Force-Account Timesheet', 3.9e5],
    ['ActivityLog_PW00428_Jan{d}.pdf', 'Daily Activity Log', 2.6e5],
    ['FieldPhoto_MalibuCyn_Jan{d}.jpg', 'Site photo', 3.1e6],
    ['EquipLog_EQ-PW-1{d}_Jan.pdf', 'Equipment log', 2.9e5],
  ];
  const out: Item[] = SAMPLE.map(([name, kind, size]) => ({
    name,
    kind,
    size,
  }));
  for (let q = 0; q < 38; q++) {
    const k = K[q % 4];
    const d = String(10 + (q % 19));
    let nm = k[0]
      .replace('{w}', W[q % 10])
      .replace('{p}', String(1 + (q % 4)))
      .replace(/\{d\}/g, d);
    if (out.some((x) => x.name === nm)) nm = nm.replace(/(\.\w+)$/, `_${q + 2}$1`);
    out.push({ name: nm, kind: k[1], size: k[2] + q * 7300 });
  }
  return out;
}

/** 12 · Upload — add records, resolve duplicates, start the analysis. */
export default function UploadStart() {
  const nav = useNavigate();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [replace, setReplace] = useState<Item[] | null>(null);
  const [pendingStart, setPendingStart] = useState(false);

  useEffect(() => {
    document.title = 'Upload Records';
    const r = takeRestore();
    if (r?.length) {
      setFiles(r.map((x) => ({ name: x.n, size: x.s })));
      setNotice({ tone: 'info', restored: r.length });
    }
  }, []);

  const dupes = files.filter((f) => f.prev);
  const pending = dupes.filter((f) => !f.again);
  const count = files.length - pending.length;
  const shown = open ? files : files.slice(0, PREVIEW);

  function add(list: FileList | File[]) {
    const hist = getHistory();
    const bad: string[] = [];
    const already: string[] = [];
    const next = [...files];
    for (const f of Array.from(list)) {
      const e = ext(f.name);
      if (!UPLOAD_EXT.test(e)) bad.push(`${f.name} (.${e} not supported)`);
      else if (f.size > MAX_UPLOAD_BYTES) bad.push(`${f.name} (over 200 MB)`);
      else if (next.some((x) => x.name === f.name && x.size === f.size)) already.push(f.name);
      else
        next.push({
          name: f.name,
          size: f.size,
          prev: hist.find((h) => h.n === f.name && h.s === f.size),
        });
    }
    const prevN = next.filter((f) => f.prev && !f.again).length;
    setFiles(next);
    setFlash(new Set(already));
    window.setTimeout(() => setFlash(new Set()), 1500);
    // Keep the first problem row visible.
    const first = next.findIndex((x) => (x.prev && !x.again) || already.includes(x.name));
    if (first >= PREVIEW) setOpen(true);
    setNotice(
      bad.length || already.length || prevN
        ? {
            tone: bad.length || prevN ? 'warn' : 'info',
            added: already,
            bad,
            dupes: prevN,
          }
        : null,
    );
  }

  function doReplace(list: Item[]) {
    setFiles((fs) => fs.map((f) => (list.includes(f) ? { ...f, again: true } : f)));
    setFlash(new Set(list.map((f) => f.name)));
    window.setTimeout(() => setFlash(new Set()), 1500);
    if (list.length > 1 && files.length > PREVIEW) setOpen(true);
    toast({
      title: list.length === 1 ? `${list[0].name} set as a new version` : `${list.length} files set as new versions`,
      message: 'the earlier copies stay in version history',
    });
    setReplace(null);
  }

  function skipAll() {
    const n = pending.length;
    setFiles((fs) => fs.filter((f) => !(f.prev && !f.again)));
    setNotice(null);
    toast({
      title: `${plural(n, 'duplicate')} removed from this upload`,
      message: 'the earlier copies are kept',
    });
  }

  function start(skipDupes = false) {
    if (pending.length && !skipDupes) return setPendingStart(true);
    const use = files.filter((f) => !(f.prev && !f.again));
    startBatch(use.map((f) => ({ n: f.name, s: f.size })));
    nav(routes.analyzing);
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files.length) add(e.dataTransfer.files);
  };

  return (
    <AppShell searchLabel="Search documents...">
      <Masthead
        illustration={illustration}
        eyebrow={
          <>
            <Link
              component={RouterLink}
              to={routes.disasters}
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
                fontSize: 13,
                fontWeight: 700,
                color: 'rgba(255,255,255,.82)',
                '&:hover': { color: '#fff' },
              }}
            >
              <ArrowLeftIcon size={14} />
              Back
            </Link>
            <MastheadEyebrow>Getting started · LA County Public Works</MastheadEyebrow>
          </>
        }
        title="Upload your disaster recovery records"
        subtitle="Drop in timesheets, field logs, payroll exports, contracts and photos. ObliGate files each one under the right disaster and project and checks it against FEMA Public Assistance rules before you submit."
      />
      <TwoCol>
        <LiftCard component="section" aria-label="Add files" sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardHead title="Add files">
            <Button component={RouterLink} to={routes.importWizard} variant="outlined" size="small">
              Import payroll from eCAPS (Excel)
            </Button>
          </CardHead>
          <Box sx={{ p: 5, flex: 1 }}>
            <ButtonBase
              component="label"
              onDragEnter={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={onDrop}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  input.current?.click();
                }
              }}
              aria-label="Add files: drag and drop, or press Enter to browse"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                py: files.length ? 6 : 12,
                px: 4,
                border: '1.5px dashed',
                borderColor: over ? 'og.blue' : 'og.line',
                borderRadius: '4px',
                bgcolor: over ? 'og.blueTint' : 'og.pale',
                textAlign: 'center',
                transition: 'all .15s',
                '&:hover': { borderColor: 'og.blue' },
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'og.blue',
                  outlineOffset: 2,
                },
              }}
            >
              <Box sx={{ color: 'og.blue', display: 'flex' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
                  <path d="M14 3v5h5M14 3l5 5v3" />
                  <circle cx="17.5" cy="17.5" r="4" />
                  <path d="M17.5 19.5v-4M15.8 17.2l1.7-1.7 1.7 1.7" />
                </svg>
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'og.head' }}>Drag &amp; drop files here</Typography>
              <Typography sx={{ fontSize: 13.5, color: 'og.gray' }}>
                or{' '}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: 'og.blue',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  browse your computer
                </Box>
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: 'og.gray' }}>PDF, JPG / PNG photos, Excel or CSV payroll exports · up to 200 MB per file</Typography>
              <input
                ref={input}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.heic,.xlsx,.xls,.csv"
                style={{ position: 'absolute', left: -9999 }}
                onChange={(e) => {
                  if (e.target.files) add(e.target.files);
                  e.target.value = '';
                }}
              />
            </ButtonBase>

            {notice && <NoticeBar n={notice} pending={pending.length} replaced={dupes.length - pending.length} onSkipAll={skipAll} onReplaceAll={() => setReplace(pending)} onClose={() => setNotice(null)} />}

            {files.length ? (
              <>
                <Box component="ul" id="upList" sx={{ m: '12px 0 0', p: 0 }}>
                  {shown.map((f) => {
                    const t = fileType(f.name);
                    return (
                      <FileRow
                        key={f.name + f.size}
                        name={f.name}
                        highlight={flash.has(f.name)}
                        sub={
                          <>
                            {f.kind || t.kind} · {fileSize(f.size)}
                            {f.prev && (
                              <Box
                                component="span"
                                sx={{
                                  fontWeight: 700,
                                  color: f.again ? 'og.good' : 'og.warn',
                                }}
                              >
                                {' · '}
                                {f.again ? `Replaces the copy from ${f.prev.t || 'earlier'}` : `Uploaded earlier${f.prev.t ? ` at ${f.prev.t}` : ''}`}
                              </Box>
                            )}
                          </>
                        }
                      >
                        {f.prev && !f.again ? (
                          <>
                            <Button size="small" variant="outlined" onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}>
                              Skip
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => setReplace([f])}>
                              Replace
                            </Button>
                          </>
                        ) : (
                          <>
                            {f.again && (
                              <Button size="small" onClick={() => setFiles((fs) => fs.map((x) => (x === f ? { ...x, again: false } : x)))} sx={{ minWidth: 0, fontWeight: 700 }}>
                                Undo
                              </Button>
                            )}
                            <AnTag tone={f.again ? 'ok' : 'idle'}>{f.again ? 'New version' : 'Ready'}</AnTag>
                            <Button
                              aria-label={`Remove ${f.name}`}
                              onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}
                              sx={{
                                minWidth: 0,
                                width: 28,
                                height: 28,
                                p: 0,
                                color: 'og.gray',
                                '&:hover': {
                                  bgcolor: 'og.riskTint',
                                  color: 'og.risk',
                                },
                              }}
                            >
                              <CloseIcon size={14} />
                            </Button>
                          </>
                        )}
                      </FileRow>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 3,
                    pt: 3,
                    fontSize: 13,
                    color: 'og.gray',
                  }}
                >
                  {files.length > PREVIEW && (
                    <>
                      <span>{open ? `Showing all ${files.length} files` : `Showing ${PREVIEW} of ${files.length} files`}</span>
                      <Button size="small" aria-expanded={open} aria-controls="upList" onClick={() => setOpen((o) => !o)} sx={{ minWidth: 0, px: 1, fontWeight: 700 }}>
                        {open ? 'Show fewer' : `Show ${files.length - PREVIEW} more`}
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    onClick={() => {
                      setFiles([]);
                      setNotice(null);
                      setOpen(false);
                    }}
                    sx={{ minWidth: 0, px: 1, fontWeight: 700 }}
                  >
                    Clear all
                  </Button>
                </Box>
              </>
            ) : (
              <Typography
                sx={{
                  mt: 3.5,
                  fontSize: 13,
                  color: 'og.gray',
                  textAlign: 'center',
                }}
              >
                No files added yet.{' '}
                <ButtonBase
                  onClick={() => {
                    setFiles(sampleFiles());
                    setNotice(null);
                  }}
                  sx={{
                    font: 'inherit',
                    fontWeight: 700,
                    color: 'og.blue',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Try it with sample files
                </ButtonBase>{' '}
                <Box
                  component="span"
                  title="Prototype only. Not part of the product."
                  sx={{
                    ml: 1,
                    px: '6px',
                    py: '2px',
                    borderRadius: '4px',
                    bgcolor: 'og.pale',
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sample data
                </Box>
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              px: 5,
              py: 4,
              borderTop: 1,
              borderColor: 'og.lineSoft',
              bgcolor: 'og.pale',
            }}
          >
            <Typography
              aria-live="polite"
              sx={{
                fontSize: 13.5,
                color: 'og.gray',
                '& b': { color: 'og.head' },
              }}
            >
              {count ? (
                <>
                  <b>{plural(count, 'file')}</b> ready to analyze
                  {pending.length > 0 && ` · ${plural(pending.length, 'duplicate')} waiting for Skip or Replace`}
                </>
              ) : files.length ? (
                'All files were uploaded before. Choose Skip or Replace for each one.'
              ) : (
                'Add at least one file to start'
              )}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                '& .Mui-disabled': { opacity: 0.45 },
              }}
            >
              <Button component={RouterLink} to={routes.disasters} variant="outlined">
                Cancel
              </Button>
              <Button variant="contained" disabled={!count} onClick={() => start()} endIcon={<ArrowRightIcon size={14} />}>
                Start Analysis
              </Button>
            </Box>
          </Box>
        </LiftCard>

        <LiftCard component="section" aria-label="What happens next" sx={{ '@media (min-width:1101px)': { position: 'sticky', top: 84 } }}>
          <CardHead title="What happens next" />
          <StepList
            steps={[
              {
                title: 'Read & classify every file',
                text: 'AI identifies the document type and reads dates, names, hours, equipment and amounts.',
              },
              {
                title: 'Match to disaster & project',
                text: 'Finds the DR number and project worksheet (PW) and files each document automatically. Only files AI is less than 60% sure about wait in the Unplaced Inbox for you.',
              },
              {
                title: 'Check against FEMA rules',
                text: 'Compares each record with PAPPG v4.0 and 2 CFR § 200: signatures, eligible dates, procurement records, payroll match.',
              },
              {
                title: 'Flag costs at risk',
                text: 'Lists the costs FEMA could question or disallow, with the fix for each one.',
              },
            ]}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2.5,
              px: 5,
              py: 4,
              borderTop: 1,
              borderColor: 'og.lineSoft',
              bgcolor: 'og.pale',
              fontSize: 13,
              lineHeight: 1.5,
              color: 'og.gray',
            }}
          >
            <Box sx={{ color: 'og.blue', display: 'flex', mt: '1px' }}>
              <InfoIcon size={16} />
            </Box>
            You don’t need to pick a disaster or project first. ObliGate detects them from the documents.
          </Box>
        </LiftCard>
      </TwoCol>

      <OgDialog
        open={!!replace}
        onClose={() => setReplace(null)}
        eyebrow={`Replace earlier ${replace?.length === 1 ? 'copy' : 'copies'}`}
        title={replace?.length === 1 ? 'Replace this file with your new copy?' : `Replace ${replace?.length} files with your new copies?`}
        confirmLabel={replace?.length === 1 ? 'Replace File' : `Replace ${replace?.length} Files`}
        onConfirm={() => replace && doReplace(replace)}
        maxWidth={520}
      >
        {replace?.length === 1 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 3,
              mb: 3,
              '& > div': {
                p: 3,
                border: 1,
                borderColor: 'og.line',
                borderRadius: '4px',
                minWidth: 0,
              },
              '& small': {
                display: 'block',
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'og.gray',
              },
              '& b': {
                display: 'block',
                mt: 1,
                fontSize: 13,
                color: 'og.head',
                overflowWrap: 'anywhere',
              },
              '& span': {
                display: 'block',
                mt: '2px',
                fontSize: 12,
                color: 'og.gray',
              },
            }}
          >
            <div>
              <small>Earlier copy</small>
              <b>{replace[0].name}</b>
              <span>
                Uploaded {replace[0].prev?.t ? `today at ${replace[0].prev.t}` : 'earlier'} · {fileSize(replace[0].prev?.s ?? replace[0].size)}
              </span>
            </div>
            <ArrowRightIcon size={18} />
            <Box sx={{ borderColor: 'og.blue !important', bgcolor: 'og.blueTint' }}>
              <small>New copy</small>
              <b>{replace[0].name}</b>
              <span>Selected just now · {fileSize(replace[0].size)}</span>
            </Box>
          </Box>
        ) : (
          <Box component="ul" sx={{ m: '0 0 12px', pl: 4.5, fontSize: 13, color: 'og.head' }}>
            {replace?.slice(0, 5).map((f) => (
              <li key={f.name}>{f.name}</li>
            ))}
            {replace && replace.length > 5 && (
              <Box component="li" sx={{ color: 'og.gray' }}>
                and {replace.length - 5} more
              </Box>
            )}
          </Box>
        )}
        The file you just selected becomes the current version. AI reads it again and re-checks it against FEMA rules. The earlier copy is kept in version history, so nothing is lost.
      </OgDialog>

      <OgDialog
        open={pendingStart}
        onClose={() => setPendingStart(false)}
        eyebrow="Duplicates"
        title={`${plural(pending.length, 'duplicate')} still need${pending.length === 1 ? 's' : ''} a choice`}
        confirmLabel={`Skip ${pending.length === 1 ? 'It' : 'Them'} and Start`}
        cancelLabel="Go Back"
        onConfirm={() => {
          setPendingStart(false);
          start(true);
        }}
      >
        {pending.slice(0, 3).map((f, i) => (
          <span key={f.name}>
            {i ? ', ' : ''}
            <b>{f.name}</b>
          </span>
        ))}
        {pending.length > 3 && ` and ${pending.length - 3} more`} {pending.length === 1 ? 'was' : 'were'} uploaded before. If you start now, {pending.length === 1 ? 'it is' : 'they are'} skipped and the earlier{' '}
        {pending.length === 1 ? 'copy stays' : 'copies stay'} as {pending.length === 1 ? 'it is' : 'they are'}. Go back to choose Replace for any file that has changed.
      </OgDialog>
    </AppShell>
  );
}

function NoticeBar({ n, pending, replaced, onSkipAll, onReplaceAll, onClose }: { n: Notice; pending: number; replaced: number; onSkipAll: () => void; onReplaceAll: () => void; onClose: () => void }) {
  const warn = n.tone === 'warn';
  const hasDupes = !!n.dupes && pending + replaced > 0;
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2.5,
        mt: 3.5,
        p: '12px 12px 12px 14px',
        border: 1,
        borderColor: warn && pending ? 'og.warn' : 'og.line',
        borderLeftWidth: 3,
        borderRadius: '4px',
        bgcolor: warn && pending ? 'og.warnTint' : 'og.blueTint',
        fontSize: 13,
        lineHeight: 1.55,
        color: 'og.ink',
        '& b': { color: 'og.head' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: '2px',
          color: warn && pending ? 'og.warn' : 'og.blue',
        }}
      >
        {warn && pending ? <WarningIcon size={16} /> : <InfoIcon size={16} />}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!!n.restored && (
          <span>
            <b>Analysis cancelled.</b> Your {n.restored === 1 ? 'file is' : `${n.restored} files are`} still here. Add or remove files, then start again.
          </span>
        )}
        {!!n.added?.length && (
          <span>
            <b>{n.added.length} already added.</b> {n.added.join(', ')} {n.added.length > 1 ? 'are' : 'is'} already in the list, so {n.added.length > 1 ? 'they were' : 'it was'} not added again.
          </span>
        )}
        {hasDupes &&
          (pending ? (
            <span>
              <b>{plural(pending, 'duplicate')}.</b> {pending === 1 ? 'This file was' : 'These files were'} uploaded before. Skip keeps the earlier copy, so nothing is filed twice. Replace overwrites it with this new
              copy. Use Replace only if a file has changed.
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button size="small" variant="outlined" onClick={onSkipAll}>
                  Skip all
                </Button>
                <Button size="small" variant="outlined" onClick={onReplaceAll}>
                  Replace all
                </Button>
                <Box component="span" aria-live="polite" sx={{ fontSize: 12, color: 'og.gray' }}>
                  {replaced ? `${replaced} set as new versions. ${pending} still waiting for your choice.` : 'Choose Skip or Replace for each file, or for all of them at once.'}
                </Box>
              </Box>
            </span>
          ) : (
            <span>
              <b>Duplicates resolved.</b> {replaced} {replaced === 1 ? 'file is set as a new version' : 'files are set as new versions'}. Undo on any file to keep its earlier copy instead.
            </span>
          ))}
        {!!n.bad?.length && (
          <span>
            <b>{plural(n.bad.length, 'file')} skipped.</b> {n.bad.join(', ')}. Use PDF, JPG / PNG, Excel or CSV.
          </span>
        )}
      </Box>
      <Button aria-label="Dismiss" onClick={onClose} sx={{ minWidth: 0, width: 26, height: 26, p: 0, color: 'og.gray' }}>
        <CloseIcon size={13} />
      </Button>
    </Box>
  );
}
