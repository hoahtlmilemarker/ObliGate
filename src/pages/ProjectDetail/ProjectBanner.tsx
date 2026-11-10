import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { brand } from '@/theme/tokens';
import globe from '@/assets/banner-globe.svg';
import cubes from './project-cubes.svg';

export interface ProjectBannerProps {
  crumbs: { label: string; to?: string }[];
  meta: ReactNode;
  title: string;
  subtitle: string;
  actions: ReactNode;
}

/**
 * Navy project band (prototype `.band`): slash breadcrumbs, gold project id + status tags,
 * serif title, actions, single-cube illustration. Local variant of `PageBanner`.
 */
export function ProjectBanner({ crumbs, meta, title, subtitle, actions }: ProjectBannerProps) {
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', color: '#FFFFFF', backgroundImage: `radial-gradient(120% 160% at 85% 0%, ${brand.navy2} 0%, ${brand.navy} 60%)` }}>
      <Box component="img" src={globe} alt="" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.24, pointerEvents: 'none' }} />
      <Box
        component="img"
        src={cubes}
        alt=""
        aria-hidden
        sx={{ position: 'absolute', top: 16, right: { sm: -40, lg: 28 }, height: 164, width: 'auto', maxWidth: 300, opacity: { sm: 0.35, lg: 1 }, pointerEvents: 'none', display: { xs: 'none', sm: 'block' } }}
      />
      <Box sx={{ position: 'relative', p: { xs: '20px 16px 84px', md: '20px 28px 70px' }, display: 'flex', flexDirection: 'column', gap: 2, '& > *': { maxWidth: { lg: '70%' } } }}>
        <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, fontSize: 13, color: 'rgba(255,255,255,.68)' }}>
          {crumbs.map((c, i) => (
            <Box component="span" key={c.label} sx={{ display: 'contents' }}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.to ? (
                <Box component={RouterLink} to={c.to} sx={{ color: '#9CC7EC', '&:hover': { color: '#FFFFFF' } }}>
                  {c.label}
                </Box>
              ) : (
                <Box component="span" aria-current="page" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  {c.label}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>{meta}</Box>
        <Typography variant="display" sx={{ color: '#FFFFFF', overflowWrap: 'anywhere', fontSize: { xs: 30, lg: 'clamp(26px, 2.25vw, 33px)' }, maxWidth: { lg: '74% !important' } }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.68)' }}>{subtitle}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 2 }}>{actions}</Box>
      </Box>
    </Box>
  );
}
