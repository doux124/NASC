import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ dotColor, className, children }) {
  return (
    <div className={cn('card-title', className)}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: dotColor || '#e4006a',
          boxShadow: `0 0 8px ${dotColor || '#e4006a'}`,
        }}
      />
      {children}
    </div>
  )
}

export function SectionHeader({ title, children, className }) {
  return (
    <div className={cn('mb-4 flex items-center justify-between gap-3', className)}>
      <div className="font-display text-lg font-semibold uppercase tracking-widest2 text-ink">
        {title}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
