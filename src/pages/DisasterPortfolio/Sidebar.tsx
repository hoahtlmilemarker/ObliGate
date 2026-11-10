import { Box, ButtonBase, Checkbox, Typography } from '@mui/material';
import { lifecycleStages, policyRuleset, quickFilters } from '@/data/disasterPortfolio';

/** Lifecycle row: 1px rule when idle, 3px blue rule + tint when active (prototype `.side`). */
function LifecycleItem({ label, count, warn, active, onClick }: { label: string; count: number; warn?: boolean; active: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={active}
      sx={(t) => ({
        width: '100%',
        minHeight: 44,
        justifyContent: 'space-between',
        gap: 2.5,
        pr: 3,
        pl: active ? '14px' : 4,
        fontSize: 14,
        fontWeight: active ? 700 : 400,
        textAlign: 'left',
        color: active ? t.palette.og.blue : t.palette.og.gray,
        bgcolor: active ? t.palette.og.blueTint : 'transparent',
        borderLeft: active ? `3px solid ${t.palette.og.blue}` : `1px solid ${t.palette.og.line}`,
        borderRadius: active ? '0 4px 4px 0' : 0,
        '&:hover': { color: active ? t.palette.og.blue : t.palette.og.head, bgcolor: active ? t.palette.og.blueTint : t.palette.og.pale },
        '&.Mui-focusVisible': { outline: `2px solid ${t.palette.og.blue}`, outlineOffset: -2 },
      })}
    >
      <span>{label}</span>
      <Box component="span" sx={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: active ? 'og.blue' : warn ? 'og.warn' : 'og.dim' }}>
        {count}
      </Box>
    </ButtonBase>
  );
}

export interface PortfolioSidebarProps {
  stage: string;
  onStage: (key: string) => void;
  filters: Record<string, boolean>;
  onFilter: (key: string, value: boolean) => void;
}

/** Left rail: portfolio lifecycle, quick filters, FEMA policy ruleset note. */
export function PortfolioSidebar({ stage, onStage, filters, onFilter }: PortfolioSidebarProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="label" component="h2" sx={{ fontSize: 11, letterSpacing: '0.16em', pb: '14px' }}>
          Portfolio Lifecycle
        </Typography>
        {lifecycleStages.map((s) => (
          <LifecycleItem key={s.key} label={s.label} count={s.count} warn={s.tone === 'warn'} active={stage === s.key} onClick={() => onStage(s.key)} />
        ))}
      </Box>

      <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="label" component="legend" sx={{ fontSize: 11, letterSpacing: '0.16em', p: '0 0 10px' }}>
          Quick Filters
        </Typography>
        {quickFilters.map((f) => (
          <Box component="label" key={f.key} sx={{ display: 'flex', alignItems: 'center', gap: 3, minHeight: 40, fontSize: 14, color: 'og.ink', cursor: 'pointer' }}>
            <Checkbox size="small" checked={filters[f.key]} onChange={(e) => onFilter(f.key, e.target.checked)} />
            {f.label}
          </Box>
        ))}
      </Box>

      <Box
        role="note"
        sx={(t) => ({
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2.5,
          p: '12px 14px',
          bgcolor: 'og.card',
          border: `1px solid ${t.palette.og.line}`,
          borderLeft: `2px solid ${t.palette.og.brass}`,
          borderRadius: '4px',
        })}
      >
        <Box component="span" aria-hidden sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: '4px', bgcolor: 'og.brassTint', color: 'og.brass' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 5 5.8v5.4c0 4.4 2.9 8 7 9.8 4.1-1.8 7-5.4 7-9.8V5.8Z" fill="currentColor" fillOpacity=".14" />
            <path d="m9 12 2.2 2.2L15.5 10" />
          </svg>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
          <Box component="span" sx={(t) => ({ fontSize: 10.5, fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.palette.mode === 'dark' ? t.palette.og.brass : '#8A6A2E' })}>
            {policyRuleset.kicker}
          </Box>
          <Box component="span" sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: 'og.head' }}>
            {policyRuleset.version}
            <Box component="em" sx={{ fontStyle: 'normal', ml: 1.5, px: '6px', py: '1px', borderRadius: '4px', bgcolor: 'og.goodTint', color: 'og.good', fontSize: 11, fontWeight: 700, verticalAlign: '1px' }}>
              {policyRuleset.status}
            </Box>
          </Box>
          <Box component="span" sx={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4, color: 'og.gray' }}>
            {policyRuleset.note}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
