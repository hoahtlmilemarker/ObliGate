/**
 * ObliGate design tokens — ported 1:1 from the approved HTML prototype
 * (CSS custom properties on `.og`) and the Figma "Color" variable collection.
 * Use these through `theme.palette.og.*` (see theme/index.ts), never hard-code hex values in pages.
 */
export type OgMode = 'light' | 'dark';

export interface OgTokens {
  bg: string; // page background
  card: string; // surfaces (cards, panels, sidebar)
  pale: string; // subtle fill (shell background, hovers)
  line: string; // default border
  lineSoft: string; // row dividers / hairlines
  ink: string; // body text
  gray: string; // secondary text
  dim: string; // tertiary text / placeholders
  head: string; // headings & emphasized labels
  blue: string; // brand / links
  blueHover: string;
  blueTint: string; // selected / processing tint
  buttonBlue: string; // filled primary buttons (darker in dark mode for WCAG AA)
  sky: string;
  brass: string; // accent (gold rule, brass buttons)
  brassTint: string;
  good: string;
  goodTint: string;
  warn: string;
  warnTint: string;
  risk: string;
  riskTint: string;
  lift: string; // card elevation shadow
  menuShadow: string;
  dialogShadow: string;
}

/** Fixed brand colours — identical in both themes (header, banner, gold accents). */
export const brand = {
  navy: '#06243F', // header & banner base
  navy2: '#0B3358', // banner gradient highlight
  gold: '#C9A266', // active nav underline / nav counter
  goldText: '#C9A56A', // banner eyebrow
  brassGradient: 'linear-gradient(180deg,#DDBB72 0%,#C79F52 100%)', // brass "Review" buttons
  brassBorder: '#B88F45',
  brassInk: '#0A2540',
  avatarGradient: 'linear-gradient(145deg,#E6D3B0,#B08A4E)',
  initialsGradient: 'linear-gradient(145deg,#E6D3B0,#C9A874)',
  onDark: '#FFFFFF',
  onDark2: 'rgba(255,255,255,.74)',
  onDarkLine: 'rgba(255,255,255,.28)',
} as const;

export const tokens: Record<OgMode, OgTokens> = {
  light: {
    bg: '#FFFFFF',
    card: '#FFFFFF',
    pale: '#F3F6F8',
    line: '#D5D9DC',
    lineSoft: '#E8ECEF',
    ink: '#24272B',
    gray: '#60666C',
    dim: '#8A9096',
    head: '#003E6B',
    blue: '#005A9C',
    blueHover: '#003E6B',
    blueTint: 'rgba(0,90,156,.08)',
    buttonBlue: '#005A9C',
    sky: '#7FB8E6',
    brass: '#B08A4E',
    brassTint: 'rgba(176,138,78,.14)',
    good: '#146B3D',
    goodTint: '#E6F3EB',
    warn: '#A9561A',
    warnTint: '#FCEFE2',
    risk: '#A82E23',
    riskTint: '#FBEAE8',
    lift: '0 8px 24px -14px rgba(0,54,93,.16)',
    menuShadow: '0 14px 32px -16px rgba(6,36,63,.28), 0 2px 6px rgba(6,36,63,.06)',
    dialogShadow: '0 24px 48px -24px rgba(0,20,40,.35)',
  },
  dark: {
    bg: '#0B131C',
    card: '#13202C',
    pale: '#101B26',
    line: '#263443',
    lineSoft: '#1B2834',
    ink: '#E6EBF0',
    gray: '#9AA6B2',
    dim: '#6E7A86',
    head: '#DCEAF7',
    blue: '#5AA7E6',
    blueHover: '#86C0EE',
    blueTint: 'rgba(90,167,230,.14)',
    buttonBlue: '#2667A3',
    sky: '#86C0EE',
    brass: '#CFAB6E',
    brassTint: 'rgba(207,171,110,.16)',
    good: '#5CC08C',
    goodTint: 'rgba(92,192,140,.14)',
    warn: '#F0A564',
    warnTint: 'rgba(240,165,100,.14)',
    risk: '#F07A6E',
    riskTint: 'rgba(240,122,110,.14)',
    lift: '0 8px 24px -14px rgba(0,0,0,.45)',
    menuShadow: '0 14px 32px -16px rgba(0,0,0,.6), 0 2px 6px rgba(0,0,0,.25)',
    dialogShadow: '0 24px 48px -24px rgba(0,0,0,.7)',
  },
};

export const fonts = {
  sans: 'Manrope, Arial, sans-serif',
  serif: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
} as const;

export const RADIUS = 4;
