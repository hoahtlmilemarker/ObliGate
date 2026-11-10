import { Box, type SxProps, type Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { ReactNode } from 'react';
import { origTimesheet, postMiles, spreadsheetPreview, timesheetWeek, workDescriptions, type ReviewDoc } from '@/data/review';

/** Scanned-paper colours: the paper stays cream in both themes (it is an image of a document). */
const INK = '#2A261F';
const MUTED = '#6B6458';
const RULE = '#DDD4C3';
const SCRIPT = "'Segoe Script', 'Bradley Hand', cursive";
const ARIAL = 'Arial, sans-serif';

/** MM/DD/YYYY from ISO date. */
export function us(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function weekdays(a: string, b: string) {
  const out: string[] = [];
  const d = new Date(`${a}T12:00:00`);
  const e = new Date(`${b}T12:00:00`);
  while (d <= e) {
    const w = d.getDay();
    if (w > 0 && w < 6) out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** Bounding box drawn around a value the AI extracted. */
function BB({ children, flag, title, sx }: { children: ReactNode; flag?: boolean; title?: string; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      title={title}
      sx={[
        { p: '1px 4px', borderRadius: '4px', outline: '1.5px solid rgba(0,90,156,.55)', outlineOffset: '2px', bgcolor: 'rgba(0,90,156,.06)' },
        !!flag && { outline: '2px solid #E07A2C', bgcolor: 'rgba(224,122,44,.16)' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

function Head({ title, sub = 'FEMA-4673-DR-CA · EMERGENCY WORK DISASTER RECOVERY' }: { title: string; sub?: string }) {
  return (
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1, pb: 3, borderBottom: `2px solid ${INK}` }}>
      <Box component="span" sx={{ fontSize: 15, fontWeight: 700, letterSpacing: '.03em' }}>
        COUNTY OF LOS ANGELES · DEPARTMENT OF PUBLIC WORKS
      </Box>
      <Box component="span" sx={{ fontFamily: ARIAL, fontSize: 11, letterSpacing: '.05em' }}>
        {title}
      </Box>
      <Box component="span" sx={{ fontFamily: ARIAL, fontSize: 10, color: MUTED }}>
        {sub}
      </Box>
    </Box>
  );
}

type KV = [ReactNode, ReactNode, ReactNode?, ReactNode?];
function KvTable({ rows }: { rows: KV[] }) {
  return (
    <table>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <th scope="row">{r[0]}</th>
            <td>{r[1]}</td>
            <th scope="row">{r[2] ?? ''}</th>
            <td>{r[3] ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Sigs({ a, b }: { a: [string, ReactNode]; b: [string, ReactNode] }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 6, pt: 4 }}>
      {[a, b].map((x, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, borderTop: `1px solid ${INK}`, pt: 1.5 }}>
          <Box component="span" sx={{ fontFamily: SCRIPT, fontSize: 16, minHeight: 22 }}>
            {x[0] || ' '}
          </Box>
          <Box component="span" sx={{ fontFamily: ARIAL, fontSize: 10, color: MUTED }}>
            {x[1]}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

const NoteBox = ({ children }: { children: ReactNode }) => (
  <Box sx={{ fontFamily: ARIAL, fontSize: 12, lineHeight: 1.7, border: '1px solid #D8D2C4', p: '12px 14px' }}>{children}</Box>
);

const R = { textAlign: 'right' } as const;

function OrigPreview() {
  const o = origTimesheet;
  return (
    <>
      <Head title="FORCE-ACCOUNT LABOR DAILY REPORT & SUMMARY TIMESHEET" />
      <KvTable
        rows={[
          ['EMPLOYEE NAME:', <BB title={`Employee: ${o.header.emp}`}>{o.header.emp}</BB>, 'EMP ID #:', o.header.empId],
          ['CLASSIFICATION:', <BB title={`Title: ${o.header.cls}`}>{o.header.cls}</BB>, 'HOURLY RATE:', o.header.rate],
          ['PAY PERIOD:', <BB title="Pay Period: 01/01/2023 - 01/14/2023">{o.header.period}</BB>, 'PCA CODE:', o.header.pca],
        ]}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Location / Description of Work</th>
            <th style={R}>Reg Hrs</th>
            <th style={R}>OT Hrs</th>
          </tr>
        </thead>
        <tbody>
          {o.rows.map((r) => (
            <tr key={r.date}>
              <td>{r.date}</td>
              <td>{r.desc}</td>
              <td style={R}>{r.reg}</td>
              <td style={R}>
                {r.flagged ? (
                  <BB flag title="OCR Ambiguity: Overtime 8.0 hrs" sx={{ fontFamily: SCRIPT, fontSize: 14 }}>
                    {r.ot}
                  </BB>
                ) : (
                  r.ot
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ fontWeight: 700 }}>
              TOTAL HOURS:
            </td>
            <td style={{ ...R, fontWeight: 700 }}>
              <BB title="Regular Hours: 40.0">{o.totals.reg}</BB>
            </td>
            <td style={{ ...R, fontWeight: 700 }}>{o.totals.ot}</td>
          </tr>
        </tbody>
      </table>
      <Sigs a={o.signatures[0]} b={o.signatures[1]} />
    </>
  );
}

function Preview({ d }: { d: ReviewDoc }) {
  switch (d.k) {
    case 'orig':
      return <OrigPreview />;
    case 'ts': {
      const days = d.reg > 40 ? weekdays(d.per[0], d.per[1]) : timesheetWeek;
      return (
        <>
          <Head title="FORCE-ACCOUNT LABOR DAILY REPORT & SUMMARY TIMESHEET" />
          <KvTable
            rows={[
              ['EMPLOYEE NAME:', <BB>{d.emp}</BB>, 'HOURLY RATE:', `$${d.rate} / hr`],
              ['CLASSIFICATION:', <BB>{d.cls}</BB>, 'PCA CODE:', 'PCA-89420'],
              ['PAY PERIOD:', <BB>{`${us(d.per[0])} – ${us(d.per[1])}`}</BB>],
            ]}
          />
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location / Description of Work</th>
                <th style={R}>Reg Hrs</th>
                <th style={R}>OT Hrs</th>
              </tr>
            </thead>
            <tbody>
              {days.map((x, i) => (
                <tr key={x}>
                  <td>{us(x)}</td>
                  <td>{`Malibu Cyn Rd PM ${postMiles[i % 5]} - ${workDescriptions[i % 5]}`}</td>
                  <td style={R}>8.0</td>
                  <td style={R}>0.0</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} style={{ fontWeight: 700 }}>
                  TOTAL HOURS:
                </td>
                <td style={{ ...R, fontWeight: 700 }}>
                  <BB>{d.reg.toFixed(1)}</BB>
                </td>
                <td style={{ ...R, fontWeight: 700 }}>0.0</td>
              </tr>
            </tbody>
          </table>
          <Sigs a={[d.sig, `Employee Signature (${us(d.per[1])})`]} b={['Heidi Liu, PE', 'Supervisor Attestation']} />
        </>
      );
    }
    case 'log':
      return (
        <>
          <Head title="DAILY ACTIVITY LOG · FIELD CREW REPORT" />
          <KvTable
            rows={[
              ['CREW:', <BB>{d.crew}</BB>, 'WORK DATE:', <BB>{d.date}</BB>],
              ['CREW SIZE:', `${d.size} members`, 'PROJECT:', 'PW-00428'],
              ['TOTAL CREW HOURS:', <BB>{`${d.hrs} hrs`}</BB>],
            ]}
          />
          <NoteBox>
            <b>WORK PERFORMED:</b> {d.desc}. Equipment on site: CAT 320 Excavator (#EQ-PW-109).
          </NoteBox>
          <Sigs a={['Heidi Liu, PE', 'Crew Supervisor']} b={['', 'Reviewed by']} />
        </>
      );
    case 'sup':
      return (
        <>
          <Head title="SUPERVISOR FIELD LOG · SHIFT ATTESTATION" />
          <KvTable
            rows={[
              ['SUPERVISOR:', <BB>Liu, Heidi</BB>, 'TITLE:', 'Resident Engineer'],
              ['SHIFTS:', <BB>{`${us(d.per[0])} – ${us(d.per[1])}`}</BB>, 'HOURS:', `${d.hrs} hrs`],
            ]}
          />
          <NoteBox>Shift logs for Malibu Cyn Rd emergency work, Jan 14–16 2023.</NoteBox>
          <Sigs
            a={[
              '',
              <>
                Supervisor Signature — <b style={{ color: '#B4473A' }}>NOT SIGNED</b>
              </>,
            ]}
            b={['', 'Date']}
          />
        </>
      );
    case 'eq':
      return (
        <>
          <Head title="EQUIPMENT USAGE LOG" />
          <KvTable
            rows={[
              ['EQUIPMENT:', <BB>{d.eq}</BB>, 'EQUIP ID:', <BB>{d.id}</BB>],
              ['PERIOD:', <BB>{`${us(d.per[0])} – ${us(d.per[1])}`}</BB>, 'HOURS:', <BB>{`${d.hrs} hrs`}</BB>],
            ]}
          />
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Operator</th>
                <th style={R}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {timesheetWeek.map((x) => (
                <tr key={x}>
                  <td>{us(x)}</td>
                  <td>Aguayo, Hector</td>
                  <td style={R}>8.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    case 'xl':
      return (
        <>
          <Head title="eCAPS EXPENSE DETAIL REPORT" sub={`Spreadsheet · ${d.rows} parsed rows`} />
          <Box
            component="table"
            sx={{
              '& td, & th': { fontFamily: `${ARIAL} !important`, fontSize: '11px !important', border: '1px solid #D8D2C4 !important', p: '5px 7px !important' },
              '& th': { bgcolor: '#EFEAE0' },
            }}
          >
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>PAY PERIOD</th>
                <th>REG HRS</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              {spreadsheetPreview.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={4} style={{ color: '#8A8272' }}>
                  … {d.rows - 3} more rows
                </td>
              </tr>
            </tbody>
          </Box>
        </>
      );
    case 'photo':
      return (
        <>
          <Head title="SITE PHOTO EVIDENCE" sub={`${d.loc} · ${us(d.date)}`} />
          <Box
            role="img"
            aria-label={`Image preview: ${d.n}`}
            sx={{
              height: 300,
              border: '1px solid #D8D2C4',
              display: 'grid',
              placeItems: 'center',
              background: 'repeating-linear-gradient(135deg,#EFEAE0 0 12px,#F6F2EA 12px 24px)',
              color: '#8A8272',
              font: `600 12px ${ARIAL}`,
              letterSpacing: '.06em',
              textAlign: 'center',
              px: 2,
            }}
          >
            IMAGE PREVIEW · {d.n}
          </Box>
        </>
      );
  }
}

/** The cream "scanned paper" with its typed tables and AI bounding boxes. */
export function PaperPreview({ doc }: { doc: ReviewDoc }) {
  return <Preview d={doc} />;
}

/** Styles for the paper sheet and its tables. */
export const paperSx: SystemStyleObject<Theme> = {
  width: 640,
  boxSizing: 'content-box',
  flex: 'none',
  alignSelf: 'flex-start',
  bgcolor: '#FFFDF8',
  p: '44px 40px',
  boxShadow: '0 18px 40px -20px rgba(0,30,60,.45)',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  borderRadius: '4px',
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: INK,
  fontSize: 15,
  lineHeight: 1.55,
  '& table': { borderCollapse: 'collapse', width: '100%' },
  '& td, & th': { p: '7px 8px', borderBottom: `1px solid ${RULE}`, fontSize: 12.5, textAlign: 'left' },
  '& th': { fontFamily: ARIAL, fontSize: 10, letterSpacing: '.06em', color: MUTED },
};
