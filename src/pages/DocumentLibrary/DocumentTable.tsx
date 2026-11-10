import { Box, Button, Checkbox, keyframes, Tooltip, useMediaQuery, type Theme } from '@mui/material';
import { Fragment, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { StatusTag } from '@/components';
import { routes } from '@/layout';
import { FILE_TYPE_COLORS, type LibraryDoc } from '@/data/documentLibrary';
import { ArrowIcon, DocUpload, FileGlyph } from './icons';

const pulse = keyframes`50%{opacity:.25}`;
const flashNew = keyframes`0%{background-color:#FFF4DC}100%{background-color:transparent}`;
const slideIn = keyframes`from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}`;
const shimmer = keyframes`0%{background-position:100% 0}100%{background-position:0 0}`;
const rise = keyframes`from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}`;

const LINKS = { review: routes.review, importWizard: routes.importWizard, crossCheck: routes.crossCheck, signature: routes.signature } as const;

/** Wraps case-insensitive matches of `q` in a gold <mark>. */
export function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const lower = text.toLowerCase();
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  for (let j = lower.indexOf(q, i); j >= 0; j = lower.indexOf(q, i)) {
    out.push(text.slice(i, j));
    out.push(
      <Box component="mark" key={k++} sx={{ bgcolor: 'rgba(201,164,92,.32)', color: 'inherit', borderRadius: '2px', px: '1px' }}>
        {text.slice(j, j + q.length)}
      </Box>,
    );
    i = j + q.length;
  }
  out.push(text.slice(i));
  return out;
}

/* ---------- cells ---------- */

function TypeTile({ type }: { type: string }) {
  const c = FILE_TYPE_COLORS[type] ?? '#60666C';
  return (
    <Box
      component="span"
      aria-hidden
      sx={(t) => ({
        flex: 'none',
        width: 40,
        minHeight: 52,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        borderRadius: '4px',
        color: t.palette.mode === 'dark' ? `color-mix(in srgb, ${c} 55%, #fff)` : c,
        bgcolor: `color-mix(in srgb, ${c} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} 20%, transparent)`,
      })}
    >
      <FileGlyph size={20} />
      <Box component="b" sx={{ fontSize: 9, fontWeight: 800, letterSpacing: '.08em', lineHeight: 1 }}>
        {type}
      </Box>
    </Box>
  );
}

function DocCell({ d, q, index, stacked }: { d: LibraryDoc; q: string; index: number; stacked: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: '10px', minWidth: 0 }}>
      <TypeTile type={d.type} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', minWidth: 0 }}>
        <Box
          component={d.isNew ? 'a' : RouterLink}
          {...(d.isNew ? { href: '#', onClick: (e: React.MouseEvent) => e.preventDefault() } : { to: LINKS[d.link] })}
          onClickCapture={() => {
            if (d.link === 'review' && !d.isNew) {
              try {
                sessionStorage.setItem('og-doc', String(index));
              } catch {
                /* storage unavailable */
              }
            }
          }}
          title={d.name}
          sx={{
            fontSize: 12.75,
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'og.ink',
            textDecoration: 'none',
            ...(stacked ? { whiteSpace: 'normal', overflowWrap: 'anywhere' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
            '&:hover': { color: 'og.blue', textDecoration: 'none' },
          }}
        >
          {highlight(d.name, q)}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: 12, lineHeight: 1.4, color: 'og.gray', minWidth: 0 }}>
          <Box component="span" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'og.ink', opacity: 0.85, lineHeight: 1.4 }}>
            {d.isNew && (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', px: '6px', py: '1px', mr: 1.5, borderRadius: '4px', bgcolor: '#B08A4E', color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', verticalAlign: '1px' }}>
                New
              </Box>
            )}
            {highlight(d.kind, q)}
          </Box>
          <span>{d.meta}</span>
        </Box>
      </Box>
    </Box>
  );
}

function PeriodCell({ d }: { d: LibraryDoc }) {
  return (
    <Box sx={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.4 }}>
      <Box component="span" sx={{ display: 'block', whiteSpace: 'nowrap', color: 'og.ink', fontSize: 12.5 }}>
        {d.period}
      </Box>
      {d.year && (
        <Box component="span" sx={{ display: 'block', fontSize: 11.5, color: 'og.gray', mt: '1px' }}>
          {d.year}
        </Box>
      )}
    </Box>
  );
}

function WhoCell({ d, q }: { d: LibraryDoc; q: string }) {
  if (!d.initials)
    return (
      <Box component="span" sx={{ color: 'og.gray', fontWeight: 500, fontSize: 12.5 }}>
        {d.who}
      </Box>
    );
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, overflow: 'hidden' }}>
      <Box
        component="span"
        aria-hidden
        sx={{
          flex: 'none',
          width: 30,
          height: 30,
          boxSizing: 'border-box',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: '.03em',
          ...(d.outline ? { bgcolor: 'og.pale', color: 'og.head', border: 1, borderColor: 'og.line' } : { color: '#06243F', backgroundImage: 'linear-gradient(145deg,#E6D3B0,#C9A874)' }),
        }}
      >
        {d.initials}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', lineHeight: 1.3, '& > *': { display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>
        <Box component="span" title={d.who} sx={{ fontWeight: 600, fontSize: 12.5 }}>
          {highlight(d.who, q)}
        </Box>
        {d.whoSub && (
          <Box component="small" title={d.whoSub} sx={{ fontSize: 11.5, color: 'og.gray' }}>
            {highlight(d.whoSub, q)}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function StatusCell({ d }: { d: LibraryDoc }) {
  return (
    <StatusTag tone={d.tone} sx={d.tone === 'proc' ? { '& > i': { animation: `${pulse} 1s ease-in-out infinite` } } : undefined}>
      {d.status}
    </StatusTag>
  );
}

function ActionCell({ d }: { d: LibraryDoc }) {
  if (d.action === 'processing')
    return (
      <Box component="span" sx={{ fontSize: 12, color: 'og.gray' }}>
        Processing
      </Box>
    );
  const map = {
    reviewTwoPane: { label: 'Review', variant: 'brass', to: routes.review },
    review: { label: 'Review', variant: 'brass', to: routes.review },
    reviewPlain: { label: 'Review', variant: 'contained', to: routes.review },
    inspect: { label: 'Inspect', variant: 'outlined', to: routes.review },
    reconcile: { label: 'Reconcile', variant: 'outlined', to: routes.crossCheck },
    requestSignature: { label: 'Request Signature', variant: 'contained', to: routes.signature },
  } as const;
  const a = map[d.action];
  if (d.action === 'inspect' && /^extracting/i.test(d.status))
    return (
      <Tooltip describeChild title="Available when extraction finishes">
        <Box component="span" tabIndex={0} aria-label={`Inspect ${d.name}: available when extraction finishes`} sx={{ display: 'inline-flex', borderRadius: '4px', '&:focus-visible': { outline: '2px solid', outlineColor: 'og.blue', outlineOffset: 2 } }}>
          <Button size="small" variant="outlined" disabled endIcon={<ArrowIcon />} sx={{ minWidth: 84, px: '12px', fontWeight: 700, width: '100%', '&.Mui-disabled': { opacity: 0.5, color: 'og.gray', borderColor: 'og.line', bgcolor: 'og.card' } }}>
            Inspect
          </Button>
        </Box>
      </Tooltip>
    );
  return (
    <Button
      size="small"
      variant={a.variant}
      component={RouterLink}
      to={a.to}
      endIcon={<ArrowIcon />}
      aria-label={`${a.label}: ${d.name}`}
      sx={{ minWidth: 84, px: '12px', fontWeight: 700, ...(a.variant === 'outlined' && { '&:hover': { borderColor: 'og.blue', color: 'og.blue' } }) }}
    >
      {a.label}
    </Button>
  );
}

/* ---------- skeleton ---------- */

function Bar({ w, h = 10, round, sx }: { w: string | number; h?: number; round?: boolean; sx?: object }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: 'block',
        width: w,
        height: h,
        flex: 'none',
        borderRadius: round ? '50%' : '4px',
        background: `linear-gradient(90deg, ${t.palette.og.lineSoft} 0%, rgba(0,90,156,.07) 40%, ${t.palette.og.lineSoft} 80%)`,
        backgroundSize: '300% 100%',
        animation: `${shimmer} 1.1s ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        '& + &': { mt: 1.5 },
        ...sx,
      })}
    />
  );
}

/* ---------- table ---------- */

export interface DocumentTableProps {
  rows: LibraryDoc[];
  /** Index of each row in the full folder list (for opening it in the review queue). */
  indexOf: (d: LibraryDoc) => number;
  q: string;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  loading?: boolean;
  /** Row flashed after "View File" / hash navigation. */
  focusId?: string | null;
  emptyState?: ReactNode;
  /** Bumps on folder change to replay the row entrance animation. */
  enterKey?: number;
}

const cellPad = { py: '13px', px: '8px' };

/** Library document table. Below 820px every row becomes a stacked card (checkbox column, who/value line, status, action). */
export function DocumentTable({ rows, indexOf, q, selected, onToggle, onToggleAll, loading, focusId, emptyState, enterKey }: DocumentTableProps) {
  const stacked = useMediaQuery((t: Theme) => t.breakpoints.down('md'));
  const hidePeriod = useMediaQuery('(max-width:1320px)');
  const allOn = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someOn = rows.some((r) => selected.has(r.id));

  const rowFx = (d: LibraryDoc, theme: Theme, i: number) => {
    const firstInset = (c: string) => (stacked ? { boxShadow: `inset 3px 0 0 ${c}` } : { '& > td:first-of-type': { boxShadow: `inset 3px 0 0 ${c}` } });
    return {
      ...(d.hot && {
        backgroundImage: `linear-gradient(90deg, rgba(176,138,78,${theme.palette.mode === 'dark' ? '.12' : '.08'}), rgba(176,138,78,0) 55%)`,
        ...firstInset('#B08A4E'),
      }),
      ...(d.isNew && { animation: `${slideIn} .35s ease-out, ${flashNew} 2.4s ease-out`, ...firstInset('#B08A4E') }),
      ...(focusId === d.id && { animation: `${flashNew} 2.4s ease-out`, ...firstInset(theme.palette.og.risk) }),
      ...(!d.isNew && focusId !== d.id && enterKey ? { animation: `${rise} .32s ease-out both`, animationDelay: `${Math.min(i, 5) * 0.03}s` } : {}),
      '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    };
  };

  const check = (d: LibraryDoc) => (
    <Checkbox size="small" checked={selected.has(d.id)} onChange={() => onToggle(d.id)} inputProps={{ 'aria-label': `Select ${d.name}` }} sx={{ '& svg': { fontSize: 18 } }} />
  );

  if (stacked) {
    return (
      <Box role="list" aria-label="Documents" aria-busy={loading || undefined}>
        {loading
          ? Array.from({ length: 6 }, (_, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', columnGap: 3, p: 4, borderBottom: 1, borderColor: 'og.lineSoft' }}>
                <Bar w={16} h={16} />
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Bar w={40} h={52} />
                  <Box sx={{ flex: 1 }}>
                    <Bar w={`${60 + ((i * 7) % 30)}%`} h={12} />
                    <Bar w="45%" />
                    <Bar w="62%" />
                  </Box>
                </Box>
              </Box>
            ))
          : rows.map((d, i) => (
              <Box
                role="listitem"
                key={d.id}
                id={d.id}
                sx={(t) => ({
                  display: 'grid',
                  gridTemplateColumns: '20px minmax(0,1fr) auto',
                  columnGap: 3,
                  rowGap: 2.5,
                  alignItems: 'center',
                  p: 4,
                  borderBottom: 1,
                  borderColor: 'og.lineSoft',
                  ...rowFx(d, t, i),
                })}
              >
                <Box sx={{ gridColumn: 1, gridRow: 1, alignSelf: 'start', pt: '11px', display: 'flex' }}>{check(d)}</Box>
                <Box sx={{ gridColumn: '2 / -1', gridRow: 1, minWidth: 0 }}>
                  <DocCell d={d} q={q} index={indexOf(d)} stacked />
                </Box>
                <Box sx={{ gridColumn: 2, gridRow: 2, minWidth: 0 }}>
                  <WhoCell d={d} q={q} />
                </Box>
                <Box sx={{ gridColumn: 3, gridRow: 2, justifySelf: 'end', textAlign: 'right', fontWeight: 700, color: 'og.head', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontSize: 13 }}>{d.value}</Box>
                <Box sx={{ gridColumn: '2', gridRow: 3, minWidth: 0, '@media (max-width:520px)': { gridColumn: '2 / -1' } }}>
                  <StatusCell d={d} />
                </Box>
                <Box sx={{ gridColumn: '3', gridRow: 3, justifySelf: 'end', '@media (max-width:520px)': { gridColumn: '2 / -1', gridRow: 4, justifySelf: 'stretch', '& > *': { width: '100%', justifyContent: 'center' } } }}>
                  <ActionCell d={d} />
                </Box>
              </Box>
            ))}
        {!loading && !rows.length && emptyState}
      </Box>
    );
  }

  const th = { ...cellPad, py: '11px', textAlign: 'left' as const, fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'og.gray', borderBottom: 1, borderColor: 'og.lineSoft', whiteSpace: 'nowrap' as const };
  const td = { ...cellPad, borderBottom: 1, borderColor: 'og.lineSoft', verticalAlign: 'middle', fontSize: 13, color: 'og.ink' };
  const ck = { pl: '20px', pr: 0, width: 40 };
  const statusPad = { pl: '14px' };
  const lastPad = { pl: 0, pr: '20px', textAlign: 'right' as const };
  const cols = hidePeriod ? 6 : 7;

  return (
    <Box sx={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'thin' }}>
      <Box component="table" aria-label="Documents" aria-busy={loading || undefined} sx={{ width: '100%', minWidth: 900, '@media (min-width:1181px)': { minWidth: 0 }, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: 40 }} />
          <col />
          {!hidePeriod && <col style={{ width: 104 }} />}
          <col style={{ width: 172 }} />
          <col style={{ width: 108 }} />
          <col style={{ width: 170 }} />
          <col style={{ width: 176 }} />
        </colgroup>
        <thead>
          <tr>
            <Box component="th" sx={{ ...th, ...ck }}>
              <Checkbox size="small" checked={allOn} indeterminate={!allOn && someOn} onChange={onToggleAll} inputProps={{ 'aria-label': 'Select all' }} sx={{ '& svg': { fontSize: 18 } }} />
            </Box>
            <Box component="th" sx={th}>
              Document
            </Box>
            {!hidePeriod && (
              <Box component="th" sx={th}>
                Pay Period
              </Box>
            )}
            <Box component="th" sx={th}>
              Employee / Vendor
            </Box>
            <Box component="th" sx={th}>
              Value
            </Box>
            <Box component="th" sx={{ ...th, ...statusPad }}>
              Status
            </Box>
            <Box component="th" sx={{ ...th, ...lastPad }}>
              <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Action
              </Box>
            </Box>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <Box component="td" sx={{ ...td, ...ck }}>
                    <Bar w={16} h={16} />
                  </Box>
                  <Box component="td" sx={td}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Bar w={40} h={52} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Bar w={`${60 + ((i * 7) % 30)}%`} h={12} />
                        <Bar w="45%" />
                        <Bar w="62%" />
                      </Box>
                    </Box>
                  </Box>
                  {!hidePeriod && (
                    <Box component="td" sx={td}>
                      <Bar w="70%" />
                      <Bar w="40%" />
                    </Box>
                  )}
                  <Box component="td" sx={td}>
                    <Box sx={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                      <Bar w={30} h={30} round />
                      <Box>
                        <Bar w={90} />
                        <Bar w={60} />
                      </Box>
                    </Box>
                  </Box>
                  <Box component="td" sx={td}>
                    <Bar w={64} />
                  </Box>
                  <Box component="td" sx={{ ...td, ...statusPad }}>
                    <Bar w={96} h={20} />
                  </Box>
                  <Box component="td" sx={{ ...td, ...lastPad }}>
                    <Bar w={72} h={30} sx={{ ml: 'auto' }} />
                  </Box>
                </tr>
              ))
            : rows.map((d, i) => (
                <Box component="tr" key={d.id} id={d.id} sx={(t) => ({ transition: 'background-color .12s', '&:hover': { bgcolor: 'og.pale' }, ...rowFx(d, t, i) })}>
                  <Box component="td" sx={{ ...td, ...ck }}>
                    {check(d)}
                  </Box>
                  <Box component="td" sx={td}>
                    <DocCell d={d} q={q} index={indexOf(d)} stacked={false} />
                  </Box>
                  {!hidePeriod && (
                    <Box component="td" sx={td}>
                      <PeriodCell d={d} />
                    </Box>
                  )}
                  <Box component="td" sx={td}>
                    <WhoCell d={d} q={q} />
                  </Box>
                  <Box component="td" sx={{ ...td, fontWeight: 700, color: 'og.head', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {d.value}
                  </Box>
                  <Box component="td" sx={{ ...td, ...statusPad }}>
                    <StatusCell d={d} />
                  </Box>
                  <Box component="td" sx={{ ...td, ...lastPad }}>
                    <ActionCell d={d} />
                  </Box>
                </Box>
              ))}
          {!loading && !rows.length && (
            <tr>
              <Box component="td" colSpan={cols} sx={{ p: 0, border: 0 }}>
                {emptyState}
              </Box>
            </tr>
          )}
        </tbody>
      </Box>
    </Box>
  );
}

/** "No documents match" state shown inside the table body. */
export function NoResults({ q, onClear }: { q: string; onClear: () => void }) {
  return (
    <Box sx={(t) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: '48px 16px', textAlign: 'center', color: t.palette.og.gray, fontSize: 13, '--og-badge': t.palette.og.card })}>
      <Box sx={{ color: 'og.blue', mb: 1.5, display: 'flex' }}>
        <DocUpload size={44} search />
      </Box>
      <Box component="b" sx={{ display: 'flex', maxWidth: 'min(520px, 90%)', gap: 1.5, justifyContent: 'center', fontSize: 15, color: 'og.head' }}>
        <Box component="span" sx={{ flex: 'none', whiteSpace: 'nowrap' }}>
          No documents match
        </Box>
        {q ? (
          <Box component="q" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {q}
          </Box>
        ) : (
          <Fragment> this tab</Fragment>
        )}
      </Box>
      <span>Try a file name, document type or employee.</span>
      {q && (
        <Button size="small" variant="outlined" onClick={onClear} sx={{ mt: 2 }}>
          Clear search
        </Button>
      )}
    </Box>
  );
}
