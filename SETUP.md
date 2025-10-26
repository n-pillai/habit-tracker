# Habit Tracker Setup Guide

A step-by-step guide to set up your personal habit tracking system using Google Sheets.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Daily Usage](#daily-usage)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This habit tracker system uses Google Sheets with an embedded Apps Script to:
- Track daily habit completion with checkboxes
- Automatically save historical data
- Reset your tracker each day with a single click
- Build a database of your habit consistency over time

**Time to set up:** 10-15 minutes

---

## Prerequisites

- A Google account
- Access to Google Sheets
- Basic familiarity with Google Sheets

---

## Step-by-Step Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name your spreadsheet (e.g., "My Habit Tracker")

### Step 2: Set Up the Tracker Sheet

This is your daily interface for checking off habits.

1. **Rename the first sheet:**
   - Right-click the sheet tab (bottom left, likely says "Sheet1")
   - Click **Rename**
   - Type: `Tracker`
   - Press Enter

2. **Add headers:**
   - Click cell **B1** and type: `Habit Name`
   - Click cell **C1** and type: `✓` (or "Done")

3. **Add your habits:**
   - Click cell **B2** and type your first habit (e.g., "Exercise")
   - Click cell **B3** and type your second habit (e.g., "Read")
   - Continue adding habits in cells B4, B5, etc.
   - Add as many habits as you want to track

4. **Add checkboxes:**
   - Click cell **C2**
   - Go to **Insert** menu → **Checkbox**
   - A checkbox appears in C2
   - Click cell **C2** and drag down to copy the checkbox to all rows with habits
   - Example: If you have 5 habits (B2-B6), drag the checkbox from C2 to C6

**Your Tracker sheet should now look like this:**

```
    A  |       B        |   C
-------|----------------|-------
   1   | Habit Name     |   ✓
   2   | Exercise       |   ☐
   3   | Read           |   ☐
   4   | Meditate       |   ☐
   5   | Drink Water    |   ☐
```

### Step 3: Set Up the Data Sheet

This sheet will automatically store your historical data.

1. **Create a new sheet:**
   - Click the **+** button at the bottom left (next to the Tracker tab)
   - A new sheet appears (likely named "Sheet2")

2. **Rename the new sheet:**
   - Right-click the new sheet tab
   - Click **Rename**
   - Type: `Data`
   - Press Enter

3. **Add header:**
   - In the Data sheet, click cell **A1**
   - Type: `Date`

**That's it for the Data sheet!** The script will automatically populate the rest.

### Step 4: Add the Script

1. **Open Apps Script editor:**
   - In your Google Sheet, click **Extensions** menu
   - Click **Apps Script**
   - A new tab opens with the Apps Script editor

2. **Replace the default code:**
   - You'll see a function called `myFunction()` with some placeholder code
   - Select **all** the existing code (Ctrl+A or Cmd+A)
   - Delete it

3. **Paste the habit tracker script:**
   - Copy the entire contents of `HabitTracker.gs` from this repository
   - Paste it into the Apps Script editor

4. **Save the script:**
   - Click the **Save** icon (💾) or press Ctrl+S (Cmd+S on Mac)
   - Name your project: `Habit Tracker` (or any name you prefer)
   - Click **OK**

5. **Close the Apps Script tab:**
   - Close the Apps Script browser tab
   - Return to your Google Sheet

### Step 5: Authorize the Script

The first time you use the script, you'll need to authorize it.

1. **Reload your spreadsheet:**
   - Refresh the page (F5 or click the refresh button)
   - Wait a few seconds

2. **You should see a new menu:**
   - Look at the menu bar at the top
   - You should see a new menu called **"Habit Tracker"** between the Help menu and your profile icon

3. **Test the script:**
   - Check a few checkboxes in your Tracker sheet
   - Click **Habit Tracker** menu → **Reset for Tomorrow**

4. **Grant permissions (first time only):**
   - A dialog appears: "Authorization Required"
   - Click **Continue**
   - Select your Google account
   - Click **Advanced** (at the bottom of the warning screen)
   - Click **Go to Habit Tracker (unsafe)** - Don't worry, this is your own script!
   - Click **Allow**

5. **Test again:**
   - Click **Habit Tracker** menu → **Reset for Tomorrow**
   - Your checkboxes should uncheck
   - Check your **Data** sheet - you should see today's date and completion status

**Congratulations! Your habit tracker is now set up!**

---

## Daily Usage

### Morning Routine

1. Open your Google Sheet
2. Look at your list of habits for the day

### Throughout the Day

- Check off habits as you complete them
- You can check/uncheck boxes at any time

### Evening Routine (Before Midnight)

1. Review your completed habits
2. Click **Habit Tracker** menu → **Reset for Tomorrow**
3. This will:
   - Save today's data to the Data sheet
   - Uncheck all boxes for tomorrow

### Viewing Your Progress

1. Go to the **Data** sheet
2. You'll see:
   - Each row is one day
   - Each column is one habit
   - "Yes" means you completed it, "No" means you didn't
3. You can create charts/graphs from this data to visualize your progress

---

## Advanced Features

### Option 1: Automatic Daily Reset

Set up a time-based trigger to automatically reset habits each day:

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Click the **clock icon** (Triggers) in the left sidebar
4. Click **+ Add Trigger** (bottom right)
5. Configure:
   - **Choose which function to run:** `resetDaily`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `Time-driven`
   - **Select type of time based trigger:** `Day timer`
   - **Select time of day:** Choose your preferred time (e.g., "Midnight to 1am" or "11pm to Midnight")
6. Click **Save**
7. Grant permissions if prompted

Now your habits will automatically reset every day at your chosen time!

### Option 2: Web App for Remote Reset

Create a URL you can visit to reset your habits from anywhere:

1. Open **Extensions** → **Apps Script**
2. Click **Deploy** → **New deployment**
3. Click the gear icon ⚙️ → Select **Web app**
4. Configure:
   - **Description:** "Habit Tracker Web App" (or any description)
   - **Execute as:** Me ([your email])
   - **Who has access:** Choose one:
     - "Only myself" (most secure - only you can access)
     - "Anyone" (allows access from automation tools)
5. Click **Deploy**
6. Click **Authorize access** and grant permissions
7. Copy the **Web app URL** (it starts with `https://script.google.com/...`)
8. Save this URL somewhere safe

**To use:**
- Visit the URL in any browser to reset your habits
- You can use this URL with automation tools like IFTTT, Zapier, or iOS Shortcuts
- Example: Create an iOS Shortcut that opens this URL and add it to your home screen

---

## Troubleshooting

### Problem: "Habit Tracker" menu doesn't appear

**Solution:**
1. Refresh the page (F5)
2. Wait 5-10 seconds for the script to load
3. If still not visible, check that the script was saved correctly in Apps Script

### Problem: "resetDaily is not defined" error

**Solution:**
1. Open **Extensions** → **Apps Script**
2. Make sure the entire script from `HabitTracker.gs` is pasted correctly
3. Click Save
4. Refresh your spreadsheet

### Problem: Script stops working after adding/removing habits

**Solution:**
- The script supports up to 99 habits (rows 2-100)
- If you have more than 99 habits, edit the script:
  - In Apps Script, find lines with `"C2:C100"` and `"B2:B100"`
  - Change 100 to a higher number (e.g., 200)
  - Save the script

### Problem: Data sheet shows blank columns

**Solution:**
- This happens when there are empty rows in your Tracker sheet between habits
- Either:
  - Remove empty rows in the Tracker sheet, OR
  - Manually delete the blank columns in the Data sheet

### Problem: Date format looks wrong

**Solution:**
- The date format depends on your Google account's locale settings
- To change it, edit line 19 of the script:
  - Current: `var today = new Date().toDateString();`
  - For ISO format (YYYY-MM-DD): `var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");`

### Problem: Authorization issues or "unsafe" warnings

**Solution:**
- The "unsafe" warning appears because Google doesn't verify personal scripts
- This is your own script, so it's safe to proceed
- Click "Advanced" → "Go to [project name] (unsafe)" → "Allow"

---

## Tips for Success

1. **Keep habits specific:** Instead of "Exercise," try "Exercise for 30 minutes"
2. **Start small:** Don't track too many habits at once (5-10 is a good start)
3. **Review weekly:** Use the Data sheet to see patterns and trends
4. **Adjust as needed:** Add or remove habits based on what works for you
5. **Reset consistently:** Try to reset at the same time each day

---

## Support

For issues, suggestions, or contributions, visit the [GitHub repository](https://github.com/yourusername/habit-tracker).

## License

This project is licensed under the GNU General Public License v3.0.
