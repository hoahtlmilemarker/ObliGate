import { Box, IconButton, Slide, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircleIcon, CloseIcon, InfoIcon, WarningIcon } from '@/icons';

type ToastTone = 'success' | 'info' | 'warning';
interface ToastOptions {
  title: string;
  message?: ReactNode;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void };
  duration?: number;
  /** Render `title message` without the ' · ' separator (copy that reads as one sentence). */
  inline?: boolean;
}

const Ctx = createContext<(o: ToastOptions) => void>(() => {});

/** Global toast (navy card with brass top rule, bottom-right). Use `const toast = useToast(); toast({ title })`. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(ToastOptions & { key: number }) | null>(null);
  const [open, setOpen] = useState(false);
  const show = useCallback((o: ToastOptions) => {
    setState({ ...o, key: Date.now() });
    setOpen(true);
  }, []);
  const icon = state?.tone === 'warning' ? <WarningIcon size={18} /> : state?.tone === 'info' ? <InfoIcon size={18} /> : <CheckCircleIcon size={18} />;
  const iconColor = state?.tone === 'warning' ? '#F0A564' : state?.tone === 'info' ? '#86C0EE' : '#5CC08C';

  return (
    <Ctx.Provider value={show}>
      {children}
      <Snackbar
        key={state?.key}
        open={open}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        autoHideDuration={state?.duration ?? 4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slots={{ transition: Slide }}
        slotProps={{ transition: { direction: 'up' } as never }}
      >
        <Box
          role="status"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3.5,
            maxWidth: 'min(460px, calc(100vw - 32px))',
            p: '14px 12px 14px 18px',
            bgcolor: '#06243F',
            color: '#FFFFFF',
            borderTop: '2px solid #B08A4E',
            borderRadius: '4px',
            boxShadow: '0 14px 32px -14px rgba(0,20,40,.35)',
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          <Box sx={{ color: iconColor, display: 'flex', flex: 'none' }}>{icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <b>{state?.title}</b>
            {state?.message && <>{state.inline ? ' ' : ' · '}{state.inline ? <Box component="span" sx={{ fontWeight: 500 }}>{state.message}</Box> : state.message}</>}
          </Box>
          {state?.action && (
            <Box
              component="button"
              type="button"
              onClick={() => {
                state.action?.onClick();
                setOpen(false);
              }}
              sx={{ flex: 'none', px: 3, py: '7px', border: '1px solid rgba(255,255,255,.35)', borderRadius: '4px', bgcolor: 'transparent', color: '#FFFFFF', font: '700 12.5px Manrope, Arial, sans-serif', cursor: 'pointer', '&:hover': { borderColor: '#FFFFFF' } }}
            >
              {state.action.label}
            </Box>
          )}
          <IconButton aria-label="Dismiss" size="small" onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,.6)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.08)' } }}>
            <CloseIcon size={14} />
          </IconButton>
        </Box>
      </Snackbar>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
