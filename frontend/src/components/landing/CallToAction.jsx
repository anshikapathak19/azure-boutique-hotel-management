import { motion, useReducedMotion } from 'framer-motion'

import Container from '@/components/ui/Container.jsx'
import Button from '@/components/ui/Button.jsx'
import { ROUTES } from '@/config/routes.js'

export default function CallToAction() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://picsum.photos/seed/azurestay-cta/1920/800)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-navy/80" aria-hidden="true" />

      <Container className="relative z-10 text-center">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-display text-4xl md:text-5xl text-ivory max-w-2xl mx-auto leading-tight"
        >
          Ready to Discover Your Next Boutique Escape?
        </motion.h2>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button to={ROUTES.hotels} variant="gold" size="md">
            Explore Hotels
          </Button>
          {/* Placeholder target — becomes a real partner-onboarding route in a later milestone */}
          <Button href="#partner" variant="outline" size="md" className="text-ivory">
            Become a Partner Hotel
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}