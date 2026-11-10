/**
 * Spreadsheet Import Wizard (screen 06) — eCAPS labor cost report, step 2.
 * Sample data from the approved prototype — replace with API.
 */

export const SAMPLE_IMPORT_FILE = 'eCAPS_Labor_Cost_Report_PW00428.xlsx';
export const importDestination = 'PW-00428 › 1. Force-Account Labor';

export const importSteps = ['1. Detect Structure', '2. Confirm Column Roles', '3. Review & Commit'];

/** Messages of the "Detect Structure" progress overlay. */
export const detectSteps = ['Reading workbook & sheets', 'Finding the header block', 'Detecting carry-down identities', 'Skipping subtotal & metadata rows'];

export const detectedStructure = {
  title: 'Intelligent Structure Detected: Stacked 3-Row Headers & Carry-Down Identities Found',
  summary: 'Rows 1–16 ignored (Report Metadata) · Rows 17–19 merged into logical columns · Rows 20–186 parsed (167 labor records) · Subtotal rows automatically skipped.',
};

export const sheetName = 'Sheet: 110_Labor_Summary';

export const sheetLegend: { key: 'meta' | 'head' | 'rec' | 'carry' | 'sub'; label: string }[] = [
  { key: 'meta', label: 'Ignored' },
  { key: 'head', label: 'Header' },
  { key: 'rec', label: 'Record' },
  { key: 'carry', label: 'Carry-down' },
  { key: 'sub', label: 'Subtotal · skipped' },
];

export type SheetRow =
  | { kind: 'group'; group: 'meta' | 'head' | 'rec'; title: string; meta: string }
  | { kind: 'meta'; rn: string; text: string; more?: boolean }
  | { kind: 'head'; rn: string; cells: [string, string, string, string] }
  | { kind: 'merge'; cells: [string, string, string, string] }
  | { kind: 'record'; rn: string; cells: [string, string, string, string] }
  | { kind: 'carry'; rn: string; raw: string; to: string; cells: [string, string, string] }
  | { kind: 'subtotal'; rn: string; label: string; cells: [string, string, string] };

export const sheetRows: SheetRow[] = [
  { kind: 'group', group: 'meta', title: 'Report metadata', meta: 'Rows 1–16 · ignored' },
  { kind: 'meta', rn: '1', text: 'COUNTY OF LOS ANGELES - AUDITOR-CONTROLLER' },
  { kind: 'meta', rn: '2', text: 'eCAPS EXPENSE DETAIL REPORT - RUN DATE: 01/16/2023' },
  { kind: 'meta', rn: '3–16', text: '14 additional metadata filter rows ignored', more: true },
  { kind: 'group', group: 'head', title: 'Header block', meta: 'Rows 17–19 · merged into 4 columns' },
  { kind: 'head', rn: '17', cells: ['EMPLOYEE', 'PAY', 'REGULAR', 'HOURLY'] },
  { kind: 'head', rn: '18', cells: ['NAME / ID', 'PERIOD', 'HOURS', 'RATE ($)'] },
  { kind: 'head', rn: '19', cells: ['(LAST, FIRST)', 'CYCLE', 'WORKED', 'BASE'] },
  { kind: 'merge', cells: ['Employee / Name / (Last, First)', 'Pay / Period / Cycle', 'Regular / Hours / Worked', 'Hourly / Rate ($) / Base'] },
  { kind: 'group', group: 'rec', title: 'Labor records', meta: 'Rows 20–186 · 167 labor records' },
  { kind: 'record', rn: '20', cells: ['Aguayo, Hector', 'PP 02', '40.0', '$54.20'] },
  { kind: 'carry', rn: '21', raw: '[Aguayo, H.]', to: '→ Aguayo, Hector', cells: ['PP 02 OT', '8.0', '$81.30'] },
  { kind: 'subtotal', rn: '22', label: 'SUBTOTAL AGUAYO', cells: ['--', '48.0', '$2,818.40'] },
  { kind: 'record', rn: '23', cells: ['Delgado, Marco', 'PP 02', '40.0', '$48.50'] },
  { kind: 'meta', rn: '24–186', text: 'Remaining rows parsed with the same rules', more: true },
];

export interface ColumnMapping {
  id: string;
  source: string;
  match: string;
  options: string[];
  note?: string;
}

export const columnMappings: ColumnMapping[] = [
  { id: 'm1', source: 'EMPLOYEE / NAME / (LAST, FIRST)', match: '99% Match', options: ['employee_name (Canonical)', 'supervisor_name', 'vendor_name'], note: 'Sample values: "Aguayo, Hector", "Delgado, Marco", "Chen, Lawrence"' },
  { id: 'm2', source: 'PAY / PERIOD / CYCLE', match: '96% Match', options: ['pay_period_code (Canonical)', 'work_date'], note: 'Auto-converted to bi-weekly pay cycle dates (2023-01-01 to 2023-01-14).' },
  { id: 'm3', source: 'REGULAR / HOURS / WORKED', match: '99% Match', options: ['regular_hours (Float)', 'overtime_hours'] },
  { id: 'm4', source: 'HOURLY / RATE ($) / BASE', match: '94% Match', options: ['hourly_rate (Currency)', 'total_fringe_rate'] },
];

export const detectedRegions = { metadata: '1–16', header: '17–19', data: '20–186' };
export const commitRowCount = 167;
