/**
 * Pre-Submission Audit Readiness (07) — sample data from the approved prototype — replace with API.
 */
export type CheckStatus = 'ok' | 'warn' | 'bad';
export type FamilyTone = 'good' | 'warn' | 'risk';

export interface Kpi {
  label: string;
  value: string;
  valueTone?: 'risk';
  note: string;
  noteTone?: 'gray' | 'good' | 'warn' | 'riskTag';
}

export interface CheckAction {
  label: string;
  kind: 'upload' | 'samSearch' | 'signature' | 'crossCheck';
}

export interface CheckItem {
  id: string;
  status: CheckStatus;
  title: string;
  citation: string;
  description: string;
  /** Green evidence line under the description. */
  evidence?: string;
  actions?: CheckAction[];
}

export interface RuleFamily {
  id: string;
  ariaLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: FamilyTone;
  checks: CheckItem[];
}

export const preSubmission = {
  eyebrow: 'Final Audit Compliance Gateway',
  projectCrumb: 'PW-00428 Malibu Canyon',
  title: 'Pre-Submission Audit Readiness: PW-00428',
  subtitle: 'Automated rule checking against 2 CFR § 200, PAPPG v4.0, and Cal OES submission requirements.',
  readiness: '86% Audit Ready (Moderate Risk)',
  readinessNote: '3 Findings require resolution before locking',
  uploadDestination: 'PW-00428 › 3. Contracts & Procurement',
};

export const kpis: Kpi[] = [
  { label: 'Total Claimed Funds', value: '$3,150,000', note: 'Across 4 cost categories', noteTone: 'gray' },
  { label: 'Audit-Cleared Amount', value: '$2,890,000', note: '18 Rules Passed (100% Evidence)', noteTone: 'good' },
  { label: 'Potential Audit Questioned Costs', value: '$260,000', valueTone: 'risk', note: '2 Critical · 1 Advisory', noteTone: 'riskTag' },
  { label: 'Submission Deadline', value: 'Nov 15, 2026', note: '18 Days Remaining', noteTone: 'warn' },
];

export const ruleFamilies: RuleFamily[] = [
  {
    id: 'procurement',
    ariaLabel: 'Procurement and contract compliance',
    title: '1. Procurement & Contract Compliance (2 CFR § 200.318 – 200.326)',
    subtitle: 'Required for all contracted equipment, materials, and specialized labor.',
    badge: '1 Finding',
    badgeTone: 'warn',
    checks: [
      {
        id: 'bidding',
        status: 'ok',
        title: 'Competitive Bidding & Sole Source Documentation',
        citation: '2 CFR § 200.320',
        description: 'Formal RFP #2023-PW-09 published; 3 qualified bids received. Granite Construction selected on low bid.',
        evidence: 'Bid tabulations and contract execution agreement attached (Doc #CON-428-01).',
      },
      {
        id: 'sam',
        status: 'warn',
        title: 'SAM.gov Debarment Search Printout Missing',
        citation: '2 CFR § 200.214',
        description: 'FEMA requires date-stamped SAM.gov entity exclusion searches conducted prior to contract award.',
        actions: [
          { label: 'Upload SAM.gov Screenshot', kind: 'upload' },
          { label: 'Auto-Run SAM.gov Search API', kind: 'samSearch' },
        ],
      },
    ],
  },
  {
    id: 'labor',
    ariaLabel: 'Force-account labor eligibility',
    title: '2. Force-Account Labor Eligibility & Documentation',
    subtitle: 'PAPPG v4.0 Chapter 2 § II.B · eCAPS Payroll and Field Timesheet matching.',
    badge: '1 Critical Finding',
    badgeTone: 'risk',
    checks: [
      {
        id: 'overtime',
        status: 'bad',
        title: 'Overtime Shift Attestation Discrepancy (Hector Aguayo)',
        citation: 'PAPPG CH. 2 § II.B.1',
        description: '4.0 hours of emergency overtime ($325.20) in PP 02 lacks corresponding supervisor log confirmation.',
        actions: [
          { label: 'Open Supervisor Signature Pad', kind: 'signature' },
          { label: 'View in Cross-Check', kind: 'crossCheck' },
        ],
      },
      {
        id: 'fringe',
        status: 'ok',
        title: 'Fringe Benefit Cost Allocation Plan',
        citation: '2 CFR § 200.431',
        description: 'Countywide negotiated composite rate of 42.8% verified with Auditor-Controller agreement.',
      },
    ],
  },
  {
    id: 'ehp',
    ariaLabel: 'Environmental and historic preservation clearances',
    title: '3. Environmental & Historic Preservation (EHP) Clearances',
    subtitle: 'FEMA Directive 108-1 · Coastal Zone & Water Quality certifications.',
    badge: 'All Cleared',
    badgeTone: 'good',
    checks: [
      {
        id: 'usace',
        status: 'ok',
        title: 'USACE Clean Water Act Nationwide Permit #3 (Maintenance)',
        citation: '33 U.S.C. § 1344',
        description: 'Repair work restores existing pre-disaster hydraulic footprint. No expansion into waters of the United States.',
      },
    ],
  },
];

/** Findings listed in the "Lock & Assemble Binder" blocking dialog. */
export const blockingFindings = [
  'SAM.gov debarment search printout missing',
  'Overtime shift attestation discrepancy (Hector Aguayo)',
  '1 advisory finding',
];

/** Sample files offered by the upload dialog ("Try sample files (prototype)"). */
export const uploadSampleFiles = [
  { name: 'Timesheet_Ruiz_PayPeriod_02.pdf', size: 1258291 },
  { name: 'Timesheet_Delgado_PayPeriod_02.pdf', size: 1218000 },
  { name: 'FieldPhoto_MalibuCyn_PM4.8_Jan11.jpg', size: 3145728 },
  { name: 'crew_photos_jan.zip', size: 24117248 },
];
