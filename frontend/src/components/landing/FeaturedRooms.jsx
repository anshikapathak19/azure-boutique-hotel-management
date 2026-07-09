import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'
import Button from '@/components/ui/Button.jsx'
import HotelCardSkeleton from '@/components/hotels/HotelCardSkeleton.jsx'
import { HotelService } from '@/services/HotelService.js'
import { ROUTES } from '@/config/routes.js'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
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
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const FEATURED_COUNT = 6

export default function FeaturedRooms() {
  const shouldReduceMotion = useReducedMotion()
  const [featuredHotels, setFeaturedHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    HotelService.getFeaturedHotels(FEATURED_COUNT).then((data) => {
      if (active) {
        setFeaturedHotels(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="rooms" className="bg-ivory py-24 md:py-32">
      <Container>
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our Portfolio"
            title="Discover Boutique Hotels"
            subtitle="A curated collection of independent boutique properties, each with its own character—united by the same standard of quiet luxury."
          />

          <Button
            href={ROUTES.hotels}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            View All Hotels
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={shouldReduceMotion ? {} : container}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 items-stretch"
          >
            {featuredHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                variants={shouldReduceMotion ? {} : fadeUp}
                className="h-full"
              >
                <RoomCard
                  image={hotel.image}
                  name={hotel.name}
                  location={`${hotel.location}, ${hotel.country}`}
                  price={hotel.startingPrice}
                  rating={hotel.rating}
                  roomsCount={hotel.roomsCount}
                  amenities={hotel.amenities}
                  badge={hotel.badge}
                  to={`/hotels/${hotel.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  )
}