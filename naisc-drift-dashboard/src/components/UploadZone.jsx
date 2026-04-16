import { cn } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'

export function UploadZone({
  drag,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  inputRef,
  onInputChange,
  title = 'Upload predictions.csv',
  subtitle = 'Drag & drop or click — output from the pipeline',
  accept = '.csv',
  error,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-16 text-center transition-all animate-fade-up',
        'border-border-strong bg-surface-1/50 hover:border-brand-accent hover:bg-brand-accent/5',
        drag && 'border-brand-accent bg-brand-accent/10'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
      />
      <div className="relative">
        <UploadCloud
          className={cn(
            'h-12 w-12 transition-colors',
            drag ? 'text-brand-accent2' : 'text-ink-faint group-hover:text-brand-accent'
          )}
        />
      </div>
      <div className="font-display text-xl font-bold uppercase tracking-widest2 text-ink">
        {title}
      </div>
      <div className="font-mono text-2xs uppercase tracking-widest2 text-ink-faint">
        {subtitle}
      </div>
      {error && (
        <div className="mt-2 rounded-sm border border-brand-accent/40 bg-brand-accent/10 px-3 py-1.5 font-mono text-2xs uppercase tracking-widest2 text-brand-accent2">
          {error}
        </div>
      )}
    </div>
  )
}
