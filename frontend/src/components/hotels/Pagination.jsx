import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Hotel results pages" className="mt-14 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-navy/15 text-navy disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === currentPage ? 'page' : undefined}
          className={[
            'w-10 h-10 flex items-center justify-center rounded-full font-body text-sm transition-colors',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold',
            pageNumber === currentPage
              ? 'bg-navy text-ivory'
              : 'text-navy/70 border border-navy/15 hover:border-gold hover:text-gold',
          ].join(' ')}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-navy/15 text-navy disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  )
}