/**
 * Document Library — Sample data from the approved prototype — replace with API.
 * Source: prototype/03-document-library.html (table rows, checklist, filing cabinet, folder samples).
 */

export type DocTone = 'good' | 'warn' | 'risk' | 'proc';
export type DocAction = 'reviewTwoPane' | 'review' | 'inspect' | 'reconcile' | 'requestSignature' | 'reviewPlain' | 'processing';
export type DocLink = 'review' | 'importWizard' | 'crossCheck' | 'signature';

export interface LibraryDoc {
  id: string;
  /** File-type tile label (PDF, LOG, XLSX, IMG, DOCX). */
  type: string;
  name: string;
  /** Where the file name links. */
  link: DocLink;
  kind: string;
  meta: string;
  period: string;
  year: string;
  initials: string;
  /** Outline avatar (crews, vendors, equipment). */
  outline?: boolean;
  who: string;
  whoSub?: string;
  value: string;
  tone: DocTone;
  status: string;
  action: DocAction;
  /** Highlighted "next to review" row. */
  hot?: boolean;
  /** Freshly uploaded row (New pill, gold flash). */
  isNew?: boolean;
}

export const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: '#B4473A',
  LOG: '#2F7D5B',
  XLSX: '#2F6FB0',
  DOCX: '#2F6FB0',
  IMG: '#6B5B95',
};

/** Force-Account Labor folder (PW-00428), 14 documents. */
export const forceAccountDocs: LibraryDoc[] = [
  { id: 'doc-aguayo-02', type: 'PDF', name: 'Timesheet_Aguayo_PayPeriod_02.pdf', link: 'review', kind: 'Force-Account Timesheet', meta: 'Uploaded yesterday by H. Liu · 1.4 MB', period: 'Jan 01 – Jan 14', year: '2023', initials: 'HA', who: 'Aguayo, Hector', whoSub: 'Heavy Equip Op', value: '$4,820.00', tone: 'warn', status: 'Review Needed (76%)', action: 'reviewTwoPane', hot: true },
  { id: 'doc-activity-jan12', type: 'LOG', name: 'ActivityLog_PW00428_Jan12_Crew3.pdf', link: 'review', kind: 'Daily Activity Log', meta: 'Uploaded Jan 18 by R. Keith · 820 KB', period: 'Jan 12', year: '2023', initials: 'CC', outline: true, who: 'Culvert Clearing Crew', whoSub: '4 members', value: '32.0 hrs', tone: 'good', status: 'Verified (99%)', action: 'inspect' },
  { id: 'doc-ecaps-f706', type: 'XLSX', name: 'eCAPS_Labor_Export_F7060865.xlsx', link: 'importWizard', kind: 'DeRS Baseline Export', meta: 'Ingested via Import Wizard · 48 KB', period: 'PP 01 – PP 04', year: '2023', initials: 'CP', outline: true, who: 'Countywide Payroll', value: '$482,450.00', tone: 'good', status: 'Ingested (167 rows)', action: 'reconcile' },
  { id: 'doc-supervisorlog', type: 'PDF', name: 'SupervisorLog_Jan14-16_Unsigned.pdf', link: 'signature', kind: 'Supervisor Field Log', meta: 'Uploaded Jan 17 by H. Liu · 640 KB', period: 'Jan 14 – Jan 16', year: '2023', initials: 'HL', who: 'Liu, Heidi', whoSub: 'Resident Engineer', value: '24.0 hrs', tone: 'risk', status: 'Missing Signature', action: 'requestSignature' },
  { id: 'doc-delgado-02', type: 'PDF', name: 'Timesheet_Delgado_PayPeriod_02.pdf', link: 'review', kind: 'Force-Account Timesheet', meta: 'Uploaded Jan 16 by R. Keith · 1.2 MB', period: 'Jan 01 – Jan 14', year: '2023', initials: 'DM', who: 'Delgado, Marco', whoSub: 'Laborer', value: '$1,940.00', tone: 'warn', status: 'Review Needed (81%)', action: 'review' },
  { id: 'doc-equiplog-cat320', type: 'LOG', name: 'EquipLog_CAT320_EQ-PW-109_Jan.pdf', link: 'review', kind: 'Equipment Usage Log', meta: 'Uploaded Jan 18 by R. Keith · 2.1 MB', period: 'Jan 09 – Jan 13', year: '2023', initials: 'CAT', outline: true, who: 'CAT 320 Excavator', whoSub: '#EQ-PW-109', value: '40.0 hrs', tone: 'good', status: 'Verified (97%)', action: 'inspect' },
  { id: 'doc-chen-02', type: 'PDF', name: 'Timesheet_Chen_PayPeriod_02.pdf', link: 'review', kind: 'Force-Account Timesheet', meta: 'Uploaded Jan 16 by R. Keith · 1.1 MB', period: 'Jan 01 – Jan 14', year: '2023', initials: 'CL', who: 'Chen, Lawrence', whoSub: 'Equipment Op', value: '$2,168.00', tone: 'good', status: 'Verified (98%)', action: 'inspect' },
  { id: 'doc-photo-pm51', type: 'IMG', name: 'FieldPhoto_MalibuCyn_PM5.1_Jan12.jpg', link: 'review', kind: 'Site Photo Evidence', meta: 'Uploaded Jan 12 by H. Liu · 3.4 MB', period: 'Jan 12', year: '2023', initials: 'HL', who: 'Liu, Heidi', whoSub: 'Resident Engineer', value: '—', tone: 'proc', status: 'Extracting…', action: 'inspect' },
  { id: 'doc-santos-02', type: 'PDF', name: 'Timesheet_Santos_PayPeriod_02.pdf', link: 'review', kind: 'Force-Account Timesheet', meta: 'Uploaded Jan 16 by R. Keith · 1.1 MB', period: 'Jan 01 – Jan 14', year: '2023', initials: 'SM', who: 'Santos, Maria', whoSub: 'Laborer', value: '$2,168.00', tone: 'good', status: 'Verified (99%)', action: 'inspect' },
  { id: 'doc-activity-jan10', type: 'LOG', name: 'ActivityLog_PW00428_Jan10_Crew3.pdf', link: 'review', kind: 'Daily Activity Log', meta: 'Uploaded Jan 11 by R. Keith · 760 KB', period: 'Jan 10', year: '2023', initials: 'CC', outline: true, who: 'Culvert Clearing Crew', whoSub: '4 members', value: '32.0 hrs', tone: 'good', status: 'Verified (98%)', action: 'inspect' },
  { id: 'doc-activity-jan13', type: 'LOG', name: 'ActivityLog_PW00428_Jan13_Crew3.pdf', link: 'review', kind: 'Daily Activity Log', meta: 'Uploaded Jan 14 by R. Keith · 790 KB', period: 'Jan 13', year: '2023', initials: 'CC', outline: true, who: 'Culvert Clearing Crew', whoSub: '4 members', value: '32.0 hrs', tone: 'warn', status: 'Review Needed (83%)', action: 'review' },
  { id: 'doc-aguayo-01', type: 'PDF', name: 'Timesheet_Aguayo_PayPeriod_01.pdf', link: 'review', kind: 'Force-Account Timesheet', meta: 'Uploaded Jan 03 by H. Liu · 1.3 MB', period: 'Dec 18 – Dec 31', year: '2022', initials: 'HA', who: 'Aguayo, Hector', whoSub: 'Heavy Equip Op', value: '$4,336.00', tone: 'good', status: 'Verified (97%)', action: 'inspect' },
  { id: 'doc-ecaps-pp01', type: 'XLSX', name: 'eCAPS_Labor_Export_PP01.xlsx', link: 'crossCheck', kind: 'DeRS Baseline Export', meta: 'Ingested via Import Wizard · 41 KB', period: 'PP 01', year: '2023', initials: 'CP', outline: true, who: 'Countywide Payroll', value: '$118,920.00', tone: 'good', status: 'Ingested (42 rows)', action: 'reconcile' },
  { id: 'doc-photo-jan09', type: 'IMG', name: 'FieldPhoto_MalibuCyn_Jan09.jpg', link: 'review', kind: 'Site Photo Evidence', meta: 'Uploaded Jan 09 by H. Liu · 2.9 MB', period: 'Jan 09', year: '2023', initials: 'HL', who: 'Liu, Heidi', whoSub: 'Resident Engineer', value: '—', tone: 'good', status: 'Verified (96%)', action: 'inspect' },
];

/** Compact row factory for the other PW-00428 folders (mirrors the prototype's sample rows). */
function R(type: string, name: string, kind: string, meta: string, period: string, year: string, initials: string, outline: boolean, who: string, whoSub: string, value: string, tone: DocTone, status: string): LibraryDoc {
  return {
    id: `doc-${name.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}`,
    type,
    name,
    link: 'review',
    kind,
    meta,
    period,
    year,
    initials,
    outline,
    who,
    whoSub,
    value,
    tone,
    status,
    action: tone === 'warn' ? 'review' : 'inspect',
    hot: tone === 'warn',
  };
}

export interface FolderSample {
  description: string;
  rows: LibraryDoc[];
}

/** Other folders of PW-00428 shown when a filing-cabinet leaf is chosen. */
export const folderSamples: Record<string, FolderSample> = {
  'Equipment Records': {
    description: 'Equipment usage logs, rate schedules and maintenance records for force-account equipment.',
    rows: [
      R('LOG', 'EquipLog_CAT320_EQ-PW-109_Jan.pdf', 'Equipment Usage Log', 'Uploaded Jan 18 by R. Keith · 2.1 MB', 'Jan 09 – Jan 13', '2023', 'CAT', true, 'CAT 320 Excavator', '#EQ-PW-109', '40.0 hrs', 'good', 'Verified (97%)'),
      R('LOG', 'EquipLog_DumpTruck_EQ-PW-214_Jan.pdf', 'Equipment Usage Log', 'Uploaded Jan 18 by R. Keith · 1.8 MB', 'Jan 09 – Jan 13', '2023', 'DT', true, 'Dump Truck 10-yd', '#EQ-PW-214', '36.0 hrs', 'good', 'Verified (95%)'),
      R('LOG', 'EquipLog_WaterTender_EQ-PW-077_Jan.pdf', 'Equipment Usage Log', 'Uploaded Jan 16 by H. Liu · 1.2 MB', 'Jan 10 – Jan 12', '2023', 'WT', true, 'Water Tender', '#EQ-PW-077', '18.0 hrs', 'warn', 'Review Needed (78%)'),
      R('LOG', 'EquipLog_Loader_EQ-PW-131_Jan.pdf', 'Equipment Usage Log', 'Uploaded Jan 16 by H. Liu · 1.1 MB', 'Jan 11 – Jan 13', '2023', 'WL', true, 'Wheel Loader', '#EQ-PW-131', '22.0 hrs', 'good', 'Verified (96%)'),
      R('PDF', 'FEMA_Equipment_Rates_2023.pdf', 'FEMA Equipment Rate Schedule', 'Uploaded Jan 05 by R. Keith · 640 KB', '2023', 'Schedule', 'FE', true, 'FEMA', 'Schedule of Equipment Rates', '—', 'good', 'Ingested (rates)'),
      R('PDF', 'MaintenanceLog_CAT320_Jan14.pdf', 'Maintenance Record', 'Uploaded Jan 15 by H. Liu · 480 KB', 'Jan 14', '2023', 'CAT', true, 'CAT 320 Excavator', '#EQ-PW-109', '—', 'proc', 'Extracting…'),
    ],
  },
  'Contracts & Procurement': {
    description: 'Solicitation, bids, executed contract, invoices and change orders for contracted work.',
    rows: [
      R('PDF', 'RFP_2023-PW-09_Culvert_Repair.pdf', 'Request for Proposal', 'Uploaded Dec 02 by R. Keith · 2.4 MB', 'Dec 02', '2022', 'LA', true, 'LA County Public Works', 'Procurement', '—', 'good', 'Verified (99%)'),
      R('PDF', 'Bid_GraniteConstruction_RFP-2023-PW-09.pdf', 'Bid Submission', 'Uploaded Dec 16 by R. Keith · 3.1 MB', 'Dec 15', '2022', 'GC', true, 'Granite Construction', 'Low bidder', '$2,210,000.00', 'good', 'Verified (98%)'),
      R('PDF', 'Bid_CoastalPaving_RFP-2023-PW-09.pdf', 'Bid Submission', 'Uploaded Dec 16 by R. Keith · 2.7 MB', 'Dec 15', '2022', 'CP', true, 'Coastal Paving Co.', 'Bidder', '$2,384,500.00', 'good', 'Verified (97%)'),
      R('PDF', 'Bid_SierraEarthworks_RFP-2023-PW-09.pdf', 'Bid Submission', 'Uploaded Dec 16 by R. Keith · 2.2 MB', 'Dec 15', '2022', 'SE', true, 'Sierra Earthworks', 'Bidder', '$2,452,900.00', 'good', 'Verified (97%)'),
      R('XLSX', 'Bid_Tabulation_RFP-2023-PW-09.xlsx', 'Bid Tabulation', 'Uploaded Dec 19 by R. Keith · 64 KB', 'Dec 19', '2022', 'LA', true, 'LA County Public Works', '3 qualified bids', '—', 'good', 'Verified (99%)'),
      R('PDF', 'Contract_CON-428-01_Executed.pdf', 'Executed Contract', 'Uploaded Jan 04 by R. Keith · 4.6 MB', 'Jan 04', '2023', 'GC', true, 'Granite Construction', 'CON-428-01', '$2,210,000.00', 'good', 'Verified (99%)'),
      R('PDF', 'NoticeToProceed_CON-428-01.pdf', 'Notice to Proceed', 'Uploaded Jan 05 by R. Keith · 210 KB', 'Jan 05', '2023', 'GC', true, 'Granite Construction', 'CON-428-01', '—', 'good', 'Verified (98%)'),
      R('PDF', 'InsuranceCert_GraniteConstruction.pdf', 'Certificate of Insurance', 'Uploaded Jan 05 by R. Keith · 380 KB', '2023', 'Policy', 'GC', true, 'Granite Construction', 'COI', '—', 'good', 'Verified (96%)'),
      R('PDF', 'Invoice_Granite_CON-428-01_No1.pdf', 'Contractor Invoice', 'Uploaded Jan 20 by R. Keith · 520 KB', 'Jan 01 – Jan 15', '2023', 'GC', true, 'Granite Construction', 'Invoice #1', '$684,250.00', 'warn', 'Review Needed (82%)'),
      R('PDF', 'Invoice_Granite_CON-428-01_No2.pdf', 'Contractor Invoice', 'Uploaded Feb 03 by R. Keith · 540 KB', 'Jan 16 – Jan 31', '2023', 'GC', true, 'Granite Construction', 'Invoice #2', '$712,900.00', 'good', 'Verified (95%)'),
      R('PDF', 'ChangeOrder_01_CON-428-01.pdf', 'Change Order', 'Uploaded Jan 26 by R. Keith · 310 KB', 'Jan 26', '2023', 'GC', true, 'Granite Construction', 'CO #1', '$48,600.00', 'warn', 'Review Needed (74%)'),
      R('PDF', 'PaymentRecord_CON-428-01_No1.pdf', 'Payment Record', 'Uploaded Feb 06 by R. Keith · 190 KB', 'Feb 06', '2023', 'LA', true, 'LA County Auditor-Controller', 'Warrant', '$684,250.00', 'proc', 'Extracting…'),
    ],
  },
  'Materials & Supplies': {
    description: 'Invoices, receipts and delivery tickets for materials used on the project.',
    rows: [
      R('PDF', 'Invoice_RipRap_PacificAggregates_Jan.pdf', 'Materials Invoice', 'Uploaded Jan 17 by R. Keith · 420 KB', 'Jan 10 – Jan 13', '2023', 'PA', true, 'Pacific Aggregates', 'Rip-rap, 120 tons', '$58,400.00', 'good', 'Verified (97%)'),
      R('PDF', 'Invoice_CulvertPipe_WestCoastPipe.pdf', 'Materials Invoice', 'Uploaded Jan 18 by R. Keith · 380 KB', 'Jan 11', '2023', 'WC', true, 'West Coast Pipe Supply', 'Corrugated pipe', '$46,250.00', 'good', 'Verified (96%)'),
      R('IMG', 'DeliveryTicket_Aggregate_Jan12.jpg', 'Delivery Ticket', 'Uploaded Jan 12 by H. Liu · 1.6 MB', 'Jan 12', '2023', 'PA', true, 'Pacific Aggregates', 'Ticket #44817', '—', 'warn', 'Review Needed (71%)'),
      R('PDF', 'Receipt_SandbagsGeotextile_Jan09.pdf', 'Purchase Receipt', 'Uploaded Jan 10 by H. Liu · 240 KB', 'Jan 09', '2023', 'LA', true, 'LA County Public Works', 'P-card', '$929.40', 'good', 'Verified (95%)'),
    ],
  },
  'FEMA Correspondence': {
    description: 'Requests for information and formal correspondence with FEMA and Cal OES.',
    rows: [
      R('PDF', 'FEMA_RFI-01_PW-00428.pdf', 'FEMA Request for Information', 'Received Feb 10 · 220 KB', 'Feb 10', '2023', 'FE', true, 'FEMA Region IX', 'RFI #1', '—', 'good', 'Verified (99%)'),
      R('DOCX', 'Response_RFI-01_PW-00428.docx', 'RFI Response', 'Uploaded Feb 14 by R. Keith · 96 KB', 'Feb 14', '2023', 'RK', false, 'Keith, Rosa', 'Grants Manager', '—', 'warn', 'Review Needed (80%)'),
    ],
  },
};

export const FORCE_ACCOUNT = 'Force-Account Labor';
export const forceAccountBanner = {
  title: 'Force-Account Labor Evidence',
  description: 'Timesheets, Daily Activity Logs, DeRS baseline labor exports, and Supervisor attestations.',
};

/* ---------- FEMA Category C checklist ---------- */
export interface ChecklistItem {
  n: number;
  title: string;
  detail: string;
  note?: string;
  done: boolean;
}

export const laborChecklist = {
  title: 'FEMA Category C Labor Requirements Checklist',
  progress: '3 of 4 Complete',
  reference: 'PAPPG Chapter 2 § II.B.1',
  items: [
    { n: 1, title: 'DeRS Claimed Baseline', detail: 'eCAPS Payroll Export verified (167 records).', done: true },
    { n: 2, title: 'Employee Daily Timesheets', detail: 'Signed timesheets received for all 12 crew members.', note: '2 pending data review', done: true },
    { n: 3, title: 'Equipment Logs Correlation', detail: 'Operator matching confirmed against CAT-320.', done: true },
    { n: 4, title: 'Supervisor Field Log Attestation', detail: 'Jan 14-16 shift logs awaiting signature.', done: false },
  ] as ChecklistItem[],
};

/* ---------- Filing cabinet ---------- */
export const LEAF_FOLDERS = ['Force-Account Labor', 'Equipment Records', 'Contracts & Procurement', 'Materials & Supplies', 'FEMA Correspondence'] as const;

export interface TreeProject {
  id: string;
  name: string;
  count: number;
  /** Per-leaf counts; omitted leaves show no count. */
  leafCounts?: Partial<Record<(typeof LEAF_FOLDERS)[number], number>>;
  /** Leaf with an open evidence gap. */
  gapLeaf?: string;
  defaultOpen?: boolean;
}

export interface TreeDepartment {
  id: string;
  name: string;
  count: number;
  projects: TreeProject[];
}

export const filingCabinet = {
  disaster: { id: 'DR-4673-CA', name: 'Winter Storms', count: 142 },
  departments: [
    {
      id: 'public-works',
      name: 'Public Works Department',
      count: 88,
      projects: [
        { id: 'PW-00428', name: 'Malibu Canyon', count: 38, gapLeaf: 'Force-Account Labor', leafCounts: { 'Equipment Records': 6, 'Contracts & Procurement': 12, 'Materials & Supplies': 4, 'FEMA Correspondence': 2 } },
        { id: 'PW-00429', name: 'Topanga Creek Debris', count: 24 },
      ],
    },
    {
      id: 'sheriff',
      name: 'Sheriff’s Emergency Ops',
      count: 32,
      projects: [
        { id: 'PW-00431', name: 'Emergency Protective Measures', count: 20, defaultOpen: true },
        { id: 'PW-00432', name: 'EOC Activation', count: 12 },
      ],
    },
    {
      id: 'beaches',
      name: 'Department of Beaches and Harbors',
      count: 22,
      projects: [{ id: 'PW-00435', name: 'Zuma Beach Access Road Washout Repair', count: 22 }],
    },
  ] as TreeDepartment[],
};

/** URL slug for a leaf folder name ("Contracts & Procurement" → "contracts-procurement"). */
export const folderSlug = (name: string) => name.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const folderFromSlug = (slug?: string) => LEAF_FOLDERS.find((f) => folderSlug(f) === slug);

/* ---------- Upload ---------- */
export { ACCEPTED_UPLOAD_EXT, uploadSampleFiles } from './upload';

export const queueCounts = { review: 14, inbox: 6 };
