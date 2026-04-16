import { Activity } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-surface-0/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Left — Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-accent animate-pulse-dot" />
            <span
              className="h-2.5 w-2.5 rounded-full bg-brand-orange animate-pulse-dot"
              style={{ animationDelay: '200ms' }}
            />
            <span
              className="h-2.5 w-2.5 rounded-full bg-brand-teal animate-pulse-dot"
              style={{ animationDelay: '400ms' }}
            />
          </div>
          <div className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            NAISC <span className="text-brand-accent">2026</span>
            <span className="mx-2 text-ink-faint">—</span>
            <span className="text-ink">Drift Intelligence</span>
          </div>
        </div>

        {/* Right — Status badges */}
        <div className="hidden items-center gap-2 md:flex">
          <Badge color="teal">LightGBM v4.6.0</Badge>
          <Badge color="accent">Binary Churn</Badge>
          <Badge color="orange">Python 3.12</Badge>
          <div className="ml-2 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-widest2 text-brand-teal">
            <Activity className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function Badge({ color, children }) {
  const map = {
    teal: 'border-brand-teal/40 bg-brand-teal/10 text-brand-teal',
    accent: 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent2',
    orange: 'border-brand-orange/40 bg-brand-orange/10 text-brand-orange',
  }
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-2xs uppercase tracking-widest2 ${map[color]}`}
    >
      {children}
    </span>
  )
}
