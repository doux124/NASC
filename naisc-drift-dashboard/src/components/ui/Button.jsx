import { cn } from '@/lib/utils'

export function Button({ variant = 'default', className, children, ...props }) {
  return (
    <button
      className={cn('btn', variant === 'accent' && 'btn-accent', className)}
      {...props}
    >
      {children}
    </button>
  )
}
