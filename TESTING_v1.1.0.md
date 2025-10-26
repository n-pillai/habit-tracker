# Testing Plan for v1.1.0

## Overview

This document outlines the testing plan for v1.1.0, which introduces configurable neglect threshold and migration functionality.

**Test Date:** October 26, 2025
**Tester:** [Your Name]
**Version:** v1.1.0

---

## Pre-Testing Setup

### Environment Preparation

1. **Create test Google account** (or use dedicated test account)
2. **Prepare test data:**
   - Create at least 5-7 sample habits
   - Have at least 10 days of historical data for thorough testing
3. **Browser:** Test in Chrome (primary) and one other browser
4. **Save backups** of test sheets before destructive tests

---

## Test Suite 1: Fresh v1.1 Installation

**Goal:** Verify new users can set up v1.1 from scratch without issues.

### Test 1.1: Basic Setup

**Steps:**
1. Create new Google Sheet
2. Follow SETUP.md instructions for v1.1
3. Add settings row (A1-C1)
4. Add habits starting at row 4
5. Add checkboxes
6. Create Data sheet
7. Paste v1.1 script

**Expected Results:**
- ✅ Settings row displays correctly with yellow background
- ✅ Cell C1 accepts numeric input
- ✅ Habits start at row 4
- ✅ Script loads without errors
- ✅ "Habit Tracker" menu appears with 2 items

**Pass Criteria:**
- [ ] Sheet structure matches SPREADSHEET_TEMPLATE.md
- [ ] Menu appears after refresh
- [ ] No console errors in Apps Script

---

### Test 1.2: Threshold Configuration

**Steps:**
1. Set C1 to various values: 1, 3, 7, 14, 30
2. Try invalid values: 0, -5, 100, "abc", empty
3. Refresh and check values persist

**Expected Results:**
- ✅ Valid values (1-30) are accepted
- ✅ Invalid values don't crash the script
- ✅ Script defaults to 7 for invalid values
- ✅ Values persist after refresh

**Pass Criteria:**
- [ ] All valid values work correctly
- [ ] Invalid values default to 7 (check console logs if needed)
- [ ] No errors in Apps Script execution logs

---

### Test 1.3: First Reset

**Steps:**
1. Check some habits (3 checked, 2 unchecked)
2. Click "Habit Tracker" → "Reset for Tomorrow"
3. Grant permissions when prompted
4. Check Data sheet

**Expected Results:**
- ✅ Authorization flow completes successfully
- ✅ Checkboxes uncheck
- ✅ Data sheet has new row with today's date
- ✅ "Yes" for checked habits, "No" for unchecked
- ✅ Habit names appear as column headers
- ✅ No habits highlighted in red (not enough data yet)

**Pass Criteria:**
- [ ] Authorization succeeds without errors
- [ ] Data saved correctly
- [ ] Checkboxes reset
- [ ] Habit names match between sheets

---

### Test 1.4: Multi-Day Testing

**Steps:**
1. Simulate 10 days of data:
   - Day 1-3: Complete all habits
   - Day 4-10: Skip habit "Meditate" every day
   - Day 4-10: Complete other habits randomly
2. After day 10, click "Reset for Tomorrow"

**Expected Results:**
- ✅ "Meditate" appears in red (7+ days missed)
- ✅ Other habits remain black
- ✅ Data sheet shows accurate history

**Pass Criteria:**
- [ ] Red highlighting appears correctly after 7 days
- [ ] Only consistently missed habits are red
- [ ] Partial completion doesn't trigger red

---

### Test 1.5: Custom Threshold Testing

**Steps:**
1. Change threshold to 3 in cell C1
2. Create scenario where habit is missed 3 days in a row
3. Click "Reset for Tomorrow"

**Expected Results:**
- ✅ Habit turns red after 3 days missed (not 7)
- ✅ Threshold change takes effect immediately

**Test Variations:**
- Threshold = 1: Should turn red after 1 day missed
- Threshold = 14: Should NOT turn red until 14 days missed

**Pass Criteria:**
- [ ] Threshold of 1 works
- [ ] Threshold of 3 works
- [ ] Threshold of 14 works
- [ ] Color appears at exact threshold, not before/after

---

## Test Suite 2: Migration from v1.0 to v1.1

**Goal:** Verify existing v1.0 users can upgrade safely without data loss.

### Test 2.1: Create v1.0 Test Sheet

**Steps:**
1. Create Google Sheet with v1.0 layout:
   - Row 1: Headers (B1: "Habit Name", C1: "✓")
   - Row 2+: Habits with checkboxes
2. Use v1.0 script (or v1.1 script - should work with both)
3. Generate 5-7 days of historical data
4. Note exact habit names and data

**Expected Results:**
- ✅ v1.0 sheet functions normally
- ✅ Data accumulates in Data sheet
- ✅ Habits work as expected

**Pass Criteria:**
- [ ] v1.0 layout working correctly
- [ ] At least 5 days of data generated
- [ ] Screenshot/notes of data taken

---

### Test 2.2: Backward Compatibility (v1.1 Script with v1.0 Sheet)

**Steps:**
1. Replace v1.0 script with v1.1 script
2. DO NOT run migration yet
3. Refresh the sheet
4. Click "Reset for Tomorrow"
5. Check behavior

**Expected Results:**
- ✅ Menu shows migration option
- ✅ Script still works with v1.0 layout
- ✅ Uses default 7-day threshold
- ✅ Data continues to save correctly
- ✅ Highlighting works with default threshold

**Pass Criteria:**
- [ ] No errors or crashes
- [ ] Backward compatibility confirmed
- [ ] Data integrity maintained

---

### Test 2.3: Migration Execution

**Steps:**
1. Click "Habit Tracker" → "Migrate to v1.1 (One-time)"
2. Click "Yes" to confirm
3. Observe changes

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ 2 rows inserted at top
- ✅ Settings row created (A1-C1)
- ✅ Settings row has yellow background
- ✅ Default threshold = 7
- ✅ All habits shifted down 2 rows
- ✅ All checkboxes preserved and shifted
- ✅ Success message appears
- ✅ Headers now in row 3
- ✅ Habits now start at row 4

**Pass Criteria:**
- [ ] Migration completes without errors
- [ ] Habits: Compare pre/post - all present
- [ ] Checkboxes: All preserved in correct positions
- [ ] Structure matches v1.1 template

---

### Test 2.4: Post-Migration Functionality

**Steps:**
1. Check/uncheck some habits
2. Click "Reset for Tomorrow"
3. Check Data sheet

**Expected Results:**
- ✅ Reset works correctly after migration
- ✅ Data saves to correct columns
- ✅ Historical data remains intact
- ✅ New data appends correctly

**Pass Criteria:**
- [ ] All historical data present and unchanged
- [ ] New data saves correctly
- [ ] Habit names match in Data sheet
- [ ] No column misalignment

---

### Test 2.5: Double Migration Prevention

**Steps:**
1. Click "Habit Tracker" → "Migrate to v1.1" again

**Expected Results:**
- ✅ Alert: "Already Migrated"
- ✅ No changes to sheet
- ✅ No errors

**Pass Criteria:**
- [ ] Cannot accidentally migrate twice
- [ ] Appropriate message shown

---

### Test 2.6: Migration Undo

**Steps:**
1. Immediately after migration, press Ctrl+Z (or Cmd+Z)

**Expected Results:**
- ✅ Sheet reverts to v1.0 layout
- ✅ All data intact
- ✅ Can re-migrate if desired

**Pass Criteria:**
- [ ] Undo works correctly
- [ ] No data loss during undo

---

## Test Suite 3: Edge Cases & Error Handling

### Test 3.1: Empty Habits

**Steps:**
1. Create sheet with gaps in habit list:
   - B4: "Exercise"
   - B5: (empty)
   - B6: "Read"
   - B7: (empty)
   - B8: "Meditate"
2. Run reset multiple times

**Expected Results:**
- ✅ Script skips empty rows
- ✅ Data sheet doesn't have blank columns
- ✅ No errors

**Pass Criteria:**
- [ ] Empty rows handled gracefully
- [ ] No phantom habits in Data sheet

---

### Test 3.2: Maximum Habits (99+)

**Steps:**
1. Add 99 habits (B4-B102)
2. Add checkboxes for all
3. Test reset

**Expected Results:**
- ✅ All 99 habits work
- ✅ Data saves for all habits
- ✅ Performance acceptable

**Note:** If adding 100th habit, script may need range adjustment.

**Pass Criteria:**
- [ ] 99 habits work correctly
- [ ] No performance issues
- [ ] Data sheet has 100 columns (Date + 99 habits)

---

### Test 3.3: Sheet Name Variations

**Steps:**
1. Rename "Tracker" to "tracker" (lowercase)
2. Try to run reset

**Expected Results:**
- ❌ Error: Sheet not found

**Steps:**
1. Rename back to "Tracker" (exact case)
2. Try reset again

**Expected Results:**
- ✅ Works correctly

**Pass Criteria:**
- [ ] Script requires exact sheet names
- [ ] Clear error message if sheets missing

---

### Test 3.4: Missing Data Sheet

**Steps:**
1. Delete "Data" sheet
2. Try reset

**Expected Results:**
- ❌ Error: Sheet not found
- ✅ Tracker sheet unchanged
- ✅ No data loss

**Steps:**
1. Create new "Data" sheet with "Date" header
2. Try reset

**Expected Results:**
- ✅ Works correctly
- ✅ Starts fresh data log

**Pass Criteria:**
- [ ] Graceful error handling
- [ ] Can recover by recreating sheet

---

### Test 3.5: Very Long Habit Names

**Steps:**
1. Add habit with 100+ character name
2. Run reset
3. Check Data sheet header

**Expected Results:**
- ✅ Long name handled correctly
- ✅ Data sheet column wide enough (or truncated appropriately)

**Pass Criteria:**
- [ ] No errors with long names
- [ ] Data saves correctly

---

### Test 3.6: Special Characters in Habit Names

**Steps:**
1. Test habits with: quotes ("), apostrophes ('), ampersands (&), emojis (😊)
2. Run reset
3. Check Data sheet

**Expected Results:**
- ✅ Special characters preserved
- ✅ No encoding issues
- ✅ Data saves correctly

**Pass Criteria:**
- [ ] All special characters work
- [ ] No data corruption

---

## Test Suite 4: Threshold Logic

### Test 4.1: Exact Threshold Boundary

**Steps:**
1. Set threshold to 7
2. Miss habit exactly 6 days in a row
3. Reset and check color (should be black)
4. Miss 1 more day (total 7)
5. Reset and check color (should be red)

**Expected Results:**
- ✅ Black after 6 days
- ✅ Red after exactly 7 days

**Pass Criteria:**
- [ ] Highlighting appears at exact threshold
- [ ] Not one day early or late

---

### Test 4.2: Breaking a Streak

**Steps:**
1. Miss habit 5 days in a row
2. Complete it once
3. Miss 7 more days
4. Check color after final reset

**Expected Results:**
- ✅ Streak resets after completion
- ✅ Red only appears after 7 consecutive days missed
- ✅ Previous partial streak doesn't count

**Pass Criteria:**
- [ ] Only consecutive misses count
- [ ] Single completion resets counter

---

### Test 4.3: Insufficient Data

**Steps:**
1. Fresh sheet with threshold = 7
2. Only 3 days of data exist
3. Miss habit all 3 days
4. Check color

**Expected Results:**
- ✅ Habit remains black (not enough data yet)
- ✅ No errors

**Pass Criteria:**
- [ ] Doesn't highlight until threshold days of data exist

---

## Test Suite 5: Web App Endpoint (Optional)

### Test 5.1: Deploy Web App

**Steps:**
1. Deploy script as web app
2. Set permissions appropriately
3. Copy web app URL

**Expected Results:**
- ✅ Deployment succeeds
- ✅ URL generated

---

### Test 5.2: Trigger via URL

**Steps:**
1. Visit web app URL in browser
2. Check spreadsheet

**Expected Results:**
- ✅ Reset triggered remotely
- ✅ Success page displays
- ✅ Link back to sheet works

**Pass Criteria:**
- [ ] Remote reset works
- [ ] Data saves correctly
- [ ] Highlighting updates

---

## Test Suite 6: Time-Based Trigger (Optional)

### Test 6.1: Set Up Trigger

**Steps:**
1. Apps Script → Triggers
2. Add trigger for `resetDaily`
3. Set to daily at specific time

**Expected Results:**
- ✅ Trigger created successfully

---

### Test 6.2: Trigger Execution

**Steps:**
1. Wait for trigger time (or manually run trigger)
2. Check spreadsheet
3. Check trigger execution logs

**Expected Results:**
- ✅ Reset executed automatically
- ✅ Data saved
- ✅ No errors in logs

**Pass Criteria:**
- [ ] Automatic reset works
- [ ] Execution logs show success

---

## Test Suite 7: Cross-Browser Testing

### Test 7.1: Chrome

**Status:** Primary testing browser

---

### Test 7.2: Firefox

**Steps:**
1. Open sheet in Firefox
2. Test basic operations (reset, migration if applicable)

**Expected Results:**
- ✅ All functions work identically

---

### Test 7.3: Safari (Mac only)

**Steps:**
1. Open sheet in Safari
2. Test basic operations

**Expected Results:**
- ✅ All functions work identically

---

### Test 7.4: Mobile (Chrome/Safari)

**Steps:**
1. Open sheet on mobile device
2. Check a habit
3. Try to use menu

**Expected Results:**
- ✅ Sheet is usable on mobile
- ✅ Menu accessible
- ⚠️ May have UX limitations (Google Sheets mobile)

**Pass Criteria:**
- [ ] Basic functionality works on mobile

---

## Test Suite 8: Performance Testing

### Test 8.1: Large Data Set

**Steps:**
1. Create sheet with 50+ habits
2. Generate 100+ days of data
3. Run reset

**Expected Results:**
- ✅ Reset completes in reasonable time (<10 seconds)
- ✅ No timeout errors
- ✅ All data processes correctly

**Pass Criteria:**
- [ ] Acceptable performance with large datasets

---

## Test Suite 9: Documentation Verification

### Test 9.1: SETUP.md Accuracy

**Steps:**
1. Follow SETUP.md instructions exactly
2. Complete fresh installation
3. Note any discrepancies

**Pass Criteria:**
- [ ] All steps accurate and complete
- [ ] Screenshots/examples match current version
- [ ] No missing steps

---

### Test 9.2: MIGRATION_GUIDE.md Accuracy

**Steps:**
1. Follow migration instructions
2. Try each migration option
3. Verify troubleshooting section

**Pass Criteria:**
- [ ] Migration instructions work
- [ ] Troubleshooting covers common issues
- [ ] Examples are accurate

---

### Test 9.3: SPREADSHEET_TEMPLATE.md Accuracy

**Steps:**
1. Build sheet following template
2. Verify structure matches

**Pass Criteria:**
- [ ] Template matches actual v1.1 structure
- [ ] All cell references correct

---

## Known Issues / Limitations

Document any issues found during testing:

### Issue Template:
```
**Issue #:** [Number]
**Severity:** [Critical / High / Medium / Low]
**Description:** [What went wrong]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Workaround:** [If any]
**Status:** [Open / Fixed / Won't Fix]
```

---

## Testing Sign-Off

### Tester Information

**Name:** ___________________________
**Date:** ___________________________
**Version Tested:** v1.1.0

### Test Results Summary

- Total Tests: _____
- Passed: _____
- Failed: _____
- Blocked: _____
- Pass Rate: _____%

### Critical Issues Found

1. [Issue description]
2. [Issue description]

### Recommendation

[ ] Approved for release
[ ] Approved with known issues (document above)
[ ] Not approved - requires fixes

**Notes:**

---

## Quick Testing Checklist

For rapid verification before release:

### New Installation (v1.1)
- [ ] Fresh setup completes without errors
- [ ] Threshold configuration works
- [ ] First reset successful
- [ ] Data saves correctly
- [ ] Red highlighting appears after threshold days

### Migration (v1.0 → v1.1)
- [ ] Backward compatibility confirmed (v1.1 script + v1.0 sheet)
- [ ] Migration executes successfully
- [ ] All habits preserved
- [ ] All historical data intact
- [ ] Double-migration prevented
- [ ] Post-migration functionality works

### Edge Cases
- [ ] Invalid threshold values handled
- [ ] Empty habit rows skipped
- [ ] Special characters in habits work

### Documentation
- [ ] SETUP.md accurate
- [ ] MIGRATION_GUIDE.md accurate
- [ ] Code comments match functionality

---

## Automated Testing (Future)

Consider implementing:
- Unit tests for threshold validation
- Integration tests for data flow
- Automated migration tests
- Performance benchmarks

---

**Document Version:** 1.0
**Last Updated:** October 26, 2025
