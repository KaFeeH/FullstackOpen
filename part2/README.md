# Part 2 - Communicating with server

Collection of practical exercises from the **Full Stack Open** course, focused on rendering collections, forms, and API integration.

## Projects

| Directory     | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `courseinfo/` | Multi-course display with decomposed components, computed totals via reduce |
| `phonebook/`  | Full-CRUD phonebook with JSON server, real-time filtering, and notifications |
| `countries/`  | Country search with REST Countries & OpenWeatherMap APIs, weather integration |

## Technologies

- React 19.2.5
- Vite 8.0.10
- React Compiler (Babel plugin)
- ESLint (flat config)
- Axios 1.16.0

## Usage

Navigate to the desired subproject folder and run:

```bash
cd courseinfo   # or phonebook, countries
pnpm install
pnpm run dev
```

## Structure

Each subproject is independent and has its own:

- `package.json` with dependencies
- `src/` with components and services
- `src/main.jsx` entry point
- `node_modules/` and `pnpm-lock.yaml`

They do not share a workspace.
