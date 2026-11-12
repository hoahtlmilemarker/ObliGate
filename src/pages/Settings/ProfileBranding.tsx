import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useToast } from '@/components';
import { accountProfile } from '@/data/settings';
import { SettingsShell } from './SettingsShell';
import { Field, Pill, SCard, SCardBody, SCardHead, SLabel } from './ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, '@media (max-width:760px)': { gridTemplateColumns: '1fr' } } as const;
const actions = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, mt: 4.5, '& .MuiButton-root.Mui-disabled': { opacity: 0.45 } } as const;

/** 10 · Settings / Profile & branding — profile fields, password, email. */
export default function ProfileBranding() {
  const toast = useToast();
  const [saved, setSaved] = useState({ name: accountProfile.name, title: accountProfile.jobTitle });
  const [name, setName] = useState(saved.name);
  const [title, setTitle] = useState(saved.title);
  const [savedNote, setSavedNote] = useState('');
  const dirty = name.trim() !== saved.name || title.trim() !== saved.title;

  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const pwMsg = !p1 && !p2 ? '' : p1.length < 12 ? 'Use at least 12 characters.' : p2 && p1 !== p2 ? 'Passwords don’t match.' : p1 === p2 ? 'Passwords match.' : '';
  const pwOk = p1.length >= 12 && p1 === p2;
  const [busy, setBusy] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pending, setPending] = useState('');

  return (
    <SettingsShell active="profile">
      <SCard top>
        <SCardHead title="Profile" description="Your personal account details." />
        <SCardBody>
          <Box sx={grid}>
            <Field label="Full name" value={name} onChange={(v) => { setName(v); setSavedNote(''); }} autoComplete="name" message={name.trim() ? '' : 'Name can’t be empty.'} />
            <Field label="Job title" value={title} onChange={(v) => { setTitle(v); setSavedNote(''); }} autoComplete="organization-title" />
          </Box>
          <Box sx={actions}>
            <Button
              variant="contained"
              disabled={!dirty || !name.trim()}
              onClick={() => {
                setSaved({ name: name.trim(), title: title.trim() });
                setSavedNote('Saved just now');
                toast({ title: 'Profile saved' });
              }}
            >
              Save Profile
            </Button>
            <Typography component="small" sx={{ fontSize: 12, color: 'og.gray' }}>{dirty ? 'Unsaved changes' : savedNote || 'No unsaved changes'}</Typography>
          </Box>
        </SCardBody>
      </SCard>

      <SCard>
        <SCardHead title="Account" description="Sign-in password and the email ObliGate uses to reach you." />
        <SCardBody>
          <SLabel>Change password</SLabel>
          <Box sx={grid}>
            <Field label="New password" type="password" value={p1} onChange={setP1} autoComplete="new-password" placeholder="At least 12 characters" />
            <Field label="Confirm new password" type="password" value={p2} onChange={setP2} autoComplete="new-password" placeholder="Type it again" message={pwMsg} ok={pwOk} />
          </Box>
          <Box sx={actions}>
            <Button
              variant="contained"
              disabled={!pwOk || busy}
              onClick={() => {
                setBusy(true);
                setTimeout(() => {
                  setBusy(false);
                  setP1('');
                  setP2('');
                  toast({ title: 'Password updated', message: 'other sessions were signed out' });
                }, 700);
              }}
            >
              {busy ? 'Updating…' : 'Update Password'}
            </Button>
          </Box>

          <Box sx={{ height: '1px', my: 5.5, bgcolor: 'og.lineSoft' }} />
          <SLabel>Change email</SLabel>
          {!editingEmail ? (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{accountProfile.email}</Typography>
                {pending ? <Pill tone="mid">Change pending: {pending}</Pill> : <Pill tone="good">Verified</Pill>}
                {!pending && (
                  <Button variant="outlined" size="small" onClick={() => setEditingEmail(true)}>
                    Update Email
                  </Button>
                )}
              </Box>
              {pending && <Typography sx={{ mt: 2, fontSize: 12.5, color: 'og.gray' }}>We sent a link to {pending}. Sample only: no email leaves this prototype.</Typography>}
            </>
          ) : (
            <>
              <Box sx={grid}>
                <Field label="New email" type="email" value={newEmail} onChange={(v) => { setNewEmail(v); setEmailErr(''); }} placeholder="name@agency.gov" message={emailErr} />
              </Box>
              <Box sx={actions}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!EMAIL_RE.test(newEmail.trim())) return setEmailErr('Enter a valid email.');
                    setPending(newEmail.trim());
                    setEditingEmail(false);
                    toast({ title: 'Verification link sent', message: newEmail.trim() });
                  }}
                >
                  Send Verification Link
                </Button>
                <Button variant="outlined" onClick={() => { setEditingEmail(false); setNewEmail(''); setEmailErr(''); }}>
                  Cancel
                </Button>
                <Typography component="small" sx={{ fontSize: 12, color: 'og.gray' }}>Your email changes after you click the link we send.</Typography>
              </Box>
            </>
          )}
        </SCardBody>
      </SCard>
    </SettingsShell>
  );
}
