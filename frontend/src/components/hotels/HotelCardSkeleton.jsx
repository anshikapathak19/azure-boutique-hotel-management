export default function HotelCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md shadow-navy/5 motion-safe:animate-pulse">
      <div className="h-64 bg-navy/10" />
      <div className="p-6 md:p-7 space-y-4">
        <div className="h-5 bg-navy/10 rounded w-3/4" />
        <div className="h-3.5 bg-navy/10 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-navy/10 rounded-full w-20" />
          <div className="h-6 bg-navy/10 rounded-full w-20" />
          <div className="h-6 bg-navy/10 rounded-full w-20" />
        </div>
        <div className="pt-5 border-t border-navy/10 flex items-center justify-between">
          <div className="h-5 bg-navy/10 rounded w-24" />
          <div className="h-9 bg-navy/10 rounded-full w-24" />
        </div>
      </div>
    </div>
  )
}