// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("auth.token")?.value;

//   // Lista de rotas públicas
//   const publicRoutes = ["/login", "/inscrevase"];

//   if (publicRoutes.includes(request.nextUrl.pathname)) {
//     return NextResponse.next();
//   }

//   if (!token) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("from", request.nextUrl.pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth.token")?.value;

  console.log(`Middleware - Acessando: ${pathname}, Token: ${token ? "Presente" : "Ausente"}`);

  if (pathname === "/login" || pathname === "/inscrevase") {
    console.log(`Acessando rota pública: ${pathname}`);
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/fila", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    console.log(`Usuário não autenticado ou token ausente, redirecionando para /login desde ${pathname}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log(`Acesso permitido para ${pathname} com token presente`);
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/fila", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/fila", "/configuracoes", "/customAparencia", "/ativaWhatsapp", "/customizarMensagem", "/vinculaMonitor"],
};