import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const from = location.state?.from || ROUTES.home

  const validate = () => {
    const tempErrors = {}
    if (!form.email) {
      tempErrors.email = 'Email address is required.'
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!regex.test(form.email)) {
        tempErrors.email = 'Please provide a valid email format.'
      }
    }
    if (!form.password) {
      tempErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const user = await login({ email: form.email, password: form.password })
      addToast(`Welcome back, ${user.name}!`, 'success')
      
      // Redirect to role-appropriate dashboard or original location
      if (user.role === 'admin') {
        navigate(ROUTES.admin)
      } else if (user.role === 'staff') {
        navigate(ROUTES.staff)
      } else {
        navigate(from)
      }
    } catch (err) {
      setServerError(err.message || 'Login request failed. Check credentials.')
      addToast(err.message || 'Authentication error', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Quick Login Test Helper
  const handleQuickLogin = async (role) => {
    setLoading(true)
    setServerError('')
    const credentials = {
      guest: { email: 'guest@azurestay.com', password: 'password123' },
      staff: { email: 'staff@azurestay.com', password: 'password123' },
      admin: { email: 'admin@azurestay.com', password: 'password123' },
    }

    try {
      const user = await login(credentials[role])
      addToast(`Logged in as ${user.name} (${user.role})`, 'success')
      if (role === 'admin') navigate(ROUTES.admin)
      else if (role === 'staff') navigate(ROUTES.staff)
      else navigate(ROUTES.guest)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-20 flex items-center justify-center">
      <Container className="max-w-md w-full">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-navy/5 shadow-xl shadow-navy/5 p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to={ROUTES.home} className="inline-flex items-center gap-2 font-display text-2xl text-navy mb-4 font-semibold">
              <Gem className="w-5 h-5 text-gold" />
              AzureStay
            </Link>
            <h2 className="font-display text-xl md:text-2xl text-navy">Welcome to AzureStay</h2>
            <p className="font-body text-xs text-navy/50 mt-2">
              Log in to request reservations and manage your preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={form.email}
              error={errors.email}
              disabled={loading}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }))
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
              }}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              disabled={loading}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }))
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
              }}
              required
            />

            <div className="flex items-center justify-between font-body text-xs mt-1">
              <label className="flex items-center gap-2 text-navy/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  disabled={loading}
                  onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                  className="accent-gold w-4 h-4"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-gold hover:text-gold/80 hover:underline transition-all">
                Forgot Password?
              </Link>
            </div>

            {serverError && (
              <p className="font-body text-xs text-rose-500 text-center bg-rose-50 rounded-xl p-3 border border-rose-100">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={loading}
              className="w-full mt-6 shadow-md cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  Entering...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Enter Residence
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Social login placeholders */}
          <div className="mt-8 border-t border-navy/5 pt-6 text-center space-y-4">
            <span className="font-body text-[10px] font-semibold text-navy/40 uppercase tracking-widest block">
              Or Connect Via
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => addToast('Azure AD B2C auth integration is prepared for next milestone.', 'info')}
                className="flex-1 py-2.5 rounded-full border border-navy/10 hover:border-gold hover:text-gold font-body text-xs font-semibold text-navy/70 transition-all cursor-pointer bg-white"
              >
                Azure AD B2C
              </button>
              <button
                type="button"
                onClick={() => addToast('Google authentication is prepared for next milestone.', 'info')}
                className="flex-1 py-2.5 rounded-full border border-navy/10 hover:border-gold hover:text-gold font-body text-xs font-semibold text-navy/70 transition-all cursor-pointer bg-white"
              >
                Google
              </button>
            </div>
          </div>

          {/* Quick Login Test Tool */}
          <div className="mt-8 pt-6 border-t border-navy/5 bg-ivory/50 rounded-xl p-4 text-center">
            <span className="font-body text-[10px] font-semibold text-navy/50 uppercase tracking-wider block mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Role Test Quick Login
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('guest')}
                className="flex-1 py-1.5 rounded-lg bg-navy/5 text-navy hover:bg-gold hover:text-navy text-[11px] font-body font-semibold transition-all cursor-pointer border border-navy/10"
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="flex-1 py-1.5 rounded-lg bg-navy/5 text-navy hover:bg-gold hover:text-navy text-[11px] font-body font-semibold transition-all cursor-pointer border border-navy/10"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 py-1.5 rounded-lg bg-navy/5 text-navy hover:bg-gold hover:text-navy text-[11px] font-body font-semibold transition-all cursor-pointer border border-navy/10"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs font-body text-navy/60">
            First time at AzureStay?{' '}
            <Link to={ROUTES.register} className="text-gold font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}