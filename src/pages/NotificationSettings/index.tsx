import { Box } from '@mui/material';
import { useState } from 'react';
import { useToast } from '@/components';
import { deliveryDefaults, digestOptions, notificationGroups } from '@/data/notificationSettings';
import { CardBody, SaveBar, SettingRow, SettingsPage, SettingsSection, ToggleSwitch } from '../MyProfile/SettingsLayout';
import illustration from './illustration.svg';

interface State {
  events: Record<string, { inApp: boolean; email: boolean }>;
  digest: string;
  quietHours: boolean;
  pauseEmail: boolean;
}

const initial: State = {
  events: Object.fromEntries(notificationGroups.flatMap((g) => g.events).map((e) => [e.id, { inApp: e.inApp, email: e.email }])),
  ...deliveryDefaults,
};

const PHONE = '@media (max-width:640px)';

/** 11 · Notification Settings — event × channel matrix and email delivery options. */
export default function NotificationSettings() {
  const toast = useToast();
  const [base, setBase] = useState<State>(initial);
  const [s, setS] = useState<State>(initial);
  const dirty = JSON.stringify(s) !== JSON.stringify(base);

  const setEvent = (id: string, ch: 'inApp' | 'email', v: boolean) => setS((p) => ({ ...p, events: { ...p.events, [id]: { ...p.events[id], [ch]: v } } }));

  const th = {
    p: '10px 12px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'og.gray',
    bgcolor: 'og.pale',
    borderBottom: 1,
    borderColor: 'og.line',
  } as const;
  const chCol = { width: 96, textAlign: 'center', '&:last-of-type': { width: 120, pr: 6 }, [PHONE]: { width: 52, px: 1, '&:last-of-type': { width: 52, px: 1 } } } as const;

  return (
    <SettingsPage
      active="notifications"
      title="Notification Settings"
      subtitle="Choose which events reach you, and where."
      illustration={illustration}
      footer={
        <SaveBar
          dirty={dirty}
          onDiscard={() => setS(base)}
          onSave={() => {
            setBase(s);
            toast({ title: 'Settings saved' });
          }}
        />
      }
    >
      <SettingsSection title="Events" description="Applies to DR-4673-CA and every project you are assigned to.">
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', [PHONE]: { tableLayout: 'auto' } }}>
          <thead>
            <tr>
              <Box component="th" scope="col" sx={{ ...th, pl: 6 }}>
                Event
              </Box>
              <Box component="th" scope="col" sx={{ ...th, ...chCol }}>
                In-app
              </Box>
              <Box component="th" scope="col" sx={{ ...th, ...chCol }}>
                Email
              </Box>
            </tr>
          </thead>
          <tbody>
            {notificationGroups.map((g) => [
              <tr key={g.label}>
                <Box component="th" colSpan={3} scope="colgroup" sx={{ p: '10px 24px', textAlign: 'left', bgcolor: 'og.card', fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'og.blue', borderBottom: 1, borderColor: 'og.lineSoft' }}>
                  {g.label}
                </Box>
              </tr>,
              ...g.events.map((e, i) => {
                const last = i === g.events.length - 1 && g === notificationGroups[notificationGroups.length - 1];
                const td = { p: '14px 12px', verticalAlign: 'middle', borderBottom: last ? 0 : 1, borderColor: 'og.lineSoft' } as const;
                return (
                  <tr key={e.id}>
                    <Box component="td" sx={{ ...td, pl: 6 }}>
                      <Box component="b" sx={{ display: 'block', fontSize: 14, lineHeight: 1.55, color: 'og.head' }}>
                        {e.title}
                      </Box>
                      <Box component="small" sx={{ display: 'block', mt: '3px', fontSize: 12.5, lineHeight: 1.55, color: 'og.gray' }}>
                        {e.description}
                      </Box>
                    </Box>
                    <Box component="td" sx={{ ...td, ...chCol }}>
                      <ToggleSwitch checked={s.events[e.id].inApp} onChange={(v) => setEvent(e.id, 'inApp', v)} label={`${e.title} in app`} sx={{ mx: 'auto' }} />
                    </Box>
                    <Box component="td" sx={{ ...td, ...chCol }}>
                      <ToggleSwitch checked={s.events[e.id].email} onChange={(v) => setEvent(e.id, 'email', v)} label={`${e.title} by email`} sx={{ mx: 'auto' }} />
                    </Box>
                  </tr>
                );
              }),
            ])}
          </tbody>
        </Box>
      </SettingsSection>

      <SettingsSection title="Delivery" description="How and when email arrives.">
        <CardBody>
          <SettingRow title="Email digest" description="Bundle non-urgent emails into one summary.">
            <Box
              component="select"
              id="nd1"
              aria-label="Digest delivery time"
              value={s.digest}
              onChange={(e) => setS((p) => ({ ...p, digest: (e.target as HTMLSelectElement).value }))}
              sx={(t) => ({
                appearance: 'none',
                boxSizing: 'border-box',
                maxWidth: 260,
                height: 36,
                p: '0 44px 0 14px',
                border: 1,
                borderColor: 'og.line',
                borderRadius: '4px',
                bgcolor: 'og.card',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='%23${t.palette.mode === 'dark' ? 'A9B4C0' : '60666C'}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '12px 12px',
                color: 'og.ink',
                font: '500 13.5px Manrope, Arial, sans-serif',
                cursor: 'pointer',
                transition: 'border-color .15s, box-shadow .15s',
                '&:hover': { borderColor: '#9AA6B2' },
                '&:focus': { outline: 'none', borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.14)' },
              })}
            >
              {digestOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Box>
          </SettingRow>
          <SettingRow title="Quiet hours" description="Hold email between 7:00 PM and 7:00 AM. Signature requests still go out.">
            <ToggleSwitch checked={s.quietHours} onChange={(v) => setS((p) => ({ ...p, quietHours: v }))} label="Quiet hours" />
          </SettingRow>
          <SettingRow title="Pause all email" description="In-app notifications keep working.">
            <ToggleSwitch checked={s.pauseEmail} onChange={(v) => setS((p) => ({ ...p, pauseEmail: v }))} label="Pause all email" />
          </SettingRow>
        </CardBody>
      </SettingsSection>
    </SettingsPage>
  );
}
