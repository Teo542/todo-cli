const { addTodo, listTodos, markDone, deleteTodo, editTodo } = require('./commands');
const { formatTodoList } = require('./display');
const { green, red, bold } = require('./colors');

const HELP_TEXT = `${bold('TODO CLI')} - A simple command-line todo manager

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

function parseId(value) {
  const id = Number(value);
  if (!id) {
    console.error(red('Error: Please provide a valid todo ID'));
    process.exit(1);
  }
  return id;
}

function run() {
  switch (command) {
    case 'add': {
      const text = args.slice(1).join(' ');
      if (!text) {
        console.error(red('Error: Please provide todo text'));
        process.exit(1);
      }
      const todo = addTodo(text);
      console.log(green(`Added: [${todo.id}] ${todo.text}`));
      break;
    }
    case 'list': {
      const todos = listTodos();
      console.log(formatTodoList(todos));
      break;
    }
    case 'done': {
      const id = parseId(args[1]);
      const done = markDone(id);
      console.log(green(`Done: [${done.id}] ${done.text}`));
      break;
    }
    case 'edit': {
      const id = parseId(args[1]);
      const newText = args.slice(2).join(' ');
      if (!newText) {
        console.error(red('Error: Please provide new text'));
        process.exit(1);
      }
      const edited = editTodo(id, newText);
      console.log(green(`Edited: [${edited.id}] ${edited.text}`));
      break;
    }
    case 'delete': {
      const id = parseId(args[1]);
      const removed = deleteTodo(id);
      console.log(green(`Deleted: [${removed.id}] ${removed.text}`));
      break;
    }
    default:
      console.error(red(`Unknown command: ${command}`) + '\n');
      console.log(HELP_TEXT);
      process.exit(1);
  }
}

try {
  run();
} catch (error) {
  console.error(red(`Error: ${error.message}`));
  process.exit(1);
}
