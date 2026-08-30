from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

router = APIRouter()


MEMBERS = [
    {"id": "m1", "name": "Alex Chen", "role": "manager", "workload": 78},
    {"id": "m2", "name": "Sarah Kim", "role": "team_member", "workload": 92},
    {"id": "m3", "name": "James Liu", "role": "team_member", "workload": 45},
    {"id": "m4", "name": "Dr. Wang", "role": "sponsor", "workload": 30},
    {"id": "m5", "name": "Maya Patel", "role": "team_member", "workload": 65},
]

PROJECTS = [
    {
        "id": "p1", "name": "E-Commerce Platform", "code": "PROJ_20250101",
        "phase": "execution", "description": "Full-stack e-commerce platform with AI-powered recommendations",
        "progress": 62, "memberIds": ["m1", "m2", "m3", "m4", "m5"],
        "taskIds": ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"],
        "startDate": "2025-01-15", "endDate": "2025-04-30", "createdAt": "2025-01-10",
    },
    {
        "id": "p2", "name": "Data Pipeline v2", "code": "PROJ_20250201",
        "phase": "planning", "description": "Redesign data pipeline for real-time analytics processing",
        "progress": 25, "memberIds": ["m1", "m3", "m5"],
        "taskIds": ["t9", "t10", "t11", "t12"],
        "startDate": "2025-02-15", "endDate": "2025-06-01", "createdAt": "2025-02-01",
    },
]

TASKS = [
    {"id": "t1", "title": "Implement user authentication flow", "description": "OAuth2 + JWT token management with refresh rotation", "status": "done", "priority": "critical", "assigneeId": "m2", "projectId": "p1", "dependencies": [], "estimatedHours": 16, "actualHours": 14, "dueDate": "2025-02-10", "createdAt": "2025-01-15", "tags": ["backend", "auth"]},
    {"id": "t2", "title": "Design product catalog schema", "description": "PostgreSQL schema with full-text search support", "status": "done", "priority": "high", "assigneeId": "m1", "projectId": "p1", "dependencies": [], "estimatedHours": 8, "actualHours": 10, "dueDate": "2025-02-05", "createdAt": "2025-01-15", "tags": ["database", "design"]},
    {"id": "t3", "title": "Build shopping cart API", "description": "RESTful API with Redis-backed session storage", "status": "in_progress", "priority": "high", "assigneeId": "m2", "projectId": "p1", "dependencies": ["t1"], "estimatedHours": 12, "actualHours": 8, "dueDate": "2025-03-15", "createdAt": "2025-01-20", "tags": ["backend", "api"]},
    {"id": "t4", "title": "Product listing page", "description": "Server-side rendered product grid with filters and search", "status": "in_progress", "priority": "medium", "assigneeId": "m3", "projectId": "p1", "dependencies": ["t2"], "estimatedHours": 20, "actualHours": 12, "dueDate": "2025-03-20", "createdAt": "2025-01-20", "tags": ["frontend", "ui"]},
    {"id": "t5", "title": "Payment integration", "description": "Stripe integration with webhook handling and retry logic", "status": "todo", "priority": "critical", "assigneeId": "m5", "projectId": "p1", "dependencies": ["t3"], "estimatedHours": 24, "actualHours": 0, "dueDate": "2025-04-01", "createdAt": "2025-02-01", "tags": ["backend", "payments"]},
    {"id": "t6", "title": "AI recommendation engine", "description": "Collaborative filtering with content-based fallback", "status": "todo", "priority": "medium", "assigneeId": "m3", "projectId": "p1", "dependencies": ["t2"], "estimatedHours": 32, "actualHours": 0, "dueDate": "2025-04-15", "createdAt": "2025-02-01", "tags": ["ml", "backend"], "isAiSuggested": True},
    {"id": "t7", "title": "Order management dashboard", "description": "Admin panel for order tracking and fulfillment", "status": "review", "priority": "high", "assigneeId": "m5", "projectId": "p1", "dependencies": ["t3"], "estimatedHours": 16, "actualHours": 18, "dueDate": "2025-03-25", "createdAt": "2025-02-10", "tags": ["frontend", "admin"]},
    {"id": "t8", "title": "Performance optimization", "description": "Lighthouse score > 90, lazy loading, image optimization", "status": "backlog", "priority": "low", "assigneeId": "m2", "projectId": "p1", "dependencies": ["t4"], "estimatedHours": 12, "actualHours": 0, "dueDate": "2025-04-20", "createdAt": "2025-02-15", "tags": ["frontend", "perf"], "isAiSuggested": True},
    {"id": "t9", "title": "Kafka cluster setup", "description": "3-node Kafka cluster with schema registry", "status": "in_progress", "priority": "high", "assigneeId": "m3", "projectId": "p2", "dependencies": [], "estimatedHours": 20, "actualHours": 15, "dueDate": "2025-03-10", "createdAt": "2025-02-15", "tags": ["infra", "streaming"]},
    {"id": "t10", "title": "ETL pipeline redesign", "description": "Migrate from batch to streaming ETL with exactly-once semantics", "status": "todo", "priority": "critical", "assigneeId": "m5", "projectId": "p2", "dependencies": ["t9"], "estimatedHours": 40, "actualHours": 0, "dueDate": "2025-04-30", "createdAt": "2025-02-20", "tags": ["data", "backend"]},
    {"id": "t11", "title": "Real-time dashboard", "description": "WebSocket-powered analytics dashboard", "status": "backlog", "priority": "medium", "assigneeId": "m1", "projectId": "p2", "dependencies": ["t10"], "estimatedHours": 24, "actualHours": 0, "dueDate": "2025-05-15", "createdAt": "2025-03-01", "tags": ["frontend", "realtime"]},
    {"id": "t12", "title": "Data quality monitoring", "description": "Automated data quality checks with alerting", "status": "backlog", "priority": "low", "assigneeId": "m3", "projectId": "p2", "dependencies": ["t10"], "estimatedHours": 16, "actualHours": 0, "dueDate": "2025-05-30", "createdAt": "2025-03-01", "tags": ["data", "monitoring"], "isAiSuggested": True},
]

RISKS = [
    {"id": "r1", "taskId": "t7", "taskTitle": "Order management dashboard", "assigneeName": "Maya Patel", "level": "high", "reason": "Actual hours (18h) exceeded estimate (16h) by 12.5%. Task is in review but trending over budget.", "suggestedAction": "Reassign remaining review items to a team member with lower workload (James Liu at 45%).", "dueDate": "2025-03-25"},
    {"id": "r2", "taskId": "t5", "taskTitle": "Payment integration", "assigneeName": "Maya Patel", "level": "critical", "reason": "Critical-priority task assigned to a member already at 65% workload. Payment module has zero buffer.", "suggestedAction": "Consider splitting into sub-tasks and assigning the webhook handler to Sarah Kim after t3 completes.", "dueDate": "2025-04-01"},
    {"id": "r3", "taskId": "t10", "taskTitle": "ETL pipeline redesign", "assigneeName": "Maya Patel", "level": "medium", "reason": "40-hour estimate on an already loaded member. Dependency on t9 creates a serial bottleneck.", "suggestedAction": "Start design phase in parallel with t9 implementation to reduce critical path duration.", "dueDate": "2025-04-30"},
]

INSIGHTS = [
    {"id": "ai1", "type": "risk", "title": "Resource Bottleneck Detected", "description": "Maya Patel is assigned to 3 critical/high tasks across both projects. Her effective utilization is projected at 115% by Week 8. Redistribute or deschedule to prevent burnout and delays.", "confidence": 0.89, "affectedTaskIds": ["t5", "t7", "t10"], "createdAt": "2025-03-10"},
    {"id": "ai2", "type": "schedule", "title": "Critical Path Compression Opportunity", "description": "Starting t6 (AI recommendation engine) design work 2 weeks earlier — while t2 is wrapping up — could save 10 days on the critical path. The dependency allows partial overlap.", "confidence": 0.76, "affectedTaskIds": ["t6", "t2"], "createdAt": "2025-03-10"},
    {"id": "ai3", "type": "resource", "title": "Skill-Task Mismatch", "description": "t9 (Kafka cluster setup) requires distributed systems expertise. James Liu has 70% of the estimated time logged but only 2 prior Kafka projects. Consider pairing with an external consultant for the schema registry configuration.", "confidence": 0.71, "affectedTaskIds": ["t9"], "createdAt": "2025-03-09"},
    {"id": "ai4", "type": "scope", "title": "Scope Creep Risk", "description": "3 AI-suggested tasks have been added to the backlog in the last 2 weeks. While valuable, they increase total estimated hours by 18%. Recommend a formal scope review before accepting more.", "confidence": 0.82, "affectedTaskIds": ["t6", "t8", "t12"], "createdAt": "2025-03-08"},
]

REPORTS = [
    {
        "id": "wr1", "projectId": "p1", "weekStart": "2025-03-03", "weekEnd": "2025-03-09",
        "summary": "Solid progress on core commerce features. Authentication is complete, catalog schema finalized. Cart API and product listing are on track. Payment integration blocked by cart API completion. Two AI-suggested tasks added to backlog after scope review.",
        "completedTasks": 2, "totalTasks": 8,
        "risks": ["Maya Patel approaching overload with 3 upcoming critical tasks", "Payment integration has zero schedule buffer"],
        "highlights": ["User auth flow completed 2 days ahead of schedule", "Order management dashboard entered review phase", "AI recommendation engine design approved"],
        "nextWeekPlan": ["Complete shopping cart API (Sarah)", "Finish product listing page (James)", "Begin payment integration design (Maya)", "Start AI recommendation engine prototype (James)"],
        "generatedAt": "2025-03-09T18:00:00",
    }
]


@router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@router.get("/projects")
async def get_projects():
    return {"data": PROJECTS}


@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    for p in PROJECTS:
        if p["id"] == project_id:
            return {"data": p}
    return {"error": "Not found"}


@router.get("/tasks")
async def get_tasks(project_id: Optional[str] = None):
    if project_id:
        return {"data": [t for t in TASKS if t["projectId"] == project_id]}
    return {"data": TASKS}


@router.get("/tasks/{task_id}")
async def get_task(task_id: str):
    for t in TASKS:
        if t["id"] == task_id:
            return {"data": t}
    return {"error": "Not found"}


@router.get("/members")
async def get_members():
    return {"data": MEMBERS}


@router.get("/risks")
async def get_risks():
    return {"data": RISKS}


@router.get("/insights")
async def get_insights():
    return {"data": INSIGHTS}


@router.get("/reports")
async def get_reports():
    return {"data": REPORTS}
