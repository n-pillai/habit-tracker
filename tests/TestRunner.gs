/**
 * HABIT TRACKER - Test Runner
 *
 * Main test framework for running automated tests.
 *
 * USAGE:
 * 1. Copy all test files (tests/*.gs) to your Apps Script project
 * 2. Run runAllTests() from Apps Script editor
 * 3. Check View > Logs for results
 *
 * See TESTING_AUTOMATION.md for detailed instructions.
 */

/**
 * Main test runner - executes all test suites
 */
function runAllTests() {
  var results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
    startTime: new Date()
  };

  Logger.log('=== Starting Test Suite ===\n');

  // Run each test suite
  runTests(Tests_Core, results);
  runTests(Tests_Migration, results);
  runTests(Tests_Threshold, results);
  runTests(Tests_Integration, results);

  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;

  // Print summary
  printSummary(results);

  return results;
}

/**
 * Run tests from a test suite object
 */
function runTests(testSuite, results) {
  for (var testName in testSuite) {
    if (typeof testSuite[testName] === 'function' && testName.startsWith('test_')) {
      results.total++;

      try {
        Logger.log('Running: ' + testName);
        testSuite[testName]();
        results.passed++;
        Logger.log('✓ PASS: ' + testName + '\n');
      } catch (e) {
        results.failed++;
        results.errors.push({
          test: testName,
          error: e.toString(),
          stack: e.stack
        });
        Logger.log('✗ FAIL: ' + testName);
        Logger.log('  Error: ' + e.toString() + '\n');
      }
    }
  }
}

/**
 * Print test summary
 */
function printSummary(results) {
  Logger.log('\n=== Test Summary ===');
  Logger.log('Total: ' + results.total);
  Logger.log('Passed: ' + results.passed);
  Logger.log('Failed: ' + results.failed);
  Logger.log('Pass Rate: ' + ((results.passed / results.total) * 100).toFixed(2) + '%');
  Logger.log('Duration: ' + results.duration + 's');

  if (results.failed > 0) {
    Logger.log('\n=== Failed Tests ===');
    results.errors.forEach(function(err) {
      Logger.log(err.test + ': ' + err.error);
    });
  }
}

/**
 * Run specific test suite
 */
function runCoreTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [], startTime: new Date() };
  runTests(Tests_Core, results);
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;
  printSummary(results);
}

function runMigrationTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [], startTime: new Date() };
  runTests(Tests_Migration, results);
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;
  printSummary(results);
}

function runThresholdTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [], startTime: new Date() };
  runTests(Tests_Threshold, results);
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;
  printSummary(results);
}

function runIntegrationTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [], startTime: new Date() };
  runTests(Tests_Integration, results);
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;
  printSummary(results);
}
