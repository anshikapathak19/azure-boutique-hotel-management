import { useState, useMemo, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'
import Button from '@/components/ui/Button.jsx'
import HotelSearchBar from '@/components/hotels/HotelSearchBar.jsx'
import HotelFilters from '@/components/hotels/HotelFilters.jsx'
import HotelCardSkeleton from '@/components/hotels/HotelCardSkeleton.jsx'
import EmptyState from '@/components/hotels/EmptyState.jsx'
import Pagination from '@/components/hotels/Pagination.jsx'
import { rooms as hotels } from '@/data/rooms.js'

const PAGE_SIZE = 6

const DEFAULT_FILTERS = {
  destination: '',
  category: 'all',
  priceRange: 'any',
  rating: 'any',
  amenities: [],
  sortBy: 'newest',
}

function matchesPriceRange(price, range) {
  if (range === 'any') return true
  if (range === '800+') return price >= 800
  const [min, max] = range.split('-').map(Number)
  return price >= min && price <= max
}

function matchesRating(rating, minRating) {
  if (minRating === 'any') return true
  return rating >= Number(minRating)
}

export default function HotelListingPage() {
  const shouldReduceMotion = useReducedMotion()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesDestination =
        filters.destination.trim() === '' ||
        `${hotel.name} ${hotel.location} ${hotel.country}`
          .toLowerCase()
          .includes(filters.destination.trim().toLowerCase())

      const matchesCategory = filters.category === 'all' || hotel.category === filters.category

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) => hotel.amenities.includes(amenity))

      return (
        matchesDestination &&
        matchesCategory &&
        matchesPriceRange(hotel.startingPrice, filters.priceRange) &&
        matchesRating(hotel.rating, filters.rating) &&
        matchesAmenities
      )
    })

    switch (filters.sortBy) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'price-asc':
        result = [...result].sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.startingPrice - a.startingPrice)
        break
      default:
        // 'newest' — keep original catalog order
        break
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / PAGE_SIZE))
  const paginatedHotels = filteredHotels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Simulates a brief fetch on every filter/page change — replaced by a
  // real API call in a later milestone.
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [filters, page])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <div className="pt-28 pb-24 md:pb-32">
      <Container>
        <SectionHeading
          eyebrow="Hotel Discovery"
          title="All Boutique Hotels"
          subtitle="Browse the full AzureStay portfolio and filter by destination, category, price, and more."
        />

        <div className="mt-10">
          <HotelSearchBar
            destination={filters.destination}
            onDestinationChange={(value) => setFilters((current) => ({ ...current, destination: value }))}
          />
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <HotelFilters filters={filters} onChange={setFilters} onReset={handleResetFilters} />
            </div>
          </aside>

          <div className="lg:hidden flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 font-body text-sm text-navy border border-navy/15 rounded-full px-5 py-2.5 hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filters
            </button>
            <p className="font-body text-sm text-navy/60">{filteredHotels.length} hotels</p>
          </div>

          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-body text-sm text-navy/60">{filteredHotels.length} hotels found</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <HotelCardSkeleton key={index} />
                ))}
              </div>
            ) : paginatedHotels.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
              >
                {paginatedHotels.map((hotel) => (
                  <RoomCard
                    key={hotel.id}
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
                ))}
              </motion.div>
            )}

            {!isLoading && paginatedHotels.length > 0 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        </div>
      </Container>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={shouldReduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-ivory overflow-y-auto p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Filter hotels"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-navy">Filters</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close filters"
                className="p-2 text-navy hover:text-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HotelFilters filters={filters} onChange={setFilters} onReset={handleResetFilters} />
            <Button
              variant="gold"
              size="md"
              className="w-full mt-6"
              onClick={() => setIsDrawerOpen(false)}
            >
              Show {filteredHotels.length} Hotels
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}