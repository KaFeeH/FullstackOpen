# Part 1 - Introduction to React

Collection of practical exercises from the **Full Stack Open** course, focused on React fundamentals.

## Projects

| Directory     | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `courseinfo/` | Basic components: Header, Part, Content, Total                    |
| `unicafe/`    | Feedback with `useState`: good/neutral/bad buttons and statistics |
| `anecdotes/`  | Anecdotes with votes: random display and ranking                  |

## Technologies

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

Navigate to the desired subproject folder and run:

```bash
cd courseinfo   # or unicafe, anecdotes
pnpm install
pnpm run dev
```

## Structure

Each subproject is independent and has its own:

- `package.json` with dependencies
- `src/App.jsx` with exercise code
- `src/main.jsx` entry point
- `node_modules/` and `pnpm-lock.yaml`

They do not share a workspace.
