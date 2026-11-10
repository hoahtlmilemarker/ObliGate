import { Box, keyframes } from '@mui/material';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from './nav';

/**
 * Page-transition state. In the app this should follow real data loading;
 * here a short delay (TRANSITION_MS) mirrors the prototype's loading/skeleton behaviour.
 */
const TRANSITION_MS = 520;
const Ctx = createContext(false);
export const useRouteLoading = () => useContext(Ctx);

export function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pathname === routes.signIn) return;
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return (
    <Ctx.Provider value={loading}>
      <TopProgress active={loading} />
      {children}
    </Ctx.Provider>
  );
}

/** 2px gold progress bar at the very top during navigation. */
function TopProgress({ active }: { active: boolean }) {
  const [w, setW] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (active) {
      setVisible(true);
      setW(0);
      const r = requestAnimationFrame(() => setW(78));
      return () => cancelAnimationFrame(r);
    }
    if (!visible) return;
    setW(100);
    const t = window.setTimeout(() => {
      setVisible(false);
      setW(0);
    }, 420);
    return () => window.clearTimeout(t);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        height: 2,
        width: `${w}%`,
        opacity: visible ? 1 : 0,
        background: 'linear-gradient(90deg,#C9A45C,#E2C27E)',
        boxShadow: '0 0 8px rgba(201,164,92,.6)',
        transition: w === 0 ? 'none' : active ? 'width .5s cubic-bezier(.1,.7,.2,1)' : 'width .2s ease, opacity .3s .2s',
      }}
    />
  );
}

const shimmer = keyframes`0%{background-position:100% 0}100%{background-position:-100% 0}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
export const pageIn = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}`;

function Bar({ w, h = 10 }: { w: string | number; h?: number }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: 'block',
        width: w,
        height: h,
        flex: 'none',
        borderRadius: '4px',
        background: `linear-gradient(90deg, ${t.palette.og.lineSoft} 0%, ${t.palette.og.blueTint} 40%, ${t.palette.og.lineSoft} 80%)`,
        backgroundSize: '300% 100%',
        animation: `${shimmer} 1.1s ease-in-out infinite`,
      })}
    />
  );
}

/** Content skeleton shown over the main column while the next page loads (banner, KPI cards, table rows). */
export function PageSkeleton() {
  return (
    <Box
      aria-hidden
      sx={(t) => ({
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        p: { xs: '16px', md: '24px 28px' },
        bgcolor: t.palette.mode === 'dark' ? '#0E151D' : t.palette.og.pale,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        overflow: 'hidden',
        animation: `${fadeIn} .16s ease-out`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none', '& *': { animation: 'none !important' } },
      })}
    >
      <Box sx={{ height: 200, borderRadius: '4px', p: 7, display: 'flex', flexDirection: 'column', gap: 3, background: 'linear-gradient(90deg,#0B2A47 0%,#123A60 45%,#0B2A47 85%)', backgroundSize: '300% 100%', animation: `${shimmer} 1.4s ease-in-out infinite` }}>
        {[['22%', 9], ['46%', 26], ['58%', 12], ['40%', 12]].map(([w, h], i) => (
          <Box key={i} component="i" sx={{ display: 'block', width: w, height: h, borderRadius: '4px', bgcolor: 'rgba(255,255,255,.12)' }} />
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} sx={{ height: 96, border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', p: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Bar w="46%" h={9} />
            <Bar w="70%" h={22} />
            <Bar w="54%" h={9} />
          </Box>
        ))}
      </Box>
      <Box sx={{ border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', px: 5, py: 2 }}>
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 4, height: 56, borderBottom: j < 5 ? 1 : 0, borderColor: 'og.lineSoft' }}>
            <Bar w={36} h={40} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.75, minWidth: 0 }}>
              <Bar w={`${50 + ((j * 6) % 30)}%`} h={11} />
              <Bar w="34%" h={9} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Bar w={90} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Bar w={110} h={20} />
            </Box>
            <Bar w={76} h={28} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
