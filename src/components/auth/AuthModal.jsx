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
  Users,
  Smartphone,
  ChevronDown,
  Activity,
  Target,
  Flame,
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
  Database,
  Calendar,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildDailyHistoryRecords, formatHistoryDateLabel } from '../../utils/vaultHistoryHelpers';
import { getRelativeDateString } from '../../data/athleteVaultDatabase';

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
    switchUserProfile,
    getAllSavedProfiles,
    loggedWorkouts,
    loggedMeals,
    weightHistory,
    logWorkout,
    logMeal,
    deleteWorkout,
    deleteMeal,
    resetDemoData,
    authModalTab,
    updateMemberTier,
    triggerConfetti,
  } = useApp();

  const [activeTab, setActiveTab] = useState(authModalTab || 'biometrics'); // 'biometrics' | 'directory' | 'history' | 'tier' | 'auth'
  const [authMethod, setAuthMethod] = useState('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentWeightInput, setCurrentWeightInput] = useState(user.currentWeight || 75.0);
  const [heightInput, setHeightInput] = useState(user.height || 180);
  const [manualFatInput, setManualFatInput] = useState(user.bodyFat || 16.5);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vault DB & History sub-states
  const [directorySearch, setDirectorySearch] = useState('');
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

  // Sync requested tab when modal opens
  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
  }, [authModalTab, isOpen]);

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

  const savedProfiles = useMemo(() => {
    return getAllSavedProfiles ? getAllSavedProfiles() : [];
  }, [getAllSavedProfiles]);

  const filteredDirectory = useMemo(() => {
    const q = directorySearch.toLowerCase().trim();
    if (!q) return savedProfiles;
    return savedProfiles.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.specialty?.toLowerCase().includes(q) ||
        p.memberTier?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
    );
  }, [savedProfiles, directorySearch]);

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
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 7) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep(true);
      setOtpValue('8888');
      setStatusMessage({ type: 'success', text: `SMS code sent to ${countryCode} ${phoneNumber} (Use 8888)` });
    }, 450);
  };

  const handleVerifyPhone = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      loginWithPhone(fullPhone, otpValue, fullName || `Athlete ${phoneNumber.slice(-4)}`, parseFloat(currentWeightInput) || 75.0);
      setIsSubmitting(false);
      setOtpStep(false);
      setPhoneNumber('');
      setFullName('');
      setStatusMessage({ type: 'success', text: 'New athlete saved & loaded into Vault!' });
      setTimeout(() => setStatusMessage(null), 1800);
    }, 450);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (!emailAddress || !emailAddress.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithEmail(emailAddress.trim(), 'pass', fullName || emailAddress.split('@')[0], parseFloat(currentWeightInput) || 75.0);
      setIsSubmitting(false);
      setEmailAddress('');
      setFullName('');
      setStatusMessage({ type: 'success', text: 'Account signed in & synced to Vault!' });
      setTimeout(() => setStatusMessage(null), 1800);
    }, 450);
  };

  const handleSelectProfile = (profileId) => {
    switchUserProfile(profileId);
    setStatusMessage({ type: 'success', text: 'Loaded athlete profile & full history from Vault!' });
    setTimeout(() => setStatusMessage(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-gold-glow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Athlete Vault · {savedProfiles.length} Profiles
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/35 flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  {user.memberTier || 'Gold Elite Pro'}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                {user.name || 'Athlete Profile'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP LEVEL VAULT NAVIGATION TABS */}
        <div className="flex p-1.5 bg-black/60 border-b border-white/5 gap-1 shrink-0 px-2 sm:px-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'biometrics', label: 'Vault & BMI', icon: Activity },
            { id: 'directory', label: `Athletes (${savedProfiles.length})`, icon: Users },
            { id: 'history', label: `History (${(loggedWorkouts?.length || 0) + (loggedMeals?.length || 0)})`, icon: History },
            { id: 'tier', label: 'Tiers', icon: Crown },
            { id: 'auth', label: 'Plan & Login', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[92px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
                statusMessage.type === 'error'
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
          {activeTab === 'biometrics' && (
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
          {/* TAB 2: MULTI-USER ATHLETE DATABASE DIRECTORY */}
          {/* ======================================================== */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Database className="w-3 h-3" /> FitArc Cloud Athlete Vault
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {savedProfiles.length} Stored Athletes with Full Histories
                  </h3>
                </div>
                <button
                  onClick={() => {
                    resetDemoData();
                    setStatusMessage({ type: 'success', text: 'Full 8-Athlete Vault Database restored!' });
                    setTimeout(() => setStatusMessage(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 self-start transition"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restore Full DB</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search athletes by name, specialty, tier or goal..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Athlete Profiles Cards */}
              <div className="space-y-2.5">
                {filteredDirectory.map((p) => {
                  const isActive = user?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProfile(p.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500/15 to-obsidian-900 border-amber-400 shadow-gold-glow-sm'
                          : 'bg-obsidian-850/90 border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black'
                            : 'bg-black/60 border border-amber-500/30 text-amber-300'
                        }`}>
                          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/10 text-amber-300 border border-white/10">
                              {p.memberTier}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {p.specialty} · <strong className="text-slate-200">{p.currentWeight}kg</strong> · BMI {p.bmi} · {p.bodyFat}% BF
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-400">
                            <span className="text-amber-300 font-semibold">{p.workoutCount} workouts</span>
                            <span>·</span>
                            <span className="text-emerald-300 font-semibold">{p.mealCount} meals</span>
                            <span>·</span>
                            <span>{p.totalCaloriesBurnedAllTime} kcal logged</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isActive ? (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-black text-[10px] font-extrabold uppercase flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500 text-slate-200 hover:text-black text-[11px] font-bold transition">
                            Load Vault
                          </span>
                        )}
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
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* History Sub-navigation */}
              <div className="flex flex-wrap sm:flex-nowrap p-1 rounded-2xl bg-black/60 border border-white/10 gap-1">
                <button
                  onClick={() => setHistorySubTab('daily')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    historySubTab === 'daily'
                      ? 'bg-amber-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Daily Records ({dailyHistory.availableDates.length})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('workouts')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    historySubTab === 'workouts'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Exercises ({loggedWorkouts?.length || 0})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('meals')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    historySubTab === 'meals'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Meals ({loggedMeals?.length || 0})</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('weight')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    historySubTab === 'weight'
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
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                        selectedHistoryDate === 'all'
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
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                          selectedHistoryDate === d.date
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
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              pastEntryKind === 'workout' ? 'bg-amber-500 text-black' : 'text-slate-400'
                            }`}
                          >
                            Exercise
                          </button>
                          <button
                            type="button"
                            onClick={() => setPastEntryKind('meal')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              pastEntryKind === 'meal' ? 'bg-amber-500 text-black' : 'text-slate-400'
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
                            <option value="face_yoga">Face Yoga</option>
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
          {activeTab === 'tier' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-obsidian-850 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-gold-glow-sm font-extrabold shrink-0">
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Current Active Membership</span>
                    <h3 className="text-base font-extrabold text-white">{user.memberTier || 'Gold Elite Pro'}</h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ATHLETE_TIERS.map((tier) => {
                  const isSelected = (user.memberTier || 'Gold Elite Pro').toLowerCase().includes(tier.name.toLowerCase().split(' ')[0]);
                  return (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 active:scale-95 flex items-center gap-1 ${
                            isSelected
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
          {/* TAB 5: ACTIVE TRANSFORMATION PLAN & CREATE / SIGN IN ACCOUNT */}
          {/* ======================================================== */}
          {activeTab === 'auth' && (
            <div className="space-y-5">
              {/* Active Plan Card */}
              {user.activePlan && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-3">
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

              {/* Create / Login Profile Form */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Create New Vault Athlete or Sign In:
                </span>

                <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10">
                  <button
                    onClick={() => {
                      setAuthMethod('phone');
                      setOtpStep(false);
                      setStatusMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      authMethod === 'phone'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Phone (SMS)</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMethod('email');
                      setStatusMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      authMethod === 'email'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Athlete Full Name (for new account)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                  />
                </div>

                {authMethod === 'phone' ? (
                  !otpStep ? (
                    <form onSubmit={handleRequestOtp} className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-2.5 rounded-xl glass-input text-xs text-white font-medium cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code} className="bg-obsidian-900 text-white">
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
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
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full gold-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>Send 4-Digit SMS Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhone} className="space-y-3">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-center text-base font-mono font-bold tracking-widest text-amber-300"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full gold-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Save to Vault</span>
                      </button>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="athlete@fitarc.elite"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gold-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Create / Sign In to Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
