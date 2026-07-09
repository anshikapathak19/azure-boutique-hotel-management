import { useParams, Link } from 'react-router-dom'

import { ROUTES } from '@/config/routes.js'

export default function HotelDetailPage() {
  const { id } = useParams()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <p className="font-body text-gold tracking-widest uppercase text-sm mb-4">Hotel Details</p>
      <h1 className="font-display text-4xl text-navy mb-4">Coming Soon</h1>
      <p className="font-body text-navy/70 mb-8 max-w-md">
        The detail page for “{id}” is being built in an upcoming milestone.
      </p>
      <Link
        to={ROUTES.hotels}
        className="font-body px-6 py-3 bg-navy text-ivory rounded-full hover:bg-navy/90 transition-colors"
      >
        Back to All Hotels
      </Link>
    </div>
  )
}