/**
 * HABIT TRACKER - Google Sheets Apps Script
 *
 * This script provides a daily habit tracking system in Google Sheets.
 *
 * FEATURES:
 * - Custom menu for easy access to reset function
 * - Daily checkbox tracking for habits
 * - Automatic data saving to historical log
 * - Configurable visual highlighting of neglected habits
 * - One-click migration from v1.0 to v1.1
 * - Backward compatible with v1.0 sheets
 * - Web app endpoint for automated resets
 *
 * REQUIRED SHEETS:
 * 1. "Tracker" - Daily habit tracking interface with checkboxes
 * 2. "Data" - Historical data log (auto-populated)
 *
 * VERSION SUPPORT:
 * - v1.0: Habits start at row 2, default 7-day threshold
 * - v1.1: Settings row at top, configurable threshold (1-30 days)
 *
 * See SPREADSHEET_TEMPLATE.md for detailed setup instructions.
 */

/**
 * Creates a custom menu in the Google Sheets UI when the spreadsheet is opened.
 * This menu provides easy access to the reset and migration functions.
 *
 * This function runs automatically when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addSeparator()
    .addItem('Migrate to v1.1 (One-time)', 'migrateToV1_1')
    .addToUi();
}

/**
 * Detects which sheet layout version is being used.
 *
 * DETECTION METHOD:
 * Checks cell B1 for "Days until neglect:" text to determine version.
 *
 * RETURNS:
 * Object containing layout information:
 * - version: "1.0" or "1.1"
 * - thresholdCell: Where to read the neglect threshold (v1.1 only)
 * - defaultThreshold: Default value for v1.0 sheets
 * - headerRow: Which row contains column headers
 * - firstHabitRow: Which row the first habit starts on
 * - habitNameRange: Range containing habit names
 * - checkboxRange: Range containing checkboxes
 *
 * This enables backward compatibility with v1.0 sheets while
 * supporting new v1.1 features.
 */
function getSheetLayout() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var b1Value = trackerSheet.getRange("B1").getValue();

  if (b1Value === "Days until neglect:") {
    // v1.1 layout: Settings row at top, habits start at row 4
    return {
      version: "1.1",
      thresholdCell: "C1",
      headerRow: 3,
      firstHabitRow: 4,
      habitNameRange: "B4:B102",
      checkboxRange: "C4:C102"
    };
  } else {
    // v1.0 layout: Habits start at row 2, uses default threshold
    return {
      version: "1.0",
      thresholdCell: null,
      defaultThreshold: 7,
      headerRow: 1,
      firstHabitRow: 2,
      habitNameRange: "B2:B100",
      checkboxRange: "C2:C100"
    };
  }
}

/**
 * Reads the configurable neglect threshold from the sheet.
 *
 * BEHAVIOR:
 * - v1.1 sheets: Reads value from cell C1
 * - v1.0 sheets: Returns default value of 7 days
 *
 * VALIDATION:
 * - Must be a number
 * - Must be between 1 and 30
 * - If invalid, defaults to 7
 *
 * RETURNS:
 * Integer representing number of consecutive days before highlighting.
 *
 * EXAMPLES:
 * - Value 3 = habit turns red after 3 days missed
 * - Value 14 = habit turns red after 14 days missed
 */
function getNeglectThreshold() {
  var layout = getSheetLayout();

  if (layout.version === "1.1") {
    var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
    var threshold = trackerSheet.getRange(layout.thresholdCell).getValue();

    // Validate the threshold value
    if (typeof threshold !== "number" || threshold < 1 || threshold > 30) {
      return 7; // Default fallback
    }

    return Math.floor(threshold); // Ensure it's an integer
  } else {
    return layout.defaultThreshold;
  }
}

/**
 * Migrates a v1.0 sheet to v1.1 format.
 *
 * WHAT IT DOES:
 * 1. Checks if already migrated (prevents double-migration)
 * 2. Asks user for confirmation
 * 3. Inserts 2 rows at the top of Tracker sheet
 * 4. Adds settings labels and default threshold value
 * 5. Formats the settings row for visibility
 * 6. Shows success message
 *
 * DATA SAFETY:
 * - All habit names are preserved (shifted down 2 rows)
 * - All checkboxes are preserved (shifted down 2 rows)
 * - Data sheet is not modified
 * - Operation can be undone with Ctrl+Z if done immediately
 *
 * RESULT:
 * - Row 1: Settings row with configurable threshold
 * - Row 2: Blank separator
 * - Row 3: Headers (Habit Name, ✓)
 * - Row 4+: Habits (same as before, just shifted down)
 *
 * USAGE:
 * Click "Habit Tracker" menu → "Migrate to v1.1 (One-time)"
 */
function migrateToV1_1() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var ui = SpreadsheetApp.getUi();

  // Check if already migrated
  if (trackerSheet.getRange("B1").getValue() === "Days until neglect:") {
    ui.alert("Already Migrated",
      "Your sheet is already using v1.1 format!",
      ui.ButtonSet.OK);
    return;
  }

  // Ask for confirmation
  var response = ui.alert(
    "Migrate to v1.1?",
    "This will add a settings row at the top.\n\n" +
    "Your habits and data will be preserved.\n\n" +
    "Continue?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return; // User cancelled
  }

  // Insert 2 rows at the top
  // This shifts all existing content down by 2 rows
  trackerSheet.insertRowsBefore(1, 2);

  // Add settings row content
  trackerSheet.getRange("A1").setValue("Settings →");
  trackerSheet.getRange("B1").setValue("Days until neglect:");
  trackerSheet.getRange("C1").setValue(7); // Default threshold

  // Format settings row for visibility
  trackerSheet.getRange("A1:C1").setBackground("#FFF2CC"); // Light yellow background
  trackerSheet.getRange("B1").setFontWeight("bold"); // Bold label
  trackerSheet.getRange("C1").setHorizontalAlignment("center"); // Center the number

  // Show success message
  ui.alert("Success!",
    "Migration complete!\n\n" +
    "You can now customize the neglect threshold in cell C1.\n\n" +
    "Default is set to 7 days.",
    ui.ButtonSet.OK);
}

/**
 * Resets all habit checkboxes for a new day.
 *
 * WORKFLOW:
 * 1. Saves today's completed habits to the Data sheet
 * 2. Highlights habits that have been missed for the configured threshold
 * 3. Unchecks all checkboxes in the Tracker sheet
 *
 * This prepares your tracker for the next day while preserving historical data.
 *
 * VERSION COMPATIBILITY:
 * Automatically detects and works with both v1.0 and v1.1 layouts.
 *
 * USAGE:
 * - Click "Habit Tracker" menu > "Reset for Tomorrow"
 * - Or call this function programmatically/via triggers
 */
function resetDaily() {
  // Save today's data before resetting
  saveData();

  // Highlight neglected habits based on configured threshold
  highlightNeglectedHabits();

  // Reset checkboxes in the Tracker sheet
  var layout = getSheetLayout();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var range = sheet.getRange(layout.checkboxRange);
  range.uncheck();
}

/**
 * Saves current habit completion data to the Data sheet.
 *
 * PROCESS:
 * 1. Gets current date
 * 2. Reads habit names from Tracker sheet (using layout-appropriate range)
 * 3. Reads checkbox states from Tracker sheet
 * 4. Maps habit names to existing columns in Data sheet (MIGRATION-SAFE)
 * 5. Creates new row in Data sheet with date and completion status
 * 6. Adds new habits to next available columns if needed
 *
 * DATA FORMAT:
 * - Each row represents one day
 * - Column A: Date (e.g., "Mon Jan 01 2024")
 * - Columns B+: "Yes" if habit completed, "No" if not
 *
 * MIGRATION SAFETY:
 * This function matches habits by NAME, not by position. This ensures that
 * after migration (when habits shift from row 2 to row 4), the historical
 * data columns remain correctly aligned with the habit names.
 *
 * VERSION COMPATIBILITY:
 * Uses getSheetLayout() to work with both v1.0 and v1.1 formats.
 *
 * This function is called automatically by resetDaily().
 */
function saveData() {
  // Get today's date in readable format (e.g., "Mon Jan 01 2024")
  var today = new Date().toDateString();

  // Get references to both sheets
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  var layout = getSheetLayout();

  // Read habit names and checkbox states using layout-appropriate ranges
  var habits = trackerSheet.getRange(layout.habitNameRange).getValues();
  var checked = trackerSheet.getRange(layout.checkboxRange).getValues();

  // Get existing headers from Data sheet to match habits by name
  // This prevents column misalignment after migration
  var lastDataCol = dataSheet.getLastColumn();
  var existingHeaders = {};
  if (lastDataCol > 1) {
    // Read all existing habit names from header row (columns B onwards)
    var headerRow = dataSheet.getRange(1, 2, 1, lastDataCol - 1).getValues()[0];
    for (var col = 0; col < headerRow.length; col++) {
      if (headerRow[col]) {
        // Map habit name to column number (B=2, C=3, etc.)
        existingHeaders[headerRow[col]] = col + 2;
      }
    }
  }

  // Find the next empty row in Data sheet
  var lastRow = dataSheet.getLastRow() + 1;

  // Write today's date in column A
  dataSheet.getRange(lastRow, 1).setValue(today);

  // Track next available column for new habits
  var nextColumn = lastDataCol + 1;

  // Loop through all habits and record completion status
  for (var i = 0; i < habits.length; i++) {
    // Only process rows that have a habit name (skip empty rows)
    if (habits[i][0] !== "") {
      var habitName = habits[i][0];
      var column;

      // Check if habit already exists in Data sheet
      if (existingHeaders[habitName]) {
        // Use existing column - this preserves historical data alignment
        column = existingHeaders[habitName];
      } else {
        // New habit - add to next available column
        column = nextColumn;
        dataSheet.getRange(1, column).setValue(habitName);
        existingHeaders[habitName] = column;
        nextColumn++;
      }

      // Save data in the correct column
      // This ensures data always goes to the right habit column,
      // even if habit order changed in Tracker sheet
      dataSheet.getRange(lastRow, column).setValue(checked[i][0] ? "Yes" : "No");
    }
  }
}

/**
 * Highlights habits that have been neglected (missed for threshold days in a row).
 *
 * BEHAVIOR:
 * - Checks the last N days of data (where N = configured threshold)
 * - If a habit shows "No" for all N days, colors it red in the Tracker sheet
 * - If a habit has at least one "Yes", colors it black (normal)
 * - If there aren't enough days of data yet, all habits remain black
 *
 * THRESHOLD:
 * - v1.1 sheets: Reads from cell C1 (user-configurable, 1-30 days)
 * - v1.0 sheets: Uses default of 7 days
 *
 * PURPOSE:
 * Provides visual feedback on which habits need attention, helping you
 * identify patterns and stay accountable.
 *
 * VERSION COMPATIBILITY:
 * Automatically detects layout and uses appropriate ranges and threshold.
 *
 * This function is called automatically by resetDaily().
 */
function highlightNeglectedHabits() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  var layout = getSheetLayout();
  var threshold = getNeglectThreshold();

  // Get all habits from tracker sheet using layout-appropriate range
  var habits = trackerSheet.getRange(layout.habitNameRange).getValues();

  // Get data rows from Data sheet
  var lastDataRow = dataSheet.getLastRow();
  if (lastDataRow < 2) {
    // Not enough data yet (no entries or just headers), reset all colors to black
    trackerSheet.getRange(layout.habitNameRange).setFontColor("#000000");
    return;
  }

  // Build map of habit names to Data sheet columns (MIGRATION-SAFE)
  // This ensures we read from the correct column regardless of habit order in Tracker sheet
  var lastDataCol = dataSheet.getLastColumn();
  var habitColumns = {};
  if (lastDataCol > 1) {
    var headerRow = dataSheet.getRange(1, 2, 1, lastDataCol - 1).getValues()[0];
    for (var col = 0; col < headerRow.length; col++) {
      if (headerRow[col]) {
        // Map habit name → column number (B=2, C=3, etc.)
        habitColumns[headerRow[col]] = col + 2;
      }
    }
  }

  // Calculate which rows to check (last N days, where N = threshold)
  // Example: If threshold is 7 and we have 10 days of data,
  // we check rows 4-10 (the last 7 days)
  var startRow = Math.max(2, lastDataRow - (threshold - 1));
  var numRows = lastDataRow - startRow + 1;

  // Loop through each habit
  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") { // Skip empty rows
      var habitName = habits[i][0];
      var habitCell = trackerSheet.getRange(layout.firstHabitRow + i, 2);

      // Find the column for this habit in Data sheet by NAME (not by position)
      // This is critical for migration compatibility
      if (habitColumns[habitName]) {
        var habitColumn = habitColumns[habitName];

        // Get last N days (or fewer if not enough data yet) for this specific habit
        var habitData = dataSheet.getRange(startRow, habitColumn, numRows, 1).getValues();

        // Check if all entries are "No" (habit was missed every day)
        var allMissed = true;
        for (var j = 0; j < habitData.length; j++) {
          if (habitData[j][0] === "Yes") {
            allMissed = false;
            break; // Found at least one "Yes", stop checking
          }
        }

        // Apply color formatting to the habit name in Tracker sheet
        if (allMissed && numRows >= threshold) {
          // N+ consecutive days missed - highlight in red
          habitCell.setFontColor("#FF0000");
        } else {
          // Habit is being done or not enough data yet - keep black
          habitCell.setFontColor("#000000");
        }
      } else {
        // Habit not in Data sheet yet (new habit with no history)
        // Keep it black (not neglected, just new)
        habitCell.setFontColor("#000000");
      }
    }
  }
}

/**
 * Web app endpoint for external triggers.
 *
 * USAGE:
 * This allows you to reset habits via a URL (useful for automation).
 *
 * SETUP:
 * 1. Deploy as Web App: Extensions > Apps Script > Deploy > New deployment
 * 2. Choose "Web app" type
 * 3. Set "Execute as" to your account
 * 4. Set "Who has access" to "Anyone" or "Anyone with Google account"
 * 5. Copy the web app URL
 *
 * ACCESSING:
 * - Visit the web app URL in a browser to trigger the reset
 * - Can be called by external services (IFTTT, Zapier, cron jobs, etc.)
 *
 * VERSION COMPATIBILITY:
 * Works with both v1.0 and v1.1 sheets.
 *
 * RETURNS:
 * HTML page confirming reset with link back to spreadsheet
 */
function doGet() {
  // Reset habits (saves data, highlights, then unchecks boxes)
  resetDaily();

  // Return success page with link back to spreadsheet
  return HtmlService.createHtmlOutput(
    '<h1>Success!</h1><p>Your habits have been reset for tomorrow.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Return to Spreadsheet</a></p>'
  );
}

/**
 * OPTIONAL: Time-based trigger for automatic daily reset
 *
 * You can set up a time-based trigger to automatically reset habits daily:
 *
 * 1. Open Apps Script editor
 * 2. Click clock icon (Triggers) in left sidebar
 * 3. Click "+ Add Trigger"
 * 4. Configure:
 *    - Function: resetDaily
 *    - Event source: Time-driven
 *    - Type: Day timer
 *    - Time of day: Choose your preferred time (e.g., midnight or early morning)
 * 5. Save
 *
 * This will automatically save your data and reset checkboxes each day.
 */
