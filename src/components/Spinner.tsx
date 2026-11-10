import { Box, keyframes } from '@mui/material';

const spinO = keyframes`to{transform:rotate(360deg)}`;
const spinI = keyframes`to{transform:rotate(-360deg)}`;
const dashO = keyframes`0%,100%{stroke-dasharray:85 200}50%{stroke-dasharray:30 200}`;
const dashI = keyframes`0%,100%{stroke-dasharray:57 200}50%{stroke-dasharray:18 200}`;
const pulse = keyframes`0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.72) rotate(45deg)}`;

/** Brand loader (orbiting seal) — matches the prototype's loading screen. */
export function Spinner({ size = 48 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      fill="none"
      role="status"
      aria-label="Loading"
      sx={{
        width: size,
        height: size,
        overflow: 'visible',
        color: (t) => (t.palette.mode === 'dark' ? '#E2C27E' : '#0B3A66'),
        '& .o, & .i, & .c': { transformBox: 'view-box', transformOrigin: '24px 24px' },
        '& .o': { animation: `${spinO} 1.6s cubic-bezier(.55,.1,.45,.9) infinite` },
        '& .i': { animation: `${spinI} 1.1s cubic-bezier(.55,.1,.45,.9) infinite` },
        '& .o path': { strokeDasharray: '85 200', animation: `${dashO} 1.6s ease-in-out infinite` },
        '& .i path': { strokeDasharray: '57 200', animation: `${dashI} 1.1s ease-in-out infinite`, stroke: '#C9A45C' },
        '& .c': { animation: `${pulse} 1.6s ease-in-out infinite` },
        '@media (prefers-reduced-motion: reduce)': { '& *': { animation: 'none !important' } },
      }}
    >
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.2" opacity=".1" />
      <g className="o">
        <path d="M 24 6 A 18 18 0 1 1 6 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
      </g>
      <g className="i">
        <path d="M 36 24 A 12 12 0 1 1 24 12" strokeWidth="1.7" strokeLinecap="round" />
      </g>
      <rect className="c" x="19" y="19" width="10" height="10" rx="1.5" fill="currentColor" />
    </Box>
  );
}

/** Full-area loading state with caption. */
export function PageLoader({ caption = 'Loading workspace' }: { caption?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, py: 20 }}>
      <Spinner size={56} />
      <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'og.gray' }}>{caption}</Box>
    </Box>
  );
}
