# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a habit tracking system implemented as a Google Sheets spreadsheet with an embedded Google Apps Script. It provides daily habit tracking with automatic data persistence and historical logging.

## System Architecture

### Technology Stack

- **Platform**: Google Sheets + Google Apps Script
- **Language**: JavaScript (Apps Script API)
- **Data Storage**: Google Sheets (two-sheet structure)
- **Deployment**: Runs entirely within Google's infrastructure

### Components

1. **HabitTracker.gs**: Main Apps Script containing all functionality
2. **Tracker Sheet**: User interface with habit names and checkboxes
3. **Data Sheet**: Automated historical log of habit completion

### Key Features

- Custom menu integration (`onOpen()`)
- Daily reset functionality (`resetDaily()`)
- Automatic data persistence (`saveData()`)
- Web app endpoint for remote triggers (`doGet()`)
- Support for up to 99 habits (configurable)

## File Structure

```
habit-tracker/
├── HabitTracker.gs              # Original script (minimal version)
├── HabitTracker-documented.gs   # Fully documented version with comments
├── SETUP.md                     # Complete step-by-step user guide
├── SPREADSHEET_TEMPLATE.md      # Spreadsheet structure documentation
├── CLAUDE.md                    # This file
├── README.md                    # Project overview
└── LICENSE                      # GPL-3.0 license
```

## Working with the Script

### Script Modifications

When modifying `HabitTracker.gs`:

1. **Range adjustments**: The script uses `C2:C100` and `B2:B100` ranges
   - Located in `resetDaily()` and `saveData()` functions
   - Adjust if users need more than 99 habits

2. **Sheet names**: Hardcoded as `'Tracker'` and `'Data'`
   - Change these if using different sheet names
   - Update SPREADSHEET_TEMPLATE.md accordingly

3. **Date format**: Uses `toDateString()` for date formatting
   - Returns format like "Mon Jan 01 2024"
   - Can be changed to ISO format or locale-specific format

### Testing Changes

Since this is a Google Apps Script:

1. No local testing environment available
2. Test directly in Google Sheets Apps Script editor
3. Use `Logger.log()` for debugging (View > Logs in Apps Script)
4. Test with a copy of the spreadsheet to avoid data loss

### Deployment Considerations

- **Script updates**: Users must manually copy updated script to their Apps Script editor
- **Breaking changes**: Clearly document any changes to sheet structure or data format
- **Backward compatibility**: Existing Data sheets contain historical data - preserve format

## Documentation Guidelines

### When updating documentation:

1. **SETUP.md**: Keep step-by-step instructions beginner-friendly
   - Assume no prior Apps Script knowledge
   - Include screenshots descriptions where helpful
   - Update troubleshooting section for common issues

2. **SPREADSHEET_TEMPLATE.md**: Document any structural changes
   - Column changes
   - Additional sheets
   - New data formats

3. **HabitTracker-documented.gs**: Maintain comprehensive inline documentation
   - Explain the "why" not just the "what"
   - Include usage examples in comments
   - Document all function parameters and return values

## Common Modifications

### Adding More Habits Support

Ranges are no longer hardcoded in `resetDaily()`/`saveData()` — they come from
`getSheetLayout()`, which returns the version-appropriate layout. Extend the
ranges there:

```javascript
// In getSheetLayout(), v1.1 branch (rows 4-102 by default):
habitNameRange: "B4:B202",  // Changed from B102 to B202
checkboxRange: "C4:C202"    // Changed from C102 to C202

// v1.0 branch (rows 2-100 by default):
habitNameRange: "B2:B200",
checkboxRange: "C2:C200"
```

### Changing Date Format

Replace in `saveData()`:
```javascript
// Current
var today = new Date().toDateString();

// ISO format (YYYY-MM-DD)
var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
```

### Adding Additional Columns to Tracker

If adding columns between B and C (e.g., category, priority):
- Update all references to column C
- Adjust column indices in `saveData()` loop
- Update SPREADSHEET_TEMPLATE.md

## Project Details

- **License**: GNU General Public License v3.0
- **Repository Type**: Git repository
- **Main Branch**: main
- **Platform**: Google Sheets (cloud-based)

## User Support

Users should refer to:
1. **SETUP.md** - Initial setup and daily usage
2. **SPREADSHEET_TEMPLATE.md** - Spreadsheet structure reference
3. **HabitTracker-documented.gs** - Understanding the code
4. **Troubleshooting section in SETUP.md** - Common issues
