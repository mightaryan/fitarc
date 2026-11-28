import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  CalendarRange,
  CheckCircle2,
  Play,
  Plus,
  Bot,
  Trash2,
} from 'lucide-react';
import {
  BODY_PART_SETS,
  generateAiExercise,
  generateCustomUserPlan,
} from '../../data/hiitAndLeapWorkouts';
import { useApp } from '../../context/AppContext';

export function AiAndCustomPlanModal({ isOpen, onClose }) {
  const {
    user,
    wellnessToday,
    saveCustomUserPlan,
    deleteCustomUserPlan,
    adminUpsertExercise,
    setActiveGuidedSession,
  } = useApp();

  const [mode, setMode] = useState('custom_plan'); // 'custom_plan' | 'ai_exercise'

  // Custom Plan Builder State
  const [planName, setPlanName] = useState('');
  const [goal, setGoal] = useState('fat_loss');
  const [selectedTypes, setSelectedTypes] = useState(['hiit_cardio', 'abs', 'yoga_mobility']);
  const [durationDays, setDurationDays] = useState(30);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [savedNotice, setSavedNotice] = useState('');

  // AI Exercise Generator State
  const [aiGoal, setAiGoal] = useState('fat_loss');
  const [aiBodyPart, setAiBodyPart] = useState('hiit_cardio');
  const [aiEquipment, setAiEquipment] = useState('bodyweight');
  const [aiLevel, setAiLevel] = useState('Intermediate');
  const [aiFocus, setAiFocus] = useState('');
  const [generatedEx, setGeneratedEx] = useState(() =>
    generateAiExercise({ goal: 'fat_loss', bodyPart: 'hiit_cardio', equipment: 'bodyweight', level: 'Intermediate' })
  );

  const previewPlan = useMemo(
    () =>
      generateCustomUserPlan({
        planName,
        goal,
        exerciseTypes: selectedTypes,
        durationDays,
        dailyMinutes,
        daysPerWeek,
        userWeightKg: user?.currentWeight || 75,
      }),
    [planName, goal, selectedTypes, durationDays, dailyMinutes, daysPerWeek, user?.currentWeight]
  );

  if (!isOpen) return null;

  const toggleType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleActivateCustomPlan = () => {
    saveCustomUserPlan(previewPlan, true);
    setSavedNotice(`Activated "${previewPlan.title}" as your live daily blueprint!`);
    setTimeout(() => {
      setSavedNotice('');
      onClose();
    }, 1000);
  };

  const handleGenerateAi = () => {
    const ex = generateAiExercise({
      goal: aiGoal,
      bodyPart: aiBodyPart,
      equipment: aiEquipment,
      level: aiLevel,
      customFocus: aiFocus,
    });
    setGeneratedEx(ex);
  };

  const handleSaveAiExercise = () => {
    adminUpsertExercise(generatedEx);
    setSavedNotice(`Saved AI Exercise "${generatedEx.name}" to your Exercise Studio!`);
    setTimeout(() => setSavedNotice(''), 2500);
  };

  const handleLaunchAiExerciseNow = () => {
    onClose();
    setActiveGuidedSession({
      routineTitle: `AI Guided Session: ${generatedEx.name}`,
      badge: 'AI Voice-Coached Protocol',
      exercises: [generatedEx, generatedEx, generatedEx],
      restDurationSeconds: 15,
      isLowImpact: generatedEx.lowImpact,
    });
  };

  const savedCustomPlans = wellnessToday?.customUserPlans || [];

  return (
    <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-obsidian-900/95 border-b border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/35 text-amber-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                AI Architect &amp; Custom Builder
              </span>
              <h2 className="text-base sm:text-xl font-black text-white">
                Build Custom Plan or AI Exercise
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch */}
        <div className="flex p-2 bg-black/50 border-b border-white/10 gap-2 px-4">
          <button
            type="button"
            onClick={() => setMode('custom_plan')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mode === 'custom_plan'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            <span>Custom Goal &amp; Exercise Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('ai_exercise')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mode === 'ai_exercise'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Exercise Generator</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto text-xs">
          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          {mode === 'custom_plan' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Custom Plan Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g., Summer Abs & 30m HIIT"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value="fat_loss">Fast Fat Loss &amp; Core Definition</option>
                    <option className="bg-obsidian-900" value="muscle_gain">Lean Muscle Hypertrophy</option>
                    <option className="bg-obsidian-900" value="stamina">HIIT Stamina &amp; Endurance</option>
                    <option className="bg-obsidian-900" value="flexibility">Mobility, Yoga &amp; Posture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                  Select Your Exercise Types ({selectedTypes.length} active)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BODY_PART_SETS.map((item) => {
                    const checked = selectedTypes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleType(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          checked
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-black/45 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{item.icon} {item.label.split(' ')[0]}</span>
                          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Plan Days
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value={14}>14 Days</option>
                    <option className="bg-obsidian-900" value={30}>30 Days</option>
                    <option className="bg-obsidian-900" value={60}>60 Days</option>
                    <option className="bg-obsidian-900" value={90}>90 Days</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Session Duration
                  </label>
                  <select
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value={15}>15 Min</option>
                    <option className="bg-obsidian-900" value={20}>20 Min</option>
                    <option className="bg-obsidian-900" value={30}>30 Min</option>
                    <option className="bg-obsidian-900" value={45}>45 Min</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Days / Week
                  </label>
                  <select
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white"
                  >
                    {[3, 4, 5, 6].map((d) => (
                      <option className="bg-obsidian-900" key={d} value={d}>{d} Days / wk</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generated Blueprint Preview */}
              <div className="p-4 rounded-2xl bg-black/55 border border-amber-500/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      AI Weekly Schedule Preview (Free User Builder)
                    </span>
                    <h4 className="text-sm font-black text-white">{previewPlan.title}</h4>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300">
                    Protein: {previewPlan.dailyProteinTargetGrams}g · Sugar &lt;{previewPlan.dailySugarLimitGrams}g
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {previewPlan.splitSchedule.map((row) => (
                    <div key={row.day} className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] flex items-center justify-between">
                      <span className="font-bold text-amber-300">{row.day}</span>
                      <span className="text-slate-300 truncate ml-2">{row.focus}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleActivateCustomPlan}
                className="gold-btn w-full py-3 rounded-xl font-black text-xs sm:text-sm"
              >
                Save &amp; Activate My Custom Plan
              </button>

              {savedCustomPlans.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Your Saved Custom Plans ({savedCustomPlans.length})
                  </span>
                  {savedCustomPlans.map((cp) => (
                    <div key={cp.id} className="p-2.5 rounded-xl bg-black/45 border border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-white">{cp.title}</div>
                        <div className="text-[10px] text-slate-400">{cp.focus}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveCustomUserPlan(cp, true)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold"
                        >
                          Activate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomUserPlan(cp.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Training Goal
                  </label>
                  <select
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value="fat_loss">Calorie Burn &amp; Fat Loss</option>
                    <option className="bg-obsidian-900" value="muscle_gain">Hypertrophy Tension</option>
                    <option className="bg-obsidian-900" value="stamina">Metabolic Conditioning</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Target Area
                  </label>
                  <select
                    value={aiBodyPart}
                    onChange={(e) => setAiBodyPart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value="hiit_cardio">HIIT Cardio</option>
                    <option className="bg-obsidian-900" value="abs">Abs &amp; Core</option>
                    <option className="bg-obsidian-900" value="chest">Chest</option>
                    <option className="bg-obsidian-900" value="arms">Arms &amp; Shoulders</option>
                    <option className="bg-obsidian-900" value="back_shoulders">Back &amp; Posture</option>
                    <option className="bg-obsidian-900" value="legs_glutes">Legs &amp; Glutes</option>
                    <option className="bg-obsidian-900" value="yoga_mobility">Yoga &amp; Mobility</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Equipment
                  </label>
                  <select
                    value={aiEquipment}
                    onChange={(e) => setAiEquipment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  >
                    <option className="bg-obsidian-900" value="bodyweight">Zero Equipment / Bodyweight</option>
                    <option className="bg-obsidian-900" value="dumbbell">Dumbbells</option>
                    <option className="bg-obsidian-900" value="yogamat">Yoga Mat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Custom Prompt Focus (Optional)
                  </label>
                  <input
                    type="text"
                    value={aiFocus}
                    onChange={(e) => setAiFocus(e.target.value)}
                    placeholder="e.g., Knee-safe explosive finisher"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAi}
                className="gold-btn-outline w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize AI Exercise</span>
              </button>

              {generatedEx && (
                <div className="p-4 rounded-2xl bg-black/55 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={generatedEx.gifUrl}
                      alt={generatedEx.name}
                      className="w-20 h-20 rounded-xl object-contain dark-3d-animation bg-black shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        AI Generated · MET {generatedEx.metScore}
                      </span>
                      <h4 className="text-sm font-black text-white">{generatedEx.name}</h4>
                      <p className="text-slate-300">{generatedEx.tagline}</p>
                      <p className="text-[11px] text-emerald-300 font-semibold">Voice Cue: {generatedEx.voiceCue}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAiExercise}
                      className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save to Exercise Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLaunchAiExerciseNow}
                      className="gold-btn py-2.5 rounded-xl font-black flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start with Voice Coach</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AiAndCustomPlanModal;
