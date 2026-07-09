import { motion, useReducedMotion } from 'framer-motion'
import { ConciergeBell, UtensilsCrossed, Sparkles, MapPinned } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import Button from '@/components/ui/Button.jsx'

const FEATURES = [
  {
    icon: ConciergeBell,
    label: '24-Hour Concierge',
    description: 'Personal assistance for reservations, itineraries, and every detail in between.',
  },
  {
    icon: UtensilsCrossed,
    label: 'Fine Dining',
    description: 'Seasonal tasting menus crafted from regional, locally sourced ingredients.',
  },
  {
    icon: Sparkles,
    label: 'Wellness & Spa',
    description: 'A full sensory retreat, from thermal pools to signature treatments.',
  },
  {
    icon: MapPinned,
    label: 'Curated Excursions',
    description: 'Private guided experiences designed around your interests, not a fixed itinerary.',
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

// Placeholder — swap for real AzureStay photography before launch.
const IMAGE = 'https://picsum.photos/seed/azurestay-experience/900/1100'

export default function LuxuryExperience() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="experience" className="py-24 md:py-32 bg-white">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={IMAGE}
            alt="AzureStay lounge and wellness area bathed in natural light"
            loading="lazy"
            className="w-full h-[420px] md:h-[560px] object-cover rounded-2xl shadow-lg shadow-navy/10"
          />
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
          variants={shouldReduceMotion ? {} : fadeIn}
        >
          <SectionHeading
            eyebrow="The AzureStay Experience"
            title="An Experience Beyond the Room"
            subtitle="Every stay is shaped around presence over pace — thoughtful service, quiet luxury, and moments designed to be remembered."
          />

          <ul className="mt-10 space-y-6" aria-label="Signature experiences">
            {FEATURES.map(({ icon: Icon, label, description }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gold/10 shrink-0">
                  <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-body font-semibold text-navy">{label}</p>
                  <p className="font-body text-sm text-navy/70 mt-1">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button href="#booking" variant="gold" size="md" className="mt-10">
            Book Your Stay
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}