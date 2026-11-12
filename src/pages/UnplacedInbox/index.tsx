import { Box, Button, MenuItem, Select, Typography, useMediaQuery, type Theme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Panel, StatusTag, useToast } from '@/components';
import { AppShell, routes } from '@/layout';
import { CheckIcon, ChevronDownIcon, TrashIcon } from '@/icons';
import { fileSize, fileType, plural } from '@/data/classify';
import { getResults, isDemoBatch, setFix } from '@/data/uploadSession';
import { inboxFolderOptions, unplacedDocs, type UnplacedDoc } from '@/data/unplacedInbox';
import { FolderBanner } from '../DocumentLibrary/FolderBanner';
import { LibrarySidebar } from '../DocumentLibrary/LibrarySidebar';
import { UploadModal, type CommittedFile, type UploadFileLike } from '@/components/UploadModal';

/** "PW-00428 › 1. Force-Account Labor" with the chevron set slightly bolder, as in the prototype. */
function FolderPath({ path }: { path: string }) {
  const [a, b] = path.split(' › ');
  return (
    <>
      {a}
      <Box component="span" sx={{ mx: '6px' }}>
        ›
      </Box>
      {b}
    </>
  );
}

function MoveSelect({ doc, onPick }: { doc: UnplacedDoc; onPick: (folder: string) => void }) {
  const placeholder = doc.suggestion ? 'Move to…' : 'Choose folder…';
  return (
    <Select
      value=""
      displayEmpty
      IconComponent={(props: { className?: string }) => (
        <Box component="span" className={props.className} sx={{ display: 'flex', top: 'calc(50% - 7px) !important' }}>
          <ChevronDownIcon size={14} />
        </Box>
      )}
      onChange={(e) => e.target.value && onPick(String(e.target.value))}
      inputProps={{ 'aria-label': `Move ${doc.name} to folder` }}
      renderValue={() => placeholder}
      MenuProps={{ slotProps: { paper: { sx: { maxWidth: 'calc(100vw - 32px)' } } } }}
      sx={{ width: 150, height: 30, fontSize: 12, fontWeight: 600, color: 'og.blue', '& .MuiSelect-select': { py: 0, pl: '10px', pr: '28px !important', lineHeight: '30px', height: '30px !important', minHeight: 0 }, '& .MuiSelect-icon': { color: 'og.gray', right: 6 } }}
    >
      <MenuItem value="" disabled sx={{ display: 'none' }}>
        {placeholder}
      </MenuItem>
      {inboxFolderOptions.map((o) => (
        <MenuItem key={o} value={o} sx={{ fontSize: 12.5 }}>
          {o}
        </MenuItem>
      ))}
    </Select>
  );
}

/** Files from the user's own upload (this session) that AI could not file: shown on top, marked New. */
function myUnplaced(): UnplacedDoc[] {
  if (isDemoBatch()) return [];
  return getResults()
    .files.filter((x) => !x.placed)
    .map((x) => {
      const sug = x.folder && x.conf >= 40 ? x.folder : null;
      return { id: `up-${x.name}`, ext: fileType(x.name).label, name: x.name, meta: `Uploaded just now by you · ${fileSize(x.size)}`, suggestion: sug, match: sug ? `${x.conf}% match` : `${x.conf}%`, tone: sug ? 'warn' : 'risk', reason: `${x.why}.`, mine: true };
    });
}

/** 03c · Unplaced Inbox — documents the AI placement engine could not file; accept the suggestion or move manually. */
export default function UnplacedInbox() {
  const toast = useToast();
  const stacked = useMediaQuery((t: Theme) => t.breakpoints.down('md'));
  const [mine] = useState(myUnplaced);
  const [docs, setDocs] = useState(() => [...mine, ...unplacedDocs]);
  const [focus, setFocus] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<Set<string>>(new Set());
  const timers = useRef<number[]>([]);
  const [upload, setUpload] = useState<{ open: boolean; files: UploadFileLike[] | null }>({ open: false, files: null });

  useEffect(() => {
    document.title = 'Unplaced Inbox';
    const has = (e: DragEvent) => !!e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
    const over = (e: DragEvent) => has(e) && e.preventDefault();
    const drop = (e: DragEvent) => {
      if (!has(e) || !e.dataTransfer?.files.length) return;
      if ((e.target as Element | null)?.closest?.('[role="dialog"]')) return;
      e.preventDefault();
      setUpload({ open: true, files: Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size })) });
    };
    document.addEventListener('dragover', over);
    document.addEventListener('drop', drop);
    const t = timers.current;
    return () => {
      document.removeEventListener('dragover', over);
      document.removeEventListener('drop', drop);
      t.forEach((x) => window.clearTimeout(x));
    };
  }, []);

  // #f=<file name> (from the Analysis Report): scroll to that row and highlight it.
  useEffect(() => {
    const m = location.hash.match(/^#f=(.+)$/);
    if (!m) return;
    const id = `up-${decodeURIComponent(m[1])}`;
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-doc="${CSS.escape(id)}"]`);
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      setFocus(id);
      el.querySelector<HTMLElement>('button, [role="combobox"]')?.focus({ preventScroll: true });
    }, 350);
    return () => window.clearTimeout(t);
  }, []);

  const leavingRef = useRef(leaving);
  leavingRef.current = leaving;
  const remaining = docs.filter((d) => !leaving.has(d.id));
  const mineLeft = remaining.filter((d) => d.mine).length;
  const n = remaining.length;
  const suggested = remaining.filter((d) => d.suggestion).length;

  /** Fade the row out (300ms), then remove it. */
  const file = (targets: UnplacedDoc[]) => {
    setLeaving((s) => new Set([...s, ...targets.map((d) => d.id)]));
    timers.current.push(
      window.setTimeout(() => {
        // Skip rows brought back by Undo within the fade.
        const ids = new Set(targets.map((d) => d.id).filter((id) => leavingRef.current.has(id)));
        setDocs((list) => list.filter((d) => !ids.has(d.id)));
      }, 300),
    );
  };

  const fileOne = (d: UnplacedDoc, folder: string) => {
    if (leaving.has(d.id)) return;
    if (d.mine) setFix(d.name, folder);
    file([d]);
    toast({ title: d.name, message: `filed to ${folder}`, inline: true, duration: 4500 });
  };

  const acceptAll = () => {
    const r = remaining.filter((d) => d.suggestion);
    if (!r.length) return;
    r.forEach((d) => d.mine && setFix(d.name, d.suggestion!));
    file(r);
    toast({ title: `${r.length} documents`, message: 'filed to their suggested folders', inline: true, duration: 4500 });
  };

  /** Remove a document that is not a disaster record (Undo puts it back where it was). */
  const removeOne = (d: UnplacedDoc) => {
    if (leaving.has(d.id)) return;
    const at = docs.indexOf(d);
    if (d.mine) setFix(d.name, '__removed');
    file([d]);
    toast({
      title: d.name,
      message: 'removed from the inbox',
      inline: true,
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          if (d.mine) setFix(d.name, '');
          setLeaving((s) => new Set([...s].filter((x) => x !== d.id)));
          setDocs((list) => (list.some((x) => x.id === d.id) ? list : [...list.slice(0, at), d, ...list.slice(at)]));
        },
      },
    });
  };

  const commit = (files: CommittedFile[]) => {
    if (!files.length) return;
    toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: 'to Unplaced Inbox · auto-classifying', inline: true, duration: 6000 });
  };

  const th = { p: '10px 12px', textAlign: 'left' as const, font: '700 11px/1 Manrope, Arial, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'og.gray', bgcolor: 'og.pale', borderBottom: 1, borderColor: 'og.line' };
  const td = { p: '14px 12px', borderBottom: 1, borderColor: 'og.lineSoft', verticalAlign: 'top' };

  const docCell = (d: UnplacedDoc) => (
    <Box sx={{ display: 'flex', gap: 3, minWidth: 0 }}>
      <Box component="span" aria-hidden sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 36, height: 44, borderRadius: '4px', bgcolor: d.mine ? 'og.card' : 'og.pale', border: d.mine ? 1 : 0, borderColor: 'og.line', font: '800 9.5px/1 Manrope, Arial, sans-serif', letterSpacing: '.06em', color: 'og.blue' }}>
        {d.ext}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box component={RouterLink} to={routes.review} title={d.name} sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 700, color: 'og.head', textDecoration: 'none', '&:hover': { color: 'og.blue', textDecoration: 'underline' } }}>
          {d.name}
        </Box>
        <Box component="small" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: '3px', fontSize: 12, color: 'og.gray' }}>
          {d.mine && <NewPill />}
          {d.meta}
        </Box>
      </Box>
    </Box>
  );

  const suggestionCell = (d: UnplacedDoc) => (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px' }}>
        <Box component="span" sx={{ fontSize: 13.5, fontWeight: 700, color: d.suggestion ? 'og.head' : 'og.gray' }}>
          {d.suggestion ? <FolderPath path={d.suggestion} /> : 'No confident suggestion'}
        </Box>
        <StatusTag tone={d.tone} noDot sx={{ fontSize: 11, fontWeight: 600, py: '2px' }}>
          {d.match}
        </StatusTag>
      </Box>
      <Box component="p" sx={{ m: '5px 0 0', fontSize: 12.5, lineHeight: 1.5, color: 'og.gray' }}>
        {d.reason}
      </Box>
    </>
  );

  const actionCell = (d: UnplacedDoc) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      {d.suggestion && (
        <Button size="small" variant="contained" onClick={() => fileOne(d, d.suggestion!)} aria-label={`Accept suggestion for ${d.name}`}>
          Accept
        </Button>
      )}
      <MoveSelect doc={d} onPick={(f) => fileOne(d, f)} />
      <Button aria-label={`Remove ${d.name}`} title="Remove: not a disaster record" onClick={() => removeOne(d)} sx={{ minWidth: 0, width: 30, height: 30, p: 0, color: 'og.gray', '&:hover': { bgcolor: 'og.riskTint', color: 'og.risk' } }}>
        <TrashIcon size={15} />
      </Button>
    </Box>
  );

  const rowSx = (d: UnplacedDoc) => ({ transition: 'opacity .3s, background-color .3s', opacity: leaving.has(d.id) ? 0 : 1, ...(d.mine && { bgcolor: 'rgba(176,138,78,.06)', boxShadow: 'inset 3px 0 0 #B08A4E' }), ...(focus === d.id && { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: '-2px' }) });

  return (
    <AppShell active="library" sidebarLabel="Queues & filing cabinet" sidebar={<LibrarySidebar activeQueue="inbox" inboxCount={n} />}>
      <FolderBanner
        prefix="Queue: To File"
        separator="·"
        separateFromPrefix
        crumbs={[{ label: 'DR-4683-CA', to: routes.disasters }]}
        title={`Unplaced Inbox (${n} Documents)`}
        subtitle="Documents the AI placement engine could not file with enough confidence. Accept the suggested folder or choose another."
        overlap={false}
        back={mine.length ? { label: 'Back to Analysis Report', to: routes.analysisReport } : undefined}
        actions={
          <>
            <Button variant="inverse" disabled={!suggested} onClick={acceptAll}>
              Accept All Suggestions · {suggested}
            </Button>
            <Button variant="onDark" onClick={() => setUpload({ open: true, files: null })}>
              Upload Documents
            </Button>
          </>
        }
      />
      <Box sx={{ px: { xs: 4, md: 7 }, pt: 6, pb: 14 }}>
        <Panel component="section" aria-label="Unplaced documents" sx={{ overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px 16px', p: { xs: '16px', md: '16px 24px' }, borderBottom: 1, borderColor: 'og.lineSoft' }}>
            <Typography component="h2" sx={{ m: 0, fontSize: 19, fontWeight: 300, color: 'og.head', letterSpacing: '-.02em' }}>
              Needs a folder
            </Typography>
            <Typography component="span" sx={{ fontSize: 12.5, color: 'og.gray' }}>
              AI suggestions are based on document content, dates and project references.
            </Typography>
          </Box>

          {mineLeft > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', p: { xs: '12px 16px', md: '12px 24px' }, borderBottom: 1, borderColor: 'og.lineSoft', bgcolor: 'og.pale', fontSize: 13, color: 'og.ink', '& b': { color: 'og.head' } }}>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, height: 24, px: '8px', border: 1, borderColor: 'og.good', borderRadius: '4px', bgcolor: 'og.goodTint', color: 'og.good', fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                <CheckIcon size={12} />
                From your upload
              </Box>
              <span>
                <b>{plural(mineLeft, 'file')}</b> from your upload need
                {mineLeft === 1 ? 's' : ''} a folder. {mineLeft === 1 ? 'It is' : 'They are'} at the top, marked <NewPill />.
              </span>
            </Box>
          )}

          {n > 0 &&
            (stacked ? (
              <Box role="list" aria-label="Unplaced documents">
                {docs.map((d) => (
                  <Box role="listitem" key={d.id} data-doc={d.id} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '14px 16px', borderBottom: 1, borderColor: 'og.lineSoft', ...rowSx(d) }}>
                    {docCell(d)}
                    <Box>{suggestionCell(d)}</Box>
                    {actionCell(d)}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '34%' }} />
                  <col />
                  <col style={{ width: 290 }} />
                </colgroup>
                <thead>
                  <tr>
                    <Box component="th" sx={{ ...th, pl: '24px' }}>
                      Document
                    </Box>
                    <Box component="th" sx={th}>
                      AI Suggested Folder
                    </Box>
                    <Box component="th" sx={{ ...th, pr: '24px', textAlign: 'right' }}>
                      Action
                    </Box>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <Box component="tr" key={d.id} data-doc={d.id} sx={rowSx(d)}>
                      <Box component="td" sx={{ ...td, pl: '24px' }}>
                        {docCell(d)}
                      </Box>
                      <Box component="td" sx={td}>
                        {suggestionCell(d)}
                      </Box>
                      <Box component="td" sx={{ ...td, pr: '24px' }}>
                        {actionCell(d)}
                      </Box>
                    </Box>
                  ))}
                </tbody>
              </Box>
            ))}

          {n === 0 && (
            <Box role="status" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: '48px 16px', fontSize: 13, color: 'og.gray', textAlign: 'center' }}>
              <Box component="b" sx={{ fontSize: 16, color: 'og.head' }}>
                Inbox is clear
              </Box>
              <span>Every document has been filed.</span>
            </Box>
          )}
        </Panel>
      </Box>
      <UploadModal open={upload.open} initialFiles={upload.files} destination="Unplaced Inbox" onClose={() => setUpload({ open: false, files: null })} onCommit={commit} />
    </AppShell>
  );
}

function NewPill() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', height: 17, px: '5px', borderRadius: '3px', bgcolor: '#B08A4E', color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', verticalAlign: 'middle' }}>
      New
    </Box>
  );
}
