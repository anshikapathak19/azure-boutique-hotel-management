import { motion, useReducedMotion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'

import Button from '@/components/ui/Button.jsx'

export default function RoomCard({
  image,
  name,
  location,
  price,
  rating,
  roomsCount,
  amenities = [],
  badge,
  href = '#',
  to,
  layout = 'grid',
}) {
  const shouldReduceMotion = useReducedMotion()
  const isList = layout === 'list'

  return (
    <motion.article
      whileHover={shouldReduceMotion ? {} : { y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={[
        'group bg-card rounded-2xl overflow-hidden shadow-md shadow-navy/5 hover:shadow-xl hover:shadow-navy/10 transition-shadow duration-300 flex',
        isList ? 'flex-col md:flex-row' : 'flex-col',
      ].join(' ')}
    >
      <div className={['relative overflow-hidden', isList ? 'w-full md:w-80 h-64 md:h-auto' : 'h-64'].join(' ')}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-gold text-navy text-xs font-body font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className={['flex flex-col flex-1', isList ? 'p-6 md:p-8' : 'p-6 md:p-7'].join(' ')}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl md:text-2xl text-navy">{name}</h3>
          {typeof rating === 'number' && (
            <div className="flex items-center gap-1 shrink-0 mt-1" aria-label={`Rated ${rating} out of 5`}>
              <Star className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
              <span className="font-body text-sm text-navy/80">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 font-body text-sm text-navy/60">
          <MapPin className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
          {location}
        </p>

        {amenities.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${name} top 3 amenities`}>
            {amenities.slice(0, 3).map((amenity) => (
              <li
                key={amenity}
                className="font-body text-xs text-navy/70 bg-navy/5 px-3 py-1 rounded-full"
              >
                {amenity}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5 border-t border-navy/10 flex items-center justify-between gap-4 mt-6">
          <div>
            <p className="font-display text-lg md:text-xl text-navy">
              From ${price}
              <span className="font-body text-sm font-normal text-navy/60"> / night</span>
            </p>
            {typeof roomsCount === 'number' && (
              <p className="font-body text-xs text-navy/50 mt-1">{roomsCount} rooms</p>
            )}
          </div>

          {to ? (
            <Button to={to} variant="outline" size="sm" className="text-navy shrink-0">
              View Hotel
            </Button>
          ) : (
            <Button href={href} variant="outline" size="sm" className="text-navy shrink-0">
              View Hotel
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  )
}