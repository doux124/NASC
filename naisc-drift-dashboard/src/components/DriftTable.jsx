import { cn, clamp, scoreColor } from '@/lib/utils'
import { TYPE_CLASS } from '@/lib/tokens'
import { ActionTag, ImportanceChip } from './ui/Chip'

export function DriftTable({ data, selected, onSelect }) {
  if (!data.length) {
    return (
      <div className="rounded-sm border border-dashed border-border-strong p-8 text-center font-mono text-xs uppercase tracking-widest2 text-ink-faint">
        No drift data loaded.
      </div>
    )
  }

  const maxScore = Math.max(...data.map((d) => d.drift_score), 1)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-strong">
            {['Feature', 'Type', 'Description', 'Drift Score', 'Importance', 'Mitigation'].map(
              (h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-mono text-2xs font-medium uppercase tracking-widest2 text-ink-faint"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isSelected = selected === row.col
            return (
              <tr
                key={`${row.col}-${i}`}
                onClick={() => onSelect?.(row.col)}
                className={cn(
                  'cursor-pointer border-b border-border-subtle transition-colors',
                  isSelected ? 'bg-brand-accent/10' : 'hover:bg-surface-2/60'
                )}
              >
                <td className="px-3 py-2.5">
                  <span className="font-mono text-xs font-semibold text-ink">{row.col}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      'font-mono text-2xs uppercase tracking-widest2',
                      TYPE_CLASS[row.col_type] || 'text-ink-muted'
                    )}
                  >
                    {row.col_type}
                  </span>
                </td>
                <td className="max-w-sm px-3 py-2.5">
                  <span className="text-xs leading-relaxed text-ink-muted">
                    {row.drift_description}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-20 overflow-hidden rounded-sm bg-border-subtle">
                      <div
                        className="h-full transition-[width] duration-700"
                        style={{
                          width: `${clamp((row.drift_score / maxScore) * 100, 4, 100)}%`,
                          background: scoreColor(row.drift_score),
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-ink">
                      {row.drift_score.toFixed(3)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <ImportanceChip important={row.is_important} />
                </td>
                <td className="px-3 py-2.5">
                  <ActionTag action={row.mitigation} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
