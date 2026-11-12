/**
 * Unplaced Inbox — Sample data from the approved prototype — replace with API.
 * Source: prototype/03c-unplaced-inbox.html.
 */

export interface UnplacedDoc {
  id: string;
  ext: string;
  name: string;
  meta: string;
  /** AI suggested folder; null when there is no confident suggestion. */
  suggestion: string | null;
  match: string;
  tone: 'good' | 'warn' | 'risk';
  reason: string;
  /** From the user's own upload in this session (shown on top, marked New). */
  mine?: boolean;
}

export const unplacedDocs: UnplacedDoc[] = [
  { id: 'ux-scan-0117', ext: 'PDF', name: 'Scan_0117_unlabeled.pdf', meta: 'Uploaded Jan 17 by H. Liu · 1.1 MB', suggestion: 'PW-00428 › 1. Force-Account Labor', match: '64% match', tone: 'warn', reason: 'Timesheet layout detected, but the employee name is unreadable.' },
  { id: 'ux-img-4471', ext: 'JPG', name: 'IMG_4471.jpg', meta: 'Uploaded Jan 12 by H. Liu · 2.7 MB', suggestion: 'PW-00428 › 2. Equipment Records', match: '58% match', tone: 'warn', reason: 'Excavator visible; photo has no location data to confirm the project.' },
  { id: 'ux-invoice-granite', ext: 'PDF', name: 'Invoice_GraniteConstruction_Jan.pdf', meta: 'Uploaded Jan 19 by R. Keith · 420 KB', suggestion: 'PW-00428 › 3. Contracts & Procurement', match: '71% match', tone: 'good', reason: 'Vendor matches contract CON-428-01, but line items also reference PW-00429.' },
  { id: 'ux-fema-rfi', ext: 'DOCX', name: 'FEMA_RFI_Response_Draft.docx', meta: 'Uploaded Jan 20 by R. Keith · 88 KB', suggestion: 'PW-00428 › 5. FEMA Correspondence', match: '69% match', tone: 'warn', reason: 'Reads as FEMA correspondence; no project number in the text.' },
  { id: 'ux-receipt-hd', ext: 'JPG', name: 'Receipt_HomeDepot_0112.jpg', meta: 'Uploaded Jan 12 by H. Liu · 1.4 MB', suggestion: 'PW-00428 › 4. Materials & Supplies', match: '62% match', tone: 'warn', reason: 'Materials receipt; two projects were active on Jan 12.' },
  { id: 'ux-fax-0119', ext: 'TIF', name: 'fax_20230119.tif', meta: 'Uploaded Jan 19 by R. Keith · 5.2 MB', suggestion: null, match: '31%', tone: 'risk', reason: 'Scan quality too low to classify. Choose a folder manually.' },
];

export const inboxFolderOptions = [
  'PW-00428 › 1. Force-Account Labor',
  'PW-00428 › 2. Equipment Records',
  'PW-00428 › 3. Contracts & Procurement',
  'PW-00428 › 4. Materials & Supplies',
  'PW-00428 › 5. FEMA Correspondence',
  'PW-00429 › 1. Force-Account Labor',
  'PW-00429 › 3. Contracts & Procurement',
  'PW-00429 › 4. Materials & Supplies',
  'PW-00431 › 1. Force-Account Labor',
];
