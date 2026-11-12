import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { CheckIcon } from '@/icons';
import { fileType, type Tone } from '@/data/classify';

const BADGE: Record<string, [string, string]> = {
  pdf: ['#B4473A', 'rgba(180,71,58,.10)'],
  xls: ['#2E7D4F', 'rgba(46,125,79,.10)'],
  img: ['#1F5D97', 'rgba(31,93,151,.10)'],
  doc: ['#5B6B7A', 'rgba(91,107,122,.10)'],
};

/** 34px square file-type badge (PDF / XLSX / JPG). */
export function FtBadge({ name }: { name: string }) {
  const { label } = fileType(name);
  const k = label === 'PDF' ? 'pdf' : /^(XLSX|XLS|CSV)$/.test(label) ? 'xls' : /^(JPG|PNG|HEIC)$/.test(label) ? 'img' : 'doc';
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        width: 34,
        height: 34,
        borderRadius: '4px',
        bgcolor: BADGE[k][1],
        color: BADGE[k][0],
        fontSize: 9.5,
        fontWeight: 800,
        letterSpacing: '.04em',
      }}
    >
      {label}
    </Box>
  );
}

const TONE: Record<Tone | 'run', (t: Theme) => { bg: string; fg: string }> = {
  ok: (t) => ({ bg: t.palette.og.goodTint, fg: t.palette.og.good }),
  warn: (t) => ({ bg: t.palette.og.warnTint, fg: t.palette.og.warn }),
  risk: (t) => ({ bg: t.palette.og.riskTint, fg: t.palette.og.risk }),
  idle: (t) => ({ bg: t.palette.og.pale, fg: t.palette.og.gray }),
  run: (t) => ({ bg: t.palette.og.blueTint, fg: t.palette.og.blue }),
};

/** Small status pill on file rows ("Ready", "Waiting", "1 critical finding", "Auto · 93%"). */
export function AnTag({ tone, children, title, sx }: { tone: Tone | 'run'; children: ReactNode; title?: string; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      title={title}
      sx={[
        (t) => ({
          flex: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 24,
          px: '9px',
          borderRadius: '4px',
          bgcolor: TONE[tone](t).bg,
          color: TONE[tone](t).fg,
          fontSize: 11.5,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/** One file line: badge · name + sub line · right side (tags, buttons). */
export function FileRow({ name, sub, children, highlight }: { name: string; sub: ReactNode; children?: ReactNode; highlight?: boolean }) {
  return (
    <Box
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        py: 3,
        borderBottom: 1,
        borderColor: 'og.lineSoft',
        listStyle: 'none',
        ...(highlight && {
          animation: 'upFlash 1.4s ease-out',
          '@keyframes upFlash': {
            from: { backgroundColor: 'rgba(176,138,78,.18)' },
            to: { backgroundColor: 'transparent' },
          },
        }),
        '@media (max-width:640px)': {
          flexWrap: 'wrap',
          '& > .row-right': {
            width: '100%',
            justifyContent: 'flex-start',
            pl: '46px',
          },
        },
      }}
    >
      <FtBadge name={name} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          title={name}
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: 'og.head',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>
        <Typography component="div" sx={{ mt: '2px', fontSize: 12.5, color: 'og.gray', lineHeight: 1.45 }}>
          {sub}
        </Typography>
      </Box>
      {children && (
        <Box className="row-right" sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 'none' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

/** Card header row: light 20px title + right slot. */
export function CardHead({ title, children, sx }: { title: ReactNode; children?: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
          px: 5,
          py: 4,
          borderBottom: 1,
          borderColor: 'og.line',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography component="h2" variant="h2">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export type StepState = 'todo' | 'run' | 'done';
export interface Step {
  title: string;
  text: ReactNode;
  state?: StepState;
}

/** Numbered vertical steps ("What happens next" / "Steps"). */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <Box component="ol" sx={{ m: 0, p: '20px 20px 4px', listStyle: 'none' }}>
      {steps.map((s, i) => {
        const st = s.state ?? 'todo';
        return (
          <Box
            component="li"
            key={s.title}
            aria-current={st === 'run' ? 'step' : undefined}
            sx={{
              position: 'relative',
              display: 'flex',
              gap: 3.5,
              pb: 5,
              '&:not(:last-of-type)::before': {
                content: '""',
                position: 'absolute',
                left: 14,
                top: 32,
                bottom: 2,
                width: '1px',
                bgcolor: st === 'done' ? 'og.good' : 'og.line',
              },
            }}
          >
            <Box
              component="span"
              sx={(t) => ({
                flex: 'none',
                display: 'grid',
                placeItems: 'center',
                width: 29,
                height: 29,
                borderRadius: '50%',
                fontSize: 12,
                fontWeight: 700,
                ...(st === 'done'
                  ? { bgcolor: t.palette.og.good, color: '#fff' }
                  : st === 'run'
                    ? {
                        border: `2px solid ${t.palette.og.blue}`,
                        color: t.palette.og.blue,
                        bgcolor: t.palette.og.card,
                        boxShadow: `0 0 0 4px ${t.palette.og.blueTint}`,
                      }
                    : {
                        border: `1px solid ${t.palette.og.line}`,
                        color: t.palette.og.gray,
                        bgcolor: t.palette.og.card,
                      }),
              })}
            >
              {st === 'done' ? <CheckIcon size={14} /> : i + 1}
            </Box>
            <Box sx={{ minWidth: 0, pt: '3px' }}>
              <Typography
                sx={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: st === 'todo' && s.state ? 'og.ink' : 'og.head',
                }}
              >
                {s.title}
              </Typography>
              <Typography component="div" sx={{ mt: 1, fontSize: 13, lineHeight: 1.55, color: 'og.gray' }}>
                {s.text}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/** Two-column page body pulled over the masthead: main card + 420px side card. */
export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        mt: '-52px',
        px: { xs: 4, sm: 7 },
        pb: 10,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(300px,0.66fr)',
        gap: 6,
        alignItems: 'start',
        '@media (max-width:1100px)': { gridTemplateColumns: 'minmax(0,1fr)' },
      }}
    >
      {children}
    </Box>
  );
}
