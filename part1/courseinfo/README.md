# CourseInfo - Course Data Display

Practical exercise from **Full Stack Open** Part 1: Introduction to React.

## Overview

A simple application that displays course information including the course name, list of parts with exercises, and total number of exercises.

## Features

- **Course header**: Displays the course name
- **Parts list**: Shows each part with its name and exercise count
- **Total exercises**: Calculates and displays the sum of all exercises using `reduce`
- **Components**:
  - `Header`: Renders the course title
  - `Part`: Displays a single part with name and exercises
  - `Content`: Maps through all parts
  - `Total`: Calculates total exercises

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

```bash
pnpm install
pnpm run dev
```