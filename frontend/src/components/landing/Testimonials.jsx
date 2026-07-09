import { motion, useReducedMotion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import { testimonials } from '@/data/testimonials.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Guest Stories"
          title="What Our Guests Say"
          subtitle="Verified reviews from guests who booked and stayed through AzureStay."
          align="center"
        />

        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.figure
              key={testimonial.id}
              variants={shouldReduceMotion ? {} : fadeUp}
              className="relative bg-ivory rounded-2xl p-8 md:p-10 shadow-sm shadow-navy/5"
            >
              <Quote className="w-8 h-8 text-gold/30" aria-hidden="true" />

              <blockquote className="mt-4 font-display text-lg md:text-xl text-navy leading-relaxed">
                “{testimonial.review}”
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4">
                <img
                  src={testimonial.photo}
                  alt=""
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-body font-semibold text-navy text-sm">{testimonial.name}</p>
                  <p className="font-body text-xs text-navy/60">{testimonial.country}</p>
                </div>
                <div
                  className="ml-auto flex items-center gap-1"
                  aria-label={`Rated ${testimonial.rating} out of 5`}
                >
                  <Star className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
                  <span className="font-body text-sm text-navy/80">{testimonial.rating}</span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}