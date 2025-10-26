# Habit Tracker Spreadsheet Template

This document describes the structure of the Google Sheets spreadsheet required for the Habit Tracker system.

## Sheet Structure

Your Google Sheets document must contain **two sheets**:

### 1. Tracker Sheet

**Sheet Name:** `Tracker`

This is your daily habit tracking interface.

**Column Structure:**

| Column A | Column B      | Column C |
|----------|---------------|----------|
| (empty)  | Habit Name    | ✓        |
| 1        | Exercise      | ☐        |
| 2        | Read          | ☐        |
| 3        | Meditate      | ☐        |
| 4        | Drink Water   | ☐        |
| 5        | Sleep 8 hours | ☐        |

**Setup Instructions:**

- **Column A (Row numbers):** Optional row numbers for reference (rows 2-100)
- **Column B (Habit Names):** Enter your habit names starting in cell B2
  - B1: "Habit Name" (header)
  - B2-B100: Your habit names
- **Column C (Checkboxes):** Insert checkboxes for tracking completion
  - C1: "✓" or "Done" (header)
  - C2-C100: Checkboxes (Insert > Checkbox in Google Sheets)

**Example Data:**
```
Row 1: [Headers]
  B1: "Habit Name"
  C1: "✓"

Row 2: [First Habit]
  B2: "Exercise"
  C2: [Checkbox - unchecked]

Row 3: [Second Habit]
  B3: "Read"
  C3: [Checkbox - unchecked]

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

## Initial Setup Checklist

1. ✓ Create a new Google Sheets document
2. ✓ Create a sheet named `Tracker`
3. ✓ Add "Habit Name" in cell B1
4. ✓ Add "✓" or "Done" in cell C1
5. ✓ List your habits in column B starting at B2
6. ✓ Insert checkboxes in column C starting at C2 (one for each habit)
7. ✓ Create a sheet named `Data`
8. ✓ Add "Date" in cell A1 of the Data sheet
9. ✓ Add the script (see SETUP.md for instructions)

## Example Template

You can visualize the template as:

**Tracker Sheet:**
```
    A  |       B        |   C
-------|----------------|-------
   1   | Habit Name     |   ✓
   2   | Exercise       |   ☐
   3   | Read           |   ☐
   4   | Meditate       |   ☐
   5   | Drink Water    |   ☐
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
