import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { COLORS } from '@/lib/tokens'

export function ScoreHistogram({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.35} />
            <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
        <XAxis
          dataKey="range"
          tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: COLORS.muted }}
        />
        <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: COLORS.muted }} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.accent, strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={COLORS.accent}
          strokeWidth={2}
          fill="url(#score-grad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
