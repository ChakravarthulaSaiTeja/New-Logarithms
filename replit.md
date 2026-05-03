# Logarithms — Interactive Classroom

## Project Overview
A static HTML/JavaScript interactive web app for learning logarithms. Single-page, fully modular ES-module architecture with persistent localStorage state, Teacher Mode, Projector Mode, timed quiz, mastery dashboard, and graph overlays.

## Architecture
The inline script previously in `index.html` has been fully migrated to the ES-module system. `index.html` loads `js/app.js` via `<script type="module">`. There is no build step.

## Project Structure

### Entry Points
- `index.html` — Full single-page app (HTML + CSS only, no inline JS)
- `server.js` — Static Node.js file server (port 5000)
- `js/app.js` — Main ES-module entry point, wires all features together

### State
- `js/state.js` — Centralized localStorage state (mastery, quiz history, teacher mode, section index, streak)

### Utilities
- `js/utils.js` — `sup()`, `sub()`, `big()`, `fmt()`, `esc()`, `normalizeAnswer()`, `checkAnswer()`

### Data Modules (`js/data/`)
- `laws.js` — All 7 logarithm laws with full step-by-step proofs and examples
- `problems.js` — 12 rich problems (Easy/Medium/Hard/JEE) with steps `{eq, why}`, hints, altAnswers
- `quiz.js` — 8 quiz questions with explanations

### Feature Modules (`js/features/`)
- `nav.js` — Scroll-spy nav, IntersectionObserver reveal, `goTo()`, `observeRevealNodes()`
- `charts.js` — Exp/Log chart rendering with graph presets, asymptote overlays, key-point markers, fullscreen
- `laws.js` — Laws accordion builder + live 6-check verifier
- `problems.js` — Problem renderer with mastery badges, hint/step reveal, answer normalization, practice mode, solution toggle
- `quiz.js` — 8-question quiz with timed mode (30s countdown), per-question analytics, end-screen results
- `teacher.js` — Teacher Mode (section lock/highlight, keyboard navigation), Projector Mode (body class), reveal queue
- `mastery.js` — SVG ring progress charts per difficulty level, streak tracking, reset

## Key Features

### Teacher Mode (Shift+T or 🎓 Teach button)
- Fixed bottom control bar: ← Prev | Section Name | Next → | Reveal | ⬛ Projector | ✕ Exit
- Keyboard shortcuts: ArrowLeft/Right = navigate sections, R = reveal next element, P = projector, Esc = exit
- Active section highlighted, others dimmed (`.tm-active` / `.tm-inactive` CSS)
- Reveal queue: progressively shows `.rv`, `.card`, `.prob`, `.lawcard` etc. within current section

### Projector Mode (P key when in Teacher Mode)
- `body.projector-mode` class: larger fonts, hidden nav steps, clean layout

### Graph Features
- Preset buttons: Base 2 / Base e / Base 10 / Decay for exp graph; log₂ / log₁₀ / ln / Decreasing for log graph
- Asymptote overlay toggle (y=0 for exp, x=0 for log) — on by default
- Key points toggle (marks (0,1) for exp, (1,0) and (a,1) for log)
- Fullscreen support

### Practice Problems
- 12 problems across 4 difficulty levels
- Per-step reveal (Hint / Next Step buttons)
- Full solution toggle with step-by-step proof
- Answer normalization handles: whitespace, Unicode math chars, "x=3" vs "3", alt answer forms
- Mastery badges on each problem (✓ Solved / N attempts)
- Practice Mode: shuffles problem order randomly
- Random problem jump button

### Mastery Dashboard (`#mastery` section)
- SVG ring charts for Easy / Medium / Hard / JEE completion percentage
- Overall progress bar with total solved count
- Streak counter
- Reset progress button (with confirm dialog)
- Persisted to localStorage across sessions

### Timed Quiz
- Toggle "Timed mode" checkbox before starting
- 30-second countdown timer per question (progress bar + number)
- Timer bar turns red at ≤8 seconds remaining
- Auto-advances on timeout (marks incorrect)
- End screen: score %, correct/missed count, avg time, per-question breakdown
- Quiz history saved to localStorage

### Accessibility
- Skip-to-content link
- `aria-label` on all sections, interactive elements, graphs
- `aria-live` on dynamic content (timer, nav label, quiz feedback)
- `aria-pressed` on toggle buttons
- `aria-expanded` on accordion (laws, solution toggle)
- `:focus-visible` outline

## Tech Stack
- Pure HTML/CSS/JavaScript (ES modules, no build step)
- Chart.js 4.4.1 (CDN)
- Google Fonts: DM Serif Display, DM Mono, Plus Jakarta Sans
- Node.js static file server (port 5000, host 0.0.0.0)

## Running
```
node server.js
```
Port: 5000
