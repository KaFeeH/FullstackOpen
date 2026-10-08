# Bloglist Backend — Part 4

Practical exercise from **Full Stack Open** Part 4: Testing Express servers, user administration.

## Overview

REST API for a blog list application backed by MongoDB. Users can register, log in with a token, and manage their own blogs. Covers backend structure, unit and integration testing with the Node.js test runner and Supertest, user administration with hashed passwords, and token-based authentication with JSON Web Tokens.

## Features

### Exercises 4.1–4.2: Project structure

- **Blog list application**: Express app with a `Blog` model (title, author, url, likes) persisted in MongoDB
- **Modular layout**: `app.js` builds the application, `index.js` only starts the server, and routes live in `controllers/`
- **Configuration**: Environment variables read in a single `utils/config.js`

### Exercises 4.3–4.7: List helpers

- **dummy**: Always returns `1`
- **totalLikes**: Sum of the likes of all blogs
- **favoriteBlog**: Blog with the most likes (`title`, `author`, `likes`)
- **mostBlogs**: Author with the most blogs (`author`, `blogs`)
- **mostLikes**: Author whose blogs have the most likes in total (`author`, `likes`)
- **Empty lists**: Each helper returns a neutral result instead of throwing

### Exercises 4.8–4.14: API tests & blog operations

- **Integration tests**: Supertest against the real app with a separate test database
- **GET /api/blogs**: Returns blogs as JSON, with `id` instead of `_id` and no `__v`
- **POST /api/blogs**: Creates a blog, defaults `likes` to `0`, and returns `400` if `title` or `url` is missing
- **DELETE /api/blogs/:id**: Deletes a blog
- **PUT /api/blogs/:id**: Updates `title`, `author`, `url` and `likes`; other fields sent by the client are ignored
- **PATCH /api/blogs/:id/like**: Increases the likes of a blog by 1
- **Error handling**: Centralized `errorHandler` for malformed ids and validation errors (`400`), invalid or expired tokens (`401`), and a JSON `500` fallback for unhandled errors; unknown ids return `404` from the routes

### Exercises 4.15–4.17: User administration

- **POST /api/users**: Creates a user; the password is hashed with `bcrypt` and never stored or returned
- **Validation**: `username` and `password` are required, both with a minimum length of 3, and `username` must be unique
- **GET /api/users**: Lists users with the blogs they created
- **Blog–user relation**: Every blog stores its creator, and `user.blogs` is kept in sync on create and delete
- **populate**: Blogs include their creator (`username`, `name`) and users include their blogs (`title`, `author`, `url`)

### Exercises 4.18–4.23: Token authentication

- **POST /api/login**: Checks the credentials with `bcrypt` and returns a signed JWT (valid for one hour, containing `username` and `id`) together with `username` and `name`
- **tokenExtractor**: Middleware that reads `Authorization: Bearer <token>` into `request.token`
- **userExtractor**: Middleware that verifies the token, loads the user into `request.user` and rejects missing, invalid, expired or orphaned tokens with `401`
- **Protected routes**: Creating, updating and deleting blogs requires a token, and the creator is always taken from the token, never from the request body
- **Ownership**: Only the creator of a blog can update or delete it (`403` otherwise); a user can only update their own `username` and `name`
- **Authenticated tests**: Existing tests send a `Bearer` token, plus tests for requests without a token

### Testing

- **72 tests** with the Node.js test runner, run in sequence against a dedicated database
- **Shared helpers**: `tests/test_helper.js` provides initial data, user and token creation, `withToken` and database snapshots
- **Naming convention**: `succeeds with ...` for the happy path and `fails with status code XXX if ...` for errors

### Linting

- **Linter configuration**: ESLint with `@eslint/js` recommended rules and `@stylistic/eslint-plugin`
- **Custom rules**: Enforces `eqeqeq`, semicolons, `eol-last`, no trailing spaces, spacing around operators, object curly spacing, arrow spacing, and no unused variables (ignoring `_`-prefixed args)

## Tech Stack

- Node.js
- Express 5
- MongoDB / Mongoose 9
- bcrypt
- jsonwebtoken
- Node.js test runner + Supertest
- ESLint + Stylistic
- Morgan
- Nodemon (dev)
- dotenv

## Usage

```bash
# Install dependencies
pnpm install

# Set environment variables in .env (see .env.example)
#   PORT=3003
#   MONGODB_URI="mongodb+srv://..."
#   TEST_MONGODB_URI="mongodb+srv://..."
#   SECRET="a-long-random-string"

# Start in production mode
pnpm start

# Start in development mode (with nodemon)
pnpm run dev

# Run tests (use a dedicated database: it is emptied on every run)
pnpm test

# Run linter
pnpm run lint
```

## API Endpoints

| Method | Path                 | Auth  | Description                        |
|--------|----------------------|-------|------------------------------------|
| GET    | /info                | No    | Server status & timestamp          |
| GET    | /api/blogs           | No    | List all blogs                     |
| GET    | /api/blogs/:id       | No    | Get a single blog                  |
| POST   | /api/blogs           | Token | Create a blog                      |
| PUT    | /api/blogs/:id       | Token | Update a blog (owner only)         |
| PATCH  | /api/blogs/:id/like  | No    | Add one like to a blog             |
| DELETE | /api/blogs/:id       | Token | Delete a blog (owner only)         |
| GET    | /api/users           | No    | List all users with their blogs    |
| GET    | /api/users/:id       | No    | Get a single user                  |
| POST   | /api/users           | No    | Create a user                      |
| PUT    | /api/users/:id       | Token | Update username and name (self)    |
| POST   | /api/login           | No    | Log in and get a token             |
