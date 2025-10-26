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
  },

  test_migration_preservesDataSheetColumns: function() {
    var testSheet = TestHelpers.createTestSheet('migration_data_preservation');

    try {
      // Set up v1.0 sheet
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var dataSheet = testSheet.getSheetByName('Data');

      // Add historical data before migration (3 days worth)
      var habitData = [
        ['Yes', 'Yes', 'No'],   // Day 1: Exercise=Yes, Read=Yes, Meditate=No
        ['Yes', 'No', 'Yes'],   // Day 2: Exercise=Yes, Read=No, Meditate=Yes
        ['No', 'Yes', 'Yes']    // Day 3: Exercise=No, Read=Yes, Meditate=Yes
      ];
      TestHelpers.addTestData(testSheet, 3, habitData);

      // Verify pre-migration Data sheet structure
      Assert.assertEquals('Exercise', dataSheet.getRange('B1').getValue(), 'Pre-migration: Exercise should be in column B');
      Assert.assertEquals('Read', dataSheet.getRange('C1').getValue(), 'Pre-migration: Read should be in column C');
      Assert.assertEquals('Meditate', dataSheet.getRange('D1').getValue(), 'Pre-migration: Meditate should be in column D');
      Assert.assertEquals('Yes', dataSheet.getRange('B2').getValue(), 'Pre-migration: Day 1 Exercise data');
      Assert.assertEquals('Yes', dataSheet.getRange('C2').getValue(), 'Pre-migration: Day 1 Read data');
      Assert.assertEquals('No', dataSheet.getRange('D2').getValue(), 'Pre-migration: Day 1 Meditate data');

      // Perform migration (v1.0 → v1.1)
      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

      // Verify migration happened correctly
      var layout = getSheetLayout();
      Assert.assertEquals('1.1', layout.version, 'Should be v1.1 after migration');

      // Check habits for new day (day 4)
      trackerSheet.getRange('C4').setValue(true);  // Exercise checked
      trackerSheet.getRange('C5').setValue(false); // Read unchecked
      trackerSheet.getRange('C6').setValue(true);  // Meditate checked

      // Call saveData() - THIS IS THE CRITICAL TEST
      saveData();

      // Verify Data sheet headers are PRESERVED (not overwritten)
      Assert.assertEquals('Exercise', dataSheet.getRange('B1').getValue(), 'Post-migration: Exercise header should remain in column B');
      Assert.assertEquals('Read', dataSheet.getRange('C1').getValue(), 'Post-migration: Read header should remain in column C');
      Assert.assertEquals('Meditate', dataSheet.getRange('D1').getValue(), 'Post-migration: Meditate header should remain in column D');

      // Verify historical data is PRESERVED
      Assert.assertEquals('Yes', dataSheet.getRange('B2').getValue(), 'Historical data row 2 Exercise should be preserved');
      Assert.assertEquals('Yes', dataSheet.getRange('C2').getValue(), 'Historical data row 2 Read should be preserved');
      Assert.assertEquals('No', dataSheet.getRange('D2').getValue(), 'Historical data row 2 Meditate should be preserved');
      Assert.assertEquals('Yes', dataSheet.getRange('B3').getValue(), 'Historical data row 3 Exercise should be preserved');
      Assert.assertEquals('No', dataSheet.getRange('C3').getValue(), 'Historical data row 3 Read should be preserved');
      Assert.assertEquals('Yes', dataSheet.getRange('D3').getValue(), 'Historical data row 3 Meditate should be preserved');

      // Verify new data (day 4) is written to CORRECT columns
      Assert.assertEquals('Yes', dataSheet.getRange('B5').getValue(), 'Day 4: Exercise should be Yes (checked) in column B');
      Assert.assertEquals('No', dataSheet.getRange('C5').getValue(), 'Day 4: Read should be No (unchecked) in column C');
      Assert.assertEquals('Yes', dataSheet.getRange('D5').getValue(), 'Day 4: Meditate should be Yes (checked) in column D');

      // Verify no extra columns were created
      Assert.assertEquals(4, dataSheet.getLastColumn(), 'Should still have only 4 columns (Date + 3 habits)');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  },

  test_migration_preservesHighlightingLogic: function() {
    var testSheet = TestHelpers.createTestSheet('migration_highlighting');

    try {
      // Set up v1.0 sheet
      TestHelpers.createV1Sheet(testSheet);

      var originalGetActive = SpreadsheetApp.getActiveSpreadsheet;
      SpreadsheetApp.getActiveSpreadsheet = function() { return testSheet; };

      var trackerSheet = testSheet.getSheetByName('Tracker');
      var dataSheet = testSheet.getSheetByName('Data');

      // Add 7 days of data with Exercise always missed, Read always done
      var habitData = [
        ['No', 'Yes', 'Yes'],   // Day 1
        ['No', 'Yes', 'No'],    // Day 2
        ['No', 'Yes', 'Yes'],   // Day 3
        ['No', 'Yes', 'No'],    // Day 4
        ['No', 'Yes', 'Yes'],   // Day 5
        ['No', 'Yes', 'No'],    // Day 6
        ['No', 'Yes', 'Yes']    // Day 7
      ];
      TestHelpers.addTestData(testSheet, 7, habitData);

      // Perform migration (v1.0 → v1.1)
      trackerSheet.insertRowsBefore(1, 2);
      trackerSheet.getRange('A1').setValue('Settings →');
      trackerSheet.getRange('B1').setValue('Days until neglect:');
      trackerSheet.getRange('C1').setValue(7);

      // Call highlightNeglectedHabits() - THIS TESTS THE FIX
      highlightNeglectedHabits();

      // Verify highlighting is based on CORRECT columns in Data sheet
      // Exercise (column B in Data) - all "No" for 7 days → should be RED
      var exerciseCell = trackerSheet.getRange('B4'); // v1.1: habits start at row 4
      Assert.assertEquals('#FF0000', exerciseCell.getFontColorObject().asRgbColor().asHexString().toUpperCase(),
        'Exercise should be red (missed 7 days)');

      // Read (column C in Data) - all "Yes" → should be BLACK
      var readCell = trackerSheet.getRange('B5');
      Assert.assertEquals('#000000', readCell.getFontColorObject().asRgbColor().asHexString().toUpperCase(),
        'Read should be black (done consistently)');

      // Meditate (column D in Data) - mixed → should be BLACK
      var meditateCell = trackerSheet.getRange('B6');
      Assert.assertEquals('#000000', meditateCell.getFontColorObject().asRgbColor().asHexString().toUpperCase(),
        'Meditate should be black (not all missed)');

      SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

    } finally {
      TestHelpers.deleteTestSheet(testSheet);
    }
  }
};
