const { addTodo } = require('./commands');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Usage: node index.js <command> [arguments]');
  console.log('Commands: add <text>');
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
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
