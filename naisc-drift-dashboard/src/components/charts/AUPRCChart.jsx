import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { COLORS } from '@/lib/tokens'

export function AUPRCChart({ trainAUPRC, testAUPRC }) {
  const data = [
    { name: 'Train', auprc: trainAUPRC },
    { name: 'Test', auprc: testAUPRC },
  ]
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between border-b border-border-subtle pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-2xs uppercase tracking-widest2 text-brand-teal">
            Train AU-PRC
          </span>
          <strong className="font-display text-3xl font-bold text-brand-teal">
            {trainAUPRC.toFixed(3)}
          </strong>
        </div>
        <div className="font-mono text-xs text-ink-faint">vs</div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-2xs uppercase tracking-widest2 text-brand-accent2">
            Test AU-PRC
          </span>
          <strong className="font-display text-3xl font-bold text-brand-accent2">
            {testAUPRC.toFixed(3)}
          </strong>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            domain={[0, 1]}
            tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: COLORS.muted }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontFamily: 'Space Mono', fontSize: 11, fill: COLORS.muted2 }}
            width={46}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="auprc" radius={[0, 3, 3, 0]}>
            <Cell fill={COLORS.teal} />
            <Cell fill={COLORS.accent} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
