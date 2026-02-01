const fs = require('fs');
const path = require('path');

const TODOS_FILE = path.join(__dirname, 'todos.json');

function loadTodos() {
  try {
    if (!fs.existsSync(TODOS_FILE)) {
      return [];
    }

    const data = fs.readFileSync(TODOS_FILE, 'utf8');

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw new Error(`Failed to load todos: ${error.message}`);
  }
}

function saveTodos(todos) {
  try {
    const data = JSON.stringify(todos, null, 2);
    fs.writeFileSync(TODOS_FILE, data, 'utf8');
  } catch (error) {
    throw new Error(`Failed to save todos: ${error.message}`);
  }
}

module.exports = {
  loadTodos,
  saveTodos
};
