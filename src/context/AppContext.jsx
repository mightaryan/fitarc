import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  createSeededVault,
  getRelativeDateString,
  upgradeVaultWithSeededHistory,
} from '../data/athleteVaultDatabase';

const AppContext = createContext(null);

const LEGACY_VAULT_KEY_V3 = 'FITARC_USERS_VAULT_V3';
const LEGACY_ACTIVE_USER_ID_KEY_V3 = 'FITARC_ACTIVE_USER_ID_V3';
const VAULT_KEY = 'FITARC_USERS_VAULT_V4';
const ACTIVE_USER_ID_KEY = 'FITARC_ACTIVE_USER_ID_V4';

const getTodayDateString = () => getRelativeDateString(0);

function getInitialVaultAndUser() {
  const seeded = createSeededVault();
  try {
    const storedV4Raw = localStorage.getItem(VAULT_KEY);
    if (storedV4Raw) {
      const storedVault = JSON.parse(storedV4Raw) || {};
      const mergedVault = { ...seeded, ...storedVault };
      const savedActiveId = localStorage.getItem(ACTIVE_USER_ID_KEY) || 'user_alex';
      const activeId = mergedVault[savedActiveId] ? savedActiveId : 'user_alex';
      return { mergedVault, activeId };
    }

    // One-time non-destructive migration from V3 vault to V4 with full multi-day exercise & meal history
    const legacyRaw = localStorage.getItem(LEGACY_VAULT_KEY_V3);
    const legacyVault = legacyRaw ? JSON.parse(legacyRaw) : null;
    const upgradedVault = legacyVault ? upgradeVaultWithSeededHistory(legacyVault) : seeded;
    const savedActiveId =
      localStorage.getItem(ACTIVE_USER_ID_KEY) ||
      localStorage.getItem(LEGACY_ACTIVE_USER_ID_KEY_V3) ||
      'user_alex';
    const activeId = upgradedVault[savedActiveId] ? savedActiveId : 'user_alex';
    localStorage.setItem(VAULT_KEY, JSON.stringify(upgradedVault));
    localStorage.setItem(ACTIVE_USER_ID_KEY, activeId);
    return { mergedVault: upgradedVault, activeId };
  } catch (e) {
    return { mergedVault: seeded, activeId: 'user_alex' };
  }
}

export function AppProvider({ children, initialAuthTab = 'biometrics' }) {
  const initialBootstrap = getInitialVaultAndUser();
  const initialActive = initialBootstrap.mergedVault[initialBootstrap.activeId];

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'fitness' | 'food' | 'dashboard'
  const [fitnessSubTab, setFitnessSubTab] = useState('yoga'); // 'yoga' | 'home_hub' | 'calisthenics' | 'archive'
  const [profilesVault, setProfilesVault] = useState(initialBootstrap.mergedVault);
  const [user, setUser] = useState(initialActive.profile);
  const [fontSizeScale, setFontSizeScale] = useState('normal'); // 'normal' | 'medium' | 'large' | 'xlarge'
  const [weightHistory, setWeightHistory] = useState(initialActive.weightHistory || []);
  const [loggedWorkouts, setLoggedWorkouts] = useState(initialActive.loggedWorkouts || []);
  const [loggedMeals, setLoggedMeals] = useState(initialActive.loggedMeals || []);
  const [snoozeUntil, setSnoozeUntil] = useState(initialActive.snoozeUntil || null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState(initialAuthTab); // 'biometrics' | 'directory' | 'history' | 'tier' | 'auth'
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

  // Save current active user data into profiles vault whenever active user state changes
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
          },
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
    if (hasLoggedToday) return;

    if (snoozeUntil) {
      const snoozeDate = new Date(snoozeUntil);
      if (new Date() < snoozeDate) return;
    }

    const timer = setTimeout(() => {
      setIsWeightModalOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [weightHistory, snoozeUntil]);

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

  // Add workout to log (supports Today or past-day date override)
  const logWorkout = (workoutData) => {
    const today = getTodayDateString();
    const newEntry = {
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: workoutData?.date || today,
      ...workoutData,
      loggedAt:
        workoutData?.loggedAt ||
        workoutData?.time ||
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedWorkouts((prev) =>
      [newEntry, ...prev].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    );
    triggerConfetti();
  };

  // Add meal to log (supports Today or past-day date override)
  const logMeal = (mealData) => {
    const today = getTodayDateString();
    const newEntry = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: mealData?.date || today,
      sugar: mealData?.sugar ?? 4,
      ...mealData,
      loggedAt:
        mealData?.loggedAt ||
        mealData?.time ||
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) =>
      [newEntry, ...prev].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    );
    triggerConfetti();
  };

  // Delete entries
  const deleteWorkout = (id) => {
    setLoggedWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const deleteMeal = (id) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  // Snapshot the active user's latest state into a vault map synchronously
  const buildVaultWithActiveState = (baseVault = profilesVault) => {
    const nextVault = { ...baseVault };
    if (user?.id && user?.isLoggedIn) {
      nextVault[user.id] = {
        ...(nextVault[user.id] || {}),
        profile: { ...user },
        weightHistory,
        loggedWorkouts,
        loggedMeals,
        snoozeUntil,
      };
    }
    return nextVault;
  };

  // Helper to apply an entry from vault cleanly
  const loadVaultEntry = (targetId, entry, updatedVaultSnapshot = null) => {
    const safeVault = updatedVaultSnapshot || buildVaultWithActiveState();
    setProfilesVault(safeVault);
    localStorage.setItem(VAULT_KEY, JSON.stringify(safeVault));
    setUser({ ...entry.profile, isLoggedIn: true });
    setWeightHistory(entry.weightHistory || []);
    setLoggedWorkouts(entry.loggedWorkouts || []);
    setLoggedMeals(entry.loggedMeals || []);
    setSnoozeUntil(entry.snoozeUntil || null);
    localStorage.setItem(ACTIVE_USER_ID_KEY, targetId);
  };

  // Login or Register via Phone Number
  const loginWithPhone = (phoneNumber, otpCode, fullName = '', startingWeight = 75.0) => {
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const profileId = `phone_${cleanDigits}`;

    const currentVault = { ...profilesVault };
    if (currentVault[profileId]) {
      loadVaultEntry(profileId, currentVault[profileId]);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || `Athlete ${cleanDigits.slice(-4)}`,
        phone: phoneNumber,
        email: '',
        currentWeight: startingWeight,
        targetWeight: Math.round(startingWeight * 0.95 * 10) / 10,
        startWeight: startingWeight,
        height: 178,
        age: 26,
        gender: 'male',
        unit: 'kg',
        goal: 'muscle_gain',
        bodyFat: 18.0,
        dailyCalorieTarget: 2300,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'phone',
        specialty: 'Custom Vault Profile',
        bodyFatHistory: [
          { date: getTodayDateString(), bodyFat: 18.0, method: 'manual', note: 'Initial baseline' },
        ],
      };
      const initialWeightHistory = [
        { date: getTodayDateString(), weight: startingWeight, note: 'Initial registration weigh-in' },
      ];
      const newEntry = {
        profile: newProfile,
        weightHistory: initialWeightHistory,
        loggedWorkouts: [],
        loggedMeals: [],
        snoozeUntil: null,
      };
      const updated = { ...currentVault, [profileId]: newEntry };
      setProfilesVault(updated);
      localStorage.setItem(VAULT_KEY, JSON.stringify(updated));
      loadVaultEntry(profileId, newEntry);
    }
    triggerConfetti();
  };

  // Login or Register via Email Address
  const loginWithEmail = (emailAddress, password = '', fullName = '', startingWeight = 75.0) => {
    const cleanEmail = emailAddress.trim().toLowerCase();
    const profileId = `email_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    const currentVault = { ...profilesVault };
    if (currentVault[profileId]) {
      loadVaultEntry(profileId, currentVault[profileId]);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '',
        currentWeight: startingWeight,
        targetWeight: Math.round(startingWeight * 0.95 * 10) / 10,
        startWeight: startingWeight,
        height: 180,
        age: 27,
        gender: 'male',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 18.0,
        dailyCalorieTarget: 2200,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        memberTier: 'Gold Elite Pro',
        loginMethod: 'email',
        specialty: 'Custom Vault Profile',
        bodyFatHistory: [
          { date: getTodayDateString(), bodyFat: 18.0, method: 'manual', note: 'Initial baseline' },
        ],
      };
      const initialWeightHistory = [
        { date: getTodayDateString(), weight: startingWeight, note: 'Initial registration weigh-in' },
      ];
      const newEntry = {
        profile: newProfile,
        weightHistory: initialWeightHistory,
        loggedWorkouts: [],
        loggedMeals: [],
        snoozeUntil: null,
      };
      const updated = { ...currentVault, [profileId]: newEntry };
      setProfilesVault(updated);
      localStorage.setItem(VAULT_KEY, JSON.stringify(updated));
      loadVaultEntry(profileId, newEntry);
    }
    triggerConfetti();
  };

  // Switch to any profile in the Athlete Vault Database
  const switchUserProfile = (targetUserId) => {
    const syncedVault = buildVaultWithActiveState();
    const target = syncedVault[targetUserId];
    if (target) {
      loadVaultEntry(targetUserId, target, syncedVault);
      triggerConfetti();
    }
  };

  // Logout
  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setIsAuthModalOpen(true);
  };

  // Rich directory summary list of all athletes in the Vault
  const getAllSavedProfiles = () => {
    const liveVault = buildVaultWithActiveState();
    return Object.values(liveVault).map((v) => {
      const p = v.profile || {};
      const h = (p.height || 175) / 100;
      const calcBmi = Math.round(((p.currentWeight || 75) / (h * h)) * 10) / 10;
      return {
        id: p.id,
        name: p.name || 'Athlete',
        email: p.email,
        phone: p.phone,
        currentWeight: p.currentWeight,
        height: p.height,
        bodyFat: p.bodyFat || 18,
        bmi: calcBmi,
        goal: p.goal || 'fat_loss',
        specialty: p.specialty || 'Transformation Athlete',
        memberTier: p.memberTier || 'Gold Elite Pro',
        activePlan: p.activePlan,
        workoutCount: (v.loggedWorkouts || []).length,
        mealCount: (v.loggedMeals || []).length,
        totalCaloriesBurnedAllTime: (v.loggedWorkouts || []).reduce((s, w) => s + (w.caloriesBurned || 0), 0),
      };
    });
  };

  // Restore full seeded 8-athlete Vault database
  const resetDemoData = () => {
    const freshSeed = createSeededVault();
    setProfilesVault(freshSeed);
    localStorage.setItem(VAULT_KEY, JSON.stringify(freshSeed));
    loadVaultEntry('user_alex', freshSeed['user_alex']);
    triggerConfetti();
  };

  // Select active transformation plan (30, 60, 90 days)
  const selectTransformationPlan = (plan) => {
    setUser((prev) => ({
      ...prev,
      activePlan: {
        ...plan,
        startDate: getTodayDateString(),
        currentDay: 1,
      },
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
  const totalSugar = todaysMeals.reduce((sum, m) => sum + (m.sugar ?? 0), 0);
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
    profilesVault,
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
