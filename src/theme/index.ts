import { alpha, createTheme, type Theme } from '@mui/material/styles';
import { brand, fonts, RADIUS, tokens, type OgMode, type OgTokens } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    og: OgTokens;
  }
  interface PaletteOptions {
    og?: OgTokens;
  }
  interface TypographyVariants {
    display: React.CSSProperties; // serif page titles (banner H1)
    eyebrow: React.CSSProperties; // gold uppercase kicker above titles
    label: React.CSSProperties; // small uppercase section / column labels
    data: React.CSSProperties; // tabular numbers
  }
  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
    eyebrow?: React.CSSProperties;
    label?: React.CSSProperties;
    data?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    eyebrow: true;
    label: true;
    data: true;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    /** Gold gradient button used for "Review" actions. */
    brass: true;
    /** White button on the navy banner. */
    inverse: true;
    /** Outlined button on the navy banner / header. */
    onDark: true;
  }
}

export function createOgTheme(mode: OgMode): Theme {
  const t = tokens[mode];
  const focusRing = `0 0 0 3px ${alpha(t.blue, mode === 'dark' ? 0.35 : 0.25)}`;

  return createTheme({
    palette: {
      mode,
      og: t,
      primary: { main: t.buttonBlue, dark: t.blueHover, light: t.sky, contrastText: '#FFFFFF' },
      secondary: { main: t.brass, contrastText: brand.brassInk },
      success: { main: t.good, light: t.goodTint, contrastText: '#FFFFFF' },
      warning: { main: t.warn, light: t.warnTint, contrastText: '#FFFFFF' },
      error: { main: t.risk, light: t.riskTint, contrastText: '#FFFFFF' },
      info: { main: t.blue, light: t.blueTint, contrastText: '#FFFFFF' },
      background: { default: t.bg, paper: t.card },
      text: { primary: t.ink, secondary: t.gray, disabled: t.dim },
      divider: t.line,
      action: { hover: t.blueTint, selected: t.blueTint },
    },
    shape: { borderRadius: RADIUS },
    spacing: 4,
    breakpoints: { values: { xs: 0, sm: 640, md: 820, lg: 1024, xl: 1320 } },
    typography: {
      fontFamily: fonts.sans,
      fontSize: 14,
      htmlFontSize: 16,
      body1: { fontSize: 15, lineHeight: 1.55 },
      body2: { fontSize: 13, lineHeight: 1.55 },
      caption: { fontSize: 12, lineHeight: 1.4, color: t.gray },
      h1: { fontFamily: fonts.serif, fontWeight: 500, fontSize: 32.4, lineHeight: 1.08, letterSpacing: '-0.015em' },
      h2: { fontSize: 20, fontWeight: 300, color: t.head, letterSpacing: '-0.01em' },
      h3: { fontSize: 16, fontWeight: 700, color: t.head },
      h4: { fontSize: 14, fontWeight: 700, color: t.head },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
      display: { fontFamily: fonts.serif, fontWeight: 500, fontSize: 32.4, lineHeight: 1.08, letterSpacing: '-0.015em' },
      eyebrow: { fontSize: 11.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: brand.goldText },
      label: { fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.gray },
      data: { fontVariantNumeric: 'tabular-nums lining-nums' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: t.bg, WebkitFontSmoothing: 'antialiased' },
          a: { color: t.blue, textDecoration: 'none' },
          // :where() keeps this at plain `a:hover` specificity so component styles (nav, buttons) always win.
          'a:where(:not(.MuiButtonBase-root)):hover': { color: t.blueHover },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: { display: 'h1', eyebrow: 'div', label: 'div', data: 'span' },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { color: t.blue, '&:hover': { color: t.blueHover } } } },
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'outlined' },
        styleOverrides: {
          root: {
            height: 36,
            minHeight: 36,
            padding: '0 16px',
            fontSize: 13,
            lineHeight: 1,
            gap: 8,
            whiteSpace: 'nowrap',
            borderRadius: RADIUS,
            '&.Mui-focusVisible': { boxShadow: focusRing },
            '& .MuiButton-startIcon, & .MuiButton-endIcon': { margin: 0 },
          },
          sizeSmall: { height: 30, minHeight: 30, padding: '0 12px', fontSize: 12, gap: 6 },
          sizeLarge: { height: 46, minHeight: 46, padding: '0 22px', fontSize: 14.5 },
          contained: {
            backgroundColor: t.buttonBlue,
            color: '#FFFFFF',
            border: `1px solid ${t.buttonBlue}`,
            '&:hover': { backgroundColor: mode === 'dark' ? '#2F7CC0' : t.blueHover, borderColor: 'transparent', color: '#FFFFFF' },
          },
          outlined: {
            backgroundColor: t.card,
            color: t.head,
            borderColor: t.line,
            '&:hover': { backgroundColor: t.card, borderColor: t.head, color: t.head },
          },
          text: { color: t.gray, padding: '0 12px', '&:hover': { color: t.head, backgroundColor: 'transparent' } },
        },
        variants: [
          {
            props: { variant: 'brass' },
            style: {
              color: brand.brassInk,
              backgroundImage: brand.brassGradient,
              border: `1px solid ${brand.brassBorder}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), 0 2px 6px -2px rgba(140,100,30,.45)',
              '&:hover': { filter: 'brightness(1.04)', backgroundImage: brand.brassGradient, color: brand.brassInk },
            },
          },
          {
            props: { variant: 'inverse' },
            style: {
              color: brand.navy,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FFFFFF',
              '&:hover': { backgroundColor: '#E9F1F8', borderColor: '#E9F1F8', color: brand.navy },
            },
          },
          {
            props: { variant: 'onDark' },
            style: {
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              border: `1px solid rgba(255,255,255,.32)`,
              '&:hover': { borderColor: 'rgba(255,255,255,.7)', backgroundColor: 'rgba(255,255,255,.04)', color: '#FFFFFF' },
            },
          },
        ],
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: RADIUS, color: t.gray, '&:hover': { backgroundColor: t.blueTint, color: t.head } },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.card,
            borderRadius: RADIUS,
            fontSize: 13.5,
            fontWeight: 500,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: t.line },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.gray },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.blue, borderWidth: 1 },
            '&.Mui-focused': { boxShadow: focusRing },
          },
          input: { padding: '0 12px', height: 36, '&::placeholder': { color: t.dim, opacity: 1 } },
          sizeSmall: {},
        },
      },
      MuiInputLabel: {
        defaultProps: { shrink: true },
        styleOverrides: {
          root: { position: 'static', transform: 'none', fontSize: 13.5, fontWeight: 600, color: t.ink, marginBottom: 6 },
        },
      },
      MuiCheckbox: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: {
            padding: 0,
            color: t.line,
            '&.Mui-checked': { color: t.buttonBlue },
            '&.Mui-focusVisible svg': { boxShadow: focusRing, borderRadius: RADIUS },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: { '&.Mui-checked': { color: '#FFFFFF' }, '&.Mui-checked + .MuiSwitch-track': { backgroundColor: t.buttonBlue, opacity: 1 } },
          track: { backgroundColor: t.line, opacity: 1 },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none', borderRadius: RADIUS } },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: 8,
            border: `1px solid ${t.line}`,
            borderTop: `2px solid ${t.brass}`,
            boxShadow: t.menuShadow,
            minWidth: 220,
          },
          list: { padding: 6 },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 36,
            borderRadius: RADIUS,
            fontSize: 13,
            fontWeight: 600,
            gap: 10,
            '&:hover': { backgroundColor: t.blueTint, color: t.blue },
            '&.Mui-disabled': { opacity: 0.45 },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { border: `1px solid ${t.line}`, borderTop: `2px solid ${t.brass}`, boxShadow: t.dialogShadow, backgroundColor: t.card },
        },
      },
      MuiBackdrop: {
        styleOverrides: { root: { backgroundColor: 'rgba(4,20,36,.55)', backdropFilter: 'blur(3px)', '&.MuiBackdrop-invisible': { backgroundColor: 'transparent', backdropFilter: 'none' } } },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { backgroundColor: brand.navy, fontSize: 12, fontWeight: 600, borderRadius: RADIUS } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${t.lineSoft}`, fontSize: 13, color: t.ink, padding: '13px 0 13px 20px' },
          head: { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.gray, padding: '11px 0 11px 20px' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { minHeight: 60, padding: '0 10px', fontSize: 13, fontWeight: 600, color: t.gray, textTransform: 'none', '&.Mui-selected': { color: t.head } },
        },
      },
      MuiTabs: {
        styleOverrides: { root: { minHeight: 60 }, indicator: { backgroundColor: t.brass, height: 2 } },
      },
      MuiSkeleton: {
        styleOverrides: { root: { backgroundColor: t.lineSoft, borderRadius: RADIUS } },
      },
      MuiLinearProgress: {
        styleOverrides: { root: { height: 3, borderRadius: 2, backgroundColor: t.lineSoft }, bar: { borderRadius: 2 } },
      },
    },
  });
}
