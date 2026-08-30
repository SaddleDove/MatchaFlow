import { Command, Bell, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { phaseLabel } from '@/lib/utils'

export function Header() {
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen)
  const selectedProjectId = useStore((s) => s.selectedProjectId)
  const projects = useStore((s) => s.projects)
  const project = projects.find((p) => p.id === selectedProjectId)

  return (
    <header className="flex h-11 items-center border-b border-border-subtle bg-bg-surface px-4">
      <div className="flex flex-1 items-center gap-3">
        {project && (
          <>
            <h1 className="text-sm font-medium text-text-primary">{project.name}</h1>
            <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[11px] text-text-muted">
              {phaseLabel(project.phase)}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border-default bg-bg-elevated px-2.5 py-1 text-[12px] text-text-muted hover:border-border-strong hover:text-text-secondary transition-colors"
        >
          <Search size={13} />
          <span>Search...</span>
          <kbd className="flex items-center gap-0.5 rounded bg-bg-base px-1 py-0.5 text-[10px]">
            <Command size={10} />K
          </kbd>
        </button>

        <button className="ml-2 flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors relative">
          <Bell size={15} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent-ai" />
        </button>
      </div>
    </header>
  )
}
