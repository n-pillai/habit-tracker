# Habit Tracker Tests

This directory contains automated tests for the Habit Tracker Google Apps Script.

## Quick Start

### Running Tests in Apps Script

1. **Create a test Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new blank spreadsheet
   - Name it "Habit Tracker Tests"

2. **Open Apps Script editor**
   - Extensions → Apps Script

3. **Add test files**
   - Delete the default `Code.gs`
   - Create new files for each test file:
     - `TestRunner.gs`
     - `TestUtils.gs`
     - `Tests_Core.gs`
     - `Tests_Threshold.gs`
     - `Tests_Migration.gs`
     - `Tests_Integration.gs`
   - Copy the code from each file in this directory

4. **Add the main script**
   - Also copy `HabitTracker.gs` from the root directory
   - This is needed so tests can call the actual functions

5. **Run tests**
   - Select `runAllTests` from the function dropdown
   - Click Run ▶
   - Check View → Logs for results

## Test Suites

### Tests_Core.gs
Tests core functionality:
- Layout detection (v1.0 vs v1.1)
- Threshold validation
- Invalid input handling

### Tests_Threshold.gs
Tests highlighting logic:
- Exact threshold boundaries
- Below threshold behavior
- Streak breaking
- Custom thresholds (3, 7, 14 days)

### Tests_Migration.gs
Tests migration from v1.0 to v1.1:
- Data preservation
- Settings row creation
- Layout detection after migration

### Tests_Integration.gs
Tests complete workflows:
- Full reset and save flow
- Backward compatibility
- Multi-day scenarios

## Running Specific Test Suites

Instead of `runAllTests()`, you can run:
- `runCoreTests()` - Core functionality only
- `runThresholdTests()` - Threshold logic only
- `runMigrationTests()` - Migration only
- `runIntegrationTests()` - Integration tests only

## Test Output

Example output in logs:

```
=== Starting Test Suite ===

Running: test_getSheetLayout_detectsV1_0
✓ PASS: test_getSheetLayout_detectsV1_0

Running: test_getSheetLayout_detectsV1_1
✓ PASS: test_getSheetLayout_detectsV1_1

Running: test_highlighting_exactThreshold
✓ PASS: test_highlighting_exactThreshold

=== Test Summary ===
Total: 12
Passed: 12
Failed: 0
Pass Rate: 100.00%
Duration: 8.5s
```

## Important Notes

### Test Cleanup

- Tests create temporary spreadsheets
- They are automatically moved to trash after each test
- Check your Google Drive trash if tests fail and leave sheets behind

### Test Isolation

- Each test creates its own spreadsheet
- Tests don't interfere with each other
- Safe to run multiple times

### Limitations

Tests **can** verify:
- ✅ Function logic
- ✅ Data integrity
- ✅ Layout detection
- ✅ Threshold calculations

Tests **cannot** verify:
- ❌ Visual appearance (colors, formatting)
- ❌ Menu UI
- ❌ Authorization flows
- ❌ User experience

Manual testing still required for UI/UX aspects.

## CI/CD Integration

### Using clasp (Command Line)

```bash
# Install clasp
npm install -g @google/clasp

# Login to Google
clasp login

# Create new project
clasp create --title "Habit Tracker Tests"

# Push all files
clasp push

# Run tests from command line
clasp run runAllTests
```

### GitHub Actions

See `.github/workflows/test.yml` (if created) for automated testing on every push.

## Adding New Tests

1. **Choose the right test file**
   - Core functionality → `Tests_Core.gs`
   - Threshold logic → `Tests_Threshold.gs`
   - Migration → `Tests_Migration.gs`
   - Workflows → `Tests_Integration.gs`

2. **Write the test**
   ```javascript
   test_myNewFeature: function() {
     var testSheet = TestHelpers.createTestSheet('my_test');

     try {
       // Setup
       TestHelpers.createV1_1Sheet(testSheet);

       // Test
       var result = myFunction();

       // Assert
       Assert.assertEquals(expected, result);

     } finally {
       TestHelpers.deleteTestSheet(testSheet);
     }
   }
   ```

3. **Run and verify**
   - Run `runAllTests()`
   - Check your test appears in logs
   - Verify pass/fail

## Assertion Functions

Available in `Assert` object:

- `assertEquals(expected, actual, message)`
- `assertTrue(condition, message)`
- `assertFalse(condition, message)`
- `assertNull(value, message)`
- `assertNotNull(value, message)`
- `assertThrows(func, message)`
- `assertArrayEquals(expected, actual, message)`

## Helper Functions

Available in `TestHelpers` object:

- `createTestSheet(name)` - Create temporary test sheet
- `deleteTestSheet(sheet)` - Clean up test sheet
- `createV1Sheet(sheet)` - Set up v1.0 format
- `createV1_1Sheet(sheet)` - Set up v1.1 format
- `addTestData(sheet, days, habitData)` - Add test data to Data sheet

## Troubleshooting

### Tests fail to run

**Problem:** "ReferenceError: getSheetLayout is not defined"

**Solution:** Make sure you copied `HabitTracker.gs` to your test project.

---

### Tests create sheets but don't delete them

**Problem:** Failed tests leave sheets in your Drive

**Solution:**
1. Tests try to trash sheets automatically
2. If they fail, manually delete from Drive trash
3. Check test error logs to find which test failed

---

### Permission errors

**Problem:** "You do not have permission to call SpreadsheetApp.create"

**Solution:**
1. First run must be manual from Apps Script editor
2. Authorize the script when prompted
3. Subsequent runs can be automated

---

### Timeout errors

**Problem:** Tests timeout after 6 minutes

**Solution:**
1. Don't run too many tests at once
2. Run specific test suites instead of all tests
3. Google Apps Script has 6-minute execution limit

## Documentation

For detailed documentation, see:
- `../TESTING_AUTOMATION.md` - Complete testing guide
- `../TESTING_v1.1.0.md` - Manual testing checklist

## Contributing

When adding features to Habit Tracker:
1. Write tests first (TDD)
2. Ensure tests pass
3. Add tests for bug fixes
4. Update this README if needed

---

**Last Updated:** October 26, 2025
