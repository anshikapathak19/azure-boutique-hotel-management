import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'
import { AuthService } from '@/services/AuthService.js'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const token = searchParams.get('token') || 'mock-reset-token'

  const validate = () => {
    const tempErrors = {}
    if (!form.password) {
      tempErrors.password = 'New password is required.'
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
      await AuthService.resetPassword({ token, password: form.password })
      setSuccess(true)
      addToast('Password successfully reset! Please login.', 'success')
    } catch (err) {
      setServerError(err.message || 'Failed to reset password.')
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
            <h2 className="font-display text-xl md:text-2xl text-navy">Update Password</h2>
            <p className="font-body text-xs text-navy/50 mt-2">
              Type and confirm your new account password coordinates.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-navy font-semibold">Security Updated</h3>
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                Your password credentials have been successfully updated. You may now log in to the AzureStay portal with your new details.
              </p>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => navigate(ROUTES.login)}
                className="w-full cursor-pointer mt-4"
              >
                Log In Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="New Password"
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

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="Re-enter new password"
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>

              <div className="text-center pt-4">
                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-navy/60 hover:text-navy hover:underline transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cancel & Return
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </Container>
    </div>
  )
}
