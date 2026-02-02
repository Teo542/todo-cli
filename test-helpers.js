const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TODOS_FILE = path.join(__dirname, 'todos.json');
const NODE = process.argv[0];

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

function runCli(args, options = {}) {
  return execSync(`"${NODE}" index.js ${args}`, {
    cwd: __dirname,
    encoding: 'utf8',
    ...options
  });
}

function getResults() {
  return { passedTests, totalTests };
}

module.exports = {
  TODOS_FILE,
  NODE,
  cleanState,
  test,
  readTodos,
  assert,
  runCli,
  getResults
};
