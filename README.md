# Habit Tracker

A simple, effective habit tracking system using Google Sheets and Apps Script.

## Overview

This habit tracker helps you build consistent daily habits by providing:
- ✅ Simple checkbox interface for daily tracking
- 📊 Automatic historical data logging
- 🔴 Visual alerts for neglected habits (7+ days missed)
- 🔄 One-click daily reset
- 📈 Built-in data for progress analysis
- ☁️ Cloud-based (accessible anywhere with Google Sheets)

## Features

- **Easy Setup**: Get started in 10-15 minutes
- **Daily Tracking**: Check off habits as you complete them
- **Automatic Logging**: Historical data saved automatically before reset
- **Configurable Visual Feedback**: Set your own threshold (1-30 days) for highlighting neglected habits in red
- **One-Click Migration**: Easy upgrade from v1.0 to v1.1 with data preservation
- **Backward Compatible**: v1.1 script works with both old and new sheet layouts
- **Custom Menu**: Simple "Reset for Tomorrow" button in Google Sheets
- **Flexible**: Track as many habits as you want
- **Data Export**: All data stored in Google Sheets format (easy to analyze/export)
- **Optional Automation**: Set up automatic daily resets or web app endpoint

## Quick Start

### New Users (v1.1)

1. Create a Google Sheet with two sheets: `Tracker` and `Data`
2. Add a settings row with your preferred threshold (default: 7 days)
3. Add your habits and checkboxes to the Tracker sheet
4. Copy the script from `HabitTracker.gs` into Google Apps Script
5. Use the custom menu to reset daily

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Existing Users (v1.0 → v1.1)

Upgrading? See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for one-click migration!

## Documentation

- **[SETUP.md](SETUP.md)** - Complete step-by-step setup guide with troubleshooting
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Upgrade guide from v1.0 to v1.1
- **[SPREADSHEET_TEMPLATE.md](SPREADSHEET_TEMPLATE.md)** - Spreadsheet structure reference
- **[HabitTracker.gs](HabitTracker.gs)** - The script (minimal version)
- **[HabitTracker-documented.gs](HabitTracker-documented.gs)** - Fully commented version

## How It Works

1. **Track**: Check boxes throughout the day as you complete habits
2. **Reset**: Click "Habit Tracker" → "Reset for Tomorrow" before bed
3. **Notice**: Habits missed 7+ days in a row turn red for easy identification
4. **Review**: The `Data` sheet automatically builds your history
5. **Analyze**: Create charts and analyze your consistency over time

## Example

**Tracker Sheet (Daily Interface):**
```
Habit Name       | ✓
----------------|----
Exercise        | ☑
Read            | ☑
Meditate        | ☐
Drink Water     | ☑
```

**Data Sheet (Automatic History):**
```
Date       | Exercise | Read | Meditate | Drink Water
-----------|----------|------|----------|-------------
Mon Jan 01 | Yes      | Yes  | No       | Yes
Tue Jan 02 | Yes      | No   | Yes      | Yes
```

## Requirements

- Google account
- Google Sheets access
- No coding experience required

## Advanced Features

- **Automatic Daily Reset**: Set up time-based triggers
- **Web App Endpoint**: Trigger resets from other apps/services
- **Integration Ready**: Use with IFTTT, Zapier, iOS Shortcuts, etc.

See [SETUP.md](SETUP.md) for setup instructions.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Support

Having issues? Check the [Troubleshooting section in SETUP.md](SETUP.md#troubleshooting).

## Why This System?

- **Simple**: No complex apps or subscriptions
- **Private**: Your data stays in your Google Drive
- **Flexible**: Customize to your needs
- **Free**: No cost, no ads
- **Reliable**: Runs on Google's infrastructure
