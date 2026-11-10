/**
 * Supervisor Signature / Attestation Request (08) — sample data from the approved prototype — replace with API.
 */
export interface DetailRow {
  label: string;
  /** Bold lead (e.g. project or employee), rendered before `value`. */
  strong?: string;
  value?: string;
}

export const attestation = {
  portal: 'Field Verification Portal',
  disaster: 'DR-4673-CA',
  supervisor: { name: 'Heidi Liu, PE', role: 'Resident Engineer', initials: 'HL' },
  requestId: 'SIG-2026-PW428-09',
  status: 'Action Required',
  title: 'Force-Account Labor Attestation Request',
  intro:
    'Rosa Keith from Grants Management has requested your field supervisor attestation to clear an audit discrepancy on the eCAPS overtime payroll claim below:',
  details: [
    { label: 'Project & Location:', strong: 'PW-00428', value: ' · Malibu Canyon Road (PM 4.2 to PM 5.8)' },
    { label: 'Employee / Title:', strong: 'Hector Aguayo', value: ' (#609142) · Heavy Equipment Operator' },
    { label: 'Date of Incident Shift:', value: 'Thursday, January 12, 2023' },
  ] as DetailRow[],
  shift: { window: '07:00 – 23:30', total: '16.5 Total Hours', regular: '8.0 Reg', overtime: '8.0 Emergency OT' },
  equipment: { label: 'Equipment Deployed:', value: 'CAT 320 Hydraulic Excavator (#EQ-PW-109)' },
  workDescriptionLabel: 'Work Description Performed Under Your Direction:',
  workDescription:
    '"Immediate emergency clearing of massive culvert mud blockage and unstable rock overhang following flash flood warning. Operator Hector Aguayo stayed on-site continuously until 23:30 to prevent roadway washout."',
  legalTitle: 'LEGAL ATTESTATION UNDER 18 U.S.C. § 1001',
  legalText:
    '"I declare under penalty of perjury under the laws of the United States and the State of California that I was the designated field supervisor on duty during the dates and times specified. I personally observed and directed the emergency force-account labor and equipment operation stated above. All emergency overtime performed was necessary and directly attributable to disaster recovery under FEMA-4673-DR-CA."',
  confirmText:
    'I confirm the shift hours (8.0 regular + 8.0 overtime) and equipment usage are true, accurate, and eligible for federal reimbursement.',
  signature: 'Heidi Liu, PE',
  signatureMeta: 'Timestamp: 2026-10-28 11:15:02 UTC · IP: 198.147.24.12',
};
