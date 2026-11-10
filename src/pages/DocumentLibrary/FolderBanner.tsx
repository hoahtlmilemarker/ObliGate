import { Box, Typography } from '@mui/material';
import { Fragment, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { brand } from '@/theme/tokens';
import globe from '@/assets/banner-globe.svg';
import cubes from '@/assets/banner-cubes.svg';

export interface EyebrowPart {
  label: string;
  to?: string;
}

/**
 * Navy banner for the library screens. Local variant of `PageBanner` whose eyebrow can mix a plain
 * prefix ("Folder View:", "Queue: To File") with linked crumbs and a custom separator.
 */
export function FolderBanner({
  prefix,
  crumbs,
  separator = '›',
  separateFromPrefix,
  title,
  subtitle,
  actions,
  overlap = true,
  loading,
}: {
  prefix: string;
  crumbs: EyebrowPart[];
  separator?: string;
  /** Put the separator between the prefix and the first crumb too ("Queue: To File · DR-4673-CA"). */
  separateFromPrefix?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  overlap?: boolean;
  /** Fade title and subtitle while folder content loads. */
  loading?: boolean;
}) {
  const fade = loading ? { opacity: 0.35, filter: 'blur(.4px)', transition: 'opacity .2s' } : { transition: 'opacity .2s' };
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', color: '#FFFFFF', backgroundImage: `radial-gradient(120% 160% at 85% 0%, ${brand.navy2} 0%, ${brand.navy} 60%)` }}>
      <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.24, pointerEvents: 'none' }} />
      <Box component="img" src={cubes} alt="" aria-hidden sx={{ position: 'absolute', top: 16, right: 28, height: 164, width: 'auto', pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />
      <Box sx={{ position: 'relative', p: { xs: '20px 16px', md: '20px 28px' }, pb: overlap ? { xs: '84px', md: '70px' } : { xs: 6, md: 8 }, pr: { md: '220px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, mb: 1.5 }}>
          <Typography variant="eyebrow" component="span">
            {prefix}
          </Typography>
          {crumbs.map((c, i) => (
            <Fragment key={c.label}>
              {(i > 0 || separateFromPrefix) && (
                <Typography variant="eyebrow" component="span" aria-hidden sx={{ opacity: 0.7 }}>
                  {separator}
                </Typography>
              )}
              {c.to ? (
                <Typography variant="eyebrow" component={RouterLink} to={c.to} sx={{ borderBottom: '1px solid rgba(201,165,106,.55)', textDecoration: 'none', '&:hover': { color: '#E2C27E', textDecoration: 'none' } }}>
                  {c.label}
                </Typography>
              ) : (
                <Typography variant="eyebrow" component="span">
                  {c.label}
                </Typography>
              )}
            </Fragment>
          ))}
        </Box>
        <Typography variant="display" sx={{ color: '#FFFFFF', overflowWrap: 'anywhere', fontSize: { xs: 30, md: 32.4 }, ...fade }}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.68)', maxWidth: 760, ...fade }}>{subtitle}</Typography>}
        {actions && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, pt: 4 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
