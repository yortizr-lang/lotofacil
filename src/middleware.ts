import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = process.env.SITE_USER;
  const pass = process.env.SITE_PASS;

  // Protección por contraseña para ocultar el sitio durante el desarrollo.
  // Solo se activa si SITE_USER y SITE_PASS están definidas.
  // Se excluye /api/ingesta para que el scraper use su propio token.
  const proteger = !!(user && pass) && !pathname.startsWith('/api/ingesta');
  if (proteger) {
    const auth = req.headers.get('authorization');
    const esperado = 'Basic ' + btoa(`${user}:${pass}`);
    if (auth !== esperado) {
      return new NextResponse('Autenticación requerida', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Lotofacil"' },
      });
    }
  }

  // Las rutas de API no pasan por la internacionalización.
  if (pathname.startsWith('/api')) return NextResponse.next();

  return intl(req);
}

export const config = {
  // Todo excepto estáticos de Next y archivos con extensión.
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
