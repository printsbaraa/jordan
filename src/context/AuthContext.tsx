import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

// ─── Demo credentials (frontend-only, not production-secure) ────
export const ADMIN_CREDENTIALS = {
  email:    'admin@visitjordan.com',
  password: 'Jordan2026!',
} as const

const SESSION_KEY = 'jordan_admin_session'

interface AdminUser {
  email: string
  name: string
  role: string
  loginTime: string
}

interface AuthContextValue {
  user:    AdminUser | null
  isAuth:  boolean
  login:   (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout:  () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as AdminUser) : null
    } catch {
      return null
    }
  })

  // Keep session in sync
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  async function login(email: string, password: string) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 900))

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser: AdminUser = {
        email:     email.trim().toLowerCase(),
        name:      'Jordan Admin',
        role:      'Super Administrator',
        loginTime: new Date().toISOString(),
      }
      setUser(adminUser)
      return { ok: true }
    }

    return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuth: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
