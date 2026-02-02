const { addTodo, listTodos, markDone, deleteTodo, editTodo } = require('./commands');
const { formatTodoList } = require('./display');

const HELP_TEXT = `
TODO CLI - A simple command-line todo manager

Usage: node index.js <command> [arguments]

Commands:
  add <text>          Add a new todo
  list                List all todos
  done <id>           Mark a todo as completed
  delete <id>         Delete a todo
  edit <id> <text>    Edit a todo's text

Examples:
  node index.js add "Buy groceries"
  node index.js list
  node index.js done 1
  node index.js delete 2
  node index.js edit 1 "Buy organic groceries"
`.trim();

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(HELP_TEXT);
  process.exit(1);
}

switch (command) {
  case 'add': {
    const text = args.slice(1).join(' ');
    if (!text) {
      console.error('Error: Please provide todo text');
      process.exit(1);
    }
    const todo = addTodo(text);
    console.log(`Added: [${todo.id}] ${todo.text}`);
    break;
  }
  case 'list': {
    const todos = listTodos();
    console.log(formatTodoList(todos));
    break;
  }
  case 'done': {
    const doneId = Number(args[1]);
    if (!doneId) {
      console.error('Error: Please provide a todo ID');
      process.exit(1);
    }
    const done = markDone(doneId);
    console.log(`Done: [${done.id}] ${done.text}`);
    break;
  }
  case 'edit': {
    const editId = Number(args[1]);
    if (!editId) {
      console.error('Error: Please provide a todo ID');
      process.exit(1);
    }
    const newText = args.slice(2).join(' ');
    if (!newText) {
      console.error('Error: Please provide new text');
      process.exit(1);
    }
    const edited = editTodo(editId, newText);
    console.log(`Edited: [${edited.id}] ${edited.text}`);
    break;
  }
  case 'delete': {
    const delId = Number(args[1]);
    if (!delId) {
      console.error('Error: Please provide a todo ID');
      process.exit(1);
    }
    const removed = deleteTodo(delId);
    console.log(`Deleted: [${removed.id}] ${removed.text}`);
    break;
  }
  default:
    console.error(`Unknown command: ${command}\n`);
    console.log(HELP_TEXT);
    process.exit(1);
}
