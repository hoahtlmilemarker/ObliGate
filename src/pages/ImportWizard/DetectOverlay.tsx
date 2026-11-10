import { Box, keyframes } from '@mui/material';
import { useEffect, useState } from 'react';
import { detectSteps } from '@/data/importWizard';

const spin = keyframes`to{transform:rotate(360deg)}`;
const pop = keyframes`0%{transform:scale(.6)}100%{transform:scale(1)}`;
const pulse = keyframes`0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.8);opacity:.75}`;

const STEP_MS = 620;

/**
 * "Step 1 · Detect Structure" progress overlay shown when the wizard opens with `#detect`.
 * Steps tick every 620ms, then the overlay fades out and calls `onDone`.
 */
export function DetectOverlay({ fileName, onDone }: { fileName: string; onDone: () => void }) {
  const [k, setK] = useState(0); // number of steps started
  const [out, setOut] = useState(false);
  const total = detectSteps.length;

  useEffect(() => {
    if (k < total) {
      const t = window.setTimeout(() => setK((x) => x + 1), k === 0 ? 0 : STEP_MS);
      return () => window.clearTimeout(t);
    }
    const t1 = window.setTimeout(() => setOut(true), STEP_MS + 350);
    const t2 = window.setTimeout(onDone, STEP_MS + 350 + 380);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [k, total, onDone]);

  // step i is done when a later step has started (or all finished after the last tick)
  const [allDone, setAllDone] = useState(false);
  useEffect(() => {
    if (k !== total) return;
    const t = window.setTimeout(() => setAllDone(true), STEP_MS);
    return () => window.clearTimeout(t);
  }, [k, total]);

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 'modal',
        display: 'grid',
        placeItems: 'center',
        p: 4,
        bgcolor: 'rgba(4,20,36,.5)',
        backdropFilter: 'blur(2px)',
        transition: 'opacity .35s',
        opacity: out ? 0 : 1,
      }}
    >
      <Box sx={(t) => ({ width: 'min(460px, 100%)', p: '22px 24px', border: `1px solid ${t.palette.og.line}`, borderTop: '2px solid #B08A4E', borderRadius: '4px', bgcolor: t.palette.og.card, boxShadow: '0 16px 40px -16px rgba(0,20,40,.22)' })}>
        <Box component="small" sx={{ display: 'block', font: '700 10.5px/1 Manrope, Arial, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A57F3C', mb: 2 }}>
          Step 1 · Detect Structure
        </Box>
        <Box component="h3" sx={{ m: '0 0 4px', font: '600 18px/1.3 Manrope, Arial, sans-serif', color: 'og.head', wordBreak: 'break-all' }}>
          {fileName}
        </Box>
        <Box sx={{ height: 3, my: '14px', mb: 4, borderRadius: '2px', bgcolor: 'og.lineSoft', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${(k / total) * 100}%`, background: 'linear-gradient(90deg,#C9A45C,#E2C27E)', transition: 'width .5s ease' }} />
        </Box>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column' }}>
          {detectSteps.map((s, i) => {
            const ok = i < k - 1 || (allDone && i === total - 1);
            const on = !ok && i === k - 1;
            return (
              <Box
                component="li"
                key={s}
                sx={(t) => ({
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  minHeight: 34,
                  fontSize: 13.5,
                  color: on ? t.palette.og.head : ok ? t.palette.og.ink : t.palette.og.gray,
                  fontWeight: on ? 600 : 400,
                  opacity: on || ok ? 1 : 0.55,
                  transition: 'opacity .25s, color .25s',
                  ...(i > 0 && {
                    '&::before': { content: '""', position: 'absolute', left: 10, top: -11, width: 2, height: 22, borderRadius: '2px', background: i - 1 < k - 1 ? `linear-gradient(180deg,#2E9E62,${t.palette.og.line})` : t.palette.og.line },
                  }),
                })}
              >
                <Box
                  component="i"
                  sx={(t) => ({
                    position: 'relative',
                    zIndex: 1,
                    flex: 'none',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    ...(ok
                      ? {
                          background: 'linear-gradient(145deg,#3DBE78 0%,#1A7F49 100%)',
                          boxShadow: '0 2px 6px -1px rgba(26,127,73,.45), inset 0 1px 0 rgba(255,255,255,.35)',
                          animation: `${pop} .32s cubic-bezier(.2,1.4,.4,1)`,
                          display: 'grid',
                          placeItems: 'center',
                        }
                      : on
                        ? {
                            background: 'conic-gradient(from 0deg,rgba(201,164,92,0) 0deg,#C9A45C 200deg,#E2C27E 300deg,rgba(201,164,92,0) 360deg)',
                            animation: `${spin} .9s linear infinite`,
                            WebkitMask: 'radial-gradient(circle,transparent 7.5px,#000 8px)',
                            mask: 'radial-gradient(circle,transparent 7.5px,#000 8px)',
                          }
                        : { border: `1.5px dashed ${t.palette.og.line}`, bgcolor: t.palette.og.card }),
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                  })}
                >
                  {ok && (
                    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                      <path d="M6.6 11.3 9.6 14.2 15.4 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Box>
                {on && (
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ position: 'absolute', left: 8, top: '50%', width: 6, height: 6, mt: '-3px', borderRadius: '50%', bgcolor: '#C9A45C', boxShadow: '0 0 0 4px rgba(201,164,92,.2)', animation: `${pulse} 1.2s ease-in-out infinite`, zIndex: 2 }}
                  />
                )}
                {s}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
