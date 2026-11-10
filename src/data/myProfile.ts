/**
 * My Profile (10) — sample data from the approved prototype — replace with API.
 */
export interface ProfileField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'tel';
  readOnly?: boolean;
  hint?: string;
}

export const profile = {
  initials: 'RK',
  name: 'Rosa Keith',
  subtitle: 'Grants Manager · LA County Public Works',
  fields: [
    { id: 'pf1', label: 'First name', value: 'Rosa', type: 'text' },
    { id: 'pf2', label: 'Last name', value: 'Keith', type: 'text' },
    { id: 'pf3', label: 'Job title', value: 'Grants Manager', type: 'text' },
    { id: 'pf4', label: 'Department', value: 'LA County Public Works', type: 'text', readOnly: true, hint: 'Managed by your organization admin.' },
    { id: 'pf5', label: 'Work email', value: 'r.keith@example.gov', type: 'email', hint: 'Sample address for this prototype.' },
    { id: 'pf6', label: 'Phone', value: '(555) 010-0142', type: 'tel' },
  ] as ProfileField[],
  assignment: { title: 'DR-4673-CA · Winter Storms', detail: 'PW-00428 Malibu Canyon · Lead Analyst', status: 'Active' },
  permissions: ['Upload', 'Review & Confirm', 'Request Signatures', 'Assemble Binder'],
  sso: { title: 'Single sign-on', detail: 'County SSO (Okta). Password and multi-factor settings are managed there.', status: 'Connected' },
  sessions: { title: 'Active sessions', detail: 'This browser · signed in now' },
};
