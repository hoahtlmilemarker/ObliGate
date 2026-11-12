/**
 * Disaster Portfolio (01) — Sample data from the approved prototype — replace with API.
 */
export type HealthTone = 'warn' | 'risk' | 'good' | 'neutral';

export interface LifecycleStage {
  key: string;
  label: string;
  count: number;
  tone?: 'warn';
}

export interface QuickFilter {
  key: string;
  label: string;
  defaultChecked: boolean;
}

export interface PortfolioKpi {
  label: string;
  value: string;
}

export interface Declaration {
  id: string;
  incident: string;
  period: string;
  projects: string;
  projectsAtRisk?: boolean;
  obligated: string;
  documented: string;
  documentedPct: number;
  health: { label: string; tone: HealthTone; pct: number };
  action: 'Open Projects' | 'Archive';
}

export const lifecycleStages: LifecycleStage[] = [
  { key: 'active', label: 'Active Declarations', count: 4 },
  { key: 'closeout', label: 'Closeout Stage', count: 2 },
  { key: 'appeals', label: 'FEMA Appeals', count: 1, tone: 'warn' },
  { key: 'archived', label: 'Archived Disasters', count: 18 },
];

export const quickFilters: QuickFilter[] = [
  { key: 'flags', label: 'With Open Compliance Flags', defaultChecked: true },
  { key: 'state', label: 'Pending State Recipient Match', defaultChecked: true },
  { key: 'reconciled', label: '100% Fully Reconciled', defaultChecked: false },
];

export const policyRuleset = {
  kicker: 'FEMA Policy Ruleset',
  version: 'PAPPG v4.0',
  status: 'Active',
  note: '2026 Emergency Guidance applied.',
};

export const portfolioBanner = {
  eyebrow: 'Portfolio Triage & Disaster Recovery',
  title: 'Federal Disaster Declarations',
  subtitle: 'Real-time oversight of Public Assistance grants, cross-check queues, and audit risk across 7 active declarations.',
};

export const portfolioKpis = {
  obligated: { label: 'Total Obligated Capital', value: '$84.25M', delta: '↑ $4.2M', deltaNote: 'newly obligated this quarter' },
  reconciled: { label: 'Documented & Reconciled', value: '$69.65M', pct: 82.7 },
  atRisk: { label: 'At-Risk / Disallowed Exposure', value: '$14.60M', chip: '24 Unmatched LVE Rows' },
  queue: { label: 'Total Projects in Queue', value: '42', meta: '18 Category C · 14 Category A' },
};

export const declarationColumns = [
  { key: 'decl', label: 'Declaration & Incident' },
  { key: 'period', label: 'Incident Period' },
  { key: 'projects', label: 'Active Projects' },
  { key: 'obligated', label: 'Obligated Amount', align: 'right' as const },
  { key: 'documented', label: 'Documented', align: 'right' as const },
  { key: 'health', label: 'Evidence Health' },
  { key: 'action', label: 'Action' },
];

export const declarations: Declaration[] = [
  {
    id: 'DR-4683-CA',
    incident: 'California Severe Winter Storms & Mudslides',
    period: 'Dec 27, 2022 – Jan 31, 2023',
    projects: '16 Projects',
    obligated: '$42,180,000',
    documented: '$36,800,000',
    documentedPct: 87,
    health: { label: 'Moderate (87%)', tone: 'warn', pct: 87 },
    action: 'Open Projects',
  },
  {
    id: 'DR-4758-CA',
    incident: 'February 2024 Atmospheric River & High Winds',
    period: 'Feb 01, 2024 – Feb 10, 2024',
    projects: '14 Projects',
    projectsAtRisk: true,
    obligated: '$28,450,000',
    documented: '$19,200,000',
    documentedPct: 67,
    health: { label: 'High Risk (67%)', tone: 'risk', pct: 67 },
    action: 'Open Projects',
  },
  {
    id: 'DR-4699-CA',
    incident: 'Northern California Severe Storms & Flooding',
    period: 'Feb 21, 2023 – Jul 10, 2023',
    projects: '8 Projects',
    obligated: '$9,120,000',
    documented: '$8,950,000',
    documentedPct: 98,
    health: { label: 'Ready (98%)', tone: 'good', pct: 98 },
    action: 'Open Projects',
  },
  {
    id: 'DR-4558-CA',
    incident: 'Bobcat Fire Complex Recovery',
    period: 'Sep 06, 2020 – Oct 15, 2020',
    projects: '4 Projects',
    obligated: '$4,500,000',
    documented: '$4,700,000',
    documentedPct: 100,
    health: { label: 'Closed (100%)', tone: 'neutral', pct: 100 },
    action: 'Archive',
  },
];

export const sortOptions = ['Highest Risk', 'Newest', 'Name A–Z'] as const;
export type SortOption = (typeof sortOptions)[number];

/** Dialog options (Declare New Event / New Project). */
export const incidentTypes = ['Winter Storms', 'Wildfire', 'Flooding', 'Earthquake'];
export const projectDisasterOptions = ['DR-4683-CA · Winter Storms'];
