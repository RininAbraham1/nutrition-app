# Nutrition AI App Documentation

## Overview

A **beautiful, single-file Progressive Web App (PWA)** for daily nutrition tracking with an integrated AI nutrition coach.

Users can:
- Log meals throughout the day (Breakfast, Lunch, Dinner, Snacks)
- Track estimated calories and macros (protein, carbs, fat, fiber) in real time
- Monitor daily water intake
- Chat with an AI coach for real-time feedback
- View their nutrition history with a calendar and trend charts
- Set goals: calories, macros, water, and dietary preferences
- Get an AI-generated end-of-day summary
- Track streaks and long-term stats

The entire app is contained in one `index.html` file — no backend required.

---

## Setup Instructions

1. Download the `index.html` file
2. Open it in any modern browser (works offline after first load)
3. Get a free Groq API key from [console.groq.com](https://console.groq.com)
4. Open `index.html` in a text editor and find the `<script>` tag near the bottom
5. Paste your API key into **line 1 of the script block**:

```js
const API_KEY = 'gsk_your_key_here'; // ← PASTE YOUR GROQ API KEY HERE
```

> The line is clearly marked with a comment arrow. It is the very first line inside `<script>`.

---

## Features

### Onboarding Flow
- First-run wizard on app open
- Collect name, daily calorie goal, and dietary preferences
- Step indicator dots with smooth transitions
- Can be re-configured anytime in Profile

### Today Screen
- Meal tagging (General, Breakfast, Lunch, Dinner, Snack)
- Real-time chat with AI nutrition coach
- **Nutrition banner** — circular calorie ring + 4 macro progress bars (protein, carbs, fat, fiber), updates after every logged meal
- **Water tracker** — visual cup grid, tap to log, configurable daily goal
- Start / Conclude day functionality
- API key missing notification card
- Beautiful message UI with typing indicator and fade-in animations

### History Screen
- **Nutrition trend chart** — line chart for the last 14 days, switchable between calories / protein / carbs / fat
- Interactive calendar view with meal dots per day
- Recent days summary cards showing meal counts and calorie totals
- Click any day to view detailed log + macro breakdown + AI summary

### Profile Screen
- **Streak card** — current streak (with flame/bolt/sprout emoji), longest streak, avg kcal/day
- Daily calorie target
- **Water goal** setting (cups per day)
- **Macro targets** — individual gram goals for protein, carbs, fat, fiber (with color-coded dots)
- Dietary preferences (Vegetarian, Vegan, Gluten-free, Dairy-free, Keto, Paleo, Halal, No restrictions)
- Personal stats grid: days logged, days concluded, goals met, success rate
- Name setting

### AI Integration
- Powered by **Groq** (Llama 3.3 70B)
- Profile context injected automatically (name, calorie goal, macros, dietary preferences)
- Two specialized prompts:
  - **Real-time coaching** — warm, actionable feedback with embedded macro estimates
  - **End-of-day summary** — covers wins, improvements, and calorie status
- Macro parsing: AI embeds `MACROS:{...}` JSON in responses; app parses and accumulates totals silently
- Graceful fallback when API key is not set

---

## Tech Stack

- **HTML5 + CSS3** (fully responsive, mobile-first, max-width 480px)
- **Vanilla JavaScript** (no frameworks, no build step)
- **Groq API** (via OpenAI-compatible endpoint)
- **Canvas API** — hand-drawn trend chart with gradient fill
- **localStorage** for all data persistence
- Modern CSS variables with full **dark mode** support
- Tabler Icons (CDN)
- DM Serif Display + DM Sans fonts (Google Fonts)

---

## Data Model

Each day is stored in `localStorage` as `day_YYYY-MM-DD`:

```json
{
  "key": "2025-05-10",
  "date": "2025-05-10T...",
  "status": "concluded",
  "messages": [{ "role": "user", "text": "...", "meal": "lunch" }],
  "history": [{ "role": "user", "content": "..." }],
  "meals": {
    "breakfast": ["oatmeal with berries"],
    "lunch": ["grilled chicken salad"],
    "dinner": ["pasta with tomato sauce"],
    "snack": []
  },
  "nutrition": {
    "calories": 1850,
    "protein": 120,
    "carbs": 210,
    "fat": 52,
    "fiber": 28
  },
  "summary": "AI-generated end-of-day text...",
  "calorieStatus": "met"
}
```

Profile stored as `profile`:

```json
{
  "name": "Alex",
  "calories": 2000,
  "protein": 150,
  "carbs": 200,
  "fat": 65,
  "fiber": 30,
  "diet": ["Vegetarian"],
  "water": 8
}
```

Water stored separately as `water_YYYY-MM-DD` (integer, cups consumed).

---

## Streak Logic

- Counts consecutive days with `status === "concluded"` going back from today or yesterday
- Longest streak computed from all concluded days in localStorage
- Streak card emoji: 🌱 (< 3 days), ⚡ (3–6 days), 🔥 (7+ days)

---

## Nutrition Tracking

Macros are estimated by the AI coach. After each meal-related message, the AI appends:

```
MACROS:{"calories":450,"protein":32,"carbs":48,"fat":14,"fiber":5}
```

The app silently strips this line from the displayed message, parses the values, and accumulates them into the day's `nutrition` object. The nutrition banner updates in real time.

---

## Changelog

### v2.0
- Added onboarding flow (name, calorie goal, dietary preferences)
- Added real-time macro/calorie tracking with ring + bar UI
- Added water tracker with configurable cup goal
- Added individual macro targets (protein, carbs, fat, fiber) in Profile
- Added streak tracking with longest streak + avg kcal/day
- Added nutrition trend chart in History (14-day canvas chart)
- Added macro breakdown in day detail modal
- Added calorie totals on history day cards
- Added name personalization throughout the coaching experience
- Added API key missing notification card on Today screen
- AI system prompt now includes name, calorie goal, macro targets, and dietary preferences
- Conclude Day now passes tracked nutrition to the AI for a more accurate summary

### v1.0
- Initial release: chat-based meal logging, calendar history, profile screen