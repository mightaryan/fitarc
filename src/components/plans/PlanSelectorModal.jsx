import React, { useState, useMemo } from 'react';
import {
  X,
  Flame,
  Zap,
  Shield,
  Activity,
  Sparkles,
  CheckCircle2,
  Target,
  Award,
  Home,
  Dumbbell,
  Sun,
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  Tag,
  Calendar,
} from 'lucide-react';
import { TARGET_AREAS, WORKOUT_LOCATIONS } from '../../data/transformationPlans';
import { useApp } from '../../context/AppContext';

export function PlanSelectorModal({ isOpen, onClose }) {
  const {
    user,
    selectTransformationPlan,
    managedPlans,
    siteSettings,
    hasPaidPlan,
    upgradeModalReason,
    setUpgradeModalReason,
    setIsCustomPlanModalOpen,
  } = useApp();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedArea, setSelectedArea] = useState(user.activePlan?.targetArea || 'belly_fat');
  const [selectedDuration, setSelectedDuration] = useState(user.activePlan?.durationDays || 30);
  const [selectedLocation, setSelectedLocation] = useState(user.activePlan?.workoutLocation || 'home');
  const [step, setStep] = useState('configure'); // 'configure' | 'checkout'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardLast4, setCardLast4] = useState('4242');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const activeCatalogPlans = useMemo(
    () => (managedPlans || []).filter((p) => p.active !== false),
    [managedPlans]
  );

  const currentPlan = useMemo(() => {
    return (
      activeCatalogPlans.find(
        (p) => p.targetArea === selectedArea && p.durationDays === selectedDuration
      ) ||
      activeCatalogPlans.find((p) => p.targetArea === selectedArea) ||
      activeCatalogPlans[0]
    );
  }, [activeCatalogPlans, selectedArea, selectedDuration]);

  if (!isOpen) return null;

  const gateway = siteSettings?.paymentGateway || {};
  const validPromo = (gateway.promoCode || 'FITARC20').toUpperCase();
  const discountPercent = promoApplied ? Number(gateway.promoDiscountPercent || 20) : 0;
  const monthlyPrice = Number(currentPlan?.priceINR ?? 99);
  const yearlyPrice = Number(currentPlan?.yearlyPriceINR ?? (monthlyPrice * 8));
  const basePrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
  const baseMrp = billingCycle === 'yearly' ? Number(currentPlan?.yearlyMrpINR ?? 2999) : Number(currentPlan?.mrpINR ?? 499);
  const discountedPrice = Math.max(0, Math.round(basePrice * (1 - discountPercent / 100)));
  const finalAmount = discountedPrice;

  const handleClose = () => {
    setStep('configure');
    setUpgradeModalReason?.(null);
    onClose();
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === validPromo) {
      setPromoApplied(true);
    }
  };

  const handleCompletePurchase = () => {
    const methodLabel =
      paymentMethod === 'upi'
        ? `UPI Instant (${upiIdInput.trim() || 'GPay/PhonePe'})`
        : paymentMethod === 'card'
        ? `Card •••• ${cardLast4 || '4242'}`
        : 'NetBanking Instant';

    selectTransformationPlan(
      {
        ...currentPlan,
        workoutLocation: selectedLocation,
      },
      {
        billingCycle,
        amountINR: finalAmount,
        discountPercent,
        method: methodLabel,
        tierGranted: billingCycle === 'yearly' ? 'Gold Elite Pro' : currentPlan?.tierGranted || 'Pro Athlete',
        status: 'Completed',
      }
    );
    setCheckoutSuccess(
      `Switched to ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Paid Plan (₹${finalAmount.toLocaleString('en-IN')}) — Advanced workouts unlocked!`
    );
    setTimeout(() => {
      setCheckoutSuccess(null);
      handleClose();
    }, 1100);
  };

  const getAreaIcon = (id) => {
    switch (id) {
      case 'belly_fat': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'hiit_600': return <Zap className="w-4 h-4 text-rose-400" />;
      case 'calisthenics': return <Award className="w-4 h-4 text-amber-400" />;
      case 'thigh_fat': return <Target className="w-4 h-4 text-emerald-400" />;
      case 'back_fat': return <Shield className="w-4 h-4 text-sky-400" />;
      case 'overall_fat': return <Activity className="w-4 h-4 text-rose-400" />;
      case 'yoga_mobility': return <Sparkles className="w-4 h-4 text-amber-300" />;
      default: return <Target className="w-4 h-4 text-amber-400" />;
    }
  };

  const getLocationIcon = (id) => {
    switch (id) {
      case 'home': return <Home className="w-4 h-4 text-amber-400" />;
      case 'gym': return <Dumbbell className="w-4 h-4 text-sky-400" />;
      case 'calisthenics': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'yoga': return <Sun className="w-4 h-4 text-amber-300" />;
      default: return <MapPin className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-gold-glow-sm">
              {step === 'checkout' ? <CreditCard className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {step === 'checkout'
                  ? 'Secure Checkout'
                  : !hasPaidPlan
                  ? 'Switch From Free To Paid Plan'
                  : 'Your Active Plan Options'}
              </span>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                {step === 'checkout'
                  ? 'Complete Plan Activation'
                  : !hasPaidPlan
                  ? 'Choose Monthly or Yearly Plan'
                  : 'Transformation Plan Settings'}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close plans"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {checkoutSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{checkoutSuccess}</span>
            </div>
          )}

          {upgradeModalReason && step === 'configure' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <span className="font-bold block text-white">{upgradeModalReason}</span>
                <span className="text-[11px] text-amber-200/80">
                  Switch from Free to a Paid Monthly (from ₹99/mo) or Yearly pass below to unlock Advanced workouts immediately.
                </span>
              </div>
            </div>
          )}

          {step === 'configure' ? (
            <>
              {/* Monthly vs Yearly Billing Toggle */}
              <div className="p-1.5 rounded-2xl bg-black/60 border border-amber-500/25 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Monthly · From ₹99/mo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yearly · Save 35%</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-300">Beginner Free vs Paid Comparison</span>
                  <span className="text-slate-300 block text-[11px]">
                    Free includes Beginner/Inter. workouts &amp; custom builder · Paid unlocks all Advanced training &amp; guidance.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setIsCustomPlanModalOpen?.(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold hover:bg-white/15 transition shrink-0"
                >
                  Free Custom Plan
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  1 · Choose Your Focus Goal
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TARGET_AREAS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedArea(area.id)}
                      className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        selectedArea === area.id
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-gold-glow-sm'
                          : 'bg-obsidian-850/80 border-white/5 text-slate-300 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        {getAreaIcon(area.id)}
                        {selectedArea === area.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="text-xs font-bold leading-tight">{area.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  2 · Program Tier
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { days: 30, name: 'Starter', m: 99, y: 799 },
                    { days: 60, name: 'Pro', m: 199, y: 1299 },
                    { days: 90, name: 'Gold Elite', m: 299, y: 1999 },
                  ].map((d) => {
                    const matched = activeCatalogPlans.find(
                      (p) => p.targetArea === selectedArea && p.durationDays === d.days
                    );
                    const dispPrice =
                      billingCycle === 'yearly'
                        ? matched?.yearlyPriceINR ?? d.y
                        : matched?.priceINR ?? d.m;
                    return (
                      <button
                        key={d.days}
                        onClick={() => setSelectedDuration(d.days)}
                        className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                          selectedDuration === d.days
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 font-bold shadow-gold-glow-sm'
                            : 'bg-obsidian-850 border-white/5 text-slate-300 hover:border-amber-500/30'
                        }`}
                      >
                        <div className="text-sm sm:text-base font-black">{d.name}</div>
                        <div className="text-xs font-extrabold mt-0.5">
                          ₹{dispPrice.toLocaleString('en-IN')}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${selectedDuration === d.days ? 'text-black/75' : 'text-slate-400'}`}>
                          {d.days}d Split · Unlocks Adv.
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  3 · Workout Environment
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {WORKOUT_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        selectedLocation === loc.id
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-gold-glow-sm'
                          : 'bg-obsidian-850/80 border-white/5 text-slate-300 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-1.5">
                          {getLocationIcon(loc.id)}
                          <span className="text-xs font-bold leading-tight">{loc.label}</span>
                        </div>
                        {selectedLocation === loc.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{loc.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {currentPlan && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-white">{currentPlan.title}</h3>
                      <span className="text-[11px] text-emerald-300 font-semibold">
                        Unlocks all Advanced Workouts + Personalized Macros
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] line-through text-slate-500 block">
                        ₹{baseMrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg font-black text-amber-300">
                        ₹{basePrice.toLocaleString('en-IN')}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {currentPlan && (
                <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/25 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {billingCycle === 'yearly' ? 'Yearly Subscription' : 'Monthly Plan'} · Switching Free → Paid
                    </span>
                    <h3 className="text-base font-extrabold text-white">{currentPlan.title}</h3>
                    <span className="text-[11px] text-slate-400">
                      Unlocks all Advanced Exercises &amp; Voice Coaching
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-300">
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                    {promoApplied && (
                      <span className="block text-[10px] text-emerald-400 font-bold">
                        {discountPercent}% Off Applied
                      </span>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={`Promo code (Try ${validPromo})`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition"
                >
                  {promoApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </form>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Payment Method ({gateway.provider || 'Razorpay / UPI'}):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI', sub: 'GPay / PhonePe', icon: Smartphone },
                    { id: 'card', label: 'Card', sub: 'Visa / RuPay', icon: CreditCard },
                    { id: 'netbanking', label: 'Bank', sub: 'NetBanking', icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${
                          paymentMethod === m.id
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-obsidian-850 border-white/10 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">{m.label}</span>
                        <span className="text-[10px] text-slate-400">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'upi' && (
                  <input
                    type="text"
                    placeholder={`Enter UPI ID (Pay to ${gateway.upiId || 'fitarc.pay@okhdfcbank'})`}
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white mt-2"
                  />
                )}
                {paymentMethod === 'card' && (
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Card last 4 digits (e.g. 4242)"
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono mt-2"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 p-4 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          {step === 'checkout' ? (
            <>
              <button
                onClick={() => setStep('configure')}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleCompletePurchase}
                className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-gold-glow active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{finalAmount.toLocaleString('en-IN')} &amp; Unlock</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Stay Free
              </button>
              <button
                onClick={() => setStep('checkout')}
                className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-gold-glow active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  Switch to Paid · ₹{basePrice.toLocaleString('en-IN')}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default PlanSelectorModal;
