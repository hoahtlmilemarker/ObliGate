import { Box, Button, Checkbox, Link, Popover, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppShell, PageBanner, PageBody, routes } from '@/layout';
import { LiftCard, SearchField, StatusTag, useToast, type Tone } from '@/components';
import { ColumnsIcon, SortIcon } from '@/icons';
import { fonts } from '@/theme/tokens';
import {
  declarationColumns,
  declarations,
  lifecycleStages,
  portfolioBanner,
  portfolioKpis,
  quickFilters,
  sortOptions,
  type Declaration,
  type HealthTone,
  type SortOption,
} from '@/data/disasterPortfolio';
import { PortfolioSidebar } from './Sidebar';
import { DeclareEventDialog, NewProjectDialog } from './Dialogs';
import { ArrowSmall, BusyButton, KpiCell, Meter, PlusSmall, bannerActionsSx, kpiGridSx, stackingTableSx } from './parts';

const healthTone: Record<HealthTone, Tone> = { warn: 'warn', risk: 'risk', good: 'good', neutral: 'neutral' };
const healthBar: Record<HealthTone, string> = { warn: 'og.warn', risk: 'og.risk', good: 'og.good', neutral: 'og.dim' };

function sortRows(rows: Declaration[], sort: SortOption) {
  if (sort === 'Newest') return [...rows].reverse();
  if (sort === 'Name A–Z') return [...rows].sort((a, b) => a.id.localeCompare(b.id));
  return rows;
}

/** 01 · Disaster Portfolio — declarations triage with KPI ledger and evidence-health table. */
export default function DisasterPortfolio() {
  const toast = useToast();
  const [stage, setStage] = useState('active');
  const [filters, setFilters] = useState<Record<string, boolean>>(() => Object.fromEntries(quickFilters.map((f) => [f.key, f.defaultChecked])));
  const [dialog, setDialog] = useState<'declare' | 'project' | null>(null);
  const [colsAnchor, setColsAnchor] = useState<HTMLElement | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>('Highest Risk');
  const [query, setQuery] = useState('');

  const current = lifecycleStages.find((s) => s.key === stage)!;
  const rows = useMemo(() => sortRows(declarations, sort), [sort]);
  const show = (key: string) => !hidden.has(key);

  const selectStage = (key: string) => {
    const s = lifecycleStages.find((x) => x.key === key)!;
    setStage(key);
    toast({ title: s.label, message: 'list filtered' });
  };

  const k = portfolioKpis;

  return (
    <AppShell
      active="disasters"
      searchLabel="Search portfolio..."
      sidebarLabel="Portfolio lifecycle & filters"
      sidebar={<PortfolioSidebar stage={stage} onStage={selectStage} filters={filters} onFilter={(key, v) => setFilters((f) => ({ ...f, [key]: v }))} />}
    >
      <Box sx={{ flex: 1, bgcolor: 'og.pale' }}>
        <PageBanner
          eyebrow={portfolioBanner.eyebrow}
          eyebrowRule
          title={portfolioBanner.title}
          subtitle={
            <Box component="span" sx={{ display: 'block', maxWidth: 560, fontSize: 15.5 }}>
              {portfolioBanner.subtitle}
            </Box>
          }
          actions={
            <Box sx={bannerActionsSx}>
              <Button variant="inverse" startIcon={<PlusSmall />} onClick={() => setDialog('declare')}>
                Declare New Event
              </Button>
              <Button variant="onDark" startIcon={<PlusSmall />} onClick={() => setDialog('project')}>
                New Project
              </Button>
              <BusyButton
                variant="onDark"
                busyLabel="Exporting…"
                ms={900}
                onDone={() => toast({ title: 'disaster-portfolio-summary.csv', message: 'export prepared' })}
              >
                Export Summary (CSV)
              </BusyButton>
            </Box>
          }
        />
        <PageBody>
          {/* KPI ledger */}
          <LiftCard component="section" aria-label="Portfolio totals">
            <Box sx={kpiGridSx}>
              <KpiCell label={k.obligated.label} value={k.obligated.value}>
                <Box component="span" sx={{ fontSize: 12, color: 'og.gray' }}>
                  <Box component="span" sx={{ color: 'og.good', fontWeight: 700 }}>
                    {k.obligated.delta}
                  </Box>{' '}
                  {k.obligated.deltaNote}
                </Box>
              </KpiCell>
              <KpiCell label={k.reconciled.label} value={k.reconciled.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: '6px' }}>
                  <Meter pct={k.reconciled.pct} color="og.blue" />
                  <Typography variant="data" sx={{ fontSize: 12.5, fontWeight: 700, color: 'og.head' }}>
                    {k.reconciled.pct}%
                  </Typography>
                </Box>
              </KpiCell>
              <KpiCell label={k.atRisk.label} value={k.atRisk.value} valueColor="og.risk">
                <Box>
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: '2px', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap', color: 'og.risk', border: '1px solid currentColor', borderRadius: '4px' }}>
                    {k.atRisk.chip}
                  </Box>
                </Box>
              </KpiCell>
              <KpiCell label={k.queue.label} value={k.queue.value}>
                <Box component="span" sx={{ fontSize: 12, color: 'og.gray' }}>
                  {k.queue.meta}
                </Box>
              </KpiCell>
            </Box>
          </LiftCard>

          {/* Toolbar */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 18px', minWidth: 0 }}>
              <SearchField
                placeholder="Filter disasters by name or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputProps={{ 'aria-label': 'Filter disasters' }}
                sx={{ width: 320, maxWidth: '100%', '& input': { height: 36 } }}
              />
              <Typography sx={{ fontSize: 12, color: 'og.gray' }} aria-live="polite">
                Showing {current.count} {current.label.toLowerCase()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
              <Button
                startIcon={<ColumnsIcon size={16} />}
                onClick={(e) => setColsAnchor(colsAnchor ? null : e.currentTarget)}
                aria-haspopup="true"
                aria-expanded={!!colsAnchor}
                sx={{ px: '14px', '& svg': { color: 'og.gray' }, '&:hover': { borderColor: 'og.blue', color: 'og.blue' } }}
              >
                Columns
              </Button>
              <Button
                startIcon={<SortIcon size={16} />}
                onClick={() => setSort(sortOptions[(sortOptions.indexOf(sort) + 1) % sortOptions.length])}
                sx={{ px: '14px', '& svg': { color: 'og.gray' }, '&:hover': { borderColor: 'og.blue', color: 'og.blue' } }}
              >
                Sort: {sort}
              </Button>
            </Box>
          </Box>

          <Popover
            open={!!colsAnchor}
            anchorEl={colsAnchor}
            onClose={() => setColsAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            slotProps={{ paper: { sx: (t) => ({ mt: '6px', width: 230, p: 2, border: `1px solid ${t.palette.og.line}`, borderTop: `2px solid ${t.palette.og.brass}`, boxShadow: t.palette.og.menuShadow }) } }}
          >
            <Box component="small" sx={{ display: 'block', p: '4px 8px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'og.gray' }}>
              Show columns
            </Box>
            {declarationColumns.map((c, i) => (
              <Box
                component="label"
                key={c.key}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 32, px: 2, borderRadius: '4px', fontSize: 13, fontWeight: 600, color: 'og.ink', cursor: i === 0 ? 'default' : 'pointer', '&:hover': { bgcolor: 'og.blueTint' } }}
              >
                <Checkbox
                  size="small"
                  checked={show(c.key)}
                  disabled={i === 0}
                  onChange={(e) =>
                    setHidden((h) => {
                      const n = new Set(h);
                      if (e.target.checked) n.delete(c.key);
                      else n.add(c.key);
                      return n;
                    })
                  }
                />
                {c.label}
              </Box>
            ))}
          </Popover>

          {/* Declarations table */}
          <Box sx={{ bgcolor: 'og.card', border: 1, borderColor: 'og.lineSoft', borderRadius: '4px', overflowX: 'auto' }}>
            <Table
              aria-label="Disaster declarations"
              sx={(t) => ({
                '& th': { p: '12px', lineHeight: 1.5, fontSize: 10.5, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: 'og.gray', borderBottom: `1px solid ${t.palette.og.line}` },
                '& td': { p: '14px 12px', fontSize: 13.5, whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottom: `1px solid ${t.palette.og.lineSoft}`, fontVariantNumeric: 'tabular-nums lining-nums' },
                '& th:first-of-type, & td:first-of-type': { pl: '20px', whiteSpace: 'normal', width: '28%' },
                '& th:last-of-type, & td:last-of-type': { pr: '20px' },
                '& td:nth-of-type(2)': { whiteSpace: 'normal', minWidth: 120 },
                '& tbody tr:last-of-type td': { borderBottom: 0 },
                '& tbody tr': { transition: 'background .15s' },
                '& tbody tr:hover td': { bgcolor: 'og.blueTint' },
                ...stackingTableSx(t),
              })}
            >
              <TableHead>
                <TableRow>
                  {declarationColumns.filter((c) => show(c.key)).map((c) => (
                    <TableCell key={c.key} align={c.align}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Link component={RouterLink} to={routes.project} underline="none" sx={{ fontFamily: fonts.serif, fontSize: 20, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.005em', width: 'fit-content' }}>
                          {d.id}
                        </Link>
                        <Box component="span" sx={{ fontSize: 12.5, lineHeight: 1.4, color: 'og.gray' }}>
                          {d.incident}
                        </Box>
                      </Box>
                    </TableCell>
                    {show('period') && <TableCell sx={{ fontSize: '12.5px !important', color: 'og.gray' }}>{d.period}</TableCell>}
                    {show('projects') && <TableCell sx={d.projectsAtRisk ? { color: 'og.risk', fontWeight: 700 } : undefined}>{d.projects}</TableCell>}
                    {show('obligated') && (
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'og.head' }}>
                        {d.obligated}
                      </TableCell>
                    )}
                    {show('documented') && <TableCell align="right">{d.documented}</TableCell>}
                    {show('health') && (
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', width: 120 }}>
                          <StatusTag tone={healthTone[d.health.tone]} variant="plain" sx={{ fontSize: 12.5 }}>
                            {d.health.label}
                          </StatusTag>
                          <Meter pct={d.health.pct} color={healthBar[d.health.tone]} />
                        </Box>
                      </TableCell>
                    )}
                    {show('action') && (
                      <TableCell>
                        <Button component={RouterLink} to={routes.project} size="small" endIcon={<ArrowSmall />} aria-label={`${d.action} — ${d.id}`}>
                          {d.action}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PageBody>
      </Box>

      <DeclareEventDialog open={dialog === 'declare'} onClose={() => setDialog(null)} />
      <NewProjectDialog open={dialog === 'project'} onClose={() => setDialog(null)} />
    </AppShell>
  );
}
