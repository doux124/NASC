import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { COLORS } from '@/lib/tokens'
import { scoreColor } from '@/lib/utils'

export function DriftScoreChart({ data, selected, onSelect }) {
  const chartData = data.map((d) => ({ name: d.col, score: +d.drift_score.toFixed(3) }))
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 6, right: 12, left: -8, bottom: 36 }}
        onClick={(e) =>
          e?.activePayload && onSelect?.(e.activePayload[0].payload.name)
        }
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: COLORS.muted }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontFamily: 'Space Mono', fontSize: 10, fill: COLORS.muted }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="score" radius={[2, 2, 0, 0]} cursor="pointer">
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.name === selected ? COLORS.accent2 : scoreColor(entry.score)}
              opacity={selected && entry.name !== selected ? 0.35 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
