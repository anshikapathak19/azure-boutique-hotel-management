import React from 'react'

const VARIANT_STYLES = {
  default: 'bg-navy/5 text-navy border-navy/10',
  gold: 'bg-gold/10 text-gold border-gold/25',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const classes = [
    'inline-flex items-center px-2.5 py-1 text-xs font-body font-semibold tracking-wider uppercase rounded-full border',
    VARIANT_STYLES[variant] || VARIANT_STYLES.default,
    className,
  ].join(' ')

  return <span className={classes}>{children}</span>
}
