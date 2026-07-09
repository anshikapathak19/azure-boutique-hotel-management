export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
      <div
        className="rounded-full border-4 border-navy/15 border-t-gold animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="sr-only">Loading…</span>
    </div>
  )
}