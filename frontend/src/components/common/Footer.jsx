import { Gem, Instagram, Facebook, Twitter, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

import Container from '@/components/ui/Container.jsx'
import { BRAND, CONTACT, SOCIAL_LINKS } from '@/config/constants.js'
import { ROUTES, FOOTER_LINKS, FOR_HOTELS_LINKS } from '@/config/routes.js'

const SOCIAL_ICONS = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
]

export default function Footer() {
  const handleNewsletterSubmit = (event) => {
    event.preventDefault()
    // Will connect to backend later
  }

  return (
    <footer className="bg-charcoal text-ivory">
      <Container className="py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

        {/* Brand */}
        <div>
          <Link
            to={ROUTES.home}
            className="flex items-center gap-2 font-display text-2xl text-ivory"
          >
            <Gem className="w-5 h-5 text-gold" aria-hidden="true" />
            {BRAND.name}
          </Link>

          <p className="mt-4 font-body text-sm text-ivory/60 max-w-xs leading-relaxed">
            Curating exceptional boutique hotels around the world through one
            premium booking platform.
          </p>

          <div className="mt-6 flex items-center gap-4">
            {SOCIAL_ICONS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-ivory/10 hover:bg-gold hover:text-navy transition-colors duration-300"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-ivory/50">
            Explore
          </h3>

          <ul className="mt-5 space-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                {link.path.startsWith('/') ? (
                  <Link
                    to={link.path}
                    className="font-body text-sm text-ivory/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.path}
                    className="font-body text-sm text-ivory/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* For Hotels */}
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-ivory/50">
            For Hotels
          </h3>

          <ul className="mt-5 space-y-3">
            {FOR_HOTELS_LINKS.map((link) => (
              <li key={link.label}>
                {link.path.startsWith('/') ? (
                  <Link
                    to={link.path}
                    className="font-body text-sm text-ivory/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.path}
                    className="font-body text-sm text-ivory/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-ivory/50">
            Exclusive Updates
          </h3>

          <p className="mt-5 font-body text-sm text-ivory/75 leading-relaxed">
            Receive curated boutique hotel recommendations, exclusive member
            offers, and early access to newly listed luxury properties.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-5 flex gap-2"
          >
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email Address
            </label>

            <input
              id="footer-newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full min-w-0 rounded-full bg-ivory/10 border border-ivory/15 px-4 py-2.5 font-body text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/60"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gold text-navy hover:bg-gold/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ivory"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-4 font-body text-xs text-ivory/40">
            {CONTACT.email}
          </p>
        </div>

      </Container>

      <div className="border-t border-ivory/10">
        <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="font-body text-xs text-ivory/50">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>

          <p className="font-body text-xs text-ivory/40 tracking-wide">
            Discover • Book • Experience Luxury
          </p>

        </Container>
      </div>
    </footer>
  )
}