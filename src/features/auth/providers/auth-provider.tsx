// 'use client'

// import { createContext, useContext, useState } from 'react'
// import { useRouter } from "next/navigation"
// import { AuthService } from "../services/auth-service"
// import { Usuario } from "../types/usuario"

// interface AuthContextType {
//     usuario?: Usuario
//     login: (usuario: string, senha: string) => Promise<void>
//     logout: () => void
//     carregando: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [usuario, setUsuario] = useState<Usuario | undefined>()
//     const [carregando, setCarregando] = useState(false)
//     const router = useRouter()

//     const login = async (usuario: string, senha: string) => {
//         setCarregando(true)
//         try {
//             const result = await AuthService.login({ usuario, senha })
//             //setUsuario(result)
//             router.push('/')
//         } finally {
//             setCarregando(false)
//         }
//     }

//     const logout = async () => {
//         await AuthService.logout()
//         setUsuario(undefined)
//         router.push('/login')
//     }

//     return (
//         <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () => {
//     const context = useContext(AuthContext)
//     if (context === undefined) {
//         throw new Error('useAuth deve ser usado dentro de um AuthProvider')
//     }
//     return context
// }