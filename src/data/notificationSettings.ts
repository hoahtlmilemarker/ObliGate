/**
 * Notification Settings (11) — sample data from the approved prototype — replace with API.
 */
export interface NotificationEvent {
  id: string;
  title: string;
  description: string;
  inApp: boolean;
  email: boolean;
}

export interface NotificationGroup {
  label: string;
  events: NotificationEvent[];
}

export const notificationGroups: NotificationGroup[] = [
  {
    label: 'Documents',
    events: [
      { id: 'doc-review', title: 'Document needs review', description: 'AI extraction finished with low-confidence fields.', inApp: true, email: true },
      { id: 'upload-classified', title: 'Upload classified', description: 'A file you uploaded was placed in a folder.', inApp: true, email: false },
      { id: 'not-filed', title: 'Document could not be filed', description: 'A file landed in the Unplaced Inbox.', inApp: true, email: true },
    ],
  },
  {
    label: 'Signatures & Review',
    events: [
      { id: 'sig-requested', title: 'Signature requested', description: 'Someone asks you to sign or attest.', inApp: true, email: true },
      { id: 'sig-completed', title: 'Signature completed', description: 'A signature you requested was completed.', inApp: true, email: true },
      { id: 'cross-check', title: 'Cross-check discrepancy', description: 'Payroll and field evidence do not match.', inApp: true, email: true },
    ],
  },
  {
    label: 'FEMA & Submission',
    events: [
      { id: 'rfi', title: 'FEMA RFI received', description: 'A Request for Information arrives for your projects.', inApp: true, email: true },
      { id: 'presub-finding', title: 'Pre-submission finding', description: 'A new finding blocks the binder from locking.', inApp: true, email: true },
      { id: 'deadline', title: 'Submission deadline', description: 'Reminders 14, 7 and 1 day before a deadline.', inApp: true, email: true },
    ],
  },
];

export const digestOptions = ['Daily at 8:00 AM', 'Weekly on Monday', 'Off'] as const;

export const deliveryDefaults = {
  digest: 'Weekly on Monday' as (typeof digestOptions)[number],
  quietHours: false,
  pauseEmail: false,
};
