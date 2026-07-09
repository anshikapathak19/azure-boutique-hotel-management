export default function Input({
  label,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide">
          {label}
        </span>
      )}
      <span className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 w-4 h-4 text-gold pointer-events-none" aria-hidden="true" />
        )}
        <input
          className={[
            'w-full rounded-xl border border-navy/10 bg-white font-body text-sm text-navy',
            'py-3 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-shadow',
            Icon ? 'pl-10 pr-4' : 'px-4',
            className,
          ].join(' ')}
          {...props}
        />
      </span>
    </label>
  )
}