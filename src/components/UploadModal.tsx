import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CloseIcon, LockIcon, UploadCloudIcon } from '@/icons';
import { ACCEPTED_UPLOAD_EXT, uploadSampleFiles } from '@/data/upload';

export interface UploadFileLike {
  name: string;
  size: number;
}

export interface CommittedFile extends UploadFileLike {
  /** Replaces an existing file of the same name. */
  replace?: boolean;
}

type ItemState = 'up' | 'done' | 'dup' | 'bad' | 'gone';
interface Item extends CommittedFile {
  key: number;
  st: ItemState;
  p: number;
}

export interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  /** Destination shown in the header, e.g. "PW-00428 › 1. Force-Account Labor". */
  destination: string;
  /** File names already in the destination (duplicate detection). */
  existing?: string[];
  /** Files handed in when the modal opens (drag & drop, file picker). */
  initialFiles?: UploadFileLike[] | null;
  /** Called with the accepted files when the user clicks “Add N to folder”. */
  onCommit?: (files: CommittedFile[]) => void;
}

const fmt = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const ext = (n: string) => {
  const i = n.lastIndexOf('.');
  return i > 0 ? n.slice(i + 1).toLowerCase() : '';
};

/** Upload documents dialog: progress, duplicate detection and unsupported-format rejection. */
export function UploadModal({ open, onClose, destination, existing = [], initialFiles, onCommit }: UploadModalProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [drag, setDrag] = useState(false);
  const keyRef = useRef(0);
  const timers = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  };

  const run = useCallback((key: number) => {
    const t = window.setInterval(() => {
      setItems((list) =>
        list.map((it) => {
          if (it.key !== key || it.st !== 'up') return it;
          const p = Math.min(100, it.p + 8 + Math.random() * 18);
          if (p >= 100) window.clearInterval(t);
          return { ...it, p, st: p >= 100 ? 'done' : 'up' };
        }),
      );
    }, 140);
    timers.current.push(t);
  }, []);

  const addFiles = useCallback(
    (files: UploadFileLike[]) => {
      const current = [...itemsRef.current];
      const added: Item[] = [];
      files.forEach((f) => {
        const x = ext(f.name);
        let st: ItemState = 'up';
        if (!ACCEPTED_UPLOAD_EXT.includes(x)) st = 'bad';
        else if (existing.includes(f.name) || [...current, ...added].some((o) => o.name === f.name && o.st !== 'gone')) st = 'dup';
        added.push({ key: ++keyRef.current, name: f.name, size: f.size || 0, p: 0, st });
      });
      setItems([...current, ...added]);
      added.filter((i) => i.st === 'up').forEach((i) => run(i.key));
    },
    [existing, run],
  );

  useEffect(() => {
    if (!open) {
      clearTimers();
      setItems([]);
      return;
    }
    if (initialFiles?.length) addFiles(initialFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => clearTimers, []);

  const act = (it: Item, a: 'skip' | 'rm' | 'replace' | 'both') => {
    if (a === 'skip' || a === 'rm') {
      setItems((l) => l.map((o) => (o.key === it.key ? { ...o, st: 'gone' } : o)));
      return;
    }
    let name = it.name;
    if (a === 'both') {
      const x = ext(it.name);
      const base = it.name.slice(0, -(x.length + 1));
      let k = 2;
      while (existing.includes(`${base} (${k}).${x}`)) k++;
      name = `${base} (${k}).${x}`;
    }
    setItems((l) => l.map((o) => (o.key === it.key ? { ...o, name, st: 'up', p: 0, replace: a === 'replace' } : o)));
    run(it.key);
  };

  const live = items.filter((i) => i.st !== 'gone');
  const done = live.filter((i) => i.st === 'done').length;
  const up = live.filter((i) => i.st === 'up').length;
  const dup = live.filter((i) => i.st === 'dup').length;
  const bad = live.filter((i) => i.st === 'bad').length;

  const commit = () => {
    const ok = items.filter((i) => i.st === 'done').map(({ name, size, replace }) => ({ name, size, replace }));
    onClose();
    onCommit?.(ok);
  };

  const demo = () => addFiles(uploadSampleFiles(existing[4] ?? 'Timesheet_Delgado_PayPeriod_02.pdf'));

  const smallBtn = {
    height: 26,
    px: '9px',
    border: 1,
    borderColor: 'og.line',
    borderRadius: '4px',
    bgcolor: 'og.card',
    font: '600 11.5px Manrope, Arial, sans-serif',
    color: 'og.blue',
    cursor: 'pointer',
    '&:hover': { borderColor: 'og.blue' },
    '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: 1 },
  } as const;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="upm-title" slotProps={{ paper: { sx: { width: 'min(640px, calc(100vw - 32px))', maxWidth: 'none', m: 2, maxHeight: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column' } } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, p: '18px 22px 12px' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ font: '700 10.5px/1 Manrope, Arial, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A57F3C', mb: 2 }}>Upload</Typography>
          <Typography id="upm-title" component="h3" sx={{ font: '600 19px/1.25 Manrope, Arial, sans-serif', color: 'og.head' }}>
            Upload documents
          </Typography>
          <Typography sx={{ mt: 1, fontSize: 13, color: 'og.gray', '& b': { color: 'og.head' } }}>
            Destination: <b>{destination}</b>
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ width: 32, height: 32 }}>
          <CloseIcon size={14} />
        </IconButton>
      </Box>

      <Box
        component="label"
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 3.5,
          mx: '22px',
          p: '14px 16px',
          border: `1px dashed ${drag ? t.palette.og.blue : t.palette.mode === 'dark' ? 'rgba(90,167,230,.4)' : 'rgba(0,90,156,.4)'}`,
          borderRadius: '4px',
          bgcolor: 'og.blueTint',
          cursor: 'pointer',
          transition: 'border-color .15s',
          '&:hover': { borderColor: 'og.blue' },
          '&:focus-within': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: 2 },
        })}
      >
        <Box sx={{ color: 'og.blue', display: 'flex', flex: 'none' }}>
          <UploadCloudIcon size={34} strokeWidth={1.6} />
        </Box>
        <Box>
          <Box component="b" sx={{ display: 'block', fontSize: 14, color: 'og.head' }}>
            Drop files here or{' '}
            <Box component="span" sx={{ color: 'og.blue' }}>
              browse
            </Box>
          </Box>
          <Box component="span" sx={{ fontSize: 12, color: 'og.gray' }}>
            PDF, JPG, PNG, TIFF, HEIC, XLSX, XLS, CSV, DOCX
          </Box>
        </Box>
        <Box
          component="input"
          ref={inputRef}
          type="file"
          multiple
          aria-label="Choose files to upload"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
          sx={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, m: '8px 22px 0', fontSize: 11.5, color: 'og.gray' }}>
        <LockIcon size={12} strokeWidth={2} />
        Files upload directly to secure storage over a signed link.
      </Box>

      {live.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', m: '12px 0 0', p: '0 22px', overflowY: 'auto', minHeight: 0, flex: 1 }}>
          {live.map((it) => {
            const x = ext(it.name) || '?';
            return (
              <Box component="li" key={it.key} sx={{ display: 'grid', gridTemplateColumns: '36px minmax(0,1fr) auto', gap: '4px 12px', alignItems: 'center', py: '11px', borderTop: 1, borderColor: 'og.lineSoft' }}>
                <Box
                  component="span"
                  sx={{
                    gridRow: 'span 2',
                    display: 'grid',
                    placeItems: 'center',
                    width: 36,
                    height: 40,
                    borderRadius: '4px',
                    font: '800 9.5px/1 Manrope, Arial, sans-serif',
                    letterSpacing: '.06em',
                    ...(it.st === 'dup' ? { bgcolor: 'rgba(217,130,43,.14)', color: 'og.warn' } : it.st === 'bad' ? { bgcolor: 'og.riskTint', color: 'og.risk' } : { bgcolor: 'og.pale', color: 'og.blue' }),
                  }}
                >
                  {x.toUpperCase().slice(0, 4)}
                </Box>
                <Box component="span" title={it.name} sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 600, color: it.st === 'bad' ? 'og.gray' : 'og.head', textDecoration: it.st === 'bad' ? 'line-through' : 'none' }}>
                  {it.name}
                </Box>
                <Box component="span" sx={{ fontSize: 12, color: 'og.gray', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {it.size ? fmt(it.size) : ''}
                </Box>
                <Box sx={{ gridColumn: '2 / 4', display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 0, fontSize: 12, color: 'og.gray', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  {it.st === 'up' && (
                    <>
                      <Box role="progressbar" aria-label={`Uploading ${it.name}`} aria-valuenow={Math.round(it.p)} aria-valuemin={0} aria-valuemax={100} sx={{ flex: 1, height: 4, borderRadius: '2px', bgcolor: 'og.lineSoft', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${it.p.toFixed(0)}%`, bgcolor: 'og.blue', transition: 'width .2s linear' }} />
                      </Box>
                      <span>Uploading {it.p.toFixed(0)}%</span>
                    </>
                  )}
                  {it.st === 'done' && (
                    <>
                      <Box component="span" sx={{ color: 'og.good', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                        <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Uploaded{it.replace ? ' · replaces existing file' : ''}
                      </Box>
                      <Box component="span" sx={{ ml: 'auto' }}>
                        AI classification starts on Done
                      </Box>
                    </>
                  )}
                  {it.st === 'dup' && (
                    <>
                      <Box component="span" sx={{ flex: 1, minWidth: 0, color: 'og.warn', fontWeight: 600 }}>
                        Already in this folder. Keep the existing file, replace it, or keep both?
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, flex: 'none' }}>
                        <Box component="button" type="button" sx={smallBtn} onClick={() => act(it, 'skip')}>
                          Skip
                        </Box>
                        <Box component="button" type="button" sx={smallBtn} onClick={() => act(it, 'replace')}>
                          Replace
                        </Box>
                        <Box component="button" type="button" sx={smallBtn} onClick={() => act(it, 'both')}>
                          Keep both
                        </Box>
                      </Box>
                    </>
                  )}
                  {it.st === 'bad' && (
                    <>
                      <Box component="span" sx={{ flex: 1, minWidth: 0, color: 'og.risk', fontWeight: 600 }}>
                        Unsupported format (.{x}). Upload PDF, image (JPG, PNG, TIFF, HEIC), spreadsheet (XLSX, XLS, CSV) or DOCX files.
                      </Box>
                      <Box component="button" type="button" sx={smallBtn} onClick={() => act(it, 'rm')}>
                        Remove
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mt: 3, p: '14px 22px 18px', borderTop: 1, borderColor: 'og.line' }}>
        <Box aria-live="polite" sx={{ fontSize: 12.5, color: 'og.gray', '& b': { color: 'og.head' } }}>
          {!live.length ? (
            <Box component="button" type="button" onClick={demo} sx={{ border: 0, bgcolor: 'transparent', p: 0, font: '600 12.5px Manrope, Arial, sans-serif', color: 'og.blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Try sample files
            </Box>
          ) : (
            [
              done ? (
                <span key="d">
                  <b>{done}</b> uploaded
                </span>
              ) : null,
              up ? (
                <span key="u">
                  <b>{up}</b> uploading
                </span>
              ) : null,
              dup ? (
                <span key="p">
                  <b>{dup}</b> duplicate{dup > 1 ? 's' : ''} need a decision
                </span>
              ) : null,
              bad ? (
                <span key="b">
                  <b>{bad}</b> rejected
                </span>
              ) : null,
            ]
              .filter(Boolean)
              .flatMap((n, i) => (i ? [' · ', n] : [n]))
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button size="small" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="contained" disabled={!(done > 0 && !up && !dup)} onClick={commit}>
            {done ? `Add ${done} to folder` : 'Done'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
