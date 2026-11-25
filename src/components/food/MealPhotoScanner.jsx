import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  X,
  Scale,
  Award,
  Utensils,
  Search,
  Image as ImageIcon,
  SwitchCamera,
  ScanLine,
} from 'lucide-react';
import { FOOD_SCAN_PRESETS, NEXT_MEAL_PROMPTS } from '../../data/foodData';
import { MASSIVE_FOOD_CATALOG } from '../../data/massiveFoodDatabase';
import { analyzeMealPhoto } from '../../utils/mealVisionAnalyzer';
import { useApp } from '../../context/AppContext';

export function MealPhotoScanner({ onClose, onMealLogged }) {
  const { user, logMeal } = useApp();
  const [mealType, setMealType] = useState('lunch');

  // 'camera' starts open automatically whenever "Snap & Scan Meal" opens
  const [viewMode, setViewMode] = useState('camera');
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraState, setCameraState] = useState('starting'); // 'starting' | 'active' | 'unavailable'
  const [cameraNotice, setCameraNotice] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [selectedNextMealPrompt, setSelectedNextMealPrompt] = useState(NEXT_MEAL_PROMPTS[0].id);
  const [customDishName, setCustomDishName] = useState('');
  const [customSugarInput, setCustomSugarInput] = useState('');
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(true);
  const lastFileNameRef = useRef('');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
            // ignore
          }
        });
        streamRef.current = null;
      }
    };
  }, []);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startLiveCamera = useCallback(
    async (preferredFacing = facingMode) => {
      stopCameraStream();
      setCameraState('starting');
      setCameraNotice('');

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraState('unavailable');
        setCameraNotice('Live camera is not supported on this browser — upload a meal photo or tap Snap Photo below.');
        return;
      }

      try {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: preferredFacing }, width: { ideal: 1280 }, height: { ideal: 960 } },
            audio: false,
          });
        } catch {
          // Fallback to any available webcam/camera if exact facingMode fails (e.g. laptops)
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraState('active');
      } catch {
        if (!mountedRef.current) return;
        setCameraState('unavailable');
        setCameraNotice('Camera access unavailable or blocked — upload a meal photo below to calculate nutrition & calories.');
      }
    },
    [facingMode, stopCameraStream]
  );

  // Open live camera immediately when camera mode is active & release cleanly on mode switch
  useEffect(() => {
    if (viewMode === 'camera') {
      startLiveCamera(facingMode);
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [viewMode, facingMode, startLiveCamera, stopCameraStream]);

  // Run Pixel + Filename + FoodDB Vision Nutrition Scanner
  const runVisionAnalysis = async (photoUrl, { fileName = '', explicitPreset = null } = {}) => {
    setIsScanning(true);
    setScanResult(null);
    setPortionMultiplier(1);
    setCustomDishName('');
    setCustomSugarInput('');

    const startTs = Date.now();
    const result = await analyzeMealPhoto({
      photoUrl,
      fileName,
      mealType,
      userWeight: user.currentWeight || 75,
      dailyCalorieTarget: user.dailyCalorieTarget || 2200,
      explicitPreset,
    });

    const elapsed = Date.now() - startTs;
    const minScanDelay = Math.max(0, 680 - elapsed);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setIsScanning(false);
      setScanResult(result);
    }, minScanDelay);
  };

  // Capture live camera frame and scan immediately
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || cameraState !== 'active') return;

    const vw = video.videoWidth || 960;
    const vh = video.videoHeight || 720;
    const maxDim = 960;
    const scale = Math.min(1, maxDim / Math.max(vw, vh));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(vw * scale);
    canvas.height = Math.round(vh * scale);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCameraStream();
    const snapName = `camera-snap-${Date.now()}.jpg`;
    lastFileNameRef.current = snapName;
    setSelectedPhoto(capturedDataUrl);
    setViewMode('photo');
    runVisionAnalysis(capturedDataUrl, { fileName: snapName });
  };

  // Upload gallery photo or mobile camera capture & scan immediately
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCameraStream();
    lastFileNameRef.current = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      const photoUrl = event.target?.result;
      setSelectedPhoto(photoUrl);
      setViewMode('photo');
      runVisionAnalysis(photoUrl, { fileName: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPreset = (preset) => {
    stopCameraStream();
    lastFileNameRef.current = '';
    setSelectedPhoto(preset.sampleImage);
    setViewMode('photo');
    runVisionAnalysis(preset.sampleImage, { explicitPreset: preset });
  };

  const handleSelectCandidate = (candidate) => {
    runVisionAnalysis(selectedPhoto || candidate.sampleImage, { explicitPreset: candidate });
  };

  const catalogMatches = useMemo(() => {
    const q = dishSearchQuery.toLowerCase().trim();
    if (!q) return [];
    return MASSIVE_FOOD_CATALOG.filter((item) =>
      (item.title || item.name || '').toLowerCase().includes(q)
    ).slice(0, 6);
  }, [dishSearchQuery]);

  const handleSelectCatalogFood = async (item) => {
    const converted = {
      dishName: item.title || item.name,
      category: item.category || mealType,
      estimatedCalories: item.calories || 350,
      servingGrams: 320,
      macros: {
        protein: Math.round(item.protein || 22),
        carbs: Math.round(item.carbs || 30),
        fats: Math.round(item.fats || 12),
        fiber: Math.round(item.fiber || 5),
        sugar: Math.max(2, Math.round((item.carbs || 25) * 0.14)),
      },
      detectedIngredients:
        item.ingredients?.map((i) => i.name) || [item.title || item.name, 'Measured Serving'],
      sampleImage: item.image || selectedPhoto || FOOD_SCAN_PRESETS[0].sampleImage,
    };
    stopCameraStream();
    setDishSearchQuery('');
    if (!selectedPhoto) {
      setSelectedPhoto(converted.sampleImage);
    }
    setViewMode('photo');
    setPortionMultiplier(1);
    setCustomDishName(converted.dishName);
    const updated = await analyzeMealPhoto({
      photoUrl: selectedPhoto || converted.sampleImage,
      mealType,
      userWeight: user.currentWeight || 75,
      dailyCalorieTarget: user.dailyCalorieTarget || 2200,
      explicitPreset: converted,
    });
    setScanResult(updated);
  };

  const scaledMetrics = useMemo(() => {
    if (!scanResult) return null;
    const calories = Math.round(scanResult.estimatedCalories * portionMultiplier);
    const protein = Math.round(scanResult.macros.protein * portionMultiplier);
    const carbs = Math.round(scanResult.macros.carbs * portionMultiplier);
    const fats = Math.round(scanResult.macros.fats * portionMultiplier);
    const fiber = Math.round((scanResult.macros.fiber || 4) * portionMultiplier);
    const grams = Math.round((scanResult.estimatedWeightGrams || 330) * portionMultiplier);
    const baseSugar = scanResult.macros.sugar || Math.max(2, Math.round((scanResult.macros.carbs || 25) * 0.14));
    const sugar =
      customSugarInput !== ''
        ? Math.max(0, Math.round(parseFloat(customSugarInput) || 0))
        : Math.round(baseSugar * portionMultiplier);

    return { calories, protein, carbs, fats, fiber, sugar, grams };
  }, [scanResult, portionMultiplier, customSugarInput]);

  const handleClose = () => {
    stopCameraStream();
    if (onClose) onClose();
  };

  const handleCommitLog = () => {
    if (!scanResult || !scaledMetrics) return;
    const nextMealObj = NEXT_MEAL_PROMPTS.find((p) => p.id === selectedNextMealPrompt);

    logMeal({
      mealType,
      title: customDishName || scanResult.dishName,
      calories: scaledMetrics.calories,
      protein: scaledMetrics.protein,
      carbs: scaledMetrics.carbs,
      sugar: scaledMetrics.sugar,
      fats: scaledMetrics.fats,
      fiber: scaledMetrics.fiber,
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
      stopCameraStream();
      if (onMealLogged) onMealLogged();
      if (onClose) onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Live Camera & Vision Nutrition AI
              </span>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight mt-0.5">
                Snap or Upload Meal Photo
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close scanner"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Meal Window + Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                Select Meal Window
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition border active:scale-95 ${
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
          </div>

          {/* LIVE CAMERA VIEWFINDER OR UPLOADED/SNAPPED PHOTO STAGE */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-[#050608] shadow-xl">
            <div className="relative w-full h-64 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
              {viewMode === 'camera' ? (
                <>
                  {/* Live Camera Stream */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraState === 'active' ? 'opacity-100' : 'opacity-20'}`}
                  />

                  {/* AR Viewfinder Reticle Corners when Camera Active */}
                  {cameraState === 'active' && (
                    <div className="absolute inset-6 pointer-events-none">
                      <div className="w-7 h-7 border-t-2 border-l-2 border-amber-400 rounded-tl-lg absolute top-0 left-0" />
                      <div className="w-7 h-7 border-t-2 border-r-2 border-amber-400 rounded-tr-lg absolute top-0 right-0" />
                      <div className="w-7 h-7 border-b-2 border-l-2 border-amber-400 rounded-bl-lg absolute bottom-0 left-0" />
                      <div className="w-7 h-7 border-b-2 border-r-2 border-amber-400 rounded-br-lg absolute bottom-0 right-0" />
                    </div>
                  )}

                  {/* Camera Status Pill */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 border border-white/10 text-[10px] font-bold text-slate-200 flex items-center gap-1.5 backdrop-blur-md">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cameraState === 'active'
                            ? 'bg-emerald-400 animate-pulse'
                            : cameraState === 'starting'
                            ? 'bg-amber-400 animate-ping'
                            : 'bg-rose-400'
                        }`}
                      />
                      {cameraState === 'active'
                        ? 'LIVE CAMERA ACTIVE · FRAME YOUR PLATE'
                        : cameraState === 'starting'
                        ? 'OPENING CAMERA...'
                        : 'CAMERA UNAVAILABLE — UPLOAD PHOTO'}
                    </span>

                    {cameraState === 'active' && (
                      <button
                        type="button"
                        onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                        className="p-2 rounded-full bg-black/75 border border-white/15 text-slate-200 hover:text-amber-300 backdrop-blur-md transition active:scale-95"
                        title="Flip Front/Back Camera"
                        aria-label="Flip camera"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Camera Unavailable / Permission Prompt Overlay */}
                  {cameraState === 'unavailable' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-obsidian-900/90">
                      <Camera className="w-10 h-10 text-amber-400/70 mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-white max-w-md">
                        {cameraNotice}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
                        <label className="cursor-pointer gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95">
                          <ImageIcon className="w-4 h-4" />
                          <span>Upload Meal Photo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 active:scale-95">
                          <Camera className="w-4 h-4" />
                          <span>Device Camera App</span>
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button
                          type="button"
                          onClick={() => startLiveCamera(facingMode)}
                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry Camera</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Live Camera Shutter Dock */}
                  {cameraState === 'active' && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black text-xs font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition active:scale-95">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>

                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="gold-btn px-5 py-2.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 shadow-gold-glow active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap & Scan Meal</span>
                      </button>

                      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                        Auto-Macros & kcal
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Captured / Uploaded Photo Preview */}
                  {selectedPhoto && (
                    <img
                      src={selectedPhoto}
                      alt="Scanned Meal Photo"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Shimmer Laser Scanner Beam when analyzing photo pixels */}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/35 to-transparent scanner-beam pointer-events-none border-b-2 border-amber-400" />
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <ScanLine className="w-4 h-4" />
                            <span>Scanning Plate Pixels, Calories & Macros...</span>
                          </p>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Estimating portion volume, protein, carbs, fats & sugar
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Controls on Scanned Photo */}
                  {!isScanning && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setScanResult(null);
                            setViewMode('camera');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-black/85 hover:bg-black text-xs font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition active:scale-95"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Open Camera</span>
                        </button>

                        <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-black/85 hover:bg-black text-xs font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition active:scale-95">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Upload Another Photo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          runVisionAnalysis(
                            selectedPhoto,
                            lastFileNameRef.current
                              ? { fileName: lastFileNameRef.current }
                              : { explicitPreset: scanResult }
                          )
                        }
                        className="px-3.5 py-2 rounded-xl gold-btn text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-Scan</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Helper Prompt before first scan */}
          {viewMode === 'camera' && !scanResult && !isScanning && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-200">
                Point your camera at any meal & tap <strong className="text-amber-300">Snap & Scan Meal</strong>, or{' '}
                <strong className="text-amber-300">Upload a Photo</strong> to estimate calories, protein, carbs, fats, fiber & sugar.
              </span>
            </div>
          )}

          {/* Quick Scan Presets + 500+ Database Dish Matcher */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Quick Sample Meals:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FOOD_SCAN_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-obsidian-850 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white transition shrink-0"
                >
                  {preset.dishName}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Match custom dish from 500+ database (e.g. paneer, salmon, eggs, oatmeal, whey)..."
                value={dishSearchQuery}
                onChange={(e) => setDishSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
              />
              {catalogMatches.length > 0 && (
                <div className="mt-1.5 p-1.5 rounded-xl bg-obsidian-900 border border-amber-500/30 space-y-1 max-h-40 overflow-y-auto">
                  {catalogMatches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCatalogFood(item)}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs hover:bg-amber-500/15 flex items-center justify-between transition"
                    >
                      <span className="font-semibold text-white truncate">{item.title || item.name}</span>
                      <span className="text-[11px] font-mono text-amber-300 shrink-0 ml-2">
                        {item.calories} kcal · {Math.round(item.protein || 0)}g P
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CALCULATED NUTRITION & CALORIE BREAKDOWN */}
          {scanResult && scaledMetrics && !isScanning && (
            <div className="space-y-5 pt-1 animate-in fade-in duration-300">
              {/* Visual Vision Telemetry Bar */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>{scanResult.confidencePct || 91}% Match</strong> ({scanResult.matchSource || 'Vision AI'}) ·{' '}
                    Est. Plate Weight: <strong>~{scaledMetrics.grams}g</strong>
                  </span>
                </div>
                {scanResult.visualSummary && (
                  <span className="text-[11px] text-slate-300 font-mono truncate">
                    {scanResult.visualSummary}
                  </span>
                )}
              </div>

              {/* Alternative Visual Candidates (1-tap switch if desired) */}
              {scanResult.alternativeCandidates?.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                    Similar Matches:
                  </span>
                  {scanResult.alternativeCandidates.map((cand) => (
                    <button
                      key={cand.id || cand.dishName}
                      type="button"
                      onClick={() => handleSelectCandidate(cand)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition"
                    >
                      {cand.dishName} ({cand.estimatedCalories} kcal)
                    </button>
                  ))}
                </div>
              )}

              {/* Dish Name, Portion & Calorie Breakdown Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Scanned Meal Estimate (Editable)
                    </span>
                    <input
                      type="text"
                      value={customDishName !== '' ? customDishName : scanResult.dishName}
                      onChange={(e) => setCustomDishName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 focus:border-amber-400 outline-none text-base sm:text-lg font-black text-white py-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                      {[0.5, 1, 1.5, 2].map((mult) => (
                        <button
                          key={mult}
                          type="button"
                          onClick={() => setPortionMultiplier(mult)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                            portionMultiplier === mult
                              ? 'bg-amber-500 text-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {mult}x
                        </button>
                      ))}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl sm:text-3xl font-black text-amber-300">
                        {scaledMetrics.calories}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-1">kcal</span>
                    </div>
                  </div>
                </div>

                {/* Exact Macronutrient Pillars + Editable Sugar */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Protein</span>
                    <div className="text-sm sm:text-base font-black text-amber-400">{scaledMetrics.protein}g</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Carbs</span>
                    <div className="text-sm sm:text-base font-black text-sky-400">{scaledMetrics.carbs}g</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">Sugar (g)</span>
                    <input
                      type="number"
                      min="0"
                      value={customSugarInput !== '' ? customSugarInput : scaledMetrics.sugar}
                      onChange={(e) => setCustomSugarInput(e.target.value)}
                      className="w-full text-center bg-transparent text-sm sm:text-base font-black text-amber-300 outline-none"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Fats</span>
                    <div className="text-sm sm:text-base font-black text-emerald-400">{scaledMetrics.fats}g</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Fiber</span>
                    <div className="text-sm sm:text-base font-black text-purple-400">{scaledMetrics.fiber}g</div>
                  </div>
                </div>

                {/* Detected Ingredients */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Estimated Ingredients on Plate:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(scanResult.detectedIngredients || []).map((ing, idx) => (
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

              {/* Dynamic Health Rating & Evaluation */}
              <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Nutritional Rating & Sugar Impact
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {scanResult.evaluation.badgeText}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-gold-glow-sm">
                      {scanResult.evaluation.score}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scanResult.feedback || scanResult.evaluation.feedback}
                </p>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center gap-2 text-xs text-amber-300">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Estimated sugar load: <strong>{scaledMetrics.sugar}g</strong> · Calibrated to{' '}
                    <strong>{user.currentWeight}kg</strong> profile.
                  </span>
                </div>
              </div>

              {/* Next-Meal Smart Guidance */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Next Meal Balance Guidance
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NEXT_MEAL_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => setSelectedNextMealPrompt(prompt.id)}
                      className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                        selectedNextMealPrompt === prompt.id
                          ? 'bg-amber-500/15 border-amber-400 shadow-gold-glow-sm'
                          : 'bg-black/30 border-white/5 hover:border-amber-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white">{prompt.title}</span>
                        {selectedNextMealPrompt === prompt.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{prompt.desc}</p>
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
            {scaledMetrics ? (
              <span>
                Logging: <strong className="text-amber-300">{scaledMetrics.calories} kcal</strong> ·{' '}
                <strong className="text-slate-200">{scaledMetrics.protein}g P</strong> ·{' '}
                <strong className="text-slate-200">{scaledMetrics.sugar}g sugar</strong>
              </span>
            ) : isScanning ? (
              <span>Analyzing photo calories & nutrition...</span>
            ) : (
              <span>Snap camera or upload photo to scan nutrition</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommitLog}
              disabled={!scanResult || isScanning || isSuccess}
              className="gold-btn px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Logged to Diary!</span>
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>Log to Food Diary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
