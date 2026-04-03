# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Architecture

**TMC Employee Self-Service Portal** — a client-only React SPA with no backend. All state is persisted to localStorage (no API calls).

### State Management

All global state lives in `src/context/AppContext.jsx` using `useReducer` + Context API. State slices: auth, profile, tasks, attendance, documents, family, posts, requests, timesheet, compensations. Each slice is persisted to localStorage under `ess_*` keys. Components access state via the `useApp()` hook.

### Routing

`src/App.jsx` defines all routes. `/login` is public; all other routes are protected by `ProtectedRoute`. Layout wraps all protected pages via React Router's `<Outlet>`.

### Data

`src/data/mockData.js` seeds the initial state. There is no real backend — all CRUD operations modify context state (and therefore localStorage) only.

### Styling

Tailwind CSS with custom component classes defined in `src/index.css`: `.glass-card` (glassmorphism panels), `.btn-primary/secondary/danger/success`, `.input-field`, `.badge-*` status indicators. Custom theme (blue primary, Inter font) is in `tailwind.config.js`.
