import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const VARIANT_STYLES = {
  gold: 'bg-gold text-navy hover:bg-gold/90 shadow-sm shadow-navy/10',
  outline: 'bg-transparent border border-current hover:bg-current/10',
}

const SIZE_STYLES = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-8 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'gold',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()

  const classes = [
    'inline-flex items-center justify-center rounded-full font-body font-medium',
    'transition-colors duration-300 focus-visible:outline focus-visible:outline-2',
    'focus-visible:outline-offset-2 focus-visible:outline-gold',
    VARIANT_STYLES[variant] || VARIANT_STYLES.gold,
    SIZE_STYLES[size] || SIZE_STYLES.md,
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <motion.button
      className={classes}
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}