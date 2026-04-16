import { clamp } from '@/lib/utils'

export function ProgressBar({ value, max = 1, color = '#e4006a', height = 4, min = 0 }) {
  const pct = clamp((value / max) * 100, min, 100)
  return (
    <div
      className="w-full overflow-hidden rounded-sm bg-border-subtle"
      style={{ height }}
    >
      <div
        className="h-full rounded-sm transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
