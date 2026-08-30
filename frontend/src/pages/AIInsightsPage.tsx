import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Sparkles, AlertTriangle, TrendingUp, Users, GitBranch, Zap, ArrowRight, Brain } from 'lucide-react'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  risk: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-dim' },
  schedule: { icon: TrendingUp, color: 'text-info', bg: 'bg-info-dim' },
  resource: { icon: Users, color: 'text-success', bg: 'bg-success-dim' },
  scope: { icon: GitBranch, color: 'text-accent-ai', bg: 'bg-accent-ai-dim' },
}

export function AIInsightsPage() {
  const insights = useStore((s) => s.insights)
  const risks = useStore((s) => s.risks)
  const tasks = useStore((s) => s.tasks)

  return (
    <div className="mx-auto max-w-[1400px] p-6 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-ai-dim">
          <Brain size={16} className="text-accent-ai" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">AI Insights</h1>
          <p className="text-[12px] text-text-muted">AI-powered analysis and recommendations — advisor, not executor</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <InsightStat label="Active Insights" value={insights.length} icon={Sparkles} color="text-accent-ai" />
        <InsightStat label="Risk Alerts" value={risks.length} icon={AlertTriangle} color="text-warning" />
        <InsightStat label="Avg Confidence" value={`${Math.round(insights.reduce((a, b) => a + b.confidence, 0) / insights.length * 100)}%`} icon={Zap} color="text-info" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <SectionHeader title="Strategic Recommendations" icon={Brain} accent="text-accent-ai" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            {insights.map((ins) => {
              const config = typeConfig[ins.type] ?? { icon: Sparkles, color: 'text-text-muted', bg: 'bg-bg-elevated' }
              const Icon = config.icon
              const affectedTasks = tasks.filter((t) => ins.affectedTaskIds.includes(t.id))
              return (
                <div key={ins.id} className="rounded-lg border border-border-subtle bg-bg-surface p-4 hover:border-border-default transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('flex h-6 w-6 items-center justify-center rounded', config.bg)}>
                      <Icon size={12} className={config.color} />
                    </div>
                    <span className={cn('text-[10px] font-medium uppercase tracking-wider', config.color)}>{ins.type}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <Zap size={10} className="text-accent-ai animate-pulse-ai" />
                      <span className="text-[10px] font-mono text-text-muted">{Math.round(ins.confidence * 100)}%</span>
                    </div>
                  </div>
                  <h3 className="text-[13px] font-medium text-text-primary mb-2">{ins.title}</h3>
                  <p className="text-[12px] text-text-muted leading-relaxed mb-3">{ins.description}</p>
                  {affectedTasks.length > 0 && (
                    <div className="border-t border-border-subtle pt-2">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">Affected tasks</span>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {affectedTasks.map((t) => (
                          <span key={t.id} className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary">{t.title.slice(0, 30)}...</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-2">
          <SectionHeader title="Risk Analysis" icon={AlertTriangle} accent="text-warning" />
          <div className="mt-3 space-y-2">
            {risks.map((r) => (
              <div key={r.id} className="flex gap-4 rounded-lg border border-border-subtle bg-bg-surface p-4 hover:border-border-default transition-colors">
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  r.level === 'critical' ? 'bg-error-dim' : r.level === 'high' ? 'bg-warning-dim' : 'bg-info-dim'
                )}>
                  <AlertTriangle size={14} className={r.level === 'critical' ? 'text-error' : r.level === 'high' ? 'text-warning' : 'text-info'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-[10px] font-medium uppercase',
                      r.level === 'critical' ? 'text-error' : r.level === 'high' ? 'text-warning' : 'text-info'
                    )}>{r.level}</span>
                    <span className="text-[13px] font-medium text-text-primary">{r.taskTitle}</span>
                  </div>
                  <p className="text-[12px] text-text-muted leading-relaxed mb-2">{r.reason}</p>
                  <div className="flex items-start gap-1.5 rounded bg-accent-ai-dim/30 p-2">
                    <ArrowRight size={11} className="text-accent-ai mt-0.5 shrink-0" />
                    <p className="text-[11px] text-text-secondary leading-relaxed">{r.suggestedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InsightStat({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-text-muted">{label}</span>
        <Icon size={14} className={color} />
      </div>
      <div className={cn('text-2xl font-semibold font-mono', color)}>{value}</div>
    </div>
  )
}

function SectionHeader({ title, icon: Icon, accent }: { title: string; icon: React.ElementType; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className={accent} />
      <span className="text-[13px] font-medium text-text-secondary">{title}</span>
    </div>
  )
}
