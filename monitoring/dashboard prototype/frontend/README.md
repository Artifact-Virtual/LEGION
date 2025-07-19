# Dashboard Prototype Frontend

This is the Angular frontend for the next-gen monitoring dashboard. It features:
- Modular, extensible UI (Angular 20+, Material, Tailwind, Three.js)
- Real-time metrics, logs, and advanced visualizations
- API/data source management (add/remove/standby/configure)
- Developer/research tooling and productivity unlocks

## Structure
- `core/` — API/data services, adapters
- `features/` — Dashboard modules (metrics, logs, 3D, etc.)
- `plugins/` — Custom/third-party panels
- `shared/` — UI components, utilities

## Quickstart
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dashboard:
   ```sh
   npm start
   ```

## Extending
- Add new features in `features/` or plugins in `plugins/`.
- Update API/data adapters in `core/`.
- Customize UI in `shared/` and with Tailwind/Material themes.

See `../ARCHITECTURE.md` for full design details.
