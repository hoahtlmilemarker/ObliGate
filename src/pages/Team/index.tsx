import { Box, Button, InputBase, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { AppShell } from '@/layout';
import { OgDialog, useToast } from '@/components';
import { CheckIcon, LockIcon, TrashIcon } from '@/icons';
import { capabilities, invites as INVITES, members as MEMBERS, permissions, projectAccessOptions, roles, type Invite, type Member, type RoleKey } from '@/data/team';
import { Masthead, MastheadEyebrow } from '../PreSubmission/Masthead';
import illustration from './illustration.svg';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_KEYS = Object.keys(roles) as RoleKey[];
const NARROW = '@media (max-width:1180px)';
const PHONE = '@media (max-width:640px)';
const STACK = '@media (max-width:760px)';

const inputSx = { height: 42, px: 3, border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', fontSize: 14, color: 'og.ink', '&.Mui-focused': { borderColor: 'og.blue', boxShadow: '0 0 0 3px rgba(0,90,156,.14)' } } as const;
const label = { fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'og.gray' } as const;

function Section({ title, description, children }: { title: string; description: ReactNode; children: ReactNode }) {
  return (
    <Box component="section" aria-label={title} sx={{ display: 'grid', gridTemplateColumns: '280px minmax(0,1fr)', gap: 8, py: 8, borderBottom: 1, borderColor: 'og.lineSoft', '&:last-of-type': { borderBottom: 0, pb: 4 }, [NARROW]: { gridTemplateColumns: 'minmax(0,1fr)', gap: 3.5, py: 6 } }}>
      <div>
        <Typography component="h2" sx={{ m: '0 0 6px', fontSize: 20, fontWeight: 300, color: 'og.head' }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, lineHeight: 1.55, color: 'og.gray' }}>{description}</Typography>
      </div>
      <Box sx={{ minWidth: 0, border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', overflow: 'hidden' }}>{children}</Box>
    </Box>
  );
}

function RolePill({ role }: { role: RoleKey }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: 24, px: '10px', borderRadius: '4px', bgcolor: `${roles[role].color}1F`, color: roles[role].color, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', '&::before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' } }}>
      {roles[role].label}
    </Box>
  );
}

function Avatar({ text, bg, muted }: { text: string; bg?: string; muted?: boolean }) {
  return (
    <Box sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: muted ? 'og.line' : bg, color: muted ? 'og.gray' : '#FFFFFF', fontSize: 11, fontWeight: 800 }}>{text}</Box>
  );
}

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** 15 · Team & Roles — invite, pending invitations, members, role permissions. */
export default function Team() {
  const toast = useToast();
  const [viewAs, setViewAs] = useState<'gm' | 'ga'>('gm');
  const manager = viewAs === 'gm';
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [invites, setInvites] = useState<Invite[]>(INVITES);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<RoleKey | ''>('');

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleKey>('ga');
  const [access, setAccess] = useState(projectAccessOptions[0]);
  const [dept, setDept] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [deptErr, setDeptErr] = useState('');
  const [sending, setSending] = useState(false);

  const [confirm, setConfirm] = useState<null | { title: string; body: string; ok: string; danger?: boolean; run: () => void }>(null);

  const list = members.filter((m) => (!filter || m.role === filter) && (!q || `${m.name} ${m.email} ${m.department} ${roles[m.role].label}`.toLowerCase().includes(q.toLowerCase())));
  const pending = invites.filter((i) => !i.expired).length;

  const send = () => {
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) return setEmailErr('Enter a valid work email.');
    if (members.some((m) => m.email === v)) return setEmailErr('This person is already on the team.');
    if (invites.some((i) => i.email === v && !i.expired)) return setEmailErr('An invitation is already pending for this email.');
    if (role === 'dl' && !dept.trim()) return setDeptErr('Add the department this liaison represents.');
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setInvites((p) => [{ id: `i${Date.now()}`, email: v, role, access: role === 'dl' ? dept.trim() : access, status: 'Sent just now · expires in 7 days' }, ...p.filter((i) => i.email !== v)]);
      setEmail('');
      setDept('');
      toast({ title: 'Invitation sent', message: `${v} · sample only, no email leaves this prototype` });
    }, 800);
  };

  const changeRole = (m: Member, next: RoleKey) => {
    const prev = m.role;
    const apply = () => {
      setMembers((p) => p.map((x) => (x.id === m.id ? { ...x, role: next } : x)));
      toast({ title: `${m.name} is now ${roles[next].label}`, action: { label: 'Undo', onClick: () => setMembers((p) => p.map((x) => (x.id === m.id ? { ...x, role: prev } : x))) } });
    };
    if (next === 'gm' || prev === 'gm')
      setConfirm({
        title: next === 'gm' ? `Make ${m.name} a Grants Manager?` : `Remove manager access from ${m.name}?`,
        body: next === 'gm' ? 'They will be able to invite people, change roles and approve the FEMA submission.' : 'They will no longer be able to manage the team or approve the submission.',
        ok: 'Change Role',
        run: apply,
      });
    else apply();
  };

  const remove = (m: Member) =>
    setConfirm({
      title: `Remove ${m.name} from the team?`,
      body: `${m.name} loses access to DR-4683-CA right away. Their uploads, reviews and signatures stay in the audit log.`,
      ok: 'Remove Member',
      danger: true,
      run: () => {
        const ix = members.findIndex((x) => x.id === m.id);
        setMembers((p) => p.filter((x) => x.id !== m.id));
        toast({ title: `${m.name} removed`, action: { label: 'Undo', onClick: () => setMembers((p) => [...p.slice(0, ix), m, ...p.slice(ix)]) } });
      },
    });

  const kpi = (k: string, v: number, sub?: string) => (
    <Box sx={{ p: '18px 20px', borderLeft: 1, borderColor: 'og.lineSoft', '&:first-of-type': { borderLeft: 0 }, [STACK]: { '&:nth-of-type(3)': { borderLeft: 0 }, '&:nth-of-type(-n+2)': { borderBottom: 1, borderColor: 'og.lineSoft' } } }}>
      <Box sx={{ ...label, fontSize: 10.5, letterSpacing: '.14em' }}>{k}</Box>
      <Typography sx={{ mt: 2, font: '500 32px/1 "Cormorant Garamond", Georgia, serif', fontVariantNumeric: 'lining-nums', color: 'og.head' }}>{v}</Typography>
      {sub && <Typography sx={{ mt: 1.5, fontSize: 12, color: 'og.gray' }}>{sub}</Typography>}
    </Box>
  );

  const th = { p: '12px 10px', textAlign: 'left', fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'og.gray', bgcolor: 'og.pale', borderBottom: 1, borderColor: 'og.line', whiteSpace: 'nowrap', '&:first-of-type': { pl: 5 }, '&:last-of-type': { pr: 4 } } as const;
  const td = { p: '14px 10px', borderTop: 1, borderColor: 'og.lineSoft', fontSize: 13, color: 'og.ink', verticalAlign: 'middle', '&:first-of-type': { pl: 5 }, '&:last-of-type': { pr: 4, textAlign: 'right' }, [STACK]: { display: 'block', p: '3px 0 !important', border: 0, textAlign: 'left !important' } } as const;

  return (
    <AppShell searchLabel="Search...">
      <Box sx={{ flex: 1, bgcolor: 'og.pale' }}>
        <Masthead
          variant="settings"
          illustration={illustration}
          eyebrow={<MastheadEyebrow>Organization</MastheadEyebrow>}
          title="Team & Roles"
          subtitle="Invite colleagues, assign their FEMA workflow role, and control who can sign attestations or submit a claim."
        />
        <Box sx={{ px: '28px', pb: 4, [PHONE]: { px: 4 } }}>
          <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
            <Section title="Team overview" description="LA County Public Works · DR-4683-CA. Sample people and addresses; no email is sent from this prototype.">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', borderBottom: 1, borderColor: 'og.lineSoft', [STACK]: { gridTemplateColumns: 'repeat(2, minmax(0,1fr))' } }}>
                {kpi('Members', members.length)}
                {kpi('Pending invites', pending, `${invites.length - pending} expired`)}
                {kpi('Approve submission', members.filter((m) => permissions[m.role][5]).length)}
                {kpi('Sign attestations', members.filter((m) => permissions[m.role][4]).length)}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px 20px', p: '16px 20px' }}>
                <div>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>Viewing as</Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'og.gray' }}>Prototype only: preview what a non-manager sees.</Typography>
                </div>
                <Box role="group" aria-label="Viewing as" sx={{ display: 'inline-flex', p: '3px', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.pale' }}>
                  {(['gm', 'ga'] as const).map((k) => (
                    <Box key={k} component="button" type="button" aria-pressed={viewAs === k} onClick={() => setViewAs(k)} sx={{ height: 28, px: 3, border: 0, borderRadius: '3px', bgcolor: viewAs === k ? 'og.card' : 'transparent', boxShadow: viewAs === k ? '0 1px 2px rgba(6,36,63,.12)' : 'none', font: '600 12.5px Manrope, Arial, sans-serif', color: viewAs === k ? 'og.head' : 'og.gray', cursor: 'pointer' }}>
                      {roles[k].label}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Section>

            {!manager && (
              <Box role="note" sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mt: 6, p: '14px 18px', border: 1, borderColor: 'rgba(176,138,78,.35)', borderLeft: '3px solid', borderLeftColor: 'og.brass', borderRadius: '4px', bgcolor: 'og.brassTint', fontSize: 13, color: 'og.ink' }}>
                <LockIcon size={16} />
                <span>
                  <b>View only.</b> Only a Grants Manager can invite people, change roles or remove members. Ask Rosa Keith if someone needs access.
                </span>
              </Box>
            )}

            {manager && (
              <Section title="Invite a team member" description="They get an email link and join after signing in with County SSO. Invites expire after 7 days.">
                <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); send(); }} sx={{ p: '20px 24px', [PHONE]: { px: 4 } }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, [PHONE]: { gridTemplateColumns: '1fr' } }}>
                    <Box component="label" sx={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box component="span" sx={label}>Work email</Box>
                      <InputBase value={email} onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }} type="email" placeholder="name@agency.gov" autoComplete="off" inputProps={{ 'aria-invalid': !!emailErr }} sx={{ ...inputSx, ...(emailErr && { borderColor: 'og.risk' }) }} />
                      {emailErr && <Box aria-live="polite" sx={{ fontSize: 12, color: 'og.risk' }}>{emailErr}</Box>}
                    </Box>
                    <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box component="span" sx={label}>Role</Box>
                      <Box component="select" value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRole(e.target.value as RoleKey); setDeptErr(''); }} sx={{ ...inputSx, font: '500 14px Manrope, Arial, sans-serif' }}>
                        {ROLE_KEYS.map((k) => <option key={k} value={k}>{roles[k].label}</option>)}
                      </Box>
                    </Box>
                    {role === 'dl' ? (
                      <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box component="span" sx={label}>Department</Box>
                        <InputBase value={dept} onChange={(e) => { setDept(e.target.value); setDeptErr(''); }} placeholder="e.g. Stormwater" sx={{ ...inputSx, ...(deptErr && { borderColor: 'og.risk' }) }} />
                        {deptErr && <Box aria-live="polite" sx={{ fontSize: 12, color: 'og.risk' }}>{deptErr}</Box>}
                      </Box>
                    ) : (
                      <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box component="span" sx={label}>Project access</Box>
                        <Box component="select" value={access} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAccess(e.target.value)} sx={{ ...inputSx, font: '500 14px Manrope, Arial, sans-serif' }}>
                          {projectAccessOptions.map((p) => <option key={p}>{p}</option>)}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mt: 4, p: '12px 14px', borderRadius: '4px', bgcolor: 'og.blueTint', fontSize: 12.5, lineHeight: 1.5, color: 'og.ink' }}>
                    <b>{roles[role].label}.</b> {roles[role].description}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5 }}>
                      {capabilities.map((c, i) =>
                        permissions[role][i] ? (
                          <Box key={c} component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, height: 22, px: 2, borderRadius: '4px', bgcolor: 'og.card', border: 1, borderColor: 'og.line', fontSize: 11.5, fontWeight: 600, color: 'og.head', '& svg': { color: 'og.good' } }}>
                            <CheckIcon size={12} />
                            {c}
                          </Box>
                        ) : null,
                      )}
                    </Box>
                  </Box>
                  <Button type="submit" variant="contained" disabled={sending} sx={{ mt: 4.5 }}>
                    {sending ? 'Sending…' : 'Send Invitation'}
                  </Button>
                </Box>
              </Section>
            )}

            {manager && (
              <Section title="Pending invitations" description={invites.length ? `${invites.length} waiting to be accepted. Resend a link or revoke it.` : 'No open invitations.'}>
                {invites.length ? (
                  invites.map((i, ix) => (
                    <Box key={i.id} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3.5, p: '16px 20px', borderTop: ix ? 1 : 0, borderColor: 'og.lineSoft' }}>
                      <Avatar text={i.email[0].toUpperCase()} muted />
                      <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'og.head' }}>{i.email}</Typography>
                        <Typography sx={{ fontSize: 12.5, color: 'og.gray' }}>{roles[i.role].label} · {i.access}</Typography>
                        <Typography sx={{ mt: 1, fontSize: 12, color: i.expired ? 'og.risk' : 'og.gray', fontWeight: i.expired ? 700 : 400 }}>{i.status}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setInvites((p) => p.map((x) => (x.id === i.id ? { ...x, status: 'Sent just now · expires in 7 days', expired: false } : x)));
                            toast({ title: 'Invitation sent again', message: i.email });
                          }}
                        >
                          {i.expired ? 'Send Again' : 'Resend'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setConfirm({
                              title: `Revoke the invite for ${i.email}?`,
                              body: 'The link in their email stops working. You can invite them again later.',
                              ok: 'Revoke',
                              danger: true,
                              run: () => {
                                setInvites((p) => p.filter((x) => x.id !== i.id));
                                toast({ title: 'Invitation revoked', message: i.email });
                              },
                            })
                          }
                        >
                          Revoke
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ p: '36px 24px', textAlign: 'center', fontSize: 13, color: 'og.gray' }}>Everyone you invited has joined.</Typography>
                )}
              </Section>
            )}

            <Section title="Members" description={`${list.length === members.length ? `${members.length} people` : `Showing ${list.length} of ${members.length}`}. ${manager ? 'Change a role from the list; managers need a confirmation.' : 'Roles are set by a Grants Manager.'}`}>
              <Box sx={{ display: 'flex', gap: 2.5, p: '16px 20px', borderBottom: 1, borderColor: 'og.lineSoft', [STACK]: { flexWrap: 'wrap' } }}>
                <InputBase value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search name, email, role…" inputProps={{ 'aria-label': 'Search members' }} sx={{ ...inputSx, height: 38, flex: 1 }} />
                <Box component="select" aria-label="Filter by role" value={filter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as RoleKey | '')} sx={{ ...inputSx, height: 38, width: 180, font: '500 13.5px Manrope, Arial, sans-serif', [STACK]: { width: '100%' } }}>
                  <option value="">All roles</option>
                  {ROLE_KEYS.map((k) => <option key={k} value={k}>{roles[k].label}</option>)}
                </Box>
              </Box>
              {list.length ? (
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', [STACK]: { '& thead': { display: 'none' }, '& tbody, & tr': { display: 'block' }, '& tr': { position: 'relative', p: '14px 16px', borderTop: 1, borderColor: 'og.lineSoft' } } }}>
                  <thead>
                    <tr>
                      <Box component="th" sx={th}>Member</Box>
                      <Box component="th" sx={th}>Role</Box>
                      <Box component="th" sx={th}>Access</Box>
                      <Box component="th" sx={th}>Last active</Box>
                      {manager && <Box component="th" sx={th}><Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Actions</Box></Box>}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((m) => {
                      const me = manager ? !!m.me : m.id === 2;
                      return (
                        <tr key={m.id}>
                          <Box component="td" sx={td}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 0 }}>
                              <Avatar text={initials(m.name)} bg={roles[m.role].color} />
                              <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 14, fontWeight: 700, color: 'og.head' }}>
                                  {m.name}
                                  {me && <Box component="span" sx={{ px: '7px', borderRadius: '4px', bgcolor: 'og.brassTint', color: '#9A7740', fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>You</Box>}
                                </Typography>
                                <Typography noWrap sx={{ fontSize: 12, color: 'og.gray' }}>{m.email}</Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box component="td" sx={td}>
                            {manager && !me ? (
                              <Box component="select" aria-label={`Role for ${m.name}`} value={m.role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeRole(m, e.target.value as RoleKey)} sx={{ height: 32, px: '10px', border: 1, borderColor: 'og.line', borderRadius: '4px', bgcolor: 'og.card', font: '700 12px Manrope, Arial, sans-serif', color: 'og.head', cursor: 'pointer' }}>
                                {ROLE_KEYS.map((k) => <option key={k} value={k}>{roles[k].label}</option>)}
                              </Box>
                            ) : (
                              <RolePill role={m.role} />
                            )}
                          </Box>
                          <Box component="td" sx={td}>
                            <Box sx={{ whiteSpace: 'nowrap' }}>{m.access}</Box>
                            <Box sx={{ mt: '2px', fontSize: 12, color: 'og.gray', whiteSpace: 'nowrap' }}>{m.department}</Box>
                          </Box>
                          <Box component="td" sx={{ ...td, fontSize: 12, color: 'og.gray', whiteSpace: 'nowrap' }}>{m.lastActive}</Box>
                          {manager && (
                            <Box component="td" sx={{ ...td, width: 32, [STACK]: { position: 'absolute', top: 14, right: 12, width: 'auto' } }}>
                              {me ? (
                                <Box component="span" title="You can’t remove yourself" sx={{ color: 'og.gray' }}><LockIcon size={14} /></Box>
                              ) : (
                                <Box component="button" type="button" aria-label={`Remove ${m.name}`} title="Remove from team" onClick={() => remove(m)} sx={{ display: 'inline-grid', placeItems: 'center', width: 32, height: 32, border: 1, borderColor: 'transparent', borderRadius: '4px', bgcolor: 'transparent', color: 'og.gray', cursor: 'pointer', '&:hover': { borderColor: 'rgba(168,46,35,.3)', bgcolor: 'og.riskTint', color: 'og.risk' } }}>
                                  <TrashIcon size={16} />
                                </Box>
                              )}
                            </Box>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Box>
              ) : (
                <Box sx={{ p: '36px 24px', textAlign: 'center', fontSize: 13, color: 'og.gray' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'og.head', mb: 1 }}>No members match</Typography>
                  Try another name or role.
                </Box>
              )}
            </Section>

            <Section title="What each role can do" description="Follows FEMA PA separation of duties: the person who documents work does not approve the claim.">
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { p: '11px 6px', borderTop: 1, borderColor: 'og.lineSoft', textAlign: 'center', fontSize: 12.5 }, '& th:first-of-type, & td:first-of-type': { textAlign: 'left', pl: 5 }, '& th:last-of-type, & td:last-of-type': { pr: 5 } }}>
                  <thead>
                    <tr>
                      <Box component="th" sx={{ borderTop: '0 !important', fontSize: '9.5px !important', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'og.gray', verticalAlign: 'bottom' }}>Role</Box>
                      {capabilities.map((c) => (
                        <Box key={c} component="th" sx={{ borderTop: '0 !important', fontSize: '9.5px !important', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'og.gray', verticalAlign: 'bottom', lineHeight: 1.35 }}>{c}</Box>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_KEYS.map((k) => (
                      <Box component="tr" key={k} sx={k === viewAs ? { '& td': { bgcolor: 'og.brassTint' } } : undefined}>
                        <td><RolePill role={k} /></td>
                        {permissions[k].map((v, i) => (
                          <td key={i}>
                            {v ? (
                              <Box component="span" aria-label="Yes" sx={{ display: 'inline-grid', placeItems: 'center', width: 22, height: 22, borderRadius: '50%', bgcolor: 'og.goodTint', color: 'og.good' }}><CheckIcon size={12} /></Box>
                            ) : (
                              <Box component="span" aria-label="No" sx={{ color: 'og.line', fontWeight: 700 }}>—</Box>
                            )}
                          </td>
                        ))}
                      </Box>
                    ))}
                  </tbody>
                </Box>
              </Box>
            </Section>
          </Box>
        </Box>
      </Box>

      <OgDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        danger={confirm?.danger}
        eyebrow={confirm?.danger ? 'Please confirm' : 'Change role'}
        title={confirm?.title ?? ''}
        confirmLabel={confirm?.ok}
        onConfirm={() => {
          confirm?.run();
          setConfirm(null);
        }}
      >
        {confirm?.body}
      </OgDialog>
    </AppShell>
  );
}
