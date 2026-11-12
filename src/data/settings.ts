/** Settings — sample data (same as the prototype). Replace with the org settings API. */

export type SettingsKey = 'security' | 'profile' | 'scope' | 'policy' | 'overrides' | 'notifications' | 'data' | 'patterns';

export interface SettingsPageMeta {
  key: SettingsKey;
  label: string;
  path: string;
  group: string;
  title: string;
  description: string;
}

/** Left-nav order and banner copy (information architecture of the live app). */
export const settingsPages: SettingsPageMeta[] = [
  {
    key: 'security',
    label: 'Security',
    path: '/settings/security',
    group: 'Account',
    title: 'Security',
    description: 'Protect your account with two-factor authentication. After setup, you’ll enter a 6-digit code from your authenticator app each time you sign in.',
  },
  { key: 'profile', label: 'Profile & branding', path: '/settings/profile', group: 'Organization', title: 'Profile & branding', description: 'Your account and organization details.' },
  {
    key: 'scope',
    label: 'Disasters & scope',
    path: '/settings/disasters-scope',
    group: 'Organization',
    title: 'Disasters & scope',
    description: 'The disaster declarations and projects your organization manages in ObliGate.',
  },
  {
    key: 'policy',
    label: 'Policy & thresholds',
    path: '/settings/policy-thresholds',
    group: 'Compliance Engine',
    title: 'Policy & thresholds',
    description:
      'Tune the compliance engine to your org’s procurement policies and risk appetite. Changes take effect on the next project scan; existing findings aren’t retroactively re-evaluated unless you rescan.',
  },
  {
    key: 'overrides',
    label: 'Finding overrides',
    path: '/settings/finding-overrides',
    group: 'Compliance Engine',
    title: 'Finding overrides',
    description:
      'Tell the engine to stop firing specific findings, or lower their severity, when your org has a documented reason. Every override is logged, reviewable, and has an expiry date — nothing silently disappears forever.',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    path: '/settings/notifications',
    group: 'Workspace',
    title: 'Notifications',
    description:
      'Per-department bi-weekly reminder cadence for eCAPS imports. Reminders go to Grants Manager and Grants Analyst recipients on the configured weekday after the cadence window elapses.',
  },
  { key: 'data', label: 'Data & retention', path: '/settings/data-retention', group: 'Workspace', title: 'Data & retention', description: 'How long ObliGate keeps your documents, audit trail and exports.' },
  {
    key: 'patterns',
    label: 'Reviewer patterns',
    path: '/settings/reviewer-patterns',
    group: 'FEMA Pattern Memory',
    title: 'Reviewer patterns',
    description:
      'What ObliGate has learned about FEMA reviewer patterns for your organization. Rules that have been returned on prior submissions surface at higher prominence in pre-submission review. This is operational knowledge about your jurisdiction — it is not shared across organizations.',
  },
];

/** Procurement thresholds (2 CFR 200.320). `floor` is the federal minimum; agencies may only go higher. */
export const procurementThresholds = [
  { id: 'micro', label: 'Micro-purchase', help: 'Below this, no quotes required', floor: 15000 },
  { id: 'simplified', label: 'Simplified acquisition', help: 'Requires ≥ 2 quotes (per PAPPG v5 Ch.4 §V)', floor: 350000 },
  { id: 'large', label: 'Large project', help: 'Triggers formal FEMA review', floor: 1000000 },
] as const;

/** Bi-weekly eCAPS import reminders, one row per department. */
export const importReminders = [
  { id: 'pw', department: 'Public Works Department', cadenceDays: 14, weekday: 'Monday', lastImport: 'Jan 16, 2023', next: 'Jan 30, 2023', overdue: false, enabled: true },
  { id: 'sheriff', department: 'Sheriff’s Emergency Operations', cadenceDays: 14, weekday: 'Wednesday', lastImport: 'Jan 11, 2023', next: 'Jan 25, 2023', overdue: false, enabled: true },
  { id: 'beaches', department: 'Department of Beaches & Harbors', cadenceDays: 14, weekday: 'Friday', lastImport: 'Dec 30, 2022', next: 'Overdue since Jan 13, 2023', overdue: true, enabled: false },
];

export type VendorStanding = 'trusted' | 'risk' | 'neutral';

/** Vendor familiarity (sample). */
export const vendors: { name: string; detail: string; standing: VendorStanding; history: string }[] = [
  { name: 'Granite Construction', detail: 'Debris removal · 6 projects', standing: 'trusted', history: '0 findings in 24 months' },
  { name: 'Pacific Rock Supply', detail: 'Aggregate & materials · 4 projects', standing: 'trusted', history: '1 advisory, resolved' },
  { name: 'Westside Hauling LLC', detail: 'Hauling · 3 projects', standing: 'risk', history: '2 procurement findings returned by FEMA' },
  { name: 'Coastal Equipment Rental', detail: 'Equipment rental · 2 projects', standing: 'neutral', history: 'Not enough history yet' },
  { name: 'Summit Traffic Control', detail: 'Traffic control · 1 project', standing: 'neutral', history: 'Not enough history yet' },
];

export const accountProfile = { name: 'Rosa Keith', jobTitle: 'Grants Manager', email: 'r.keith@example.gov' };
