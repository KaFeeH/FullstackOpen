# Courseinfo - Course Details App

Practical exercise from **Full Stack Open** Part 2: Introduction to React.

## Overview

A simple course information app that displays courses with their modules and exercises. Shows:

- Course name as header
- List of parts/modules with exercise count
- Total exercises per course

## Features

- **Multiple courses**: Renders multiple courses dynamically
- **Components**:
  - `Header`: Course name display
  - `Total`: Calculates total exercises using array.reduce
  - `Course`: Combines header, parts, and total
- **Data structure**: Courses with nested parts array, each with name, exercises, and id

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

```bash
pnpm install
pnpm run dev
```

