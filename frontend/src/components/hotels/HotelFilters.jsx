import { HOTEL_CATEGORIES, AMENITY_FILTER_OPTIONS, SORT_OPTIONS } from '@/config/constants.js'
import Select from '@/components/ui/Select.jsx'
import DatePicker from '@/components/ui/DatePicker.jsx'

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

      {/* Date Pickers - Availability */}
      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label="Check In"
          value={filters.checkIn || ''}
          onChange={(event) => updateFilter('checkIn', event.target.value)}
        />
        <DatePicker
          label="Check Out"
          value={filters.checkOut || ''}
          onChange={(event) => updateFilter('checkOut', event.target.value)}
        />
      </div>

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

      {/* Price Slider */}
      <div>
        <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide flex justify-between">
          <span>Max Nightly Price</span>
          <span className="font-semibold text-navy">${filters.maxPrice || 1000}</span>
        </span>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={filters.maxPrice || 1000}
          onChange={(event) => updateFilter('maxPrice', Number(event.target.value))}
          className="w-full accent-gold h-1 bg-navy/10 rounded-lg appearance-none cursor-pointer mt-3"
        />
        <div className="flex justify-between font-body text-[10px] text-navy/40 mt-1">
          <span>$100</span>
          <span>$1000+</span>
        </div>
      </div>

      <Select
        label="Minimum Rating"
        options={[
          { value: 'any', label: 'Any Rating' },
          { value: '4', label: '4.0+' },
          { value: '4.5', label: '4.5+' },
          { value: '5', label: '5.0 Only' },
        ]}
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
        className="font-body text-sm text-navy/70 underline underline-offset-2 hover:text-gold transition-colors cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  )
}