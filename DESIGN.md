# Design Style: AI Project Management Console

## Product Identity

**Anchor imagery**: A spacecraft mission control room at 2am — dark, focused, every pixel of information placed with intent. The hum of systems running in the background. Not cold — warm enough to stay in for hours. Where human judgment meets machine intelligence.

**One-liner**: "Mission control for AI-augmented project management."

## Visual Strategy

- **Photography/Imagery**: No stock photos. Data IS the decoration. Subtle data visualizations, animated charts, and live metrics serve as visual interest.
- **Graphics**: Thin-line icons (1.5px stroke), geometric precision. AI-generated content marked by a subtle violet glow — the "machine whisper."
- **Density**: Information-dense but breathable. Generous whitespace between sections, tight spacing within data clusters. Think Bloomberg Terminal meets Linear.

## Color System

| Token | Hex | Usage | Imagery |
|-------|-----|-------|---------|
| `--bg-base` | `#09090b` | Page background | Void of space, absolute zero |
| `--bg-surface` | `#111113` | Cards, panels | Instrument panel under dim light |
| `--bg-elevated` | `#1a1a1f` | Hover, dropdowns | Lifted surface catching edge light |
| `--bg-overlay` | `#232329` | Modals, popovers | Closest surface to the viewer |
| `--border-subtle` | `#ffffff0a` | Default borders | Barely there — felt not seen |
| `--border-default` | `#ffffff12` | Active borders | Visible but quiet |
| `--text-primary` | `#ededef` | Headlines, values | Moonlight on concrete |
| `--text-secondary` | `#8b8b93` | Descriptions, labels | Distant city lights |
| `--text-muted` | `#56565e` | Timestamps, hints | Stars barely visible |
| `--accent-primary` | `#7c8aff` | Actions, links, focus | Soft periwinkle — calm authority |
| `--accent-ai` | `#a78bfa` | AI suggestions, insights | Machine intelligence signature |
| `--accent-ai-glow` | `#a78bfa20` | AI element backgrounds | Faint violet aura |
| `--success` | `#34d399` | Completed, on-track | Clear signal |
| `--warning` | `#fbbf24` | Risk, approaching deadline | Amber caution light |
| `--error` | `#f87171` | Overdue, critical | Alert without panic |
| `--info` | `#38bdf8` | Neutral information | Cool data stream |

## Typography

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Page title | Inter | 18px | 600 | -0.02em |
| Section header | Inter | 14px | 500 | -0.01em |
| Body | Inter | 13px | 400 | 0 |
| Small / Label | Inter | 12px | 400 | 0.02em |
| Caption / Timestamp | Inter | 11px | 400 | 0.04em |
| Metric / Number | JetBrains Mono | 13px | 500 | -0.02em |
| Code / ID | JetBrains Mono | 12px | 400 | 0 |

## Layout

- **Sidebar**: 240px, collapsible to 48px (icon-only). Project list + navigation.
- **Main content**: Flexible, max-width 1400px centered.
- **Detail panel**: 320px, slides in from right on item selection.
- **Spacing rhythm**: 4px base. Components: 8/12/16/24/32/48px.

## Motion & Interaction

- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for entrances; `ease-out` for hover.
- **Duration**: 150ms micro (hover, toggle), 250ms medium (panel slide), 400ms macro (page transition).
- **Command palette**: Cmd+K opens a centered overlay with blur backdrop. Fuzzy search, keyboard-navigable.
- **AI elements**: Subtle 2s pulse glow on AI suggestion badges. Not flashy — a gentle "I'm here" signal.
- **Kanban drag**: Card lifts 4px with soft shadow, 150ms transition.

## Design Don'ts

- ❌ Heavy drop shadows (use 1px borders + subtle bg shift)
- ❌ Gradients on interactive elements (flat only, gradients reserved for data viz)
- ❌ Rounded corners > 8px (default 6px, small elements 4px)
- ❌ Saturated/bright colors at large areas (accents only, < 5% of surface)
- ❌ Decorative illustrations or mascots
- ❌ Gamification (badges, streaks, confetti)
- ❌ Sans-serif fonts other than Inter for UI text
- ❌ Blue-purple gradient (the "AI cliché")
- ❌ Glass morphism / frosted glass effects
- ❌ Auto-playing animations or videos
