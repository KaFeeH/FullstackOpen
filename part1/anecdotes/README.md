# Anecdotes - Random Anecdote App

Practical exercise from **Full Stack Open** Part 1: Introduction to React.

## Overview

A simple application that displays random programming anecdotes. Users can vote for their favorites and see which anecdote has the most votes.

## Features

- **Random anecdote display**: Shows a random anecdote from a list of 8 programming quotes
- **Voting system**: Increment votes for each anecdote using React `useState`
- **Most voted anecdote**: Automatically displays the anecdote with the highest vote count using `Math.max` and `indexOf`
- **Recursion for randomness**: Ensures a different anecdote is shown on each "next" click

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

```bash
pnpm install
pnpm run dev
```

