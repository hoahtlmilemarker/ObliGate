import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LiftCard, StatusTag } from '@/components';
import { routes } from '@/layout';
import { laborChecklist } from '@/data/documentLibrary';
import { ArrowIcon, SealIcon } from './icons';

/** FEMA Category C Labor Requirements Checklist — compact lift card over the banner. */
export function ChecklistCard({ onViewFile, loading }: { onViewFile: () => void; loading?: boolean }) {
  const c = laborChecklist;
  return (
    <LiftCard component="section" aria-label="FEMA Category C labor requirements" sx={loading ? { opacity: 0.35, filter: 'blur(.4px)', transition: 'opacity .2s' } : { transition: 'opacity .2s' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px', p: { xs: '14px 16px', sm: '14px 24px' } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', minWidth: 0 }}>
          <Typography component="h2" sx={{ m: 0, fontSize: 19, fontWeight: 300, color: 'og.head', letterSpacing: '-.02em' }}>
            {c.title}
          </Typography>
          <StatusTag tone="warn">{c.progress}</StatusTag>
          <Typography component="span" sx={{ fontSize: 12.5, color: 'og.gray' }}>
            {c.reference}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flex: 'none', width: { xs: '100%', sm: 'auto' }, '& > *': { flex: { xs: 1, sm: 'none' } } }}>
          <Button size="small" variant="outlined" onClick={(e) => {
              e.preventDefault();
              onViewFile();
            }}
            href="#doc-supervisorlog">
            View File
          </Button>
          <Button size="small" variant="contained" component={RouterLink} to={routes.signature} endIcon={<ArrowIcon size={13} />}>
            Request Signature
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2,minmax(0,1fr))' },
          '@media (min-width:1101px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' },
          borderTop: 1,
          borderColor: 'og.lineSoft',
        }}
      >
        {c.items.map((it, i) => (
          <Box
            key={it.n}
            sx={(t) => ({
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: '12px 20px 14px',
              minWidth: 0,
              bgcolor: it.done ? 'transparent' : 'og.warnTint',
              '&::before': { content: '""', position: 'absolute', left: 0, right: 0, top: -1, height: 3, bgcolor: it.done ? t.palette.og.good : '#D9822B' },
              // dividers: 1 column → top borders; 2 columns → left on odd, top on second row; 4 columns → left only
              [t.breakpoints.down('sm')]: i > 0 ? { borderTop: `1px solid ${t.palette.og.lineSoft}` } : {},
              [t.breakpoints.up('sm')]: { ...(i % 2 === 1 && { borderLeft: `1px solid ${t.palette.og.lineSoft}` }), ...(i >= 2 && { borderTop: `1px solid ${t.palette.og.lineSoft}` }) },
              '@media (min-width:1101px)': { borderTop: 0, ...(i > 0 && { borderLeft: `1px solid ${t.palette.og.lineSoft}` }) },
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, minWidth: 0, font: '700 14px/1.3 Manrope, Arial, sans-serif', color: it.done ? 'og.head' : 'og.warn' }}>
              <Box component="i" role="img" aria-label={it.done ? 'Complete' : 'Outstanding'} title={it.done ? 'Complete' : 'Outstanding'} sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 20, height: 20, mt: '-1px', color: it.done ? 'og.good' : '#D9822B', '& svg': { display: 'block', filter: 'drop-shadow(0 1px 1.5px rgba(10,40,25,.18))' } }}>
                <SealIcon done={it.done} />
              </Box>
              <Box component="em" sx={{ fontStyle: 'normal', fontWeight: 600, color: 'og.gray' }}>
                {it.n}
              </Box>
              <Box component="span" sx={{ minWidth: 0 }}>
                {it.title}
              </Box>
            </Box>
            <Box component="span" sx={{ pl: '28px', fontSize: 12.5, lineHeight: 1.45, color: 'og.gray' }}>
              {it.detail}
              {it.note && (
                <Box component="span" sx={{ display: 'block', mt: '3px', fontWeight: 600, color: 'og.blue', '&::before': { content: '""', display: 'inline-block', width: 5, height: 5, m: '0 6px 1px 0', borderRadius: '50%', bgcolor: 'currentColor', verticalAlign: 'middle' } }}>
                  {it.note}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </LiftCard>
  );
}
