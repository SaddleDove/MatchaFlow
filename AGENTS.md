## Project Overview

Multi-Agent Project Management Simulation System with a web frontend. The backend uses LLM-based multi-agent simulation (Sponsor, Manager, Team Member) across six project phases. The frontend is a Linear-inspired dark-themed dashboard providing AI-powered project management: task decomposition, risk warnings, weekly reports, and resource allocation suggestions.

## Tech Stack

- **Backend**: Python 3.12, FastAPI, Uvicorn
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Zustand, React Router v7, Lucide Icons
- **Package Manager**: pnpm (frontend), pip/venv (backend)
- **LLM Interface**: OpenAI-compatible API (config.py)
- **Design**: Dark minimalist, Inter + JetBrains Mono fonts, AI accent color (violet)

## Directory Structure

```
├── frontend/            # Vite + React SPA
│   ├── src/
│   │   ├── components/  # UI components (layout, dashboard, kanban, ai)
│   │   ├── pages/       # DashboardPage, ProjectsPage, AIInsightsPage, WeeklyReportPage
│   │   ├── lib/         # store (Zustand), utils, mock-data, api client
│   │   └── types/       # TypeScript type definitions
│   └── dist/            # Built frontend (served by FastAPI)
├── api/                 # FastAPI backend
│   ├── main.py          # App entry, serves API + static frontend
│   └── routes.py        # REST endpoints (projects, tasks, members, risks, insights, reports)
├── agents/              # Agent modules (base_agent, sponsor, manager, team_member)
├── database/            # Shared database (shared_db.py)
├── workflow/            # Workflow engine (engine.py)
├── utils/               # Utilities (llm_client.py, document_generator.py)
├── scripts/             # Build & run scripts for preview/deploy
├── config.py            # LLM config & agent prompt templates
├── main.py              # CLI entry point
├── DESIGN.md            # Design system specification
└── .coze                # Project configuration
```

## Key Entry Points

- **Frontend**: `frontend/src/main.tsx` → React SPA with 4 pages
- **Backend API**: `api/main.py` → FastAPI on port 5000, serves API + built frontend
- **CLI**: `main.py --project-idea "..."` → Original CLI simulation tool
- **API Routes**: `/api/projects`, `/api/tasks`, `/api/members`, `/api/risks`, `/api/insights`, `/api/reports`

## Running & Preview

- **Preview**: `bash scripts/build.sh && bash scripts/run.sh` → starts FastAPI on port 5000
- **Frontend dev**: `cd frontend && pnpm dev` → Vite dev server with HMR (proxies /api to :8000)
- **CLI mode**: `python main.py --project-idea "description"` (requires LLM config in config.py)

## User Preferences & Constraints

- pnpm for Node.js, pip/venv for Python
- All UI text in English
- Dark theme only, no light mode
- AI features are advisory — suggestions, not automated actions

## Common Issues

- `config.py` LLM_CONFIG has placeholder values — replace before running CLI simulation
- Frontend uses mock data by default; API integration requires running FastAPI backend
- Port 5000 must be free before starting preview; run script auto-kills stale processes
