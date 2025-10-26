/**
 * HABIT TRACKER - Threshold Logic Tests
 *
 * Tests for highlighting threshold logic and edge cases.
 *
 * See TESTING_AUTOMATION.md for detailed documentation.
 */

var Tests_Threshold = {

  test_highlighting_exactThreshold: function() {
    var testSheet = TestHelpers.createTestSheet('threshold_exact');

    try {
      TestHelpers.createV1_1Sheet(testSheet);
      testSheet.getSheetByName('Tracker').getRange('C1').setValue(7);

      TestHelpers.addTestData(testSheet, 7, [
        [false, false, false, false, false, false, false],
        [true, true, true, true, true, true, true],
        [true, false, true, false, true, false, true]
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var habit1Color = trackerSheet.getRange('B4').getFontColor();
      var habit2Color = trackerSheet.getRange('B5').getFontColor();
      var habit3Color = trackerSheet.getRange('B6').getFontColor();

      Assert.assertEquals('#ff0000', habit1Color.toLowerCase(), 'Habit1 should be red (7 days missed)');
      Assert.assertEquals('#000000', habit2Color.toLowerCase(), 'Habit2 should be black (all completed)');
      Assert.assertEquals('#000000', habit3Color.toLowerCase(), 'Habit3 should be black (mixed)');

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

      TestHelpers.addTestData(testSheet, 6, [
        [false, false, false, false, false, false],
        [true, true, true, true, true, true]
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var habit1Color = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#000000', habit1Color.toLowerCase(), 'Should be black (only 6 days, threshold is 7)');

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

      TestHelpers.addTestData(testSheet, 10, [
        [false, false, false, false, false, true, false, false, false, false]
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var habit1Color = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#000000', habit1Color.toLowerCase(), 'Should be black (streak broken, only 4 consecutive at end)');

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

      TestHelpers.addTestData(testSheet, 3, [
        [false, false, false]
      ]);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      highlightNeglectedHabits();

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var habit1Color = trackerSheet.getRange('B4').getFontColor();

      Assert.assertEquals('#ff0000', habit1Color.toLowerCase(), 'Should be red with threshold=3 and 3 days missed');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
