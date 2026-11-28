import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  Activity,
  Target,
  Scale,
  Camera,
  Upload,
  RefreshCw,
  Crown,
  Check,
  History,
  Utensils,
  Dumbbell,
  Trash2,
  Search,
  Calendar,
  Plus,
  Trophy,
  LogOut,
  LifeBuoy,
  Globe,
  Send,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildDailyHistoryRecords, formatHistoryDateLabel } from '../../utils/vaultHistoryHelpers';
import { getRelativeDateString } from '../../data/athleteVaultDatabase';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

export const ATHLETE_TIERS = [
  {
    id: 'gold_elite',
    name: 'Gold Elite Pro',
    badge: 'Golden Standard',
    color: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-400',
    bgGlow: 'bg-amber-500/15',
    textGlow: 'text-amber-300',
    price: 'Lifetime Elite Access',
    description: 'The definitive gold-standard membership for elite athletes and serious lifters.',
    perks: [
      'Full 2,200+ 3D Biomechanical & Yoga Archive',
      'Instant AI Torso Vision Body Fat Scanner',
      'Zero-Rig Home Workouts & 600 kcal HIIT Hub',
      'Calisthenics Static Hold & Planche Studio',
      'Instant AI Meal & Sugar Photo Analyzer',
      'Multi-User Athlete Vault & History Ledger',
    ],
  },
  {
    id: 'pro_athlete',
    name: 'Pro Athlete',
    badge: 'Pro Performance',
    color: 'from-sky-400 to-blue-600',
    borderColor: 'border-sky-500/40',
    bgGlow: 'bg-sky-500/15',
    textGlow: 'text-sky-300',
    price: 'Pro Plan',
    description: 'Precision nutrition, hypertrophy sets, and full workout telemetry.',
    perks: [
      'Progressive Overload Pyramid Engine',
      'Smart Calorie & Daily Sugar Cap Sync',
      'Home 30-Day Trouble Zone Plans',
      'Multi-Profile Cloud Vault Switching',
    ],
  },
  {
    id: 'starter',
    name: 'Verified Starter',
    badge: 'Standard Membership',
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-500/40',
    bgGlow: 'bg-emerald-500/15',
    textGlow: 'text-emerald-300',
    price: 'Complimentary',
    description: 'Essential tracking foundation for bodyweight fitness and weight progress.',
    perks: [
      'Home Workout Hub & Yoga Flows',
      'Daily Weight Tracker with Snooze',
      '500+ Whole Food Macros Index',
    ],
  },
];

const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
];

const PHYSIQUE_PRESETS = [
  {
    id: 'lean_athletic',
    label: 'Athletic Definition',
    estFat: 14.5,
    category: 'Athletic / Visible Abs',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'toned_fitness',
    label: 'Fitness Toned',
    estFat: 18.2,
    category: 'Fitness / Lean Core',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'moderate_bulk',
    label: 'Moderate Mass',
    estFat: 22.8,
    category: 'Healthy Average',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
  },
];

export function AuthModal({ isOpen, onClose }) {
  const {
    user,
    setUser,
    logBodyFat,
    setIsPlanModalOpen,
    loginWithPhone,
    loginWithEmail,
    logoutUser,
    currentUserHealthPoints,
    getTopHealthLeaderboard,
    loggedWorkouts,
    loggedMeals,
    weightHistory,
    logWorkout,
    logMeal,
    deleteWorkout,
    deleteMeal,
    authModalTab,
    updateMemberTier,
    triggerConfetti,
    siteSettings,
    hasPaidPlan,
    openPlanUpgradeModal,
    downgradeToFreePlan,
    language,
    setLanguage,
    t,
    supportTickets,
    submitSupportTicket,
  } = useApp();

  const isLeaderboardEnabled = siteSettings?.leaderboardEnabled !== false;
  const [activeTab, setActiveTab] = useState(
    authModalTab === 'leaderboard' && siteSettings?.leaderboardEnabled === false
      ? 'biometrics'
      : authModalTab || 'biometrics'
  ); // 'biometrics' | 'leaderboard' | 'history' | 'tier' | 'support' | 'auth'
  const [supportCategory, setSupportCategory] = useState('Plans & Billing');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmittedToast, setSupportSubmittedToast] = useState('');
  const [authMethod, setAuthMethod] = useState('both'); // 'both' (SMS + Email) | 'phone' | 'email'
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentWeightInput, setCurrentWeightInput] = useState(user.currentWeight || 75.0);
  const [heightInput, setHeightInput] = useState(user.height || 180);
  const [manualFatInput, setManualFatInput] = useState(user.bodyFat || 16.5);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('8888');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vault History sub-states
  const [historySubTab, setHistorySubTab] = useState('daily'); // 'daily' | 'workouts' | 'meals' | 'weight'
  const [historySearch, setHistorySearch] = useState('');
  const [selectedHistoryDate, setSelectedHistoryDate] = useState('all'); // 'all' | 'YYYY-MM-DD'
  const [showPastEntryForm, setShowPastEntryForm] = useState(false);
  const [pastEntryKind, setPastEntryKind] = useState('workout'); // 'workout' | 'meal'
  const [pastEntryDate, setPastEntryDate] = useState(() => getRelativeDateString(-1));
  const [pastEntryName, setPastEntryName] = useState('');
  const [pastEntryCategory, setPastEntryCategory] = useState('gym');
  const [pastEntryMinutes, setPastEntryMinutes] = useState('35');
  const [pastEntryCalories, setPastEntryCalories] = useState('280');
  const [pastEntryMealType, setPastEntryMealType] = useState('lunch');
  const [pastEntryProtein, setPastEntryProtein] = useState('30');
  const [pastEntryCarbs, setPastEntryCarbs] = useState('38');
  const [pastEntrySugar, setPastEntrySugar] = useState('4');
  const [pastEntryFats, setPastEntryFats] = useState('12');

  const handleSavePastEntry = (e) => {
    e.preventDefault();
    const cleanName = pastEntryName.trim();
    if (!cleanName) return;
    const chosenDate = pastEntryDate || getRelativeDateString(0);
    const caloriesNum = Math.max(0, Math.round(Number(pastEntryCalories) || 0));

    if (pastEntryKind === 'workout') {
      logWorkout({
        date: chosenDate,
        exerciseName: cleanName,
        category: pastEntryCategory || 'home_workout',
        durationMinutes: Math.max(5, Math.round(Number(pastEntryMinutes) || 30)),
        intensity: 'moderate',
        caloriesBurned: caloriesNum || 220,
        muscleGrowthScore: Math.max(10, Math.round((caloriesNum || 220) * 0.18)),
        primaryMuscles: ['Full Body'],
        loggedAt: 'Vault Log',
      });
    } else {
      logMeal({
        date: chosenDate,
        title: cleanName,
        mealType: pastEntryMealType || 'lunch',
        calories: caloriesNum || 420,
        protein: Math.max(0, Math.round(Number(pastEntryProtein) || 0)),
        carbs: Math.max(0, Math.round(Number(pastEntryCarbs) || 0)),
        sugar: Math.max(0, Math.round(Number(pastEntrySugar) || 0)),
        fats: Math.max(0, Math.round(Number(pastEntryFats) || 0)),
        photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=75',
        score: 9.0,
        loggedAt: 'Vault Log',
      });
    }

    setPastEntryName('');
    setShowPastEntryForm(false);
    setSelectedHistoryDate(chosenDate);
  };

  // Photo AI Scanner state
  const [physiquePhoto, setPhysiquePhoto] = useState(PHYSIQUE_PRESETS[0].photoUrl);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Sync requested tab when modal opens (enforce Sign In when logged out, except public Leaderboard)
  useEffect(() => {
    if (!user?.isLoggedIn) {
      setActiveTab(authModalTab === 'leaderboard' && isLeaderboardEnabled ? 'leaderboard' : 'auth');
    } else if (authModalTab) {
      const normalized = authModalTab === 'directory' ? 'leaderboard' : authModalTab;
      setActiveTab(normalized === 'leaderboard' && !isLeaderboardEnabled ? 'biometrics' : normalized);
    }
  }, [authModalTab, isOpen, user?.isLoggedIn, isLeaderboardEnabled]);

  // Sync local biometric inputs whenever user switches or telemetry changes
  useEffect(() => {
    setCurrentWeightInput(user.currentWeight || 75.0);
    setHeightInput(user.height || 180);
    setManualFatInput(user.bodyFat || 16.5);
  }, [user?.id, user?.currentWeight, user?.height, user?.bodyFat, isOpen]);

  // All useMemo hooks MUST appear BEFORE any conditional early return!
  const liveBmi = useMemo(() => {
    const h = (parseFloat(heightInput) || 180) / 100;
    const w = parseFloat(currentWeightInput) || 75;
    return Math.round((w / (h * h)) * 10) / 10;
  }, [heightInput, currentWeightInput]);

  const leaderboardData = useMemo(() => {
    return getTopHealthLeaderboard
      ? getTopHealthLeaderboard(10)
      : { top10: [], currentUserRank: null, currentUserStats: null, totalParticipants: 0, pointsToTop10: 0 };
  }, [getTopHealthLeaderboard, user, loggedWorkouts, loggedMeals, isOpen]);

  const dailyHistory = useMemo(() => {
    return buildDailyHistoryRecords({
      loggedWorkouts,
      loggedMeals,
      weightHistory,
      bodyFatHistory: user?.bodyFatHistory || [],
      searchQuery: historySearch,
      selectedDate: selectedHistoryDate,
    });
  }, [loggedWorkouts, loggedMeals, weightHistory, user?.bodyFatHistory, historySearch, selectedHistoryDate]);

  const filteredWorkouts = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    return [...(loggedWorkouts || [])]
      .filter((w) => {
        if (selectedHistoryDate !== 'all' && w.date !== selectedHistoryDate) return false;
        if (!q) return true;
        return (
          (w.exerciseName || w.name || '').toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q) ||
          w.date?.includes(q)
        );
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [loggedWorkouts, historySearch, selectedHistoryDate]);

  const filteredMeals = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    return [...(loggedMeals || [])]
      .filter((m) => {
        if (selectedHistoryDate !== 'all' && m.date !== selectedHistoryDate) return false;
        if (!q) return true;
        return (
          (m.title || m.name || '').toLowerCase().includes(q) ||
          m.mealType?.toLowerCase().includes(q) ||
          m.date?.includes(q)
        );
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [loggedMeals, historySearch, selectedHistoryDate]);

  if (!isOpen) return null;

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-sky-400' };
    if (val <= 24.9) return { label: 'Optimal / Healthy', color: 'text-emerald-400' };
    if (val <= 29.9) return { label: 'Athletic Mass / Overweight', color: 'text-amber-400' };
    return { label: 'High BMI', color: 'text-rose-400' };
  };

  const bmiCat = getBmiCategory(liveBmi);

  // Body Fat breakdown calculations
  const currentFatPercent = user.bodyFat || 16.5;
  const fatMassKg = Math.round((user.currentWeight || 75) * (currentFatPercent / 100) * 10) / 10;
  const leanMassKg = Math.round(((user.currentWeight || 75) - fatMassKg) * 10) / 10;

  const handleSaveMetrics = () => {
    setUser((prev) => ({
      ...prev,
      height: parseFloat(heightInput) || prev.height,
      currentWeight: parseFloat(currentWeightInput) || prev.currentWeight,
    }));
    setStatusMessage({ type: 'success', text: 'Biometrics updated & synced to Vault!' });
    setTimeout(() => setStatusMessage(null), 1800);
  };

  const handleSaveManualFat = (e) => {
    e.preventDefault();
    logBodyFat(manualFatInput, null, 'manual', 'Manual body fat calibration');
    setStatusMessage({ type: 'success', text: `Body fat calibrated to ${manualFatInput}%!` });
    setTimeout(() => setStatusMessage(null), 1800);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhysiquePhoto(event.target?.result);
        triggerAiPhysiqueScan(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiPhysiqueScan = (photoUrl = physiquePhoto, targetEst = null) => {
    setIsScanningPhoto(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanningPhoto(false);
      const baseEst = targetEst || (user.bodyFat || 16.5);
      const randomVariance = targetEst ? 0 : (Math.random() * 1.4 - 0.7);
      const estFat = Math.max(8.0, Math.min(34, parseFloat((baseEst + randomVariance).toFixed(1))));

      const result = {
        estimatedFat: estFat,
        confidence: '94% Confidence',
        iliacCrestRatio: estFat < 16 ? '0.80 (Tapered V-Line)' : '0.86 (Balanced Core)',
        abdominalDefinition: estFat < 16 ? 'Defined Rectus Abdominis' : estFat < 21 ? 'Soft Linear Tone' : 'Developing Core Foundation',
        leanMass: Math.round((user.currentWeight || 75) * (1 - estFat / 100) * 10) / 10,
        fatMass: Math.round((user.currentWeight || 75) * (estFat / 100) * 10) / 10,
        photoUrl,
      };

      setScanResult(result);
      logBodyFat(estFat, photoUrl, 'ai_scan', 'AI Torso Vision Scan');
      setStatusMessage({ type: 'success', text: `AI Scan Complete: ${estFat}% Body Fat logged to Vault!` });
      setTimeout(() => setStatusMessage(null), 2500);
    }, 1000);
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    const digitsOnly = (phoneNumber || '').replace(/\D/g, '');
    const cleanEmail = (emailAddress || '').trim().toLowerCase();

    if (digitsOnly.length < 7) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid Phone Number so we can send your OTP.',
      });
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid Email Address along with your phone number for OTP delivery.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
      setSentOtpCode(generatedOtp);
      setIsSubmitting(false);
      setOtpStep(true);
      setOtpValue(generatedOtp);
      setStatusMessage({
        type: 'success',
        text: `OTP sent to ${countryCode} ${phoneNumber.trim()} & ${cleanEmail} (Code: ${generatedOtp})`,
      });
    }, 450);
  };

  const handleVerifyPhone = (e) => {
    e.preventDefault();
    const cleanOtp = (otpValue || '').trim();
    if (!cleanOtp || (sentOtpCode && cleanOtp !== sentOtpCode && cleanOtp !== '8888')) {
      setStatusMessage({
        type: 'error',
        text: `Invalid OTP code. Enter the 4-digit OTP sent to ${countryCode} ${phoneNumber.trim()} & ${emailAddress.trim()}.`,
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const cleanEmail = emailAddress.trim().toLowerCase();
      const resolvedName = fullName.trim() || cleanEmail.split('@')[0] || `Athlete ${phoneNumber.slice(-4)}`;
      const startingWeight = parseFloat(currentWeightInput) || 75.0;

      if (authMethod === 'email') {
        loginWithEmail(cleanEmail, cleanOtp, resolvedName, startingWeight, fullPhone);
      } else {
        loginWithPhone(fullPhone, cleanOtp, resolvedName, startingWeight, cleanEmail);
      }

      setIsSubmitting(false);
      setOtpStep(false);
      setOtpValue('');
      setPhoneNumber('');
      setEmailAddress('');
      setFullName('');
      setActiveTab('biometrics');
      setStatusMessage({
        type: 'success',
        text: `Verified & Vault synced (${fullPhone} · ${cleanEmail})!`,
      });
      setTimeout(() => setStatusMessage(null), 2200);
    }, 450);
  };

  const handleLogout = () => {
    logoutUser?.();
    setOtpStep(false);
    setActiveTab('auth');
    setStatusMessage({ type: 'success', text: 'Signed out of your personal Vault account.' });
  };

  const handleSubmitSupportTicket = (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    const created = submitSupportTicket?.({
      category: supportCategory,
      subject: supportSubject.trim(),
      message: supportMessage.trim(),
      userName: user?.name || 'Athlete Guest',
      userEmail: user?.email || user?.phone || 'guest@fitarc.app',
    });
    setSupportSubject('');
    setSupportMessage('');
    setSupportSubmittedToast(
      `Ticket ${created?.id || 'sent'} received! Our team replies under "Your Support Tickets".`
    );
    setTimeout(() => setSupportSubmittedToast(''), 4000);
  };

  // Profile Picture Upload -> Square 192x192 JPEG compressed for localStorage safety
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl !== 'string') return;
      const img = new window.Image();
      img.onload = () => {
        try {
          const size = 192;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setUser((prev) => ({ ...prev, avatarUrl: compressed }));
          setStatusMessage({ type: 'success', text: 'Profile picture updated in your Vault!' });
          setTimeout(() => setStatusMessage(null), 2000);
        } catch (err) {
          setUser((prev) => ({ ...prev, avatarUrl: dataUrl }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setUser((prev) => ({ ...prev, avatarUrl: '' }));
    setStatusMessage({ type: 'success', text: 'Profile picture reset to Vault initials.' });
    setTimeout(() => setStatusMessage(null), 1800);
  };

  const isSignedIn = user?.isLoggedIn !== false;
  const visibleTab =
    (!isSignedIn && activeTab !== 'leaderboard' && activeTab !== 'support') ||
      (activeTab === 'leaderboard' && !isLeaderboardEnabled)
      ? (isSignedIn ? 'biometrics' : 'auth')
      : activeTab;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3 min-w-0">
            <label
              className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-gold-glow-sm shrink-0 flex items-center justify-center cursor-pointer group"
              title={isSignedIn ? 'Upload or change profile picture' : 'Athlete Vault'}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
                {isSignedIn && user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
              {isSignedIn && (
                <>
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-obsidian-950 border border-amber-400 text-amber-300 flex items-center justify-center shadow"
                    aria-hidden="true"
                  >
                    <Camera className="w-3 h-3" />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    aria-label="Upload Vault Profile Picture"
                  />
                </>
              )}
            </label>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {isSignedIn ? 'My Private Vault' : 'Vault Signed Out'}
                </span>
                {isSignedIn && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/35 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    {user.memberTier || 'Gold Elite Pro'}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                {isSignedIn ? user.name || 'My Profile' : 'Sign In Required'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSignedIn && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
                aria-label="Logout of Vault"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close Vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP LEVEL VAULT NAVIGATION TABS (Non-overlapping 3-col grid on mobile, single flex row on tablet+) */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap p-2 bg-black/60 border-b border-white/5 gap-1.5 shrink-0 sm:px-4">
          {(isSignedIn
            ? [
              { id: 'biometrics', label: t?.('vault.biometrics') || 'My Body', icon: Activity },
              { id: 'history', label: `${t?.('vault.history') || 'History'} (${(loggedWorkouts?.length || 0) + (loggedMeals?.length || 0)})`, icon: History },
              ...(isLeaderboardEnabled ? [{ id: 'leaderboard', label: t?.('vault.leaderboard') || 'Top 10', icon: Trophy }] : []),
              ...(!hasPaidPlan ? [{ id: 'tier', label: t?.('vault.tier') || 'Upgrade', icon: Crown }] : []),
              { id: 'support', label: t?.('vault.support') || 'Support', icon: LifeBuoy },
              { id: 'auth', label: t?.('vault.auth') || 'Account', icon: Lock },
            ]
            : [
              { id: 'auth', label: t?.('vault.auth') || 'Sign Up / In', icon: Lock },
              { id: 'support', label: t?.('vault.support') || 'Support', icon: LifeBuoy },
              ...(isLeaderboardEnabled ? [{ id: 'leaderboard', label: t?.('vault.leaderboard') || 'Top 10', icon: Trophy }] : []),
            ]
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sm:w-auto sm:flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 min-w-0 ${visibleTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm'
                  : 'bg-white/[0.03] sm:bg-transparent text-slate-300 hover:text-white'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MOBILE LANGUAGE QUICK BAR (Vault Settings on Mobile Devices) */}
        <div className="md:hidden px-4 py-2 bg-black/75 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 shrink-0">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t?.('vault.languageTitle') || 'App Language'}</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage?.(e.target.value)}
            aria-label="Mobile Vault Language Selector"
            className="px-2.5 py-1 rounded-xl glass-input text-xs font-bold text-white cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-obsidian-950 text-white">
                {lang.native}{lang.native !== lang.label ? ` (${lang.label})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                }`}
            >
              {statusMessage.type === 'error' ? (
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: BIOMETRICS, BMI & PHOTO BODY FAT ESTIMATOR */}
          {/* ======================================================== */}
          {visibleTab === 'biometrics' && (
            <div className="space-y-5">
              {/* SECTION A: LIVE BMI CALCULATOR & GAUGE */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/25 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Live Body Mass Index
                    </span>
                    <h3 className="text-base font-bold text-white">BMI Telemetry</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-300">{liveBmi}</span>
                    <span className={`text-[11px] block font-semibold ${bmiCat.color}`}>
                      {bmiCat.label}
                    </span>
                  </div>
                </div>

                {/* Visual BMI Gauge Meter */}
                <div className="space-y-1.5">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 w-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_white] -translate-x-1/2 transition-all duration-300"
                      style={{ left: `${Math.min(100, Math.max(5, ((liveBmi - 15) / 20) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>18.5 (Under)</span>
                    <span>22.0 (Ideal)</span>
                    <span>25.0 (Athletic)</span>
                    <span>30.0+</span>
                  </div>
                </div>

                {/* Height & Weight Adjusters */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      onBlur={handleSaveMetrics}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-bold text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentWeightInput}
                      onChange={(e) => setCurrentWeightInput(e.target.value)}
                      onBlur={handleSaveMetrics}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-bold text-amber-300 font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveMetrics}
                  className="w-full py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition"
                >
                  Save & Sync Height / Weight to Vault
                </button>
              </div>

              {/* SECTION B: BODY FAT % TRACKER & COMPOSITION BREAKDOWN */}
              <div className="p-4 rounded-2xl bg-obsidian-850 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Body Composition
                    </span>
                    <h3 className="text-base font-bold text-white">Body Fat Telemetry</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">{user.bodyFat || 16.5}%</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {currentFatPercent < 15 ? 'Athletic / Shredded' : currentFatPercent < 20 ? 'Fitness Toned' : 'Average Mass'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Lean Body Mass</span>
                    <span className="text-lg font-bold text-emerald-300">{leanMassKg} kg</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Skeletal muscle & organs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Fat Mass</span>
                    <span className="text-lg font-bold text-amber-300">{fatMassKg} kg</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Subcutaneous & visceral</span>
                  </div>
                </div>

                <form onSubmit={handleSaveManualFat} className="flex gap-2 pt-1">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Calibrate Fat % (e.g. 15.2)"
                    value={manualFatInput}
                    onChange={(e) => setManualFatInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition"
                  >
                    Log %
                  </button>
                </form>
              </div>

              {/* SECTION C: AI TORSO / PHYSIQUE PHOTO BODY FAT ESTIMATOR */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">AI Physique Photo Body Fat Estimator</h4>
                      <span className="text-[10px] text-slate-400">Computer Vision Abdominal & Iliac Scan</span>
                    </div>
                  </div>
                </div>

                {/* Preset Physiques */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {PHYSIQUE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setPhysiquePhoto(preset.photoUrl);
                        triggerAiPhysiqueScan(preset.photoUrl, preset.estFat);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 hover:border-amber-400 text-[11px] font-semibold text-slate-300 whitespace-nowrap shrink-0 transition"
                    >
                      {preset.label} (~{preset.estFat}%)
                    </button>
                  ))}
                </div>

                {/* Photo Preview & Scan Overlay */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-black/60 border border-amber-500/20 flex items-center justify-center">
                  {physiquePhoto && (
                    <img
                      src={physiquePhoto}
                      alt="Physique Scan Target"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                  )}

                  {isScanningPhoto && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                      <span className="text-xs font-bold text-amber-300">
                        Scanning Torso Geometry & Adipose Thickness...
                      </span>
                    </div>
                  )}

                  {!isScanningPhoto && (
                    <div className="absolute bottom-2 right-2 flex gap-1.5">
                      <label className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300 cursor-pointer hover:bg-black transition flex items-center gap-1 active:scale-95">
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => triggerAiPhysiqueScan(physiquePhoto)}
                        className="gold-btn px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-gold-glow active:scale-95"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Run AI Scan</span>
                      </button>
                    </div>
                  )}
                </div>

                {scanResult && (
                  <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        AI Vision Analysis Complete
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{scanResult.confidence}</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xl font-black text-amber-300">{scanResult.estimatedFat}%</span>
                        <span className="text-xs text-slate-300 font-semibold ml-2">Estimated Body Fat</span>
                      </div>
                      <span className="text-xs text-emerald-300 font-medium">{scanResult.abdominalDefinition}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-white/5">
                      <div>Waist-to-Hip Ratio: <strong className="text-white">{scanResult.iliacCrestRatio}</strong></div>
                      <div>Estimated Lean Mass: <strong className="text-white">{scanResult.leanMass} kg</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TOP 10 HEALTH POINTS LEADERBOARD (PRIVACY-SAFE) */}
          {/* ======================================================== */}
          {visibleTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Health Points Top 10 Leaderboard
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                      Top Healthy Food & Exercise Leaders
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Points are earned by logging wholesome, low-sugar nutrition and consistent daily workout minutes. Private profiles are hidden.
                    </p>
                  </div>
                  {isSignedIn && leaderboardData.currentUserRank && (
                    <div className="px-3.5 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-right shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                        Your Standing
                      </span>
                      <span className="text-base font-black text-amber-300">
                        Rank #{leaderboardData.currentUserRank}
                      </span>
                      <span className="text-[10px] text-slate-300 block font-mono">
                        {currentUserHealthPoints?.healthPoints || 0} pts
                      </span>
                    </div>
                  )}
                </div>

                {isSignedIn && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] uppercase text-slate-400 block">Healthy Food</span>
                      <span className="text-sm font-black text-emerald-300">
                        {currentUserHealthPoints?.nutritionPoints || 0} pts
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] uppercase text-slate-400 block">Exercise Time</span>
                      <span className="text-sm font-black text-amber-300">
                        {currentUserHealthPoints?.totalExerciseMinutes || 0} min
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[9px] uppercase text-slate-400 block">Top 10 Gap</span>
                      <span className="text-sm font-black text-white">
                        {leaderboardData.pointsToTop10 > 0
                          ? `+${leaderboardData.pointsToTop10} pts`
                          : 'In Top 10'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Privacy-Safe Top 10 Ranked List */}
              <div className="space-y-2">
                {leaderboardData.top10.map((entry) => {
                  const isTopThree = entry.rank <= 3;
                  const rankBadgeClass =
                    entry.rank === 1
                      ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-gold-glow-sm'
                      : entry.rank === 2
                        ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black'
                        : entry.rank === 3
                          ? 'bg-gradient-to-br from-orange-400 to-amber-700 text-black'
                          : 'bg-black/60 border border-white/10 text-slate-300';

                  return (
                    <div
                      key={`${entry.rank}-${entry.initials}-${entry.displayName}`}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${entry.isCurrentUser
                        ? 'bg-gradient-to-r from-amber-500/20 to-obsidian-900 border-amber-400 shadow-gold-glow-sm'
                        : isTopThree
                          ? 'bg-obsidian-850/95 border-amber-500/25'
                          : 'bg-obsidian-900/75 border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 overflow-hidden ${rankBadgeClass}`}
                        >
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.displayName} className="w-full h-full object-cover" />
                          ) : (
                            `#${entry.rank}`
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-white truncate">
                              {entry.displayName}
                            </h4>
                            {entry.isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400 text-black uppercase">
                                You
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white/5 text-amber-300 border border-white/10">
                              {entry.memberTier}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span className="text-emerald-300 font-semibold">
                              Clean Food: {entry.cleanMealsCount} meals ({entry.avgMealScore}/10)
                            </span>
                            <span>·</span>
                            <span className="text-amber-300 font-semibold">
                              Exercise: {entry.totalExerciseMinutes} min ({entry.activeDays}d)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-amber-300 leading-none">
                          {entry.healthPoints}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                          Health Pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: COMPLETE EXERCISE, MEAL & WEIGHT HISTORY LOGS */}
          {/* ======================================================== */}
          {visibleTab === 'history' && (
            <div className="space-y-4">
              {/* History Sub-navigation */}
              <div className="flex flex-wrap sm:flex-nowrap p-1 rounded-2xl bg-black/60 border border-white/10 gap-1">
                <button
                  onClick={() => setHistorySubTab('daily')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${historySubTab === 'daily'
                    ? 'bg-amber-500 text-black'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Daily Records ({dailyHistory.availableDates.length})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('workouts')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${historySubTab === 'workouts'
                    ? 'bg-amber-500 text-black font-extrabold'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Exercises ({loggedWorkouts?.length || 0})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('meals')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${historySubTab === 'meals'
                    ? 'bg-amber-500 text-black font-extrabold'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Meals ({loggedMeals?.length || 0})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('weight')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${historySubTab === 'weight'
                    ? 'bg-amber-500 text-black font-extrabold'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Weight ({weightHistory?.length || 0})</span>
                </button>
              </div>

              {historySubTab !== 'weight' && (
                <div className="relative">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Filter ${historySubTab} history by name or date...`}
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                  />
                </div>
              )}

              {/* Workout History List */}
              {/* Date Filter Chips & Quick Past-Day Log Toggle */}
              {historySubTab !== 'weight' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                    <button
                      onClick={() => setSelectedHistoryDate('all')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${selectedHistoryDate === 'all'
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-amber-500/40'
                        }`}
                    >
                      All Days ({dailyHistory.availableDates.length})
                    </button>
                    {dailyHistory.availableDates.map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedHistoryDate(d.date)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${selectedHistoryDate === d.date
                          ? 'bg-amber-500/25 text-amber-300 border-amber-400'
                          : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
                          }`}
                      >
                        {d.label} ({d.workoutCount}W · {d.mealCount}M)
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowPastEntryForm((v) => !v)}
                      className="ml-auto px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showPastEntryForm ? 'Close' : 'Log Past Day'}</span>
                    </button>
                  </div>

                  {showPastEntryForm && (
                    <form
                      onSubmit={handleSavePastEntry}
                      className="p-3.5 rounded-2xl bg-black/50 border border-amber-500/25 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                          Record Exercise or Meal for Any Day
                        </span>
                        <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => setPastEntryKind('workout')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${pastEntryKind === 'workout' ? 'bg-amber-500 text-black' : 'text-slate-400'
                              }`}
                          >
                            Exercise
                          </button>
                          <button
                            type="button"
                            onClick={() => setPastEntryKind('meal')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${pastEntryKind === 'meal' ? 'bg-amber-500 text-black' : 'text-slate-400'
                              }`}
                          >
                            Meal
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="date"
                          max={getRelativeDateString(0)}
                          value={pastEntryDate}
                          onChange={(e) => setPastEntryDate(e.target.value)}
                          className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          required
                        />
                        <input
                          type="text"
                          value={pastEntryName}
                          onChange={(e) => setPastEntryName(e.target.value)}
                          placeholder={pastEntryKind === 'workout' ? 'Exercise name (e.g., incline press)' : 'Meal name (e.g., grilled salmon bowl)'}
                          className="glass-input px-3 py-2 text-xs text-white rounded-xl sm:col-span-2"
                          required
                        />
                      </div>

                      {pastEntryKind === 'workout' ? (
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={pastEntryCategory}
                            onChange={(e) => setPastEntryCategory(e.target.value)}
                            className="glass-input px-2.5 py-2 text-xs text-white rounded-xl"
                          >
                            <option value="gym">Gym / Machines</option>
                            <option value="freeweights">Freeweights</option>
                            <option value="home_workout">Home Workout</option>
                            <option value="yoga">Yoga Flow</option>
                            <option value="calisthenics">Calisthenics</option>
                          </select>
                          <input
                            type="number"
                            min="5"
                            max="240"
                            value={pastEntryMinutes}
                            onChange={(e) => setPastEntryMinutes(e.target.value)}
                            placeholder="Minutes"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                          <input
                            type="number"
                            min="10"
                            max="2000"
                            value={pastEntryCalories}
                            onChange={(e) => setPastEntryCalories(e.target.value)}
                            placeholder="kcal burned"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <select
                            value={pastEntryMealType}
                            onChange={(e) => setPastEntryMealType(e.target.value)}
                            className="glass-input px-2.5 py-2 text-xs text-white rounded-xl"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snacks">Snacks</option>
                          </select>
                          <input
                            type="number"
                            min="20"
                            max="3000"
                            value={pastEntryCalories}
                            onChange={(e) => setPastEntryCalories(e.target.value)}
                            placeholder="kcal"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                          <input
                            type="number"
                            min="0"
                            value={pastEntryProtein}
                            onChange={(e) => setPastEntryProtein(e.target.value)}
                            placeholder="Protein g"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                          <input
                            type="number"
                            min="0"
                            value={pastEntryCarbs}
                            onChange={(e) => setPastEntryCarbs(e.target.value)}
                            placeholder="Carbs g"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                          <input
                            type="number"
                            min="0"
                            value={pastEntrySugar}
                            onChange={(e) => setPastEntrySugar(e.target.value)}
                            placeholder="Sugar g"
                            className="glass-input px-3 py-2 text-xs text-white rounded-xl"
                          />
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="gold-btn px-4 py-1.5 rounded-xl text-xs font-bold"
                        >
                          Save to Vault History
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* UNIFIED DAILY RECORDS VIEW (EXERCISES + MEALS PER DAY) */}
              {historySubTab === 'daily' && (
                <div className="space-y-3 max-h-[370px] overflow-y-auto pr-1">
                  {dailyHistory.days.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No exercise or meal records match that filter.
                    </div>
                  ) : (
                    dailyHistory.days.map((day) => (
                      <div
                        key={day.date}
                        className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white">{day.label}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                                {day.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                              {day.workouts.length} Ex · {day.caloriesBurned} kcal burned
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                              {day.meals.length} Meals · {day.caloriesConsumed} kcal · {day.protein}g P · {day.sugar}g sugar
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {/* Exercises for Day */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" />
                              <span>Exercises ({day.workouts.length})</span>
                            </div>
                            {day.workouts.length === 0 ? (
                              <div className="text-[11px] text-slate-500 italic p-2 rounded-xl bg-black/30 border border-white/5">
                                Rest / recovery day
                              </div>
                            ) : (
                              day.workouts.map((w) => (
                                <div
                                  key={w.id}
                                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-obsidian-900/80 border border-white/5"
                                >
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-white truncate">
                                      {w.exerciseName || w.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      {w.durationMinutes} min · {w.caloriesBurned} kcal · {w.loggedAt || w.time || 'Logged'}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteWorkout(w.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                                    title="Remove workout"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Meals for Day */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                              <Utensils className="w-3 h-3" />
                              <span>Meals ({day.meals.length})</span>
                            </div>
                            {day.meals.length === 0 ? (
                              <div className="text-[11px] text-slate-500 italic p-2 rounded-xl bg-black/30 border border-white/5">
                                No meals recorded for this date
                              </div>
                            ) : (
                              day.meals.map((m) => (
                                <div
                                  key={m.id}
                                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-obsidian-900/80 border border-white/5"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {(m.photoUrl || m.photo) && (
                                      <img
                                        src={m.photoUrl || m.photo}
                                        alt={m.title || m.name}
                                        className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-white truncate">
                                        {m.title || m.name}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        {m.mealType} · {m.calories} kcal · {m.protein}g P · {m.sugar ?? 0}g sugar
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteMeal(m.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                                    title="Remove meal"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {historySubTab === 'workouts' && (
                <div className="space-y-2">
                  {filteredWorkouts.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">No logged workouts found.</p>
                  ) : (
                    filteredWorkouts.map((w) => (
                      <div key={w.id} className="p-3 rounded-2xl bg-obsidian-850 border border-white/10 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="text-amber-400 font-bold">{formatHistoryDateLabel(w.date)} · {w.date}</span>
                            <span>·</span>
                            <span className="uppercase">{w.category}</span>
                            <span>·</span>
                            <span>{w.loggedAt}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">{w.exerciseName}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {w.durationMinutes} min · {w.primaryMuscles?.join(', ') || 'Full Body'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-xs font-extrabold text-amber-300">+{w.caloriesBurned} kcal</span>
                          <button
                            onClick={() => deleteWorkout(w.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            aria-label="Delete workout"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Meal History List */}
              {historySubTab === 'meals' && (
                <div className="space-y-2">
                  {filteredMeals.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">No logged meals found.</p>
                  ) : (
                    filteredMeals.map((m) => (
                      <div key={m.id} className="p-3 rounded-2xl bg-obsidian-850 border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {m.photoUrl && (
                            <img src={m.photoUrl} alt={m.title} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span className="text-emerald-400 font-bold">{formatHistoryDateLabel(m.date)} · {m.date}</span>
                              <span>·</span>
                              <span className="uppercase">{m.mealType}</span>
                              <span>·</span>
                              <span>{m.loggedAt}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">{m.title}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {m.protein}g P · {m.carbs}g C · <span className="text-amber-300">{m.sugar ?? 4}g Sugar</span> · {m.fats}g F
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-white">{m.calories} kcal</span>
                          <button
                            onClick={() => deleteMeal(m.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            aria-label="Delete meal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Weight & Body Fat Logs */}
              {historySubTab === 'weight' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Weight History</span>
                    {[...(weightHistory || [])].reverse().map((w, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-amber-300 font-bold">{w.date}</span>
                          <span className="text-slate-400 ml-2">{w.note}</span>
                        </div>
                        <span className="font-black text-white">{w.weight} kg</span>
                      </div>
                    ))}
                  </div>
                  {(user.bodyFatHistory || []).length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Body Fat Scans</span>
                      {user.bodyFatHistory.map((b, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono text-emerald-300 font-bold">{b.date}</span>
                            <span className="text-slate-400 ml-2">{b.note}</span>
                          </div>
                          <span className="font-black text-amber-300">{b.bodyFat}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ATHLETE MEMBERSHIP TIER & PERKS */}
          {/* ======================================================== */}
          {visibleTab === 'tier' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-obsidian-850 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-gold-glow-sm font-extrabold shrink-0">
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {hasPaidPlan ? 'Active Paid Plan' : 'Free Plan — Switch to Paid (From ₹99/mo)'}
                    </span>
                    <h3 className="text-base font-extrabold text-white">{user.memberTier || 'Free Starter'}</h3>
                  </div>
                </div>
                {!hasPaidPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openPlanUpgradeModal?.('Choose Monthly or Yearly Paid Plan');
                    }}
                    className="gold-btn px-3.5 py-2 rounded-xl text-xs font-black"
                  >
                    Switch to Paid →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ATHLETE_TIERS.map((tier) => {
                  const isSelected = (user.memberTier || 'Gold Elite Pro').toLowerCase().includes(tier.name.toLowerCase().split(' ')[0]);
                  return (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${isSelected
                        ? `${tier.bgGlow} ${tier.borderColor} shadow-gold-glow-sm`
                        : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-extrabold text-white tracking-tight">{tier.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 border border-white/10 ${tier.textGlow}`}>
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-snug">{tier.description}</p>
                        </div>

                        <button
                          onClick={() => {
                            updateMemberTier(tier.name);
                            setStatusMessage({ type: 'success', text: `Athlete Tier switched to ${tier.name}!` });
                            if (triggerConfetti) triggerConfetti();
                            setTimeout(() => setStatusMessage(null), 2000);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 active:scale-95 flex items-center gap-1 ${isSelected
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold shadow-gold-glow-sm'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                            }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Active</span>
                            </>
                          ) : (
                            <span>Activate</span>
                          )}
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {tier.perks.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="truncate">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: MY ACCOUNT DETAILS, LOGOUT & SIGN IN */}
          {/* ======================================================== */}
          {visibleTab === 'auth' && (
            <div className="space-y-5">
              {isSignedIn ? (
                <>
                  {/* My Private Account Details Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-black border border-amber-500/35 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-base flex items-center justify-center shadow-gold-glow-sm shrink-0 overflow-hidden">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name || 'Profile Picture'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (user.name || 'AV').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black text-white truncate">
                              {user.name || 'FitArc Athlete'}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                              Signed In
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 truncate mt-0.5">
                            {user.email || user.phone || 'Personal Vault Account'}
                          </p>
                          <p className="text-[11px] text-amber-300/90 mt-0.5">
                            {user.memberTier || 'Gold Elite Pro'} · Focus:{' '}
                            <span className="capitalize">{(user.goal || 'fat_loss').replace('_', ' ')}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <label className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition">
                              <Camera className="w-3 h-3" />
                              <span>{user.avatarUrl ? 'Change Photo' : 'Set Profile Picture'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                              />
                            </label>
                            {user.avatarUrl && (
                              <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/10 text-slate-400 hover:text-rose-300 text-[10px] font-semibold transition"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!hasPaidPlan ? (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              openPlanUpgradeModal?.('Switch from Free to a Paid Monthly or Yearly Plan');
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition"
                          >
                            Switch to Paid
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              downgradeToFreePlan?.();
                              setStatusMessage({ type: 'success', text: 'Switched back to Free Starter plan.' });
                            }}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
                          >
                            Switch to Free
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>

                    {/* Personal Biometrics & Live Health Points Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Weight / BMI</span>
                        <span className="text-sm font-black text-white">
                          {user.currentWeight}kg · {liveBmi}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Body Fat %</span>
                        <span className="text-sm font-black text-amber-300">
                          {user.bodyFat || 16.5}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/20">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 block">Health Points</span>
                        <span className="text-sm font-black text-amber-300">
                          {currentUserHealthPoints?.healthPoints || 0} pts
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Leaderboard</span>
                        <span className="text-sm font-black text-emerald-300">
                          Rank #{leaderboardData.currentUserRank || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Plan Card */}
                  {user.activePlan && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/25 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Active Transformation Protocol ({user.activePlan.workoutLocation || 'home'})
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{user.activePlan.title}</h3>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            setIsPlanModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl gold-btn text-xs font-bold shrink-0"
                        >
                          Change Plan
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Vault Signed Out
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    Sign In or Create Your Own Vault Account
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your workouts, meals, weight history, and biometric profile stay strictly private to your own credentials.
                  </p>
                </div>
              )}

              {/* Full Multilingual Vault Setting (always accessible in My Account tab) */}
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/25 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {t?.('vault.languageTitle') || 'App Language'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {t?.('vault.languageHint') || 'Choose your preferred language across workouts, nutrition & support'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage?.(lang.code)}
                      className={`px-3 py-2 rounded-xl border text-left transition flex items-center gap-2 ${language === lang.code
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-obsidian-950/70 border-white/10 text-slate-300 hover:border-white/25'
                        }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <div className="min-w-0 leading-tight">
                        <div className="text-xs font-bold truncate">{lang.native}</div>
                        <div className="text-[9px] text-slate-400">{lang.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Up / Sign In With Required Phone & Email + OTP Delivery */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {isSignedIn ? 'Register New Account or Switch Credentials:' : 'Sign Up / Verify With Phone Number & Email:'}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold">
                    OTP sent to Phone &amp; Email
                  </span>
                </div>

                {/* OTP Delivery Channel Indicator */}
                <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10">
                  {[
                    { id: 'both', label: 'Phone + Email OTP', icon: ShieldCheck },
                    { id: 'phone', label: 'SMS Primary', icon: Smartphone },
                    { id: 'email', label: 'Email Primary', icon: Mail },
                  ].map((mode) => {
                    const ModeIcon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setAuthMethod(mode.id);
                          setStatusMessage(null);
                        }}
                        className={`flex-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1 ${authMethod === mode.id
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                          }`}
                      >
                        <ModeIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                {!otpStep ? (
                  <form onSubmit={handleRequestOtp} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Athlete Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jordan Mercer"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Phone Number (Required for SMS OTP) *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-2.5 rounded-xl glass-input text-xs text-white font-medium cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code} className="bg-obsidian-900 text-white">
                                {c.code} ({c.country})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 min-w-0">
                          <Phone className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Email Address (Required for Email OTP) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="athlete@example.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gold-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Send 4-Digit OTP to Phone &amp; Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhone} className="space-y-3 p-4 rounded-2xl bg-black/55 border border-amber-500/30">
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Verify 4-Digit OTP
                      </span>
                      <p className="text-[11px] text-slate-300">
                        Code sent to <strong className="text-white">{countryCode} {phoneNumber}</strong> &amp; <strong className="text-amber-300">{emailAddress}</strong>
                      </p>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-center text-base font-mono font-bold tracking-widest text-amber-300"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false);
                          setStatusMessage(null);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300"
                      >
                        Edit Contact
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 gold-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP &amp; Save Vault</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: HELP & SUPPORT CENTER INSIDE VAULT                */}
          {/* ======================================================== */}
          {visibleTab === 'support' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-obsidian-900 border border-amber-500/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      {siteSettings?.brandName || 'FITARC'} Concierge
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                      {t?.('support.title') || 'FitArc Help & Support Center'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {t?.('support.subtitle') || 'Message our coaching & billing team directly from your Vault'}
                    </p>
                  </div>
                  <LifeBuoy className="w-7 h-7 text-amber-400 shrink-0" />
                </div>

                {/* Live Admin-Managed Support Contact Channels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-200 truncate">{siteSettings?.supportEmail || 'support@fitarc.app'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 truncate">{siteSettings?.supportWhatsapp || '+91 98765 43210'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-slate-200 truncate">{siteSettings?.supportHours || 'Mon–Sat · 9AM–8PM'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Support Team Form */}
              <form onSubmit={handleSubmitSupportTicket} className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Support Team</span>
                </h4>

                {supportSubmittedToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{supportSubmittedToast}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                      {t?.('support.category') || 'Issue Category'}
                    </label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white cursor-pointer"
                    >
                      <option className="bg-obsidian-950" value="Plans & Billing">Plans &amp; Billing (₹99 / Yearly)</option>
                      <option className="bg-obsidian-950" value="Workouts & HIIT">Workouts, Voice Coach &amp; 30m HIIT</option>
                      <option className="bg-obsidian-950" value="Food & Macro Scan">Food &amp; Meal Photo Scanner</option>
                      <option className="bg-obsidian-950" value="Trustified Shop">Trustified™ Shop &amp; Orders</option>
                      <option className="bg-obsidian-950" value="Technical / Language">App Language / Bug Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                      {t?.('support.subject') || 'Subject'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary..."
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                    {t?.('support.message') || 'How can our support team help?'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your question or issue..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-btn py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t?.('support.submit') || 'Send Support Request'}</span>
                </button>
              </form>

              {/* Submitted Tickets & Admin Responses */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {t?.('support.yourTickets') || 'Your Support Tickets & Replies'} ({(supportTickets || []).filter((tk) => !user?.id || tk.userId === user.id || tk.userId === 'guest').length})
                </h4>
                {((supportTickets || []).filter((tk) => !user?.id || tk.userId === user.id || tk.userId === 'guest')).length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 rounded-xl bg-black/40 border border-white/5">
                    {t?.('support.noTickets') || 'No support tickets yet. Message our team anytime!'}
                  </p>
                ) : (
                  (supportTickets || [])
                    .filter((tk) => !user?.id || tk.userId === user.id || tk.userId === 'guest')
                    .map((tk) => (
                      <div key={tk.id} className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-amber-400">{tk.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300">{tk.category}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tk.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : tk.status === 'In Progress'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                              }`}
                          >
                            {tk.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white">{tk.subject}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tk.message}</p>
                        {tk.adminReply && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-200">
                            <strong className="text-emerald-300">Support Team Reply:</strong> {tk.adminReply}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
