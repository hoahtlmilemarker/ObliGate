/**
 * Document Review queue (screen 04).
 * Sample data from the approved prototype — replace with API.
 * The 14 documents mirror the Document Library rows, in the same order.
 */

export type ReviewTone = 'good' | 'warn' | 'risk' | 'blue';

export interface LowConfidence {
  /** Field label */
  f: string;
  /** Extracted value */
  v: string;
  /** Reason shown under the input */
  r: string;
}

interface Base {
  n: string;
  st: [ReviewTone, string];
  /** Overall confidence (0 = still extracting) */
  c: number;
  low?: LowConfidence;
}

/** The first document: hand-authored preview with the flagged OT cell. */
export interface OrigDoc extends Base {
  k: 'orig';
}
export interface TimesheetDoc extends Base {
  k: 'ts';
  emp: string;
  sig: string;
  cls: string;
  rate: string;
  reg: number;
  ot: number;
  per: [string, string];
}
export interface ActivityLogDoc extends Base {
  k: 'log';
  date: string;
  iso: string;
  crew: string;
  size: number;
  hrs: string;
  desc: string;
}
export interface SpreadsheetDoc extends Base {
  k: 'xl';
  per: string;
  rows: number;
  amt: string;
}
export interface SupervisorLogDoc extends Base {
  k: 'sup';
  per: [string, string];
  hrs: string;
}
export interface EquipmentLogDoc extends Base {
  k: 'eq';
  eq: string;
  id: string;
  per: [string, string];
  hrs: string;
}
export interface PhotoDoc extends Base {
  k: 'photo';
  date: string;
  loc: string;
  by: string;
}

export type ReviewDoc = OrigDoc | TimesheetDoc | ActivityLogDoc | SpreadsheetDoc | SupervisorLogDoc | EquipmentLogDoc | PhotoDoc;

/** Work descriptions / post-mile markers cycled through generated timesheet rows. */
export const workDescriptions = ['Culvert mud clearing', 'Heavy debris removal', 'Rock slide clearing', 'Shoulder reinforcement', 'Berm installation'];
export const postMiles = ['4.2', '4.2', '4.8', '5.1', '5.4'];
export const timesheetWeek = ['2023-01-09', '2023-01-10', '2023-01-11', '2023-01-12', '2023-01-13'];

export const reviewQueue: ReviewDoc[] = [
  { n: 'Timesheet_Aguayo_PayPeriod_02.pdf', k: 'orig', st: ['warn', 'Needs Review (76%)'], c: 76 },
  { n: 'ActivityLog_PW00428_Jan12_Crew3.pdf', k: 'log', st: ['good', 'Verified (99%)'], date: '01/12/2023', iso: '2023-01-12', crew: 'Culvert Clearing Crew', size: 4, hrs: '32.0', desc: 'Shoulder reinforcement, Malibu Cyn Rd PM 5.1', c: 99 },
  { n: 'eCAPS_Labor_Export_F7060865.xlsx', k: 'xl', st: ['blue', 'Ingested (167 rows)'], per: 'PP 01 – PP 04', rows: 167, amt: '$482,450.00', c: 99 },
  { n: 'SupervisorLog_Jan14-16_Unsigned.pdf', k: 'sup', st: ['risk', 'Missing Signature'], per: ['2023-01-14', '2023-01-16'], hrs: '24.0', c: 95 },
  {
    n: 'Timesheet_Delgado_PayPeriod_02.pdf', k: 'ts', st: ['warn', 'Needs Review (81%)'], emp: 'Delgado, Marco', sig: 'Marco Delgado', cls: 'Laborer', rate: '48.50', reg: 40, ot: 0, per: ['2023-01-01', '2023-01-14'], c: 81,
    low: { f: 'Regular Hours Worked', v: '40.00', r: 'Total on page 1 is partially cut off at the scan edge; daily rows sum to 40.0 hrs.' },
  },
  { n: 'EquipLog_CAT320_EQ-PW-109_Jan.pdf', k: 'eq', st: ['good', 'Verified (97%)'], eq: 'CAT 320 Excavator', id: '#EQ-PW-109', per: ['2023-01-09', '2023-01-13'], hrs: '40.0', c: 97 },
  { n: 'Timesheet_Chen_PayPeriod_02.pdf', k: 'ts', st: ['good', 'Verified (98%)'], emp: 'Chen, Lawrence', sig: 'Lawrence Chen', cls: 'Equipment Operator', rate: '54.20', reg: 40, ot: 0, per: ['2023-01-01', '2023-01-14'], c: 98 },
  { n: 'FieldPhoto_MalibuCyn_PM5.1_Jan12.jpg', k: 'photo', st: ['blue', 'Extracting…'], date: '2023-01-12', loc: 'Malibu Cyn Rd PM 5.1', by: 'Liu, Heidi', c: 0 },
  { n: 'Timesheet_Santos_PayPeriod_02.pdf', k: 'ts', st: ['good', 'Verified (99%)'], emp: 'Santos, Maria', sig: 'Maria Santos', cls: 'Laborer', rate: '54.20', reg: 40, ot: 0, per: ['2023-01-01', '2023-01-14'], c: 99 },
  { n: 'ActivityLog_PW00428_Jan10_Crew3.pdf', k: 'log', st: ['good', 'Verified (98%)'], date: '01/10/2023', iso: '2023-01-10', crew: 'Culvert Clearing Crew', size: 4, hrs: '32.0', desc: 'Heavy debris removal, Malibu Cyn Rd PM 4.2', c: 98 },
  {
    n: 'ActivityLog_PW00428_Jan13_Crew3.pdf', k: 'log', st: ['warn', 'Needs Review (83%)'], date: '01/13/2023', iso: '2023-01-13', crew: 'Culvert Clearing Crew', size: 4, hrs: '32.0', desc: 'Berm installation, Malibu Cyn Rd PM 5.4', c: 83,
    low: { f: 'Crew Hours', v: '32.0', r: 'One crew member’s sign-out time is illegible; hours assumed from the 8-hour shift.' },
  },
  { n: 'Timesheet_Aguayo_PayPeriod_01.pdf', k: 'ts', st: ['good', 'Verified (97%)'], emp: 'Aguayo, Hector', sig: 'Hector Aguayo', cls: 'Heavy Equipment Operator', rate: '54.20', reg: 80, ot: 0, per: ['2022-12-18', '2022-12-31'], c: 97 },
  { n: 'eCAPS_Labor_Export_PP01.xlsx', k: 'xl', st: ['blue', 'Ingested (42 rows)'], per: 'PP 01', rows: 42, amt: '$118,920.00', c: 99 },
  { n: 'FieldPhoto_MalibuCyn_Jan09.jpg', k: 'photo', st: ['good', 'Verified (96%)'], date: '2023-01-09', loc: 'Malibu Cyn Rd PM 4.2', by: 'Liu, Heidi', c: 96 },
];

/** Hand-authored first document (Timesheet_Aguayo_PayPeriod_02.pdf). */
export const origTimesheet = {
  header: { emp: 'Aguayo, Hector', empId: '#609142', cls: 'Heavy Equipment Operator', rate: '$54.20 / hr', period: '01/01/2023 – 01/14/2023', pca: 'PCA-89420' },
  rows: [
    { date: '01/09/2023', desc: 'Malibu Cyn Rd PM 4.2 - Culvert mud clearing', reg: '8.0', ot: '0.0' },
    { date: '01/10/2023', desc: 'Malibu Cyn Rd PM 4.2 - Heavy debris removal', reg: '8.0', ot: '0.0' },
    { date: '01/11/2023', desc: 'Malibu Cyn Rd PM 4.8 - Rock slide clearing', reg: '8.0', ot: '0.0' },
    { date: '01/12/2023', desc: 'Malibu Cyn Rd PM 5.1 - Shoulder reinforcement', reg: '8.0', ot: '8.0', flagged: true },
    { date: '01/13/2023', desc: 'Malibu Cyn Rd PM 5.4 - Berm installation', reg: '8.0', ot: '0.0' },
  ],
  totals: { reg: '40.0', ot: '8.0' },
  signatures: [
    ['Hector Aguayo', 'Employee Signature (01/14/2023)'],
    ['Heidi Liu, PE', 'Supervisor Attestation (01/15/2023)'],
  ] as [string, string][],
  fields: {
    classification: 'Force-Account Labor Timesheet',
    employee: 'Aguayo, Hector',
    periodStart: '2023-01-01',
    periodEnd: '2023-01-14',
    regular: '40.00',
    overtime: '8.00',
    overtimeReason: 'Handwriting on Jan 12 OT column had partial smudge between 3.0 and 8.0. DeRS payroll export claims 8.0 hrs.',
    signature: 'Signature match: Heidi Liu, PE (Resident Engineer)',
  },
};

/** eCAPS spreadsheet preview rows (xl documents). */
export const spreadsheetPreview = [
  ['Aguayo, Hector', 'PP 02', '40.0', '$54.20'],
  ['Delgado, Marco', 'PP 02', '40.0', '$48.50'],
  ['Chen, Lawrence', 'PP 02', '40.0', '$54.20'],
];

export const rescanReasons = ['Handwriting unreadable', 'Page cut off at the edge', 'Pages missing', 'Low resolution'];
