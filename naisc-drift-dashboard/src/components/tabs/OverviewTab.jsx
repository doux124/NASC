import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardTitle } from '@/components/ui/Card'
import { PipelineFlow } from '@/components/PipelineFlow'
import { AUPRCChart } from '@/components/charts/AUPRCChart'
import { COLORS } from '@/lib/tokens'

export function OverviewTab({ driftData, metrics, setMetrics }) {
  const driftedCount = driftData.length
  const harmfulCount = driftData.filter((d) => d.is_important).length

  return (
    <div className="space-y-5">
      {/* Metric Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Drifted Features"
          value={driftedCount}
          color="accent"
          sub={`${harmfulCount} harmful`}
          delayClass="delay-1"
        />
        <MetricCard
          label="Test AU-PRC"
          value={metrics.testAUPRC.toFixed(3)}
          color="teal"
          sub="on public dataset"
          delayClass="delay-2"
        />
        <MetricCard
          label="Train AU-PRC"
          value={metrics.trainAUPRC.toFixed(3)}
          color="purple"
          sub="after mitigation"
          delayClass="delay-3"
        />
        <MetricCard
          label="Detection Time"
          value={metrics.timeTaken}
          unit="s"
          color="orange"
          sub="< 10 min limit"
          delayClass="delay-4"
        />
      </div>

      {/* Pipeline + AU-PRC */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="animate-fade-up delay-1">
          <CardTitle>Pipeline Steps</CardTitle>
          <PipelineFlow />
        </Card>
        <Card className="animate-fade-up delay-2">
          <CardTitle dotColor={COLORS.teal}>Model Performance</CardTitle>
          <AUPRCChart trainAUPRC={metrics.trainAUPRC} testAUPRC={metrics.testAUPRC} />
        </Card>
      </div>

      {/* Editable Metrics */}
      <Card className="animate-fade-up delay-3">
        <CardTitle dotColor={COLORS.orange}>Update Metrics</CardTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { key: 'trainAUPRC', label: 'Train AU-PRC' },
            { key: 'testAUPRC', label: 'Test AU-PRC' },
            { key: 'timeTaken', label: 'Time Taken (s)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="mb-1.5 font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
                {label}
              </div>
              <input
                type="number"
                step="0.001"
                className="input-field"
                value={metrics[key]}
                onChange={(e) =>
                  setMetrics((prev) => ({
                    ...prev,
                    [key]: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
