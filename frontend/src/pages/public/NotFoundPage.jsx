import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes.js'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <p className="font-body text-gold tracking-widest uppercase text-sm mb-4">Error 404</p>
      <h1 className="font-display text-5xl text-navy mb-4">Page not found</h1>
      <p className="font-body text-navy/70 mb-8 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to={ROUTES.home}
        className="font-body px-6 py-3 bg-navy text-ivory rounded-full hover:bg-navy/90 transition-colors"
      >
        Return home
      </Link>
    </div>
  )
}