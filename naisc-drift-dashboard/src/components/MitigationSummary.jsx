import { ProgressBar } from './ui/ProgressBar'
import { ActionTag } from './ui/Chip'
import { COLORS } from '@/lib/tokens'

const MITIGATION_COLOR = {
  'Drop Feature': COLORS.accent,
  'Feature Scaling': COLORS.purple,
  'Seasonality Matching': COLORS.teal,
  'No Action': COLORS.muted,
}

export function MitigationSummary({ data }) {
  const counts = data.reduce((acc, d) => {
    acc[d.mitigation] = (acc[d.mitigation] || 0) + 1
    return acc
  }, {})
  const items = Object.entries(counts).map(([k, v]) => ({ label: k, count: v }))
  const total = data.length || 1

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ label, count }) => (
        <div key={label}>
          <div className="mb-1.5 flex items-center justify-between">
            <ActionTag action={label} />
            <span className="font-mono text-2xs uppercase tracking-widest2 text-ink-muted">
              {count}/{total}
            </span>
          </div>
          <ProgressBar
            value={count}
            max={total}
            color={MITIGATION_COLOR[label] || COLORS.muted}
          />
        </div>
      ))}

      <div className="mt-4 rounded-sm border border-border-subtle bg-surface-2 p-3">
        <div className="mb-1 font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
          DDLA Threshold
        </div>
        <div className="font-mono text-xs leading-relaxed text-ink-muted">
          Features below <span className="text-brand-accent2">median importance</span> → Drop
          <br />
          Features above → Targeted mitigation
        </div>
      </div>
    </div>
  )
}
