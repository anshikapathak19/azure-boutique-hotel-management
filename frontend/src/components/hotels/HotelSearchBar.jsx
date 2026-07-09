import { MapPin, CalendarDays, Users, Search } from 'lucide-react'

import Input from '@/components/ui/Input.jsx'
import Select from '@/components/ui/Select.jsx'
import Button from '@/components/ui/Button.jsx'

const GUEST_OPTIONS = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4+ Guests' },
]

export default function HotelSearchBar({ destination, onDestinationChange }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    // UI only — destination already filters live via shared page state;
    // wired to a real search endpoint in a later milestone.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg shadow-navy/10 border border-navy/5 p-6 md:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <Input
          label="Destination"
          icon={MapPin}
          type="text"
          name="destination"
          placeholder="City, region, or hotel"
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
        />
        <Input label="Check In" icon={CalendarDays} type="date" name="checkIn" />
        <Input label="Check Out" icon={CalendarDays} type="date" name="checkOut" />
        <Select label="Guests" icon={Users} name="guests" options={GUEST_OPTIONS} defaultValue="2" />
        <div className="flex items-end">
          <Button type="submit" variant="gold" size="md" className="w-full">
            <Search className="w-4 h-4 mr-2 inline-block" aria-hidden="true" />
            Search Hotels
          </Button>
        </div>
      </div>
    </form>
  )
}