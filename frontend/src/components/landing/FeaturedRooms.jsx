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
            eyebrow="Our Portfolio"
            title="Discover Boutique Hotels"
            subtitle="A curated collection of independent boutique properties, each with its own character — united by the same standard of quiet luxury."
          />
          {/* TODO: point to a dedicated /hotels listing route in a later milestone */}
          <Button href="#rooms" variant="outline" size="sm" className="text-navy shrink-0">
            View All Hotels
          </Button>
        </div>

        <motion.div
          variants={shouldReduceMotion ? {} : container}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {rooms.map((hotel) => (
            <motion.div key={hotel.id} variants={shouldReduceMotion ? {} : fadeUp}>
              <RoomCard
                image={hotel.image}
                name={hotel.name}
                location={hotel.location}
                price={hotel.price}
                rating={hotel.rating}
                roomsCount={hotel.roomsCount}
                amenities={hotel.amenities}
                badge={hotel.badge}
                href={`#hotel-${hotel.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}