import { HOTEL_CATEGORIES, AMENITY_FILTER_OPTIONS, SORT_OPTIONS } from '@/config/constants.js'
import Select from '@/components/ui/Select.jsx'

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

export default function HotelFilters({ filters, onChange, onReset }) {
  const updateFilter = (key, value) => {
    onChange((current) => ({ ...current, [key]: value }))
  }

  const toggleAmenity = (amenity) => {
    onChange((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }))
  }

  return (
    <div className="space-y-7">
      <Select
        label="Sort By"
        options={SORT_OPTIONS}
        value={filters.sortBy}
        onChange={(event) => updateFilter('sortBy', event.target.value)}
      />

      <div>
        <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide">
          Hotel Category
        </span>
        <div className="mt-3 flex flex-col gap-2.5">
          <label className="flex items-center gap-2 font-body text-sm text-navy/80 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'all'}
              onChange={() => updateFilter('category', 'all')}
              className="accent-gold w-4 h-4"
            />
            All Categories
          </label>
          {HOTEL_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 font-body text-sm text-navy/80 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => updateFilter('category', category)}
                className="accent-gold w-4 h-4"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <Select
        label="Price Range"
        options={PRICE_OPTIONS}
        value={filters.priceRange}
        onChange={(event) => updateFilter('priceRange', event.target.value)}
      />

      <Select
        label="Minimum Rating"
        options={RATING_OPTIONS}
        value={filters.rating}
        onChange={(event) => updateFilter('rating', event.target.value)}
      />

      <div>
        <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide">
          Amenities
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMENITY_FILTER_OPTIONS.map((amenity) => {
            const isSelected = filters.amenities.includes(amenity)
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

      <button
        type="button"
        onClick={onReset}
        className="font-body text-sm text-navy/70 underline underline-offset-2 hover:text-gold transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}