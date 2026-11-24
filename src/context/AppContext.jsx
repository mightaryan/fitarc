import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { calculateWorkoutImpact } from '../data/fitnessData';
import { evaluateMealNutrition, FOOD_SCAN_PRESETS } from '../data/foodData';

const AppContext = createContext(null);

const STORAGE_KEY = 'FITARC_APP_STATE_V1';

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const DEFAULT_PROFILE = {
  name: 'Alex Vance',
  email: 'alex.vance@fitarc.elite',
  currentWeight: 78.5,
  targetWeight: 74.0,
  startWeight: 82.0,
  height: 182,
  age: 28,
  gender: 'male',
  unit: 'kg',
  goal: 'fat_loss', // 'fat_loss' | 'muscle_gain' | 'recomp'
  dailyCalorieTarget: 2200,
  dailyWorkoutTargetMin: 45,
  dailyWaterTargetLiters: 3.5,
  isLoggedIn: true,
};

const SEED_WEIGHT_HISTORY = [
  { date: '2026-11-18', weight: 79.8, note: 'Baseline Monday weigh-in' },
  { date: '2026-11-19', weight: 79.5, note: 'Post leg-day' },
  { date: '2026-11-20', weight: 79.2, note: 'Clean deficit' },
  { date: '2026-11-21', weight: 79.0, note: 'Hydrated' },
  { date: '2026-11-22', weight: 78.8, note: 'Weekend fasted' },
  { date: '2026-11-23', weight: 78.6, note: 'Midweek progress' },
  { date: '2026-11-24', weight: 78.5, note: 'Morning weigh-in' },
];

const SEED_WORKOUTS = [
  {
    id: 'w-1',
    date: getTodayDateString(),
    exerciseId: 'chest-press-machine',
    exerciseName: 'Converging Chest Press Machine',
    category: 'machines',
    durationMinutes: 25,
    intensity: 'high',
    caloriesBurned: 195,
    muscleGrowthScore: 52,
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    loggedAt: '10:30 AM',
  },
  {
    id: 'w-2',
    date: getTodayDateString(),
    exerciseId: 'treadmill-incline-walk',
    exerciseName: 'Incline Treadmill Fat-Burn Walk',
    category: 'cardio',
    durationMinutes: 20,
    intensity: 'moderate',
    caloriesBurned: 142,
    muscleGrowthScore: 18,
    primaryMuscles: ['Calves', 'Gluteus Maximus', 'Cardio Aerobic Base'],
    loggedAt: '11:15 AM',
  }
];

const SEED_MEALS = [
  {
    id: 'm-1',
    date: getTodayDateString(),
    mealType: 'breakfast',
    title: 'Artisan Sourdough with Avocado & Poached Eggs',
    calories: 420,
    protein: 21,
    carbs: 34,
    fats: 22,
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&auto=format&fit=crop&q=80',
    rating: {
      score: 9.4,
      grade: 'A+',
      badgeText: 'Golden Standard',
      feedback: 'Excellent balance of bio-available protein and healthy fats.'
    },
    nextMealGuidance: {
      chosen: 'lean_protein',
      text: 'User requested Lean Protein Flush for lunch to hit target macros.',
    },
    loggedAt: '08:45 AM',
  }
];

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('fitness'); // 'fitness' | 'food' | 'dashboard' | 'history'
  const [user, setUser] = useState(DEFAULT_PROFILE);
  const [fontSizeScale, setFontSizeScale] = useState('normal'); // 'normal' | 'medium' | 'large' | 'xlarge'
  const [weightHistory, setWeightHistory] = useState(SEED_WEIGHT_HISTORY);
  const [loggedWorkouts, setLoggedWorkouts] = useState(SEED_WORKOUTS);
  const [loggedMeals, setLoggedMeals] = useState(SEED_MEALS);
  const [snoozeUntil, setSnoozeUntil] = useState(null); // ISO Date string
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);

  // Sync font size scale to root document
  useEffect(() => {
    const scaleMap = {
      normal: '100%',
      medium: '108%',
      large: '118%',
      xlarge: '128%',
    };
    document.documentElement.style.fontSize = scaleMap[fontSizeScale] || '100%';
  }, [fontSizeScale]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) setUser(parsed.user);
        if (parsed.fontSizeScale) setFontSizeScale(parsed.fontSizeScale);
        if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
        if (parsed.loggedWorkouts) setLoggedWorkouts(parsed.loggedWorkouts);
        if (parsed.loggedMeals) setLoggedMeals(parsed.loggedMeals);
        if (parsed.snoozeUntil) setSnoozeUntil(parsed.snoozeUntil);
      }
    } catch (e) {
      console.warn('Could not read from local storage', e);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      const payload = {
        user,
        fontSizeScale,
        weightHistory,
        loggedWorkouts,
        loggedMeals,
        snoozeUntil,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not write to local storage', e);
    }
  }, [user, fontSizeScale, weightHistory, loggedWorkouts, loggedMeals, snoozeUntil]);

  // Check if weight needs to be logged today or if snoozed
  useEffect(() => {
    const today = getTodayDateString();
    const hasLoggedToday = weightHistory.some((entry) => entry.date === today);

    if (hasLoggedToday) {
      return; // Already logged today
    }

    if (snoozeUntil) {
      const snoozeDate = new Date(snoozeUntil);
      const now = new Date();
      if (now < snoozeDate) {
        return; // Still snoozed
      }
    }

    // Otherwise, trigger the daily weight modal prompt after a soft delay (1 second)
    const timer = setTimeout(() => {
      setIsWeightModalOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [weightHistory, snoozeUntil]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
      });
    } catch (e) {
      // ignore
    }
  };

  // Log today's weight
  const logDailyWeight = (newWeight, note = 'Daily weigh-in') => {
    const today = getTodayDateString();
    const numericWeight = parseFloat(newWeight);
    if (isNaN(numericWeight) || numericWeight <= 20) return;

    setUser((prev) => ({
      ...prev,
      currentWeight: numericWeight,
    }));

    setWeightHistory((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { date: today, weight: numericWeight, note };
        return updated;
      }
      return [...prev, { date: today, weight: numericWeight, note }];
    });

    setIsWeightModalOpen(false);
    setSnoozeUntil(null);
    triggerConfetti();
  };

  // Snooze weight reminder
  const snoozeWeightReminder = (days = 1) => {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    setSnoozeUntil(snoozeDate.toISOString());
    setIsWeightModalOpen(false);
  };

  // Add workout to log
  const logWorkout = (workoutData) => {
    const today = getTodayDateString();
    const newEntry = {
      id: `w-${Date.now()}`,
      date: today,
      ...workoutData,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedWorkouts((prev) => [newEntry, ...prev]);
    triggerConfetti();
  };

  // Add meal to log
  const logMeal = (mealData) => {
    const today = getTodayDateString();
    const newEntry = {
      id: `m-${Date.now()}`,
      date: today,
      ...mealData,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) => [newEntry, ...prev]);
    triggerConfetti();
  };

  // Delete entries
  const deleteWorkout = (id) => {
    setLoggedWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const deleteMeal = (id) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  // Reset demo data to defaults
  const resetDemoData = () => {
    setUser(DEFAULT_PROFILE);
    setWeightHistory(SEED_WEIGHT_HISTORY);
    setLoggedWorkouts(SEED_WORKOUTS);
    setLoggedMeals(SEED_MEALS);
    setSnoozeUntil(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Compute daily totals for today
  const today = getTodayDateString();
  const todaysWorkouts = loggedWorkouts.filter((w) => w.date === today);
  const todaysMeals = loggedMeals.filter((m) => m.date === today);

  const totalCaloriesBurned = todaysWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalWorkoutMinutes = todaysWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  const totalCaloriesConsumed = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = todaysMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  const value = {
    activeTab,
    setActiveTab,
    fontSizeScale,
    setFontSizeScale,
    user,
    setUser,
    weightHistory,
    logDailyWeight,
    snoozeWeightReminder,
    snoozeUntil,
    isWeightModalOpen,
    setIsWeightModalOpen,
    loggedWorkouts,
    todaysWorkouts,
    logWorkout,
    deleteWorkout,
    loggedMeals,
    todaysMeals,
    logMeal,
    deleteMeal,
    selectedExerciseForModal,
    setSelectedExerciseForModal,
    selectedRecipeForModal,
    setSelectedRecipeForModal,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isMealScannerOpen,
    setIsMealScannerOpen,
    totalCaloriesBurned,
    totalWorkoutMinutes,
    totalCaloriesConsumed,
    totalProtein,
    totalCarbs,
    totalFats,
    netCalories,
    resetDemoData,
    triggerConfetti,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
