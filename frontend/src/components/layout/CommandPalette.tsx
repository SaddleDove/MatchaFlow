import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Sparkles, FileText, ArrowRight, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const staticCommands = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'nav-projects', label: 'Go to Projects', icon: FolderKanban, path: '/projects' },
  { id: 'nav-insights', label: 'Go to AI Insights', icon: Sparkles, path: '/insights' },
  { id: 'nav-reports', label: 'Go to Reports', icon: FileText, path: '/reports' },
]

export function CommandPalette() {
  const open = useStore((s) => s.commandPaletteOpen)
  const setOpen = useStore((s) => s.setCommandPaletteOpen)
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, setOpen])

  if (!open) return null

  const projectCommands = projects.map((p) => ({
    id: `project-${p.id}`,
    label: `Open ${p.name}`,
    icon: FolderKanban,
    path: `/projects/${p.id}`,
  }))

  const taskCommands = tasks.slice(0, 5).map((t) => ({
    id: `task-${t.id}`,
    label: t.title,
    icon: ArrowRight,
    path: `/projects/${t.projectId}`,
  }))

  const allCommands = [...staticCommands, ...projectCommands, ...taskCommands]
  const filtered = query
    ? allCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : allCommands

  const execute = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-lg border border-border-default bg-bg-surface shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border-subtle px-3">
          <span className="text-text-muted"><Search size={15} /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent px-2.5 py-3 text-[13px] text-text-primary outline-none placeholder:text-text-muted"
          />
          <kbd className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-muted">ESC</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-[12px] text-text-muted">No results found</div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => execute(cmd.path)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-text-secondary',
                    'hover:bg-bg-elevated hover:text-text-primary transition-colors'
                  )}
                >
                  <cmd.icon size={15} className="text-text-muted" />
                  <span className="truncate">{cmd.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
