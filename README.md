# Nutrition AI

A **beautiful, single-file Progressive Web App (PWA)** for daily nutrition tracking with an integrated AI nutrition coach. No backend, no build step, no dependencies — just one `index.html` file.

---

## Quick Start

1. Download `index.html`
2. Open it in any modern browser
3. Get a free Groq API key at [console.groq.com](https://console.groq.com)
4. Open `index.html` in any text editor and find the `<script>` tag near the bottom
5. Paste your key into the **very first line** of the script block:

```js
const API_KEY = 'gsk_your_key_here'; // ← PASTE YOUR GROQ API KEY HERE
```

That's it. No npm, no config files, no server.

---

## How It Works

### Starting a Day
Tap **Start Today** on the Today screen. This creates a fresh log for the current date in `localStorage`. Your chat, meals, macros, and water all save automatically as you go.

### Logging Meals
Select a meal chip (Breakfast, Lunch, Dinner, Snack, or General) then type what you ate in natural language. The AI coach responds with feedback and silently estimates your macros — the nutrition banner updates in real time after every message.

### Concluding a Day
Tap **Conclude Day** at any point to generate an AI end-of-day summary. This saves a snapshot of your totals and summary to history. **It does not lock you out** — you can keep chatting and logging for the rest of the day. Tap **Update Summary** to regenerate it if you eat more later.

### Midnight Rollover
The app automatically reloads at midnight. Since the date has changed, a new blank day starts — no manual action needed. Yesterday's log stays safely in History.

### Resetting / Clearing Data
To wipe all data (useful for testing), open your browser's dev tools console and run:
```js
localStorage.clear(); location.reload();
```

---

## Features

### Onboarding
- First-run wizard collects your name, daily calorie goal, and dietary preferences
- Step indicator dots with smooth transitions
- All settings editable anytime in Profile

### Today Screen
- Meal tagging: General, Breakfast, Lunch, Dinner, Snack
- Real-time AI nutrition coach with typing indicator and fade-in animations
- **Nutrition banner** — circular calorie progress ring + 4 macro bars (protein, carbs, fat, fiber), live-updating after each meal message
- **Water tracker** — visual cup grid, tap any cup to toggle, configurable daily goal
- **Conclude Day** — generates AI summary and saves snapshot; chat stays open all day
- **Update Summary** — re-run the AI summary after concluding if you log more
- API key missing notification card with setup instructions
- Automatic midnight reset to a fresh day

### History Screen
- **14-day nutrition trend chart** — hand-drawn canvas line chart with gradient fill and goal line, switchable between calories / protein / carbs / fat
- Interactive monthly calendar with colored meal dots per day
- Recent days list showing meal counts, calorie totals, and goal status badges
- Tap any day to open a detail sheet: macro breakdown, meal lists by category, and AI summary

### Profile Screen
- **Streak card** — current day streak, longest streak ever, and average kcal/day across concluded days
  - Emoji scales with streak: 🌱 (1–2 days) → ⚡ (3–6 days) → 🔥 (7+ days)
- Daily calorie target
- Daily water goal (cups)
- **Macro targets** — individual gram goals for protein, carbs, fat, and fiber with color-coded dots
- Dietary preferences: Vegetarian, Vegan, Gluten-free, Dairy-free, Keto, Paleo, Halal, No restrictions
- Stats grid: days logged, days concluded, goals met, success rate
- Name (used by AI coach throughout the experience)

### AI Integration
- Powered by **Groq** — Llama 3.3 70B via OpenAI-compatible endpoint
- Every message automatically includes your name, calorie goal, macro targets, and dietary preferences as context
- **Real-time coaching prompt** — warm, 3–5 sentence feedback per meal with embedded macro estimates
- **End-of-day summary prompt** — covers overall intake, wins, areas to improve, and calorie status (met / exceeded / missed)
- Macro parsing: the AI appends `MACROS:{...}` JSON to meal responses; the app strips it from display, parses it, and accumulates daily totals invisibly
- Graceful fallback messaging when API key is absent

---

## Tech Stack

| Layer | Choice |
|---|---|
| Structure | HTML5, single file |
| Styling | CSS3, custom properties, dark mode via `prefers-color-scheme` |
| Logic | Vanilla JavaScript, no frameworks |
| AI | Groq API (Llama 3.3 70B) |
| Charts | Canvas API — hand-drawn, no chart library |
| Storage | `localStorage` |
| Icons | Tabler Icons (CDN) |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Layout | Mobile-first, max-width 480px, `100dvh` |

---

## Data Model

### Day log — `localStorage` key: `day_YYYY-MM-DD`

```json
{
  "key": "2026-05-11",
  "date": "2026-05-11T08:00:00.000Z",
  "status": "concluded",
  "messages": [
    { "role": "user", "text": "oatmeal with berries", "meal": "breakfast" },
    { "role": "ai", "text": "Great start...", "meal": null }
  ],
  "history": [
    { "role": "user", "content": "[breakfast] oatmeal with berries" },
    { "role": "assistant", "content": "Great start..." }
  ],
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
  "summary": "AI-generated end-of-day summary text...",
  "calorieStatus": "met"
}
```

`messages` drives the chat UI. `history` is the raw array sent to the Groq API. They are separate so the UI display text (macro lines stripped) stays clean while the AI gets full context.

### Profile — `localStorage` key: `profile`

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

### Water — `localStorage` key: `water_YYYY-MM-DD`

Integer value representing cups consumed today. Stored separately from the day log so it can be updated without touching the message history.

---

## Streak Logic

Streaks count consecutive days where `status === "concluded"`, walking backwards from today (or yesterday, to account for users who haven't concluded today yet).

- Longest streak is computed independently across all concluded days in storage
- Average kcal/day averages `nutrition.calories` across all concluded days that have nutrition data
- Emoji threshold: **🌱** < 3 · **⚡** 3–6 · **🔥** 7+

---

## Nutrition Tracking

The AI estimates macros from natural language descriptions. After every meal-related response it appends a structured line:

```
MACROS:{"calories":450,"protein":32,"carbs":48,"fat":14,"fiber":5}
```

The app intercepts this with a regex before rendering, strips it from the visible message, parses the JSON, and adds the values to `todayNutrition`. The nutrition banner re-renders immediately. Totals are persisted to `todayLog.nutrition` on every update.

When concluding the day, the actual accumulated nutrition object (not just AI estimates from the conversation) is passed back to the summary prompt, making the end-of-day summary more accurate than a pure conversation re-read.

---

## Changelog

### v2.1
- **Conclude Day is now non-destructive** — saving a summary no longer locks out the chat or disables input
- After concluding, button becomes **Update Summary** so you can regenerate after logging more
- System message after concluding now reads: *"Day summary saved! You can keep logging — your chat resets at midnight."*
- **Midnight auto-reset** — a `setTimeout` fires at exactly 00:00 and reloads the page; the new date produces a new `todayKey` so a fresh day starts automatically
- Restored days (on page reload) now always enable input regardless of concluded status

### v2.0
- Added onboarding flow (name, calorie goal, dietary preferences)
- Added real-time macro/calorie tracking with ring + bar UI
- Added water tracker with configurable cup goal
- Added individual macro targets (protein, carbs, fat, fiber) in Profile
- Added streak tracking with longest streak + avg kcal/day
- Added 14-day nutrition trend chart in History (canvas, no library)
- Added macro breakdown in day detail modal
- Added calorie totals on history day cards
- Added name personalization throughout coaching
- Added API key missing notification card on Today screen
- AI system prompt now injects name, calorie goal, macro targets, and dietary preferences
- Conclude Day passes tracked nutrition totals to the summary prompt

### v1.0
- Initial release: chat-based meal logging, calendar history, profile screen, Groq AI integration