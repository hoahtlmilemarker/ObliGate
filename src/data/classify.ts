/**
 * Upload → Analysis → Report — simulated AI read (prototype pages 12–14).
 *
 * SAMPLE LOGIC ONLY: the prototype decides document type, project and findings from the FILE NAME.
 * Replace `classify()` with the real classification API, but keep the result shape and the tiers:
 *   auto  ≥ 85% → filed automatically
 *   check 60–84% → filed, "Check placement"
 *   inbox < 60% → not filed, "Needs a folder" (Unplaced Inbox)
 */
import { routes } from '@/layout/nav';

export type Tier = 'auto' | 'check' | 'inbox' | 'manual';
export type Tone = 'ok' | 'warn' | 'risk' | 'idle';

export interface Finding {
  /** c = critical (blocks reimbursement), a = advisory. */
  sev: 'c' | 'a';
  text: string;
  rule: string;
  fix: string;
  href: string;
}

export interface Classified {
  name: string;
  size: number;
  kind: string;
  /** Filed into a project folder (auto, check or manual). */
  placed: boolean;
  tier: Tier;
  /** AI confidence 0–100. */
  conf: number;
  /** "PW-00428 › 1. Force-Account Labor" — for inbox files, the (low-confidence) suggestion. */
  folder: string | null;
  finding: Finding | null;
  /** Why AI was unsure ('' when filed automatically). */
  why: string;
  /** Short status shown while the analysis runs. */
  tag: string;
  tone: Tone;
  dr: string;
  pw: string | null;
}

export const HOME_DR = 'DR-4683-CA';
const F1 = 'PW-00428 › 1. Force-Account Labor';
const F2 = 'PW-00428 › 2. Equipment Records';
const F3 = 'PW-00428 › 3. Contracts & Procurement';
const F4 = 'PW-00428 › 4. Materials & Supplies';
const RULE = 'PAPPG v4.0 Ch. 2 § II.B';

export const projectNames: Record<string, string> = {
  'PW-00428': 'Malibu Canyon',
  'PW-00429': 'Topanga Creek Debris',
  'PW-00430': 'Las Virgenes Road Slope Repair',
  'PW-00431': 'Emergency Protective Measures',
  'PW-00432': 'EOC Activation',
  'PW-00433': 'Big Tujunga Canyon Road Washout',
  'PW-00434': 'Pacific Coast Hwy Storm Drain Clearing',
  'PW-00435': 'Sepulveda Basin Debris Removal',
  'PW-00436': 'San Gabriel Canyon Road Culvert',
  'PW-00437': 'Swift-Water Rescue Operations',
  'PW-00438': 'Zuma Beach Parking Lot Repair',
  'PW-00439': 'Marina del Rey Breakwater Debris',
};

/** The 14 sample files shipped in prototype-src/test-files (they match the Cross-Check data). */
const KNOWN: Record<string, [kind: string, folder: 1 | 2, finding: Finding | null]> = {
  'Timesheet_Aguayo_PayPeriod_02.pdf': [
    'Force-Account Timesheet',
    1,
    {
      sev: 'c',
      text: '8.0 OT hours claimed on Jan 12; the field log supports 4.0 ($325.20)',
      rule: RULE,
      fix: 'Resolve in Cross-Check',
      href: routes.crossCheck,
    },
  ],
  'Timesheet_Delgado_PayPeriod_02.pdf': [
    'Force-Account Timesheet',
    1,
    {
      sev: 'c',
      text: '40.0 hours claimed with no matching daily field log',
      rule: RULE,
      fix: 'Request Attestation',
      href: routes.signature,
    },
  ],
  'Timesheet_Chen_PayPeriod_02.pdf': ['Force-Account Timesheet', 1, null],
  'Timesheet_Santos_PayPeriod_02.pdf': ['Force-Account Timesheet', 1, null],
  'Timesheet_Aguayo_PayPeriod_01.pdf': ['Force-Account Timesheet', 1, null],
  'SupervisorLog_Jan14-16_Unsigned.pdf': [
    'Supervisor Field Log',
    1,
    {
      sev: 'c',
      text: 'Field log is not signed by the supervisor',
      rule: RULE,
      fix: 'Request Signature',
      href: routes.signature,
    },
  ],
  'ActivityLog_PW00428_Jan12_Crew3.pdf': ['Daily Activity Log', 1, null],
  'ActivityLog_PW00428_Jan10_Crew3.pdf': ['Daily Activity Log', 1, null],
  'ActivityLog_PW00428_Jan13_Crew3.pdf': [
    'Daily Activity Log',
    1,
    {
      sev: 'a',
      text: 'One crew sign-out time is illegible; hours assumed from the 8-hour shift',
      rule: 'Data review',
      fix: 'Review',
      href: routes.review,
    },
  ],
  'EquipLog_CAT320_EQ-PW-109_Jan.pdf': ['Equipment Usage Log', 2, null],
  'eCAPS_Labor_Export_F7060865.xlsx': ['DeRS Baseline Export', 1, null],
  'eCAPS_Labor_Export_PP01.xlsx': ['DeRS Baseline Export', 1, null],
  'FieldPhoto_MalibuCyn_PM5.1_Jan12.jpg': ['Site photo', 1, null],
  'FieldPhoto_MalibuCyn_Jan09.jpg': ['Site photo', 1, null],
};

export const ext = (n: string) => (n.split('.').pop() || '').toLowerCase();

/** Badge label + generic kind for a file name. */
export function fileType(n: string): { label: string; kind: string } {
  const e = ext(n);
  if (e === 'pdf') return { label: 'PDF', kind: 'PDF document' };
  if (/^(xlsx|xls|csv)$/.test(e)) return { label: e.toUpperCase(), kind: 'Spreadsheet' };
  if (/^(jpg|jpeg|png|heic)$/.test(e)) return { label: e === 'jpeg' ? 'JPG' : e.toUpperCase(), kind: 'Photo' };
  return { label: (e || 'FILE').slice(0, 4).toUpperCase(), kind: 'Document' };
}

export const fileSize = (b: number) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** Stable pseudo-random 0–9972 from the name, so the same file always gets the same confidence. */
function hash(s: string) {
  let x = 7;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 9973;
  return x;
}

function tagFor(placed: boolean, tier: Tier, f: Finding | null, pw: string | null): [string, Tone] {
  if (!placed) return ['Needs a folder', 'idle'];
  if (f) return [f.sev === 'c' ? '1 critical finding' : '1 advisory', f.sev === 'c' ? 'risk' : 'warn'];
  if (tier === 'check') return ['Check placement', 'warn'];
  return [`Filed · ${pw ?? 'PW-00428'}`, 'ok'];
}

export function classify(name: string, size = 0): Classified {
  const known = KNOWN[name.replace(/\s*\(\d+\)(?=\.\w+$)/, '')];
  if (known) {
    const [kind, fd, f] = known;
    const [tag, tone] = tagFor(true, 'auto', f, 'PW-00428');
    return {
      name,
      size,
      kind,
      placed: true,
      tier: 'auto',
      conf: 90 + (hash(name) % 9),
      folder: fd === 2 ? F2 : F1,
      finding: f,
      why: '',
      tag,
      tone,
      dr: HOME_DR,
      pw: 'PW-00428',
    };
  }

  const e = ext(name);
  const img = /^(jpg|jpeg|png|heic)$/.test(e);
  const sheet = /^(xlsx|xls|csv)$/.test(e);
  const r = hash(name);
  let kind: string;
  let lv = 0;
  let folder: string | null = null;
  let f: Finding | null = null;
  let why = '';

  if (/time.?sheet|time.?card/i.test(name)) {
    kind = 'Force-Account Timesheet';
    lv = 3;
    folder = F1;
    f = {
      sev: 'c',
      text: 'No supervisor signature on timesheet',
      rule: RULE,
      fix: 'Resolve in Cross-Check',
      href: routes.crossCheck,
    };
  } else if (/activity|daily.?log|field.?log|supervisor/i.test(name)) {
    kind = 'Daily Activity Log';
    lv = 3;
    folder = F1;
    if (/unsigned/i.test(name))
      f = {
        sev: 'c',
        text: 'Field log is not signed',
        rule: RULE,
        fix: 'Request Signature',
        href: routes.signature,
      };
  } else if (sheet && /payroll|ecaps|labor|ders|hours/i.test(name)) {
    kind = 'Payroll export';
    lv = 3;
    folder = F1;
    f = {
      sev: 'a',
      text: 'Payroll hours not yet matched to field logs',
      rule: 'PAPPG v4.0 Ch. 2 § II.B.1',
      fix: 'Open in Cross-Check',
      href: routes.crossCheck,
    };
  } else if (/equip|eq-pw|cat\d/i.test(name)) {
    kind = 'Equipment log';
    lv = 3;
    folder = F2;
  } else if (/invoice|contract|rfp|quote/i.test(name)) {
    kind = 'Contract or invoice';
    lv = 3;
    folder = F3;
    f = {
      sev: 'a',
      text: 'Procurement record not attached',
      rule: '2 CFR § 200.318',
      fix: 'Open in Pre-Submission',
      href: routes.preSubmission,
    };
  } else if (/receipt|scan|pw-?\d|dr-?\d|malibu|topanga/i.test(name)) {
    const receipt = /receipt/i.test(name);
    kind = receipt ? 'Receipt' : img ? 'Site photo' : sheet ? 'Spreadsheet' : 'Supporting document';
    lv = 2;
    folder = receipt ? F4 : img ? F2 : F1;
    why = 'Project reference found, but the document type is uncertain';
  } else if (img) {
    kind = 'Photo';
    lv = 1;
    folder = F2;
    why = 'Photo has no location or date to confirm the project';
  } else {
    kind = sheet ? 'Spreadsheet' : 'Document';
    why = 'No DR number, project or date found';
  }

  // A PW number in the name moves the file to that project.
  const mp = name.match(/PW[-_ ]?0*(4[23]\d)(?!\d)/i);
  const pwRef = mp && projectNames[`PW-00${mp[1]}`] ? `PW-00${mp[1]}` : null;
  if (pwRef) {
    if (folder) folder = folder.replace('PW-00428', pwRef);
    else {
      folder = `${pwRef} › 1. Force-Account Labor`;
      lv = 2;
      kind = img ? 'Site photo' : sheet ? 'Spreadsheet' : 'Supporting document';
      why = `Project ${pwRef} found in the file, but the document type is uncertain`;
    }
  }
  // A different DR number → nothing in the portfolio matches yet.
  const md = name.match(/DR[-_ ]?(4\d{3})/i);
  let dr = HOME_DR;
  if (md && md[1] !== '4683') {
    dr = `DR-${md[1]}-CA`;
    lv = 0;
    folder = null;
    f = null;
    why = `Belongs to ${dr}, which has no matching project in your portfolio yet`;
  }

  const conf = lv === 3 ? 86 + (r % 12) : lv === 2 ? 62 + (r % 20) : lv === 1 ? 41 + (r % 17) : 12 + (r % 22);
  const tier: Tier = lv === 3 ? 'auto' : lv === 2 ? 'check' : 'inbox';
  const placed = tier !== 'inbox';
  const pw = folder ? folder.split(' › ')[0] : null;
  const [tag, tone] = tagFor(placed, tier, f, pw);
  return {
    name,
    size,
    kind,
    placed,
    tier,
    conf,
    folder,
    finding: f,
    why,
    tag,
    tone,
    dr,
    pw,
  };
}

/** Counts used by the running page, the report and the inbox note. */
export function summarize(files: Classified[]) {
  const placed = files.filter((x) => x.placed);
  const findings = files.filter((x) => x.finding).sort((a, b) => (a.finding!.sev === 'c' ? 0 : 1) - (b.finding!.sev === 'c' ? 0 : 1));
  const critical = findings.filter((x) => x.finding!.sev === 'c').length;
  const projects = [...new Set(placed.map((x) => x.pw).filter(Boolean))] as string[];
  return {
    total: files.length,
    placed: placed.length,
    unplaced: files.length - placed.length,
    auto: files.filter((x) => x.tier === 'auto').length,
    manual: files.filter((x) => x.tier === 'manual').length,
    check: files.filter((x) => x.tier === 'check').length,
    findings,
    critical,
    advisory: findings.length - critical,
    ready: placed.filter((x) => !x.finding).length,
    projects: projects.sort(),
    otherDrs: [...new Set(files.filter((x) => x.dr !== HOME_DR).map((x) => x.dr))],
  };
}

/** Accepted on the upload screen (prototype rule). */
export const UPLOAD_EXT = /^(pdf|jpg|jpeg|png|heic|xlsx|xls|csv)$/;
export const MAX_UPLOAD_BYTES = 200e6;
