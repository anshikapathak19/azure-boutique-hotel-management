import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Mail, ShieldCheck } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'
import { AuthService } from '@/services/AuthService.js'

export default function EmailVerificationPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code || code.length < 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await AuthService.verifyEmail(code)
      setVerified(true)
      addToast('Email verified successfully! Welcome to AzureStay.', 'success')
    } catch (err) {
      setError(err.message || 'Verification failed. Try code 123456.')
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
            <h2 className="font-display text-xl md:text-2xl text-navy">Verify Email</h2>
            <p className="font-body text-xs text-navy/50 mt-2">
              We have sent a verification code to your registered email.
            </p>
          </div>

          {verified ? (
            <div className="text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-navy font-semibold">Verification Complete</h3>
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                Your email address has been verified. You now have full access to direct reservation privileges and your member dashboard.
              </p>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => navigate(ROUTES.guest)}
                className="w-full cursor-pointer mt-4"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="6-Digit Code"
                type="text"
                maxLength={6}
                icon={Mail}
                placeholder="123456"
                value={code}
                error={error}
                disabled={loading}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').substring(0, 6))
                  if (error) setError('')
                }}
                required
              />

              <p className="font-body text-[11px] text-navy/40 pl-1 leading-relaxed">
                Tip: For testing purposes, you can input <strong>123456</strong> or any 6 digits to verify.
              </p>

              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={loading}
                className="w-full mt-6 shadow-md cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>

              <div className="text-center pt-4 font-body text-xs text-navy/60">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => addToast('Verification code has been resent to your inbox.', 'success')}
                  className="text-gold font-semibold hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </Container>
    </div>
  )
}
