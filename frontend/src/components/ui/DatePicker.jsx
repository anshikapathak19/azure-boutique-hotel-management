import React from 'react'
import { CalendarDays } from 'lucide-react'

export default function DatePicker({ label, error, className = '', id, ...props }) {
  const inputId = id || `date-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="flex flex-col w-full text-left relative">
      {label && (
        <label htmlFor={inputId} className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="date"
          className={[
            'font-body text-sm bg-white border border-navy/15 rounded-full px-5 py-3.5 pr-12 w-full outline-none transition-all',
            'focus:border-gold focus:ring-1 focus:ring-gold/20 appearance-none',
            error ? 'border-rose-500' : 'border-navy/15',
            className,
          ].join(' ')}
          {...props}
        />
        <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40 pointer-events-none" />
      </div>
      {error && <span className="font-body text-xs text-rose-500 mt-1">{error}</span>}
    </div>
  )
}
