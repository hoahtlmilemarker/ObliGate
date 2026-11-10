import { routes } from '@/layout/nav';

export interface SearchItem {
  kind: 'doc' | 'folder';
  title: string;
  sub: string;
  to: string;
}

/** Sample search index (prototype data). Replace with the search API. */
export const searchIndex: SearchItem[] = [
  { kind: 'folder', title: 'DR-4673-CA', sub: 'California Severe Winter Storms & Mudslides', to: routes.disasters },
  { kind: 'folder', title: 'PW-00428 · Malibu Canyon', sub: 'Project · Public Works Department', to: routes.project },
  { kind: 'folder', title: 'PW-00429 · Topanga Creek Debris', sub: 'Project · Public Works Department', to: routes.libraryEmpty },
  { kind: 'doc', title: 'Timesheet_Aguayo_PayPeriod_02.pdf', sub: 'Force-Account Timesheet · Review Needed (76%)', to: routes.review },
  { kind: 'doc', title: 'SupervisorLog_Jan14-16_Unsigned.pdf', sub: 'Supervisor Field Log · Missing Signature', to: routes.signature },
  { kind: 'doc', title: 'eCAPS_Labor_Export_F7060865.xlsx', sub: 'DeRS Baseline Export · Ingested (167 rows)', to: routes.crossCheck },
  { kind: 'doc', title: 'ActivityLog_PW00428_Jan12_Crew3.pdf', sub: 'Daily Activity Log · Verified (99%)', to: routes.review },
  { kind: 'doc', title: 'Timesheet_Delgado_PayPeriod_02.pdf', sub: 'Force-Account Timesheet · Review Needed (81%)', to: routes.review },
  { kind: 'folder', title: 'Unplaced Inbox', sub: '6 documents waiting to be filed', to: routes.inbox },
  { kind: 'folder', title: 'Pre-Submission Audit', sub: 'PW-00428 readiness checks', to: routes.preSubmission },
];
