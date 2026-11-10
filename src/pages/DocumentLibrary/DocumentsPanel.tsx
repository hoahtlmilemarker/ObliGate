import { Box, Button, ButtonBase, IconButton, InputAdornment, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Panel, SearchField, useToast } from '@/components';
import type { LibraryDoc } from '@/data/documentLibrary';
import { BatchIcons, CaretIcon, DocUpload, NextIcon, UploadCloud } from './icons';
import { DocumentTable, NoResults } from './DocumentTable';

type Tab = 'all' | 'review' | 'verified' | 'ingested';
const PER = 10;

const isReview = (d: LibraryDoc) => /review needed|queued for review/i.test(d.status);
const isVerified = (d: LibraryDoc) => /verified/i.test(d.status);
const isIngested = (d: LibraryDoc) => /ingested/i.test(d.status);
const rowText = (d: LibraryDoc) => [d.name, d.kind, d.meta, d.period, d.year, d.initials, d.who, d.whoSub, d.value, d.status].join(' ').toLowerCase();

const BATCH = [
  { label: 'Send to Review Queue', icon: BatchIcons.review },
  { label: 'Request Signatures', icon: BatchIcons.signature },
  { label: 'Move to Folder…', icon: BatchIcons.move },
  { label: 'Export to Excel', icon: BatchIcons.export },
] as const;

export interface DocumentsPanelProps {
  docs: LibraryDoc[];
  loading?: boolean;
  /** Upload destination, e.g. "PW-00428 › 1. Force-Account Labor". */
  destination: string;
  onUploadClick: () => void;
  onDropFiles: (files: File[]) => void;
  /** Request to reveal and flash a row (View File, #hash). `n` makes repeat requests distinct. */
  focusRequest?: { id: string; n: number } | null;
  /** Bumps when uploaded rows are added: jump back to page 1 and reveal them. */
  addedNonce?: number;
  /** Bumps when the folder content changes (row entrance animation). */
  enterKey?: number;
}

/** Documents panel: status tabs, filter, batch actions, upload, table, pagination and the drag-over overlay. */
export function DocumentsPanel({ docs, loading, destination, onUploadClick, onDropFiles, focusRequest, addedNonce, enterKey }: DocumentsPanelProps) {
  const toast = useToast();
  const wide = useMediaQuery('(min-width:1341px)');
  const [tab, setTab] = useState<Tab>('all');
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce the filter (120ms, like the prototype)
  useEffect(() => {
    const t = window.setTimeout(() => {
      setQ(input.trim().toLowerCase());
      setPage(1);
    }, 120);
    return () => window.clearTimeout(t);
  }, [input]);

  const counts = useMemo(() => ({ all: docs.length, review: docs.filter(isReview).length, verified: docs.filter(isVerified).length, ingested: docs.filter(isIngested).length }), [docs]);

  const filtered = useMemo(
    () =>
      docs.filter((d) => {
        if (q && !rowText(d).includes(q)) return false;
        if (tab === 'review') return isReview(d);
        if (tab === 'verified') return isVerified(d);
        if (tab === 'ingested') return isIngested(d);
        return true;
      }),
    [docs, q, tab],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const cur = Math.min(page, pages);
  const visible = filtered.slice((cur - 1) * PER, cur * PER);
  const filt = !!q || tab !== 'all';

  // drag-anywhere upload overlay
  useEffect(() => {
    let n = 0;
    const has = (e: DragEvent) => !!e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
    const enter = (e: DragEvent) => {
      if (!has(e)) return;
      n++;
      setDragging(true);
    };
    const leave = (e: DragEvent) => {
      if (!has(e)) return;
      n = Math.max(0, n - 1);
      if (!n) setDragging(false);
    };
    const over = (e: DragEvent) => {
      if (has(e)) e.preventDefault();
    };
    const drop = (e: DragEvent) => {
      if (!has(e)) return;
      e.preventDefault();
      n = 0;
      setDragging(false);
      if ((e.target as Element | null)?.closest?.('[role="dialog"]')) return;
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length) onDropFiles(files);
    };
    document.addEventListener('dragenter', enter);
    document.addEventListener('dragleave', leave);
    document.addEventListener('dragover', over);
    document.addEventListener('drop', drop);
    return () => {
      document.removeEventListener('dragenter', enter);
      document.removeEventListener('dragleave', leave);
      document.removeEventListener('dragover', over);
      document.removeEventListener('drop', drop);
    };
  }, [onDropFiles]);

  // reveal + flash a row
  useEffect(() => {
    if (!focusRequest) return;
    setTab('all');
    setInput('');
    setQ('');
    const i = docs.findIndex((d) => d.id === focusRequest.id);
    if (i < 0) return;
    setPage(Math.floor(i / PER) + 1);
    setFocusId(null);
    requestAnimationFrame(() => {
      setFocusId(focusRequest.id);
      requestAnimationFrame(() => document.getElementById(focusRequest.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest]);

  // uploaded rows: back to page 1 and scroll to the first new row
  useEffect(() => {
    if (!addedNonce) return;
    setPage(1);
    requestAnimationFrame(() => {
      const first = docs.find((d) => d.isNew);
      if (first) document.getElementById(first.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedNonce]);

  const goPage = (p: number) => {
    setPage(p);
    headRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearSearch = () => {
    setInput('');
    setQ('');
    setPage(1);
    inputRef.current?.focus();
  };

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s);
      const on = !visible.every((d) => n.has(d.id));
      visible.forEach((d) => (on ? n.add(d.id) : n.delete(d.id)));
      return n;
    });

  const selCount = selected.size;
  const runBatch = (label: string) => {
    setMenuEl(null);
    toast({ title: label, message: `${selCount} document${selCount > 1 ? 's' : ''}`, duration: 4000 });
  };

  const fade = loading ? { opacity: 0.35, filter: 'blur(.4px)', transition: 'opacity .2s' } : { transition: 'opacity .2s' };

  const tabs: { key: Tab; label: string; warn?: boolean }[] = [
    { key: 'all', label: 'All' },
    { key: 'review', label: 'Needs Review', warn: true },
    { key: 'verified', label: 'Verified' },
    { key: 'ingested', label: 'Ingested' },
  ];

  const tabBar = (
    <Box role="tablist" aria-label="Filter by status" sx={{ display: 'flex', alignItems: 'stretch', gap: '2px', flex: 'none', ...(wide ? {} : { order: 2, width: '100%', mt: 1.5, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }) }}>
      {tabs.map((t) => {
        const on = tab === t.key;
        return (
          <ButtonBase
            key={t.key}
            role="tab"
            aria-selected={on}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            sx={(th) => ({
              flex: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              minHeight: wide ? 60 : 44,
              px: '10px',
              mb: '-1px',
              borderBottom: '2px solid',
              borderColor: on ? '#B08A4E' : 'transparent',
              color: on ? th.palette.og.head : th.palette.og.gray,
              font: '600 13px Manrope, Arial, sans-serif',
              '&:hover': { color: on ? th.palette.og.head : th.palette.og.ink },
              '&.Mui-focusVisible': { outline: `2px solid ${th.palette.og.blue}`, outlineOffset: -2 },
            })}
          >
            {t.label}
            <Box
              component="span"
              sx={(th) => ({
                minWidth: 18,
                px: '6px',
                py: '1px',
                borderRadius: '4px',
                fontSize: 11,
                fontWeight: 700,
                ...fade,
                ...(on ? { bgcolor: th.palette.og.buttonBlue, color: '#fff' } : t.warn ? { bgcolor: th.palette.og.warnTint, color: th.palette.og.warn } : { bgcolor: th.palette.og.pale, color: th.palette.og.gray }),
              })}
            >
              {counts[t.key]}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );

  const tools = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minWidth: 0,
        ...(wide ? { ml: 'auto', alignSelf: 'center', flex: '0 1 auto' } : { order: 1, width: '100%' }),
        '@media (max-width:640px)': { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', '& > *': { width: '100%' }, '& .lb-srch': { gridColumn: '1 / -1' } },
        '@media (max-width:520px)': { gridTemplateColumns: 'minmax(0,1fr)' },
      }}
    >
      <SearchField
        className="lb-srch"
        inputRef={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setInput('');
            setQ('');
            setPage(1);
          }
        }}
        placeholder="Filter documents..."
        title="Filter by file name or employee"
        inputProps={{ 'aria-label': 'Filter documents', type: 'search' }}
        endAdornment={
          input ? (
            <InputAdornment position="end" sx={{ ml: 0 }}>
              <IconButton aria-label="Clear search" onClick={clearSearch} sx={{ width: 18, height: 18, p: 0, borderRadius: '50%', bgcolor: 'og.gray', color: 'og.card', opacity: 0.55, '&:hover': { bgcolor: 'og.gray', color: 'og.card', opacity: 0.9 } }}>
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                  <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
        sx={{ flex: wide ? '0 1 240px' : '1 1 auto', width: wide ? 240 : 'auto', minWidth: 150, pr: '9px', '& input': { fontSize: 13, '&::-webkit-search-cancel-button': { display: 'none' } } }}
      />
      <Button
        variant="outlined"
        aria-haspopup="menu"
        aria-expanded={!!menuEl}
        aria-controls={menuEl ? 'lb-batch-menu' : undefined}
        onClick={(e) => setMenuEl(e.currentTarget)}
        endIcon={
          <Box component="span" sx={{ display: 'flex', transform: menuEl ? 'rotate(180deg)' : 'none' }}>
            <CaretIcon size={12} />
          </Box>
        }
        sx={{ flex: 'none', px: '12px', ...(menuEl && { borderColor: 'og.blue', color: 'og.blue' }), '&:hover': { borderColor: 'og.blue', color: 'og.blue' } }}
      >
        Batch Actions
      </Button>
      <Button variant="contained" startIcon={<UploadCloud />} onClick={onUploadClick} sx={{ flex: 'none' }}>
        Upload Documents
      </Button>
    </Box>
  );

  return (
    <Panel component="section" aria-label="Documents" sx={{ position: 'relative' }}>
      {/* drag-over overlay */}
      <Box
        aria-hidden
        sx={(t) => ({
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: dragging ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          bgcolor: t.palette.mode === 'dark' ? 'rgba(16,27,38,.94)' : 'rgba(242,247,253,.94)',
          outline: `2px dashed ${t.palette.og.blue}`,
          outlineOffset: -8,
          '--og-badge': t.palette.mode === 'dark' ? '#101B26' : '#F2F7FD',
        })}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center', px: 4 }}>
          <Box sx={{ color: 'og.blue', display: 'flex', mb: 2 }}>
            <DocUpload size={34} />
          </Box>
          <Box component="strong" sx={{ font: '700 17px Manrope, Arial, sans-serif', color: 'og.ink' }}>
            Drop files to upload
          </Box>
          <Box component="span" sx={{ fontSize: 12.5, color: 'og.gray', '& b': { color: 'og.ink', fontWeight: 600 } }}>
            to <b>{destination}</b> · auto-classified by the AI placement engine
          </Box>
        </Box>
      </Box>

      <Box
        ref={headRef}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: wide ? 'nowrap' : 'wrap',
          gap: wide ? 4 : 0,
          px: '20px',
          pt: wide ? 0 : '14px',
          borderBottom: 1,
          borderColor: 'og.line',
          minHeight: 60,
          scrollMarginTop: 72,
        }}
      >
        <Typography component="h2" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          Documents · {docs.length} Documents
        </Typography>
        {tabBar}
        {tools}
      </Box>

      <DocumentTable
        rows={visible}
        indexOf={(d) => docs.filter((x) => !x.isNew).indexOf(d)}
        q={q}
        selected={selected}
        onToggle={toggle}
        onToggleAll={toggleAll}
        loading={loading}
        focusId={focusId}
        enterKey={enterKey}
        emptyState={<NoResults q={q} onClear={clearSearch} />}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, p: '12px 20px 14px', fontSize: 12, color: 'og.gray', '@media (max-width:640px)': { flexDirection: 'column', p: '12px 16px' } }}>
        <Box component="span" aria-live="polite" sx={{ '& b': { color: 'og.ink', fontWeight: 700 }, ...fade }}>
          {filtered.length ? (
            <>
              Showing{' '}
              <b>
                {(cur - 1) * PER + 1}–{Math.min(cur * PER, filtered.length)}
              </b>{' '}
              of <b>{filtered.length}</b> {filt ? 'matching ' : ''}documents
            </>
          ) : (
            <>
              <b>0</b> matching documents
            </>
          )}
        </Box>
        {filtered.length > 0 && (
          <Box component="nav" aria-label="Pagination" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, '& .Mui-disabled': { opacity: 0.45 } }}>
            <Button size="small" variant="outlined" disabled={cur === 1} onClick={() => goPage(cur - 1)} startIcon={<CaretIcon dir="left" size={12} />}>
              Prev
            </Button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="small"
                variant={p === cur ? 'contained' : 'outlined'}
                aria-current={p === cur ? 'page' : undefined}
                aria-label={`Page ${p}`}
                onClick={() => goPage(p)}
                sx={{ minWidth: 30, width: 30, p: 0 }}
              >
                {p}
              </Button>
            ))}
            <Button size="small" variant="outlined" disabled={cur === pages} onClick={() => goPage(cur + 1)} endIcon={<NextIcon />}>
              Next
            </Button>
          </Box>
        )}
      </Box>

      <Menu
        id="lb-batch-menu"
        anchorEl={menuEl}
        open={!!menuEl}
        onClose={() => setMenuEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: (t) => ({ width: 250, mt: '6px', borderTop: `1px solid ${t.palette.og.line}`, boxShadow: '0 8px 24px -12px rgba(6,36,63,.16), 0 2px 6px rgba(6,36,63,.08)', '--og-menu-bg': t.palette.og.card }) } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', p: '8px 10px 10px', mb: 1, borderBottom: 1, borderColor: 'og.lineSoft', fontSize: 12.5, color: 'og.gray', '& b': { color: 'og.head' } }}>
          <span>
            <b>{selCount}</b> selected
          </span>
          {!selCount && (
            <Box component="span" sx={{ fontSize: 11.5 }}>
              Tick rows in the table to enable actions
            </Box>
          )}
        </Box>
        {BATCH.map((b) => (
          <MenuItem key={b.label} disabled={!selCount} onClick={() => runBatch(b.label)} sx={{ minHeight: 34, gap: '11px', color: 'og.ink', '& svg': { color: 'og.gray', flex: 'none' }, '&:hover svg': { color: 'og.blue' } }}>
            <b.icon />
            {b.label}
          </MenuItem>
        ))}
        <Box sx={{ height: '1px', my: 1, bgcolor: 'og.lineSoft' }} />
        <MenuItem disabled={!selCount} onClick={() => runBatch('Delete')} sx={{ minHeight: 34, gap: '11px', color: 'og.risk', '& svg': { color: 'og.risk', flex: 'none' }, '&:hover': { bgcolor: 'rgba(180,71,58,.08)', color: 'og.risk' } }}>
          <BatchIcons.delete />
          Delete
        </MenuItem>
      </Menu>
    </Panel>
  );
}
