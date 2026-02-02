const { cleanState, test, readTodos, assert } = require('./test-helpers');

cleanState();

test('loadTodos returns empty array when file does not exist', () => {
  const { loadTodos } = require('./storage');
  const todos = loadTodos();
  assert(Array.isArray(todos), 'Should return an array');
  assert(todos.length === 0, 'Should return empty array');
});

test('saveTodos creates file with correct data', () => {
  const { saveTodos } = require('./storage');
  const testData = [
    { id: 1, text: 'Test todo', done: false }
  ];
  saveTodos(testData);

  const saved = readTodos();
  assert(saved !== null, 'File should exist');
  assert(saved.length === 1, 'Should have 1 todo');
  assert(saved[0].text === 'Test todo', 'Text should match');
});

test('loadTodos reads back saved data', () => {
  const { loadTodos, saveTodos } = require('./storage');
  const testData = [
    { id: 1, text: 'First', done: false },
    { id: 2, text: 'Second', done: true }
  ];
  saveTodos(testData);

  const loaded = loadTodos();
  assert(loaded.length === 2, 'Should load 2 todos');
  assert(loaded[0].text === 'First', 'First todo text should match');
  assert(loaded[1].text === 'Second', 'Second todo text should match');
  assert(loaded[1].done === true, 'Second todo done status should match');
});

cleanState();
