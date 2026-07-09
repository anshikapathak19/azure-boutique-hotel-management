import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'
import { AuthService } from '@/services/AuthService.js'

export default function ForgotPasswordPage() {
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    if (!email) {
      setError('Please provide your email address.')
      return false
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      setError('Please enter a valid email format.')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      await AuthService.forgotPassword(email)
      setSuccess(true)
      addToast('Reset link sent to your email!', 'success')
    } catch (err) {
      setError(err.message || 'Failed to request reset link.')
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
            <h2 className="font-display text-xl md:text-2xl text-navy">Recover Password</h2>
            <p className="font-body text-xs text-navy/50 mt-2">
              Enter your registered email and we will send a restoration link.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-navy font-semibold">Dispatched Link</h3>
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                We have sent an authentication link to reset your security details to <strong>{email}</strong>. Please check your spam folder if you do not receive it shortly.
              </p>
              <Link
                to={ROUTES.login}
                className="inline-flex items-center gap-2 text-xs font-body font-semibold text-gold hover:underline pt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                value={email}
                error={error}
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                required
              />

              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={loading}
                className="w-full mt-6 shadow-md cursor-pointer"
              >
                {loading ? 'Sending link...' : 'Send Recovery Link'}
              </Button>

              <div className="text-center pt-4">
                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-navy/60 hover:text-navy hover:underline transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </Container>
    </div>
  )
}
