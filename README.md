# FITARC ⚡ Elite Glassmorphic Dark Gold Fitness & Nutrition Web App

> A modern, high-performance web application designed with a luxurious **dark obsidian & 24k gold glassmorphism UI**. Precision-engineered for tracking daily workouts, gym machines, home cooking with exact measurements, calorie flux, daily weight check-ins with snooze reminders, and AI-powered meal photo analysis.

---

## ✨ Flagship Highlights & Core Features

### 1. ⚡ Top Navigation Architecture
- **FITNESS Section**: Elite biomechanics archive in magazine format featuring Gym Machines, Free Weights, Cardio & Walking, Calisthenics, and Mobility.
- **FOOD Section**: Artisan home gastronomy recipe catalog with exact gram measurements, precise calorie and macro breakdowns, and AI photo scanning.
- **OVERVIEW Dashboard**: Daily net caloric flux ($Ingested - Burned = Net$), weight trajectory timeline with interactive spline chart, and consistency streaks.

### 2. 🏋️‍♂️ Precision Fitness & Machine Visual Guides
- **Live Kinematic Form Player**: Procedural vector biomechanics engine running on HTML5 Canvas demonstrating concentric and eccentric repetition cadence in a continuous loop.
- **Active Muscular Glowing Cues**: Target muscles illuminate in vibrant amber/gold during contraction.
- **Dynamic Calorie & Hypertrophy Predictor**:
  - Calibrated directly to the user's daily logged body weight.
  - Computes exact calories burned using Metabolic Equivalent of Task (MET) formulas:
    $$\text{Calories} = \text{MET} \times 3.5 \times \text{Weight (kg)} / 200 \times \text{Minutes}$$
  - Computes mechanical tension and hypertrophy stimulus points ($/100$) broken down per muscle group.
- **One-Click Workout Journaling**: Logs completed sets, reps, duration, and calories with celebration confetti.

### 3. 🍳 Precision Food & AI Meal Photo Scanner
- **Exact Measurements Catalog**: Every recipe features exact gram weights, household measurements (cups, tbsp), macronutrient profiles, and step-by-step culinary instructions.
- **Interactive Portion Scaler**: Adjust servings ($1\times, 2\times, 4\times$) and ingredient weights scale dynamically.
- **AI Vision Meal Photo Scanner**:
  - Upload or take a picture of any meal (or choose instant preset samples).
  - Laser scanline HUD detects dish composition, ingredients, and calories.
  - **Weight-Synced Health Rating**: Evaluates meal quality score ($1.0 - 10.0$ / Gold Standard) tailored against that day's body weight and daily calorie target.
  - **Smart Next-Meal Guidance Task**: Prompts user on how to balance their next meal (*Lean Protein Flush*, *Low-Carb Cellular Recovery*, *Clean Glycogen Refuel*, *Light Gut Rest*) and recommends matching meals!

### 4. ⚖️ Daily Weight Check-In with Snooze Control
- Automated daily prompt when opening the app if weight hasn't been logged today.
- Smooth slider and precise decimal input.
- **Snooze Reminders**: Snooze for 1 Day, 2 Days, 3 Days, or 1 Week.
- Dynamic trend tracking vs previous weigh-in and goal delta.

### 5. 💎 High-End Glassmorphism Dark Gold Aesthetic
- Deep obsidian backdrop (`#08090C`, `#0c0d12`) with frosted glass panels (`backdrop-filter: blur(16px)`).
- Radiant 24k gold gradients (`#fef08a` → `#f59e0b` → `#b45309`).
- Glowing borders, custom sleek scrollbars, and tactile haptic-style animations.
- Ultra fast: 88 kB gzipped total bundle size, loads in milliseconds.

---

## 🚀 Quick Start & Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/fitarc.git
cd fitarc

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Production Build

```bash
npm run build
```

This compiles optimized static assets into the `dist/` directory in under 6 seconds.

---

## 🌐 1-Click Deployment Guide

### Deploy to Vercel
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. The included `vercel.json` automatically configures Vite and SPA routing!
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. The included `netlify.toml` specifies `npm run build` and `dist` publish folder with SPA rewrites.
3. Click **Deploy Site**.

### Deploy to GitHub Pages
1. Push your repository to GitHub (`main` or `master` branch).
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` will automatically build and publish the site!

---

## 🛠 Tech Stack
- **Runtime & Bundler**: Vite 6, Node.js 20+
- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS 3 with custom glassmorphism utilities
- **Icons**: Lucide React
- **Animations & Effects**: HTML5 Canvas Biomechanics Engine, Canvas Confetti
- **Storage**: Offline-First persistent LocalStorage engine with state hydration
