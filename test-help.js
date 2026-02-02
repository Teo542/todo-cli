const { cleanState, test, assert, runCli } = require('./test-helpers');

test('no arguments shows help with all commands', () => {
  let output = '';
  try {
    runCli('', { stdio: 'pipe' });
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
    runCli('foobar', { stdio: 'pipe' });
  } catch (error) {
    output = error.stdout + (error.stderr || '');
  }
  assert(output.includes('Unknown command: foobar'), 'Should show unknown command error');
  assert(output.includes('TODO CLI'), 'Should show help text');
});

cleanState();
