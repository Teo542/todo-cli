const { addTodo, listTodos, markDone, deleteTodo } = require('./commands');
const { formatTodoList } = require('./display');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Usage: node index.js <command> [arguments]');
  console.log('Commands: add <text>, list, done <id>, delete <id>');
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
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
