import React from 'react'

export default function Textarea({ label, error, className = '', id, ...props }) {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="flex flex-col w-full text-left">
      {label && (
        <label htmlFor={inputId} className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide mb-2">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          'font-body text-sm bg-white border rounded-xl p-4 min-h-[100px] outline-none transition-all resize-y',
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
            : 'border-navy/15 focus:border-gold focus:ring-1 focus:ring-gold/20',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="font-body text-xs text-rose-500 mt-1">{error}</span>}
    </div>
  )
}
