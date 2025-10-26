/**
 * HABIT TRACKER - Integration Tests
 *
 * Tests for complete workflows and feature integration.
 *
 * See TESTING_AUTOMATION.md for detailed documentation.
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

      trackerSheet.getRange('C4').setValue(true);
      trackerSheet.getRange('C5').setValue(false);
      trackerSheet.getRange('C6').setValue(true);

      saveData();

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

      var layout = getSheetLayout();
      Assert.assertEquals('1.0', layout.version);

      var threshold = getNeglectThreshold();
      Assert.assertEquals(7, threshold, 'Should use default threshold for v1.0');

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
