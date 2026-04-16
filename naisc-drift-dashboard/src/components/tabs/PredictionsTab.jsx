import { useMemo, useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardTitle, SectionHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ScoreHistogram } from '@/components/charts/ScoreHistogram'
import { UploadZone } from '@/components/UploadZone'
import { useCsvUpload } from '@/hooks/useCsvUpload'
import { COLORS } from '@/lib/tokens'
import { RotateCcw } from 'lucide-react'

const RISK_SEGMENTS = [
  { label: 'Critical (≥ 0.8)', lo: 0.8, hi: 1.01, color: COLORS.accent },
  { label: 'High (0.6 – 0.8)', lo: 0.6, hi: 0.8, color: COLORS.accent2 },
  { label: 'Medium (0.4 – 0.6)', lo: 0.4, hi: 0.6, color: COLORS.orange },
  { label: 'Low (0.2 – 0.4)', lo: 0.2, hi: 0.4, color: COLORS.teal },
  { label: 'Minimal (< 0.2)', lo: 0, hi: 0.2, color: COLORS.muted },
]

function riskFor(score) {
  if (score >= 0.8) return { label: 'Critical', color: COLORS.accent }
  if (score >= 0.6) return { label: 'High', color: COLORS.accent2 }
  if (score >= 0.4) return { label: 'Medium', color: COLORS.orange }
  return { label: 'Low', color: COLORS.teal }
}

export function PredictionsTab() {
  const [predictions, setPredictions] = useState([])

  const upload = useCsvUpload({
    onLoad: (rows) => {
      const parsed = rows
        .map((r) => ({ ...r, probability_score: parseFloat(r.probability_score) }))
        .filter((r) => Number.isFinite(r.probability_score))
      setPredictions(parsed)
    },
  })

  const { histogram, highRisk, meanScore, sorted } = useMemo(() => {
    if (!predictions.length) {
      return { histogram: [], highRisk: 0, meanScore: 0, sorted: [] }
    }
    const bins = 20
    const counts = Array(bins).fill(0)
    let total = 0
    let hr = 0
    for (const p of predictions) {
      const s = p.probability_score
      total += s
      if (s >= 0.5) hr += 1
      const idx = Math.min(Math.floor(s * bins), bins - 1)
      counts[idx] += 1
    }
    return {
      histogram: counts.map((c, i) => ({
        range: (i / bins + 1 / (bins * 2)).toFixed(2),
        count: c,
      })),
      highRisk: hr,
      meanScore: total / predictions.length,
      sorted: [...predictions].sort((a, b) => b.probability_score - a.probability_score),
    }
  }, [predictions])

  if (!predictions.length) {
    return (
      <UploadZone
        drag={upload.drag}
        onDragOver={upload.onDragOver}
        onDragLeave={upload.onDragLeave}
        onDrop={upload.onDrop}
        onClick={upload.openPicker}
        inputRef={upload.inputRef}
        onInputChange={upload.onInputChange}
        error={upload.error}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Total Customers"
          value={predictions.length}
          color="purple"
          delayClass="delay-1"
        />
        <MetricCard
          label="High Risk (≥0.5)"
          value={highRisk}
          color="accent"
          sub={`${((highRisk / predictions.length) * 100).toFixed(1)}% of set`}
          delayClass="delay-2"
        />
        <MetricCard
          label="Low Risk (<0.5)"
          value={predictions.length - highRisk}
          color="teal"
          delayClass="delay-3"
        />
        <MetricCard
          label="Mean Score"
          value={meanScore.toFixed(3)}
          color="orange"
          delayClass="delay-4"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="animate-fade-up delay-1">
          <CardTitle>Score Distribution</CardTitle>
          <ScoreHistogram data={histogram} />
        </Card>

        <Card className="animate-fade-up delay-2">
          <CardTitle dotColor={COLORS.orange}>Risk Segments</CardTitle>
          <div className="flex flex-col gap-3 pt-2">
            {RISK_SEGMENTS.map((seg) => {
              const cnt = predictions.filter(
                (p) => p.probability_score >= seg.lo && p.probability_score < seg.hi
              ).length
              const pct = (cnt / predictions.length) * 100
              return (
                <div key={seg.label}>
                  <div className="mb-1.5 flex justify-between">
                    <span
                      className="font-mono text-2xs uppercase tracking-widest2"
                      style={{ color: seg.color }}
                    >
                      {seg.label}
                    </span>
                    <span className="font-mono text-2xs uppercase tracking-widest2 text-ink-muted">
                      {cnt} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <ProgressBar value={cnt} max={predictions.length} color={seg.color} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="animate-fade-up delay-3">
        <SectionHeader title="Top 20 At-Risk Customers">
          <Button variant="accent" onClick={() => setPredictions([])}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </SectionHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-strong">
                {['#', 'Customer ID', 'Churn Probability', 'Risk'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-mono text-2xs font-medium uppercase tracking-widest2 text-ink-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 20).map((p, i) => {
                const risk = riskFor(p.probability_score)
                return (
                  <tr
                    key={i}
                    className="border-b border-border-subtle transition-colors hover:bg-surface-2/60"
                  >
                    <td className="px-3 py-2.5 font-mono text-2xs text-ink-faint">{i + 1}</td>
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-ink">
                      {p.CustomerID ?? p.customer_id ?? '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-32 overflow-hidden rounded-sm bg-border-subtle">
                          <div
                            className="h-full transition-[width] duration-700"
                            style={{
                              width: `${p.probability_score * 100}%`,
                              background: risk.color,
                            }}
                          />
                        </div>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: risk.color }}
                        >
                          {p.probability_score.toFixed(4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Chip
                        style={{
                          color: risk.color,
                          borderColor: `${risk.color}66`,
                          background: `${risk.color}1a`,
                        }}
                      >
                        {risk.label}
                      </Chip>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
