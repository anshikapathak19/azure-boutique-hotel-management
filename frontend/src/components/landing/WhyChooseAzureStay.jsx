import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Gem, Lock, Star, Headphones, BadgePercent } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Verified Boutique Hotels',
    description: 'Every property on AzureStay is personally vetted for quality, character, and service standards.',
  },
  {
    icon: Gem,
    title: 'Curated Luxury Stays',
    description: 'A handpicked portfolio, not an endless list — only properties that meet our standard of quiet luxury.',
  },
  {
    icon: Lock,
    title: 'Secure Online Payments',
    description: 'Bank-grade encryption on every transaction, with full transparency on pricing and fees.',
  },
  {
    icon: Star,
    title: 'Trusted Guest Reviews',
    description: 'Every review comes from a verified stay — no incentivized ratings, no noise.',
  },
  {
    icon: Headphones,
    title: '24/7 Concierge Support',
    description: 'A dedicated concierge team, reachable around the clock, before and during every stay.',
  },
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: 'Find a lower rate elsewhere and we will match it — booking directly always pays off.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function WhyChooseAzureStay() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="why-azurestay" className="py-24 md:py-32 bg-white">
      <Container>
        <SectionHeading
          eyebrow="The AzureStay Promise"
          title="Why Book With AzureStay"
          subtitle="Booking directly through AzureStay comes with guarantees no third-party listing can offer."
          align="center"
        />

        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={shouldReduceMotion ? {} : fadeUp}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-ivory rounded-2xl p-8 text-center shadow-sm shadow-navy/5"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mb-5">
                <Icon className="w-6 h-6 text-gold" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl text-navy">{title}</h3>
              <p className="mt-3 font-body text-sm text-navy/70 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}