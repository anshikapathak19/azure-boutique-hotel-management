import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import Container from '@/components/ui/Container.jsx'
import Button from '@/components/ui/Button.jsx'

export default function Newsletter() {
  const shouldReduceMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Controlled form validation
    if (!email) {
      setStatus('error')
      setErrorMsg('Please enter your email address.')
      return
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      setStatus('error')
      setErrorMsg('Please provide a valid email address.')
      return
    }

    setLoading(true)
    setStatus(null)
    
    // Simulate API registration call
    setTimeout(() => {
      setLoading(false)
      setStatus('success')
      setEmail('')
    }, 1500)
  }

  return (
    <section className="bg-navy text-ivory py-24 md:py-32 relative overflow-hidden">
      {/* Decorative subtle visual accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-3xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-xs font-semibold text-gold uppercase tracking-widest block mb-4">
            Private Invitations
          </span>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            Join the AzureStay Registry
          </h2>
          <p className="font-body text-sm md:text-base text-ivory/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Subscribe to receive curated guides, exclusive previews of new boutique collections, and private member offers.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                disabled={loading || status === 'success'}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus(null)
                }}
                className={[
                  'w-full bg-white/10 border font-body text-sm px-6 py-4 rounded-full outline-none transition-all placeholder:text-ivory/40 text-ivory',
                  status === 'error'
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/15 focus:border-gold focus:ring-1 focus:ring-gold/20',
                ].join(' ')}
              />
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={loading}
                className="w-full sm:w-auto shrink-0 shadow-none cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    Sending
                  </span>
                ) : status === 'success' ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Joined
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Subscribe
                    <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <p className="font-body text-xs text-rose-400 mt-3 text-left pl-4">
                {errorMsg}
              </p>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <p className="font-body text-xs text-emerald-400 mt-3 text-center">
                Welcome to AzureStay. An invitation has been sent to your inbox.
              </p>
            )}
          </form>
        </motion.div>
      </Container>
    </section>
  )
}
