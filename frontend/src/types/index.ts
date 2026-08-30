export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'
export type ProjectPhase = 'pre_initiation' | 'initiation' | 'planning' | 'execution' | 'control' | 'closure'
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type ViewMode = 'kanban' | 'list' | 'gantt'

export interface Member {
  id: string
  name: string
  role: 'sponsor' | 'manager' | 'team_member'
  avatar?: string
  workload: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  projectId: string
  dependencies: string[]
  estimatedHours: number
  actualHours: number
  dueDate: string
  createdAt: string
  tags: string[]
  isAiSuggested?: boolean
}

export interface Project {
  id: string
  name: string
  code: string
  phase: ProjectPhase
  description: string
  progress: number
  memberIds: string[]
  taskIds: string[]
  startDate: string
  endDate: string
  createdAt: string
}

export interface RiskAlert {
  id: string
  taskId: string
  taskTitle: string
  assigneeName: string
  level: RiskLevel
  reason: string
  suggestedAction: string
  dueDate: string
}

export interface AIInsight {
  id: string
  type: 'risk' | 'resource' | 'schedule' | 'scope'
  title: string
  description: string
  confidence: number
  affectedTaskIds: string[]
  createdAt: string
}

export interface WeeklyReport {
  id: string
  projectId: string
  weekStart: string
  weekEnd: string
  summary: string
  completedTasks: number
  totalTasks: number
  risks: string[]
  highlights: string[]
  nextWeekPlan: string[]
  generatedAt: string
}
