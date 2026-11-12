import { Box, Button, Link, Typography } from '@mui/material';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppShell, routes } from '@/layout';
import { LiftCard, useToast } from '@/components';
import { ArrowRightIcon, CheckIcon, ClockIcon } from '@/icons';
import { HOME_DR, plural, projectNames, summarize, type Classified } from '@/data/classify';
import { confirmPlacement, getResults, isDemoBatch } from '@/data/uploadSession';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import { AnTag, CardHead, FileRow } from './ui';
import illustration from './ok.svg';

const inboxFor = (name?: string) => (name ? `${routes.inbox}#f=${encodeURIComponent(name)}` : routes.inbox);
const libraryFor = (name: string) => `${routes.library}#f=${encodeURIComponent(name)}`;
const Arrow = <ArrowRightIcon size={13} />;
const SERIF = '"Cormorant Garamond", Georgia, serif';

function Kpi({ label, value, color, children, extra }: { label: ReactNode; value: number; color?: string; children?: ReactNode; extra?: ReactNode }) {
  return (
    <Box
      sx={{
        p: '16px 24px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRight: 1,
        borderColor: 'og.lineSoft',
        '&:last-of-type': { borderRight: 0 },
        '@media (max-width:900px)': {
          '&:nth-of-type(2)': { borderRight: 0 },
          '&:nth-of-type(-n+2)': {
            borderBottom: 1,
            borderBottomColor: 'og.lineSoft',
          },
        },
      }}
    >
      <Typography variant="label" component="div" sx={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        {label}
        {extra}
      </Typography>
      <Box
        component="span"
        sx={{
          fontFamily: SERIF,
          fontSize: 32,
          fontWeight: 500,
          lineHeight: 1,
          color: color ?? 'og.head',
          fontVariantNumeric: 'lining-nums tabular-nums',
        }}
      >
        {value}
      </Box>
      {children}
    </Box>
  );
}

/** 14 · Analysis report — what was filed, what needs a folder, and the findings to fix first. */
export default function AnalysisReport() {
  const toast = useToast();
  const demo = useMemo(isDemoBatch, []);
  const [version, setVersion] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { files, removed } = useMemo(getResults, [version]);
  const s = summarize(files);
  const { total: N, unplaced: U, critical: C, advisory: A, check: CK } = s;

  useEffect(() => {
    document.title = 'Analysis Report';
  }, []);

  const first = s.findings[0]?.finding;
  const [title, sub] = !N
    ? ['Nothing left to check from this upload', `You removed all ${plural(removed, 'file')} because they were not disaster records. Upload the records you want ObliGate to check.`]
    : C + A
      ? [`${plural(C + A, 'finding')} to fix before FEMA review`, `We read your ${plural(N, 'file')} and checked the filed ones against PAPPG v4.0 and 2 CFR § 200. Start with the first finding below.`]
      : U
        ? [
            U === N ? 'Your files are in. Tell us where they belong.' : `${plural(U, 'file')} still need${U === 1 ? 's' : ''} a folder`,
            `${s.placed ? `${plural(s.placed, 'file')} were filed with no rule issues. ` : ''}We could not find a disaster or project in ${U === N ? 'any of your files' : plural(U, 'file')}. Choose where ${U === 1 ? 'it belongs' : 'they belong'} so they can be checked.`,
          ]
        : [`All ${plural(N, 'file')} are ready for FEMA`, 'Every file was filed and passed the rule check.'];
  const cta = !N
    ? { label: 'Upload Records', to: routes.upload }
    : first
      ? {
          label: `Start with ${first.fix.replace(/^(Resolve in|Open in) /, '')}`,
          to: first.href,
        }
      : U
        ? { label: `Choose Folders for ${plural(U, 'File')}`, to: routes.inbox }
        : { label: 'Open Document Library', to: routes.library };

  const confirm = (x: Classified) => {
    confirmPlacement(x.name);
    setVersion((v) => v + 1);
    toast({
      title: 'Folder confirmed',
      message: `${x.name} stays in ${x.folder}`,
    });
  };

  // Group: filed files by DR + project, then "Needs a folder" (split by detected other DR).
  const groups = new Map<string, Classified[]>();
  for (const x of files) {
    const k = x.placed ? `${x.dr}|${x.pw}` : `~|${x.dr !== HOME_DR ? x.dr : ''}`;
    groups.set(k, [...(groups.get(k) ?? []), x]);
  }

  return (
    <AppShell>
      <Masthead
        illustration={illustration}
        eyebrow={
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px 14px',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                height: 26,
                px: '10px',
                border: '1px solid rgba(95,214,174,.5)',
                borderRadius: '4px',
                bgcolor: 'rgba(46,125,79,.22)',
                color: '#9BE6C4',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}
            >
              <CheckIcon size={13} />
              Upload complete
            </Box>
            <MastheadEyebrow>
              {plural(N, 'file')} analyzed just now
              {s.placed ? ` · ${HOME_DR} · ${plural(s.projects.length, 'project')}` : ''}
              {demo ? ' · sample data' : ''}
            </MastheadEyebrow>
            {N > 0 && (
              <Link
                href="#your-files"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.85)',
                  textUnderlineOffset: 3,
                }}
              >
                See what was filed
              </Link>
            )}
          </Box>
        }
        title={title}
        subtitle={sub}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 1 }}>
          <Button component={RouterLink} to={cta.to} variant="inverse" endIcon={Arrow}>
            {cta.label}
          </Button>
          <Button component={RouterLink} to={routes.disasters} variant="onDark">
            View Disasters Dashboard
          </Button>
        </Box>
      </Masthead>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          mt: '-52px',
          px: { xs: 4, sm: 7 },
          pb: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <LiftCard
          component="section"
          aria-label="Summary"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
            '@media (max-width:900px)': {
              gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
            },
          }}
        >
          <Kpi
            label="Files analyzed"
            value={N}
            extra={
              <Box
                component="em"
                sx={{
                  fontStyle: 'normal',
                  px: '6px',
                  py: '2px',
                  borderRadius: '4px',
                  bgcolor: 'og.goodTint',
                  color: 'og.good',
                  fontSize: 9.5,
                  letterSpacing: '.1em',
                }}
              >
                Just now
              </Box>
            }
          >
            <Typography sx={{ fontSize: 13, color: 'og.gray' }}>
              {s.auto} filed automatically
              {s.manual ? ` · ${s.manual} by you` : ''} · {CK} to check · {U} need a folder
            </Typography>
          </Kpi>
          <Kpi label="Ready for FEMA" value={s.ready} color="og.good">
            <Box
              aria-hidden
              sx={{
                display: 'flex',
                gap: '3px',
                height: 6,
                mt: 1,
                '& i': { borderRadius: '2px', minWidth: 0 },
              }}
            >
              <Box component="i" sx={{ flex: s.ready, bgcolor: 'og.good' }} />
              <Box component="i" sx={{ flex: A, bgcolor: 'og.warn' }} />
              <Box component="i" sx={{ flex: C, bgcolor: 'og.risk' }} />
              <Box component="i" sx={{ flex: U, bgcolor: 'og.blue' }} />
            </Box>
          </Kpi>
          <Kpi label="Need your attention" value={N - s.ready} color="og.warn">
            <Typography sx={{ fontSize: 13, color: 'og.gray' }}>
              {A} review · {C} action · {U} need a folder
            </Typography>
          </Kpi>
          <Kpi label="Open findings" value={C + A} color={C ? 'og.risk' : A ? 'og.warn' : 'og.good'}>
            {C + A ? (
              <AnTag tone={C ? 'risk' : 'warn'} sx={{ alignSelf: 'flex-start' }}>
                {C} Critical · {A} Advisory
              </AnTag>
            ) : (
              <Typography sx={{ fontSize: 13, color: 'og.gray' }}>No rule issues in filed documents</Typography>
            )}
          </Kpi>
        </LiftCard>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.45fr) minmax(0,1fr)',
            gap: 6,
            alignItems: 'stretch',
            '@media (max-width:1100px)': {
              gridTemplateColumns: 'minmax(0,1fr)',
            },
          }}
        >
          <LiftCard component="section" aria-label="Costs at risk" sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardHead title="Findings that could cost you reimbursement">
              <AnTag tone={s.findings.length ? 'risk' : s.placed ? 'ok' : 'idle'}>{s.findings.length ? `${s.findings.length} open` : s.placed ? 'None' : 'Not checked'}</AnTag>
            </CardHead>
            <Box
              component="ol"
              sx={{
                m: 0,
                p: 0,
                listStyle: 'none',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {s.findings.length ? (
                s.findings.map((x, i) => (
                  <Box
                    component="li"
                    key={x.name}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '92px minmax(0,1fr) auto',
                      alignItems: 'center',
                      gap: 3.5,
                      px: 5,
                      py: 4.5,
                      borderBottom: 1,
                      borderColor: 'og.lineSoft',
                      ...(i === 0 && {
                        bgcolor: 'rgba(176,138,78,.07)',
                        boxShadow: 'inset 3px 0 0 #B08A4E',
                      }),
                      '@media (max-width:640px)': {
                        gridTemplateColumns: 'minmax(0,1fr)',
                        gap: 2,
                      },
                    }}
                  >
                    <AnTag
                      tone={x.finding!.sev === 'c' ? 'risk' : 'warn'}
                      sx={{
                        justifySelf: 'start',
                        fontSize: 10.5,
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {x.finding!.sev === 'c' ? 'Critical' : 'Advisory'}
                    </AnTag>
                    <Box sx={{ minWidth: 0 }}>
                      {i === 0 && (
                        <Typography
                          sx={{
                            mb: 1,
                            fontSize: 10.5,
                            fontWeight: 800,
                            letterSpacing: '.16em',
                            textTransform: 'uppercase',
                            color: '#A57F3C',
                          }}
                        >
                          ● Start here
                        </Typography>
                      )}
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'og.head',
                          lineHeight: 1.4,
                        }}
                      >
                        {x.finding!.text}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 12.5,
                          color: 'og.gray',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {x.name} · {x.finding!.rule}
                      </Typography>
                    </Box>
                    <Button component={RouterLink} to={x.finding!.href} size="small" variant={i === 0 ? 'contained' : 'outlined'} endIcon={Arrow} sx={{ justifySelf: 'start', whiteSpace: 'nowrap' }}>
                      {x.finding!.fix}
                    </Button>
                  </Box>
                ))
              ) : (
                <Box
                  component="li"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3.5,
                    px: 5,
                    py: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    sx={{
                      flex: 'none',
                      display: 'grid',
                      placeItems: 'center',
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      bgcolor: s.placed ? 'og.goodTint' : 'og.blueTint',
                      color: s.placed ? 'og.good' : 'og.blue',
                    }}
                  >
                    {s.placed ? <CheckIcon size={16} /> : <ClockIcon size={18} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: 'og.head' }}>{s.placed ? 'No rule issues found' : 'Not checked yet'}</Typography>
                    <Typography sx={{ mt: 1, fontSize: 13, color: 'og.gray' }}>
                      {s.placed ? `The ${plural(s.placed, 'filed document')} passed every check.` : 'Files are checked against FEMA rules once they are in a project. File them first, then the findings appear here.'}
                    </Typography>
                  </Box>
                  {!s.placed && U > 0 && (
                    <Button component={RouterLink} to={routes.inbox} variant="contained" size="small" endIcon={Arrow}>
                      Choose Folders for {plural(U, 'File')}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </LiftCard>

          <LiftCard component="section" aria-label="Documents needing attention" sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardHead title="Documents needing attention" />
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {A > 0 && <Attn n={A} tone="warn" title="Need review" text="Advisory findings to confirm before you submit." to={routes.review} label={`Review ${plural(A, 'Document')}`} />}
              {C > 0 && <Attn n={C} tone="risk" title="Action required" text="Critical findings that block reimbursement." to={routes.crossCheck} label={`Resolve ${C}`} />}
              {U > 0 && (
                <Attn n={U} tone="blue" title="Need a folder" text="AI was less than 60% sure where these belong. Choose a folder or remove them." to={routes.inbox} label={`Choose Folders for ${plural(U, 'File')}`} />
              )}
              {CK > 0 && <Attn n={CK} tone="warn" title="Check placement" text="Filed automatically, but AI was 60–84% sure. Confirm below when you have a moment." to="#your-files" label={`Confirm ${CK}`} />}
              {!(A || C || U || CK) && <Attn n={<CheckIcon size={14} />} tone="good" title="Nothing waiting" text="All documents are filed and checked." />}
            </Box>
          </LiftCard>
        </Box>

        {N > 0 && (
          <LiftCard component="section" id="your-files" aria-label="Your uploaded files" sx={{ scrollMarginTop: 72 }}>
            <CardHead title="Your uploaded files">
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Typography sx={{ fontSize: 13, color: 'og.gray' }}>
                  {s.auto} filed automatically
                  {s.manual ? ` · ${s.manual} filed by you` : ''} · {CK} to check · {U} need a folder
                  {removed ? ` · ${removed} removed` : ''}
                </Typography>
                {U > 0 && (
                  <Button component={RouterLink} to={routes.inbox} variant="contained" size="small" endIcon={Arrow}>
                    Choose Folders for {plural(U, 'File')}
                  </Button>
                )}
              </Box>
            </CardHead>
            <Box sx={{ px: 5, pb: 3 }}>
              {[...groups.keys()].sort().map((k) => {
                const [a, b] = k.split('|');
                const list = groups.get(k)!;
                return (
                  <Box key={k} component="ul" sx={{ m: 0, p: 0 }}>
                    <Box
                      component="li"
                      sx={{
                        listStyle: 'none',
                        display: 'flex',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: 2.5,
                        pt: 5,
                        pb: 2.5,
                        borderBottom: 1,
                        borderColor: 'og.line',
                        fontSize: 12.5,
                        color: 'og.gray',
                        '& b': { fontSize: 13.5, color: 'og.head' },
                      }}
                    >
                      {a === '~' ? (
                        <>
                          <b>Needs a folder</b>
                          <span>{b ? `${b} detected · no matching project` : 'AI was less than 60% sure'}</span>
                        </>
                      ) : (
                        <>
                          <b>
                            {b} · {projectNames[b] ?? ''}
                          </b>
                          <span>{a}</span>
                        </>
                      )}
                      <Box
                        component="em"
                        sx={{
                          ml: 'auto',
                          fontStyle: 'normal',
                          fontWeight: 700,
                        }}
                      >
                        {plural(list.length, 'file')}
                      </Box>
                    </Box>
                    {list.map((x) => (
                      <FileRow key={x.name} name={x.name} sub={`${x.kind}${x.why ? ` · ${x.why}` : ''}`}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            textAlign: 'right',
                            fontSize: 11.5,
                            lineHeight: 1.35,
                            color: 'og.gray',
                            '& b': { fontSize: 12.5, color: 'og.head' },
                            '@media (max-width:640px)': { display: 'none' },
                          }}
                        >
                          {x.placed ? (
                            <>
                              <b>{x.pw}</b>
                              {x.folder?.split(' › ').slice(1).join(' › ')}
                            </>
                          ) : (
                            <>
                              <b>Needs a folder</b>
                              {x.folder ? `AI suggests ${x.folder.split(' › ').slice(1).join(' › ')}` : 'No suggestion'}
                            </>
                          )}
                        </Box>
                        <AnTag tone={!x.placed ? 'idle' : x.finding ? x.tone : x.tier === 'check' ? 'warn' : 'ok'} title={`AI confidence ${x.conf}%`} sx={{ minWidth: 84 }}>
                          {!x.placed
                            ? `${x.conf}% sure`
                            : x.finding
                              ? x.finding.sev === 'c'
                                ? 'Critical'
                                : 'Advisory'
                              : x.tier === 'check'
                                ? `Check · ${x.conf}%`
                                : x.tier === 'manual'
                                  ? 'Filed by you'
                                  : `Auto · ${x.conf}%`}
                        </AnTag>
                        <Box
                          sx={{
                            width: 150,
                            display: 'flex',
                            '& > *': { flex: 1 },
                          }}
                        >
                          {!x.placed ? (
                            <Button component={RouterLink} to={inboxFor(x.name)} variant="contained" size="small" endIcon={Arrow}>
                              {x.folder ? 'Review Suggestion' : 'Choose Folder'}
                            </Button>
                          ) : x.finding ? (
                            <Button component={RouterLink} to={x.finding.href} variant="outlined" size="small" endIcon={Arrow}>
                              Fix
                            </Button>
                          ) : x.tier === 'check' ? (
                            <Button variant="outlined" size="small" onClick={() => confirm(x)}>
                              Confirm Folder
                            </Button>
                          ) : (
                            <Button component={RouterLink} to={libraryFor(x.name)} variant="outlined" size="small" endIcon={Arrow}>
                              View
                            </Button>
                          )}
                        </Box>
                      </FileRow>
                    ))}
                  </Box>
                );
              })}
            </Box>
          </LiftCard>
        )}
      </Box>
    </AppShell>
  );
}

function Attn({ n, tone, title, text, to, label }: { n: ReactNode; tone: 'warn' | 'risk' | 'blue' | 'good'; title: string; text: string; to?: string; label?: string }) {
  const c = {
    warn: ['og.warnTint', 'og.warn'],
    risk: ['og.riskTint', 'og.risk'],
    blue: ['og.blueTint', 'og.blue'],
    good: ['og.goodTint', 'og.good'],
  }[tone];
  return (
    <Box
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3.5,
        px: 5,
        py: 4,
        borderBottom: 1,
        borderColor: 'og.lineSoft',
        '&:last-of-type': { borderBottom: 0 },
        '@media (max-width:640px)': { flexWrap: 'wrap', '& > .attn-tx': { flexBasis: 'calc(100% - 50px)' }, '& > a': { ml: '48px' } },
      }}
    >
      <Box
        sx={{
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          width: 34,
          height: 34,
          borderRadius: '4px',
          bgcolor: c[0],
          color: c[1],
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        {n}
      </Box>
      <Box className="attn-tx" sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: 'og.head' }}>{title}</Typography>
        <Typography sx={{ mt: '2px', fontSize: 12.5, lineHeight: 1.5, color: 'og.gray' }}>{text}</Typography>
      </Box>
      {to && label && (
        <Button component={to.startsWith('#') ? 'a' : RouterLink} {...(to.startsWith('#') ? { href: to } : { to })} variant="outlined" size="small" endIcon={Arrow} sx={{ flex: 'none', whiteSpace: 'nowrap' }}>
          {label}
        </Button>
      )}
    </Box>
  );
}
