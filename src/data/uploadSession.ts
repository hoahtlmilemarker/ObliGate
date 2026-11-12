/**
 * Prototype-only store for the upload flow (sessionStorage + localStorage), same keys as the HTML prototype.
 * In the real app this is server state: the upload batch, its classification results and the upload history.
 *
 *   og-up          current batch [{n, s}]                       (session)
 *   og-up-fix      file → folder chosen in the inbox, or '__removed' (session)
 *   og-up-conf     file → 1 when "Check placement" was confirmed  (session)
 *   og-up-restore  '1' → upload screen restores the batch after Cancel Analysis (session)
 *   og-up-hist     every file uploaded before [{n, s, t}] → duplicate detection (local, last 500)
 */
import { classify, type Classified } from './classify';

export interface RawFile {
  n: string;
  s: number;
}
export interface HistFile extends RawFile {
  t: string;
}

function read<T>(store: Storage, key: string, fallback: T): T {
  try {
    const v = store.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(store: Storage, key: string, v: unknown) {
  try {
    store.setItem(key, JSON.stringify(v));
  } catch {
    /* private mode / quota: the flow still works for this page view */
  }
}

/** Shown when nobody has uploaded in this session (opening /analyzing or /analysis-report directly). Sample data. */
export const DEMO_BATCH: RawFile[] = [
  'Timesheet_Aguayo_PayPeriod_02.pdf',
  'Timesheet_Delgado_PayPeriod_02.pdf',
  'SupervisorLog_Jan14-16_Unsigned.pdf',
  'EquipLog_CAT320_EQ-PW-109_Jan.pdf',
  'Receipt_HomeDepot_PW-00429.pdf',
  'scan_0042.pdf',
  'IMG_2231.jpg',
  'Invoice_DR-4699_Grading.pdf',
].map((n, i) => ({ n, s: 120000 + i * 5000 }));

export const getStoredBatch = () => read<RawFile[]>(sessionStorage, 'og-up', []);
export const getBatch = () => {
  const b = getStoredBatch();
  return b.length ? b : DEMO_BATCH;
};
export const isDemoBatch = () => !getStoredBatch().length;
export const getHistory = () => read<HistFile[]>(localStorage, 'og-up-hist', []);

/** Start Analysis: save the batch and add it to the upload history. */
export function startBatch(files: RawFile[]) {
  write(sessionStorage, 'og-up', files);
  sessionStorage.removeItem('og-up-fix');
  sessionStorage.removeItem('og-up-conf');
  const t = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  let h = getHistory().filter((x) => !files.some((f) => f.n === x.n && f.s === x.s));
  h = [...h, ...files.map((f) => ({ ...f, t }))].slice(-500);
  write(localStorage, 'og-up-hist', h);
}

/** Cancel Analysis: forget the batch in the history so re-adding it is not flagged as duplicate. */
export function cancelBatch() {
  const b = getStoredBatch();
  write(
    localStorage,
    'og-up-hist',
    getHistory().filter((h) => !b.some((u) => u.n === h.n && u.s === h.s)),
  );
  sessionStorage.setItem('og-up-restore', '1');
}

/** Upload screen: returns the batch once after a cancel, else null. */
export function takeRestore(): RawFile[] | null {
  if (!sessionStorage.getItem('og-up-restore')) return null;
  sessionStorage.removeItem('og-up-restore');
  return getStoredBatch();
}

/** Inbox: file placed by hand ('__removed' when deleted). */
export function setFix(name: string, folder: string | '__removed') {
  write(sessionStorage, 'og-up-fix', {
    ...read<Record<string, string>>(sessionStorage, 'og-up-fix', {}),
    [name]: folder,
  });
}
/** Library / report: "Check placement" confirmed. */
export function confirmPlacement(name: string) {
  write(sessionStorage, 'og-up-conf', {
    ...read<Record<string, number>>(sessionStorage, 'og-up-conf', {}),
    [name]: 1,
  });
}

/** The batch with the AI result plus the user's own corrections applied. */
export function getResults(): { files: Classified[]; removed: number } {
  const fix = read<Record<string, string>>(sessionStorage, 'og-up-fix', {});
  const conf = read<Record<string, number>>(sessionStorage, 'og-up-conf', {});
  let removed = 0;
  const files: Classified[] = [];
  for (const r of getBatch()) {
    const o = classify(r.n, r.s);
    const fx = fix[r.n];
    if (fx === '__removed') {
      removed++;
      continue;
    }
    if (fx)
      Object.assign(o, {
        placed: true,
        tier: 'manual',
        folder: fx,
        pw: fx.split(' › ')[0],
        dr: 'DR-4683-CA',
        tag: `Filed · ${fx.split(' › ')[0]}`,
        tone: 'ok',
        why: '',
      });
    else if (conf[r.n] && o.tier === 'check') o.tier = 'manual';
    files.push(o);
  }
  return { files, removed };
}
