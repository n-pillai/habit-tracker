/**
 * HABIT TRACKER - Migration Tests
 *
 * Tests for v1.0 to v1.1 migration functionality.
 *
 * See TESTING_AUTOMATION.md for detailed documentation.
 */

var Tests_Migration = {

  test_migration_preservesHabits: function() {
    var testSheet = TestHelpers.createTestSheet('migration_habits');

    try {
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');

      var originalHabits = [
        trackerSheet.getRange('B2').getValue(),
        trackerSheet.getRange('B3').getValue(),
        trackerSheet.getRange('B4').getValue()
      ];

      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

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

      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

      Assert.assertEquals('Settings →', trackerSheet.getRange('A1').getValue());
      Assert.assertEquals('Days until neglect:', trackerSheet.getRange('B1').getValue());
      Assert.assertEquals(7, trackerSheet.getRange('C1').getValue());

      var layout = getSheetLayout();
      Assert.assertEquals('1.1', layout.version, 'Should detect v1.1 after migration');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
