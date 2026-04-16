import { useState } from 'react'
import { Card, CardTitle, SectionHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DriftScoreChart } from '@/components/charts/DriftScoreChart'
import { MitigationSummary } from '@/components/MitigationSummary'
import { DriftTable } from '@/components/DriftTable'
import { COLORS } from '@/lib/tokens'
import { Plus } from 'lucide-react'

export function DriftTab({ driftData, setDriftData }) {
  const [selected, setSelected] = useState(null)

  const addRow = () =>
    setDriftData((prev) => [
      ...prev,
      {
        col: 'new_feature',
        col_type: 'Float',
        drift_description: 'Edit this description',
        drift_score: 0.1,
        is_important: false,
        mitigation: 'No Action',
      },
    ])

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card className="animate-fade-up delay-1">
          <SectionHeader title="Drift Scores by Feature">
            <span className="font-mono text-2xs uppercase tracking-widest2 text-ink-muted">
              {driftData.length} features
            </span>
          </SectionHeader>
          <DriftScoreChart data={driftData} selected={selected} onSelect={setSelected} />
        </Card>

        <Card className="animate-fade-up delay-2">
          <CardTitle dotColor={COLORS.purple}>Mitigation Summary</CardTitle>
          <MitigationSummary data={driftData} />
        </Card>
      </div>

      <Card className="animate-fade-up delay-3">
        <SectionHeader title="Drift Report">
          <Button variant="accent" onClick={addRow}>
            <Plus className="h-3.5 w-3.5" />
            Add Row
          </Button>
        </SectionHeader>
        <DriftTable data={driftData} selected={selected} onSelect={setSelected} />
      </Card>
    </div>
  )
}
