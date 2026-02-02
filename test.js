const { cleanState, getResults } = require('./test-helpers');

console.log('Running tests...\n');

cleanState();

require('./test-storage');
require('./test-commands');
require('./test-help');

const { passedTests, totalTests } = getResults();

console.log(`\n${passedTests}/${totalTests} tests passed`);

process.exit(passedTests === totalTests ? 0 : 1);
