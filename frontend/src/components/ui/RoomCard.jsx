import { motion, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function RoomCard({
  image,
  title,
  description,
  price,
  rating,
  amenities = [],
  badge,
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      whileHover={shouldReduceMotion ? {} : { y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group bg-card rounded-2xl overflow-hidden shadow-md shadow-navy/5 hover:shadow-xl hover:shadow-navy/10 transition-shadow duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-gold text-navy text-xs font-body font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl md:text-2xl text-navy">{title}</h3>
          {typeof rating === 'number' && (
            <div className="flex items-center gap-1 shrink-0 mt-1" aria-label={`Rated ${rating} out of 5`}>
              <Star className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
              <span className="font-body text-sm text-navy/80">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="mt-3 font-body text-sm md:text-base text-navy/70 leading-relaxed">
          {description}
        </p>

        {amenities.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Room amenities">
            {amenities.map((amenity) => (
              <li
                key={amenity}
                className="font-body text-xs text-navy/70 bg-navy/5 px-3 py-1 rounded-full"
              >
                {amenity}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-5">
          <p className="font-body text-navy">
            <span className="font-display text-lg md:text-xl text-navy">${price}</span>
            <span className="text-sm text-navy/60"> / night</span>
          </p>
        </div>
      </div>
    </motion.article>
  )
}