# Migration Guide: v1.0 → v1.1

## What's New in v1.1

🎉 **Configurable Neglect Threshold!**

You can now customize how many days a habit can be missed before it's highlighted in red!

- **v1.0**: Fixed at 7 days
- **v1.1**: Configurable from 1-30 days

## Why Upgrade?

- ✅ Customize the threshold to match your lifestyle
- ✅ Set stricter thresholds (3 days) for important daily habits
- ✅ Set lenient thresholds (14 days) for weekly habits
- ✅ Future-proof your sheet for upcoming features

## Migration Options

### Option 1: Automatic Migration (Recommended) ⭐

**Time Required:** 30 seconds

1. **Update your script** to v1.1:
   - Open your Google Sheet
   - Go to **Extensions** → **Apps Script**
   - Replace your entire script with the new [HabitTracker.gs](HabitTracker.gs)
   - Click **Save** (💾 icon)
   - Close the Apps Script tab

2. **Return to your sheet** and refresh the page (F5)

3. **Click the new menu option**:
   - **Habit Tracker** → **Migrate to v1.1 (One-time)**

4. **Confirm the migration**:
   - Click **Yes** when prompted
   - Wait 2 seconds
   - Click **OK** on the success message

**Done!** Your sheet now has a settings row at the top.

### Option 2: Manual Migration

**Time Required:** 2 minutes

If you prefer to do it manually:

1. **Open your Tracker sheet**

2. **Insert 2 rows at the top**:
   - Right-click row 1
   - Click **Insert 2 rows above**

3. **Add the settings**:
   - Cell A1: `Settings →`
   - Cell B1: `Days until neglect:`
   - Cell C1: `7` (or your preferred number)

4. **Optional - Format for visibility**:
   - Select cells A1:C1
   - Click the background color button
   - Choose a light yellow (#FFF2CC)
   - Bold cell B1

5. **Update your script** to v1.1 (see Option 1, step 1)

**Done!** Your sheet is now v1.1 compatible.

### Option 3: No Migration (Continue with v1.0)

**The script is backward compatible!**

If you don't want to migrate:
1. Update your script to v1.1
2. Keep your old sheet layout
3. It will continue working with a default threshold of 7 days

You won't get the configurable threshold feature, but everything else works.

---

## What Gets Migrated?

### ✅ Preserved

- All habit names (shifted down 2 rows)
- All checkboxes (shifted down 2 rows)
- **All Data sheet history (untouched and correctly aligned)**
- All formatting (colors, fonts, etc.)

> **Note:** In v1.1.1+, we fixed a critical bug where Data sheet columns could become misaligned after migration. The `saveData()` function now matches habits by name (not position), ensuring your historical data columns remain correctly aligned regardless of the sheet layout version.

### ➕ Added

- Row 1: Settings row with threshold configuration
- Row 2: Blank separator for visual clarity
- Default threshold: 7 days (same behavior as v1.0)

### 📊 Layout Comparison

**Before (v1.0):**
```
Row 1: # | Habit Name | ✓
Row 2: 1 | Exercise   | ☐
Row 3: 2 | Read       | ☐
...
```

**After (v1.1):**
```
Row 1: Settings → | Days until neglect: | 7
Row 2: (blank)
Row 3: # | Habit Name | ✓
Row 4: 1 | Exercise   | ☐
Row 5: 2 | Read       | ☐
...
```

---

## Using Your New Settings

### Changing the Threshold

1. Click cell **C1** in your Tracker sheet
2. Enter a number between **1** and **30**
3. Press Enter
4. The new threshold takes effect on your next reset

### Threshold Examples

| Value | Meaning | Best For |
|-------|---------|----------|
| 1 | Highlight after 1 day missed | Critical daily habits |
| 3 | Highlight after 3 days missed | Important dailies |
| 7 | Highlight after 7 days missed | Balanced (default) |
| 14 | Highlight after 14 days missed | Weekly habits |
| 30 | Highlight after 30 days missed | Monthly check-ins |

### Invalid Values

If you enter an invalid value (text, negative, zero, >30), the script defaults to 7 days.

---

## Troubleshooting

### "Already Migrated" Message

**Cause:** Your sheet is already using v1.1 format.

**Solution:** No action needed! You're all set.

### Migration Button Doesn't Appear

**Cause:** Script not updated or page not refreshed.

**Solution:**
1. Verify you updated the script to v1.1
2. Refresh your Google Sheet (F5)
3. Wait 5-10 seconds for the menu to load

### Habits Disappeared

**Cause:** This shouldn't happen, but if it does:

**Solution:**
1. Immediately press **Ctrl+Z** (or Cmd+Z on Mac) to undo
2. Close the sheet without saving
3. Reopen and try Option 2 (Manual Migration) instead

### Checkboxes Lost

**Cause:** Migration copied the cells but not the checkbox format.

**Solution:**
1. Checkboxes should be preserved automatically
2. If lost, select cell C4 (first habit checkbox)
3. Go to **Insert** → **Checkbox**
4. Drag down to copy to all habit rows

### Data Sheet Column Misalignment (Fixed in v1.1.1+)

**Previous Issue (v1.1.0):** In the initial v1.1 release, there was a bug where Data sheet columns could become misaligned after migration, causing headers to be overwritten.

**Status:** **FIXED** in v1.1.1

**If you're on v1.1.0:**
1. Update to v1.1.1+ immediately
2. The fix ensures habit data is matched by name, not position
3. Historical data will be preserved correctly going forward

**If you already experienced corruption:**
1. Restore from Google Sheets version history to before the corruption
2. Update to v1.1.1+ script
3. Re-migrate using the updated script

### Script Errors After Migration

**Error:** "Cannot read property 'version' of null"

**Solution:**
1. Make sure you updated to the full v1.1 script
2. Verify cell B1 contains exactly: `Days until neglect:`
3. Try refreshing the sheet

---

## Testing Your Migration

After migrating, test to ensure everything works:

1. **Check the settings row**:
   - ✓ Row 1 has yellow background
   - ✓ Cell B1 says "Days until neglect:"
   - ✓ Cell C1 has a number (default: 7)

2. **Check your habits**:
   - ✓ All habit names are present (starting at row 4)
   - ✓ All checkboxes work
   - ✓ Headers are in row 3

3. **Test the reset function**:
   - Check a few checkboxes
   - Click **Habit Tracker** → **Reset for Tomorrow**
   - ✓ Checkboxes unchecked
   - ✓ Data sheet has a new row
   - ✓ No errors appeared

4. **Test the threshold**:
   - Change C1 to a different number (e.g., 3)
   - Click **Habit Tracker** → **Reset for Tomorrow**
   - ✓ No errors (threshold will take effect after enough days of data)

---

## Rolling Back (If Needed)

If you want to revert to v1.0:

### Undo Migration Immediately

If you just migrated:
1. Press **Ctrl+Z** (Cmd+Z on Mac) repeatedly until the settings row disappears
2. Your sheet returns to v1.0 layout

### Revert After Closing

If you already closed and saved:
1. **File** → **Version history** → **See version history**
2. Find a version before migration
3. Click **Restore this version**

### Keep v1.1 Script with v1.0 Layout

The script is backward compatible:
1. Keep your v1.0 sheet layout (don't migrate)
2. Use the v1.1 script
3. You'll have the old layout with default 7-day threshold

---

## FAQ

**Q: Will my historical data be affected?**
A: No. The Data sheet is not modified during migration. All your history is safe.

**Q: Can I migrate multiple times?**
A: The script prevents double-migration. If you try, it shows "Already Migrated."

**Q: Do I have to migrate?**
A: No. The v1.1 script works with v1.0 sheets (uses default 7-day threshold).

**Q: Can I change the threshold anytime?**
A: Yes. Just edit cell C1 and the new value takes effect on the next reset.

**Q: What if I delete the settings row by accident?**
A: The script will detect v1.0 layout and use default 7-day threshold. You can re-migrate using the menu option.

**Q: Will this work with my automatic triggers?**
A: Yes. Time-based triggers continue working normally after migration.

**Q: Will my web app still work?**
A: Yes. The web app endpoint works with both v1.0 and v1.1 layouts.

---

## Need Help?

- **Documentation**: See [README.md](README.md) and [SETUP.md](SETUP.md)
- **Issues**: Report at [GitHub Issues](https://github.com/n-pillai/habit-tracker/issues)
- **Questions**: Start a [Discussion](https://github.com/n-pillai/habit-tracker/discussions)

---

## Next Steps After Migration

1. ✅ Test your new threshold setting
2. ✅ Experiment with different values (3, 7, 14 days)
3. ✅ Share your experience in the GitHub Discussions
4. ✅ Check out the updated [SETUP.md](SETUP.md) for v1.1 features

**Happy tracking! 🎯**
