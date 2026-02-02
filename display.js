const { green, yellow, dim } = require('./colors');

function formatTodo(todo) {
  if (todo.done) {
    return green(`[✓] ${todo.id}. ${todo.text}`);
  }
  return yellow(`[ ] ${todo.id}. ${todo.text}`);
}

function formatTodoList(todos) {
  if (todos.length === 0) {
    return dim('No todos yet. Add one with: node index.js add "text"');
  }
  return todos.map(formatTodo).join('\n');
}

module.exports = { formatTodo, formatTodoList };
