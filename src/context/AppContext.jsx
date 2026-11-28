import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  createSeededVault,
  getRelativeDateString,
  upgradeVaultWithSeededHistory,
} from '../data/athleteVaultDatabase';
import {
  calculateUserHealthPoints,
  buildTopHealthLeaderboard,
} from '../utils/healthPointsEngine';
import { TRANSFORMATION_PLANS } from '../data/transformationPlans';
import { INITIAL_SHOP_PRODUCTS } from '../data/trustifiedShopCatalog';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_SEO_SETTINGS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_SUPPORT_TICKETS,
  decoratePlansWithPricing,
} from '../data/adminDefaults';
import { translate, getLanguageMeta } from '../utils/i18n';
import {
  getCurrentPathname,
  isAdminPathname,
  getTabFromPathname,
  getPathnameForTab,
  navigateTo,
} from '../utils/routeHelper';

const AppContext = createContext(null);

const LEGACY_VAULT_KEY_V3 = 'FITARC_USERS_VAULT_V3';
const LEGACY_ACTIVE_USER_ID_KEY_V3 = 'FITARC_ACTIVE_USER_ID_V3';
const VAULT_KEY = 'FITARC_USERS_VAULT_V5';
const ACTIVE_USER_ID_KEY = 'FITARC_ACTIVE_USER_ID_V5';
const LOGGED_OUT_FLAG_KEY = 'FITARC_LOGGED_OUT_V5';
const PLATFORM_CONFIG_KEY = 'FITARC_PLATFORM_CONFIG_V1';
const ADMIN_SESSION_KEY = 'FITARC_ADMIN_SESSION_V1';
const LANGUAGE_STORAGE_KEY = 'FITARC_LANG_V1';

const safeStorageSet = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    // ignore storage quota or private mode errors
  }
};

const safeStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // ignore storage removal errors
  }
};

const getTodayDateString = () => getRelativeDateString(0);

const isFaceYogaString = (str = '') => /face[\s_-]?yoga|yoga[\s_-]?face|jawline sculpt|double chin/i.test(str);

function buildDefaultPlatformConfig() {
  return {
    siteSettings: INITIAL_SITE_SETTINGS,
    seoSettings: INITIAL_SEO_SETTINGS,
    pricing99Migrated: true,
    customExercises: [],
    disabledExerciseIds: [],
    exerciseOverrides: {},
    customFoods: [],
    disabledFoodIds: [],
    foodOverrides: {},
    managedPlans: decoratePlansWithPricing(TRANSFORMATION_PLANS),
    shopProducts: INITIAL_SHOP_PRODUCTS,
    paymentTransactions: INITIAL_PAYMENT_TRANSACTIONS,
    supportTickets: INITIAL_SUPPORT_TICKETS,
  };
}

function getInitialPlatformConfig() {
  const defaults = buildDefaultPlatformConfig();
  try {
    const raw = localStorage.getItem(PLATFORM_CONFIG_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;

    const cleanTagline = isFaceYogaString(parsed.siteSettings?.tagline)
      ? defaults.siteSettings.tagline
      : parsed.siteSettings?.tagline ?? defaults.siteSettings.tagline;

    const cleanAnnouncement = isFaceYogaString(parsed.siteSettings?.announcementText)
      ? defaults.siteSettings.announcementText
      : parsed.siteSettings?.announcementText ?? defaults.siteSettings.announcementText;

    // Sanitize cached plans so removed face_yoga plans are upgraded cleanly
    const rawPlans = Array.isArray(parsed.managedPlans) && parsed.managedPlans.length > 0
      ? parsed.managedPlans
      : defaults.managedPlans;
    const hasLegacyFacePlan = rawPlans.some((p) => p?.targetArea === 'yoga_face' || String(p?.id || '').startsWith('yoga-face'));
    const sanitizedPlans = hasLegacyFacePlan
      ? [
          ...rawPlans.filter((p) => p?.targetArea !== 'yoga_face' && !String(p?.id || '').startsWith('yoga-face')),
          ...defaults.managedPlans.filter((dp) => dp.targetArea === 'yoga_mobility'),
        ]
      : rawPlans;

    // Upgrade legacy default ₹999/₹1799/₹2499 tiers to production ₹99+ Monthly & Yearly pricing
    const mergedPlans = sanitizedPlans.map((p) => {
      const legacyFix = !parsed.pricing99Migrated && (
        (p.durationDays === 30 && p.priceINR === 999) ||
        (p.durationDays === 60 && p.priceINR === 1799) ||
        (p.durationDays >= 90 && p.priceINR === 2499)
      );
      const nextPrice = legacyFix
        ? (p.durationDays >= 90 ? 299 : p.durationDays >= 60 ? 199 : 99)
        : (p.priceINR ?? (p.durationDays >= 90 ? 299 : p.durationDays >= 60 ? 199 : 99));
      const nextMrp = legacyFix
        ? (p.durationDays >= 90 ? 1499 : p.durationDays >= 60 ? 999 : 499)
        : (p.mrpINR ?? (p.durationDays >= 90 ? 1499 : p.durationDays >= 60 ? 999 : 499));
      const yearlyPriceINR = p.yearlyPriceINR ?? (p.durationDays >= 90 ? 1999 : p.durationDays >= 60 ? 1299 : 799);
      const yearlyMrpINR = p.yearlyMrpINR ?? (p.durationDays >= 90 ? 7999 : p.durationDays >= 60 ? 4999 : 2999);
      return {
        ...p,
        priceINR: nextPrice,
        mrpINR: nextMrp,
        yearlyPriceINR,
        yearlyMrpINR,
      };
    });

    // Enrich stored shop items with magazine imagery & macros added in catalog updates
    const defaultsById = new Map(INITIAL_SHOP_PRODUCTS.map((p) => [p.id, p]));
    const rawShop = Array.isArray(parsed.shopProducts) && parsed.shopProducts.length > 0
      ? parsed.shopProducts
      : defaults.shopProducts;
    const enrichedShop = rawShop.map((item) => {
      const defMatch = defaultsById.get(item.id);
      if (!defMatch) return item;
      const usesOldStockPhoto = !item.imageUrl || String(item.imageUrl).includes('images.unsplash.com');
      return {
        ...defMatch,
        ...item,
        imageUrl: usesOldStockPhoto ? defMatch.imageUrl : item.imageUrl,
        fallbackImage: item.fallbackImage || defMatch.fallbackImage,
        carbsPerServing: item.carbsPerServing ?? defMatch.carbsPerServing,
        fatPerServing: item.fatPerServing ?? defMatch.fatPerServing,
        fiberPerServing: item.fiberPerServing ?? defMatch.fiberPerServing,
        issueTag: item.issueTag || defMatch.issueTag,
      };
    });

    // Sanitize cached customExercises (strip any leftover face_yoga)
    const rawCustomEx = Array.isArray(parsed.customExercises) ? parsed.customExercises : [];
    const cleanCustomEx = rawCustomEx.filter(
      (ex) => ex && ex.category !== 'face_yoga' && ex.subCategory !== 'face_yoga' && ex.equipment !== 'face_hands'
    );

    const rawTransactions = Array.isArray(parsed.paymentTransactions)
      ? parsed.paymentTransactions
      : defaults.paymentTransactions;
    const cleanTransactions = rawTransactions.map((trx) =>
      trx?.itemId === 'yoga-face-60'
        ? { ...trx, itemId: 'yoga-mobility-60', itemName: '60-Day Vinyasa Flow & Posture Overhaul' }
        : trx
    );

    const mergedSeo = { ...defaults.seoSettings };
    if (parsed.seoSettings && typeof parsed.seoSettings === 'object') {
      Object.keys(parsed.seoSettings).forEach((k) => {
        mergedSeo[k] = { ...(defaults.seoSettings[k] || {}), ...parsed.seoSettings[k] };
      });
    }

    return {
      siteSettings: {
        ...defaults.siteSettings,
        ...(parsed.siteSettings || {}),
        tagline: cleanTagline,
        announcementText: cleanAnnouncement,
        socialLinks: {
          ...defaults.siteSettings.socialLinks,
          ...(parsed.siteSettings?.socialLinks || {}),
        },
        paymentGateway: {
          ...defaults.siteSettings.paymentGateway,
          ...(parsed.siteSettings?.paymentGateway || {}),
        },
      },
      seoSettings: mergedSeo,
      pricing99Migrated: true,
      customExercises: cleanCustomEx,
      disabledExerciseIds: Array.isArray(parsed.disabledExerciseIds) ? parsed.disabledExerciseIds : [],
      exerciseOverrides: parsed.exerciseOverrides && typeof parsed.exerciseOverrides === 'object' ? parsed.exerciseOverrides : {},
      customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
      disabledFoodIds: Array.isArray(parsed.disabledFoodIds) ? parsed.disabledFoodIds : [],
      foodOverrides: parsed.foodOverrides && typeof parsed.foodOverrides === 'object' ? parsed.foodOverrides : {},
      managedPlans: mergedPlans,
      shopProducts: enrichedShop,
      paymentTransactions: cleanTransactions,
      supportTickets:
        Array.isArray(parsed.supportTickets) && parsed.supportTickets.length > 0
          ? parsed.supportTickets
          : defaults.supportTickets,
    };
  } catch (e) {
    return defaults;
  }
}

function sanitizeVaultEntries(vault = {}) {
  const seeded = createSeededVault();
  const next = {};
  Object.entries(vault).forEach(([id, entry]) => {
    if (!entry?.profile) return;
    const cleanedWorkouts = (entry.loggedWorkouts || []).filter(
      (w) => w && w.category !== 'face_yoga' && !isFaceYogaString(w.exerciseName)
    );
    const activePlan =
      entry.profile.activePlan?.targetArea === 'yoga_face'
        ? seeded[id]?.profile?.activePlan || {
            id: 'yoga-mobility-60',
            targetArea: 'yoga_mobility',
            durationDays: 60,
            workoutLocation: 'yoga',
            title: '60-Day Vinyasa Flow & Posture Overhaul',
            badge: 'Holistic Equilibrium',
            startDate: getRelativeDateString(-10),
            currentDay: 11,
            dailyCalorieDeficit: 350,
            dailySugarLimitGrams: 18,
            workoutDaysPerWeek: 5,
          }
        : entry.profile.activePlan;

    const specialty = isFaceYogaString(entry.profile.specialty)
      ? 'Vinyasa Yoga & Mobility Flow'
      : entry.profile.specialty;

    next[id] = {
      ...entry,
      profile: {
        ...entry.profile,
        specialty,
        activePlan,
      },
      loggedWorkouts: cleanedWorkouts,
    };
  });
  return next;
}

function getInitialVaultAndUser() {
  const seeded = createSeededVault();
  try {
    const isSignedOut = localStorage.getItem(LOGGED_OUT_FLAG_KEY) === '1';
    const storedV4Raw = localStorage.getItem(VAULT_KEY);
    if (storedV4Raw) {
      const storedVault = JSON.parse(storedV4Raw) || {};
      const mergedVault = sanitizeVaultEntries({ ...seeded, ...storedVault });
      const savedActiveId = localStorage.getItem(ACTIVE_USER_ID_KEY) || 'user_alex';
      const activeId = mergedVault[savedActiveId] ? savedActiveId : 'user_alex';
      return { mergedVault, activeId, isSignedOut };
    }

    const legacyRaw = localStorage.getItem(LEGACY_VAULT_KEY_V3);
    const legacyVault = legacyRaw ? JSON.parse(legacyRaw) : null;
    const upgradedVault = sanitizeVaultEntries(legacyVault ? upgradeVaultWithSeededHistory(legacyVault) : seeded);
    const savedActiveId =
      localStorage.getItem(ACTIVE_USER_ID_KEY) ||
      localStorage.getItem(LEGACY_ACTIVE_USER_ID_KEY_V3) ||
      'user_alex';
    const activeId = upgradedVault[savedActiveId] ? savedActiveId : 'user_alex';
    localStorage.setItem(VAULT_KEY, JSON.stringify(upgradedVault));
    localStorage.setItem(ACTIVE_USER_ID_KEY, activeId);
    return { mergedVault: upgradedVault, activeId, isSignedOut };
  } catch (e) {
    return { mergedVault: seeded, activeId: 'user_alex', isSignedOut: false };
  }
}

export function AppProvider({ children, initialAuthTab = 'biometrics' }) {
  const initialBootstrap = getInitialVaultAndUser();
  const initialActive = initialBootstrap.mergedVault[initialBootstrap.activeId];
  const initialConfig = getInitialPlatformConfig();

  const [activeTabState, setActiveTabState] = useState(() => {
    const pathname = getCurrentPathname();
    if (isAdminPathname(pathname)) return 'home';
    return getTabFromPathname(pathname);
  }); // 'home' | 'fitness' | 'food' | 'shop' | 'dashboard' | 'about'
  const [fitnessSubTab, setFitnessSubTab] = useState('hiit_leap'); // 'hiit_leap' | 'yoga' | 'home_hub' | 'calisthenics' | 'archive'
  const [profilesVault, setProfilesVault] = useState(initialBootstrap.mergedVault);
  const [user, setUser] = useState(() => ({
    ...initialActive.profile,
    role: initialActive.profile?.role || (initialActive.profile?.id === 'user_alex' ? 'admin' : 'member'),
    status: initialActive.profile?.status || 'active',
    isLoggedIn: initialBootstrap.isSignedOut ? false : initialActive.profile.isLoggedIn !== false,
  }));
  const [fontSizeScale, setFontSizeScale] = useState('normal');
  const [weightHistory, setWeightHistory] = useState(initialActive.weightHistory || []);
  const [loggedWorkouts, setLoggedWorkouts] = useState(initialActive.loggedWorkouts || []);
  const [loggedMeals, setLoggedMeals] = useState(initialActive.loggedMeals || []);
  const [snoozeUntil, setSnoozeUntil] = useState(initialActive.snoozeUntil || null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState(initialAuthTab);
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState(null);
  const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] = useState(false);
  const [activeGuidedSession, setActiveGuidedSession] = useState(null);

  // Standalone Admin Auth Session State (persists cleanly in sessionStorage)
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Production Platform CRUD Configuration State
  const [siteSettings, setSiteSettings] = useState(initialConfig.siteSettings);
  const [seoSettings, setSeoSettings] = useState(initialConfig.seoSettings || INITIAL_SEO_SETTINGS);
  const [customExercises, setCustomExercises] = useState(initialConfig.customExercises);
  const [disabledExerciseIds, setDisabledExerciseIds] = useState(initialConfig.disabledExerciseIds);
  const [exerciseOverrides, setExerciseOverrides] = useState(initialConfig.exerciseOverrides);
  const [customFoods, setCustomFoods] = useState(initialConfig.customFoods);
  const [disabledFoodIds, setDisabledFoodIds] = useState(initialConfig.disabledFoodIds);
  const [foodOverrides, setFoodOverrides] = useState(initialConfig.foodOverrides);
  const [managedPlans, setManagedPlans] = useState(initialConfig.managedPlans);
  const [shopProducts, setShopProducts] = useState(initialConfig.shopProducts);
  const [paymentTransactions, setPaymentTransactions] = useState(initialConfig.paymentTransactions);
  const [supportTickets, setSupportTickets] = useState(
    initialConfig.supportTickets || INITIAL_SUPPORT_TICKETS
  );

  const [languageState, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      // ignore
    }
    return initialActive?.profile?.language || initialConfig?.siteSettings?.defaultLanguage || 'en';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const meta = getLanguageMeta(languageState);
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir;
  }, [languageState]);

  const setLanguage = (langCode = 'en') => {
    const meta = getLanguageMeta(langCode);
    setLanguageState(meta.code);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, meta.code);
    } catch (e) {
      // ignore
    }
    setUser((prev) => ({ ...prev, language: meta.code }));
  };

  const t = (key, fallback = '') => translate(languageState, key, fallback);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => {
      const p = getCurrentPathname();
      if (!isAdminPathname(p)) {
        const nextTab = getTabFromPathname(p);
        setActiveTabState(nextTab === 'shop' && siteSettings?.shopEnabled === false ? 'home' : nextTab);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [siteSettings?.shopEnabled]);

  const setActiveTab = (nextTab) => {
    if (nextTab === 'shop' && siteSettings?.shopEnabled === false) {
      setActiveTabState('home');
      navigateTo('/');
      return;
    }
    if (nextTab === 'admin') {
      setActiveTabState('home');
      navigateTo('/');
      return;
    }
    setActiveTabState(nextTab);
    navigateTo(getPathnameForTab(nextTab));
  };

  useEffect(() => {
    if (activeTabState === 'shop' && siteSettings?.shopEnabled === false) {
      setActiveTabState('home');
    }
  }, [activeTabState, siteSettings?.shopEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PLATFORM_CONFIG_KEY,
        JSON.stringify({
          siteSettings,
          seoSettings,
          pricing99Migrated: true,
          customExercises,
          disabledExerciseIds,
          exerciseOverrides,
          customFoods,
          disabledFoodIds,
          foodOverrides,
          managedPlans,
          shopProducts,
          paymentTransactions,
          supportTickets,
        })
      );
    } catch (e) {
      // ignore storage quota errors
    }
  }, [
    siteSettings,
    seoSettings,
    customExercises,
    disabledExerciseIds,
    exerciseOverrides,
    customFoods,
    disabledFoodIds,
    foodOverrides,
    managedPlans,
    shopProducts,
    paymentTransactions,
    supportTickets,
  ]);

  const adminLogin = (emailInput = '', passwordInput = '') => {
    const email = emailInput.trim().toLowerCase();
    const pass = passwordInput.trim();
    const expectedPass = siteSettings?.adminPasscode || 'FitArc@2026';

    const matchedAdminUser = Object.values(profilesVault || {}).find(
      (entry) =>
        entry?.profile?.role === 'admin' &&
        (entry?.profile?.email || '').toLowerCase() === email
    )?.profile;

    const isDefaultAdmin = email === 'admin@fitarc.elite' || email === 'admin@fitarc.com';

    if ((!isDefaultAdmin && !matchedAdminUser) || pass !== expectedPass) {
      return { ok: false, error: 'Invalid admin email or passcode.' };
    }

    const sessionPayload = {
      email: matchedAdminUser?.email || email,
      name: matchedAdminUser?.name || 'FitArc Super Admin',
      role: 'admin',
      loggedInAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
    } catch (e) {
      // ignore
    }
    setAdminSession(sessionPayload);
    return { ok: true, session: sessionPayload };
  };

  const adminLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      // ignore
    }
    setAdminSession(null);
  };

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

  useEffect(() => {
    const scaleMap = {
      normal: '100%',
      medium: '108%',
      large: '118%',
      xlarge: '128%',
    };
    document.documentElement.style.fontSize = scaleMap[fontSizeScale] || '100%';
  }, [fontSizeScale]);

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
        safeStorageSet(VAULT_KEY, JSON.stringify(updatedVault));
        safeStorageSet(ACTIVE_USER_ID_KEY, user.id);
        return updatedVault;
      });
    } catch (e) {
      console.warn('Could not write to local storage', e);
    }
  }, [user, weightHistory, loggedWorkouts, loggedMeals, snoozeUntil]);

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

  const snoozeWeightReminder = (days = 1) => {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    setSnoozeUntil(snoozeDate.toISOString());
    setIsWeightModalOpen(false);
  };

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

  const deleteWorkout = (id) => {
    setLoggedWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const deleteMeal = (id) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  };

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

  const loadVaultEntry = (targetId, entry, updatedVaultSnapshot = null) => {
    const safeVault = updatedVaultSnapshot || buildVaultWithActiveState();
    setProfilesVault(safeVault);
    safeStorageSet(VAULT_KEY, JSON.stringify(safeVault));
    safeStorageRemove(LOGGED_OUT_FLAG_KEY);
    setUser({ ...entry.profile, isLoggedIn: true });
    setWeightHistory(entry.weightHistory || []);
    setLoggedWorkouts(entry.loggedWorkouts || []);
    setLoggedMeals(entry.loggedMeals || []);
    setSnoozeUntil(entry.snoozeUntil || null);
    safeStorageSet(ACTIVE_USER_ID_KEY, targetId);
  };

  const loginWithPhone = (
    phoneNumber,
    otpCode,
    fullName = '',
    startingWeight = 75.0,
    emailAddress = ''
  ) => {
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const cleanEmail = (emailAddress || '').trim().toLowerCase();
    const profileId = `phone_${cleanDigits}`;

    const currentVault = { ...profilesVault };
    if (currentVault[profileId]) {
      const existingEntry = currentVault[profileId];
      const mergedEntry = {
        ...existingEntry,
        profile: {
          ...existingEntry.profile,
          ...(cleanEmail ? { email: cleanEmail } : {}),
          ...(fullName ? { name: existingEntry.profile?.name || fullName } : {}),
        },
      };
      loadVaultEntry(profileId, mergedEntry);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || `Athlete ${cleanDigits.slice(-4)}`,
        phone: phoneNumber,
        email: cleanEmail,
        role: 'member',
        status: 'active',
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
        hasPaidPlan: false,
        planBillingCycle: null,
        memberTier: 'Free Starter',
        loginMethod: 'phone',
        specialty: 'Beginner Vault Profile',
        activePlan: null,
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
      safeStorageSet(VAULT_KEY, JSON.stringify(updated));
      loadVaultEntry(profileId, newEntry);
    }
    triggerConfetti();
  };

  const loginWithEmail = (
    emailAddress,
    password = '',
    fullName = '',
    startingWeight = 75.0,
    phoneNumber = ''
  ) => {
    const cleanEmail = emailAddress.trim().toLowerCase();
    const cleanPhone = (phoneNumber || '').trim();
    const profileId = `email_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    const currentVault = { ...profilesVault };
    if (currentVault[profileId]) {
      const existingEntry = currentVault[profileId];
      const mergedEntry = {
        ...existingEntry,
        profile: {
          ...existingEntry.profile,
          ...(cleanPhone ? { phone: cleanPhone } : {}),
          ...(fullName ? { name: existingEntry.profile?.name || fullName } : {}),
        },
      };
      loadVaultEntry(profileId, mergedEntry);
    } else {
      const newProfile = {
        id: profileId,
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: cleanPhone,
        role: 'member',
        status: 'active',
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
        hasPaidPlan: false,
        planBillingCycle: null,
        memberTier: 'Free Starter',
        loginMethod: 'email',
        specialty: 'Beginner Vault Profile',
        activePlan: null,
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
      safeStorageSet(VAULT_KEY, JSON.stringify(updated));
      loadVaultEntry(profileId, newEntry);
    }
    triggerConfetti();
  };

  const switchUserProfile = (targetUserId) => {
    const syncedVault = buildVaultWithActiveState();
    const target = syncedVault[targetUserId];
    if (target) {
      loadVaultEntry(targetUserId, target, syncedVault);
      triggerConfetti();
    }
  };

  const logoutUser = () => {
    const syncedVault = buildVaultWithActiveState();
    setProfilesVault(syncedVault);
    safeStorageSet(VAULT_KEY, JSON.stringify(syncedVault));
    safeStorageSet(LOGGED_OUT_FLAG_KEY, '1');
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setAuthModalTab('auth');
    setIsAuthModalOpen(true);
  };

  const currentUserHealthPoints = calculateUserHealthPoints({
    loggedWorkouts,
    loggedMeals,
  });

  const getTopHealthLeaderboard = (limit = 10) => {
    const liveVault = buildVaultWithActiveState();
    const activeSnapshot =
      user?.id && user?.isLoggedIn
        ? {
            profile: user,
            loggedWorkouts,
            loggedMeals,
          }
        : null;
    return buildTopHealthLeaderboard(liveVault, activeSnapshot, limit);
  };

  const getAllSavedProfiles = () => [];

  const resetDemoData = () => {
    const freshSeed = createSeededVault();
    safeStorageRemove(LOGGED_OUT_FLAG_KEY);
    setProfilesVault(freshSeed);
    safeStorageSet(VAULT_KEY, JSON.stringify(freshSeed));
    loadVaultEntry('user_alex', freshSeed['user_alex'], freshSeed);
    triggerConfetti();
  };

  const hasPaidPlan =
    user?.hasPaidPlan !== undefined
      ? Boolean(user.hasPaidPlan)
      : Boolean(
          user?.activePlan &&
            !user?.activePlan?.isCustomUserPlan &&
            user?.memberTier !== 'Free Starter' &&
            user?.memberTier !== 'Free' &&
            user?.memberTier !== 'Verified Starter'
        );

  const advancedUnlocked = Boolean(
    hasPaidPlan || siteSettings?.lockAdvancedForFreeUsers === false
  );

  const openPlanUpgradeModal = (reason = null) => {
    setUpgradeModalReason(reason || null);
    setIsPlanModalOpen(true);
  };

  const downgradeToFreePlan = () => {
    setUser((prev) => ({
      ...prev,
      hasPaidPlan: false,
      planBillingCycle: null,
      memberTier: 'Free Starter',
      activePlan: prev.activePlan?.isCustomUserPlan ? prev.activePlan : null,
    }));
  };

  const selectTransformationPlan = (plan, paymentDetails = null) => {
    const nextTier = paymentDetails?.tierGranted || plan.tierGranted || 'Pro Athlete';
    setUser((prev) => ({
      ...prev,
      hasPaidPlan: true,
      planBillingCycle: paymentDetails?.billingCycle || 'monthly',
      memberTier: nextTier,
      activePlan: {
        ...plan,
        startDate: getTodayDateString(),
        currentDay: 1,
      },
    }));
    setUpgradeModalReason(null);

    if (paymentDetails) {
      const trx = {
        id: `TRX-${Math.floor(10000 + Math.random() * 89999)}`,
        userId: user.id,
        userName: user.name || 'FitArc Athlete',
        userEmail: user.email || user.phone || 'vault@fitarc.elite',
        itemType: 'plan',
        itemId: plan.id,
        itemName: `${plan.title} (${paymentDetails.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} · ${plan.workoutLocation || 'home'})`,
        tierGranted: nextTier,
        billingCycle: paymentDetails.billingCycle || 'monthly',
        amountINR: Number(paymentDetails.amountINR ?? plan.priceINR ?? 99),
        discountApplied: Number(paymentDetails.discountPercent || 0),
        method: paymentDetails.method || 'UPI Instant',
        status: paymentDetails.status || 'Completed',
        createdAt: getTodayDateString(),
      };
      setPaymentTransactions((prev) => [trx, ...prev]);
    }
    triggerConfetti();
  };

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

  // =========================================================================
  // HEALTHIFY WELLNESS TELEMETRY, LEAP CHALLENGE & CUSTOM USER PLANS
  // =========================================================================
  const todayKey = getTodayDateString();
  const rawDailyWellness = user?.dailyWellnessByDate?.[todayKey] || {};
  const wellnessToday = {
    waterMl: rawDailyWellness.waterMl ?? 1250,
    waterTargetMl: Math.round((Number(user?.dailyWaterTargetLiters) || 3.5) * 1000),
    steps: rawDailyWellness.steps ?? 4280,
    stepsTarget: rawDailyWellness.stepsTarget ?? 8500,
    sleepHours: rawDailyWellness.sleepHours ?? 7.5,
    fastingStartedAt: rawDailyWellness.fastingStartedAt ?? null,
    challengeDaysCompleted: Array.isArray(user?.challengeDaysCompleted)
      ? user.challengeDaysCompleted
      : [1, 2, 3, 4],
    customUserPlans: Array.isArray(user?.customUserPlans) ? user.customUserPlans : [],
  };

  const updateTodayWellness = (partial) => {
    setUser((prev) => ({
      ...prev,
      dailyWellnessByDate: {
        ...(prev.dailyWellnessByDate || {}),
        [todayKey]: {
          waterMl: prev.dailyWellnessByDate?.[todayKey]?.waterMl ?? 1250,
          steps: prev.dailyWellnessByDate?.[todayKey]?.steps ?? 4280,
          sleepHours: prev.dailyWellnessByDate?.[todayKey]?.sleepHours ?? 7.5,
          fastingStartedAt: prev.dailyWellnessByDate?.[todayKey]?.fastingStartedAt ?? null,
          ...partial,
        },
      },
    }));
  };

  const addWaterIntake = (deltaMl = 250) => {
    const nextWater = Math.max(0, (wellnessToday.waterMl || 0) + Number(deltaMl));
    updateTodayWellness({ waterMl: nextWater });
  };

  const updateDailySteps = (nextSteps) => {
    const parsed = Math.max(0, Math.round(Number(nextSteps) || 0));
    updateTodayWellness({ steps: parsed });
  };

  const updateSleepHours = (hours) => {
    const clamped = Math.max(0, Math.min(16, Math.round((Number(hours) || 0) * 10) / 10));
    updateTodayWellness({ sleepHours: clamped });
  };

  const toggleFasting = () => {
    const isActive = Boolean(wellnessToday.fastingStartedAt);
    updateTodayWellness({ fastingStartedAt: isActive ? null : Date.now() });
  };

  const completeChallengeDay = (dayNumber) => {
    const d = Number(dayNumber);
    if (!d || d < 1 || d > 30) return;
    setUser((prev) => {
      const existing = Array.isArray(prev.challengeDaysCompleted) ? prev.challengeDaysCompleted : [1, 2, 3, 4];
      const next = existing.includes(d) ? existing : [...existing, d].sort((a, b) => a - b);
      return { ...prev, challengeDaysCompleted: next };
    });
  };

  const saveCustomUserPlan = (customPlan, activateNow = true) => {
    if (!customPlan) return;
    setUser((prev) => {
      const prevCustom = Array.isArray(prev.customUserPlans) ? prev.customUserPlans : [];
      const existsIdx = prevCustom.findIndex((p) => p.id === customPlan.id);
      const nextCustom =
        existsIdx >= 0
          ? prevCustom.map((p, i) => (i === existsIdx ? customPlan : p))
          : [customPlan, ...prevCustom];
      return {
        ...prev,
        customUserPlans: nextCustom,
        ...(activateNow
          ? {
              activePlan: {
                ...customPlan,
                startDate: getTodayDateString(),
                currentDay: 1,
              },
            }
          : {}),
      };
    });
    if (activateNow) triggerConfetti();
  };

  const deleteCustomUserPlan = (planId) => {
    setUser((prev) => ({
      ...prev,
      customUserPlans: (prev.customUserPlans || []).filter((p) => p.id !== planId),
    }));
  };

  // =========================================================================
  // FULL ADMIN CRUD OPERATIONS (Synced Live With Frontend Views)
  // =========================================================================
  const adminUpdateSiteSettings = (partial) => {
    setSiteSettings((prev) => ({
      ...prev,
      ...partial,
      socialLinks: {
        ...prev.socialLinks,
        ...(partial.socialLinks || {}),
      },
      paymentGateway: {
        ...prev.paymentGateway,
        ...(partial.paymentGateway || {}),
      },
    }));
  };

  const adminUpdateSeoSettings = (pageKey, partial) => {
    setSeoSettings((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || INITIAL_SEO_SETTINGS[pageKey] || INITIAL_SEO_SETTINGS.home),
        ...partial,
      },
    }));
  };

  const adminUpsertUser = (userId, profileUpdates) => {
    setProfilesVault((prev) => {
      const existing = prev[userId];
      if (!existing) return prev;
      const updatedProfile = { ...existing.profile, ...profileUpdates };
      const next = {
        ...prev,
        [userId]: {
          ...existing,
          profile: updatedProfile,
        },
      };
      safeStorageSet(VAULT_KEY, JSON.stringify(next));
      return next;
    });
    if (user?.id === userId) {
      setUser((prev) => ({ ...prev, ...profileUpdates }));
    }
  };

  const adminCreateUser = (newUserFields) => {
    const uid = `user_${Date.now().toString(36)}`;
    const weight = parseFloat(newUserFields.currentWeight) || 74.0;
    const targetW = parseFloat(newUserFields.targetWeight) || Math.round(weight * 0.92 * 10) / 10;
    const entry = {
      profile: {
        id: uid,
        name: newUserFields.name || 'New Athlete',
        email: newUserFields.email || `${uid}@fitarc.elite`,
        phone: newUserFields.phone || '',
        role: newUserFields.role || 'member',
        status: 'active',
        currentWeight: weight,
        targetWeight: targetW,
        startWeight: weight,
        height: parseInt(newUserFields.height, 10) || 176,
        age: parseInt(newUserFields.age, 10) || 27,
        gender: newUserFields.gender || 'male',
        unit: 'kg',
        goal: newUserFields.goal || 'fat_loss',
        bodyFat: parseFloat(newUserFields.bodyFat) || 18.0,
        dailyCalorieTarget: parseInt(newUserFields.dailyCalorieTarget, 10) || 2150,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: false,
        hasPaidPlan: Boolean(newUserFields.hasPaidPlan),
        planBillingCycle: newUserFields.hasPaidPlan ? (newUserFields.planBillingCycle || 'monthly') : null,
        language: newUserFields.language || languageState || 'en',
        memberTier: newUserFields.hasPaidPlan
          ? (newUserFields.memberTier || 'Pro Athlete')
          : 'Free Starter',
        loginMethod: 'email',
        specialty: 'Admin Provisioned',
      },
      weightHistory: [{ date: getTodayDateString(), weight, note: 'Admin Initialized' }],
      loggedWorkouts: [],
      loggedMeals: [],
      snoozeUntil: null,
    };
    setProfilesVault((prev) => {
      const next = { ...prev, [uid]: entry };
      safeStorageSet(VAULT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const adminDeleteUser = (userId) => {
    if (userId === user?.id) return;
    setProfilesVault((prev) => {
      const next = { ...prev };
      delete next[userId];
      safeStorageSet(VAULT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const adminUpsertExercise = (exerciseObj) => {
    const fallbackGif =
      exerciseObj?.subCategory === 'exercise_ball'
        ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif'
        : exerciseObj?.category === 'yoga'
        ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif'
        : 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif';

    if (!exerciseObj?.id) {
      const created = {
        id: `custom-ex-${Date.now().toString(36)}`,
        name: exerciseObj?.name || 'Custom Movement',
        category: exerciseObj?.category || 'home_workout',
        subCategory: exerciseObj?.subCategory || exerciseObj?.category || 'home_workout',
        level: exerciseObj?.level || 'Intermediate',
        muscleCategory: exerciseObj?.muscleCategory || 'Full Body',
        muscle: (exerciseObj?.muscleCategory || 'full-body').toLowerCase(),
        equipment: exerciseObj?.equipment || 'bodyweight',
        equipmentLabel: exerciseObj?.equipmentLabel || exerciseObj?.equipment || 'Custom Equipment',
        tagline: exerciseObj?.tagline || 'Admin-managed precision exercise movement.',
        metScore: Number(exerciseObj?.metScore) || 5.5,
        hypertrophyRate: 0.78,
        gifUrl: exerciseObj?.gifUrl || fallbackGif,
        tier: exerciseObj?.tier || 'Tier 1: Foundation',
        badge: exerciseObj?.badge || 'Admin Custom',
        defaultReps: exerciseObj?.defaultReps || '12 Reps',
        primaryMuscles: [{ name: exerciseObj?.muscleCategory || 'Core & Stabilizers', percentage: 90, color: '#f59e0b' }],
        setupSteps: ['Adopt neutral alignment and controlled core bracing.'],
        formSteps: ['Execute smooth eccentric and concentric movement control.'],
        commonMistakes: ['Rushing tempo or sacrificing full range of motion.'],
        proTip: exerciseObj?.proTip || 'Added via FitArc Admin Exercise Studio.',
        isCustom: true,
      };
      setCustomExercises((prev) => [created, ...prev]);
      return;
    }

    const isCustom = customExercises.some((e) => e.id === exerciseObj.id);
    if (isCustom) {
      setCustomExercises((prev) => prev.map((e) => (e.id === exerciseObj.id ? { ...e, ...exerciseObj } : e)));
    } else {
      setExerciseOverrides((prev) => ({
        ...prev,
        [exerciseObj.id]: { ...(prev[exerciseObj.id] || {}), ...exerciseObj },
      }));
    }
  };

  const adminToggleExerciseDisabled = (exerciseId) => {
    setDisabledExerciseIds((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const adminDeleteCustomExercise = (exerciseId) => {
    setCustomExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  const adminResetExerciseOverride = (exerciseId) => {
    setExerciseOverrides((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  };

  // Food / Recipes CRUD
  const adminUpsertFood = (foodObj) => {
    const title = foodObj?.title || foodObj?.name || 'Custom Nutrition Recipe';
    if (!foodObj?.id) {
      const created = {
        id: `custom-food-${Date.now().toString(36)}`,
        title,
        name: title,
        subtitle: foodObj?.subtitle || 'High-protein balanced macro meal added in Admin Studio.',
        description: foodObj?.description || foodObj?.subtitle || 'Admin-managed balanced macro meal.',
        category: foodObj?.category || 'lunch',
        diet: foodObj?.diet || 'veg',
        cookTime: foodObj?.cookTime || '12 min',
        prepTime: '5 min',
        servings: 1,
        calories: Number(foodObj?.calories) || 420,
        protein: Number(foodObj?.protein) || 35,
        carbs: Number(foodObj?.carbs) || 38,
        fats: Number(foodObj?.fats) || 12,
        fiber: Number(foodObj?.fiber) || 6,
        sugar: Number(foodObj?.sugar) || 3,
        image:
          foodObj?.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=75',
        tags: foodObj?.tags || ['High Protein', 'Admin Curated'],
        ingredients: foodObj?.ingredients || [
          { name: 'Primary Protein Source', measurement: '150g', weightGrams: 150, notes: 'Cooked lean' },
          { name: 'Complex Carbs & Greens', measurement: '1 bowl', weightGrams: 180, notes: 'Fresh' },
        ],
        instructions: ['Combine prepared protein base with measured vegetables and serve fresh.'],
        isCustom: true,
      };
      setCustomFoods((prev) => [created, ...prev]);
      return;
    }

    const isCustom = customFoods.some((f) => f.id === foodObj.id);
    if (isCustom) {
      setCustomFoods((prev) => prev.map((f) => (f.id === foodObj.id ? { ...f, ...foodObj, title, name: title } : f)));
    } else {
      setFoodOverrides((prev) => ({
        ...prev,
        [foodObj.id]: { ...(prev[foodObj.id] || {}), ...foodObj, title, name: title },
      }));
    }
  };

  const adminToggleFoodDisabled = (foodId) => {
    setDisabledFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const adminDeleteCustomFood = (foodId) => {
    setCustomFoods((prev) => prev.filter((f) => f.id !== foodId));
  };

  const adminResetFoodOverride = (foodId) => {
    setFoodOverrides((prev) => {
      const next = { ...prev };
      delete next[foodId];
      return next;
    });
  };

  // Plans CRUD
  const adminUpsertPlan = (planObj) => {
    setManagedPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === planObj.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...planObj };
        return copy;
      }
      return [
        {
          id: planObj.id || `plan-${Date.now().toString(36)}`,
          targetArea: planObj.targetArea || 'overall_fat',
          durationDays: Number(planObj.durationDays) || 30,
          title: planObj.title || 'Custom Protocol',
          badge: planObj.badge || 'Admin Custom',
          dailyCalorieDeficit: Number(planObj.dailyCalorieDeficit) || 400,
          dailySugarLimitGrams: Number(planObj.dailySugarLimitGrams) || 22,
          workoutDaysPerWeek: Number(planObj.workoutDaysPerWeek) || 5,
          focus: planObj.focus || 'Customized fat loss & conditioning.',
          description: planObj.description || 'Managed transformation plan created in Admin Studio.',
          priceINR: Number(planObj.priceINR) || 999,
          mrpINR: Number(planObj.mrpINR) || 1499,
          tierGranted: planObj.tierGranted || 'Pro Athlete',
          active: planObj.active !== false,
          recommendedExercises: ['yoga-mat-001', 'yoga-ball-001'],
          dailyChecklist: planObj.dailyChecklist || [
            'Complete scheduled FitArc workout',
            'Hit daily protein target',
            'Stay under daily sugar cap',
          ],
        },
        ...prev,
      ];
    });
  };

  const adminDeletePlan = (planId) => {
    setManagedPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  // Payments CRUD
  const adminUpdateTransactionStatus = (trxId, nextStatus) => {
    setPaymentTransactions((prev) =>
      prev.map((trx) => {
        if (trx.id !== trxId) return trx;
        if (nextStatus === 'Completed' && trx.userId && trx.tierGranted) {
          adminUpsertUser(trx.userId, { memberTier: trx.tierGranted });
        }
        return { ...trx, status: nextStatus };
      })
    );
  };

  const adminRecordManualPayment = (payload) => {
    const trx = {
      id: `TRX-${Math.floor(10000 + Math.random() * 89999)}`,
      userId: payload.userId || user.id,
      userName: payload.userName || user.name,
      userEmail: payload.userEmail || user.email || '',
      itemType: 'plan',
      itemId: payload.itemId || 'manual-upgrade',
      itemName: payload.itemName || 'Manual Admin Plan Grant',
      tierGranted: payload.tierGranted || 'Gold Elite Pro',
      amountINR: Number(payload.amountINR) || 0,
      discountApplied: 0,
      method: payload.method || 'Admin Manual Entry',
      status: payload.status || 'Completed',
      createdAt: getTodayDateString(),
    };
    setPaymentTransactions((prev) => [trx, ...prev]);
    if (trx.status === 'Completed' && trx.userId && trx.tierGranted) {
      adminUpsertUser(trx.userId, { memberTier: trx.tierGranted });
    }
  };

  const adminDeleteTransaction = (trxId) => {
    setPaymentTransactions((prev) => prev.filter((t) => t.id !== trxId));
  };

  // Shop CRUD + Bulk Import
  const adminUpsertShopItem = (itemObj) => {
    const defaultFallbacks = {
      whey_protein: '/shop/whey.svg',
      protein_bars: '/shop/bar.svg',
      muesli_oats: '/shop/muesli.svg',
      shakes_plant: '/shop/shake.svg',
      creatine_recovery: '/shop/creatine.svg',
    };
    const cat = itemObj?.category || 'whey_protein';

    setShopProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === itemObj.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...itemObj };
        return copy;
      }
      return [
        {
          id: itemObj.id || `shop-${Date.now().toString(36)}`,
          issueTag: itemObj.issueTag || 'ADMIN MAGAZINE ADD',
          name: itemObj.name || 'New High-Protein Product',
          brand: itemObj.brand || 'Verified Brand',
          category: cat,
          flavor: itemObj.flavor || '1 kg',
          imageUrl: itemObj.imageUrl || defaultFallbacks[cat] || '/shop/whey.svg',
          fallbackImage: itemObj.fallbackImage || defaultFallbacks[cat] || '/shop/whey.svg',
          priceINR: Number(itemObj.priceINR) || 1999,
          mrpINR: Number(itemObj.mrpINR) || 2499,
          proteinPerServing: Number(itemObj.proteinPerServing) || 24,
          carbsPerServing: Number(itemObj.carbsPerServing) ?? 3,
          fatPerServing: Number(itemObj.fatPerServing) ?? 1.5,
          fiberPerServing: Number(itemObj.fiberPerServing) ?? 1.0,
          servingSizeGrams: Number(itemObj.servingSizeGrams) || 32,
          caloriesPerServing: Number(itemObj.caloriesPerServing) || 128,
          sugarPerServing: Number(itemObj.sugarPerServing) ?? 0,
          rating: Number(itemObj.rating) || 4.7,
          reviewsCount: itemObj.reviewsCount || '1.2k',
          trustifiedStatus: itemObj.trustifiedStatus || 'certified',
          trustifiedBadge:
            itemObj.trustifiedStatus === 'certified' ? 'Trustified™ Certified Pass' : 'Check Batch on Trustified.in',
          labNote: itemObj.labNote || 'High-protein nutrition item managed via FitArc Admin Store.',
          highlights: itemObj.highlights || ['High Protein', 'Clean Label'],
          amazonUrl: itemObj.amazonUrl || 'https://www.amazon.in/s?k=' + encodeURIComponent(itemObj.name || 'whey protein'),
          flipkartUrl: itemObj.flipkartUrl || 'https://www.flipkart.com/search?q=' + encodeURIComponent(itemObj.name || 'whey protein'),
          inStock: itemObj.inStock !== false,
          featured: Boolean(itemObj.featured),
          accentGradient: 'from-amber-500/20 to-obsidian-900',
        },
        ...prev,
      ];
    });
  };

  const adminDeleteShopItem = (itemId) => {
    setShopProducts((prev) => prev.filter((p) => p.id !== itemId));
  };

  const adminBulkImportShopItems = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setShopProducts((prev) => {
      const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
      const fresh = items.filter((item) => item?.name && !existingNames.has(item.name.toLowerCase()));
      return [...fresh, ...prev];
    });
  };

  // Help & Support Ticket Submission + Admin Support Inbox Operations
  const submitSupportTicket = (payload) => {
    const newTicket = {
      id: `SUP-${Math.floor(1000 + Math.random() * 8999)}`,
      userId: user?.id || 'guest',
      userName: payload.userName || user?.name || 'Athlete Guest',
      userEmail: payload.userEmail || user?.email || user?.phone || 'guest@fitarc.app',
      category: payload.category || 'General Support',
      subject: payload.subject || 'Assistance Needed',
      message: payload.message || '',
      status: 'Open',
      adminReply: '',
      createdAt: getTodayDateString(),
      updatedAt: getTodayDateString(),
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const adminReplySupportTicket = (ticketId, replyText, nextStatus = 'Resolved') => {
    setSupportTickets((prev) =>
      prev.map((tk) =>
        tk.id === ticketId
          ? {
              ...tk,
              adminReply: replyText,
              status: nextStatus || 'Resolved',
              updatedAt: getTodayDateString(),
            }
          : tk
      )
    );
  };

  const adminUpdateTicketStatus = (ticketId, nextStatus) => {
    setSupportTickets((prev) =>
      prev.map((tk) =>
        tk.id === ticketId
          ? { ...tk, status: nextStatus, updatedAt: getTodayDateString() }
          : tk
      )
    );
  };

  const adminDeleteSupportTicket = (ticketId) => {
    setSupportTickets((prev) => prev.filter((tk) => tk.id !== ticketId));
  };

  const adminResetPlatform = () => {
    const def = buildDefaultPlatformConfig();
    setSiteSettings(def.siteSettings);
    setSeoSettings(def.seoSettings);
    setCustomExercises(def.customExercises);
    setDisabledExerciseIds(def.disabledExerciseIds);
    setExerciseOverrides(def.exerciseOverrides);
    setCustomFoods(def.customFoods);
    setDisabledFoodIds(def.disabledFoodIds);
    setFoodOverrides(def.foodOverrides);
    setManagedPlans(def.managedPlans);
    setShopProducts(def.shopProducts);
    setPaymentTransactions(def.paymentTransactions);
    setSupportTickets(def.supportTickets);
    safeStorageSet(PLATFORM_CONFIG_KEY, JSON.stringify(def));
    triggerConfetti();
  };

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
  const bmi = Math.round(((user.currentWeight || 75) / (((user.height || 180) / 100) ** 2)) * 10) / 10;

  const value = {
    activeTab: activeTabState,
    setActiveTab,
    language: languageState,
    setLanguage,
    t,
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
    upgradeModalReason,
    setUpgradeModalReason,
    openPlanUpgradeModal,
    downgradeToFreePlan,
    hasPaidPlan,
    advancedUnlocked,
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
    currentUserHealthPoints,
    getTopHealthLeaderboard,
    profilesVault,
    isMealScannerOpen,
    setIsMealScannerOpen,
    isCustomPlanModalOpen,
    setIsCustomPlanModalOpen,
    activeGuidedSession,
    setActiveGuidedSession,
    wellnessToday,
    addWaterIntake,
    updateDailySteps,
    updateSleepHours,
    toggleFasting,
    completeChallengeDay,
    saveCustomUserPlan,
    deleteCustomUserPlan,
    totalCaloriesBurned,
    totalWorkoutMinutes,
    totalCaloriesConsumed,
    totalProtein,
    totalCarbs,
    totalFats,
    netCalories,
    resetDemoData,
    triggerConfetti,
    // Standalone Admin Session & Live Platform CRUD Exports
    adminSession,
    adminLogin,
    adminLogout,
    siteSettings,
    seoSettings,
    adminUpdateSeoSettings,
    customExercises,
    disabledExerciseIds,
    exerciseOverrides,
    customFoods,
    disabledFoodIds,
    foodOverrides,
    managedPlans,
    shopProducts,
    paymentTransactions,
    supportTickets,
    submitSupportTicket,
    adminReplySupportTicket,
    adminUpdateTicketStatus,
    adminDeleteSupportTicket,
    adminUpdateSiteSettings,
    adminUpsertUser,
    adminCreateUser,
    adminDeleteUser,
    adminUpsertExercise,
    adminToggleExerciseDisabled,
    adminDeleteCustomExercise,
    adminResetExerciseOverride,
    adminUpsertFood,
    adminToggleFoodDisabled,
    adminDeleteCustomFood,
    adminResetFoodOverride,
    adminUpsertPlan,
    adminDeletePlan,
    adminUpdateTransactionStatus,
    adminRecordManualPayment,
    adminDeleteTransaction,
    adminUpsertShopItem,
    adminDeleteShopItem,
    adminBulkImportShopItems,
    adminResetPlatform,
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
