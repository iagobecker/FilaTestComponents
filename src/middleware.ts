import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { jwtDecode } from 'jwt-decode'

// Rotas públicas
const publicRoutes = ['/login', '/redefinir-senha']

// Exportação nomeada (pode ser esta ou a default)
export function middleware(request: NextRequest) {
//   const token = request.cookies.get('access-token')?.value
//   const { pathname } = request.nextUrl

  // Verifica se a rota é pública
 // const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Permite acesso a rotas públicas
  //if (isPublicRoute) {
    // Se já autenticado, redireciona para dashboard
    // if (token && pathname === '/login') {
    //   return NextResponse.redirect(new URL('/', request.url))
    // }
    // return NextResponse.next()
  }

  // Redireciona para login se não autenticado
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

  // Verifica token válido
  try {
   // const decoded = jwtDecode(token)
   // const isExpired = decoded.exp && decoded.exp < Date.now() / 1000

    // if (isExpired) {
    //   const response = NextResponse.redirect(new URL('/login', request.url))
    //   response.cookies.delete('access-token')
    //   return response
    // }
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login',))
    response.cookies.delete('access-token')
     
  }
//   } catch (error) {
//     const response = NextResponse.redirect(new URL('/login', request.url))
//     response.cookies.delete('access-token')
//     return response
//   }

//   return NextResponse.next()
// }

// Configuração de quais rotas acionam o middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
  