function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Habit Tracker')
    .addItem('Reset for Tomorrow', 'resetDaily')
    .addSeparator()
    .addItem('Migrate to v1.1 (One-time)', 'migrateToV1_1')
    .addToUi();
}

function getSheetLayout() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var b1Value = trackerSheet.getRange("B1").getValue();

  if (b1Value === "Days until neglect:") {
    return {
      version: "1.1",
      thresholdCell: "C1",
      headerRow: 3,
      firstHabitRow: 4,
      habitNameRange: "B4:B102",
      checkboxRange: "C4:C102"
    };
  } else {
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

function getNeglectThreshold() {
  var layout = getSheetLayout();

  if (layout.version === "1.1") {
    var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
    var threshold = trackerSheet.getRange(layout.thresholdCell).getValue();

    if (typeof threshold !== "number" || threshold < 1 || threshold > 30) {
      return 7;
    }

    return Math.floor(threshold);
  } else {
    return layout.defaultThreshold;
  }
}

function migrateToV1_1() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var ui = SpreadsheetApp.getUi();

  if (trackerSheet.getRange("B1").getValue() === "Days until neglect:") {
    ui.alert("Already Migrated",
      "Your sheet is already using v1.1 format!",
      ui.ButtonSet.OK);
    return;
  }

  var response = ui.alert(
    "Migrate to v1.1?",
    "This will add a settings row at the top.\n\n" +
    "Your habits and data will be preserved.\n\n" +
    "Continue?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  trackerSheet.insertRowsBefore(1, 2);

  trackerSheet.getRange("A1").setValue("Settings →");
  trackerSheet.getRange("B1").setValue("Days until neglect:");
  trackerSheet.getRange("C1").setValue(7);

  trackerSheet.getRange("A1:C1").setBackground("#FFF2CC");
  trackerSheet.getRange("B1").setFontWeight("bold");
  trackerSheet.getRange("C1").setHorizontalAlignment("center");

  ui.alert("Success!",
    "Migration complete!\n\n" +
    "You can now customize the neglect threshold in cell C1.\n\n" +
    "Default is set to 7 days.",
    ui.ButtonSet.OK);
}

function resetDaily() {
  saveData();
  highlightNeglectedHabits();

  var layout = getSheetLayout();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var range = sheet.getRange(layout.checkboxRange);
  range.uncheck();
}

function saveData() {
  var today = new Date().toDateString();
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  var layout = getSheetLayout();

  var habits = trackerSheet.getRange(layout.habitNameRange).getValues();
  var checked = trackerSheet.getRange(layout.checkboxRange).getValues();

  // Get existing headers from Data sheet
  var lastDataCol = dataSheet.getLastColumn();
  var existingHeaders = {};
  if (lastDataCol > 1) {
    var headerRow = dataSheet.getRange(1, 2, 1, lastDataCol - 1).getValues()[0];
    for (var col = 0; col < headerRow.length; col++) {
      if (headerRow[col]) {
        existingHeaders[headerRow[col]] = col + 2; // Column number (B=2, C=3, etc.)
      }
    }
  }

  var lastRow = dataSheet.getLastRow() + 1;
  dataSheet.getRange(lastRow, 1).setValue(today);

  // Track next available column for new habits
  var nextColumn = lastDataCol + 1;

  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") {
      var habitName = habits[i][0];
      var column;

      // Check if habit already exists in Data sheet
      if (existingHeaders[habitName]) {
        column = existingHeaders[habitName];
      } else {
        // New habit - add to next available column
        column = nextColumn;
        dataSheet.getRange(1, column).setValue(habitName);
        existingHeaders[habitName] = column;
        nextColumn++;
      }

      // Save data in the correct column
      dataSheet.getRange(lastRow, column).setValue(checked[i][0] ? "Yes" : "No");
    }
  }
}

function highlightNeglectedHabits() {
  var trackerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  var layout = getSheetLayout();
  var threshold = getNeglectThreshold();

  var habits = trackerSheet.getRange(layout.habitNameRange).getValues();

  var lastDataRow = dataSheet.getLastRow();
  if (lastDataRow < 2) {
    trackerSheet.getRange(layout.habitNameRange).setFontColor("#000000");
    return;
  }

  // Build map of habit names to Data sheet columns
  var lastDataCol = dataSheet.getLastColumn();
  var habitColumns = {};
  if (lastDataCol > 1) {
    var headerRow = dataSheet.getRange(1, 2, 1, lastDataCol - 1).getValues()[0];
    for (var col = 0; col < headerRow.length; col++) {
      if (headerRow[col]) {
        habitColumns[headerRow[col]] = col + 2;
      }
    }
  }

  var startRow = Math.max(2, lastDataRow - (threshold - 1));
  var numRows = lastDataRow - startRow + 1;

  for (var i = 0; i < habits.length; i++) {
    if (habits[i][0] !== "") {
      var habitName = habits[i][0];
      var habitCell = trackerSheet.getRange(layout.firstHabitRow + i, 2);

      // Find the column for this habit in Data sheet
      if (habitColumns[habitName]) {
        var habitColumn = habitColumns[habitName];
        var habitData = dataSheet.getRange(startRow, habitColumn, numRows, 1).getValues();

        var allMissed = true;
        for (var j = 0; j < habitData.length; j++) {
          if (habitData[j][0] === "Yes") {
            allMissed = false;
            break;
          }
        }

        if (allMissed && numRows >= threshold) {
          habitCell.setFontColor("#FF0000");
        } else {
          habitCell.setFontColor("#000000");
        }
      } else {
        // Habit not in Data sheet yet (new habit with no history)
        habitCell.setFontColor("#000000");
      }
    }
  }
}

function doGet() {
  resetDaily();
  return HtmlService.createHtmlOutput(
    '<h1>Success!</h1><p>Your habits have been reset for tomorrow.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Return to Spreadsheet</a></p>'
  );
}
