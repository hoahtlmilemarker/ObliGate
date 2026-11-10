import { useEffect } from 'react';

/** Minimum time the first-visit brand loader (inline in index.html) stays on screen. */
const MIN_MS = 1100;

/** Fades out the boot loader rendered by index.html once the app has mounted. */
export function BootLoaderDone() {
  useEffect(() => {
    const el = document.getElementById('og-boot');
    if (!el) return;
    const started = Number(el.dataset.t || performance.now());
    const wait = Math.max(0, MIN_MS - (performance.now() - started));
    const t = window.setTimeout(() => {
      el.classList.add('out');
      window.setTimeout(() => el.remove(), 500);
    }, wait);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
