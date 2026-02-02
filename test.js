const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TODOS_FILE = path.join(__dirname, 'todos.json');

let passedTests = 0;
let totalTests = 0;

function cleanState() {
  if (fs.existsSync(TODOS_FILE)) {
    fs.unlinkSync(TODOS_FILE);
  }
}

function test(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✓ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ FAIL: ${description}`);
    console.log(`  Reason: ${error.message}`);
  }
}

function readTodos() {
  if (!fs.existsSync(TODOS_FILE)) {
    return null;
  }
  const data = fs.readFileSync(TODOS_FILE, 'utf8');
  return JSON.parse(data);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('Running tests...\n');

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

const NODE = process.argv[0];

// --- Add command tests ---

test('add command creates a todo via CLI', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "My first todo"`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos !== null, 'File should exist');
  assert(todos.length === 1, 'Should have 1 todo');
  assert(todos[0].text === 'My first todo', 'Text should match');
  assert(todos[0].done === false, 'Should not be done');
  assert(todos[0].id === 1, 'ID should be 1');
});

test('add command appends second todo with incremented id', () => {
  execSync(`"${NODE}" index.js add "Second todo"`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos.length === 2, 'Should have 2 todos');
  assert(todos[1].text === 'Second todo', 'Second text should match');
  assert(todos[1].id === 2, 'Second ID should be 2');
});

test('add command fails without text', () => {
  let threw = false;
  try {
    execSync(`"${NODE}" index.js add`, { cwd: __dirname, stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should exit with error when no text provided');
});

cleanState();

// --- List command tests ---

test('list command shows empty message when no todos', () => {
  cleanState();
  const output = execSync(`"${NODE}" index.js list`, {
    cwd: __dirname, encoding: 'utf8'
  });
  assert(output.includes('No todos yet'), 'Should show empty message');
});

test('list command shows pending todo with [ ]', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "Pending task"`, { cwd: __dirname });
  const output = execSync(`"${NODE}" index.js list`, {
    cwd: __dirname, encoding: 'utf8'
  });
  assert(output.includes('[ ]'), 'Should show [ ] for pending');
  assert(output.includes('Pending task'), 'Should show todo text');
});

test('list command shows completed todo with [✓]', () => {
  cleanState();
  const { saveTodos } = require('./storage');
  saveTodos([{ id: 1, text: 'Done task', done: true }]);
  const output = execSync(`"${NODE}" index.js list`, {
    cwd: __dirname, encoding: 'utf8'
  });
  assert(output.includes('[✓]'), 'Should show [✓] for completed');
  assert(output.includes('Done task'), 'Should show todo text');
});

cleanState();

// --- Done command tests ---

test('done command marks a todo as completed', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "Mark me done"`, { cwd: __dirname });
  execSync(`"${NODE}" index.js done 1`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos[0].done === true, 'Todo should be marked done');
});

test('done command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    execSync(`"${NODE}" index.js done 999`, { cwd: __dirname, stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

// --- Delete command tests ---

test('delete command removes a todo', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "Delete me"`, { cwd: __dirname });
  execSync(`"${NODE}" index.js add "Keep me"`, { cwd: __dirname });
  execSync(`"${NODE}" index.js delete 1`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos.length === 1, 'Should have 1 todo left');
  assert(todos[0].text === 'Keep me', 'Remaining todo should be correct');
});

test('delete command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    execSync(`"${NODE}" index.js delete 999`, { cwd: __dirname, stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

cleanState();

// --- Edit command tests ---

test('edit command updates todo text', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "Original text"`, { cwd: __dirname });
  execSync(`"${NODE}" index.js edit 1 "Updated text"`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos[0].text === 'Updated text', 'Text should be updated');
  assert(todos[0].id === 1, 'ID should remain the same');
});

test('edit command preserves done status', () => {
  cleanState();
  execSync(`"${NODE}" index.js add "Task"`, { cwd: __dirname });
  execSync(`"${NODE}" index.js done 1`, { cwd: __dirname });
  execSync(`"${NODE}" index.js edit 1 "Edited task"`, { cwd: __dirname });
  const todos = readTodos();
  assert(todos[0].text === 'Edited task', 'Text should be updated');
  assert(todos[0].done === true, 'Done status should be preserved');
});

test('edit command fails with invalid ID', () => {
  cleanState();
  let threw = false;
  try {
    execSync(`"${NODE}" index.js edit 999 "New text"`, { cwd: __dirname, stdio: 'pipe' });
  } catch (error) {
    threw = true;
  }
  assert(threw, 'Should fail with non-existent ID');
});

cleanState();

// --- Help message tests ---

test('no arguments shows help with all commands', () => {
  let output = '';
  try {
    execSync(`"${NODE}" index.js`, { cwd: __dirname, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    output = error.stdout || '';
  }
  assert(output.includes('TODO CLI'), 'Should show app title');
  assert(output.includes('add'), 'Should list add command');
  assert(output.includes('list'), 'Should list list command');
  assert(output.includes('done'), 'Should list done command');
  assert(output.includes('delete'), 'Should list delete command');
  assert(output.includes('edit'), 'Should list edit command');
});

test('unknown command shows help message', () => {
  let output = '';
  try {
    execSync(`"${NODE}" index.js foobar`, { cwd: __dirname, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    output = error.stdout + (error.stderr || '');
  }
  assert(output.includes('Unknown command: foobar'), 'Should show unknown command error');
  assert(output.includes('TODO CLI'), 'Should show help text');
});

cleanState();

console.log(`\n${passedTests}/${totalTests} tests passed`);

process.exit(passedTests === totalTests ? 0 : 1);
