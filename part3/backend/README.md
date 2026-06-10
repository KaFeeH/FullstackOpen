# Phonebook Backend

Practical exercise from **Full Stack Open** Part 3: Programming a server with NodeJS and Express.

## Overview

REST API for a phonebook application with full CRUD operations, backed by MongoDB. Serves the frontend static build from `dist/`.

## Features

### Exercises 3.1–3.6: Express server

- **GET /api/persons**: Returns all contacts as JSON
- **GET /api/persons/:id**: Returns a single contact by id
- **POST /api/persons**: Creates a new contact (name + number)
- **DELETE /api/persons/:id**: Deletes a contact
- **GET /info**: Shows total contact count and current date/time
- **Morgan logging**: Custom token logging request body in POST
- **Static file serving**: Serves the React frontend build from `dist/`

### Exercises 3.7–3.8: Middleware & logging

- **Morgan**: Custom format logging method, url, status, content-length, response time, and request body
- **Error handling**: Centralized `errorHandler` middleware for CastError, ValidationError, SyntaxError, and unknown endpoints

### Exercises 3.9–3.11: Deploy & frontend integration

- **CORS**: Enabled to allow cross-origin requests during development
- **Production build**: Frontend built with Vite and served as static files from `dist/`

### Exercises 3.12–3.21: MongoDB & validation

- **MongoDB Atlas**: Database hosted on MongoDB Atlas via Mongoose
- **Schema validation**:
  - `name`: String, required, minimum length 3
  - `number`: String, required, minimum length 8, must match format `XX-XXXXXXX` or `XXX-XXXXXXX`
- **Mongoose validation errors**: Returned as 400 with descriptive messages
- **id format**: `_id` transformed to `id` string in JSON responses
- **PUT /api/persons/:id**: Updates an existing contact with validation
- **mongo.js CLI utility**: Script to list or add contacts from the command line

### Exercise 3.22: ESLint

- **Linter configuration**: ESLint configured with `@eslint/js` recommended rules and `@stylistic/eslint-plugin`
- **Custom rules**: Enforces `eqeqeq`, no trailing spaces, object-curly-spacing, arrow-spacing, and no unused variables (ignoring `_`-prefixed args)
- **Ignore pattern**: `dist/` excluded from linting

## Tech Stack

- Node.js
- Express 5
- MongoDB / Mongoose 9
- ESLint + Stylistic
- Morgan
- Nodemon (dev)
- dotenv

## Usage

```bash
# Install dependencies
pnpm install

# Set environment variables in .env
#   MONGODB_URI="mongodb+srv://..."
#   PORT=3001

# Start in production mode
pnpm start

# Start in development mode (with nodemon)
pnpm run dev

# Run linter
pnpm run lint

# CLI utility: list all contacts
node mongo.js <password>

# CLI utility: add a contact
node mongo.js <password> "John Doe" "123-4567890"
```

## API Endpoints

| Method | Path               | Description                |
|--------|--------------------|----------------------------|
| GET    | /info              | Phonebook info & timestamp |
| GET    | /api/persons       | List all contacts          |
| GET    | /api/persons/:id   | Get a single contact       |
| POST   | /api/persons       | Create a contact           |
| PUT    | /api/persons/:id   | Update a contact           |
| DELETE | /api/persons/:id   | Delete a contact           |
