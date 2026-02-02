const { loadTodos, saveTodos } = require('./storage');

function listTodos() {
  return loadTodos();
}

function addTodo(text) {
  if (!text || !text.trim()) {
    throw new Error('Todo text cannot be empty');
  }

  const todos = loadTodos();
  const id = todos.length > 0
    ? Math.max(...todos.map(t => t.id)) + 1
    : 1;

  const todo = { id, text: text.trim(), done: false };
  todos.push(todo);
  saveTodos(todos);

  return todo;
}

module.exports = { addTodo, listTodos };
