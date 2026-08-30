import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Sparkles, FileText, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import type { ProjectPhase } from '@/types'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/insights', icon: Sparkles, label: 'AI Insights' },
  { to: '/reports', icon: FileText, label: 'Reports' },
]

const PHASES: { id: ProjectPhase; label: string }[] = [
  { id: 'pre_initiation', label: 'Pre-Initiation' },
  { id: 'initiation', label: 'Initiation' },
  { id: 'planning', label: 'Planning' },
  { id: 'execution', label: 'Execution' },
  { id: 'control', label: 'Control' },
  { id: 'closure', label: 'Closure' },
]

export function Sidebar() {
  const collapsed = useStore((s) => s.sidebarCollapsed)
  const toggle = useStore((s) => s.toggleSidebar)
  const projects = useStore((s) => s.projects)
  const location = useLocation()
  const navigate = useNavigate()
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col border-r border-border-subtle bg-bg-surface transition-all duration-200',
      collapsed ? 'w-12' : 'w-60'
    )}>
      <div className="flex h-11 items-center gap-2 border-b border-border-subtle px-3">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Agent<span className="text-accent-ai">PM</span>
          </span>
        )}
        <button
          onClick={toggle}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors',
                isActive
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon size={16} className={cn(
                location.pathname.startsWith(item.to) && 'text-accent-primary'
              )} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {!collapsed && (
          <div className="mt-6">
            <div className="flex items-center px-2 pb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Projects
              </span>
              <button
                onClick={() => setProjectModalOpen(true)}
                title="New project"
                className="ml-auto flex h-5 w-5 items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-accent-primary transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.map((p) => (
                <NavLink
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className={({ isActive }) => cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors',
                    isActive
                      ? 'bg-bg-elevated text-text-primary'
                      : 'text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary'
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-primary/60" />
                  <span className="truncate">{p.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {projectModalOpen && (
        <NewProjectModal
          onClose={() => setProjectModalOpen(false)}
          onCreated={(id) => {
            setProjectModalOpen(false)
            navigate(`/projects/${id}`)
          }}
        />
      )}

      <div className="border-t border-border-subtle p-2">
        <div className={cn('flex items-center gap-2 rounded-md px-2 py-1.5', collapsed && 'justify-center')}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-ai-dim text-[11px] font-medium text-accent-ai">
            AC
          </div>
          {!collapsed && <span className="text-[12px] text-text-secondary">Alex Chen</span>}
        </div>
      </div>
    </aside>
  )
}

function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const addProject = useStore((s) => s.addProject)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<ProjectPhase>('planning')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')

  const submit = () => {
    if (!name.trim()) {
      setError('Project name is required')
      return
    }
    const id = addProject({
      name: name.trim(),
      code: code.trim() || undefined,
      description: description.trim(),
      phase,
      startDate,
    })
    onCreated(id)
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
          <h3 className="text-[14px] font-semibold text-text-primary">New Project</h3>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="e.g. Mobile App v2"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PROJ_YYYYMMDD"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phase</label>
              <select value={phase} onChange={(e) => setPhase(e.target.value as ProjectPhase)} className={inputCls}>
                {PHASES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-bg-surface">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={2}
              className={cn(inputCls, 'resize-none')}
            />
          </div>
          <div>
            <label className={labelCls}>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(inputCls, '[color-scheme:dark]')}
            />
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
            Create project
          </button>
        </div>
      </div>
    </div>
  )
}
