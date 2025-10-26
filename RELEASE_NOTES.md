# Release Notes

## v1.1.0 - Configurable Threshold Release

**Release Date:** October 26, 2025

### 🎉 What's New

#### Configurable Neglect Threshold

You can now customize how many days a habit can be missed before it's highlighted in red!

- **Default:** 7 days (same behavior as v1.0)
- **Range:** 1-30 days
- **Location:** Cell C1 in Tracker sheet
- **Examples:**
  - Set to `3` for strict daily habit tracking
  - Set to `14` for lenient weekly habit tracking

#### One-Click Migration

Existing v1.0 users can easily upgrade:
- New menu option: **"Habit Tracker" → "Migrate to v1.1 (One-time)"**
- Preserves all habits, checkboxes, and historical data
- Takes ~2 seconds
- Can't accidentally run twice (detects if already migrated)

#### Backward Compatibility

The v1.1 script automatically detects your sheet layout:
- ✅ Works with v1.0 sheets (uses default 7-day threshold)
- ✅ Works with v1.1 sheets (reads your custom threshold)
- No forced upgrade required!

### 📋 Migration Instructions

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed instructions.

**Quick version:**
1. Update your script to v1.1
2. Click **Habit Tracker** → **Migrate to v1.1**
3. Done!

### 🔧 Technical Changes

- Added `migrateToV1_1()` function for one-click migration
- Added `getSheetLayout()` for automatic version detection
- Added `getNeglectThreshold()` to read and validate threshold
- Updated `highlightNeglectedHabits()` to use dynamic threshold
- Updated `resetDaily()`, `saveData()` to use dynamic ranges
- Updated all documentation for v1.1 structure

### 📚 Documentation Updates

- **NEW:** [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Complete upgrade guide
- **UPDATED:** [SETUP.md](SETUP.md) - Now includes v1.1 setup steps
- **UPDATED:** [SPREADSHEET_TEMPLATE.md](SPREADSHEET_TEMPLATE.md) - v1.1 structure
- **UPDATED:** [README.md](README.md) - Updated features and quick start
- **UPDATED:** Both script files with new functions and documentation

### ⚠️ Breaking Changes

**None!** The script is fully backward compatible with v1.0 sheets.

If you choose to migrate, the only change is:
- Settings row added at top (rows 1-2)
- Habits shift down by 2 rows (from row 2 to row 4)
- All data preserved

### 🐛 Bug Fixes

None in this release.

### 🔮 Coming Soon

- Custom color options for neglected habits
- Multiple threshold levels (warning vs critical)
- Streak tracking

---

## v1.0.0 - Initial Release

**Release Date:** October 26, 2025

This is the first public release of the Habit Tracker system - a simple, effective habit tracking solution using Google Sheets and Apps Script.

---

## 🎉 What's Included

### Core Functionality
- ✅ Daily habit tracking with checkbox interface
- 📊 Automatic historical data logging
- 🔄 One-click daily reset via custom menu
- 📈 Data persistence for long-term analysis
- ☁️ Cloud-based (runs entirely in Google Sheets)

### Scripts
- **HabitTracker.gs** - Production-ready script (minimal version)
- **HabitTracker-documented.gs** - Fully commented version for learning/customization

### Documentation
- **SETUP.md** - Complete step-by-step setup guide (10-15 minutes)
- **SPREADSHEET_TEMPLATE.md** - Spreadsheet structure reference
- **README.md** - Project overview and quick start
- **CLAUDE.md** - Developer documentation for contributions

---

## 🚀 Getting Started

1. **Read the documentation**: Start with [README.md](README.md)
2. **Follow the setup guide**: [SETUP.md](SETUP.md) has detailed instructions
3. **Copy the script**: Use either `HabitTracker.gs` (minimal) or `HabitTracker-documented.gs` (with comments)
4. **Set up your sheet**: Follow the [SPREADSHEET_TEMPLATE.md](SPREADSHEET_TEMPLATE.md) structure

**Time to set up:** 10-15 minutes
**No coding experience required**

---

## ✨ Key Features

### Easy to Use
- Simple checkbox interface - check off habits as you complete them
- Custom menu integration in Google Sheets
- No complex apps or subscriptions needed

### Automatic Data Management
- Historical data saved automatically before each reset
- All data stored in your Google Drive (private and secure)
- Easy to export and analyze

### Flexible & Customizable
- Track as many habits as you want (default: up to 99, easily expandable)
- Customize the script for your specific needs
- Add your own habits at any time

### Optional Advanced Features
- **Automatic daily reset** via time-based triggers
- **Web app endpoint** for remote resets
- **Integration ready** for IFTTT, Zapier, iOS Shortcuts, etc.

---

## 📋 Requirements

- Google account
- Access to Google Sheets
- No coding experience required (setup guide walks you through everything)

---

## 🐛 Known Issues

None at this time. If you encounter issues, please:
1. Check the [Troubleshooting section in SETUP.md](SETUP.md#troubleshooting)
2. [Open an issue](https://github.com/n-pillai/habit-tracker/issues) on GitHub

---

## 💡 Tips for Success

1. **Start small** - Track 5-10 habits initially
2. **Be specific** - "Exercise for 30 minutes" is better than "Exercise"
3. **Reset consistently** - Try to reset at the same time each day
4. **Review weekly** - Use the Data sheet to identify patterns
5. **Adjust as needed** - Add/remove habits based on what works for you

---

## 📊 What Your Data Looks Like

### Tracker Sheet (Your Daily View)
```
Habit Name       | ✓
-----------------|----
Exercise         | ☑
Read             | ☑
Meditate         | ☐
Drink Water      | ☑
```

### Data Sheet (Automatic History)
```
Date       | Exercise | Read | Meditate | Drink Water
-----------|----------|------|----------|-------------
Mon Jan 01 | Yes      | Yes  | No       | Yes
Tue Jan 02 | Yes      | No   | Yes      | Yes
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Share your experience and feedback

---

## 📄 License

This project is licensed under the GNU General Public License v3.0.

---

## 🙏 Feedback Welcome

This is the initial release, and your feedback is valuable! Please share:
- What's working well
- What's confusing
- What features you'd like to see
- How you're using the system

[Open an issue](https://github.com/n-pillai/habit-tracker/issues) or start a [discussion](https://github.com/n-pillai/habit-tracker/discussions) on GitHub.

---

## 📚 Resources

- **Repository:** https://github.com/n-pillai/habit-tracker
- **Setup Guide:** [SETUP.md](SETUP.md)
- **Template Structure:** [SPREADSHEET_TEMPLATE.md](SPREADSHEET_TEMPLATE.md)
- **Script (Minimal):** [HabitTracker.gs](HabitTracker.gs)
- **Script (Documented):** [HabitTracker-documented.gs](HabitTracker-documented.gs)

---

**Enjoy tracking your habits! 🎯**
