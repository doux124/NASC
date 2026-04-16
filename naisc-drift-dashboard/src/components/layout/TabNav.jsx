import { cn } from '@/lib/utils'
import { LayoutDashboard, Waves, Users } from 'lucide-react'

const TABS = [
  { id: 'overview', Icon: LayoutDashboard, label: 'Overview' },
  { id: 'drift', Icon: Waves, label: 'Drift Analysis' },
  { id: 'predictions', Icon: Users, label: 'Predictions' },
]

export function TabNav({ active, onChange }) {
  return (
    <nav className="sticky top-[65px] z-10 border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl gap-1 px-4">
        {TABS.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn('tab-btn', active === id && 'active')}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
