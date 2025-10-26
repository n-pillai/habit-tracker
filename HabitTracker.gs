function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addToUi();
}

function resetDaily() {
  // Save today's data before resetting
  saveData();
  
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

// This function is required for the web app to work
function doGet() {
  resetDaily();
  return HtmlService.createHtmlOutput(
    '<h1>Success!</h1><p>Your habits have been reset for tomorrow.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Return to Spreadsheet</a></p>'
  );
}