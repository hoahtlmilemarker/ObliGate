import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createOgTheme } from './index';
import type { OgMode } from './tokens';

interface ColorModeCtx {
  mode: OgMode;
  toggle: () => void;
  setMode: (m: OgMode) => void;
}

const Ctx = createContext<ColorModeCtx | null>(null);
const STORAGE_KEY = 'og-theme';

function readInitial(): OgMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* storage unavailable */
  }
  return 'light';
}

/** Provides the MUI theme and a persisted Light/Dark toggle (`useColorMode()`). */
export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<OgMode>(readInitial);
  const theme = useMemo(() => createOgTheme(mode), [mode]);
  const toggle = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle]);
  return (
    <Ctx.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
}

export function useColorMode() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useColorMode must be used inside <ColorModeProvider>');
  return v;
}
