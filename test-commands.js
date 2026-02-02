const { cleanState, test, readTodos, assert, runCli } = require('./test-helpers');

// --- Add command tests ---

test('add command creates a todo via CLI', () => {
  cleanState();
  runCli('add "My first todo"');
  const todos = readTodos();
  assert(todos !== null, 'File should exist');
  assert(todos.length === 1, 'Should have 1 todo');
  assert(todos[0].text === 'My first todo', 'Text should match');
  assert(todos[0].done === false, 'Should not be done');
  assert(todos[0].id === 1, 'ID should be 1');
});

test('add command appends second todo with incremented id', () => {
  runCli('add "Second todo"');
  const todos = readTodos();
  assert(todos.length === 2, 'Should have 2 todos');
  assert(todos[1].text === 'Second todo', 'Second text should match');
  assert(todos[1].id === 2, 'Second ID should be 2');
});

test('add command fails without text', () => {
  let threw = false;
  try {
    runCli('add', { stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should exit with error when no text provided');
});

cleanState();

// --- List command tests ---

test('list command shows empty message when no todos', () => {
  cleanState();
  const output = runCli('list');
  assert(output.includes('No todos yet'), 'Should show empty message');
});

test('list command shows pending todo with [ ]', () => {
  cleanState();
  runCli('add "Pending task"');
  const output = runCli('list');
  assert(output.includes('[ ]'), 'Should show [ ] for pending');
  assert(output.includes('Pending task'), 'Should show todo text');
});

test('list command shows completed todo with [✓]', () => {
  cleanState();
  const { saveTodos } = require('./storage');
  saveTodos([{ id: 1, text: 'Done task', done: true }]);
  const output = runCli('list');
  assert(output.includes('[✓]'), 'Should show [✓] for completed');
  assert(output.includes('Done task'), 'Should show todo text');
});

cleanState();

// --- Done command tests ---

test('done command marks a todo as completed', () => {
  cleanState();
  runCli('add "Mark me done"');
  runCli('done 1');
  const todos = readTodos();
  assert(todos[0].done === true, 'Todo should be marked done');
});

test('done command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    runCli('done 999', { stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

// --- Delete command tests ---

test('delete command removes a todo', () => {
  cleanState();
  runCli('add "Delete me"');
  runCli('add "Keep me"');
  runCli('delete 1');
  const todos = readTodos();
  assert(todos.length === 1, 'Should have 1 todo left');
  assert(todos[0].text === 'Keep me', 'Remaining todo should be correct');
});

test('delete command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    runCli('delete 999', { stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

cleanState();

// --- Edit command tests ---

test('edit command updates todo text', () => {
  cleanState();
  runCli('add "Original text"');
  runCli('edit 1 "Updated text"');
  const todos = readTodos();
  assert(todos[0].text === 'Updated text', 'Text should be updated');
  assert(todos[0].id === 1, 'ID should remain the same');
});

test('edit command preserves done status', () => {
  cleanState();
  runCli('add "Task"');
  runCli('done 1');
  runCli('edit 1 "Edited task"');
  const todos = readTodos();
  assert(todos[0].text === 'Edited task', 'Text should be updated');
  assert(todos[0].done === true, 'Done status should be preserved');
});

test('edit command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    runCli('edit 999 "New text"', { stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

cleanState();
