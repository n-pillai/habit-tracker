# Testing Automation for Habit Tracker

## Overview

This document outlines how to automate testing for the Habit Tracker Google Apps Script project.

## What Can Be Automated vs Manual

### ✅ Can Be Automated

1. **Unit Tests**
   - Function input/output validation
   - Threshold calculation logic
   - Layout detection logic
   - Data validation

2. **Integration Tests**
   - Data saving flow
   - Sheet reading/writing
   - Menu creation
   - Migration logic

3. **Regression Tests**
   - Ensure new changes don't break existing features
   - Verify backward compatibility

4. **Data Integrity Tests**
   - Verify data persistence
   - Check data format consistency

### ❌ Difficult/Cannot Be Automated

1. **UI/UX Testing**
   - Menu appearance and usability
   - Visual highlighting (red text)
   - Sheet formatting (colors, fonts)

2. **Authorization Flow**
   - First-time permission prompts
   - OAuth consent screens

3. **Cross-Browser Testing**
   - Different browser rendering
   - Mobile vs desktop experience

4. **End-to-End User Flows**
   - Complete user experience from setup to daily use
   - Documentation accuracy

---

## Testing Framework Options

### Option 1: GasT (Google Apps Script Testing Framework)

**Pros:**
- Purpose-built for Google Apps Script
- Lightweight and simple
- Works within Apps Script environment

**Cons:**
- Limited features
- Not actively maintained
- Basic assertion library

### Option 2: QUnit (Adapted for Apps Script)

**Pros:**
- Well-established framework
- Good documentation
- Rich assertion library

**Cons:**
- Requires adaptation for Apps Script
- More setup complexity

### Option 3: Custom Test Framework (Recommended)

**Pros:**
- Tailored to our specific needs
- No external dependencies
- Full control over features
- Easy to understand and maintain

**Cons:**
- Need to build it ourselves
- Limited to what we implement

---

## Recommended Approach: Custom Test Framework

Build a simple, custom testing framework within Google Apps Script.

### Architecture

```
TestRunner.gs           - Main test runner
TestUtils.gs           - Test helper functions
Tests_Core.gs          - Core functionality tests
Tests_Migration.gs     - Migration tests
Tests_Threshold.gs     - Threshold logic tests
Tests_Integration.gs   - Integration tests
```

---

## Implementation

### 1. Test Runner (TestRunner.gs)

```javascript
/**
 * Main test runner
 * Run all tests from Apps Script editor
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
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  runTests(Tests_Core, results);
  printSummary(results);
}

function runMigrationTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  runTests(Tests_Migration, results);
  printSummary(results);
}

function runThresholdTests() {
  var results = { total: 0, passed: 0, failed: 0, errors: [] };
  runTests(Tests_Threshold, results);
  printSummary(results);
}
```

### 2. Test Utilities (TestUtils.gs)

```javascript
/**
 * Assertion functions
 */
var Assert = {

  assertEquals: function(expected, actual, message) {
    if (expected !== actual) {
      throw new Error(
        (message || 'Assertion failed') +
        '\n  Expected: ' + JSON.stringify(expected) +
        '\n  Actual: ' + JSON.stringify(actual)
      );
    }
  },

  assertTrue: function(condition, message) {
    if (!condition) {
      throw new Error(message || 'Expected true but got false');
    }
  },

  assertFalse: function(condition, message) {
    if (condition) {
      throw new Error(message || 'Expected false but got true');
    }
  },

  assertNotNull: function(value, message) {
    if (value === null || value === undefined) {
      throw new Error(message || 'Expected non-null value');
    }
  },

  assertNull: function(value, message) {
    if (value !== null && value !== undefined) {
      throw new Error(message || 'Expected null value');
    }
  },

  assertThrows: function(func, message) {
    var threw = false;
    try {
      func();
    } catch (e) {
      threw = true;
    }
    if (!threw) {
      throw new Error(message || 'Expected function to throw an error');
    }
  },

  assertArrayEquals: function(expected, actual, message) {
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(
        (message || 'Arrays not equal') +
        '\n  Expected: ' + JSON.stringify(expected) +
        '\n  Actual: ' + JSON.stringify(actual)
      );
    }
  }
};

/**
 * Test helper functions
 */
var TestHelpers = {

  /**
   * Create a test spreadsheet
   */
  createTestSheet: function(name) {
    var sheet = SpreadsheetApp.create('Test_' + name + '_' + new Date().getTime());
    return sheet;
  },

  /**
   * Delete test spreadsheet
   */
  deleteTestSheet: function(sheet) {
    try {
      DriveApp.getFileById(sheet.getId()).setTrashed(true);
    } catch (e) {
      Logger.log('Warning: Could not delete test sheet: ' + e);
    }
  },

  /**
   * Create v1.0 format sheet for testing
   */
  createV1Sheet: function(sheet) {
    var trackerSheet = sheet.getSheetByName('Sheet1') || sheet.insertSheet('Tracker');
    trackerSheet.setName('Tracker');

    // Headers
    trackerSheet.getRange('B1').setValue('Habit Name');
    trackerSheet.getRange('C1').setValue('✓');

    // Sample habits
    trackerSheet.getRange('B2').setValue('Exercise');
    trackerSheet.getRange('B3').setValue('Read');
    trackerSheet.getRange('B4').setValue('Meditate');

    // Checkboxes
    trackerSheet.getRange('C2:C4').insertCheckboxes();

    // Data sheet
    var dataSheet = sheet.insertSheet('Data');
    dataSheet.getRange('A1').setValue('Date');

    return sheet;
  },

  /**
   * Create v1.1 format sheet for testing
   */
  createV1_1Sheet: function(sheet) {
    var trackerSheet = sheet.getSheetByName('Sheet1') || sheet.insertSheet('Tracker');
    trackerSheet.setName('Tracker');

    // Settings row
    trackerSheet.getRange('A1').setValue('Settings →');
    trackerSheet.getRange('B1').setValue('Days until neglect:');
    trackerSheet.getRange('C1').setValue(7);

    // Headers
    trackerSheet.getRange('B3').setValue('Habit Name');
    trackerSheet.getRange('C3').setValue('✓');

    // Sample habits
    trackerSheet.getRange('B4').setValue('Exercise');
    trackerSheet.getRange('B5').setValue('Read');
    trackerSheet.getRange('B6').setValue('Meditate');

    // Checkboxes
    trackerSheet.getRange('C4:C6').insertCheckboxes();

    // Data sheet
    var dataSheet = sheet.insertSheet('Data');
    dataSheet.getRange('A1').setValue('Date');

    return sheet;
  },

  /**
   * Add test data to Data sheet
   */
  addTestData: function(sheet, days, habitData) {
    var dataSheet = sheet.getSheetByName('Data');
    var startRow = 2;

    for (var i = 0; i < days; i++) {
      var date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      dataSheet.getRange(startRow + i, 1).setValue(date.toDateString());

      // Add habit completion data
      for (var h = 0; h < habitData.length; h++) {
        dataSheet.getRange(startRow + i, h + 2).setValue(
          habitData[h][i] ? 'Yes' : 'No'
        );
      }
    }
  }
};
```

### 3. Core Functionality Tests (Tests_Core.gs)

```javascript
/**
 * Tests for core functionality
 */
var Tests_Core = {

  test_getSheetLayout_detectsV1_0: function() {
    var testSheet = TestHelpers.createTestSheet('v1_detect');

    try {
      TestHelpers.createV1Sheet(testSheet);

      // Temporarily bind to test sheet
      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var layout = getSheetLayout();

      Assert.assertEquals('1.0', layout.version, 'Should detect v1.0 layout');
      Assert.assertEquals(2, layout.firstHabitRow, 'First habit row should be 2');
      Assert.assertEquals('B2:B100', layout.habitNameRange, 'Habit range should be B2:B100');

      // Restore
      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_getSheetLayout_detectsV1_1: function() {
    var testSheet = TestHelpers.createTestSheet('v1_1_detect');

    try {
      TestHelpers.createV1_1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var layout = getSheetLayout();

      Assert.assertEquals('1.1', layout.version, 'Should detect v1.1 layout');
      Assert.assertEquals(4, layout.firstHabitRow, 'First habit row should be 4');
      Assert.assertEquals('B4:B102', layout.habitNameRange, 'Habit range should be B4:B102');
      Assert.assertEquals('C1', layout.thresholdCell, 'Threshold cell should be C1');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_getNeglectThreshold_validValue: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_valid');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(14);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var threshold = getNeglectThreshold();

      Assert.assertEquals(14, threshold, 'Should return custom threshold of 14');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_getNeglectThreshold_invalidValue_defaultsTo7: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_invalid');

    try {
      TestHelpers.createV1_1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      // Test invalid values
      var invalidValues = [0, -5, 100, 'abc', null];

      for (var i = 0; i < invalidValues.length; i++) {
        testSheet.getSheetByName('Tracker').getRange('C1').setValue(invalidValues[i]);
        var threshold = getNeglectThreshold();
        Assert.assertEquals(7, threshold, 'Invalid value ' + invalidValues[i] + ' should default to 7');
      }

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_getNeglectThreshold_v1_0_defaultsTo7: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_v1_0');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var threshold = getNeglectThreshold();

      Assert.assertEquals(7, threshold, 'v1.0 sheet should use default threshold of 7');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
```

### 4. Threshold Logic Tests (Tests_Threshold.gs)

```javascript
/**
 * Tests for threshold highlighting logic
 */
var Tests_Threshold = {

  test_highlighting_exactThreshold: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_exact');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(7);

      // Add 7 days of data with Exercise missed all 7 days
      TestHelpers.addTestData(testSheet, 7, [
        [false, false, false, false, false, false, false], // Exercise - all missed
        [true, true, true, true, true, true, true],         // Read - all done
        [true, false, true, false, true, false, true]       // Meditate - mixed
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var exerciseColor = trackerSheet.getRange('B4').getFontColor();
      var readColor = trackerSheet.getRange('B5').getFontColor();
      var meditateColor = trackerSheet.getRange('B6').getFontColor();

      Assert.assertEquals('#ff0000', exerciseColor.toLowerCase(), 'Exercise should be red (7 days missed)');
      Assert.assertEquals('#000000', readColor.toLowerCase(), 'Read should be black (all completed)');
      Assert.assertEquals('#000000', meditateColor.toLowerCase(), 'Meditate should be black (mixed)');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_highlighting_belowThreshold: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_below');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(7);

      // Add 6 days of data with Exercise missed all 6 days (below threshold)
      TestHelpers.addTestData(testSheet, 6, [
        [false, false, false, false, false, false], // Exercise - 6 days missed
        [true, true, true, true, true, true]         // Read - all done
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var exerciseColor = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#000000', exerciseColor.toLowerCase(), 'Exercise should be black (only 6 days, threshold is 7)');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_highlighting_streakBroken: function() {
    var testSheet = TestHelpers.createTestSheet('streak_broken');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(7);

      // Add 10 days: miss 5, complete 1, miss 4 more
      TestHelpers.addTestData(testSheet, 10, [
        [false, false, false, false, false, true, false, false, false, false] // Streak broken at day 6
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var exerciseColor = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#000000', exerciseColor.toLowerCase(), 'Should be black (streak broken, only 4 consecutive at end)');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_highlighting_customThreshold3Days: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_3');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(3);

      // Add 3 days of data with Exercise missed all 3
      TestHelpers.addTestData(testSheet, 3, [
        [false, false, false] // Exercise - 3 days missed
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var exerciseColor = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#ff0000', exerciseColor.toLowerCase(), 'Should be red with threshold=3 and 3 days missed');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
```

### 5. Migration Tests (Tests_Migration.gs)

```javascript
/**
 * Tests for migration functionality
 */
var Tests_Migration = {

  test_migration_preservesHabits: function() {
    var testSheet = TestHelpers.createTestSheet('migration_habits');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');

      // Record original habits
      var originalHabits = [
        trackerSheet.getRange('B2').getValue(),
        trackerSheet.getRange('B3').getValue(),
        trackerSheet.getRange('B4').getValue()
      ];

      // Simulate migration (without UI prompts)
      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

      // Verify habits shifted correctly
      var newHabits = [
        trackerSheet.getRange('B4').getValue(),
        trackerSheet.getRange('B5').getValue(),
        trackerSheet.getRange('B6').getValue()
      ];

      Assert.assertArrayEquals(originalHabits, newHabits, 'Habits should be preserved after migration');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_migration_createsSettingsRow: function() {
    var testSheet = TestHelpers.createTestSheet('migration_settings');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');

      // Simulate migration
      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

      // Verify settings row
      Assert.assertEquals('Settings →', trackerSheet.getRange('A1').getValue());
      Assert.assertEquals('Days until neglect:', trackerSheet.getRange('B1').getValue());
      Assert.assertEquals(7, trackerSheet.getRange('C1').getValue());

      // Verify detection after migration
      var layout = getSheetLayout();
      Assert.assertEquals('1.1', layout.version, 'Should detect v1.1 after migration');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
```

### 6. Integration Tests (Tests_Integration.gs)

```javascript
/**
 * Integration tests - test full workflows
 */
var Tests_Integration = {

  test_fullWorkflow_v1_1_resetAndSave: function() {
    var testSheet = TestHelpers.createTestSheet('workflow_reset');

    try {
      TestHelpers.createV1_1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var dataSheet = testSheet.getSheetByName('Data');

      // Check some habits
      trackerSheet.getRange('C4').setValue(true);  // Exercise - checked
      trackerSheet.getRange('C5').setValue(false); // Read - unchecked
      trackerSheet.getRange('C6').setValue(true);  // Meditate - checked

      // Run saveData
      saveData();

      // Verify data saved
      Assert.assertEquals(2, dataSheet.getLastRow(), 'Should have 2 rows (header + data)');
      Assert.assertEquals('Exercise', dataSheet.getRange(1, 2).getValue(), 'First habit name should be in B1');
      Assert.assertEquals('Yes', dataSheet.getRange(2, 2).getValue(), 'Exercise should be Yes');
      Assert.assertEquals('No', dataSheet.getRange(2, 3).getValue(), 'Read should be No');
      Assert.assertEquals('Yes', dataSheet.getRange(2, 4).getValue(), 'Meditate should be Yes');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_backwardCompatibility_v1_0_withV1_1Script: function() {
    var testSheet = TestHelpers.createTestSheet('backward_compat');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      // Should detect v1.0 and use default threshold
      var layout = getSheetLayout();
      Assert.assertEquals('1.0', layout.version);

      var threshold = getNeglectThreshold();
      Assert.assertEquals(7, threshold, 'Should use default threshold for v1.0');

      // Test that saveData works
      var trackerSheet = testSheet.getSheetByName('Tracker');
      trackerSheet.getRange('C2').setValue(true);

      saveData();

      var dataSheet = testSheet.getSheetByName('Data');
      Assert.assertEquals(2, dataSheet.getLastRow(), 'Data should save with v1.0 layout');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
```

---

## Running the Tests

### Method 1: From Apps Script Editor

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Create new script files (TestRunner.gs, TestUtils.gs, etc.)
4. Paste the code into each file
5. Click **Select function** dropdown > **runAllTests**
6. Click **Run**
7. Check **View** > **Logs** for results

### Method 2: Create Test Menu

Add to your `onOpen()` function:

```javascript
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // Production menu
  ui.createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addSeparator()
    .addItem('Migrate to v1.1 (One-time)', 'migrateToV1_1')
    .addToUi();

  // Test menu (only in test environment)
  if (isTestEnvironment()) {
    ui.createMenu('Tests')
      .addItem('Run All Tests', 'runAllTests')
      .addItem('Run Core Tests', 'runCoreTests')
      .addItem('Run Migration Tests', 'runMigrationTests')
      .addItem('Run Threshold Tests', 'runThresholdTests')
      .addToUi();
  }
}

function isTestEnvironment() {
  // Check if this is a test sheet
  return SpreadsheetApp.getActiveSpreadsheet().getName().indexOf('Test_') === 0;
}
```

### Method 3: Automated with Triggers

Set up a daily trigger to run tests:

1. Apps Script > **Triggers** (clock icon)
2. **Add Trigger**
3. Function: `runAllTests`
4. Event: Time-driven, Day timer
5. Time: Select preferred time

---

## CI/CD Integration (Advanced)

### Using clasp (Command Line Apps Script)

**Setup:**
```bash
npm install -g @google/clasp
clasp login
clasp create --title "Habit Tracker Tests"
clasp push
```

**Run tests from command line:**
```bash
clasp run runAllTests
```

**GitHub Actions Workflow:**

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install clasp
        run: npm install -g @google/clasp

      - name: Authenticate with Google
        env:
          CLASPRC_JSON: ${{ secrets.CLASPRC_JSON }}
        run: echo "$CLASPRC_JSON" > ~/.clasprc.json

      - name: Push to Apps Script
        run: clasp push

      - name: Run tests
        run: clasp run runAllTests
```

---

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage of functions
- **Integration Tests:** All major workflows
- **Regression Tests:** All fixed bugs
- **Edge Cases:** All known edge cases

---

## Limitations

### What Tests Cannot Catch

1. **Visual Issues:**
   - Incorrect font colors (need manual verification)
   - Layout problems
   - Mobile responsiveness

2. **User Experience:**
   - Menu usability
   - Error message clarity
   - Documentation accuracy

3. **Performance:**
   - Large dataset performance (100+ days)
   - Slow network conditions

4. **Authorization:**
   - OAuth flow
   - Permission scopes
   - First-run experience

### Manual Testing Still Required

Even with automation, you should manually test:
- Authorization flow (first time)
- Visual highlighting
- Menu appearance
- Documentation walkthrough
- Migration user experience
- Cross-browser compatibility

---

## Recommended Testing Strategy

### For Each Release:

1. **Run automated tests** (5-10 minutes)
   - Verify all unit tests pass
   - Check integration tests
   - Review test logs

2. **Run critical manual tests** (15-30 minutes)
   - Fresh installation walkthrough
   - Migration from v1.0
   - Visual verification of highlighting
   - Documentation spot-check

3. **Perform exploratory testing** (Optional, 30+ minutes)
   - Try unusual workflows
   - Test edge cases not covered
   - Get user feedback

---

## Maintenance

### Keep Tests Updated

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests pass before committing
3. Update test documentation

### Regular Review

- Monthly: Review and update test suite
- After bugs: Add regression tests
- Before releases: Run full test suite

---

## Benefits of Automated Testing

✅ **Faster feedback** - Know immediately if changes break things
✅ **Confidence** - Deploy with confidence knowing tests pass
✅ **Documentation** - Tests serve as executable documentation
✅ **Regression prevention** - Catch bugs before they reach users
✅ **Refactoring safety** - Change code without fear

---

## Next Steps

1. **Implement test framework** (1-2 hours)
2. **Write core tests** (2-3 hours)
3. **Add to repository** as separate test files
4. **Document testing process** in CONTRIBUTING.md
5. **Run before each release**

---

**Last Updated:** October 26, 2025
