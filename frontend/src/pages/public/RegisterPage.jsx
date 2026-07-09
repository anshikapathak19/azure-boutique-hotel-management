import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Lock, Mail, User, ArrowRight } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'
import { AuthService } from '@/services/AuthService.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const getPasswordStrength = () => {
    const pw = form.password
    if (!pw) return 0
    let score = 0
    if (pw.length >= 6) score += 1
    if (pw.length >= 10) score += 1
    if (/[A-Z]/.test(pw)) score += 1
    if (/[0-9]/.test(pw)) score += 1
    return score // max 4
  }

  const validate = () => {
    const tempErrors = {}
    if (!form.name.trim()) {
      tempErrors.name = 'Full name is required.'
    }
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
    if (form.password !== form.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.'
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
      // Register via service
      const user = await AuthService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      
      // Immediately log in user in AuthContext
      await login({ email: form.email, password: form.password })
      addToast('Registration successful! Welcome to AzureStay.', 'success')
      navigate('/verify-email') // Go to email verify code page
    } catch (err) {
      setServerError(err.message || 'Registration failed.')
      addToast(err.message || 'Error creating account', 'error')
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = getPasswordStrength()
  const strengthLabels = ['Weak', 'Moderate', 'Good', 'Strong']
  const strengthColors = ['bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400']

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
            <h2 className="font-display text-xl md:text-2xl text-navy">Register Account</h2>
            <p className="font-body text-xs text-navy/50 mt-2">
              Create an account to join our membership privileges program.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Eleanor Whitfield"
              value={form.name}
              error={errors.name}
              disabled={loading}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
              }}
              required
            />

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
              placeholder="Min. 6 characters"
              value={form.password}
              error={errors.password}
              disabled={loading}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }))
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
              }}
              required
            />

            {/* Password Strength Indicator */}
            {form.password && (
              <div className="space-y-1.5 pl-1">
                <div className="flex justify-between text-[10px] font-body text-navy/50">
                  <span>Strength: {strengthLabels[pwStrength - 1] || 'Too short'}</span>
                  <span>{pwStrength * 25}%</span>
                </div>
                <div className="h-1 bg-navy/5 rounded-full overflow-hidden flex gap-0.5">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 transition-all ${idx < pwStrength ? strengthColors[pwStrength - 1] : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              disabled={loading}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }))
              }}
              required
            />

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
                  Creating...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create Member Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-body text-navy/60">
            Already have an account?{' '}
            <Link to={ROUTES.login} className="text-gold font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}