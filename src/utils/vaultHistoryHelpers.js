import { getRelativeDateString } from '../data/athleteVaultDatabase.js';

/**
 * Formats a YYYY-MM-DD calendar date string into a human-friendly relative label.
 */
export function formatHistoryDateLabel(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 'Unknown Date';
  const todayStr = getRelativeDateString(0);
  const yesterdayStr = getRelativeDateString(-1);
  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return dateStr;
  }
  const [year, month, day] = parts;
  const parsed = new Date(year, month - 1, day);
  const weekday = parsed.toLocaleDateString('en-US', { weekday: 'short' });
  const monthLabel = parsed.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday}, ${monthLabel} ${day}`;
}

/**
 * Computes days elapsed relative to today using local calendar midnight.
 */
export function getDaysAgoNumber(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
}

function normalizeWorkoutMatches(workout, query) {
  if (!query) return true;
  const musclesList = workout.primaryMuscles || workout.muscles;
  const muscles = Array.isArray(musclesList) ? musclesList.join(' ') : '';
  const nameText = workout.exerciseName || workout.name || '';
  const haystack = `${nameText} ${workout.category || ''} ${workout.date || ''} ${muscles}`.toLowerCase();
  return haystack.includes(query);
}

function normalizeMealMatches(meal, query) {
  if (!query) return true;
  const titleText = meal.title || meal.name || '';
  const haystack = `${titleText} ${meal.mealType || ''} ${meal.date || ''}`.toLowerCase();
  return haystack.includes(query);
}

/**
 * Groups multi-day exercises, meals, weigh-ins, and body-fat scans into unified daily records
 * sorted newest-first, with aggregate calorie/macro/burn stats per day.
 */
export function buildDailyHistoryRecords({
  loggedWorkouts = [],
  loggedMeals = [],
  weightHistory = [],
  bodyFatHistory = [],
  searchQuery = '',
  selectedDate = 'all',
} = {}) {
  const q = (searchQuery || '').toLowerCase().trim();
  const dateMap = new Map();

  const ensureDayBucket = (dateStr) => {
    const key = dateStr || getRelativeDateString(0);
    if (!dateMap.has(key)) {
      dateMap.set(key, {
        date: key,
        label: formatHistoryDateLabel(key),
        daysAgo: getDaysAgoNumber(key),
        workouts: [],
        meals: [],
        weightEntry: null,
        bodyFatEntry: null,
        workoutMinutes: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
        protein: 0,
        carbs: 0,
        sugar: 0,
        fats: 0,
        netCalories: 0,
      });
    }
    return dateMap.get(key);
  };

  (loggedWorkouts || []).forEach((w) => {
    if (!w) return;
    if (!normalizeWorkoutMatches(w, q)) return;
    const bucket = ensureDayBucket(w.date);
    bucket.workouts.push(w);
    bucket.workoutMinutes += Number(w.durationMinutes || 0);
    bucket.caloriesBurned += Number(w.caloriesBurned || 0);
  });

  (loggedMeals || []).forEach((m) => {
    if (!m) return;
    if (!normalizeMealMatches(m, q)) return;
    const bucket = ensureDayBucket(m.date);
    bucket.meals.push(m);
    bucket.caloriesConsumed += Number(m.calories || 0);
    bucket.protein += Number(m.protein || 0);
    bucket.carbs += Number(m.carbs || 0);
    bucket.sugar += Number(m.sugar ?? 0);
    bucket.fats += Number(m.fats || 0);
  });

  // Attach weigh-ins and body-fat scans when viewing without text search filter (or matching date)
  if (!q) {
    (weightHistory || []).forEach((wh) => {
      if (!wh?.date) return;
      const bucket = ensureDayBucket(wh.date);
      bucket.weightEntry = wh;
    });
    (bodyFatHistory || []).forEach((bf) => {
      if (!bf?.date) return;
      const bucket = ensureDayBucket(bf.date);
      bucket.bodyFatEntry = bf;
    });
  }

  const allDays = Array.from(dateMap.values())
    .map((day) => ({
      ...day,
      netCalories: Math.round(day.caloriesConsumed - day.caloriesBurned),
    }))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const availableDates = allDays
    .filter((d) => d.workouts.length > 0 || d.meals.length > 0)
    .map((d) => ({
      date: d.date,
      label: d.label,
      workoutCount: d.workouts.length,
      mealCount: d.meals.length,
    }));

  const filteredDays =
    selectedDate && selectedDate !== 'all'
      ? allDays.filter((d) => d.date === selectedDate)
      : allDays;

  return {
    days: filteredDays,
    availableDates,
  };
}
