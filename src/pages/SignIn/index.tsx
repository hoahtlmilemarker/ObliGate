import { Box, Button, Checkbox, FormControlLabel, IconButton, InputLabel, Link, OutlinedInput, Tooltip, Typography } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowRightIcon, LockIcon, LogoMark, ThemeIcon } from '@/icons';
import { useColorMode } from '@/theme/ColorModeProvider';
import { routes } from '@/layout/nav';
import wordmark from '@/assets/obligate-wordmark.svg';
import { topoPaths } from '@/assets/topoPaths';

/** Topographic background — colours follow the theme. */
function Topo() {
  const { mode } = useColorMode();
  const c = mode === 'dark'
    ? { bg: '#0A1119', 1: 'rgba(154,166,178,.10)', 2: 'rgba(127,179,232,.15)', 3: 'rgba(218,228,238,.13)' }
    : { bg: '#F4F7FA', 1: '#E4EBF2', 2: 'rgba(127,179,232,.26)', 3: 'rgba(10,79,156,.12)' };
  return (
    <Box component="svg" viewBox="0 0 1440 790" preserveAspectRatio="xMidYMid slice" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <rect width="1440" height="790" fill={c.bg} />
      <g fill="none" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        {topoPaths.map(([k, d], i) => (
          <path key={i} d={d} stroke={c[k]} />
        ))}
      </g>
    </Box>
  );
}

/** 00 · Sign In — SSO first, credentials as fallback. Sample credentials are prefilled for the prototype. */
export default function SignIn() {
  const navigate = useNavigate();
  const { mode, toggle } = useColorMode();
  const enter = () => navigate(routes.disasters);

  return (
    <Box component="main" sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center', gap: 4.5, p: { xs: '68px 16px 24px', sm: '24px 16px' }, overflowY: 'auto' }}>
      <Topo />
      <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>
        <IconButton onClick={toggle} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`} sx={{ position: 'absolute', top: 16, right: { xs: 16, md: 36 }, zIndex: 2, width: 40, height: 40, bgcolor: 'og.card', border: 1, borderColor: 'og.line', color: 'og.head' }}>
          <ThemeIcon size={16} strokeWidth={1.6} />
        </IconButton>
      </Tooltip>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 460, bgcolor: 'og.card', border: 1, borderColor: 'og.line', boxShadow: (t) => t.palette.og.lift, p: { xs: '28px 24px', sm: '32px 36px' }, display: 'flex', flexDirection: 'column', gap: 4.5, borderRadius: '4px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, color: 'og.head' }}>
          <LogoMark size={30} />
          <Box component="img" src={wordmark} alt="ObliGate" sx={{ height: 20, filter: mode === 'dark' ? 'brightness(0) invert(1)' : 'none' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="label" sx={{ color: 'og.blue' }}>
            FEMA Public Assistance Compliance &amp; Grant Audit Intelligence
          </Typography>
          <Typography component="h1" sx={{ fontSize: 36, fontWeight: 300, lineHeight: 1.1, color: 'og.head' }}>
            Sign in to ObliGate
          </Typography>
        </Box>

        <Button variant="contained" size="large" fullWidth startIcon={<LockIcon size={18} />} onClick={enter} sx={{ whiteSpace: { xs: 'nowrap' }, fontSize: { xs: 13, sm: 14.5 } }}>
          Sign in with County SSO (Okta / Entra)
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'og.line' }} />
          <Typography variant="label" sx={{ fontSize: 10.5 }}>
            Or continue with credentials
          </Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'og.line' }} />
        </Box>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            enter();
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}
        >
          <Box>
            <InputLabel htmlFor="signin-email" sx={{ fontSize: 14 }}>
              Official Email Address
            </InputLabel>
            <OutlinedInput id="signin-email" type="email" defaultValue="rkeith@dpw.lacounty.gov" placeholder="name@jurisdiction.gov" fullWidth sx={{ '& input': { height: 48, fontSize: 15 } }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <InputLabel htmlFor="signin-password" sx={{ fontSize: 14 }}>
                Password
              </InputLabel>
              <Link href="#" underline="hover" sx={{ fontSize: 13 }}>
                Forgot password?
              </Link>
            </Box>
            <OutlinedInput id="signin-password" type="password" placeholder="Enter your password" fullWidth sx={{ '& input': { height: 48, fontSize: 15 } }} />
          </Box>
          <FormControlLabel control={<Checkbox defaultChecked sx={{ mr: 2.5 }} />} label="Remember this device for 30 days" sx={{ m: 0, minHeight: 44, '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
          <Button type="submit" variant="outlined" size="large" fullWidth endIcon={<ArrowRightIcon size={13} />}>
            Sign In to Workspace
          </Button>
        </Box>

        <Box component="p" sx={{ m: 0, display: 'flex', gap: 2.5, p: 3.5, bgcolor: 'og.pale', fontSize: 12.5, lineHeight: 1.6, color: 'og.gray', borderRadius: '4px' }}>
          <Box sx={{ flex: 'none', mt: '2px', display: 'flex' }}>
            <LockIcon size={16} />
          </Box>
          <span>
            <Box component="strong" sx={{ color: 'og.ink' }}>
              Authorized System:
            </Box>{' '}
            Protected under FedRAMP Moderate &amp; CJIS data protection boundaries. Unauthorized access is subject to 18 U.S.C. § 1030.
          </span>
        </Box>
      </Box>
      <Box component="footer" sx={{ position: 'relative', textAlign: 'center', fontSize: 12, color: 'og.gray' }}>
        ObliGate Compliance Inc. · v3.8.2 · <Link component={RouterLink} to="#">Privacy Policy</Link> · <Link component={RouterLink} to="#">Security Standards</Link>
      </Box>
    </Box>
  );
}
