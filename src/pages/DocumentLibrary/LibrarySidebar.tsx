import { Box, ButtonBase, Tooltip } from '@mui/material';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { QueueItem, SidebarSection, routes } from '@/layout';
import { filingCabinet, folderSlug, LEAF_FOLDERS, queueCounts, type TreeProject } from '@/data/documentLibrary';
import { CaretIcon, DocUpload, FolderClosed, FolderOpened, InboxGlyph, ReviewQueueGlyph } from './icons';

export interface ActiveFolder {
  project: string;
  folder: string;
}

export interface LibrarySidebarProps {
  /** Highlighted processing queue — only on the queue's own page (never while viewing a folder). */
  activeQueue?: 'review' | 'inbox';
  /** Highlighted filing-cabinet leaf. */
  activeFolder?: ActiveFolder;
  reviewCount?: number;
  inboxCount?: number;
  /** Show the dashed drag & drop zone (Document Library only). */
  showDropzone?: boolean;
  /** Files chosen or dropped on the sidebar drop zone. */
  onFiles?: (files: File[]) => void;
}

/** Where a filing-cabinet leaf links to. PW-00428 folders have sample content; the rest open the empty folder view. */
export function leafHref(project: string, folder: string) {
  if (project === 'PW-00428') return folder === LEAF_FOLDERS[0] ? routes.library : `${routes.library}?folder=${folderSlug(folder)}`;
  return `/library/${project}/${folderSlug(folder)}`;
}

const GAP_TIP = '1 checklist requirement missing: Supervisor Field Log Attestation';

const dashed = (stroke: string, opacity: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='.5' y='.5' width='calc(100%25 - 1px)' height='calc(100%25 - 1px)' rx='4' fill='none' stroke='%23${stroke}' stroke-opacity='${opacity}' stroke-width='1' stroke-dasharray='6 5'/%3E%3C/svg%3E")`;

/* ---------- tree primitives ---------- */

function Caret({ open, accent }: { open: boolean; accent: boolean }) {
  return (
    <Box component="span" sx={{ flex: 'none', width: 16, height: 16, p: '3px', display: 'flex', color: accent ? 'og.blue' : 'og.gray', opacity: accent ? 1 : 0.8, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>
      <CaretIcon dir="right" size={10} />
    </Box>
  );
}

function Count({ n, accent, leaf }: { n: number; accent?: boolean; leaf?: boolean }) {
  return (
    <Box component="span" sx={{ flex: 'none', minWidth: 20, ml: 2, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: accent ? 'og.blue' : leaf ? 'og.dim' : 'og.gray' }}>
      {n}
    </Box>
  );
}

interface BranchProps {
  open: boolean;
  onToggle: () => void;
  /** Nested branch: when open its label, caret and count turn blue. */
  nested?: boolean;
  root?: boolean;
  id?: string;
  sub?: string;
  label?: string;
  count: number;
  children: ReactNode;
}

function Branch({ open, onToggle, nested, root, id, sub, label, count, children }: BranchProps) {
  const accent = !!nested && open;
  const title = id ? `${id} ${sub ?? ''}`.trim() : label;
  return (
    <Box role="treeitem" aria-expanded={open} aria-label={title}>
      <ButtonBase
        onClick={onToggle}
        title={title}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          minHeight: 30,
          p: '4px 6px 4px 2px',
          borderRadius: '4px',
          '&:hover': { bgcolor: 'rgba(0,90,156,.045)' },
          '&.Mui-focusVisible': { bgcolor: 'og.blueTint' },
        }}
      >
        <Caret open={open} accent={accent} />
        <Box component="span" sx={(t) => ({ flex: 'none', display: 'flex', m: '0 8px 0 3px', color: t.palette.mode === 'dark' ? '#D9B877' : open && root ? '#9A7433' : '#B08A4E' })}>
          {open ? <FolderOpened /> : <FolderClosed />}
        </Box>
        {id ? (
          <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box component="span" sx={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.25, letterSpacing: '.01em', color: accent ? 'og.blue' : 'og.ink', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {id}
            </Box>
            {sub && (
              <Box component="span" sx={{ fontSize: 11, fontWeight: 500, lineHeight: 1.2, color: 'og.gray', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sub}
              </Box>
            )}
          </Box>
        ) : (
          <Box component="span" sx={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: root ? 700 : 600, lineHeight: 1.3, color: accent ? 'og.blue' : 'og.ink', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </Box>
        )}
        <Count n={count} accent={accent} />
      </ButtonBase>
      {open && (
        <Box
          role="group"
          sx={(t) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            m: '2px 0 6px 10px',
            pl: 1,
            borderLeft: `1px solid ${accent ? (t.palette.mode === 'dark' ? 'rgba(120,170,230,.4)' : 'rgba(0,90,156,.35)') : t.palette.og.line}`,
          })}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

function Leaf({ n, label, to, on, count, gap }: { n: number; label: string; to: string; on: boolean; count?: number; gap?: boolean }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      role="treeitem"
      aria-current={on ? 'page' : undefined}
      title={label}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minHeight: 28,
        p: '3px 6px 3px 7px',
        borderRadius: '4px',
        textDecoration: 'none',
        bgcolor: on ? 'og.blueTint' : 'transparent',
        '&:hover': { bgcolor: on ? 'og.blueTint' : 'rgba(0,90,156,.045)', textDecoration: 'none' },
        '&:focus-visible': { outline: 'none', bgcolor: 'rgba(0,90,156,.08)' },
        ...(on && { '&::before': { content: '""', position: 'absolute', left: -6, top: 5, bottom: 5, width: 3, borderRadius: '2px', bgcolor: 'og.blue' } }),
      }}
    >
      <Box component="span" sx={{ flex: 'none', width: 11, mr: '7px', fontSize: 12, fontWeight: 600, color: on ? 'og.blue' : 'og.dim', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        {n}
      </Box>
      <Box component="span" sx={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: on ? 700 : 500, lineHeight: 1.3, color: on ? 'og.blue' : 'og.ink', opacity: on ? 1 : 0.82, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </Box>
      {gap ? (
        <Tooltip title={GAP_TIP}>
        <Box
          component="span"
          role="img"
          aria-label={GAP_TIP}
          sx={{ flex: 'none', ml: 2, height: 20, px: '7px', display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '4px', bgcolor: 'og.warnTint', color: 'og.warn', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', '&::before': { content: '""', width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor' } }}
        >
          Gap
        </Box>
        </Tooltip>
      ) : count != null ? (
        <Count n={count} leaf />
      ) : null}
    </Box>
  );
}

/* ---------- drop zone ---------- */

function SideDropzone({ onFiles, target }: { onFiles?: (files: File[]) => void; target: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const stop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <ButtonBase
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        stop(e);
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        stop(e);
        setOver(false);
        if (e.dataTransfer.files.length) onFiles?.(Array.from(e.dataTransfer.files));
      }}
      aria-label={`Drag & drop documents here, or choose files to upload. Adds to ${target}; AI reads each file.`}
      sx={(t) => {
        const dark = t.palette.mode === 'dark';
        const hover = { backgroundImage: dashed(dark ? '5AA7E6' : '005A9C', 0.6), backgroundColor: dark ? '#142231' : '#F3F8FE' };
        return {
          mt: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          p: '12px 10px 12px',
          textAlign: 'center',
          borderRadius: '4px',
          backgroundImage: dashed(dark ? '5A7896' : '8FA9C6', 0.9),
          backgroundColor: dark ? '#111C27' : '#F9FBFE',
          '--og-badge': dark ? '#111C27' : '#FFFFFF',
          '&:hover': hover,
          ...(over && hover),
          '&.Mui-focusVisible': { outline: `2px solid ${t.palette.og.blue}`, outlineOffset: 2 },
        };
      }}
    >
      <Box component="span" sx={{ color: 'og.blue', display: 'flex', mb: '6px' }}>
        <DocUpload size={34} />
      </Box>
      <Box component="strong" sx={{ fontSize: 15, fontWeight: 700, color: 'og.ink', lineHeight: 1.3 }}>
        Drag &amp; drop documents here
      </Box>
      <Box component="span" sx={{ fontSize: 12.5, lineHeight: 1.45, color: 'og.gray', maxWidth: 250 }}>
        Adds to {target} · AI reads each file
      </Box>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles?.(files);
          e.target.value = '';
        }}
      />
    </ButtonBase>
  );
}

/* ---------- sidebar ---------- */

function initialOpen(activeFolder?: ActiveFolder) {
  const open = new Set<string>(['root']);
  let found = false;
  filingCabinet.departments.forEach((d) =>
    d.projects.forEach((p) => {
      if (p.defaultOpen) open.add(p.id);
      if (activeFolder && p.id === activeFolder.project) {
        open.add(d.id);
        open.add(p.id);
        found = true;
      }
    }),
  );
  // Siblings behave as an accordion: keep only the active project open inside its department.
  if (activeFolder) {
    filingCabinet.departments.forEach((d) => d.projects.forEach((p) => p.id !== activeFolder.project && d.projects.some((x) => x.id === activeFolder.project) && open.delete(p.id)));
  }
  if (!found) open.add(filingCabinet.departments[0].id);
  return open;
}

/** Shared left rail for the Document Library screens: processing queues, filing cabinet tree, optional drop zone. */
export function LibrarySidebar({ activeQueue, activeFolder, reviewCount = queueCounts.review, inboxCount = queueCounts.inbox, showDropzone, onFiles }: LibrarySidebarProps) {
  const [open, setOpen] = useState(() => initialOpen(activeFolder));

  /** Toggle a node; opening closes its siblings (accordion like `<details name>`). */
  const toggle = (id: string, siblings: string[]) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        siblings.forEach((s) => next.delete(s));
        next.add(id);
      }
      return next;
    });

  const dropTarget = activeFolder ? `${LEAF_FOLDERS.indexOf(activeFolder.folder as (typeof LEAF_FOLDERS)[number]) + 1}. ${activeFolder.folder}` : 'this folder';
  const deptIds = filingCabinet.departments.map((d) => d.id);

  const projectNode = (p: TreeProject, siblings: string[]) => (
    <Branch key={p.id} nested open={open.has(p.id)} onToggle={() => toggle(p.id, siblings)} id={p.id} sub={p.name} count={p.count}>
      {LEAF_FOLDERS.map((f, i) => (
        <Leaf key={f} n={i + 1} label={f} to={leafHref(p.id, f)} on={activeFolder?.project === p.id && activeFolder.folder === f} gap={p.gapLeaf === f} count={p.leafCounts?.[f]} />
      ))}
    </Branch>
  );

  return (
    <>
      <SidebarSection label="Processing Queues" scope="All of DR-4683-CA">
        <QueueItem icon={<ReviewQueueGlyph />} label="To Review · all projects" count={reviewCount} to={routes.review} active={activeQueue === 'review'} />
        <QueueItem icon={<InboxGlyph />} label="To File (Unplaced Inbox)" count={inboxCount} to={routes.inbox} active={activeQueue === 'inbox'} />
      </SidebarSection>
      <SidebarSection label="Filing Cabinet">
        <Box role="tree" aria-label="Filing cabinet" sx={{ display: 'flex', flexDirection: 'column', gap: '2px', pt: '2px' }}>
          <Branch root open={open.has('root')} onToggle={() => toggle('root', [])} id={filingCabinet.disaster.id} sub={filingCabinet.disaster.name} count={filingCabinet.disaster.count}>
            {filingCabinet.departments.map((d) => (
              <Branch key={d.id} nested open={open.has(d.id)} onToggle={() => toggle(d.id, deptIds)} label={d.name} count={d.count}>
                {d.projects.map((p) => projectNode(p, d.projects.map((x) => x.id)))}
              </Branch>
            ))}
          </Branch>
        </Box>
      </SidebarSection>
      {showDropzone && <SideDropzone onFiles={onFiles} target={dropTarget} />}
    </>
  );
}
