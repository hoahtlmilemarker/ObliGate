/**
 * Cross-Check Labor Ledger (screen 05) — Aguayo, Hector · Pay Period 02.
 * Sample data from the approved prototype — replace with API.
 */

export interface WorkerFinding {
  name: string;
  tag: { tone: 'risk' | 'warn' | 'good'; label: string };
  lines: string[];
  /** Bold summary line (active finding) */
  diff?: string;
  /** Clickable entries (findings); matched workers are static cards. */
  link?: boolean;
  active?: boolean;
}

export const workerQueue: WorkerFinding[] = [
  { name: 'Aguayo, Hector', tag: { tone: 'risk', label: 'OT Mismatch' }, lines: ['Claimed: 48h · Documented: 44h'], diff: 'Diff: 4.0 OT hrs ($325.20)', link: true, active: true },
  { name: 'Delgado, Marco', tag: { tone: 'warn', label: 'Missing Log' }, lines: ['Claimed: 40h · Documented: 0h', 'Eligible for Attestation'], link: true },
  { name: 'Chen, Lawrence', tag: { tone: 'good', label: 'Matched' }, lines: ['40.0h Regular · $2,168.00'] },
  { name: 'Santos, Maria', tag: { tone: 'good', label: 'Matched' }, lines: ['40.0h Regular · $2,168.00'] },
];

export const crossCheckHeader = {
  crumbs: { project: 'PW-00428 Malibu Canyon', ledger: 'Cross-Check Labor Ledger', period: 'Pay Period 02 (Jan 01 – Jan 14, 2023)' },
  prevPeriod: 'Prev Period (PP 01)',
  nextPeriod: 'Next Period (PP 03)',
  employee: 'Employee: #609142',
  flag: 'Discrepancy Flagged',
  title: 'Aguayo, Hector — Heavy Equipment Operator',
  subtitle: 'Comparing claimed DeRS payroll baseline against field daily activity logs for Pay Period 02.',
};

export const periodKpis = {
  summary: { label: 'Pay Period Summary', value: 'PP 02', note: '12 Crew Members · eCAPS Payroll Cycle #2023-02' },
  coverage: { label: 'Coverage', value: '10 / 12', pct: 83.3, note: 'Reconciled' },
  atRisk: { label: 'At Risk', value: '$3,240', note: 'across 2 workers' },
};

export interface SourceRow {
  label: string;
  value: string;
  /** Highlighted discrepancy row */
  flagged?: { sub: string; amount: string };
}

export interface SourcePanel {
  key: 'A' | 'B';
  kicker: string;
  tag: { tone: 'neutral' | 'warn'; label: string };
  title: string;
  description: string;
  rows: SourceRow[];
}

export const sources: SourcePanel[] = [
  {
    key: 'A',
    kicker: 'Source A · Baseline Claim',
    tag: { tone: 'neutral', label: 'Claimed' },
    title: 'eCAPS DeRS Payroll System',
    description: 'Electronic County Payroll Data (Export ID: #F7060865)',
    rows: [
      { label: 'Employee Name', value: 'Aguayo, Hector' },
      { label: 'Pay Period', value: '01/01/2023 – 01/14/2023' },
      { label: 'Regular Hours Claimed', value: '40.00 hrs ($2,168.00)' },
      { label: 'Overtime Hours Claimed', value: '8.00 hrs', flagged: { sub: 'Charged at 1.5x FEMA Rate', amount: '$650.40' } },
      { label: 'Base Hourly Rate', value: '$54.20 / hr' },
      { label: 'PCA Project Code', value: 'PCA-89420 (PW-00428)' },
    ],
  },
  {
    key: 'B',
    kicker: 'Source B · Field Evidence',
    tag: { tone: 'warn', label: 'Documented' },
    title: 'Daily Activity Log (Doc #428-PP02)',
    description: 'Field Supervisor Daily Sign-in Sheets (Signed by Heidi Liu, PE)',
    rows: [
      { label: 'Employee Name', value: 'Aguayo, Hector' },
      { label: 'Pay Period', value: '01/01/2023 – 01/14/2023' },
      { label: 'Regular Hours Documented', value: '40.00 hrs ($2,168.00)' },
      { label: 'Overtime Hours Documented', value: '4.00 hrs', flagged: { sub: 'Log only notes 4.0h on Jan 12', amount: '$325.20' } },
      { label: 'Base Hourly Rate', value: '$54.20 / hr (Verified)' },
      { label: 'Work Site Location', value: 'Malibu Cyn Rd PM 4.2 – PM 5.8' },
    ],
  },
];

export const complianceFinding = {
  title: 'FEMA Compliance Finding: Unsubstantiated Overtime Difference (4.0 hrs / $325.20)',
  body: 'The eCAPS payroll ledger shows 8.0 hours of emergency overtime billed on Jan 12, 2023. However, the Daily Activity Log filed from the field trailer records Hector Aguayo working from 07:00 to 19:30 (4.0 hours overtime above the 8.0h regular shift). FEMA auditors will disallow the difference of 4.0 hours unless an attestation or revised shift report is attached.',
};
