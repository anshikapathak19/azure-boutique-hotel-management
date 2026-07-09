import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, CalendarDays, Users, Building2, SlidersHorizontal, Search } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Input from '@/components/ui/Input.jsx'
import Select from '@/components/ui/Select.jsx'
import Button from '@/components/ui/Button.jsx'

const GUEST_OPTIONS = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4+ Guests' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'boutique-hotel', label: 'Boutique Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'villa', label: 'Villa' },
  { value: 'heritage-stay', label: 'Heritage Stay' },
]

const PRICE_OPTIONS = [
  { value: 'any', label: 'Any Price' },
  { value: '0-300', label: 'Under $300' },
  { value: '300-500', label: '$300 – $500' },
  { value: '500-800', label: '$500 – $800' },
  { value: '800+', label: '$800+' },
]

const RATING_OPTIONS = [
  { value: 'any', label: 'Any Rating' },
  { value: '4', label: '4.0+' },
  { value: '4.5', label: '4.5+' },
  { value: '5', label: '5.0 Only' },
]

const AMENITY_OPTIONS = ['Free WiFi', 'Infinity Pool', 'Spa', 'Breakfast Included', 'Parking', 'Pet Friendly']

const POPULAR_DESTINATIONS = ['Goa', 'Jaipur', 'Udaipur', 'Manali', 'Kerala']

export default function HotelSearch() {
  const shouldReduceMotion = useReducedMotion()
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [amenities, setAmenities] = useState([])
  const [destination, setDestination] = useState('')

  const toggleAmenity = (amenity) => {
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // UI only — wired to a real hotel search API in a later milestone.
  }

  return (
    <section aria-label="Search boutique hotels" className="relative z-20 py-16 md:py-20 bg-ivory">
      <Container>
        <motion.form
          onSubmit={handleSubmit}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-navy/10 border border-navy/5 p-6 md:p-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <Input
              label="Destination"
              icon={MapPin}
              type="text"
              name="destination"
              placeholder="City, region, or hotel"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
            <Input label="Check In" icon={CalendarDays} type="date" name="checkIn" />
            <Input label="Check Out" icon={CalendarDays} type="date" name="checkOut" />
            <Select label="Guests" icon={Users} name="guests" options={GUEST_OPTIONS} defaultValue="2" />
            <Select
              label="Hotel Category"
              icon={Building2}
              name="category"
              options={CATEGORY_OPTIONS}
              defaultValue="all"
            />
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowMoreFilters((open) => !open)}
              className="inline-flex items-center gap-2 font-body text-sm text-navy/70 hover:text-gold transition-colors self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
              aria-expanded={showMoreFilters}
              aria-controls="hotel-search-more-filters"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              {showMoreFilters ? 'Hide Filters' : 'More Filters'}
            </button>

            <Button type="submit" variant="gold" size="md" className="w-full md:w-auto">
              <Search className="w-4 h-4 mr-2 inline-block" aria-hidden="true" />
              Search Hotels
            </Button>
          </div>

          {showMoreFilters && (
            <motion.div
              id="hotel-search-more-filters"
              initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-navy/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label="Price Range" name="priceRange" options={PRICE_OPTIONS} defaultValue="any" />
                <Select label="Minimum Rating" name="rating" options={RATING_OPTIONS} defaultValue="any" />
              </div>

              <div className="mt-6">
                <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide">
                  Amenities
                </span>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by amenities">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isSelected = amenities.includes(amenity)
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        aria-pressed={isSelected}
                        className={[
                          'font-body text-xs px-4 py-2 rounded-full border transition-colors',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold',
                          isSelected
                            ? 'bg-navy text-ivory border-navy'
                            : 'bg-transparent text-navy/70 border-navy/15 hover:border-gold hover:text-gold',
                        ].join(' ')}
                      >
                        {amenity}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="font-body text-xs uppercase tracking-wide text-navy/50 mr-1">Popular:</span>
          {POPULAR_DESTINATIONS.map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => setDestination(place)}
              className="font-body text-xs md:text-sm px-4 py-1.5 rounded-full border border-navy/15 text-navy/70 hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {place}
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}