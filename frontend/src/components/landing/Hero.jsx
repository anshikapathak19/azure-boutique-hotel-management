import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Button from '@/components/ui/Button.jsx'
import { ROUTES } from '@/config/routes.js'

// Premium luxury boutique hotel hero image
const HERO_IMAGE = '/src/assets/images/hero/hero-resort.jpg'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative h-screen min-h-[640px] flex items-center overflow-hidden"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        role="img"
        aria-label="Luxury boutique hotel at dusk"
        initial={shouldReduceMotion ? false : { scale: 1.05 }}
        animate={shouldReduceMotion ? {} : { scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy/85" />

      <Container className="relative z-10">
        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? false : 'show'}
          className="max-w-3xl"
        >
          <motion.h1
            variants={shouldReduceMotion ? {} : fadeUp}
            className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ivory"
          >
            Luxury Redefined.
            <br />
            Seamlessly Connected.
          </motion.h1>

          <motion.p
            variants={shouldReduceMotion ? {} : fadeUp}
            className="mt-7 max-w-2xl font-body text-lg md:text-xl leading-relaxed text-ivory/85"
          >
            Discover exceptional boutique hotels around the world through one
            curated platform—bringing together timeless hospitality, elegant
            design, and effortless booking in a seamless luxury experience.
          </motion.p>

          <motion.div
            variants={shouldReduceMotion ? {} : fadeUp}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button href={ROUTES.hotels} variant="gold" size="md">
              Book Your Stay
            </Button>

            <Button
              href={ROUTES.hotels}
              variant="outline"
              size="md"
              className="text-ivory"
            >
              Explore Hotels
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.a
        href="#booking"
        aria-label="Scroll to hotel search"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-ivory/70 transition-colors hover:text-gold"
        animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
        transition={
          shouldReduceMotion
            ? {}
            : {
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <ChevronDown className="w-7 h-7" />
      </motion.a>
    </section>
  )
}