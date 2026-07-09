import { motion, useReducedMotion } from 'framer-motion'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'
import Button from '@/components/ui/Button.jsx'
import { rooms } from '@/data/rooms.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FeaturedRooms() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="rooms" className="py-24 md:py-32 bg-ivory">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeading
            eyebrow="Accommodations"
            title="Featured Rooms & Suites"
            subtitle="Six distinct residences, each shaped around comfort, privacy, and a sense of arrival."
          />
          {/* Placeholder target — becomes a real /rooms route in a later milestone */}
          <Button href="#rooms" variant="outline" size="sm" className="text-navy shrink-0">
            View All Rooms
          </Button>
        </div>

        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={shouldReduceMotion ? {} : fadeUp}>
              <RoomCard
                image={room.image}
                title={room.name}
                description={room.description}
                price={room.price}
                rating={room.rating}
                amenities={room.amenities}
                badge={room.badge}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}