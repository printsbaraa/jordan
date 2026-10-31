import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth, ADMIN_CREDENTIALS } from '@/context/AuthContext'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { JordanFlag } from '@/components/JordanFlag'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await login(email, password)
      if (res.ok) {
        navigate(from, { replace: true })
      } else {
        setError(res.error || 'فشل تسجيل الدخول')
      }
    } catch {
      setError('حدث خطأ غير متوقع، يرجى المحاولة لاحقاً')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail(ADMIN_CREDENTIALS.email)
    setPassword(ADMIN_CREDENTIALS.password)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-desert-900 text-stone-100 flex flex-col justify-center relative overflow-hidden px-4 sm:px-6 py-12">
      {/* Background Ambience */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sandstone-900/30 via-desert-900 to-desert-950 pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute -top-40 -right-40 w-96 h-96 bg-sandstone-600/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-jordan-green/10 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Back to Website Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-sandstone-300 transition-colors text-sm font-sans tracking-wide"
        >
          <ArrowLeft size={16} />
          <span>العودة إلى الموقع الرئيسي</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-desert-800/80 border border-sandstone-500/20 rounded-2xl shadow-xl mb-4">
            <JordanFlag variant="full" height={36} className="rounded shadow" />
          </div>
          <span className="text-sandstone-400 font-cinematic text-xs tracking-[0.35em] uppercase">
            لوحة الإدارة والمحتوى
          </span>
          <h2 className="text-3xl font-cinematic tracking-wider text-white mt-1">
            JORDAN ADMIN PORTAL
          </h2>
          <p className="text-stone-400 text-sm mt-2 font-sans">
            قم بتسجيل الدخول لإدارة الوجهات السياحية والإحصائيات
          </p>
        </div>

        {/* Card */}
        <div className="bg-desert-800/90 backdrop-blur-xl border border-sandstone-500/20 rounded-2xl p-8 shadow-2xl shadow-black/60">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans tracking-wider uppercase text-stone-300 mb-2">
                البريد الإلكتروني (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@visitjordan.com"
                  className="w-full pl-10 pr-4 py-3 bg-desert-900/80 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-sandstone-500 focus:ring-1 focus:ring-sandstone-500 transition-all text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans tracking-wider uppercase text-stone-300 mb-2">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-desert-900/80 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-sandstone-500 focus:ring-1 focus:ring-sandstone-500 transition-all text-sm font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3.5 mt-2 rounded-lg text-sm tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>دخول لوحة التحكم</span>
                </div>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-desert-900/70 border border-sandstone-500/20 text-xs text-stone-400 space-y-2">
              <div className="flex items-center justify-between text-sandstone-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-sandstone-400" />
                  بيانات تسجيل الدخول التجريبية:
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-sandstone-400 hover:text-sandstone-200 underline font-sans text-xs transition-colors cursor-pointer"
                >
                  تعبئة تلقائية
                </button>
              </div>
              <div className="font-mono text-stone-300 select-all space-y-1 pt-1 bg-black/30 p-2.5 rounded border border-white/5">
                <div>الايميل: <span className="text-sandstone-400">{ADMIN_CREDENTIALS.email}</span></div>
                <div>الباسوورد: <span className="text-sandstone-400">{ADMIN_CREDENTIALS.password}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
