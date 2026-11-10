import { Box, Button, InputBase } from '@mui/material';
import { useRef, useState } from 'react';
import { useToast } from '@/components';
import { brand } from '@/theme/tokens';
import { profile } from '@/data/myProfile';
import { Tag } from '../PreSubmission/ui';
import illustration from './illustration.svg';
import { CardBody, SaveBar, SettingRow, SettingsPage, SettingsSection } from './SettingsLayout';

type Values = Record<string, string>;
const initial: Values = Object.fromEntries(profile.fields.map((f) => [f.id, f.value]));

/** 10 · My Profile — identity, role & access, sign-in security. */
export default function MyProfile() {
  const toast = useToast();
  const [base, setBase] = useState<Values>(initial);
  const [values, setValues] = useState<Values>(initial);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = profile.fields.some((f) => values[f.id] !== base[f.id]);

  const onPhoto = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      setPhoto(String(r.result));
      toast({ title: 'Photo updated' });
    };
    r.readAsDataURL(file);
  };

  return (
    <SettingsPage
      active="profile"
      title="My Profile"
      subtitle="Your identity, role and sign-in security for ObliGate."
      illustration={illustration}
      footer={
        <SaveBar
          dirty={dirty}
          onDiscard={() => setValues(base)}
          onSave={() => {
            setBase(values);
            toast({ title: 'Settings saved' });
          }}
        />
      }
    >
      <SettingsSection title="Personal Information" description="Shown on reviews, attestations and audit history.">
        <CardBody>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 5, pb: 5, borderBottom: 1, borderColor: 'og.lineSoft' }}>
            <Box
              component="span"
              role="img"
              aria-label={`${profile.name} profile photo`}
              sx={{
                width: 64,
                height: 64,
                flex: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: photo ? 'transparent' : brand.navy,
                backgroundImage: photo ? `url(${photo})` : brand.avatarGradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {profile.initials}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box component="b" sx={{ display: 'block', fontSize: 17, lineHeight: 1.55, color: 'og.head' }}>
                {profile.name}
              </Box>
              <Box component="small" sx={{ display: 'block', mt: '3px', fontSize: 13, lineHeight: 1.55, color: 'og.gray' }}>
                {profile.subtitle}
              </Box>
            </Box>
            <Button variant="outlined" size="small" sx={{ ml: 'auto', flex: 'none' }} onClick={() => fileRef.current?.click()}>
              Change Photo
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              aria-hidden
              tabIndex={-1}
              onChange={(e) => {
                onPhoto(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '16px 20px', '@media (max-width:900px)': { gridTemplateColumns: 'minmax(0,1fr)' } }}>
            {profile.fields.map((f) => (
              <Box key={f.id} component="label" htmlFor={f.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
                <Box component="span" sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'og.gray' }}>
                  {f.label}
                </Box>
                <InputBase
                  id={f.id}
                  type={f.type}
                  value={values[f.id]}
                  readOnly={f.readOnly}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                  inputProps={f.hint ? { 'aria-describedby': `${f.id}-hint` } : undefined}
                  sx={(t) => ({
                    height: 36,
                    px: 3,
                    border: 1,
                    borderColor: 'og.line',
                    borderRadius: '4px',
                    bgcolor: f.readOnly ? 'og.pale' : 'og.card',
                    color: f.readOnly ? 'og.gray' : 'og.ink',
                    fontSize: 13.5,
                    fontWeight: 500,
                    transition: 'border-color .15s, box-shadow .15s',
                    '& input': { p: 0, height: '100%' },
                    '&:hover': { borderColor: f.readOnly ? 'og.line' : '#9AA6B2' },
                    '&.Mui-focused': { borderColor: 'og.blue', boxShadow: `0 0 0 3px ${t.palette.mode === 'dark' ? 'rgba(90,167,230,.25)' : 'rgba(0,90,156,.14)'}` },
                  })}
                />
                {f.hint && (
                  <Box component="small" id={`${f.id}-hint`} sx={{ fontSize: 12, lineHeight: 1.55, color: 'og.gray' }}>
                    {f.hint}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </CardBody>
      </SettingsSection>

      <SettingsSection title="Role & Access" description="Assigned by your organization admin.">
        <CardBody>
          <SettingRow title={profile.assignment.title} description={profile.assignment.detail}>
            <Tag tone="good">{profile.assignment.status}</Tag>
          </SettingRow>
          <SettingRow title="Permissions" description="What you can do in this workspace.">
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 1.5 }} aria-label="Permissions">
              {profile.permissions.map((p) => (
                <Tag key={p}>{p}</Tag>
              ))}
            </Box>
          </SettingRow>
        </CardBody>
      </SettingsSection>

      <SettingsSection title="Sign-in & Security" description="Your account signs in through County SSO.">
        <CardBody>
          <SettingRow title={profile.sso.title} description={profile.sso.detail}>
            <Tag tone="good">{profile.sso.status}</Tag>
          </SettingRow>
          <SettingRow title={profile.sessions.title} description={profile.sessions.detail}>
            <Button variant="outlined" size="small" sx={{ flex: 'none' }} onClick={() => toast({ title: 'Other sessions signed out' })}>
              Sign Out Other Sessions
            </Button>
          </SettingRow>
        </CardBody>
      </SettingsSection>
    </SettingsPage>
  );
}
