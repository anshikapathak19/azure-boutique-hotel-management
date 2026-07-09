import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Gem } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Button from '@/components/ui/Button.jsx'
import useScrolled from '@/hooks/useScrolled.js'
import { ROUTES, NAV_LINKS } from '@/config/routes.js'
import { BRAND } from '@/config/constants.js'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const scrolled = useScrolled(40)
  const shouldReduceMotion = useReducedMotion()

  const isHome = location.pathname === ROUTES.home
  const isTransparent = isHome && !scrolled && !menuOpen
  const textColor = isTransparent ? 'text-ivory' : 'text-navy'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={[
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-ivory/70 backdrop-blur-xl shadow-sm shadow-navy/5 border-b border-navy/5',
      ].join(' ')}
    >
      <Container className="flex items-center justify-between h-24">
        <Link
          to={ROUTES.home}
         className={`flex items-center gap-3 font-display text-[1.7rem] font-medium tracking-[-0.02em] ${textColor}`}
        >
          <Gem className="w-5 h-5 text-gold" aria-hidden="true" />
          {BRAND.name}
        </Link>

        <nav
          className={`hidden md:flex items-center gap-12 font-body text-[15px] font-medium tracking-[0.08em] uppercase ${textColor}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
           const destination = link.path.startsWith('/')
             ? link.path
              : isHome
                ? link.path
                 : `/${link.path}`

           return link.path.startsWith('/') ? (
           <Link
            key={link.label}
              to={destination}
              className="hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
               >
      {link.label}
    </Link>
  ) : (
    <a
      key={link.label}
      href={destination}
      className="hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
    >
      {link.label}
    </a>
  )
})}
        </nav>

        <div className={`hidden md:flex items-center gap-6 ${textColor}`}>
          <Link
            to={ROUTES.login}
            className="text-sm font-body hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
          >
            Login
          </Link>
          <Button href={ROUTES.hotels} variant="gold" size="sm">
           Book Now
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`md:hidden p-2 -mr-2 ${textColor}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-ivory/95 backdrop-blur-md border-t border-navy/5 overflow-hidden"
          >
            <Container className="flex flex-col gap-1 py-6 text-navy font-body">
              {NAV_LINKS.map((link) => {
              const destination = link.path.startsWith('/')
                ? link.path
                : isHome
                 ? link.path
                    : `/${link.path}`

               return link.path.startsWith('/') ? (
                <Link
                   key={link.label}
                 to={destination}
                className="py-3 hover:text-gold transition-colors"
                 >
      {link.label}
    </Link>
  ) : (
    <a
      key={link.label}
      href={destination}
      className="py-3 hover:text-gold transition-colors"
    >
      {link.label}
    </a>
  )
})}
              <div className="flex flex-col gap-3 mt-4">
                <Link to={ROUTES.login} className="text-center py-3 hover:text-gold transition-colors">
                  Login
                </Link>
                <Button href={ROUTES.hotels} variant="gold" size="sm">
                  Book Now
                </Button>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}