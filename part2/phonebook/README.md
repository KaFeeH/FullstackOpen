# Phonebook

Practical exercise from **Full Stack Open** Part 2: Introduction to React.

## Overview

A simple phonebook application that manages contacts with names and phone numbers. Allows:

- Adding new contacts
- Filtering contacts by name
- Viewing all contacts

## Features

- **Add contacts**: Form to add new name and phone number
- **Duplicate prevention**: Alerts when trying to add an existing contact
- **Filter**: Search contacts by name in real-time
- **Components**:
  - `PersonForm`: Form with name and number inputs
  - `Filter`: Search input for filtering
  - `Persons`: Displays filtered contact list
  - `App`: Main component managing state
- **State management**: Uses React useState for persons list and filter

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler

## Usage

```bash
pnpm install
pnpm run dev
```