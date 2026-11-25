import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { calculateWorkoutImpact } from '../data/fitnessData';
import { evaluateMealNutrition, FOOD_SCAN_PRESETS } from '../data/foodData';

const AppContext = createContext(null);

const STORAGE_KEY = 'FITARC_APP_STATE_V1';
const VAULT_KEY = 'FITARC_USERS_VAULT_V2';
const ACTIVE_USER_ID_KEY = 'FITARC_ACTIVE_USER_ID_V2';

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const DEFAULT_PROFILE = {
  id: 'user_alex',
  name: 'Alex Vance',
  email: 'alex.vance@fitarc.elite',
  phone: '+1 415-890-2341',
  currentWeight: 78.5,
  targetWeight: 74.0,
  startWeight: 82.0,
  height: 182,
  age: 28,
  gender: 'male',
  unit: 'kg',
  goal: 'fat_loss', // 'fat_loss' | 'muscle_gain' | 'recomp'
  bodyFat: 16.5,
  dailyCalorieTarget: 2200,
  dailyWorkoutTargetMin: 45,
  dailyWaterTargetLiters: 3.5,
  isLoggedIn: true,
  memberTier: 'Gold Elite Pro',
  loginMethod: 'email',
  activePlan: {
    id: 'belly-fat-30',
    targetArea: 'belly_fat',
    durationDays: 30,
    title: '30-Day Belly Fat Blitz',
    badge: 'High Intensity Sprint',
    startDate: '2026-11-20',
    currentDay: 5,
    dailyCalorieDeficit: 500,
    dailySugarLimitGrams: 20,
    workoutDaysPerWeek: 5,
  },
  bodyFatHistory: [
    { date: '2026-11-18', bodyFat: 17.2, method: 'manual', note: 'Baseline scan' },
    { date: '2026-11-24', bodyFat: 16.5, method: 'ai_scan', note: 'AI torso vision scan' }
  ],
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
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'fitness' | 'food' | 'dashboard'
  const [fitnessSubTab, setFitnessSubTab] = useState('yoga'); // 'yoga' | 'home_hub' | 'archive'
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
  const [authModalTab, setAuthModalTab] = useState('biometrics'); // 'biometrics' | 'tier' | 'plan' | 'auth'
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const openAuthModal = (tab = 'biometrics') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const updateMemberTier = (tierName) => {
    setUser((prev) => ({
      ...prev,
      memberTier: tierName,
    }));
  };

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

  // Multi-profile vault state
  const [profilesVault, setProfilesVault] = useState(() => {
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'user_alex': {
        profile: DEFAULT_PROFILE,
        weightHistory: SEED_WEIGHT_HISTORY,
        loggedWorkouts: SEED_WORKOUTS,
        loggedMeals: SEED_MEALS,
        snoozeUntil: null,
      }
    };
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY) || 'user_alex';
      const storedVault = localStorage.getItem(VAULT_KEY);
      const vault = storedVault ? JSON.parse(storedVault) : profilesVault;
      const activeData = vault[activeId] || vault['user_alex'];
      if (activeData) {
        setUser(activeData.profile);
        setWeightHistory(activeData.weightHistory || []);
        setLoggedWorkouts(activeData.loggedWorkouts || []);
        setLoggedMeals(activeData.loggedMeals || []);
        setSnoozeUntil(activeData.snoozeUntil || null);
      }
    } catch (e) {
      console.warn('Could not read from local storage', e);
    }
  }, []);

  // Save current active user data into profiles vault on any state change
  useEffect(() => {
    if (!user?.id) return;
    try {
      setProfilesVault((prevVault) => {
        const updatedVault = {
          ...prevVault,
          [user.id]: {
            profile: user,
            weightHistory,
            loggedWorkouts,
            loggedMeals,
            snoozeUntil,
          }
        };
        localStorage.setItem(VAULT_KEY, JSON.stringify(updatedVault));
        localStorage.setItem(ACTIVE_USER_ID_KEY, user.id);
        return updatedVault;
      });
    } catch (e) {
      console.warn('Could not write to local storage', e);
    }
  }, [user, weightHistory, loggedWorkouts, loggedMeals, snoozeUntil]);

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

  // Login or Register via Phone Number
  const loginWithPhone = (phoneNumber, otpCode, fullName = '', startingWeight = 75.0) => {
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const profileId = `phone_${cleanDigits}`;

    let currentVault = { ...profilesVault };
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) currentVault = JSON.parse(stored);
    } catch (e) {}

    if (currentVault[profileId]) {
      const existing = currentVault[profileId];
      setUser({ ...existing.profile, isLoggedIn: true });
      setWeightHistory(existing.weightHistory || []);
      setLoggedWorkouts(existing.loggedWorkouts || []);
      setLoggedMeals(existing.loggedMeals || []);
      setSnoozeUntil(existing.snoozeUntil || null);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || `Athlete ${cleanDigits.slice(-4)}`,
        phone: phoneNumber,
        email: '',
        currentWeight: startingWeight,
        targetWeight: Math.round((startingWeight * 0.95) * 10) / 10,
        startWeight: startingWeight,
        height: 178,
        age: 26,
        gender: 'male',
        unit: 'kg',
        goal: 'muscle_gain',
        dailyCalorieTarget: 2300,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        memberTier: 'Verified Athlete',
        loginMethod: 'phone',
      };
      const initialWeightHistory = [
        { date: getTodayDateString(), weight: startingWeight, note: 'Initial registration weigh-in' }
      ];
      setUser(newProfile);
      setWeightHistory(initialWeightHistory);
      setLoggedWorkouts([]);
      setLoggedMeals([]);
      setSnoozeUntil(null);

      currentVault[profileId] = {
        profile: newProfile,
        weightHistory: initialWeightHistory,
        loggedWorkouts: [],
        loggedMeals: [],
        snoozeUntil: null,
      };
      setProfilesVault(currentVault);
      localStorage.setItem(VAULT_KEY, JSON.stringify(currentVault));
    }

    localStorage.setItem(ACTIVE_USER_ID_KEY, profileId);
    triggerConfetti();
  };

  // Login or Register via Email Address
  const loginWithEmail = (emailAddress, password = '', fullName = '', startingWeight = 75.0) => {
    const cleanEmail = emailAddress.trim().toLowerCase();
    const profileId = `email_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    let currentVault = { ...profilesVault };
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) currentVault = JSON.parse(stored);
    } catch (e) {}

    if (currentVault[profileId]) {
      const existing = currentVault[profileId];
      setUser({ ...existing.profile, isLoggedIn: true });
      setWeightHistory(existing.weightHistory || []);
      setLoggedWorkouts(existing.loggedWorkouts || []);
      setLoggedMeals(existing.loggedMeals || []);
      setSnoozeUntil(existing.snoozeUntil || null);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '',
        currentWeight: startingWeight,
        targetWeight: Math.round((startingWeight * 0.95) * 10) / 10,
        startWeight: startingWeight,
        height: 180,
        age: 27,
        gender: 'male',
        unit: 'kg',
        goal: 'fat_loss',
        dailyCalorieTarget: 2200,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        memberTier: 'Gold Pro Vault',
        loginMethod: 'email',
      };
      const initialWeightHistory = [
        { date: getTodayDateString(), weight: startingWeight, note: 'Initial registration weigh-in' }
      ];
      setUser(newProfile);
      setWeightHistory(initialWeightHistory);
      setLoggedWorkouts([]);
      setLoggedMeals([]);
      setSnoozeUntil(null);

      currentVault[profileId] = {
        profile: newProfile,
        weightHistory: initialWeightHistory,
        loggedWorkouts: [],
        loggedMeals: [],
        snoozeUntil: null,
      };
      setProfilesVault(currentVault);
      localStorage.setItem(VAULT_KEY, JSON.stringify(currentVault));
    }

    localStorage.setItem(ACTIVE_USER_ID_KEY, profileId);
    triggerConfetti();
  };

  // Switch to another profile
  const switchUserProfile = (targetUserId) => {
    let currentVault = { ...profilesVault };
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) currentVault = JSON.parse(stored);
    } catch (e) {}

    if (currentVault[targetUserId]) {
      const target = currentVault[targetUserId];
      setUser({ ...target.profile, isLoggedIn: true });
      setWeightHistory(target.weightHistory || []);
      setLoggedWorkouts(target.loggedWorkouts || []);
      setLoggedMeals(target.loggedMeals || []);
      setSnoozeUntil(target.snoozeUntil || null);
      localStorage.setItem(ACTIVE_USER_ID_KEY, targetUserId);
      triggerConfetti();
    }
  };

  // Logout
  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setIsAuthModalOpen(true);
  };

  // Get list of all saved profiles
  const getAllSavedProfiles = () => {
    let currentVault = { ...profilesVault };
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      if (stored) currentVault = JSON.parse(stored);
    } catch (e) {}

    return Object.values(currentVault).map((v) => ({
      id: v.profile.id,
      name: v.profile.name,
      email: v.profile.email,
      phone: v.profile.phone,
      currentWeight: v.profile.currentWeight,
      memberTier: v.profile.memberTier,
      avatar: v.profile.avatar,
    }));
  };

  // Reset demo data to defaults
  const resetDemoData = () => {
    setUser(DEFAULT_PROFILE);
    setWeightHistory(SEED_WEIGHT_HISTORY);
    setLoggedWorkouts(SEED_WORKOUTS);
    setLoggedMeals(SEED_MEALS);
    setSnoozeUntil(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VAULT_KEY);
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  };

  // Select active transformation plan (30, 60, 90 days)
  const selectTransformationPlan = (plan) => {
    setUser((prev) => ({
      ...prev,
      activePlan: {
        ...plan,
        startDate: getTodayDateString(),
        currentDay: 1,
      }
    }));
    triggerConfetti();
  };

  // Log Body Fat % reading (manual or AI photo vision estimate)
  const logBodyFat = (fatPercent, photoUrl = null, method = 'manual', note = '') => {
    const numericFat = Math.round(parseFloat(fatPercent) * 10) / 10;
    if (isNaN(numericFat) || numericFat <= 3) return;
    const today = getTodayDateString();
    const entry = {
      date: today,
      bodyFat: numericFat,
      photoUrl,
      method,
      note: note || (method === 'ai_scan' ? 'AI Physique Vision Scan' : 'Manual Entry'),
    };

    setUser((prev) => ({
      ...prev,
      bodyFat: numericFat,
      bodyFatHistory: [entry, ...(prev.bodyFatHistory || [])],
    }));
    triggerConfetti();
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
  const totalSugar = todaysMeals.reduce((sum, m) => sum + (m.sugar || 0), 0);
  const sugarLimitGrams = user.activePlan?.dailySugarLimitGrams || 25;

  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  // Calculate live BMI
  const bmi = Math.round(((user.currentWeight || 75) / (((user.height || 180) / 100) ** 2)) * 10) / 10;

  const value = {
    activeTab,
    setActiveTab,
    fitnessSubTab,
    setFitnessSubTab,
    fontSizeScale,
    setFontSizeScale,
    user,
    setUser,
    bmi,
    totalSugar,
    sugarLimitGrams,
    selectTransformationPlan,
    logBodyFat,
    isPlanModalOpen,
    setIsPlanModalOpen,
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
    authModalTab,
    setAuthModalTab,
    openAuthModal,
    updateMemberTier,
    loginWithPhone,
    loginWithEmail,
    switchUserProfile,
    logoutUser,
    getAllSavedProfiles,
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
