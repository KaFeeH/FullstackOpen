# Phonebook App — Part 3

> **Live demo:** [backend-part3-0x8t.onrender.com](https://backend-part3-0x8t.onrender.com)

Full Stack Open **Part 3**: Programming a server with NodeJS and Express.

Builds a complete REST API with Express and MongoDB, then integrates the React frontend from Part 2 as a static build served from the same server. Covers HTTP endpoints, middleware, error handling, database persistence with Mongoose, data validation, linting, and deployment.

## Structure

- **[`backend/`](./backend/README.md)** — Express + MongoDB REST API with Mongoose validation, custom morgan logging, ESLint, and the built frontend as static files.
- **[`frontend/`](./frontend/README.md)** — React frontend adapted from Part 2 to use a relative API base URL (`/api/persons`) and display Mongoose validation errors.
