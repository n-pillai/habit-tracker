/**
 * HABIT TRACKER - Core Functionality Tests
 *
 * Tests for core functions like layout detection and threshold validation.
 *
 * See TESTING_AUTOMATION.md for detailed documentation.
 */

var Tests_Core = {

  test_getSheetLayout_detectsV1_0: function() {
    var testSheet = TestHelpers.createTestSheet('v1_detect');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var layout = getSheetLayout();

      Assert.assertEquals('1.0', layout.version, 'Should detect v1.0 layout');
      Assert.assertEquals(2, layout.firstHabitRow, 'First habit row should be 2');
      Assert.assertEquals('B2:B100', layout.habitNameRange, 'Habit range should be B2:B100');

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

      var invalidValues = [0, -5, 100, 'abc'];

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
