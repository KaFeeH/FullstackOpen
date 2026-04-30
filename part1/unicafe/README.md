# UniCafe - Feedback App

Practical exercise from **Full Stack Open** Part 1: Introduction to React.

## Overview

A simple feedback collection app where users can rate their experience as _good_, _neutral_, or _bad_. Displays statistics including:

- Total votes (all)
- Average score ((good - bad) / all)
- Positive percentage ((good / all) \* 100)

## Features

- **Feedback buttons**: Three options (good / neutral / bad) using React `useState`
- **Statistics display**: Shows metrics only when feedback is given
- **Components**:
  - `Button`: Reusable button with onClick handler
  - `StatisticsLine`: Table row for each statistic
  - `Statistics`: Conditionally renders stats table or "No feedback given"

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

```bash
pnpm install
pnpm run dev
```

