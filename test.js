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

console.log(`\n${passedTests}/${totalTests} tests passed`);

process.exit(passedTests === totalTests ? 0 : 1);
