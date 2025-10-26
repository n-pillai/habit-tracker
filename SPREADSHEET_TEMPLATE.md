# Habit Tracker Spreadsheet Template

This document describes the structure of the Google Sheets spreadsheet required for the Habit Tracker system.

**Current Version:** v1.1 (includes configurable neglect threshold)

**Upgrading from v1.0?** See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

## Sheet Structure

Your Google Sheets document must contain **two sheets**:

### 1. Tracker Sheet (v1.1)

**Sheet Name:** `Tracker`

This is your daily habit tracking interface.

**Row Structure:**

| Row | Column A    | Column B              | Column C |
|-----|-------------|-----------------------|----------|
| 1   | Settings →  | Days until neglect:   | 7        |
| 2   | (blank)     | (blank)               | (blank)  |
| 3   | #           | Habit Name            | ✓        |
| 4   | 1           | Exercise              | ☐        |
| 5   | 2           | Read                  | ☐        |
| 6   | 3           | Meditate              | ☐        |
| 7   | 4           | Drink Water           | ☐        |
| 8   | 5           | Sleep 8 hours         | ☐        |

**Setup Instructions:**

#### Row 1: Settings Row
- **A1:** `Settings →` (label indicating this is the settings area)
- **B1:** `Days until neglect:` (label for the threshold setting)
- **C1:** `7` (the number of days - **you can customize this from 1-30**)

**What does this number mean?**
- If you set it to `7`, habits missed 7+ consecutive days turn red
- If you set it to `3`, habits missed 3+ consecutive days turn red
- If you set it to `14`, habits missed 14+ consecutive days turn red

**Formatting (optional but recommended):**
- Background color for A1:C1: Light yellow (#FFF2CC)
- Bold text for B1
- Center-align C1

#### Row 2: Blank Separator
- Leave this row empty for visual separation between settings and data

#### Row 3: Headers
- **A3:** `#` or leave empty (optional row numbers)
- **B3:** `Habit Name`
- **C3:** `✓` or `Done`

**Formatting (optional):**
- Bold text for row 3
- Consider freezing rows 1-3 (View > Freeze > 3 rows)

#### Row 4+: Habits
- **Column A:** Optional row numbers (1, 2, 3, ...) starting at A4
- **Column B:** Your habit names starting at B4
  - B4: "Exercise"
  - B5: "Read"
  - B6: "Meditate"
  - ... (continue for all your habits)
- **Column C:** Checkboxes starting at C4
  - Insert > Checkbox in Google Sheets
  - One checkbox per habit

**Range Support:**
- The script supports rows 4-102 (up to 99 habits)
- To add more, modify the script ranges

**Example Data:**
```
Row 1: [Settings]
  A1: "Settings →"
  B1: "Days until neglect:"
  C1: 7

Row 2: [Blank]

Row 3: [Headers]
  A3: "#"
  B3: "Habit Name"
  C3: "✓"

Row 4: [First Habit]
  A4: 1
  B4: "Exercise"
  C4: [Checkbox - unchecked]

Row 5: [Second Habit]
  A5: 2
  B5: "Read"
  C5: [Checkbox - unchecked]

... (continue for all your habits)
```

### 2. Data Sheet

**Sheet Name:** `Data`

This sheet stores historical data automatically when you reset the tracker.

**Column Structure:**

| Date       | Exercise | Read | Meditate | Drink Water | Sleep 8 hours |
|------------|----------|------|----------|-------------|---------------|
| Mon Jan 01 | Yes      | Yes  | No       | Yes         | Yes           |
| Tue Jan 02 | Yes      | No   | Yes      | Yes         | No            |

**Setup Instructions:**

- **Column A:** Date
  - A1: "Date" (header)
  - A2+: Auto-populated by script
- **Columns B onwards:** One column per habit
  - Headers (Row 1) are auto-populated from your Tracker sheet
  - Data rows are auto-populated when you click "Reset for Tomorrow"

**Important Notes:**

- The Data sheet starts empty except for the "Date" header in A1
- The script automatically adds habit names as column headers
- Each time you reset, a new row is added with today's completion data
- Values are "Yes" (completed) or "No" (not completed)

## Initial Setup Checklist (v1.1)

1. ✓ Create a new Google Sheets document
2. ✓ Create a sheet named `Tracker`
3. ✓ Add settings row in row 1:
   - A1: "Settings →"
   - B1: "Days until neglect:"
   - C1: 7 (or your preferred threshold)
4. ✓ Leave row 2 blank
5. ✓ Add headers in row 3:
   - B3: "Habit Name"
   - C3: "✓"
6. ✓ List your habits in column B starting at B4
7. ✓ Insert checkboxes in column C starting at C4 (one for each habit)
8. ✓ Create a sheet named `Data`
9. ✓ Add "Date" in cell A1 of the Data sheet
10. ✓ Add the script (see SETUP.md for instructions)

## Example Template

You can visualize the v1.1 template as:

**Tracker Sheet:**
```
    A         |         B           |   C
--------------|---------------------|-------
   1   Settings → | Days until neglect: |   7
   2            |                     |
   3      #     | Habit Name          |   ✓
   4      1     | Exercise            |   ☐
   5      2     | Read                |   ☐
   6      3     | Meditate            |   ☐
   7      4     | Drink Water         |   ☐
```

**Data Sheet (initially):**
```
    A    |   B   |   C   |   D
---------|-------|-------|-------
   1     | Date  |       |
```

**Data Sheet (after a few days):**
```
    A         |     B      |    C    |     D
--------------|------------|---------|----------
   1          | Date       | Exercise| Read
   2          | Mon Jan 01 | Yes     | Yes
   3          | Tue Jan 02 | Yes     | No
   4          | Wed Jan 03 | No      | Yes
```
