/** Team & Roles — sample data (fictional people and @example.gov addresses). Replace with the org members / invitations API. */

export type RoleKey = 'gm' | 'ga' | 'dl' | 'fi' | 'ld' | 'fd';

export const roles: Record<RoleKey, { label: string; description: string; color: string }> = {
  gm: { label: 'Grants Manager', description: 'Leads the claim, approves submission and manages the team.', color: '#1E4F8F' },
  ga: { label: 'Grants Analyst', description: 'Reviews documents, resolves cross-check findings and requests signatures.', color: '#3F7FD9' },
  dl: { label: 'Department Liaison', description: 'Uploads and answers questions for one department’s records.', color: '#7C4DB4' },
  fi: { label: 'Finance', description: 'Reconciles payroll exports and cost records against field evidence.', color: '#2E7D4F' },
  ld: { label: 'Leadership', description: 'Read-only oversight; gives final approval before FEMA submission.', color: '#B08A4E' },
  fd: { label: 'Field Documenter', description: 'Uploads field logs and photos and signs shift attestations.', color: '#5B6B7A' },
};

export const capabilities = ['Upload records', 'Review & confirm', 'Resolve cross-check', 'Request signatures', 'Sign attestations', 'Approve submission', 'Manage team'] as const;

/** Role × capability matrix (FEMA PA separation of duties: who documents work does not approve the claim). */
export const permissions: Record<RoleKey, boolean[]> = {
  gm: [true, true, true, true, false, true, true],
  ga: [true, true, true, true, false, false, false],
  dl: [true, false, false, false, false, false, false],
  fi: [true, true, true, false, false, false, false],
  ld: [false, false, false, false, false, true, false],
  fd: [true, false, false, false, true, false, false],
};

export const projectAccessOptions = ['All projects', 'PW-00428 · Malibu Canyon', 'PW-00429 · Topanga Creek Debris', 'PW-00433 · Big Tujunga Canyon Road', 'PW-00436 · San Gabriel Canyon Road'];

export interface Member {
  id: number;
  name: string;
  email: string;
  role: RoleKey;
  department: string;
  access: string;
  lastActive: string;
  me?: boolean;
}

export const members: Member[] = [
  { id: 1, name: 'Rosa Keith', email: 'r.keith@example.gov', role: 'gm', department: 'Public Works', access: 'All projects', lastActive: 'Active now', me: true },
  { id: 2, name: 'Daniel Ortiz', email: 'd.ortiz@example.gov', role: 'ga', department: 'Public Works', access: 'PW-00428, PW-00429', lastActive: '2 hours ago' },
  { id: 3, name: 'Priya Natarajan', email: 'p.natarajan@example.gov', role: 'dl', department: 'Stormwater', access: 'PW-00436', lastActive: 'Yesterday' },
  { id: 4, name: 'Marcus Hale', email: 'm.hale@example.gov', role: 'fi', department: 'Fiscal Services', access: 'All projects', lastActive: '3 days ago' },
  { id: 5, name: 'Elena Brooks', email: 'e.brooks@example.gov', role: 'ld', department: 'Executive Office', access: 'All projects', lastActive: 'Last week' },
  { id: 6, name: 'Heidi Liu', email: 'h.liu@example.gov', role: 'fd', department: 'Public Works · Field', access: 'PW-00428', lastActive: 'Today' },
];

export interface Invite {
  id: string;
  email: string;
  role: RoleKey;
  access: string;
  status: string;
  expired?: boolean;
}

export const invites: Invite[] = [
  { id: 'i1', email: 'j.tran@example.gov', role: 'ga', access: 'PW-00428 · Malibu Canyon', status: 'Sent 2 days ago · expires in 5 days' },
  { id: 'i2', email: 'k.morgan@example.gov', role: 'fi', access: 'All projects', status: 'Expired 3 days ago', expired: true },
];
