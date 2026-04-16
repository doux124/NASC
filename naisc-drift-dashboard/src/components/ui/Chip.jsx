import { cn } from '@/lib/utils'
import { ACTION_CLASS } from '@/lib/tokens'

export function Chip({ className, children, ...props }) {
  return (
    <span className={cn('chip', className)} {...props}>
      {children}
    </span>
  )
}

export function ActionTag({ action, className }) {
  return <Chip className={cn(ACTION_CLASS[action] || 'tag-none', className)}>{action}</Chip>
}

export function ImportanceChip({ important }) {
  return (
    <Chip className={important ? 'chip-high' : 'chip-low'}>
      {important ? '▲ High' : '▼ Low'}
    </Chip>
  )
}
