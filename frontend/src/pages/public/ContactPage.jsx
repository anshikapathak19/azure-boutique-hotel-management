import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Gem, Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Textarea from '@/components/ui/Textarea.jsx'
import Button from '@/components/ui/Button.jsx'
import { useToast } from '@/context/ToastContext.jsx'

export default function ContactPage() {
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const tempErrors = {}
    if (!form.name.trim()) tempErrors.name = 'Full name is required.'
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        tempErrors.email = 'Please provide a valid email address.'
      }
    }
    if (!form.subject.trim()) tempErrors.subject = 'Subject is required.'
    if (!form.message.trim()) {
      tempErrors.message = 'Message body is required.'
    } else if (form.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long.'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    // Simulate API delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      addToast('Message dispatched to our Concierge desk.', 'success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      addToast('Failed to dispatch message. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="bg-ivory text-navy pt-32 pb-24">
      {/* Title */}
      <section className="py-12 border-b border-navy/5">
        <Container className="max-w-4xl text-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-body font-semibold tracking-widest uppercase">
              <Gem className="w-3 h-3" /> Connect
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-navy leading-tight">
              Contact <span className="italic font-normal text-gold">AzureStay</span>
            </h1>
            <p className="font-body text-sm md:text-base text-navy/70 max-w-xl mx-auto leading-relaxed">
              Our guest relations and concierge desks are available 24/7. Reach out with inquiries regarding reservations, partnerships, or special requests.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Grid */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-navy">Office & Desks</h2>
                <p className="font-body text-sm text-navy/60 leading-relaxed">
                  For immediate support regarding an active stay, please dial the direct number provided in your booking voucher.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-body text-xs font-semibold text-navy/55 uppercase tracking-wide">Concierge Direct</h4>
                    <p className="font-body text-sm text-navy font-medium mt-1">+1 (800) 555-0190</p>
                    <p className="font-body text-xs text-navy/40 mt-0.5">Toll-free / international lines available</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-body text-xs font-semibold text-navy/55 uppercase tracking-wide">General Inquiry</h4>
                    <p className="font-body text-sm text-navy font-medium mt-1">concierge@azurestay.com</p>
                    <p className="font-body text-xs text-navy/40 mt-0.5">Responses within 4 operational hours</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-body text-xs font-semibold text-navy/55 uppercase tracking-wide">Executive Office</h4>
                    <p className="font-body text-sm text-navy font-medium mt-1">745 Fifth Avenue, Suite 2400</p>
                    <p className="font-body text-xs text-navy/50 mt-0.5">New York, NY 10151</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl border border-navy/5 p-8 md:p-10 shadow-lg shadow-navy/5"
              >
                {success ? (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl text-navy font-semibold">Message Dispatched</h3>
                    <p className="font-body text-sm text-navy/70 leading-relaxed max-w-sm mx-auto">
                      Thank you for contacting AzureStay. A member of our Guest Relations team will contact you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="font-body text-xs font-semibold text-gold hover:underline pt-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={form.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        disabled={loading}
                        required
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        disabled={loading}
                        required
                        placeholder="name@example.com"
                      />
                    </div>

                    <Input
                      label="Subject"
                      value={form.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      error={errors.subject}
                      disabled={loading}
                      required
                      placeholder="Reservation inquiry, Partnership opportunities..."
                    />

                    <Textarea
                      label="Message"
                      value={form.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      error={errors.message}
                      disabled={loading}
                      required
                      rows={5}
                      placeholder="Detail your request here. Please specify reservation references if applicable."
                    />

                    <Button
                      type="submit"
                      variant="gold"
                      size="md"
                      disabled={loading}
                      className="w-full mt-2 cursor-pointer shadow-md"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                          Dispatching...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
