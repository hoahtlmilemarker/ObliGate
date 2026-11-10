import { Box, Typography } from '@mui/material';
import { Fragment, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { brand } from '@/theme/tokens';
import globe from '@/assets/banner-globe.svg';
import cubes from '@/assets/banner-cubes.svg';

export interface Crumb {
  label: string;
  to?: string;
}

export interface PageBannerProps {
  /** Gold kicker. A string, or breadcrumbs rendered as "A › B › C". */
  eyebrow?: string | Crumb[];
  /** Small gold rule before a string eyebrow (Disaster Portfolio style). */
  eyebrowRule?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Leave room for a card that overlaps the bottom of the banner (default true). */
  overlap?: boolean;
  /** Show the isometric cubes illustration (default true). */
  illustration?: boolean;
}

/** Navy hero band at the top of each workspace page (serif title, dotted globe, cubes). */
export function PageBanner({ eyebrow, eyebrowRule, title, subtitle, actions, overlap = true, illustration = true }: PageBannerProps) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF',
        backgroundImage: `radial-gradient(120% 160% at 85% 0%, ${brand.navy2} 0%, ${brand.navy} 60%)`,
      }}
    >
      <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.24, pointerEvents: 'none' }} />
      {illustration && (
        <Box component="img" src={cubes} alt="" aria-hidden sx={{ position: 'absolute', top: 16, right: 28, height: 164, width: 'auto', pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />
      )}
      <Box sx={{ position: 'relative', p: { xs: '20px 16px', md: '20px 28px' }, pb: overlap ? { xs: '84px', md: '70px' } : { xs: 6, md: 7 }, pr: { md: illustration ? '220px' : '28px' } }}>
        {eyebrow && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, mb: 1.5 }}>
            {eyebrowRule && <Box component="span" sx={{ width: 28, height: '1px', bgcolor: brand.goldText, mr: 1 }} />}
            {typeof eyebrow === 'string' ? (
              <Typography variant="eyebrow">{eyebrow}</Typography>
            ) : (
              eyebrow.map((c, i) => (
                <Fragment key={c.label}>
                  {i > 0 && (
                    <Typography variant="eyebrow" component="span" aria-hidden sx={{ opacity: 0.7 }}>
                      ›
                    </Typography>
                  )}
                  {c.to ? (
                    <Typography variant="eyebrow" component={RouterLink} to={c.to} sx={{ borderBottom: '1px solid rgba(201,165,106,.55)', '&:hover': { color: '#E2C27E' } }}>
                      {c.label}
                    </Typography>
                  ) : (
                    <Typography variant="eyebrow" component="span">
                      {c.label}
                    </Typography>
                  )}
                </Fragment>
              ))
            )}
          </Box>
        )}
        <Typography variant="display" sx={{ color: '#FFFFFF', overflowWrap: 'anywhere', fontSize: { xs: 30, md: 32.4 } }}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.68)', maxWidth: 760 }}>{subtitle}</Typography>}
        {actions && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, pt: 4 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}

/** Page body under the banner; `overlap` pulls the first card up over the banner. */
export function PageBody({ children, overlap = true }: { children: ReactNode; overlap?: boolean }) {
  return (
    <Box sx={{ position: 'relative', px: { xs: 4, md: 7 }, pt: 6, pb: 14, mt: overlap ? '-76px' : 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {children}
    </Box>
  );
}
