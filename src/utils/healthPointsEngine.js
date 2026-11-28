/**
 * FITARC HEALTH POINTS ENGINE & PRIVACY-SAFE TOP 10 LEADERBOARD
 * Computes transparent Health Points from:
 *  1) Healthy nutrition quality, clean low-sugar food choices, and protein balance
 *  2) Cumulative exercise duration and multi-day active consistency
 * Never exposes private credentials (email, phone, weight, body fat, or personal logs) on the leaderboard.
 */

const INTENSITY_MULTIPLIER = {
  maximum: 1.25,
  high: 1.15,
  moderate: 1.0,
  light: 0.9,
};

/**
 * Formats an athlete's name for privacy-safe public display on the Top 10 Leaderboard.
 */
export function formatPublicLeaderboardName(fullName) {
  const parts = String(fullName || 'Athlete')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'Athlete';
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return lastInitial ? `${first} ${lastInitial}.` : first;
}

/**
 * Scores a single meal entry for clean nutrition contribution.
 */
function scoreHealthyMeal(meal) {
  const quality = Number(meal?.score ?? 8.0);
  const sugar = Number(meal?.sugar ?? 6);
  const protein = Number(meal?.protein || 0);
  const calories = Number(meal?.calories || 0);

  // Reward high-quality nutrient-dense meals; avoid inflated points for ultra-high sugar foods
  const qualityPoints = quality >= 9.0 ? 45 : quality >= 8.0 ? 35 : quality >= 7.0 ? 22 : 10;
  const lowSugarBonus = sugar <= 6 ? 25 : sugar <= 12 ? 15 : sugar <= 20 ? 5 : -12;
  const proteinBonus = protein >= 35 ? 22 : protein >= 20 ? 15 : protein >= 10 ? 8 : 2;
  const sensiblePortionBonus = calories >= 180 && calories <= 850 ? 10 : 4;

  const total = Math.max(5, Math.round(qualityPoints + lowSugarBonus + proteinBonus + sensiblePortionBonus));
  const isCleanMeal = quality >= 8.0 && sugar <= 12;

  return { points: total, isCleanMeal, quality };
}

/**
 * Computes Health Points breakdown for an athlete from their exercise and nutrition logs.
 */
export function calculateUserHealthPoints({ loggedWorkouts = [], loggedMeals = [] } = {}) {
  const workouts = Array.isArray(loggedWorkouts) ? loggedWorkouts : [];
  const meals = Array.isArray(loggedMeals) ? loggedMeals : [];

  // Aggregate daily meals (cap per-day meal count contribution at 4 to reward daily consistency over single-day spam)
  const mealsByDate = new Map();
  let cleanMealsCount = 0;
  let scoreSum = 0;

  meals.forEach((meal) => {
    if (!meal) return;
    const scored = scoreHealthyMeal(meal);
    if (scored.isCleanMeal) cleanMealsCount += 1;
    scoreSum += scored.quality;
    const dateKey = meal.date || 'unknown';
    if (!mealsByDate.has(dateKey)) mealsByDate.set(dateKey, []);
    mealsByDate.get(dateKey).push(scored.points);
  });

  let nutritionPoints = 0;
  mealsByDate.forEach((scores) => {
    const topMealsForDay = scores.sort((a, b) => b - a).slice(0, 4);
    nutritionPoints += topMealsForDay.reduce((sum, val) => sum + val, 0);
  });

  // Aggregate workouts weighted by exercise duration & effort intensity
  let totalExerciseMinutes = 0;
  let exercisePoints = 0;
  const activeWorkoutDays = new Set();

  workouts.forEach((w) => {
    if (!w) return;
    const mins = Math.max(0, Number(w.durationMinutes || 0));
    const intensityKey = String(w.intensity || 'moderate').toLowerCase();
    const mult = INTENSITY_MULTIPLIER[intensityKey] || 1.0;
    totalExerciseMinutes += mins;
    exercisePoints += Math.round(mins * 3.0 * mult);
    if (mins >= 8 && w.date) {
      activeWorkoutDays.add(w.date);
    }
  });

  // Reward multi-day consistency across both clean nutrition & regular workouts
  const cleanNutritionDays = mealsByDate.size;
  const consistentDualDays = [...activeWorkoutDays].filter((d) => mealsByDate.has(d)).length;
  const consistencyBonus = activeWorkoutDays.size * 25 + cleanNutritionDays * 15 + consistentDualDays * 20;

  const healthPoints = Math.max(0, Math.round(nutritionPoints + exercisePoints + consistencyBonus));
  const avgMealScore = meals.length > 0 ? Math.round((scoreSum / meals.length) * 10) / 10 : 0;

  return {
    healthPoints,
    nutritionPoints,
    exercisePoints,
    consistencyBonus,
    cleanMealsCount,
    totalMealsCount: meals.length,
    avgMealScore,
    totalExerciseMinutes,
    workoutCount: workouts.length,
    activeDays: activeWorkoutDays.size,
  };
}

/**
 * Builds the privacy-safe Top 10 Health Points Leaderboard across all athletes.
 * Strictly strips all private profile details (email, phone, body stats, raw logs).
 */
export function buildTopHealthLeaderboard(vaultMap = {}, activeUserSnapshot = null, limit = 10) {
  const entries = Object.values(vaultMap || {});
  const activeId = activeUserSnapshot?.profile?.id;

  const ranked = entries
    .map((entry) => {
      if (!entry?.profile) return null;
      const isCurrentUser = Boolean(activeId && entry.profile.id === activeId);
      const sourceEntry = isCurrentUser && activeUserSnapshot ? activeUserSnapshot : entry;
      const profile = sourceEntry.profile || entry.profile;
      const metrics = calculateUserHealthPoints({
        loggedWorkouts: sourceEntry.loggedWorkouts || [],
        loggedMeals: sourceEntry.loggedMeals || [],
      });

      const initials = (profile.name || 'AT')
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      return {
        isCurrentUser,
        displayName: isCurrentUser
          ? profile.name || 'You'
          : formatPublicLeaderboardName(profile.name),
        initials,
        avatarUrl: profile.avatarUrl || '',
        memberTier: profile.memberTier || 'Pro Athlete',
        healthPoints: metrics.healthPoints,
        nutritionPoints: metrics.nutritionPoints,
        exercisePoints: metrics.exercisePoints,
        totalExerciseMinutes: metrics.totalExerciseMinutes,
        cleanMealsCount: metrics.cleanMealsCount,
        avgMealScore: metrics.avgMealScore,
        activeDays: metrics.activeDays,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.healthPoints !== a.healthPoints) return b.healthPoints - a.healthPoints;
      if (b.totalExerciseMinutes !== a.totalExerciseMinutes) {
        return b.totalExerciseMinutes - a.totalExerciseMinutes;
      }
      return b.nutritionPoints - a.nutritionPoints;
    })
    .map((row, idx) => ({
      ...row,
      rank: idx + 1,
    }));

  const currentUserEntry = ranked.find((r) => r.isCurrentUser) || null;
  const topRows = ranked.slice(0, limit);

  return {
    top10: topRows,
    currentUserRank: currentUserEntry?.rank || null,
    currentUserStats: currentUserEntry,
    totalParticipants: ranked.length,
    pointsToTop10:
      currentUserEntry && topRows.length >= limit && currentUserEntry.rank > limit
        ? Math.max(1, topRows[limit - 1].healthPoints - currentUserEntry.healthPoints + 1)
        : 0,
  };
}
