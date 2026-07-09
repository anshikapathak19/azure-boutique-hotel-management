export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as: HeadingTag = 'h2',
  className = '',
}) {
  const isCentered = align === 'center'

  return (
    <div
      className={[
        'max-w-2xl',
        isCentered ? 'mx-auto text-center' : 'text-left',
        className,
      ].join(' ')}
    >
      {eyebrow && (
        <p className="font-body text-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">
          {eyebrow}
        </p>
      )}

      <HeadingTag className="font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight">
        {title}
      </HeadingTag>

      {subtitle && (
        <p className="mt-4 font-body text-navy/70 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}