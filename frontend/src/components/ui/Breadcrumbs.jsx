import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items = [], className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`font-body text-xs text-navy/50 flex items-center gap-2 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={item.label}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-navy/30" />}
            {isLast ? (
              <span className="text-navy/80 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-gold transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
