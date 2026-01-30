# Copilot Instructions for NesPak Check Request Portal Frontend

## Project Overview
- **Framework:** React (with JSX), built using Vite for fast development and HMR.
- **Structure:**
  - `src/components/`: Reusable UI components (e.g., `ContractorForm.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `Table.jsx`).
  - `src/pages/`: Route-level pages (e.g., `Dashboard.jsx`, `Login.jsx`, `CrudPage.jsx`).
  - `src/layouts/`: Layout wrappers for pages (e.g., `DashboardLayout.jsx`).
  - `src/utilities/`: Auth, route protection, and utility logic.
  - `public/`: Static assets.
- **Entry Point:** `src/main.jsx` (mounts `App.jsx`).

## Key Patterns & Conventions
- **Component Organization:**
  - Pages import and compose components from `components/` and wrap with layouts from `layouts/`.
  - Use functional components and React hooks (no class components).
- **Routing:**
  - Likely handled in `App.jsx` or a dedicated router file (not shown in this summary).
- **Auth & Protected Routes:**
  - `src/utilities/auth.js`, `AdminRoute.jsx`, and `ProtectedRoute.jsx` handle authentication and route protection.
- **Styling:**
  - CSS files (`App.css`, `index.css`) and possible use of CSS modules or global styles.
- **State Management:**
  - No Redux/MobX detected; likely uses React's built-in state/hooks.

## Developer Workflows
- **Start Dev Server:**
  - `npm run dev` (Vite default)
- **Build for Production:**
  - `npm run build`
- **Preview Production Build:**
  - `npm run preview`
- **Linting:**
  - `npm run lint` (uses ESLint, config in `eslint.config.js`)

## Integration & Data Flow
- **API/Backend:**
  - No direct API integration code shown, but forms and pages likely interact with backend via fetch/axios (check inside form/page components).
- **Cross-Component Communication:**
  - Props drilling and hooks; no context or external state manager detected.

## Project-Specific Notes
- **File Naming:**
  - Use PascalCase for components and pages.
- **Component Placement:**
  - Place shared UI in `components/`, page-specific logic in `pages/`.
- **Auth Logic:**
  - Use provided utilities for route protection; do not reimplement auth checks.

## References
- See `src/components/ContractorForm.jsx` for form patterns.
- See `src/utilities/ProtectedRoute.jsx` for route protection logic.
- See `vite.config.js` and `eslint.config.js` for build and lint config.

---
_Keep instructions concise and up-to-date. Update this file if project structure or conventions change._
