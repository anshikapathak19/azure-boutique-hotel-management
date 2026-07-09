import React from 'react'

export default function Avatar({ src, alt = '', size = 'md', className = '' }) {
  const SIZE_STYLES = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const initials = alt
    ? alt.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <div className={`shrink-0 rounded-full overflow-hidden bg-gold/15 text-navy font-semibold flex items-center justify-center border border-navy/5 ${SIZE_STYLES[size] || SIZE_STYLES.md} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none' // fallback to initials if image fails to load
          }}
        />
      ) : (
        <span className="text-xs uppercase tracking-wider">{initials}</span>
      )}
    </div>
  )
}
