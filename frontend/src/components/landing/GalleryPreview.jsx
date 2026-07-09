import { motion, useReducedMotion } from 'framer-motion'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import Button from '@/components/ui/Button.jsx'
import { gallery } from '@/data/gallery.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function GalleryPreview() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="gallery" className="py-24 md:py-32 bg-ivory">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeading
            eyebrow="A Glimpse Inside"
            title="Gallery"
            subtitle="A closer look at the spaces, details, and moments that define an AzureStay property."
          />
          {/* TODO: point to a dedicated gallery page/route in a later milestone */}
          <Button href="#gallery" variant="outline" size="sm" className="text-navy shrink-0">
            View Gallery
          </Button>
        </div>

        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {gallery.map((item) => (
            <motion.figure
              key={item.id}
              variants={shouldReduceMotion ? {} : fadeUp}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-navy/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <figcaption className="absolute bottom-4 left-4 font-body text-sm text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.category}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}