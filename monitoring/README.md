# Legion Monitoring Dashboard

## Overview
This is the next-generation Angular-based monitoring dashboard for the Artifact XAI: Legion Enterprise System. It provides real-time and historical insights into all agents, departments, system health, security, and business operations.

## Features
- **Executive Summary:** High-level cards for system status, agent activity, and department health.
- **Real-Time Metrics:** Live updating charts for system, agent, and workflow metrics.
- **2D/3D Visualizations:** Interactive charts and Three.js-powered 3D system/process maps.
- **Markdown Report Viewer:** View executive and operational summaries directly in the dashboard.
- **Security & Health Panel:** Live status, alerts, and diagnostics.
- **Agent/Process Activity Table:** Sortable, filterable live activity data.
- **Navigation Sidebar:** Quick access to all dashboard panels.
- **Responsive UI:** Modern, accessible, and beautiful design using Angular Material and Tailwind CSS.

## Data Sources
- **Live APIs:** `/api/monitoring/metrics`, `/api/monitoring/health`, `/api/monitoring/security`, `/api/monitoring/reports` (see `core/monitoring-api.service.ts`).
- **Static Reports:** JSON and Markdown files in `reporting/executive/` and department `data/` folders.
- **Logs & Databases:** System and agent logs, SQLite DBs for historical and audit data.

## Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dashboard:
   ```sh
   npm start
   ```
3. Build for production:
   ```sh
   npm run build
   ```

## Directory Structure
- `src/app/features/` – Dashboard feature components
- `src/app/core/` – API/data services
- `src/app/shared/` – Shared UI modules
- `logs/` – Monitoring logs
- `dist/` – Production build output

## Customization
- Update API endpoints in `core/monitoring-api.service.ts` as needed.
- Add new feature components in `src/app/features/`.
- Integrate new data sources or visualizations as your system evolves.

## Usage Examples

### 1. Running the Dashboard Locally

```sh
npm install
npm start
```

Open your browser to [http://localhost:4200](http://localhost:4200) to view the dashboard.

### 2. Viewing Real-Time Metrics

- Navigate to the **Real-Time Metrics** panel from the sidebar.
- Live charts will update automatically as new data arrives from `/api/monitoring/metrics`.

### 3. Exploring 2D/3D Visualizations

- Go to the **2D/3D Visualizations** section.
- Interact with system maps and process flows powered by Three.js.

### 4. Viewing Executive Reports

- Select the **Markdown Report Viewer** panel.
- Choose from available executive or operational summaries (Markdown/JSON).

### 5. Customizing Data Sources

- Edit `src/app/core/monitoring-api.service.ts` to point to your own API endpoints or static files.
- Add new data adapters as needed for custom integrations.

---

## Architecture Diagrams

### Visual Overview

```
+-------------------------------------------------------------+
|                 Legion Monitoring Dashboard                 |
+-------------------------------------------------------------+
| Sidebar | Executive | Real-Time | 2D/3D   | Security | Agent|
|         | Summary   | Metrics   | Visuals | & Health | Table|
+-------------------------------------------------------------+
|                 Angular Material + Tailwind CSS             |
+-------------------------------------------------------------+
|   Monitoring API Service   |   Static Data/Reports Adapter   |
+---------------------------+---------------------------------+
|         REST APIs         |   Markdown/JSON/DB/Logs         |
+--------------------------+----------------------------------+
```

### Topological Data Flow

```
[APIs/DBs/Logs]         [Static Reports]
     |                        |
     v                        v
+-------------------------------+
|  Monitoring API Service       |
+-------------------------------+
     |                |
     v                v
[Live Data]      [Static Data]
     |                |
     +-------+  +-----+
             v  v
      [Dashboard Components]
             |
             v
      [Angular Material UI]
             |
             v
      [User/Executive]
```

---

## Custom Theme & Style

The dashboard uses a modern, executive-level theme for clarity and impact:
- **Angular Material**: For consistent, accessible UI components.
- **Tailwind CSS**: For rapid, utility-first styling and custom themes.
- **Dark/Light Modes**: Easily switchable for different environments.
- **Brand Colors**: Legion/Artifact XAI palette for visual identity.
- **Typography**: Large, readable headings and data cards for executive clarity.
- **Charts & 3D**: High-contrast, visually engaging charts and Three.js scenes.

### Customization Tips
- Edit `tailwind.config.js` to adjust color palette, fonts, and spacing.
- Use Angular Material's theming system for further UI tweaks.
- Update `src/styles.scss` for global style overrides.
- Add or modify dashboard cards and panels in `src/app/features/` for new data or visualizations.

For advanced branding or UI/UX needs, see the Angular Material and Tailwind CSS documentation.

---

## License
See root LICENSE file.
