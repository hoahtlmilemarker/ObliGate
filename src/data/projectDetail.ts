/**
 * Project Detail (02) — Sample data from the approved prototype — replace with API.
 */
export type ProjectNavTarget = 'overview' | 'library' | 'crossCheck' | 'preSubmission' | null;

export interface ProjectNavItem {
  label: string;
  count?: string;
  tone?: 'warn' | 'risk';
  target: ProjectNavTarget;
  active?: boolean;
}

export interface CostCategory {
  name: string;
  detail: string;
  claimed: string;
  documented: string;
  readiness: { label: string; tone: 'good' | 'warn' };
  action: { label: 'Cross-Check' | 'View' | 'Inspect'; primary?: boolean; target: 'crossCheck' | 'library' };
}

export interface ChecklistItem {
  title: string;
  detail: string;
  state: 'ok' | 'warn';
  link?: { label: string; target: 'signature' };
}

export const project = {
  id: 'PW-00428',
  scope: 'Cat C · Roads & Bridges',
  disasterCrumb: 'DR-4673-CA (Winter Storms)',
  projectCrumb: 'PW-00428 (Malibu Canyon Drainage)',
  idLabel: 'Project ID: PW-00428',
  status: 'Pre-Submission Audit In Progress',
  fips: 'Cal OES FIPS #037-91146',
  title: 'Storm Drainage & Culvert Repair — Malibu Canyon Road',
  subtitle: 'Emergency force-account labor and culvert replacement along PM 4.2 to PM 5.8 following torrential debris flows.',
  uploadDestination: 'PW-00428 Malibu Canyon',
};

export const projectNav: ProjectNavItem[] = [
  { label: 'Overview', target: 'overview', active: true },
  { label: 'Document Library', count: '38', target: 'library' },
  { label: 'Force-Account Labor', count: '2 flags', tone: 'warn', target: 'crossCheck' },
  { label: 'Equipment Records', target: null },
  { label: 'Contracts & Bids', target: null },
  { label: 'Pre-Submission', count: '86%', tone: 'warn', target: 'preSubmission' },
  { label: 'FEMA RFI Tracker', count: '1', tone: 'risk', target: null },
];

export const assignedTeam = ['Rosa Keith (Lead Analyst)', 'Heidi Liu (Supervisor)'];

export const projectKpis = {
  obligation: { label: 'Total Project Obligation', value: '$3,420,000', note: 'Federal Share (75%): ', noteValue: '$2,565,000' },
  claimed: { label: 'Claimed Expenditures', value: '$3,150,000', pct: 92.1, note: 'of obligated budget' },
  verified: { label: 'Documented & Verified', value: '$2,890,000', note: '84 Documents Verified' },
  atRisk: { label: 'Questioned / At-Risk Costs', value: '$260,000', tag: '2 Unreconciled Shifts' },
};

export const costCategories: CostCategory[] = [
  {
    name: 'Force-Account Labor',
    detail: '12 Regular crew + 4 Overtime',
    claimed: '$482,450',
    documented: '$446,120',
    readiness: { label: '2 Discrepancies', tone: 'warn' },
    action: { label: 'Cross-Check', primary: true, target: 'crossCheck' },
  },
  {
    name: 'Force-Account Equipment',
    detail: 'Excavators, dump trucks, water tenders',
    claimed: '$128,300',
    documented: '$128,300',
    readiness: { label: '100% Ready', tone: 'good' },
    action: { label: 'View', target: 'library' },
  },
  {
    name: 'Contracts & Procurement',
    detail: 'Granite Construction (RFP #2023-PW-09)',
    claimed: '$2,410,000',
    documented: '$2,210,000',
    readiness: { label: 'Missing SAM.gov', tone: 'warn' },
    action: { label: 'Inspect', target: 'library' },
  },
  {
    name: 'Materials & Supplies',
    detail: 'Rip-rap, corrugated pipes, aggregate',
    claimed: '$129,250',
    documented: '$105,580',
    readiness: { label: 'Ready', tone: 'good' },
    action: { label: 'View', target: 'library' },
  },
];

export const checklist = {
  title: 'Pre-Submission Checklist',
  pending: '3 Pending',
  items: [
    { title: 'Fringe Benefit Calculation', detail: 'Approved county composite rate applied (42.8%).', state: 'ok' },
    {
      title: 'Overtime Attestation Missing',
      detail: 'Supervisor Heidi Liu must countersign Jan 14 overtime shift.',
      state: 'warn',
      link: { label: 'Send Signature Request →', target: 'signature' },
    },
    { title: 'SAM.gov Debarment Proof', detail: 'Subcontractor search verification printout needed.', state: 'warn' },
  ] as ChecklistItem[],
};

/** Upload modal (shared prototype behaviour). */
export const uploadAccepted = ['pdf', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'heic', 'xlsx', 'xls', 'csv', 'docx'];
export const uploadSampleFiles = [
  { name: 'Timesheet_Ruiz_PayPeriod_02.pdf', size: 1258291 },
  { name: 'Timesheet_Delgado_PayPeriod_02.pdf', size: 1218000 },
  { name: 'FieldPhoto_MalibuCyn_PM4.8_Jan11.jpg', size: 3145728 },
  { name: 'crew_photos_jan.zip', size: 24117248 },
];
