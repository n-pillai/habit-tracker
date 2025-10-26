/**
 * HABIT TRACKER - Test Utilities
 *
 * Provides assertion functions and test helper utilities.
 *
 * See TESTING_AUTOMATION.md for detailed documentation.
 */

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
        // Add habit name to header
        dataSheet.getRange(1, h + 2).setValue('Habit' + (h + 1));
      }
    }
  }
};
