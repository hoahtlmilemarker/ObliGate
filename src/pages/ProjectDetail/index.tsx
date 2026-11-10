import { Box, Button, ButtonBase, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { AppShell, PageBody, routes } from '@/layout';
import { LiftCard, Panel, StatusTag, useToast } from '@/components';
import { UploadCloudIcon } from '@/icons';
import { brand } from '@/theme/tokens';
import { assignedTeam, checklist, costCategories, project, projectKpis, projectNav, type ProjectNavTarget } from '@/data/projectDetail';
import { ArrowSmall, BusyButton, KpiCell, Meter, bannerActionsSx, kpiGridSx, stackingTableSx } from '@/pages/DisasterPortfolio/parts';
import { ProjectBanner } from './ProjectBanner';
import { UploadModal } from '@/components/UploadModal';

const navTo: Record<Exclude<ProjectNavTarget, null>, string> = {
  overview: routes.project,
  library: routes.library,
  crossCheck: routes.crossCheck,
  preSubmission: routes.preSubmission,
};

/** Small uppercase rail label. */
function RailLabel({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Typography variant="label" component="h2" sx={{ fontSize: 11.5, ...sx }}>
      {children}
    </Typography>
  );
}

function ProjectSidebar({ projectId }: { projectId: string }) {
  const itemSx = (active?: boolean) => (t: import('@mui/material').Theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2.5,
    width: '100%',
    minHeight: 44,
    pl: '14px',
    pr: 3,
    fontSize: 14,
    fontFamily: 'inherit',
    textAlign: 'left' as const,
    color: active ? t.palette.og.blue : t.palette.og.ink,
    fontWeight: active ? 700 : 400,
    bgcolor: active ? t.palette.og.blueTint : 'transparent',
    borderLeft: active ? `3px solid ${t.palette.og.blue}` : 0,
    borderRadius: active ? '0 4px 4px 0' : '4px',
    '&:hover': { bgcolor: active ? t.palette.og.blueTint : t.palette.og.pale, color: active ? t.palette.og.blue : t.palette.og.ink },
    '&:focus-visible, &.Mui-focusVisible': { outline: `2px solid ${t.palette.og.blue}`, outlineOffset: -2 },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <Box sx={{ px: '14px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <RailLabel>Project Scope</RailLabel>
        <Box component="span" sx={{ fontSize: 26, fontWeight: 300, color: 'og.head', letterSpacing: '-0.02em', lineHeight: 1.55 }}>
          {projectId}
        </Box>
        <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
          {project.scope}
        </Box>
      </Box>

      <Box component="nav" aria-label="Project destinations" sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <RailLabel sx={{ p: '0 14px 10px' }}>Destinations</RailLabel>
        {projectNav.map((n) => {
          const inner = (
            <>
              <span>{n.label}</span>
              {n.count && (
                <Box component="span" sx={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: n.active ? 'og.blue' : n.tone ? `og.${n.tone}` : 'og.gray' }}>
                  {n.count}
                </Box>
              )}
            </>
          );
          return n.target ? (
            <Box component={RouterLink} key={n.label} to={navTo[n.target]} aria-current={n.active ? 'page' : undefined} sx={itemSx(n.active)}>
              {inner}
            </Box>
          ) : (
            <ButtonBase key={n.label} sx={itemSx(false)}>
              {inner}
            </ButtonBase>
          );
        })}
      </Box>

      <Box sx={{ mx: '14px', pt: '18px', borderTop: 1, borderColor: 'og.line', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <RailLabel>Assigned Team</RailLabel>
        {assignedTeam.map((p) => (
          <Box component="span" key={p} sx={{ fontSize: 13.5 }}>
            {p}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Tag pill (prototype `.tag`). */
function Tag({ tone, dot = true, children }: { tone: 'good' | 'warn' | 'risk'; dot?: boolean; children: ReactNode }) {
  return (
    <StatusTag tone={tone} noDot={!dot} sx={{ fontSize: 11.5, fontWeight: 600, lineHeight: '18px', p: '3px 10px', gap: '6px', '& > i': { width: 7, height: 7 } }}>
      {children}
    </StatusTag>
  );
}

/** Seal-shaped status icon used in the checklist. */
function Seal({ ok }: { ok: boolean }) {
  const d = 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z';
  return (
    <Box component="span" sx={{ flex: 'none', width: 28, height: 28, display: 'grid', placeItems: 'center', color: ok ? 'og.good' : 'og.warn' }}>
      <Box component="svg" width={26} height={26} viewBox="0 0 24 24" aria-hidden sx={{ display: 'block', filter: 'drop-shadow(0 1px 1.5px rgba(10,40,25,.2))' }}>
        <path d={d} fill="currentColor" />
        <path d={d} fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1" transform="translate(12 12) scale(.8) translate(-12 -12)" />
        {ok ? (
          <path d="m8.6 12.2 2.3 2.3 4.6-4.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M12 7.6v5" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
            <circle cx="12" cy="16.1" r="1.25" fill="#fff" />
          </>
        )}
      </Box>
      <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {ok ? 'Complete' : 'Pending'}
      </Box>
    </Box>
  );
}

/** 02 · Project Detail — project posture, FEMA cost categories, pre-submission checklist. */
export default function ProjectDetail() {
  const { projectId = project.id } = useParams();
  const toast = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const k = projectKpis;

  return (
    <AppShell active="disasters" searchLabel="Search project..." sidebarLabel="Project navigation" sidebar={<ProjectSidebar projectId={projectId} />}>
      <Box sx={{ flex: 1, bgcolor: 'og.pale' }}>
        <ProjectBanner
          crumbs={[{ label: 'Disasters', to: routes.disasters }, { label: project.disasterCrumb, to: routes.disasters }, { label: project.projectCrumb }]}
          meta={
            <>
              <Typography variant="eyebrow" component="span" sx={{ fontSize: 11.5, color: brand.goldText }}>
                {project.idLabel}
              </Typography>
              <Tag tone="warn">{project.status}</Tag>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', p: '3px 10px', borderRadius: '4px', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap', color: 'rgba(255,255,255,.68)' }}>
                {project.fips}
              </Box>
            </>
          }
          title={project.title}
          subtitle={project.subtitle}
          actions={
            <Box sx={bannerActionsSx}>
              <Button variant="inverse" component={RouterLink} to={routes.preSubmission} endIcon={<ArrowSmall />}>
                Assemble FEMA Package
              </Button>
              <Button variant="onDark" startIcon={<UploadCloudIcon size={16} />} onClick={() => setUploadOpen(true)}>
                Upload Documents
              </Button>
              <BusyButton variant="onDark" busyLabel="Assembling…" ms={1200} onDone={() => toast({ title: 'Draft binder', message: 'for PW-00428 generated · 3 findings still open', inline: true })}>
                Export Binder
              </BusyButton>
            </Box>
          }
        />
        <PageBody>
          <LiftCard component="section" aria-label="Financial posture">
            <Box sx={kpiGridSx}>
              <KpiCell label={k.obligation.label} value={k.obligation.value}>
                <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
                  {k.obligation.note}
                  <Box component="strong" sx={{ color: 'og.ink' }}>
                    {k.obligation.noteValue}
                  </Box>
                </Box>
              </KpiCell>
              <KpiCell label={k.claimed.label} value={k.claimed.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, pt: '4px' }}>
                  <Meter pct={k.claimed.pct} color="og.blue" height={6} radius={4} />
                  <Typography variant="data" sx={{ fontSize: 13, fontWeight: 700, color: 'og.blue' }}>
                    {k.claimed.pct}%
                  </Typography>
                </Box>
                <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
                  {k.claimed.note}
                </Box>
              </KpiCell>
              <KpiCell label={k.verified.label} value={k.verified.value}>
                <Box component="span" sx={{ fontSize: 13, color: 'og.good', fontWeight: 700 }}>
                  <Box component="svg" width={13} height={13} viewBox="0 0 16 16" aria-hidden sx={{ display: 'inline-block', verticalAlign: '-2px', mr: 1 }}>
                    <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Box>
                  {k.verified.note}
                </Box>
              </KpiCell>
              <KpiCell label={k.atRisk.label} value={k.atRisk.value} valueColor="og.risk">
                <Box>
                  <Tag tone="risk" dot={false}>
                    {k.atRisk.tag}
                  </Tag>
                </Box>
              </KpiCell>
            </Box>
          </LiftCard>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'flex-start' }}>
            {/* Cost categories */}
            <Box component="section" aria-labelledby="pd-cat-h" sx={{ flex: '2 1 560px', minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 3, pb: 3 }}>
                <Typography id="pd-cat-h" component="h2" sx={{ fontSize: 24, fontWeight: 300, color: 'og.head', letterSpacing: '-0.015em', lineHeight: 1.4 }}>
                  FEMA Cost Category Breakdown
                </Typography>
                <Link component={RouterLink} to={routes.library} underline="hover" sx={{ fontSize: 13, fontWeight: 700, flex: 'none', maxWidth: { xs: 100, sm: 'none' } }}>
                  View in Document Library
                </Link>
              </Box>
              <Box sx={(t) => ({ overflowX: 'auto', borderTop: `2px solid ${t.palette.og.head}` })}>
                <Table
                  aria-label="FEMA cost category breakdown"
                  sx={(t) => ({
                    minWidth: 620,
                    '& th': { p: '12px 10px', lineHeight: 1.5, fontSize: 10.5, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: 'og.gray', borderBottom: `1px solid ${t.palette.og.line}` },
                    '& td': { p: '14px 10px', fontSize: 13.5, whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottom: `1px solid ${t.palette.og.lineSoft}`, fontVariantNumeric: 'tabular-nums lining-nums' },
                    '& th:first-of-type, & td:first-of-type': { pl: '4px', whiteSpace: 'normal', width: '38%' },
                    '& td:first-of-type': { minWidth: 210 },
                    ...stackingTableSx(t),
                  })}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Claimed</TableCell>
                      <TableCell align="right">Documented</TableCell>
                      <TableCell>Readiness</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {costCategories.map((c) => (
                      <TableRow key={c.name}>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <Box component="strong" sx={{ fontSize: 14, lineHeight: 1.3, color: 'og.head' }}>
                              {c.name}
                            </Box>
                            <Box component="span" sx={{ fontSize: 12.5, lineHeight: 1.4, color: 'og.gray' }}>
                              {c.detail}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {c.claimed}
                        </TableCell>
                        <TableCell align="right">{c.documented}</TableCell>
                        <TableCell>
                          <Tag tone={c.readiness.tone}>{c.readiness.label}</Tag>
                        </TableCell>
                        <TableCell>
                          <Button
                            component={RouterLink}
                            to={c.action.target === 'crossCheck' ? routes.crossCheck : routes.library}
                            size="small"
                            variant={c.action.primary ? 'contained' : 'outlined'}
                            endIcon={<ArrowSmall />}
                            aria-label={`${c.action.label} — ${c.name}`}
                            sx={{ fontSize: 13 }}
                          >
                            {c.action.label}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>

            {/* Checklist */}
            <Panel component="section" aria-labelledby="pd-ck-h" sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2.5, p: '16px 20px', borderBottom: 1, borderColor: 'og.line' }}>
                <Typography id="pd-ck-h" component="h2" sx={{ fontSize: 20, fontWeight: 300, color: 'og.head', letterSpacing: '-0.01em' }}>
                  {checklist.title}
                </Typography>
                <Tag tone="warn" dot={false}>
                  {checklist.pending}
                </Tag>
              </Box>
              <Box sx={{ p: '4px 20px 8px' }}>
                {checklist.items.map((it, i) => (
                  <Box key={it.title} sx={{ position: 'relative', display: 'flex', gap: 3.5, py: 4, borderBottom: i < checklist.items.length - 1 ? 1 : 0, borderColor: 'og.lineSoft' }}>
                    <Seal ok={it.state === 'ok'} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: it.link ? 1 : '2px' }}>
                      <Box component="span" sx={{ fontSize: 14, fontWeight: 700, color: 'og.ink' }}>
                        {it.title}
                      </Box>
                      <Box component="span" sx={{ fontSize: 13, color: 'og.gray' }}>
                        {it.detail}
                      </Box>
                      {it.link && (
                        <Link component={RouterLink} to={routes.signature} underline="hover" sx={{ fontSize: 13, fontWeight: 700, width: 'fit-content' }}>
                          {it.link.label}
                        </Link>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Panel>
          </Box>
        </PageBody>
      </Box>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        destination={project.uploadDestination}
        onCommit={(files) => toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: `to ${project.uploadDestination} · auto-classifying`, inline: true, duration: 6000 })}
      />
    </AppShell>
  );
}
