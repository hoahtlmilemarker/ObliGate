/** Route map — single source of truth for links between screens. */
export const routes = {
  signIn: '/sign-in',
  disasters: '/disasters',
  project: '/projects/PW-00428',
  library: '/library',
  libraryEmpty: '/library/PW-00429/force-account-labor',
  inbox: '/inbox',
  review: '/review',
  crossCheck: '/cross-check',
  importWizard: '/import',
  preSubmission: '/pre-submission',
  signature: '/signature',
  upload: '/upload',
  analyzing: '/analyzing',
  analysisReport: '/analysis-report',
  team: '/team',
  settings: '/settings/security',
  profile: '/settings/profile',
  notifications: '/settings/notifications',
} as const;

export type MainNavKey = 'library' | 'crossCheck' | 'disasters' | 'preSubmission';

export const mainNav: { key: MainNavKey; label: string; to: string; count?: number }[] = [
  { key: 'library', label: 'Document Library', to: routes.library, count: 14 },
  { key: 'crossCheck', label: 'Cross-Check', to: routes.crossCheck, count: 8 },
  { key: 'disasters', label: 'Disasters', to: routes.disasters },
  { key: 'preSubmission', label: 'Pre-Submission', to: routes.preSubmission },
];

/** Signed-in user shown in the header (sample data). */
export const currentUser = {
  name: 'Rosa Keith',
  initials: 'RK',
  role: 'Grants Manager',
  org: 'LA County Public Works',
  email: 'r.keith@example.gov',
};

export const currentDisaster = { org: 'LA County Public Works', id: 'DR-4683-CA' };
