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

function markDone(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    throw new Error(`Todo with ID ${id} not found`);
  }

  todo.done = true;
  saveTodos(todos);
  return todo;
}

function deleteTodo(id) {
  const todos = loadTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error(`Todo with ID ${id} not found`);
  }

  const removed = todos.splice(index, 1)[0];
  saveTodos(todos);
  return removed;
}

module.exports = { addTodo, listTodos, markDone, deleteTodo };
