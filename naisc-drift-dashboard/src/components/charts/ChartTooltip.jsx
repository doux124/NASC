export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-sm border border-border-strong bg-surface-1/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="mb-1 font-mono text-2xs uppercase tracking-widest2 text-ink-muted">
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          className="font-mono text-xs font-bold"
          style={{ color: p.color }}
        >
          {typeof p.value === 'number' ? p.value.toFixed(3) : p.value}
        </div>
      ))}
    </div>
  )
}
