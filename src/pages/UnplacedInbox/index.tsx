import { Box, Button, MenuItem, Select, Typography, useMediaQuery, type Theme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Panel, StatusTag, useToast } from '@/components';
import { AppShell, routes } from '@/layout';
import { ChevronDownIcon } from '@/icons';
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

/** 03c · Unplaced Inbox — documents the AI placement engine could not file; accept the suggestion or move manually. */
export default function UnplacedInbox() {
  const toast = useToast();
  const stacked = useMediaQuery((t: Theme) => t.breakpoints.down('md'));
  const [docs, setDocs] = useState(unplacedDocs);
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

  const remaining = docs.filter((d) => !leaving.has(d.id));
  const n = remaining.length;
  const suggested = remaining.filter((d) => d.suggestion).length;

  /** Fade the row out (300ms), then remove it. */
  const file = (targets: UnplacedDoc[]) => {
    setLeaving((s) => new Set([...s, ...targets.map((d) => d.id)]));
    timers.current.push(
      window.setTimeout(() => {
        const ids = new Set(targets.map((d) => d.id));
        setDocs((list) => list.filter((d) => !ids.has(d.id)));
      }, 300),
    );
  };

  const fileOne = (d: UnplacedDoc, folder: string) => {
    if (leaving.has(d.id)) return;
    file([d]);
    toast({ title: d.name, message: `filed to ${folder}`, inline: true, duration: 4500 });
  };

  const acceptAll = () => {
    const r = remaining.filter((d) => d.suggestion);
    if (!r.length) return;
    file(r);
    toast({ title: `${r.length} documents`, message: 'filed to their suggested folders', inline: true, duration: 4500 });
  };

  const commit = (files: CommittedFile[]) => {
    if (!files.length) return;
    toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: 'to Unplaced Inbox · auto-classifying', inline: true, duration: 6000 });
  };

  const th = { p: '10px 12px', textAlign: 'left' as const, font: '700 11px/1 Manrope, Arial, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'og.gray', bgcolor: 'og.pale', borderBottom: 1, borderColor: 'og.line' };
  const td = { p: '14px 12px', borderBottom: 1, borderColor: 'og.lineSoft', verticalAlign: 'top' };

  const docCell = (d: UnplacedDoc) => (
    <Box sx={{ display: 'flex', gap: 3, minWidth: 0 }}>
      <Box component="span" aria-hidden sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 36, height: 44, borderRadius: '4px', bgcolor: 'og.pale', font: '800 9.5px/1 Manrope, Arial, sans-serif', letterSpacing: '.06em', color: 'og.blue' }}>
        {d.ext}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box component={RouterLink} to={routes.review} title={d.name} sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 700, color: 'og.head', textDecoration: 'none', '&:hover': { color: 'og.blue', textDecoration: 'underline' } }}>
          {d.name}
        </Box>
        <Box component="small" sx={{ display: 'block', mt: '3px', fontSize: 12, color: 'og.gray' }}>
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
    </Box>
  );

  const rowSx = (d: UnplacedDoc) => ({ transition: 'opacity .3s, background-color .3s', opacity: leaving.has(d.id) ? 0 : 1 });

  return (
    <AppShell active="library" sidebarLabel="Queues & filing cabinet" sidebar={<LibrarySidebar activeQueue="inbox" inboxCount={n} />}>
      <FolderBanner
        prefix="Queue: To File"
        separator="·"
        separateFromPrefix
        crumbs={[{ label: 'DR-4673-CA', to: routes.disasters }]}
        title={`Unplaced Inbox (${n} Documents)`}
        subtitle="Documents the AI placement engine could not file with enough confidence. Accept the suggested folder or choose another."
        overlap={false}
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

          {n > 0 &&
            (stacked ? (
              <Box role="list" aria-label="Unplaced documents">
                {docs.map((d) => (
                  <Box role="listitem" key={d.id} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '14px 16px', borderBottom: 1, borderColor: 'og.lineSoft', ...rowSx(d) }}>
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
                  <col style={{ width: 250 }} />
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
                    <Box component="tr" key={d.id} sx={rowSx(d)}>
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
