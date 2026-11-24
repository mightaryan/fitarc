import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  Flame,
  Scale,
  Award,
  ArrowRight,
  RefreshCw,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { FOOD_SCAN_PRESETS, NEXT_MEAL_PROMPTS, evaluateMealNutrition } from '../../data/foodData';
import { useApp } from '../../context/AppContext';

export function MealPhotoScanner({ onClose, onMealLogged }) {
  const { user, logMeal } = useApp();
  const [mealType, setMealType] = useState('breakfast');
  const [selectedPhoto, setSelectedPhoto] = useState(FOOD_SCAN_PRESETS[0].sampleImage);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedNextMealPrompt, setSelectedNextMealPrompt] = useState(NEXT_MEAL_PROMPTS[0].id);
  const [customDishName, setCustomDishName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Trigger simulated AI Vision Analysis
  const runAnalysis = (photoUrl, preset = null) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const chosenPreset = preset || FOOD_SCAN_PRESETS[0];
      const evaluation = evaluateMealNutrition(
        chosenPreset.estimatedCalories,
        chosenPreset.macros.protein,
        chosenPreset.macros.carbs,
        chosenPreset.macros.fats,
        user.currentWeight,
        user.dailyCalorieTarget
      );

      setScanResult({
        ...chosenPreset,
        evaluation,
        photoUrl: photoUrl || chosenPreset.sampleImage,
      });
    }, 1400);
  };

  // Handle custom image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result;
        setSelectedPhoto(photoUrl);
        // Random preset match for visual demonstration
        const randomPreset = FOOD_SCAN_PRESETS[Math.floor(Math.random() * FOOD_SCAN_PRESETS.length)];
        runAnalysis(photoUrl, randomPreset);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle preset sample selection
  const handleSelectPreset = (preset) => {
    setSelectedPhoto(preset.sampleImage);
    runAnalysis(preset.sampleImage, preset);
  };

  // Commit log to food diary
  const handleCommitLog = () => {
    if (!scanResult) return;
    const nextMealObj = NEXT_MEAL_PROMPTS.find((p) => p.id === selectedNextMealPrompt);

    logMeal({
      mealType,
      title: customDishName || scanResult.dishName,
      calories: scanResult.estimatedCalories,
      protein: scanResult.macros.protein,
      carbs: scanResult.macros.carbs,
      fats: scanResult.macros.fats,
      photoUrl: scanResult.photoUrl,
      rating: {
        score: scanResult.evaluation.score,
        grade: scanResult.evaluation.grade,
        badgeText: scanResult.evaluation.badgeText,
        feedback: scanResult.evaluation.feedback,
      },
      nextMealGuidance: {
        chosen: nextMealObj?.id,
        title: nextMealObj?.title,
        text: nextMealObj?.desc,
      },
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onMealLogged) onMealLogged();
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-obsidian-900/90 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Vision Food Scanner
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Upload & Analyze Meal
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Meal Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Select Meal Window
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                    mealType === type
                      ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow-sm'
                      : 'bg-obsidian-850/80 text-slate-300 border-white/5 hover:border-amber-500/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload & Camera Area */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/25 bg-black/60 group">
            {/* Display Selected Image */}
            <div className="relative w-full h-64 sm:h-80 bg-obsidian-900 flex items-center justify-center overflow-hidden">
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt="Meal Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <Camera className="w-12 h-12 text-amber-500/40 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-semibold">Snap or upload a photo of your meal</p>
                  <p className="text-xs text-slate-500">Camera / File Upload / Pre-sets</p>
                </div>
              )}

              {/* Shimmer laser scanner beam when scanning */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent scanner-beam pointer-events-none border-b-2 border-amber-400" />
              )}

              {/* Overlay scanning HUD */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-amber-300 uppercase tracking-widest">
                      Analyzing Volumetric Density & Ingredients...
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cross-referencing nutritional database with {user.currentWeight}kg profile
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons inside photo */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-xs font-bold text-amber-300 border border-amber-500/40 flex items-center gap-2 backdrop-blur-md shadow-lg transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo / Take Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {!isScanning && (
                  <button
                    onClick={() => runAnalysis(selectedPhoto)}
                    className="px-4 py-2 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Re-Scan Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Preset Selector for Demo Testing */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Or test with sample meal presets:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {FOOD_SCAN_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-obsidian-850 border border-white/5 hover:border-amber-500/40 text-slate-300 hover:text-white transition shrink-0"
                >
                  {preset.dishName}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Results Display */}
          {scanResult && !isScanning && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-300">
              {/* Dish Name & Calorie Breakdown Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Identified Plate
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">{scanResult.dishName}</h3>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">
                      {scanResult.estimatedCalories}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">kcal</span>
                  </div>
                </div>

                {/* Exact Macronutrient Pillars */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Protein</span>
                    <div className="text-lg font-black text-amber-400">{scanResult.macros.protein}g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Carbs</span>
                    <div className="text-lg font-black text-sky-400">{scanResult.macros.carbs}g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Fats</span>
                    <div className="text-lg font-black text-emerald-400">{scanResult.macros.fats}g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Fiber</span>
                    <div className="text-lg font-black text-purple-400">{scanResult.macros.fiber}g</div>
                  </div>
                </div>

                {/* Detected Ingredients */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Detected Key Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.detectedIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-xs bg-obsidian-700/80 border border-white/10 text-slate-200"
                      >
                        ✓ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Health Rating & Evaluation as per User Weight */}
              <div className="p-5 rounded-2xl bg-obsidian-850/80 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Nutritional Rating & Weight Sync
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {scanResult.evaluation.badgeText}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-sm flex items-center justify-center shadow-gold-glow-sm">
                      {scanResult.evaluation.score}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {scanResult.feedback || scanResult.evaluation.feedback}
                </p>

                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-2 text-xs text-amber-300">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Calculated for your current <strong>{user.currentWeight} kg</strong> body weight and{' '}
                    <strong>{user.dailyCalorieTarget} kcal</strong> daily target.
                  </span>
                </div>
              </div>

              {/* Requirement: Next-Meal Smart Guidance Task */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Next Meal Balance Guidance
                    </h4>
                    <p className="text-xs text-slate-400">
                      How would you like your next meal to optimize today's balance?
                    </p>
                  </div>
                </div>

                {/* Options for next meal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {NEXT_MEAL_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => setSelectedNextMealPrompt(prompt.id)}
                      className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                        selectedNextMealPrompt === prompt.id
                          ? 'bg-amber-500/15 border-amber-400 shadow-gold-glow-sm'
                          : 'bg-black/30 border-white/5 hover:border-amber-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{prompt.title}</span>
                        {selectedNextMealPrompt === prompt.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{prompt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {scanResult ? (
              <span>
                Total logged: <strong className="text-amber-300">{scanResult.estimatedCalories} kcal</strong>
              </span>
            ) : (
              <span>Select or upload meal to analyze</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCommitLog}
              disabled={!scanResult || isScanning || isSuccess}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Meal Logged to Diary!
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  Log to Food Diary
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
