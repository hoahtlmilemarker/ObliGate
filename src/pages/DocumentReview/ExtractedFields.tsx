import { Box, OutlinedInput, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { StatusTag } from '@/components';
import { CheckIcon } from '@/icons';
import { origTimesheet, type LowConfidence, type ReviewDoc } from '@/data/review';

/** Prototype `.tag` metrics (12px / 600 / 3px 10px). */
export const tagSx = { fontSize: 12, fontWeight: 600, lineHeight: '18px', p: '3px 10px', letterSpacing: 0 } as const;

function Inp({ value, id, label, warn }: { value: string; id?: string; label?: string; warn?: boolean }) {
  return (
    <OutlinedInput
      id={id}
      defaultValue={value}
      fullWidth
      inputProps={label ? { 'aria-label': label } : undefined}
      sx={{ fontVariantNumeric: 'tabular-nums', ...(warn && { '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'og.warn' } }) }}
    />
  );
}

function Range({ a, b, id, endLabel }: { a: string; b: string; id: string; endLabel: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
      <Inp value={a} id={id} />
      <Box component="span" aria-hidden sx={{ color: 'og.gray' }}>
        →
      </Box>
      <Inp value={b} label={endLabel} />
    </Box>
  );
}

function Field({ label, conf, id, children, tagText }: { label: string; conf: number | null; id?: string; children: ReactNode; tagText?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="label" component={id ? 'label' : 'span'} {...(id ? { htmlFor: id } : {})}>
          {label}
        </Typography>
        {!!conf && (
          <StatusTag tone={conf >= 90 ? 'good' : 'warn'} noDot sx={tagSx}>
            {tagText ?? `${conf}% Conf`}
          </StatusTag>
        )}
      </Box>
      {children}
    </Box>
  );
}

function WarnGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: -2, marginLeft: 6 }}>
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 9v4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="16.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LowBlock({ low, id, tag = 'Low Conf', icon }: { low: LowConfidence; id: string; tag?: string; icon?: boolean }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3.5, border: 1, borderColor: 'og.warn', bgcolor: 'og.warnTint', borderRadius: '4px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="label" component="label" htmlFor={id} sx={{ color: 'og.warn' }}>
          {low.f}
          {icon && <WarnGlyph />}
        </Typography>
        <StatusTag tone="warn" noDot sx={[tagSx, { bgcolor: 'og.card' }]}>
          {tag}
        </StatusTag>
      </Box>
      <Inp value={low.v} id={id} warn />
      <Box component="p" sx={{ m: 0, fontSize: 13, lineHeight: 1.6, color: 'og.ink' }}>
        <strong>Reason:</strong> {low.r}
      </Box>
    </Box>
  );
}

function SignatureOk({ tall }: { tall?: boolean }) {
  return (
    <Box sx={{ minHeight: tall ? 44 : 36, display: 'flex', alignItems: 'center', gap: 2, px: 3, bgcolor: 'og.goodTint', color: 'og.good', fontSize: tall ? 14 : 13.5, fontWeight: 600, borderRadius: '4px' }}>
      {tall && <CheckIcon size={13} strokeWidth={2.4} style={{ flex: 'none' }} />}
      {origTimesheet.fields.signature}
    </Box>
  );
}

/** Number of extracted fields shown in the panel title ("AI Extracted Metadata (n Fields)"). */
export function fieldCount(d: ReviewDoc) {
  switch (d.k) {
    case 'orig':
    case 'ts':
    case 'log':
      return 6;
    case 'xl':
    case 'sup':
    case 'eq':
      return 5;
    case 'photo':
      return 4;
  }
}

/** Header chip: "1 Low Confidence" / "1 Missing Signature" (or none). */
export function issueChip(d: ReviewDoc): string | null {
  if (d.k === 'orig') return '1 Low Confidence';
  if (d.k === 'sup') return '1 Missing Signature';
  return d.low ? '1 Low Confidence' : null;
}

/** Right-hand list of AI-extracted fields for the current document. */
export function ExtractedFields({ d }: { d: ReviewDoc }) {
  const c = d.c || null;
  switch (d.k) {
    case 'orig': {
      const f = origTimesheet.fields;
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value={f.classification} id="f1" />
          </Field>
          <Field label="Employee Name" conf={98} id="f2">
            <Inp value={f.employee} id="f2" />
          </Field>
          <Field label="Pay Period Window" conf={97} id="f3">
            <Range a={f.periodStart} b={f.periodEnd} id="f3" endLabel="Pay period end" />
          </Field>
          <Field label="Regular Hours Worked" conf={99} id="f4">
            <Inp value={f.regular} id="f4" />
          </Field>
          <LowBlock low={{ f: 'Overtime Hours Worked', v: f.overtime, r: f.overtimeReason }} id="f5" tag="74% Conf" icon />
          <Field label="Supervisor Signature" conf={99} tagText="99% Verified">
            <SignatureOk tall />
          </Field>
        </>
      );
    }
    case 'ts':
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value="Force-Account Labor Timesheet" id="f1" />
          </Field>
          <Field label="Employee Name" conf={c} id="f2">
            <Inp value={d.emp} id="f2" />
          </Field>
          <Field label="Pay Period Window" conf={c} id="f3">
            <Range a={d.per[0]} b={d.per[1]} id="f3" endLabel="Pay period end" />
          </Field>
          {d.low ? (
            <LowBlock low={d.low} id="f4" />
          ) : (
            <Field label="Regular Hours Worked" conf={c} id="f4">
              <Inp value={d.reg.toFixed(2)} id="f4" />
            </Field>
          )}
          <Field label="Overtime Hours Worked" conf={c} id="f5">
            <Inp value="0.00" id="f5" />
          </Field>
          <Field label="Supervisor Signature" conf={c}>
            <SignatureOk />
          </Field>
        </>
      );
    case 'log':
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value="Daily Activity Log" id="f1" />
          </Field>
          <Field label="Crew" conf={c} id="f2">
            <Inp value={d.crew} id="f2" />
          </Field>
          <Field label="Work Date" conf={c} id="f3">
            <Inp value={d.iso} id="f3" />
          </Field>
          <Field label="Crew Size" conf={c} id="f4">
            <Inp value={`${d.size} members`} id="f4" />
          </Field>
          {d.low ? (
            <LowBlock low={d.low} id="f5" />
          ) : (
            <Field label="Crew Hours" conf={c} id="f5">
              <Inp value={d.hrs} id="f5" />
            </Field>
          )}
          <Field label="Work Performed" conf={c} id="f6">
            <Inp value={d.desc} id="f6" />
          </Field>
        </>
      );
    case 'xl':
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value="DeRS Baseline Export" id="f1" />
          </Field>
          <Field label="Source System" conf={99} id="f2">
            <Inp value="eCAPS Payroll" id="f2" />
          </Field>
          <Field label="Pay Periods" conf={c} id="f3">
            <Inp value={d.per} id="f3" />
          </Field>
          <Field label="Rows Ingested" conf={c} id="f4">
            <Inp value={String(d.rows)} id="f4" />
          </Field>
          <Field label="Total Labor Cost" conf={c} id="f5">
            <Inp value={d.amt} id="f5" />
          </Field>
        </>
      );
    case 'sup':
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value="Supervisor Field Log" id="f1" />
          </Field>
          <Field label="Supervisor" conf={c} id="f2">
            <Inp value="Liu, Heidi (Resident Engineer)" id="f2" />
          </Field>
          <Field label="Shift Window" conf={c} id="f3">
            <Range a={d.per[0]} b={d.per[1]} id="f3" endLabel="Shift window end" />
          </Field>
          <Field label="Logged Hours" conf={c} id="f4">
            <Inp value={d.hrs} id="f4" />
          </Field>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3.5, border: 1, borderColor: 'og.risk', bgcolor: 'og.riskTint', borderRadius: '4px' }}>
            <Typography variant="label" component="span" sx={{ color: 'og.risk' }}>
              Supervisor Signature
            </Typography>
            <Box component="p" sx={{ m: 0, fontSize: 13, lineHeight: 1.6, color: 'og.ink' }}>
              No signature detected on the attestation line. A signature is required before this log can support overtime claims.
            </Box>
          </Box>
        </>
      );
    case 'eq':
      return (
        <>
          <Field label="Document Classification" conf={99} id="f1">
            <Inp value="Equipment Usage Log" id="f1" />
          </Field>
          <Field label="Equipment" conf={c} id="f2">
            <Inp value={d.eq} id="f2" />
          </Field>
          <Field label="Equipment ID" conf={c} id="f3">
            <Inp value={d.id} id="f3" />
          </Field>
          <Field label="Usage Window" conf={c} id="f4">
            <Range a={d.per[0]} b={d.per[1]} id="f4" endLabel="Usage window end" />
          </Field>
          <Field label="Operating Hours" conf={c} id="f5">
            <Inp value={d.hrs} id="f5" />
          </Field>
        </>
      );
    case 'photo':
      return (
        <>
          {!c && (
            <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: '12px 14px', borderRadius: '4px', bgcolor: 'og.blueTint', color: 'og.blue', fontSize: 13, fontWeight: 600 }}>
              AI extraction is still running for this photo. Fields will appear when it finishes.
            </Box>
          )}
          <Field label="Document Classification" conf={c} id="f1">
            <Inp value="Site Photo Evidence" id="f1" />
          </Field>
          <Field label="Location" conf={c} id="f2">
            <Inp value={d.loc} id="f2" />
          </Field>
          <Field label="Capture Date" conf={c} id="f3">
            <Inp value={d.date} id="f3" />
          </Field>
          <Field label="Captured By" conf={c} id="f4">
            <Inp value={d.by} id="f4" />
          </Field>
        </>
      );
  }
}
