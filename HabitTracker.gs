function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addToUi();
}

function resetDaily() {
  // Save today's data before resetting
  saveData();

  // Highlight neglected habits (7+ days missed in a row)
  highlightNeglectedHabits();

  // Reset checkboxes
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var range = sheet.getRange("C2:C100");
  range.uncheck();
}

function saveData() {
  var today = new Date().toDateString();
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  
  // Get habit names and completion status
  var habits = trackerSheet.getRange("B2:B100").getValues();
  var checked = trackerSheet.getRange("C2:C100").getValues();
  
  // Add today's date to data sheet
  var lastRow = dataSheet.getLastRow() + 1;
  dataSheet.getRange(lastRow, 1).setValue(today);
  
  // Record which habits were completed
  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") {
      dataSheet.getRange(lastRow, i+2).setValue(checked[i][0] ? "Yes" : "No");
      dataSheet.getRange(1, i+2).setValue(habits[i][0]);
    }
  }
}

function highlightNeglectedHabits() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');

  // Get all habits from tracker
  var habits = trackerSheet.getRange("B2:B100").getValues();

  // Get last 7 rows of data (if available)
  var lastDataRow = dataSheet.getLastRow();
  if (lastDataRow < 2) {
    // Not enough data yet, reset all colors to black
    trackerSheet.getRange("B2:B100").setFontColor("#000000");
    return;
  }

  var startRow = Math.max(2, lastDataRow - 6); // Last 7 days
  var numRows = lastDataRow - startRow + 1;

  // Loop through each habit
  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") {
      var habitColumn = i + 2; // Column B is index 0, but data starts at column 2

      // Get last 7 days of data for this habit
      var habitData = dataSheet.getRange(startRow, habitColumn, numRows, 1).getValues();

      // Check if all entries are "No"
      var allMissed = true;
      for (var j = 0; j < habitData.length; j++) {
        if (habitData[j][0] === "Yes") {
          allMissed = false;
          break;
        }
      }

      // Set color based on performance
      var habitCell = trackerSheet.getRange(i + 2, 2); // Row i+2, Column B
      if (allMissed && numRows >= 7) {
        habitCell.setFontColor("#FF0000"); // Red for 7+ days missed
      } else {
        habitCell.setFontColor("#000000"); // Black (normal)
      }
    }
  }
}

// This function is required for the web app to work
function doGet() {
  resetDaily();
  return HtmlService.createHtmlOutput(
    '<h1>Success!</h1><p>Your habits have been reset for tomorrow.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Return to Spreadsheet</a></p>'
  );
}