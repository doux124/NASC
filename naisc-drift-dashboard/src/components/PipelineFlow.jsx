import { cn } from '@/lib/utils'

const STEPS = [
  { n: '01', label: 'Baseline\nImportances', state: 'done' },
  { n: '02', label: 'Drift\nDetection', state: 'done' },
  { n: '03', label: 'Drift\nMitigation', state: 'done' },
  { n: '04', label: 'Final\nModel', state: 'active' },
]

export function PipelineFlow() {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-all',
                s.state === 'done' &&
                  'border-brand-teal bg-brand-teal/10 text-brand-teal shadow-glow-teal',
                s.state === 'active' &&
                  'border-brand-accent bg-brand-accent/10 text-brand-accent2 shadow-glow-accent'
              )}
            >
              {s.n}
            </div>
            <div className="text-center font-mono text-2xs uppercase leading-tight tracking-widest2 text-ink-muted">
              {s.label.split('\n').map((l, j) => (
                <span key={j} className="block">
                  {l}
                </span>
              ))}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className="relative mx-1 h-[2px] flex-1 bg-border-subtle">
              <div
                className={cn(
                  'absolute inset-y-0 left-0',
                  s.state === 'done' ? 'w-full bg-brand-teal/60' : 'w-1/2 bg-brand-accent/60'
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
