// High-Intensity Interval Training (Full 30-Min Arena), Body Part x Duration Sets,
// and AI Exercise & Custom Plan Generator.
// ALL gifUrl entries below use verified existing ExerciseGymGifsDB@v1.1.0 paths.

export const HIIT_CARDIO_EXERCISES = [
  {
    id: 'hiit-jumping-jacks',
    name: 'Jumping Jacks Warm-Up',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'warm_up',
    level: 'Beginner',
    muscleCategory: 'Cardio',
    muscle: 'cardio',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Easy full-body cardio warm-up to wake up your heart and shoulders.',
    metScore: 8.5,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Steady',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/jack-jump-male.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif',
    voiceCue: 'Start with Jumping Jacks. Land softly on your toes and raise both hands overhead.',
    proTip: 'Keep your knees slightly soft on every landing to protect your ankles and shins.',
    primaryMuscles: [
      { name: 'Full Body Cardio', percentage: 90, color: '#f43f5e' },
      { name: 'Shoulders & Calves', percentage: 70, color: '#fbbf24' },
    ],
    setupSteps: ['Stand tall with feet together and arms at your sides.'],
    formSteps: ['Hop feet out wide while swinging arms overhead, then hop back together smoothly.'],
    commonMistakes: ['Locking knees stiffly when landing.', 'Holding your breath instead of breathing steadily.'],
  },
  {
    id: 'hiit-high-knees-sprint',
    name: 'High Knees Drive',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'aerobic',
    level: 'Intermediate',
    muscleCategory: 'Cardio',
    muscle: 'cardio',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Fast standing cardio drill that burns belly & leg fat quickly.',
    metScore: 10.5,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Brisk Pace',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/high-knee-against-wall.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/wind-sprints.gif',
    voiceCue: 'Lift knees up toward hip height one after another while keeping your back straight.',
    proTip: 'Stay light on the balls of your feet instead of stomping heavy on your heels.',
    primaryMuscles: [
      { name: 'Cardio & Hip Flexors', percentage: 94, color: '#f43f5e' },
      { name: 'Lower Abs & Quads', percentage: 75, color: '#f59e0b' },
    ],
    setupSteps: ['Stand tall with feet hip-width apart and brace your tummy gently.'],
    formSteps: ['Drive one knee up cleanly toward hip level, then switch briskly to the other leg.'],
    commonMistakes: ['Leaning backwards while lifting knees.', 'Holding breath halfway through.'],
  },
  {
    id: 'hiit-mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'tabata',
    level: 'Intermediate',
    muscleCategory: 'Core',
    muscle: 'abs',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Plank-position knee drives that torch calories and tighten abs together.',
    metScore: 11.2,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 4,
    defaultReps: '45 Sec Continuous',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/mountain-climber.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/bridge-mountain-climber-cross-body.gif',
    voiceCue: 'Hold a steady plank with hands under shoulders, and drive one knee forward at a time.',
    proTip: 'Keep your hips flat instead of lifting them high in the air.',
    primaryMuscles: [
      { name: 'Abs & Core', percentage: 88, color: '#f59e0b' },
      { name: 'Cardio & Shoulders', percentage: 80, color: '#f43f5e' },
    ],
    setupSteps: ['Get into a straight-arm plank with wrists lined up beneath your shoulders.'],
    formSteps: ['Pull your right knee in toward your chest, extend it back, and switch quickly with the left leg.'],
    commonMistakes: ['Letting hips bounce up and down.', 'Sagging your lower back toward the floor.'],
  },
  {
    id: 'hiit-burpee-chest-slam',
    name: 'Classic Burpees',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'finisher',
    level: 'Advanced',
    muscleCategory: 'Full Body',
    muscle: 'full-body',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Full-body fat-burn move combining squat, plank, and jump.',
    metScore: 12.2,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 4,
    defaultReps: '45 Sec Steady Reps',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/jack-burpee.gif',
    voiceCue: 'Squat down, place palms on floor, step or hop back to plank, bring feet forward, and stand up strong.',
    proTip: 'Beginners can step feet back one leg at a time instead of jumping back.',
    primaryMuscles: [
      { name: 'Full Body Burn', percentage: 96, color: '#f43f5e' },
      { name: 'Legs, Chest & Core', percentage: 85, color: '#f59e0b' },
    ],
    setupSteps: ['Stand with feet shoulder-width apart and clear space behind you.'],
    formSteps: ['Lower hands to floor, extend into plank, step or jump feet back up, and reach arms up.'],
    commonMistakes: ['Dropping hips low in plank.', 'Rushing and losing footing.'],
  },
  {
    id: 'hiit-low-impact-march-lunge',
    name: 'Knee-Safe Marching Lunge',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'warm_up',
    level: 'Beginner',
    muscleCategory: 'Cardio',
    muscle: 'cardio',
    equipment: 'bodyweight',
    equipmentLabel: 'Low-Impact Cardio',
    tagline: 'Zero-jump gentle knee drive & step cadence for beginners.',
    metScore: 7.4,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Smooth Step',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/walking-high-knees-lunge.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/back-and-forth-step.gif',
    voiceCue: 'Step smoothly and lift your knee comfortably. No jumping impact on your joints.',
    proTip: 'Keep chest lifted and breathe out each time your knee rises.',
    primaryMuscles: [
      { name: 'Heart Rate & Legs', percentage: 85, color: '#10b981' },
      { name: 'Glutes & Core', percentage: 68, color: '#fbbf24' },
    ],
    setupSteps: ['Stand comfortably with arms ready to balance your stride.'],
    formSteps: ['Alternate stepping gently and lifting your front knee up to waist height.'],
    commonMistakes: ['Holding breath.', 'Hunching shoulders forward.'],
  },
  {
    id: 'hiit-jump-squats',
    name: 'Power Squat Hops',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'tabata',
    level: 'Intermediate',
    muscleCategory: 'Legs',
    muscle: 'quads',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Strong lower-body toner that lifts glutes and boosts cardio output.',
    metScore: 10.6,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Controlled',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/semi-squat-jump-male.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/split-squats.gif',
    voiceCue: 'Sit back like sitting in a chair, hop gently, and land smoothly into bent knees.',
    proTip: 'Keep your chest proud and point knees in the same direction as your toes.',
    primaryMuscles: [
      { name: 'Thighs & Glutes', percentage: 92, color: '#f59e0b' },
      { name: 'Calves & Cardio', percentage: 80, color: '#f43f5e' },
    ],
    setupSteps: ['Place feet shoulder-width apart with toes turned out slightly.'],
    formSteps: ['Squat down comfortably, spring upward lightly, and absorb your landing gently.'],
    commonMistakes: ['Knees caving inward together.', 'Landing flat on stiff heels.'],
  },
  {
    id: 'hiit-plank-twist',
    name: 'Plank Twist Core Burn',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'tabata',
    level: 'Intermediate',
    muscleCategory: 'Core',
    muscle: 'abs',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Side-to-side plank rotation that trims waistline & strengthens shoulders.',
    metScore: 8.8,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Steady',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/front-plank-with-twist.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/push-up-to-side-plank.gif',
    voiceCue: 'Hold your plank tight and gently turn one hip side to side without dropping your belly.',
    proTip: 'Move slowly with control rather than rushing the twist.',
    primaryMuscles: [{ name: 'Side Abs (Obliques) & Core', percentage: 90, color: '#f59e0b' }],
    setupSteps: ['Support yourself in a steady plank with tight core.'],
    formSteps: ['Rotate hips side to side gently while keeping shoulders steady.'],
    commonMistakes: ['Dropping lower back toward mat.'],
  },
  {
    id: 'hiit-skater-bounds',
    name: 'Speed Skater Side Steps',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'aerobic',
    level: 'Intermediate',
    muscleCategory: 'Legs',
    muscle: 'glutes',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Side-to-side athletic steps shaping outer thighs and boosting stamina.',
    metScore: 9.4,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Side-to-Side',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/skater-hops.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/ski-step.gif',
    voiceCue: 'Step or hop smoothly side to side like a speed skater, swinging arms naturally.',
    proTip: 'Keep your chest facing forward rather than bending too far down.',
    primaryMuscles: [
      { name: 'Glutes & Outer Thighs', percentage: 88, color: '#10b981' },
      { name: 'Cardio Endurance', percentage: 84, color: '#f43f5e' },
    ],
    setupSteps: ['Stand at one side of your mat with knees softly bent.'],
    formSteps: ['Step or bound lightly from right foot to left foot in smooth rhythm.'],
    commonMistakes: ['Rounding upper back.', 'Over-striding beyond comfortable balance.'],
  },
  {
    id: 'hiit-step-out-jacks',
    name: 'Astride Step Jacks',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'warm_up',
    level: 'Beginner',
    muscleCategory: 'Cardio',
    muscle: 'cardio',
    equipment: 'bodyweight',
    equipmentLabel: 'Low-Impact Cardio',
    tagline: 'Smooth alternating stride steps & overhead arm reaches.',
    metScore: 7.2,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Easy Cadence',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/astride-jumps-male.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/half-knee-bends-male.gif',
    voiceCue: 'Move arms and feet in rhythm, keeping steps light and shoulders relaxed.',
    proTip: 'Great option whenever you want a gentle cardio pace.',
    primaryMuscles: [{ name: 'Cardio & Shoulders', percentage: 82, color: '#10b981' }],
    setupSteps: ['Stand upright with relaxed shoulders.'],
    formSteps: ['Step or hop feet front-to-back smoothly while swinging opposite arms.'],
    commonMistakes: ['Tensing up your neck.'],
  },
  {
    id: 'hiit-bicycle-crunch-turbo',
    name: 'Bicycle Abs Crunches',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'aerobic',
    level: 'Beginner',
    muscleCategory: 'Core',
    muscle: 'abs',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Beginner-friendly floor crunch movement engaging upper, lower & side abs.',
    metScore: 8.4,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Controlled',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/elbow-to-knee.gif',
    voiceCue: 'Bring your shoulder gently across toward the opposite knee while keeping your neck relaxed.',
    proTip: 'Keep fingertips light behind your ears — avoid pulling your head forward.',
    primaryMuscles: [{ name: 'Upper & Side Abs', percentage: 92, color: '#f59e0b' }],
    setupSteps: ['Lie comfortably on your back with knees bent.'],
    formSteps: ['Rotate chest softly toward the raised knee, then switch sides steadily.'],
    commonMistakes: ['Pulling on your neck with your hands.'],
  },
  {
    id: 'hiit-scissor-jumps',
    name: 'Scissor Switch Jumps',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'finisher',
    level: 'Intermediate',
    muscleCategory: 'Cardio',
    muscle: 'legs',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Quick front-back footwork sprint for stamina and leg tone.',
    metScore: 9.6,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Brisk Pace',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/scissor-jumps-male.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/ski-step.gif',
    voiceCue: 'Switch feet briskly front to back while pumping arms smoothly at your sides.',
    proTip: 'Keep hops low and springy rather than jumping too high.',
    primaryMuscles: [{ name: 'Legs & Endurance', percentage: 90, color: '#f43f5e' }],
    setupSteps: ['Stand tall in a staggered stance.'],
    formSteps: ['Alternate front and back foot quickly in a crisp scissor rhythm.'],
    commonMistakes: ['Landing heavy on straight knees.'],
  },
  {
    id: 'hiit-alternating-lunges-pulse',
    name: 'Alternating Split Squats',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'aerobic',
    level: 'Beginner',
    muscleCategory: 'Legs',
    muscle: 'quads',
    equipment: 'bodyweight',
    equipmentLabel: 'Low-Impact HIIT',
    tagline: 'Knee-friendly leg & glute toner without any jumping.',
    metScore: 8.9,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Alternating',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/split-squats.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/half-knee-bends-male.gif',
    voiceCue: 'Lower slowly into a comfortable split squat and press smoothly through your front heel.',
    proTip: 'Hold onto a wall or chair back lightly if you want extra balance.',
    primaryMuscles: [{ name: 'Thighs & Glutes', percentage: 90, color: '#f59e0b' }],
    setupSteps: ['Step one foot back comfortably, chest upright.'],
    formSteps: ['Bend knees smoothly to comfortable depth and stand back tall.'],
    commonMistakes: ['Front knee wobbling inward.'],
  },
  {
    id: 'hiit-inchworm-walkout',
    name: 'Inchworm Walkout Stretch',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'tabata',
    level: 'Beginner',
    muscleCategory: 'Full Body',
    muscle: 'chest',
    equipment: 'bodyweight',
    equipmentLabel: 'Low-Impact Cardio',
    tagline: 'Walk hands out to plank & back — stretches legs while toning core.',
    metScore: 8.6,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Smooth Flow',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/inchworm.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif',
    voiceCue: 'Reach hands to the floor, walk out smoothly to plank, pause briefly, and walk back up.',
    proTip: 'Bend your knees slightly if your hamstrings feel tight.',
    primaryMuscles: [{ name: 'Core, Arms & Hamstrings', percentage: 86, color: '#f59e0b' }],
    setupSteps: ['Stand at the back edge of your mat.'],
    formSteps: ['Walk hands forward to straight plank, hold 1 second, then walk back and stand.'],
    commonMistakes: ['Sinking hips low at the plank position.'],
  },
  {
    id: 'hiit-star-jumps',
    name: 'Explosive Star Jumps',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'finisher',
    level: 'Advanced',
    muscleCategory: 'Full Body',
    muscle: 'cardio',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'High-energy full-body finisher to spike fat-burn at peak pace.',
    metScore: 11.5,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Peak Burn',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/star-jump-male.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/jack-jump-male.gif',
    voiceCue: 'Tuck down slightly, spring up into an open star shape, and land quietly.',
    proTip: 'Exhale smoothly on every jump.',
    primaryMuscles: [{ name: 'Full Body Stamina', percentage: 94, color: '#f43f5e' }],
    setupSteps: ['Start in a comfortable quarter-squat stance.'],
    formSteps: ['Jump outward extending arms and legs cleanly, then melt back down softly.'],
    commonMistakes: ['Landing stiff-legged.'],
  },
  {
    id: 'hiit-jump-rope-bounce',
    name: 'Air Rope Cardio Bounce',
    category: 'cardio',
    subCategory: 'hiit_cardio',
    phaseTag: 'aerobic',
    level: 'Beginner',
    muscleCategory: 'Cardio',
    muscle: 'calves',
    equipment: 'bodyweight',
    equipmentLabel: 'No Equipment',
    tagline: 'Classic boxing footwork bounce — with or without an actual rope.',
    metScore: 10.0,
    lowImpact: false,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 3,
    defaultReps: '45 Sec Light Hops',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/jump-rope.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/back-and-forth-step.gif',
    voiceCue: 'Spin wrists briskly at your sides and bounce lightly an inch off the ground.',
    proTip: 'Stay relaxed through your shoulders and keep breathing steadily.',
    primaryMuscles: [{ name: 'Calves & Heart Rate', percentage: 90, color: '#f43f5e' }],
    setupSteps: ['Stand tall with elbows tucked gently close to your ribs.'],
    formSteps: ['Circle wrists softly and hop lightly in place.'],
    commonMistakes: ['Jumping unnecessarily high off the floor.'],
  },
  {
    id: 'hiit-cooldown-cobra-child',
    name: 'Cooldown Recovery Flow',
    category: 'yoga',
    subCategory: 'yoga_mat',
    phaseTag: 'cooldown',
    level: 'Beginner',
    muscleCategory: 'Full Body',
    muscle: 'spine',
    equipment: 'yogamat',
    equipmentLabel: 'Cooldown Stretches',
    tagline: 'Gentle stretch & calm breathing to bring heart rate smoothly down.',
    metScore: 3.4,
    lowImpact: true,
    defaultDuration: '45 Sec',
    defaultMinutes: 2,
    defaultSets: 2,
    defaultReps: '45 Sec Deep Breath',
    gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif',
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif',
    voiceCue: 'Slow your breathing down. Four seconds in through your nose, six seconds gentle exhale.',
    proTip: 'Relax your shoulders away from your ears as you stretch.',
    primaryMuscles: [{ name: 'Recovery & Back Stretch', percentage: 90, color: '#10b981' }],
    setupSteps: ['Kneel comfortably on your mat.'],
    formSteps: ['Flow gently forward and open your chest while breathing calmly.'],
    commonMistakes: ['Holding breath right after hard cardio.'],
  },
];

// Clean Beginner-Friendly Body Part Sets
export const BODY_PART_SETS = [
  {
    id: 'hiit_cardio',
    label: 'HIIT Cardio',
    subtitle: 'Full 30m Cardio & Fat Burn',
    icon: '⚡',
    accent: 'from-rose-500/25 via-orange-500/15 to-obsidian-900 border-rose-500/40',
    metAvg: 10.2,
  },
  {
    id: 'abs',
    label: 'Abs & Core',
    subtitle: 'Six-Pack & Belly Shred',
    icon: '🔥',
    accent: 'from-amber-500/25 via-orange-500/15 to-obsidian-900 border-amber-500/40',
    metAvg: 7.4,
  },
  {
    id: 'chest',
    label: 'Chest & Push',
    subtitle: 'Upper Body Sculpt',
    icon: '🛡️',
    accent: 'from-yellow-500/20 via-amber-500/10 to-obsidian-900 border-amber-500/35',
    metAvg: 7.2,
  },
  {
    id: 'arms',
    label: 'Arms & Shoulders',
    subtitle: 'Toned Biceps & Triceps',
    icon: '💪',
    accent: 'from-sky-500/25 via-blue-500/15 to-obsidian-900 border-sky-500/40',
    metAvg: 6.8,
  },
  {
    id: 'back_shoulders',
    label: 'Back & Posture',
    subtitle: 'Strong Back & Upright Form',
    icon: '🦅',
    accent: 'from-indigo-500/25 via-cyan-500/15 to-obsidian-900 border-indigo-500/40',
    metAvg: 7.0,
  },
  {
    id: 'legs_glutes',
    label: 'Legs & Glutes',
    subtitle: 'Toned Thighs & Strength',
    icon: '🦵',
    accent: 'from-emerald-500/25 via-teal-500/15 to-obsidian-900 border-emerald-500/40',
    metAvg: 8.1,
  },
  {
    id: 'full_body',
    label: 'Full Body',
    subtitle: 'Complete All-In-One Set',
    icon: '🏆',
    accent: 'from-purple-500/25 via-pink-500/15 to-obsidian-900 border-purple-500/40',
    metAvg: 8.8,
  },
  {
    id: 'yoga_mobility',
    label: 'Yoga & Stretch',
    subtitle: 'Mat Flow & Flexibility',
    icon: '🧘',
    accent: 'from-teal-500/25 via-emerald-500/15 to-obsidian-900 border-teal-500/40',
    metAvg: 4.5,
  },
];

export const DURATION_OPTIONS = [
  { minutes: 7, label: '7 Min', tag: 'Quick' },
  { minutes: 15, label: '15 Min', tag: 'Express' },
  { minutes: 20, label: '20 Min', tag: 'Standard' },
  { minutes: 30, label: '30 Min', tag: 'Full' },
];

export const LEAP_ACHIEVEMENT_BADGES = [
  { id: 'first_sweat', title: 'First Workout', reqDays: 1, desc: 'Completed Day 1 Guided Session', icon: '⚡' },
  { id: 'streak_3', title: '3-Day Streak', reqDays: 3, desc: 'Stayed active across 3 challenge days', icon: '🔥' },
  { id: 'streak_7', title: 'Week 1 Finisher', reqDays: 7, desc: 'Completed a full 7-day block', icon: '🛡️' },
  { id: 'streak_15', title: 'Halfway Milestone', reqDays: 15, desc: 'Completed 15 challenge days', icon: '🏆' },
  { id: 'streak_30', title: '30-Day Finisher', reqDays: 30, desc: 'Finished full 30-day calendar', icon: '👑' },
];

function matchesBodyPart(ex, bodyPartId) {
  if (!ex) return false;
  const muscle = `${ex.muscleCategory || ''} ${ex.muscle || ''} ${ex.name || ''} ${ex.targetArea || ''}`.toLowerCase();
  const cat = `${ex.category || ''} ${ex.subCategory || ''}`.toLowerCase();
  switch (bodyPartId) {
    case 'hiit_cardio':
      return cat.includes('hiit') || cat.includes('cardio') || /burpee|jack|mountain|skater|jump|rope|sprint|high knee/.test(muscle);
    case 'abs':
      return /abs|core|crunch|plank|belly|oblique|mountain climber/.test(muscle);
    case 'chest':
      return /chest|pec|push-up|push up|press|dip/.test(muscle);
    case 'arms':
      return /arm|bicep|tricep|shoulder|delt|dip|curl/.test(muscle);
    case 'back_shoulders':
      return /back|lat|row|pull|scapula|delt|superman|extension/.test(muscle);
    case 'legs_glutes':
      return /leg|quad|glute|thigh|hamstring|squat|lunge|bridge|calf/.test(muscle);
    case 'yoga_mobility':
      return cat.includes('yoga') || /yoga|surya|stretch|mobility|cobra|spine/.test(muscle);
    case 'full_body':
    default:
      return true;
  }
}

export function buildBodyPartSession({
  bodyPartId = 'hiit_cardio',
  durationMinutes = 30,
  level = 'Beginner',
  lowImpact = false,
  catalogExercises = [],
  userWeightKg = 75,
}) {
  const workSec = durationMinutes >= 25 ? 45 : 40;
  const restSec = 15;
  const roundSec = workSec + restSec;
  const targetRounds = Math.max(7, Math.round((durationMinutes * 60) / roundSec));

  const combinedPool = [...HIIT_CARDIO_EXERCISES, ...catalogExercises];

  let pool = combinedPool.filter((ex) => {
    if (!ex || ex.category === 'face_yoga') return false;
    if (lowImpact && ex.lowImpact === false) return false;
    return matchesBodyPart(ex, bodyPartId);
  });

  if (pool.length < 6) {
    const fallback = combinedPool.filter((ex) => !lowImpact || ex.lowImpact !== false);
    pool = [...pool, ...fallback.filter((f) => !pool.some((p) => p.id === f.id))];
  }

  const warmUps = HIIT_CARDIO_EXERCISES.filter((e) => e.phaseTag === 'warm_up' && (!lowImpact || e.lowImpact));
  const coolDowns = HIIT_CARDIO_EXERCISES.filter((e) => e.phaseTag === 'cooldown');
  const mainPool = pool.filter((e) => e.phaseTag !== 'warm_up' && e.phaseTag !== 'cooldown');
  const effectiveMain = mainPool.length > 0 ? mainPool : pool;

  const sequence = [];
  for (let i = 0; i < targetRounds; i++) {
    let pick;
    let phaseLabel = 'Main Set';
    if (durationMinutes >= 20 && i < 2 && warmUps.length > 0) {
      pick = warmUps[i % warmUps.length];
      phaseLabel = 'Warm-Up';
    } else if (durationMinutes >= 20 && i >= targetRounds - 2 && coolDowns.length > 0) {
      pick = coolDowns[i % coolDowns.length];
      phaseLabel = 'Cooldown';
    } else {
      pick = effectiveMain[i % effectiveMain.length];
      if (durationMinutes >= 25 && i > targetRounds * 0.65) phaseLabel = 'Finisher';
    }

    const roundNumber = Math.floor(i / effectiveMain.length) + 1;
    sequence.push({
      ...pick,
      sessionItemId: `${pick.id}-r${i + 1}`,
      name: roundNumber > 1 && i >= 2 && i < targetRounds - 2 ? `${pick.name} (Round ${roundNumber})` : pick.name,
      defaultDuration: `${workSec} Sec`,
      phaseLabel,
      voiceCue: pick.voiceCue || `${pick.name}. Keep your posture tall and breathe steadily.`,
    });
  }

  const meta = BODY_PART_SETS.find((b) => b.id === bodyPartId) || BODY_PART_SETS[0];
  const avgMet = sequence.reduce((sum, ex) => sum + (Number(ex.metScore) || meta.metAvg), 0) / (sequence.length || 1);
  const estimatedCalories = Math.round(((avgMet * 3.5 * userWeightKg) / 200) * durationMinutes);

  return {
    title: `${durationMinutes}-Min ${meta.label} (${level})`,
    badge: `${durationMinutes} Min · ${targetRounds} Rounds`,
    bodyPartId,
    durationMinutes,
    level,
    lowImpact,
    restDurationSeconds: restSec,
    estimatedCalories,
    exercises: sequence,
  };
}

export function generateAiExercise({
  goal = 'fat_loss',
  bodyPart = 'abs',
  equipment = 'bodyweight',
  level = 'Beginner',
  customFocus = '',
}) {
  const partMap = {
    abs: { label: 'Core & Abs', mus: 'Abs & Core', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif' },
    chest: { label: 'Chest & Push', mus: 'Chest & Triceps', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif' },
    arms: { label: 'Arms & Shoulders', mus: 'Biceps & Triceps', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-arms/dumbbell-alternate-biceps-curl.gif' },
    back_shoulders: { label: 'Back & Posture', mus: 'Upper Back & Lats', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/suspended-row.gif' },
    legs_glutes: { label: 'Legs & Glutes', mus: 'Quads & Glutes', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/split-squats.gif' },
    hiit_cardio: { label: 'HIIT Cardio', mus: 'Full Body Cardio', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif' },
    yoga_mobility: { label: 'Yoga & Flexibility', mus: 'Back & Flexibility', gif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif' },
  };
  const info = partMap[bodyPart] || partMap.hiit_cardio;
  const prefix = goal === 'muscle_gain' ? 'Strength' : goal === 'stamina' ? 'Stamina' : 'Fat-Burn';
  const focusSuffix = customFocus.trim() ? ` — ${customFocus.trim()}` : '';

  return {
    id: `ai-ex-${Date.now().toString(36)}`,
    name: `AI ${prefix}: ${info.label}${focusSuffix}`,
    category: bodyPart === 'yoga_mobility' ? 'yoga' : equipment === 'dumbbell' ? 'freeweights' : bodyPart === 'hiit_cardio' ? 'cardio' : 'home_workout',
    subCategory: bodyPart === 'yoga_mobility' ? 'yoga_mat' : 'home_workout',
    level,
    muscleCategory: bodyPart === 'hiit_cardio' ? 'Cardio' : bodyPart === 'abs' ? 'Core' : bodyPart === 'legs_glutes' ? 'Legs' : 'Full Body',
    muscle: bodyPart,
    equipment,
    equipmentLabel: `AI Exercise · ${equipment === 'bodyweight' ? 'No Equipment' : equipment}`,
    tagline: `Beginner-friendly ${level.toLowerCase()} AI exercise tailored for your ${goal.replace('_', ' ')} goal.`,
    metScore: bodyPart === 'hiit_cardio' ? 10.4 : bodyPart === 'yoga_mobility' ? 4.4 : 7.5,
    lowImpact: bodyPart !== 'hiit_cardio',
    defaultDuration: '45 Sec',
    defaultMinutes: 15,
    defaultSets: level === 'Beginner' ? 3 : 4,
    defaultReps: goal === 'muscle_gain' ? '10–12 Slow Reps' : '45 Sec Steady',
    gifUrl: info.gif,
    fallbackGif: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif',
    voiceCue: `Focus on smooth controlled movement targeting your ${info.label}. Breathe evenly throughout.`,
    proTip: `Go slow and steady on the lowering phase so your ${info.mus} stays engaged safely.`,
    primaryMuscles: [{ name: info.mus, percentage: 90, color: '#f59e0b' }],
    setupSteps: [`Set up comfortably for ${equipment} movement targeting ${info.label}.`],
    formSteps: ['Move smoothly with steady breathing and avoid rushing your reps.'],
    commonMistakes: ['Holding your breath.', 'Using jerky swinging momentum.'],
    isCustom: true,
    isAiGenerated: true,
  };
}

export function generateCustomUserPlan({
  planName = '',
  goal = 'fat_loss',
  exerciseTypes = ['hiit_cardio', 'abs', 'yoga_mobility'],
  durationDays = 30,
  dailyMinutes = 30,
  daysPerWeek = 5,
  userWeightKg = 75,
}) {
  const safeTypes = Array.isArray(exerciseTypes) && exerciseTypes.length > 0 ? exerciseTypes : ['hiit_cardio', 'full_body'];
  const goalLabels = {
    fat_loss: { title: 'Fat Loss', deficit: 450, sugar: 20, proteinPerKg: 1.8 },
    muscle_gain: { title: 'Strength & Tone', deficit: -200, sugar: 28, proteinPerKg: 2.0 },
    stamina: { title: 'HIIT & Energy', deficit: 300, sugar: 24, proteinPerKg: 1.7 },
    flexibility: { title: 'Mobility & Reset', deficit: 200, sugar: 22, proteinPerKg: 1.5 },
  };
  const g = goalLabels[goal] || goalLabels.fat_loss;
  const computedTitle =
    planName.trim() || `${durationDays}-Day Custom ${g.title} (${safeTypes.map((t) => BODY_PART_SETS.find((b) => b.id === t)?.label.split(' ')[0] || t).slice(0, 2).join(' + ')})`;

  const dailyProtein = Math.round((Number(userWeightKg) || 75) * g.proteinPerKg);
  const splitSchedule = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
    if (idx >= daysPerWeek) {
      return { day, focus: 'Rest & Easy Walk (8k Steps)', type: 'recovery', minutes: 15 };
    }
    const assigned = safeTypes[idx % safeTypes.length];
    const meta = BODY_PART_SETS.find((b) => b.id === assigned) || BODY_PART_SETS[0];
    return {
      day,
      focus: `${meta.label} (${dailyMinutes} min)`,
      type: assigned,
      minutes: dailyMinutes,
    };
  });

  return {
    id: `custom-plan-${Date.now().toString(36)}`,
    title: computedTitle,
    targetArea: safeTypes.includes('abs') ? 'belly_fat' : safeTypes.includes('legs_glutes') ? 'thigh_fat' : safeTypes.includes('yoga_mobility') ? 'yoga_mobility' : 'overall_fat',
    exerciseTypes: safeTypes,
    goal,
    durationDays: Number(durationDays) || 30,
    dailySessionMinutes: Number(dailyMinutes) || 30,
    workoutLocation: safeTypes.includes('yoga_mobility') && safeTypes.length === 1 ? 'yoga' : 'home',
    badge: 'My Custom Plan',
    priceINR: 0,
    mrpINR: 99,
    dailyCalorieDeficit: g.deficit,
    dailySugarLimitGrams: g.sugar,
    dailyProteinTargetGrams: dailyProtein,
    workoutDaysPerWeek: Number(daysPerWeek) || 5,
    focus: `${daysPerWeek} days/week · ${dailyMinutes} min/day (${safeTypes.join(', ')})`,
    description: `Beginner-friendly ${durationDays}-day custom schedule with ${dailyProtein}g daily protein and simple step-by-step sessions.`,
    splitSchedule,
    dailyChecklist: [
      `Finish ${dailyMinutes} min guided session`,
      `Drink 3L+ water & hit ${dailyProtein}g protein`,
      'Keep added sugar balanced',
      'Track morning weigh-in',
    ],
    isCustomUserPlan: true,
    active: true,
  };
}
