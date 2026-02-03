# TODO CLI

A simple command-line TODO application for managing tasks.

## Features

- Add, list, edit, mark done, and delete todos
- Persistent storage using JSON
- Colored terminal output

## Usage

```bash
node index.js add "Your task here"   # Add a new todo
node index.js list                   # List all todos
node index.js done <id>              # Mark todo as complete
node index.js edit <id> "New text"   # Edit todo text
node index.js delete <id>            # Delete a todo
```

## Running Tests

```bash
node test.js
```

## Project Structure

- `index.js` - CLI entry point and command routing
- `commands.js` - Business logic for CRUD operations
- `storage.js` - Persistent storage (todos.json)
- `display.js` - Formatting for todo display
- `colors.js` - ANSI color utilities
