// Password gate for the hosted HTML prototype (Vercel Routing Middleware, free on every plan).
// Credentials come from the project's Environment Variables, never from this file:
//   SITE_USER, SITE_PASSWORD
// If either is missing the site stays locked (fails closed).

export const config = { matcher: '/:path*' };

const REALM = 'ObliGate prototype';

function same(a, b) {
  // length-independent comparison so the check time does not reveal how much matched
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function deny(message) {
  return new Response(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default function middleware(request) {
  const user = process.env.SITE_USER;
  const pass = process.env.SITE_PASSWORD;
  if (!user || !pass) return deny('This site is locked: set SITE_USER and SITE_PASSWORD in the Vercel project settings, then redeploy.');

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    if (i > -1 && same(decoded.slice(0, i), user) && same(decoded.slice(i + 1), pass)) {
      // continue to the static file (same as `next()` from @vercel/functions, without the dependency)
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }
  }
  return deny('Authentication required.');
}
