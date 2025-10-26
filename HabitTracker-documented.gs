/**
 * HABIT TRACKER - Google Sheets Apps Script
 *
 * This script provides a daily habit tracking system in Google Sheets.
 *
 * FEATURES:
 * - Custom menu for easy access to reset function
 * - Daily checkbox tracking for habits
 * - Automatic data saving to historical log
 * - Visual highlighting of neglected habits (7+ days missed in red)
 * - Web app endpoint for automated resets
 *
 * REQUIRED SHEETS:
 * 1. "Tracker" - Daily habit tracking interface with checkboxes
 * 2. "Data" - Historical data log (auto-populated)
 *
 * See SPREADSHEET_TEMPLATE.md for detailed setup instructions.
 */

/**
 * Creates a custom menu in the Google Sheets UI when the spreadsheet is opened.
 * This menu provides easy access to the reset function.
 *
 * This function runs automatically when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addToUi();
}

/**
 * Resets all habit checkboxes for a new day.
 *
 * WORKFLOW:
 * 1. Saves today's completed habits to the Data sheet
 * 2. Highlights habits that have been missed 7+ days in a row (in red)
 * 3. Unchecks all checkboxes in the Tracker sheet
 *
 * This prepares your tracker for the next day while preserving historical data.
 *
 * USAGE:
 * - Click "Habit Tracker" menu > "Reset for Tomorrow"
 * - Or call this function programmatically/via triggers
 */
function resetDaily() {
  // Save today's data before resetting
  saveData();

  // Highlight neglected habits (7+ days missed in a row)
  highlightNeglectedHabits();

  // Reset checkboxes in the Tracker sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');

  // Uncheck all checkboxes in column C (rows 2-100)
  // Adjust range if you have more than 99 habits
  var range = sheet.getRange("C2:C100");
  range.uncheck();
}

/**
 * Saves current habit completion data to the Data sheet.
 *
 * PROCESS:
 * 1. Gets current date
 * 2. Reads habit names from Tracker sheet (column B)
 * 3. Reads checkbox states from Tracker sheet (column C)
 * 4. Creates new row in Data sheet with date and completion status
 * 5. Updates Data sheet headers with habit names
 *
 * DATA FORMAT:
 * - Each row represents one day
 * - Column A: Date (e.g., "Mon Jan 01 2024")
 * - Columns B+: "Yes" if habit completed, "No" if not
 *
 * This function is called automatically by resetDaily().
 */
function saveData() {
  // Get today's date in readable format (e.g., "Mon Jan 01 2024")
  var today = new Date().toDateString();

  // Get references to both sheets
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');

  // Read habit names from column B (rows 2-100)
  // This range should match the checkbox range in resetDaily()
  var habits = trackerSheet.getRange("B2:B100").getValues();

  // Read checkbox states from column C (rows 2-100)
  // True = checked, False = unchecked
  var checked = trackerSheet.getRange("C2:C100").getValues();

  // Find the next empty row in Data sheet
  var lastRow = dataSheet.getLastRow() + 1;

  // Write today's date in column A
  dataSheet.getRange(lastRow, 1).setValue(today);

  // Loop through all habits and record completion status
  for (var i = 0; i < habits.length; i++) {
    // Only process rows that have a habit name (skip empty rows)
    if (habits[i][0] !== "") {
      // Write "Yes" or "No" based on checkbox state
      // Column index is i+2 because:
      //   - Column A (1) is the date
      //   - Column B (2) is the first habit
      //   - So habit at index i goes in column i+2
      dataSheet.getRange(lastRow, i+2).setValue(checked[i][0] ? "Yes" : "No");

      // Update header row with habit name
      // This ensures habit names stay in sync if you add/rename habits
      dataSheet.getRange(1, i+2).setValue(habits[i][0]);
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
 * RETURNS:
 * HTML page confirming reset with link back to spreadsheet
 */
function doGet() {
  // Reset habits (saves data then unchecks boxes)
  resetDaily();

  // Return success page with link back to spreadsheet
  return HtmlService.createHtmlOutput(
    '<h1>Success!</h1><p>Your habits have been reset for tomorrow.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Return to Spreadsheet</a></p>'
  );
}

/**
 * Highlights habits that have been neglected (missed 7+ days in a row).
 *
 * BEHAVIOR:
 * - Checks the last 7 days of data in the Data sheet
 * - If a habit shows "No" for all 7 days, colors it red in the Tracker sheet
 * - If a habit has at least one "Yes", colors it black (normal)
 * - If there aren't 7 days of data yet, all habits remain black
 *
 * PURPOSE:
 * Provides visual feedback on which habits need attention, helping you
 * identify patterns and stay accountable.
 *
 * This function is called automatically by resetDaily().
 */
function highlightNeglectedHabits() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');

  // Get all habits from tracker sheet (column B, rows 2-100)
  var habits = trackerSheet.getRange("B2:B100").getValues();

  // Get last 7 rows of data (if available)
  var lastDataRow = dataSheet.getLastRow();
  if (lastDataRow < 2) {
    // Not enough data yet (no entries or just headers), reset all colors to black
    trackerSheet.getRange("B2:B100").setFontColor("#000000");
    return;
  }

  // Calculate which rows to check (last 7 days)
  // startRow = last row - 6, but at least row 2
  var startRow = Math.max(2, lastDataRow - 6);
  var numRows = lastDataRow - startRow + 1;

  // Loop through each habit
  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") { // Skip empty rows
      // Column index for this habit in Data sheet
      // habits[0] is in column B (tracker), which maps to column 2 (data)
      var habitColumn = i + 2;

      // Get last 7 days (or fewer) of data for this specific habit
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
      var habitCell = trackerSheet.getRange(i + 2, 2); // Row i+2, Column B
      if (allMissed && numRows >= 7) {
        // 7+ consecutive days missed - highlight in red
        habitCell.setFontColor("#FF0000");
      } else {
        // Habit is being done or not enough data yet - keep black
        habitCell.setFontColor("#000000");
      }
    }
  }
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
