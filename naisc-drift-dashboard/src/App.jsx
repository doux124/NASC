import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { TabNav } from '@/components/layout/TabNav'
import { OverviewTab } from '@/components/tabs/OverviewTab'
import { DriftTab } from '@/components/tabs/DriftTab'
import { PredictionsTab } from '@/components/tabs/PredictionsTab'
import { DEFAULT_DRIFT, DEFAULT_METRICS } from '@/data/defaults'

export default function App() {
  const [tab, setTab] = useState('overview')
  const [driftData, setDriftData] = useState(DEFAULT_DRIFT)
  const [metrics, setMetrics] = useState(DEFAULT_METRICS)

  return (
    <div className="min-h-screen">
      <Header />
      <TabNav active={tab} onChange={setTab} />
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === 'overview' && (
          <OverviewTab driftData={driftData} metrics={metrics} setMetrics={setMetrics} />
        )}
        {tab === 'drift' && (
          <DriftTab driftData={driftData} setDriftData={setDriftData} />
        )}
        {tab === 'predictions' && <PredictionsTab />}
      </main>

      <footer className="border-t border-border-subtle py-6">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
          <span>NAISC 2026 · Adaptive Drift Intelligence</span>
          <span>Built for Singtel × AI Singapore</span>
        </div>
      </footer>
    </div>
  )
}
