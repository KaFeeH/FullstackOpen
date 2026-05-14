# Phonebook

Practical exercise from **Full Stack Open** Part 2: Communicating with server.

## Overview

A phonebook application with full CRUD functionality backed by a REST API. Allows:

- Adding new contacts
- Updating existing contacts' phone numbers
- Deleting contacts
- Filtering contacts by name in real-time
- Viewing all contacts

## Features

### Exercises 2.5–2.10: Local state

- **Add contacts**: Form to add new name and phone number
- **Duplicate prevention**: Alerts when trying to add an existing contact
- **Filter**: Search contacts by name in real-time
- **Components**:
  - `PersonForm`: Form with name and number inputs
  - `Filter`: Search input for filtering
  - `Persons`: Displays filtered contact list
  - `App`: Main component managing state
- **State management**: Uses React `useState` for persons list and filter

### Exercises 2.11–2.15: Server integration

- **Data fetching**: Initial contacts loaded from `json-server` via `useEffect`
- **API integration**: Full CRUD using `axios` (GET, POST, PUT, DELETE)
- **Update contacts**: Replace an existing contact's number with confirmation dialog
- **Delete contacts**: Remove contacts with confirmation dialog
- **Services**:
  - `personService`: Encapsulates all HTTP requests to the backend

### Exercises 2.16–2.17: Notification messages

- **Notification system**: Success and error messages displayed after CRUD operations
- **Success messages**: Green notification shown when a contact is added successfully (`"Added {name}"`)
- **Error messages**: Red notification shown when an update fails because the contact was already deleted from the server (`"Information of {name} has already been removed from server"`)
- **Auto-dismiss**: Messages automatically disappear after 5 seconds using `setTimeout`
- **State management**: `message` state holds `type` (`"success"` | `"error"`) and `text` properties; clearing is done by resetting both to empty strings
- **Conditional rendering**: Message is only rendered when `message.text` is truthy, with the CSS class applied dynamically via `{message.type}`
- **Styling**: CSS classes `.success` (green border) and `.error` (red border) defined in `index.css` with lightgrey background, rounded corners, and padding

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- ESLint + Babel + React Compiler
- Axios

## Usage

```bash
# Start the JSON server in port 3001 (backend)
pnpm run server

# Start the development server (frontend)
pnpm install
pnpm run dev
```
