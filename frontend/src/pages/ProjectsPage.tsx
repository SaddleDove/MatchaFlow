import { useParams } from 'react-router-dom'
import { useStore } from '@/lib/store'
import { cn, priorityColor, statusColor, getInitials, formatRelativeDate, phaseLabel } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { LayoutGrid, List, GanttChart, Filter, Plus, Sparkles, GitBranch, X, Check } from 'lucide-react'
import type { ViewMode, TaskStatus, Task, Member, TaskPriority } from '@/types'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

const PRIORITY_FILTERS: { id: 'all' | TaskPriority; label: string }[] = [
  { id: 'all', label: 'All priorities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export function ProjectsPage() {
  const { projectId } = useParams()
  const selectedProjectId = useStore((s) => s.selectedProjectId)
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)
  const members = useStore((s) => s.members)
  const viewMode = useStore((s) => s.viewMode)
  const setViewMode = useStore((s) => s.setViewMode)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  const activeProjectId = projectId ?? selectedProjectId ?? projects[0]?.id
  const project = projects.find((p) => p.id === activeProjectId)
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId)
  const visibleTasks =
    priorityFilter === 'all' ? projectTasks : projectTasks.filter((t) => t.priority === priorityFilter)

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-[13px]">
        No project selected
      </div>
    )
  }

  const viewModes: { mode: ViewMode; icon: React.ElementType }[] = [
    { mode: 'kanban', icon: LayoutGrid },
    { mode: 'list', icon: List },
    { mode: 'gantt', icon: GanttChart },
  ]

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-medium text-text-primary">{project.name}</h2>
          <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-muted font-mono">{project.code}</span>
          <span className="rounded bg-accent-ai-dim px-1.5 py-0.5 text-[10px] text-accent-ai">{phaseLabel(project.phase)}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border-subtle bg-bg-surface">
            {viewModes.map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center transition-colors',
                  viewMode === mode ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <div className="relative ml-2" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={cn(
                'flex h-7 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-surface px-2.5 text-[12px] transition-colors',
                priorityFilter !== 'all'
                  ? 'border-accent-primary/40 text-accent-primary'
                  : 'text-text-muted hover:border-border-default hover:text-text-secondary'
              )}
            >
              <Filter size={12} />
              Filter
              {priorityFilter !== 'all' && (
                <span className="rounded bg-accent-primary/15 px-1 text-[10px] font-mono text-accent-primary">{priorityFilter}</span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-8 z-40 w-44 rounded-md border border-border-default bg-bg-surface p-1 shadow-xl animate-fade-in">
                {PRIORITY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setPriorityFilter(f.id)
                      setFilterOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-[12px] transition-colors',
                      priorityFilter === f.id
                        ? 'bg-bg-elevated text-text-primary'
                        : 'text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary'
                    )}
                  >
                    <span className="capitalize">{f.label}</span>
                    {priorityFilter === f.id && <Check size={12} className="text-accent-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="ml-1 flex h-7 items-center gap-1.5 rounded-md bg-accent-primary/10 px-2.5 text-[12px] text-accent-primary hover:bg-accent-primary/20 transition-colors"
          >
            <Plus size={12} />
            Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'kanban' && <KanbanView tasks={visibleTasks} members={members} />}
        {viewMode === 'list' && <ListView tasks={visibleTasks} members={members} />}
        {viewMode === 'gantt' && <GanttView tasks={visibleTasks} />}
      </div>

      {taskModalOpen && (
        <NewTaskModal
          projectId={project.id}
          members={members}
          onClose={() => setTaskModalOpen(false)}
        />
      )}
    </div>
  )
}

function NewTaskModal({
  projectId,
  members,
  onClose,
}: {
  projectId: string
  members: Member[]
  onClose: () => void
}) {
  const addTask = useStore((s) => s.addTask)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [assigneeId, setAssigneeId] = useState(members[0]?.id ?? 'm1')
  const [estimatedHours, setEstimatedHours] = useState(8)
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10))
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      projectId,
      estimatedHours: Math.max(0, Number(estimatedHours) || 0),
      dueDate,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
    onClose()
  }

  const inputCls =
    'w-full rounded-md border border-border-subtle bg-bg-elevated px-2.5 py-1.5 text-[12px] text-text-primary outline-none placeholder:text-text-muted focus:border-accent-primary/50 transition-colors'
  const labelCls = 'mb-1 block text-[11px] font-medium text-text-secondary'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-lg border border-border-default bg-bg-surface p-5 shadow-2xl animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-text-primary">New Task</h3>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="e.g. Build checkout page"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?"
              rows={2}
              className={cn(inputCls, 'resize-none')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={inputCls}>
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-bg-surface">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={inputCls}>
                {PRIORITY_FILTERS.slice(1).map((p) => (
                  <option key={p.id} value={p.id} className="bg-bg-surface">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Assignee</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={inputCls}>
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-bg-surface">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Est. hours</label>
              <input
                type="number"
                min={0}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={cn(inputCls, '[color-scheme:dark]')}
              />
            </div>
            <div>
              <label className={labelCls}>Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="backend, api (comma)"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-[11px] text-error">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-border-subtle px-3 py-1.5 text-[12px] text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-accent-primary/15 px-3 py-1.5 text-[12px] font-medium text-accent-primary hover:bg-accent-primary/25 transition-colors"
          >
            Create task
          </button>
        </div>
      </div>
    </div>
  )
}

function KanbanView({ tasks, members }: { tasks: Task[]; members: Member[] }) {
  return (
    <div className="flex gap-3 h-full">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id)
        return (
          <div key={col.id} className="flex w-64 flex-col rounded-lg bg-bg-surface/50">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className={cn('h-2 w-2 rounded-full', statusColor(col.id))} />
              <span className="text-[12px] font-medium text-text-secondary">{col.label}</span>
              <span className="ml-auto text-[11px] font-mono text-text-muted">{colTasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5">
              {colTasks.map((task) => {
                const assignee = members.find((m) => m.id === task.assigneeId)
                return <TaskCard key={task.id} task={task} assignee={assignee} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TaskCard({ task, assignee }: { task: Task; assignee?: Member }) {
  return (
    <div className="group rounded-md border border-border-subtle bg-bg-surface p-3 hover:border-border-default transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[12px] font-medium text-text-primary leading-snug">{task.title}</span>
        {task.isAiSuggested && (
          <Sparkles size={11} className="text-accent-ai shrink-0 mt-0.5 animate-pulse-ai" />
        )}
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed mb-2 line-clamp-2">{task.description}</p>
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        {task.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-muted">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('rounded px-1.5 py-0.5 text-[10px]', priorityColor(task.priority))}>{task.priority}</span>
          {task.dependencies.length > 0 && (
            <GitBranch size={10} className="text-text-muted" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted font-mono">{formatRelativeDate(task.dueDate)}</span>
          {assignee && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[9px] text-text-muted">
              {getInitials(assignee.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListView({ tasks, members }: { tasks: Task[]; members: Member[] }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Task</th>
            <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Status</th>
            <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Priority</th>
            <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Assignee</th>
            <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Due</th>
            <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-muted">Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignee = members.find((m) => m.id === task.assigneeId)
            const progress = task.estimatedHours > 0 ? Math.min(100, Math.round((task.actualHours / task.estimatedHours) * 100)) : 0
            return (
              <tr key={task.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated/30 transition-colors cursor-pointer">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {task.isAiSuggested && <Sparkles size={11} className="text-accent-ai" />}
                    <span className="text-[13px] text-text-primary">{task.title}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className={cn('h-1.5 w-1.5 rounded-full', statusColor(task.status))} />
                    <span className="text-[12px] text-text-secondary capitalize">{task.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px]', priorityColor(task.priority))}>{task.priority}</span>
                </td>
                <td className="px-3 py-2.5">
                  {assignee && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated text-[9px] text-text-muted">
                        {getInitials(assignee.name)}
                      </div>
                      <span className="text-[12px] text-text-secondary">{assignee.name.split(' ')[0]}</span>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-[12px] text-text-muted font-mono">{formatRelativeDate(task.dueDate)}</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-bg-elevated overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', progress >= 100 ? 'bg-warning' : 'bg-accent-primary')}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">{progress}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function GanttView({ tasks }: { tasks: Task[] }) {
  const allDates = tasks.flatMap((t) => [t.createdAt, t.dueDate]).sort()
  const minDate = new Date(allDates[0] ?? '')
  const maxDate = new Date(allDates[allDates.length - 1] ?? '')
  const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="border-b border-border-subtle px-4 py-2">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <GanttChart size={12} />
            <span>Timeline — {totalDays} days</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {tasks.map((task) => {
            const start = Math.ceil((new Date(task.createdAt).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
            const duration = Math.max(1, Math.ceil((new Date(task.dueDate).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
            const leftPct = (start / totalDays) * 100
            const widthPct = (duration / totalDays) * 100

            return (
              <div key={task.id} className="flex items-center gap-3">
                <span className="w-40 truncate text-[12px] text-text-secondary shrink-0">{task.title}</span>
                <div className="flex-1 relative h-6">
                  <div className="absolute inset-0 bg-bg-elevated/30 rounded" />
                  <div
                    className={cn(
                      'absolute top-1 h-4 rounded flex items-center px-2 text-[10px] text-text-primary font-medium',
                      task.status === 'done' ? 'bg-success/20 border border-success/30' :
                      task.status === 'in_progress' ? 'bg-accent-primary/20 border border-accent-primary/30' :
                      'bg-bg-overlay border border-border-default'
                    )}
                    style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 3)}%` }}
                  >
                    {task.status === 'done' ? '✓' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
