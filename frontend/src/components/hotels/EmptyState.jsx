import { SearchX } from 'lucide-react'

import Button from '@/components/ui/Button.jsx'

export default function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <span className="flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 mb-6">
        <SearchX className="w-7 h-7 text-navy/40" aria-hidden="true" />
      </span>
      <h3 className="font-display text-2xl text-navy">No hotels found.</h3>
      <p className="mt-2 font-body text-sm text-navy/60 max-w-sm">
        Try adjusting your filters or searching a different destination.
      </p>
      <Button variant="outline" size="sm" className="text-navy mt-6" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  )
}