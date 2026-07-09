import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SlidersHorizontal, Grid, List } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'
import Button from '@/components/ui/Button.jsx'
import Drawer from '@/components/ui/Drawer.jsx'
import HotelSearchBar from '@/components/hotels/HotelSearchBar.jsx'
import HotelFilters from '@/components/hotels/HotelFilters.jsx'
import HotelCardSkeleton from '@/components/hotels/HotelCardSkeleton.jsx'
import EmptyState from '@/components/hotels/EmptyState.jsx'
import Pagination from '@/components/hotels/Pagination.jsx'
import { HotelService } from '@/services/HotelService.js'

const PAGE_SIZE = 6

const DEFAULT_FILTERS = {
  destination: '',
  category: 'all',
  maxPrice: 1000,
  rating: 'any',
  amenities: [],
  sortBy: 'newest',
  checkIn: '',
  checkOut: '',
}

export default function HotelListingPage() {
  const shouldReduceMotion = useReducedMotion()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [layout, setLayout] = useState('grid') // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filteredHotels, setFilteredHotels] = useState([])

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / PAGE_SIZE))
  const paginatedHotels = filteredHotels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Fetch hotels asynchronously from the HotelService
  useEffect(() => {
    let active = true
    setIsLoading(true)
    
    HotelService.getHotels(filters)
      .then((res) => {
        if (active) {
          setFilteredHotels(res.data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load hotels:', err)
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const isList = layout === 'list'

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

          {/* Mobile filter bar */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 font-body text-sm text-navy border border-navy/15 rounded-full px-5 py-2.5 hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filters
            </button>
            
            <div className="flex items-center gap-4">
              <p className="font-body text-sm text-navy/60">{filteredHotels.length} hotels</p>
              
              {/* Layout Toggle */}
              <div className="flex items-center gap-1 border border-navy/10 rounded-full p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${layout === 'grid' ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy'}`}
                  aria-label="Grid layout"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${layout === 'list' ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy'}`}
                  aria-label="List layout"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-body text-sm text-navy/60">{filteredHotels.length} hotels found</p>
              
              {/* Layout Toggle */}
              <div className="flex items-center gap-1 border border-navy/10 rounded-full p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${layout === 'grid' ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy'}`}
                  aria-label="Grid layout"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${layout === 'list' ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy'}`}
                  aria-label="List layout"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className={isList ? 'flex flex-col gap-8 md:gap-10' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'}>
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
                className={isList ? 'flex flex-col gap-8 md:gap-10' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'}
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
                    layout={layout}
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

      {/* Mobile filter Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filter Hotels"
      >
        <div className="flex-1 overflow-y-auto">
          <HotelFilters filters={filters} onChange={setFilters} onReset={handleResetFilters} />
        </div>
        <div className="mt-8 pt-4 border-t border-navy/10 bg-ivory">
          <Button
            variant="gold"
            size="md"
            className="w-full cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
          >
            Show {filteredHotels.length} Hotels
          </Button>
        </div>
      </Drawer>
    </div>
  )
}