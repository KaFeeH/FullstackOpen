# Phonebook Frontend

Frontend counterpart of the Part 3 backend. Same application as [`part2/phonebook`](../part2/phonebook/README.md), adapted to integrate with a real Express + MongoDB server instead of `json-server`.

## Key differences from part2/phonebook

| Aspect | part2/phonebook | part3/frontend |
|---|---|---|
| API base URL | `http://localhost:3001/persons` (absolute) | `/api/persons` (relative) |
| Backend | json-server (file-based) | Express + MongoDB (Mongoose validation) |
| Data source | `db.json` | MongoDB Atlas |
| Deployment | Separate frontend dev server | Built frontend served from backend `dist/` |

### Integration notes

- **Relative base URL**: `personService` uses `/api/persons` instead of the full origin. In production the Express backend serves both the API and the built frontend on the same port. During development, rely on CORS (backend allows cross-origin) or add a Vite proxy.
- **Mongoose validation errors**: The backend returns validation error messages (e.g., name too short, invalid phone format). The frontend displays them via the existing notification system: `error.response.data.error` is shown in the red error banner.
- **`db.json` is unused**: It remains in the repo as a reference or fallback for local testing, but the real data comes from MongoDB via the backend.
- **Build flow**: Run `pnpm run build` in this directory, then copy (or symlink) the `dist/` output to `../backend/dist/`. The backend serves it as static files at the root path.

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + React Hooks plugin
- Axios

## Usage

```bash
# Development (separate server, needs backend running on port 3001)
pnpm install
pnpm run dev          # Frontend on port 5173

# Production build (copy dist/ to the backend)
pnpm run build
```
