import { Box, Button, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { LiftCard, useToast } from '@/components';
import { attestation as a } from '@/data/supervisorSignature';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import { ActionDialog, Tag } from '../PreSubmission/ui';
import illustration from './illustration.svg';
import { PortalHeader } from './PortalHeader';

const detailTag = { fontSize: 13, p: '4px 12px' };
const SIGNATURE_FONT = "'Segoe Script', 'Bradley Hand', 'Brush Script MT', cursive";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box component="tr">
      <Box component="th" scope="row" sx={{ width: 216, textAlign: 'left', verticalAlign: 'top', p: '15px 16px 15px 0', borderBottom: 1, borderColor: 'og.lineSoft', fontSize: 13, fontWeight: 700, lineHeight: 1.55, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'og.gray' }}>
        {label}
      </Box>
      <Box component="td" sx={{ p: '15px 0', borderBottom: 1, borderColor: 'og.lineSoft', fontSize: 15, lineHeight: 1.55, color: 'og.ink', '& strong': { fontWeight: 700 } }}>
        {children}
      </Box>
    </Box>
  );
}

/** 08 · Supervisor Signature — field supervisor attests to disputed overtime hours. */
export default function SupervisorSignature() {
  const toast = useToast();
  const [signed, setSigned] = useState(true);
  const [confirmed, setConfirmed] = useState(true);
  const [sealOpen, setSealOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');

  const clearPad = () => {
    setSigned(false);
    toast({ title: 'Signature cleared', message: 'click the pad to sign again' });
  };

  const seal = () => {
    if (!signed) return toast({ title: 'Sign the pad before sealing', tone: 'warning' });
    if (!confirmed) return toast({ title: 'Confirm the attestation statement first', tone: 'warning' });
    setSealOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'og.pale', fontSize: 16 }}>
      <PortalHeader />
      <Box component="main" sx={{ flex: 1 }}>
        <Masthead
          illustration={illustration}
          eyebrow={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
              <MastheadEyebrow>Request ID: {a.requestId}</MastheadEyebrow>
              <Tag tone="warn" dot sx={{ fontSize: 11.5, p: '4px 12px' }}>
                {a.status}
              </Tag>
            </Box>
          }
          title={a.title}
          subtitle={a.intro}
          subtitleSize={16.5}
        />

        <Box sx={{ position: 'relative', zIndex: 3, px: '28px', pb: '104px' }}>
          <LiftCard component="article" aria-label="Attestation request" sx={{ mt: '-52px', p: '8px 32px 32px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {a.details.map((d) => (
                  <DetailRow key={d.label} label={d.label}>
                    {d.strong && <strong>{d.strong}</strong>}
                    {d.value}
                  </DetailRow>
                ))}
                <DetailRow label="Shift Window Hours:">
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box component="span" sx={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.02em', color: 'og.head', fontVariantNumeric: 'tabular-nums' }}>
                      {a.shift.window}
                    </Box>
                    <Tag sx={detailTag}>{a.shift.total}</Tag>
                    <Tag tone="good" sx={detailTag}>
                      {a.shift.regular}
                    </Tag>
                    <Tag tone="warn" sx={detailTag}>
                      {a.shift.overtime}
                    </Tag>
                  </Box>
                </DetailRow>
                <DetailRow label={a.equipment.label}>{a.equipment.value}</DetailRow>
              </tbody>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="label" component="span" sx={{ lineHeight: 1.55 }}>
                {a.workDescriptionLabel}
              </Typography>
              <Box component="blockquote" sx={{ m: 0, p: '18px 20px', bgcolor: 'og.pale', fontSize: 16, lineHeight: 1.7, fontStyle: 'italic', borderRadius: '4px', color: 'og.ink' }}>
                {a.workDescription}
              </Box>
            </Box>

            <Box
              component="section"
              aria-label="Legal attestation"
              sx={(t) => ({ p: '20px 22px', bgcolor: t.palette.mode === 'dark' ? '#06101A' : '#00365D', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '4px' })}
            >
              <Box component="strong" sx={{ fontSize: 12, letterSpacing: '0.12em', lineHeight: 1.55 }}>
                {a.legalTitle}
              </Box>
              <Box component="p" sx={{ m: 0, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.88)' }}>
                {a.legalText}
              </Box>
            </Box>

            <Box
              component="label"
              sx={(t) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 3.5,
                p: '14px 18px',
                border: 1,
                borderColor: confirmed ? 'rgba(0,90,156,.35)' : t.palette.og.line,
                bgcolor: confirmed ? t.palette.og.blueTint : t.palette.og.card,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'border-color .15s, background .15s',
              })}
            >
              <Box
                component="input"
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed((e.target as HTMLInputElement).checked)}
                sx={(t) => {
                  const on = t.palette.mode === 'dark' ? '#2F7CC0' : t.palette.og.buttonBlue;
                  return {
                    appearance: 'none',
                    flex: 'none',
                    m: 0,
                    width: 26,
                    height: 26,
                    border: `1px solid ${t.palette.og.line}`,
                    borderRadius: '4px',
                    bgcolor: t.palette.og.card,
                    cursor: 'pointer',
                    '&:checked': {
                      bgcolor: on,
                      borderColor: on,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m3.5 8.4 2.8 2.8 6.2-6.4' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundSize: '18px 18px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    },
                    '&:focus-visible': { outline: `2px solid ${t.palette.og.blue}`, outlineOffset: 2 },
                  };
                }}
              />
              <Box component="span" sx={{ fontSize: 15.5, lineHeight: 1.55, color: 'og.ink' }}>
                {a.confirmText}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="label" component="span" id="sig-label">
                  Digital Signature:
                </Typography>
                <Button variant="outlined" onClick={clearPad}>
                  Clear Pad
                </Button>
              </Box>
              <Box
                {...(signed
                  ? { role: 'img', 'aria-label': `Signature pad with signature: ${a.signature}` }
                  : { component: 'button' as const, type: 'button', 'aria-label': 'Signature pad (empty)', onClick: () => setSigned(true) })}
                sx={(t) => ({
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  height: 190,
                  p: 0,
                  border: `1.5px dashed ${t.palette.og.blue}`,
                  bgcolor: t.palette.og.blueTint,
                  borderRadius: '4px',
                  cursor: signed ? 'default' : 'pointer',
                  font: 'inherit',
                  '&:focus-visible': { outline: `2px solid ${t.palette.og.blue}`, outlineOffset: 2 },
                })}
              >
                {signed ? (
                  <>
                    <Box component="span" sx={(t) => ({ position: 'absolute', left: 36, bottom: 56, fontFamily: SIGNATURE_FONT, fontSize: 42, lineHeight: 1.55, color: t.palette.mode === 'dark' ? '#B9D3F0' : '#0B2E59' })}>
                      {a.signature}
                    </Box>
                    <Box component="span" sx={{ position: 'absolute', left: 32, right: 32, bottom: 46, height: '1px', bgcolor: 'og.line' }} />
                    <Box component="span" sx={{ position: 'absolute', left: 32, right: 16, bottom: 16, fontSize: 12, lineHeight: 1.55, color: 'og.gray', fontVariantNumeric: 'tabular-nums' }}>
                      {a.signatureMeta}
                    </Box>
                  </>
                ) : (
                  <Box component="span" sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 13, color: 'og.gray' }}>
                    Sign here
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Button variant="contained" onClick={seal} sx={{ flex: '2 1 300px', px: '18px' }}>
                Confirm &amp; Digitally Seal Attestation
              </Button>
              <Button variant="outlined" onClick={() => setDisputeOpen(true)} sx={{ flex: '1 1 180px', px: '18px' }}>
                Dispute Hours
              </Button>
            </Box>
          </LiftCard>
        </Box>
      </Box>

      <ActionDialog
        open={sealOpen}
        onClose={() => setSealOpen(false)}
        eyebrow="Digital Seal"
        title="Seal this attestation?"
        okLabel="Confirm & Seal"
        onOk={() => toast({ title: 'Attestation sealed', message: 'Request Signature marked complete' })}
      >
        <p>Your signature is applied to the Jan 14–16 shift logs and the attestation is locked. This cannot be edited afterwards.</p>
      </ActionDialog>

      <ActionDialog
        open={disputeOpen}
        onClose={() => {
          setDisputeOpen(false);
          setDisputeNote('');
        }}
        danger
        eyebrow="Dispute"
        title="Dispute the recorded hours"
        okLabel="Submit Dispute"
        okDisabled={!disputeNote.trim()}
        onOk={() => toast({ title: 'Dispute submitted', message: 'grants manager notified' })}
      >
        <label className="field">
          Hours you can confirm
          <input placeholder="e.g. 4.0" autoFocus />
        </label>
        <label className="field">
          Explanation (required)
          <textarea required placeholder="Describe what differs from your field records" value={disputeNote} onChange={(e) => setDisputeNote(e.target.value)} />
        </label>
      </ActionDialog>
    </Box>
  );
}
