import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookies = parseCookies({ req: request });
  const token = cookies['auth.token'];

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/login', '/inscrevase'];

  // Verifica se o redirecionamento é vindo do login (ignora a validação do token nesse caso)
  const fromLogin = searchParams.get('fromLogin') === 'true';

  // Se a rota é pública, permite o acesso sem redirecionar, mesmo com token
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next(); // Permite acesso à rota pública sem redirecionar
  }

  // Para rotas protegidas, verifica autenticação
  if (!token && !publicRoutes.includes(pathname) && !fromLogin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};