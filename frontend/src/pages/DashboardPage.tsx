import { useStore } from '@/lib/store'
import { cn, formatRelativeDate, priorityColor, getInitials } from '@/lib/utils'
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, Sparkles, Users, Zap } from 'lucide-react'

export function DashboardPage() {
  const tasks = useStore((s) => s.tasks)
  const projects = useStore((s) => s.projects)
  const risks = useStore((s) => s.risks)
  const insights = useStore((s) => s.insights)
  const members = useStore((s) => s.members)

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const criticalRisks = risks.filter((r) => r.level === 'critical' || r.level === 'high').length

  const stats = [
    { label: 'Active Tasks', value: inProgressTasks, icon: Clock, color: 'text-accent-primary' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-success' },
    { label: 'Risk Alerts', value: criticalRisks, icon: AlertTriangle, color: 'text-warning' },
    { label: 'AI Insights', value: insights.length, icon: Sparkles, color: 'text-accent-ai' },
  ]

  return (
    <div className="mx-auto max-w-[1400px] p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
        <p className="text-[12px] text-text-muted">Project overview and AI-powered insights</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border-subtle bg-bg-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-text-muted">{s.label}</span>
              <s.icon size={14} className={s.color} />
            </div>
            <div className={cn('text-2xl font-semibold font-mono', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Section title="Active Projects" icon={TrendingUp}>
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-3 hover:border-border-default transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-text-primary">{p.name}</span>
                      <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-muted font-mono">{p.code}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-text-muted truncate">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[13px] font-mono font-medium text-text-primary">{p.progress}%</div>
                      <div className="text-[10px] text-text-muted">progress</div>
                    </div>
                    <div className="flex -space-x-1.5">
                      {p.memberIds.slice(0, 3).map((mid) => {
                        const m = members.find((mem) => mem.id === mid)
                        return m ? (
                          <div key={mid} className="flex h-6 w-6 items-center justify-center rounded-full border border-bg-surface bg-bg-elevated text-[10px] text-text-secondary">
                            {getInitials(m.name)}
                          </div>
                        ) : null
                      })}
                      {p.memberIds.length > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-bg-surface bg-bg-elevated text-[10px] text-text-muted">
                          +{p.memberIds.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Recent Tasks" icon={Clock}>
            <div className="space-y-1">
              {tasks.filter((t) => t.status === 'in_progress' || t.status === 'review').slice(0, 5).map((t) => {
                const assignee = members.find((m) => m.id === t.assigneeId)
                return (
                  <div key={t.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-bg-elevated/50 transition-colors">
                    <div className={cn('h-2 w-2 rounded-full', t.status === 'in_progress' ? 'bg-accent-primary' : 'bg-warning')} />
                    <span className="flex-1 text-[13px] text-text-primary truncate">{t.title}</span>
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px]', priorityColor(t.priority))}>{t.priority}</span>
                    <span className="text-[11px] text-text-muted w-16 text-right">{formatRelativeDate(t.dueDate)}</span>
                    {assignee && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[9px] text-text-muted">
                        {getInitials(assignee.name)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Risk Alerts" icon={AlertTriangle} accent="text-warning">
            <div className="space-y-2">
              {risks.slice(0, 3).map((r) => (
                <div key={r.id} className={cn(
                  'rounded-md border p-3',
                  r.level === 'critical' ? 'border-error/20 bg-error-dim' : 'border-warning/20 bg-warning-dim'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-[10px] font-medium uppercase',
                      r.level === 'critical' ? 'text-error' : 'text-warning'
                    )}>{r.level}</span>
                  </div>
                  <p className="text-[12px] text-text-primary font-medium leading-snug">{r.taskTitle}</p>
                  <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{r.assigneeName}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="AI Suggestions" icon={Sparkles} accent="text-accent-ai">
            <div className="space-y-2">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.id} className="rounded-md border border-accent-ai/10 bg-accent-ai-dim/50 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={10} className="text-accent-ai animate-pulse-ai" />
                    <span className="text-[10px] font-medium text-accent-ai uppercase">{ins.type}</span>
                    <span className="ml-auto text-[10px] text-text-muted font-mono">{Math.round(ins.confidence * 100)}%</span>
                  </div>
                  <p className="text-[12px] text-text-primary font-medium leading-snug">{ins.title}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Team Workload" icon={Users}>
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <span className="w-20 truncate text-[12px] text-text-secondary">{m.name.split(' ')[0]}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        m.workload > 85 ? 'bg-error' : m.workload > 65 ? 'bg-warning' : 'bg-success'
                      )}
                      style={{ width: `${m.workload}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-mono text-text-muted">{m.workload}%</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, children, accent }: { title: string; icon: React.ElementType; children: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-2.5">
        <Icon size={13} className={accent ?? 'text-text-muted'} />
        <span className="text-[12px] font-medium text-text-secondary">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
