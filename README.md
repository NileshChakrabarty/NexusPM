# Nexus Project Management Platform

Nexus is an enterprise-grade, intelligent project management and engineering collaboration platform built with **React 19**, **Tailwind CSS v4**, **Redux Toolkit**, and **Recharts**.

Designed with a sleek, minimalist aesthetic inspired by modern SaaS interfaces, Nexus streamlines engineering roadmaps, sprint execution, deliverables tracking, and cross-functional team collaboration.

---

## ✨ Core Capabilities

- **Multi-Tenant Workspaces**: Switch between workspaces seamlessly or create new isolated environments with independent permissions and settings.
- **Project Portfolios**: High-level overview of active, planning, and completed initiatives with progress metrics, member capacity, and health indicators.
- **Dual-Mode Task Management**:
  - **Kanban Board**: Interactive lane view (To Do, In Progress, Completed) with quick status advancement.
  - **Data Table**: High-density table with batch operations, multi-select deletion, inline status changes, and faceted filtering.
- **Interactive Calendar & Deadlines**: Monthly calendar grid visualizing scheduled task due dates, with active date inspections and overdue risk highlights.
- **Deep Analytics & Visualizations**: Real-time charts powered by Recharts (Status distributions, Deliverables by Type donut chart, Priority spectrum).
- **Engineering Collaboration & Discussions**: Threaded task activity and notes with author avatars and instant timeline updates.
- **Access Control & Team Directory**: Manage workspace members, assign project roles (`Admin`, `Member`), and dispatch invitations.
- **Adaptive Dark / Light Mode**: Seamless dark and light themes with system preference detection and local storage persistence.
- **Local Persistence & Demo Reset**: Instant local persistence for workspaces, tasks, and comments, with a quick one-click demo reset trigger.

---

## 🏗️ Domain-Driven Modular Architecture

The codebase follows a **Feature-Driven Vertical Slice Architecture**. Instead of scattering related domain logic across generic `components/` and `pages/` folders, features are encapsulated as self-contained domain modules with clean `@/` path alias resolution.

```
src/
├── app/                              # Application bootstrap & routing
│   ├── App.jsx                       # Root routing wrapper
│   ├── routes.jsx                    # Declarative route configuration
│   ├── store.js                      # Redux store assembly
│   └── NotFoundView.jsx              # 404 handler
│
├── layout/                           # Application frame & persistent navigation
│   ├── AppLayout.jsx                 # Master application shell
│   ├── Header.jsx                    # Top navbar (search, theme, demo reset)
│   ├── NavigationSidebar.jsx         # Collapsible sidebar with task queues & projects tree
│   ├── WorkspacePicker.jsx           # Workspace switcher popover & creation modal
│   └── index.js                      # Barrel export
│
├── shared/                           # Reusable design system primitives & utilities
│   ├── ui/                           # UI kit primitives (Badge, Avatar, Modal)
│   │   ├── Badge.jsx                 # Status, Priority, Type, and Role badge pills
│   │   ├── Avatar.jsx                # User avatars with dynamic initials & color fallbacks
│   │   ├── Modal.jsx                 # Accessible backdrop-blur modal dialog
│   │   └── index.js                  # Barrel export
│   └── data/
│       └── mockData.js               # Rich seed data (workspaces, projects, users, tasks)
│
├── features/                         # Encapsulated domain feature modules
│   ├── theme/                        # Theme engine & local storage sync
│   │   └── themeSlice.js
│   ├── workspace/                    # Workspace state & multi-tenant CRUD
│   │   └── workspaceSlice.js
│   ├── dashboard/                    # Executive KPI dashboard & radar
│   │   ├── MetricGrid.jsx            # High-level metric cards
│   │   ├── ProjectProgressList.jsx   # Active projects overview list
│   │   ├── ActivityTimeline.jsx      # Workspace activity stream
│   │   ├── TaskRadar.jsx             # Personal task queue & urgency radar
│   │   ├── DashboardView.jsx         # Main dashboard view component
│   │   └── index.js
│   ├── projects/                     # Project portfolio & workspace settings
│   │   ├── ProjectCard.jsx           # Project summary card with progress bar
│   │   ├── CreateProjectModal.jsx    # Interactive project creation modal
│   │   ├── ProjectSettingsPanel.jsx  # Configuration editor & member management
│   │   ├── AddProjectMemberModal.jsx # Workspace-to-project member allocator
│   │   ├── ProjectsPortfolioView.jsx # Searchable & filterable projects portfolio
│   │   ├── ProjectWorkspaceView.jsx  # Multi-tab project workspace (Tasks, Calendar, Analytics, Settings)
│   │   └── index.js
│   ├── tasks/                        # Dual-mode task execution & collaboration
│   │   ├── TaskTableView.jsx         # High-density batch table
│   │   ├── TaskKanbanBoard.jsx       # 3-lane visual sprint kanban board
│   │   ├── TaskExecutionView.jsx     # Composite task controller with view switcher
│   │   ├── CreateTaskModal.jsx       # Task authoring modal
│   │   ├── TaskDiscussionThread.jsx  # Live engineering comment discussion thread
│   │   ├── TaskInspectorView.jsx     # Task detail & specification inspector
│   │   └── index.js
│   ├── calendar/                     # Delivery calendar & milestone timeline
│   │   ├── DeliveryCalendarView.jsx  # Interactive month matrix & agenda panel
│   │   └── index.js
│   ├── analytics/                    # Data visualization & velocity metrics
│   │   ├── ProjectAnalyticsDashboard.jsx # Recharts charts (Status bar, Type donut, Priority breakdown)
│   │   └── index.js
│   └── team/                         # Team directory & role management
│       ├── InviteMemberModal.jsx     # Member invitation dialog
│       ├── TeamDirectoryView.jsx     # Team directory & access table
│       └── index.js
│
├── index.css                         # Tailwind CSS v4 styling & typography
└── main.jsx                          # React 19 entrypoint
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with `@/` path aliasing
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React Redux
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (declarative `useRoutes`)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

---

## 📄 License

MIT License.
