function formatTodo(todo) {
  const status = todo.done ? '[✓]' : '[ ]';
  return `${status} ${todo.id}. ${todo.text}`;
}

function formatTodoList(todos) {
  if (todos.length === 0) {
    return 'No todos yet. Add one with: node index.js add "text"';
  }
  return todos.map(formatTodo).join('\n');
}

module.exports = { formatTodo, formatTodoList };
