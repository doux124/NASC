import { cn } from '@/lib/utils'

const COLOR_MAP = {
  accent: { text: 'text-brand-accent2', accent: 'bg-brand-accent' },
  teal: { text: 'text-brand-teal', accent: 'bg-brand-teal' },
  purple: { text: 'text-brand-purple', accent: 'bg-brand-purple' },
  orange: { text: 'text-brand-orange', accent: 'bg-brand-orange' },
  amber: { text: 'text-brand-amber', accent: 'bg-brand-amber' },
}

export function MetricCard({
  label,
  value,
  unit,
  color = 'accent',
  sub,
  delayClass = '',
  className,
}) {
  const c = COLOR_MAP[color] || COLOR_MAP.accent
  return (
    <div
      className={cn(
        'metric-card animate-fade-up',
        delayClass,
        className
      )}
    >
      <div className={cn('absolute left-0 top-0 h-full w-0.5', c.accent)} />
      <div className="font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
        {label}
      </div>
      <div className={cn('mt-2 font-display text-3xl font-bold leading-none', c.text)}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium">{unit}</span>}
      </div>
      {sub && (
        <div className="mt-2 font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
          {sub}
        </div>
      )}
    </div>
  )
}
