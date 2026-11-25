// Targeted Transformation Plans (30, 60, and 90 Days)
// Covers Belly Fat, Thigh Fat, Back Fat, Overall Body Fat, and Yoga/Face Sculpting.

export const TARGET_AREAS = [
  { id: 'belly_fat', label: 'Belly Fat & Core Shred', icon: 'Flame', desc: 'Target stubborn lower belly & visceral abdominal fat' },
  { id: 'hiit_600', label: '400-600 kcal Extreme HIIT', icon: 'Zap', desc: 'High-octane metabolic compound circuits to melt 400-600 kcal in one set' },
  { id: 'calisthenics', label: 'Calisthenics & Relative Power', icon: 'Award', desc: 'Bodyweight mastery: Planche, pull-ups, dips, L-sits & flags' },
  { id: 'thigh_fat', label: 'Thigh & Glute Sculpt', icon: 'Target', desc: 'Tone inner/outer thighs and lift glutes' },
  { id: 'back_fat', label: 'Back Fat & Posture Toning', icon: 'Shield', desc: 'Eliminate bra-line rolls and sculpt V-taper posture' },
  { id: 'overall_fat', label: 'Full Body Fat Loss', icon: 'Activity', desc: 'Whole body metabolic deficit & lean definition' },
  { id: 'yoga_face', label: 'Yoga & Face Sculpt', icon: 'Sparkles', desc: 'Holistic spine mobility, lymphatic drainage & jawline lift' },
];

export const WORKOUT_LOCATIONS = [
  { id: 'home', label: 'Home Living Room', icon: 'Home', badge: 'Zero Equipment', desc: 'Pure bodyweight on floor, living room mat, sofa or chair' },
  { id: 'gym', label: 'Commercial Gym', icon: 'Dumbbell', badge: 'Full Machinery', desc: 'Machines, barbells, cables, dumbbells & heavy free weights' },
  { id: 'calisthenics', label: 'Calisthenics Park', icon: 'Zap', badge: 'Bars & Rings', desc: 'Pull-up bars, parallel dip bars, rings & bodyweight levers' },
  { id: 'yoga', label: 'Yoga Sanctuary', icon: 'Sun', badge: 'Mat & Ball', desc: 'Barefoot on non-slip yoga mat, stability ball & facial hands' },
];

export const TRANSFORMATION_PLANS = [
  // BELLY FAT
  {
    id: 'belly-fat-30',
    targetArea: 'belly_fat',
    durationDays: 30,
    title: '30-Day Belly Fat Blitz',
    badge: 'High Intensity Sprint',
    dailyCalorieDeficit: 500,
    dailySugarLimitGrams: 20,
    workoutDaysPerWeek: 5,
    focus: 'Visceral abdominal fat melting & transverse abdominis activation',
    description: 'Fast-paced metabolic conditioning combining living room core intervals, machine crunches, and clean glycogen depletion.',
    recommendedExercises: [
      'abductors/side-bridge-hip-abduction',
      'yoga-sun-salutation',
      'home-diamond-pushups',
      'home-glute-bridge-march'
    ],
    dailyChecklist: [
      'Complete 25m core & HIIT session',
      'Fast 14 hours overnight for visceral lipolysis',
      'Keep refined sugar under 20g',
      'Drink 3.5L water with electrolytes'
    ]
  },
  {
    id: 'belly-fat-60',
    targetArea: 'belly_fat',
    durationDays: 60,
    title: '60-Day Deep Core Hypertrophy',
    badge: 'Sustainable Sculpt',
    dailyCalorieDeficit: 400,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Abdominal brick development & waistline tightening',
    description: 'Balanced progressive overload on cable crunches and hanging leg raises paired with steady-state fat oxidation.',
    recommendedExercises: [
      'yoga-downward-dog',
      'home-sofa-bulgarian-split-squat',
      'yoga-cobra-pose'
    ],
    dailyChecklist: [
      'Complete 35m hypertrophy workout',
      'Hit 2.0g protein per kg bodyweight',
      'Keep sugar under 25g',
      'Track morning fasted body weight'
    ]
  },
  {
    id: 'belly-fat-90',
    targetArea: 'belly_fat',
    durationDays: 90,
    title: '90-Day Six-Pack Metamorphosis',
    badge: 'Pro Athlete Standard',
    dailyCalorieDeficit: 350,
    dailySugarLimitGrams: 28,
    workoutDaysPerWeek: 5,
    focus: 'Full sub-12% body fat definition with dense abdominal rectus separation',
    description: 'The master transformation protocol: periodized resistance training, vacuum holds, and culinary precision.',
    recommendedExercises: [
      'pectorals/dumbbell-bench-press',
      'home-diamond-pushups',
      'yoga-sun-salutation'
    ],
    dailyChecklist: [
      'Perform 45m strength & core session',
      'Perform 3 sets of stomach vacuums upon waking',
      'Log exact meal grams into Nutrition Archive',
      'Maintain 8 hours restorative sleep'
    ]
  },

  // THIGH FAT
  {
    id: 'thigh-fat-30',
    targetArea: 'thigh_fat',
    durationDays: 30,
    title: '30-Day Lean Thigh Burnout',
    badge: 'Cellulite Flush',
    dailyCalorieDeficit: 450,
    dailySugarLimitGrams: 22,
    workoutDaysPerWeek: 4,
    focus: 'Adductor toning, quad definition & lymphatic fluid flush',
    description: 'High repetition living room sofa split squats, glute bridge marches, and low-impact incline strides.',
    recommendedExercises: [
      'home-sofa-bulgarian-split-squat',
      'home-glute-bridge-march',
      'home-wall-sit-burnout'
    ],
    dailyChecklist: [
      'Complete 30m lower body circuit',
      'Perform 10m foam rolling on quads & IT band',
      'Stay under 22g daily sugar',
      'Log daily weigh-in'
    ]
  },
  {
    id: 'thigh-fat-60',
    targetArea: 'thigh_fat',
    durationDays: 60,
    title: '60-Day Glute-Hamstring Curve Sculpt',
    badge: 'Athletic Lower Body',
    dailyCalorieDeficit: 400,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Glute-ham tie-in separation and outer thigh contouring',
    description: 'Progressive overload utilizing leg press machines, Romanian dumbbell deadlifts, and Warrior II yoga balances.',
    recommendedExercises: [
      'yoga-warrior-two',
      'home-sofa-bulgarian-split-squat',
      'home-wall-sit-burnout'
    ],
    dailyChecklist: [
      'Execute 40m lower body split',
      'Consume 130g+ clean protein',
      'Stay under 25g sugar threshold',
      'Hit 8,000 daily steps'
    ]
  },
  {
    id: 'thigh-fat-90',
    targetArea: 'thigh_fat',
    durationDays: 90,
    title: '90-Day Complete Lower Body Recomp',
    badge: 'Master Silhouette',
    dailyCalorieDeficit: 350,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 5,
    focus: 'Zero thigh chafing, firm inner adductors & sculpted gluteal shelf',
    description: 'Mastery of heavy squats, Bulgarian presses, and deep restorative pigeon yoga poses.',
    recommendedExercises: [
      'yoga-warrior-two',
      'yoga-sun-salutation',
      'home-sofa-bulgarian-split-squat'
    ],
    dailyChecklist: [
      '45m compound lower body training',
      'Drink 3.5L water',
      'Adhere to calibrated macro targets',
      'Complete 15m post-workout yoga stretch'
    ]
  },

  // BACK FAT
  {
    id: 'back-fat-30',
    targetArea: 'back_fat',
    durationDays: 30,
    title: '30-Day Bra-Line & Posture Reset',
    badge: 'Scapular Tone',
    dailyCalorieDeficit: 450,
    dailySugarLimitGrams: 22,
    workoutDaysPerWeek: 4,
    focus: 'Rhomboid retraction & mid-back subcutaneous fat reduction',
    description: 'Doorframe isometric lat squeezes, Cobra spine extensions, and lat pulldowns to banish back rolls.',
    recommendedExercises: [
      'home-doorframe-isometric-row',
      'yoga-cobra-pose',
      'yoga-downward-dog'
    ],
    dailyChecklist: [
      'Complete 25m upper back & postural sequence',
      'Maintain upright posture at workstation',
      'Keep refined sugar under 22g',
      'Hydrate with 3.0L water'
    ]
  },
  {
    id: 'back-fat-60',
    targetArea: 'back_fat',
    durationDays: 60,
    title: '60-Day V-Taper Toning',
    badge: 'Hourglass Waist Illusion',
    dailyCalorieDeficit: 400,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Latissimus width to create a naturally tapered, slimmer waist silhouette',
    description: 'Seated cable rows, face-pulls, and thoracic extension flows.',
    recommendedExercises: [
      'home-doorframe-isometric-row',
      'yoga-cobra-pose',
      'yoga-sun-salutation'
    ],
    dailyChecklist: [
      'Complete 35m back & posterior chain session',
      'Prioritize high-leucine protein sources',
      'Stay under 25g daily sugar'
    ]
  },
  {
    id: 'back-fat-90',
    targetArea: 'back_fat',
    durationDays: 90,
    title: '90-Day Athletic Spine & Sculpt',
    badge: 'Zero Back Fat',
    dailyCalorieDeficit: 350,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 5,
    focus: 'Chiseled erectors, dense rhomboid definition & effortless aristocratic posture',
    description: 'Full kinetic chain integration from deadlifts to doorframe rows and Cobra holds.',
    recommendedExercises: [
      'yoga-cobra-pose',
      'home-doorframe-isometric-row',
      'yoga-downward-dog'
    ],
    dailyChecklist: [
      '45m back & posture masterclass',
      'Fasted morning weigh-in',
      'Zero refined sugar snacks'
    ]
  },

  // OVERALL BODY FAT
  {
    id: 'overall-fat-30',
    targetArea: 'overall_fat',
    durationDays: 30,
    title: '30-Day Full Body Shred Sprint',
    badge: 'Rapid Weight Drop',
    dailyCalorieDeficit: 500,
    dailySugarLimitGrams: 20,
    workoutDaysPerWeek: 5,
    focus: 'Full body metabolic furnace & glycogen depletion',
    description: 'Cross-discipline protocol mixing gym machines, living room bodyweight circuits, and yoga recovery.',
    recommendedExercises: [
      'yoga-sun-salutation',
      'home-diamond-pushups',
      'home-sofa-bulgarian-split-squat'
    ],
    dailyChecklist: [
      'Complete 30m HIIT / circuit session',
      'Hit daily calorie deficit target',
      'Strict <20g sugar limit',
      'Drink 3.5L water'
    ]
  },
  {
    id: 'overall-fat-60',
    targetArea: 'overall_fat',
    durationDays: 60,
    title: '60-Day Body Recomposition',
    badge: 'Lean Athletic Physique',
    dailyCalorieDeficit: 400,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Simultaneous fat loss and lean skeletal muscle preservation',
    description: 'Optimal 2g/kg protein diet with progressive overload on 3D gym machines and daily yoga flows.',
    recommendedExercises: [
      'yoga-sun-salutation',
      'pectorals/dumbbell-bench-press',
      'yoga-warrior-two'
    ],
    dailyChecklist: [
      'Complete 40m progressive workout',
      'Log all meals with AI camera scanner',
      'Maintain daily protein threshold'
    ]
  },
  {
    id: 'overall-fat-90',
    targetArea: 'overall_fat',
    durationDays: 90,
    title: '90-Day Total Metamorphosis',
    badge: 'Complete Transformation',
    dailyCalorieDeficit: 350,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 5,
    focus: 'Total lifestyle and metabolic reset for lifelong low body fat',
    description: 'Complete fitness mastery across all movement categories, calibrated to body weight telemetry.',
    recommendedExercises: [
      'yoga-sun-salutation',
      'home-doorframe-isometric-row',
      'home-sofa-bulgarian-split-squat'
    ],
    dailyChecklist: [
      '45m disciplined workout',
      'Check in body fat & BMI in Vault',
      'Stay under 25g sugar target'
    ]
  },

  // YOGA & FACE SCULPT
  {
    id: 'yoga-face-30',
    targetArea: 'yoga_face',
    durationDays: 30,
    title: '30-Day Jawline Sculpt & Holistic Yoga',
    badge: 'Facial Definition & Zen',
    dailyCalorieDeficit: 300,
    dailySugarLimitGrams: 20,
    workoutDaysPerWeek: 6,
    focus: 'Jawline tightening, double chin reduction & spine decompressing flows',
    description: 'Daily 10m Face Yoga routines paired with 20m full body Surya Namaskar and restorative poses.',
    recommendedExercises: [
      'face-yoga-jawline-sculpt',
      'face-yoga-cheekbone-lift',
      'yoga-sun-salutation',
      'yoga-downward-dog'
    ],
    dailyChecklist: [
      'Perform 10m Face Yoga jawline & cheek sequence',
      'Complete 20m Full Body Yoga flow',
      'Drink 3.5L water for facial lymphatic drainage',
      'Zero refined sugar to reduce puffiness'
    ]
  },
  {
    id: 'yoga-face-60',
    targetArea: 'yoga_face',
    durationDays: 60,
    title: '60-Day Youth Contour & Posture Overhaul',
    badge: 'Natural Facelift',
    dailyCalorieDeficit: 300,
    dailySugarLimitGrams: 22,
    workoutDaysPerWeek: 5,
    focus: 'Zygomaticus cheek elevation, forehead smoothing & core posture integration',
    description: 'Deep facial neuromuscular resistance combined with full body Warrior and Balance poses.',
    recommendedExercises: [
      'face-yoga-cheekbone-lift',
      'face-yoga-forehead-smooth',
      'yoga-warrior-two',
      'yoga-cobra-pose'
    ],
    dailyChecklist: [
      '12m Face Yoga resistance workout',
      '25m Spine & core yoga practice',
      'Track hydration & body fat in Vault'
    ]
  },
  {
    id: 'yoga-face-90',
    targetArea: 'yoga_face',
    durationDays: 90,
    title: '90-Day Complete Bio-Harmonic Transformation',
    badge: 'Supreme Zen & Chiseled Features',
    dailyCalorieDeficit: 250,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 5,
    focus: 'Maximal jawline sharpness, high cheekbone volume & effortless posture',
    description: 'The definitive anti-aging and holistic body sculpting curriculum.',
    recommendedExercises: [
      'face-yoga-jawline-sculpt',
      'face-yoga-cheekbone-lift',
      'face-yoga-forehead-smooth',
      'yoga-sun-salutation'
    ],
    dailyChecklist: [
      '15m Face Yoga master sequence',
      '30m Full Body Asana flow',
      'Log daily photo in Vault for body fat & face symmetry'
    ]
  },

  // 400-600 KCAL EXTREME HIIT INCINERATOR
  {
    id: 'hiit-600-30',
    targetArea: 'hiit_600',
    durationDays: 30,
    title: '30-Day 400-600 kcal Extreme HIIT Blitz',
    badge: 'High-Octane Incinerator',
    dailyCalorieDeficit: 600,
    dailySugarLimitGrams: 18,
    workoutDaysPerWeek: 5,
    focus: 'Maximal EPOC afterburn and metabolic output burning 400-600 kcal in one set',
    description: 'High-intensity compound circuits combining burpees, jump squats, mountain climber escalations, and sprint intervals.',
    recommendedExercises: [
      'semi-squat-jump-male',
      'bodyweight-drop-jump-squat',
      'push-up-to-side-plank'
    ],
    dailyChecklist: [
      'Complete 35m 500 kcal HIIT circuit',
      'Hydrate with 3.5L electrolyte water',
      'Keep refined sugar under 18g',
      'Maintain explosive concentric cadence'
    ]
  },
  {
    id: 'hiit-600-60',
    targetArea: 'hiit_600',
    durationDays: 60,
    title: '60-Day Elite Metabolic Furnace',
    badge: 'Athletic Conditioning',
    dailyCalorieDeficit: 550,
    dailySugarLimitGrams: 20,
    workoutDaysPerWeek: 5,
    focus: 'Unstoppable VO2 max engine and rapid subcutaneous adipose melt',
    description: 'Progressive multi-round tabata intervals delivering 500-600 kcal burns and continuous all-day fat oxidation.',
    recommendedExercises: [
      'semi-squat-jump-male',
      'push-up-to-side-plank',
      'flag'
    ],
    dailyChecklist: [
      'Complete 40m 550 kcal HIIT circuit',
      'Hit 2.0g protein per kg bodyweight',
      'Log workout output into Fitness Log'
    ]
  },
  {
    id: 'hiit-600-90',
    targetArea: 'hiit_600',
    durationDays: 90,
    title: '90-Day Master Calorie Incinerator',
    badge: 'Olympic Conditioning',
    dailyCalorieDeficit: 500,
    dailySugarLimitGrams: 22,
    workoutDaysPerWeek: 5,
    focus: 'Single-digit body fat conditioning with peak cardiovascular power',
    description: 'The pinnacle of high-intensity functional conditioning: 600+ kcal daily burns and total metabolic supremacy.',
    recommendedExercises: [
      'semi-squat-jump-male',
      'full-planche',
      'flag'
    ],
    dailyChecklist: [
      'Complete 45m 600 kcal master HIIT circuit',
      'Track resting heart rate & recovery in Vault',
      'Maintain 8 hours restorative sleep'
    ]
  },

  // CALISTHENICS & RELATIVE POWER
  {
    id: 'calisthenics-30',
    targetArea: 'calisthenics',
    durationDays: 30,
    title: '30-Day Calisthenic Power & Push/Pull',
    badge: 'Relative Strength',
    dailyCalorieDeficit: 400,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Scapular depression, strict pull-up strength & parallel bar dip power',
    description: 'Foundational gymnastic strength protocol utilizing zero weights: build relative power with strict bodyweight control.',
    recommendedExercises: [
      'biceps-pull-up',
      'push-up-to-side-plank',
      'l-sit-on-floor'
    ],
    dailyChecklist: [
      'Complete 30m calisthenics upper body session',
      'Practice 3x 15s hollow body holds',
      'Log daily weigh-in'
    ]
  },
  {
    id: 'calisthenics-60',
    targetArea: 'calisthenics',
    durationDays: 60,
    title: '60-Day Bar Mastery & L-Sit/Dragon Flag',
    badge: 'Gymnastic Progression',
    dailyCalorieDeficit: 350,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 4,
    focus: 'Strict muscle-up progressions, straight-arm levers & dense core armor',
    description: 'Advance from basic bars to static core leverage: master L-sits, dragon flags, and explosive pull-ups.',
    recommendedExercises: [
      'frog-planche',
      'l-sit-on-floor',
      'biceps-narrow-pull-ups'
    ],
    dailyChecklist: [
      'Complete 40m intermediate bar progression',
      'Practice 3x 20s L-sit or tuck planche holds',
      'Hit 2.2g protein per kg'
    ]
  },
  {
    id: 'calisthenics-90',
    targetArea: 'calisthenics',
    durationDays: 90,
    title: '90-Day Full Planche & Human Flag Mastery',
    badge: 'Elite Bodyweight King',
    dailyCalorieDeficit: 300,
    dailySugarLimitGrams: 25,
    workoutDaysPerWeek: 5,
    focus: 'Straddle planche, full planche, and human flag static hold dominance',
    description: 'The supreme relative strength achievement: defying gravity through tendon density and hollow-body tension.',
    recommendedExercises: [
      'full-planche',
      'flag',
      'straddle-planche'
    ],
    dailyChecklist: [
      'Complete 45m elite calisthenics skill session',
      'Perform isometric static hold tests',
      'Verify joint and tendon health with rest'
    ]
  }
];
