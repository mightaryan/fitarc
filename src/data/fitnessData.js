// Comprehensive catalogue of Gym Machines, Cardio, Free Weights, and Calisthenics
// Formulated with MET (Metabolic Equivalent of Task) scores for exact calorie burn calculation based on user weight.

export const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'All Disciplines', icon: 'Sparkles' },
  { id: 'machines', label: 'Gym Machines', icon: 'Cpu' },
  { id: 'cardio', label: 'Cardio & Walking', icon: 'Flame' },
  { id: 'freeweights', label: 'Free Weights', icon: 'Dumbbell' },
  { id: 'calisthenics', label: 'Calisthenics', icon: 'Activity' },
  { id: 'mobility', label: 'Mobility & Core', icon: 'Shield' },
];

export const MUSCLE_GROUPS = [
  'All Muscles',
  'Chest',
  'Back & Lats',
  'Quads & Glutes',
  'Hamstrings',
  'Shoulders',
  'Arms (Biceps/Triceps)',
  'Core & Abs',
  'Full Body',
];

export const FITNESS_CATALOG = [
  {
    id: 'chest-press-machine',
    name: 'Converging Chest Press Machine',
    category: 'machines',
    level: 'Beginner to Advanced',
    muscleCategory: 'Chest',
    tagline: 'Isolate pecs with guided biomechanics and zero shoulder impingement',
    metScore: 6.0, // MET base
    hypertrophyRate: 0.92, // High hypertrophy stimulus
    primaryMuscles: [
      { name: 'Pectoralis Major (Mid & Lower)', percentage: 88, color: '#f59e0b' },
      { name: 'Anterior Deltoids (Front Shoulder)', percentage: 54, color: '#fbbf24' },
      { name: 'Triceps Brachii', percentage: 48, color: '#d97706' },
    ],
    animationType: 'chest_press',
    overview: 'The seated converging chest press machine provides a fixed arc of motion that matches the natural human pushing trajectory. It eliminates the balance requirement of free dumbbells while allowing progressive overload safely without a spotter.',
    setupSteps: [
      'Adjust seat height so handles align with mid-chest level (nipple line).',
      'Select pin weight that allows 8-12 smooth controlled repetitions.',
      'Sit back firmly with shoulder blades retracted (pinched together) and chest puffed forward.',
      'Grip the handles firmly with neutral wrists and elbows angled at ~45-60° to torso (avoid flaring elbows to 90°).'
    ],
    formSteps: [
      'Inhale deep into the diaphragm, bracing your core and driving feet into the floor.',
      'Exhale and push forward smoothly in a continuous arc without locking out elbows aggressively at apex.',
      'Squeeze the chest muscles for 1 second at full extension.',
      'Resist on the way back for 3 slow seconds (eccentric phase) until handles reach chest depth, feeling a deep stretch.'
    ],
    commonMistakes: [
      'Allowing shoulders to roll forward off the bench during the push (causes AC joint strain).',
      'Flaring elbows straight out sideways at 90 degrees.',
      'Dropping the weight stack abruptly without controlling the eccentric return.'
    ],
    proTip: 'Keep your shoulder blades glued to the seat back throughout the entire rep. Think of pushing yourself back into the seat rather than just pushing the handles away.',
    badge: 'Flagship Chest Builder',
    defaultMinutes: 20,
    defaultSets: 4,
    defaultReps: 10,
    intensityFactors: {
      light: 0.85,
      moderate: 1.0,
      high: 1.25,
      maximum: 1.45,
    }
  },
  {
    id: 'lat-pulldown-machine',
    name: 'Wide & Neutral Grip Lat Pulldown',
    category: 'machines',
    level: 'All Levels',
    muscleCategory: 'Back & Lats',
    tagline: 'Sculpt the classic V-taper lat width with optimal spinal alignment',
    metScore: 5.8,
    hypertrophyRate: 0.89,
    primaryMuscles: [
      { name: 'Latissimus Dorsi (Lats)', percentage: 92, color: '#f59e0b' },
      { name: 'Biceps Brachii', percentage: 60, color: '#fbbf24' },
      { name: 'Rhomboids & Mid Traps', percentage: 50, color: '#d97706' },
      { name: 'Rear Delts', percentage: 40, color: '#b45309' },
    ],
    animationType: 'lat_pulldown',
    overview: 'The Lat Pulldown is the gold standard vertical pulling movement. It allows lifters of any bodyweight to train the latissimus dorsi through its complete active contractile range, improving posture and upper body pulling power.',
    setupSteps: [
      'Adjust the thigh roller pad snugly over your quadriceps so your lower body remains anchored.',
      'Take a grip slightly wider than shoulder-width with palms facing away (overhand) or use neutral MAG grips.',
      'Sit down, securing thighs under pads with feet flat on the floor.',
      'Establish a slight 10-15° lean back from the hips with ribcage elevated.'
    ],
    formSteps: [
      'Initiate the movement by depressing your shoulder blades downward (scapular pull).',
      'Pull the bar down toward your upper chest/collarbone, driving your elbows straight down toward your hip pockets.',
      'Pause for 1 second at the bottom, squeezing your lats vigorously.',
      'Slowly guide the bar back up over 3 seconds, letting your shoulder blades rise for a full overhead lat stretch.'
    ],
    commonMistakes: [
      'Swinging torso backwards excessively like a row to use momentum.',
      'Pulling behind the neck (dangerous cervical spine pressure).',
      'Pulling exclusively with arms rather than driving with elbows.'
    ],
    proTip: 'Do not think about pulling the bar with your hands; treat your hands merely as hooks and imagine driving your elbows straight down toward your ribs.',
    badge: 'V-Taper Essential',
    defaultMinutes: 20,
    defaultSets: 4,
    defaultReps: 12,
  },
  {
    id: 'leg-press-machine',
    name: '45-Degree Incline Leg Press',
    category: 'machines',
    level: 'All Levels',
    muscleCategory: 'Quads & Glutes',
    tagline: 'Massive lower body hypertrophy with stabilized lumbar support',
    metScore: 7.2,
    hypertrophyRate: 0.95,
    primaryMuscles: [
      { name: 'Quadriceps (Vastus Medialis & Lateralis)', percentage: 94, color: '#f59e0b' },
      { name: 'Gluteus Maximus', percentage: 72, color: '#fbbf24' },
      { name: 'Hamstrings & Adductors', percentage: 55, color: '#d97706' },
      { name: 'Calves (Gastrocnemius)', percentage: 30, color: '#b45309' },
    ],
    animationType: 'leg_press',
    overview: 'The 45° leg press eliminates spinal compression while loading the lower limbs with high mechanical tension. Varying foot placement allows targeting of inner quads, outer sweep, or glutes.',
    setupSteps: [
      'Adjust the backrest angle to around 45 degrees so your hips remain comfortably flat without pelvis tucking.',
      'Sit into the carriage with your lower back pressed firmly against the lumbar pad.',
      'Place feet shoulder-width apart on the sled platform, toes pointing slightly outward (15°).',
      'Disengage the safety locking levers using the side handles.'
    ],
    formSteps: [
      'Inhale deeply and unrack the sled. Keep hands holding the side handles firmly to pull your hips into the seat.',
      'Lower the sled slowly by bending knees until knees reach a 90-degree angle or just before your lower back peels off the pad.',
      'Do not allow knees to cave inward during the descent.',
      'Drive powerfully through your mid-foot and heels to push the sled back up, stopping just short of locking knees.'
    ],
    commonMistakes: [
      'Locking out knees completely at the top (can cause catastrophic joint hyperextension under heavy load).',
      'Letting the pelvis curl upward off the pad at bottom (causes lumbar disc shear).',
      'Knees collapsing inward during ascent.'
    ],
    proTip: 'Never let your knees hyperextend or snap straight at the top. Keep a soft micro-bend in the knees to maintain tension on the quads and preserve joint longevity.',
    badge: 'Ultimate Quad Builder',
    defaultMinutes: 25,
    defaultSets: 4,
    defaultReps: 10,
  },
  {
    id: 'seated-cable-row',
    name: 'Low Cable Seated Row',
    category: 'machines',
    level: 'Beginner to Intermediate',
    muscleCategory: 'Back & Lats',
    tagline: 'Mid-back thickness, rhomboid density, and postural correction',
    metScore: 6.2,
    hypertrophyRate: 0.88,
    primaryMuscles: [
      { name: 'Rhomboids & Mid Traps', percentage: 86, color: '#f59e0b' },
      { name: 'Latissimus Dorsi', percentage: 78, color: '#fbbf24' },
      { name: 'Rear Deltoids', percentage: 65, color: '#d97706' },
      { name: 'Biceps & Brachialis', percentage: 52, color: '#b45309' },
    ],
    animationType: 'cable_row',
    overview: 'Target the mid-back musculature with continuous cable resistance throughout the entire range of motion. Critical for counteracting rounded desk posture.',
    setupSteps: [
      'Attach a close-grip V-bar or neutral dual handles to the low pulley.',
      'Sit on the bench with feet on the footplates, keeping knees slightly bent (never locked straight).',
      'Grasp the handle and slide hips back until torso is upright at 90 degrees.',
      'Pull shoulders down and lock your spinal column in neutral.'
    ],
    formSteps: [
      'Exhale and pull the attachment into your lower abdomen (navel area).',
      'Drive elbows back as far as possible while pinching shoulder blades together tightly.',
      'Hold the contraction for 1 second, opening the chest.',
      'Extend arms slowly over 3 seconds, allowing shoulder blades to protract gently around the rib cage for a complete stretch.'
    ],
    commonMistakes: [
      'Rocking back and forth violently using lower back momentum.',
      'Shrugging shoulders up to ears.',
      'Pulling too high to the chest instead of towards the navel.'
    ],
    proTip: 'Keep your torso stationary at a 90° angle. The movement should occur through shoulder blades retracting and elbows driving back, not from swinging your spine.',
    badge: 'Postural Shield',
    defaultMinutes: 20,
    defaultSets: 4,
    defaultReps: 12,
  },
  {
    id: 'smith-machine-squats',
    name: 'Smith Machine Guided Squat & Lunge',
    category: 'machines',
    level: 'Intermediate',
    muscleCategory: 'Quads & Glutes',
    tagline: 'High-stability progressive overload for deep quad and glute stimulation',
    metScore: 7.5,
    hypertrophyRate: 0.94,
    primaryMuscles: [
      { name: 'Quadriceps', percentage: 90, color: '#f59e0b' },
      { name: 'Gluteus Maximus', percentage: 82, color: '#fbbf24' },
      { name: 'Adductor Magnus', percentage: 60, color: '#d97706' },
      { name: 'Spinal Erectors', percentage: 45, color: '#b45309' },
    ],
    animationType: 'smith_squat',
    overview: 'The Smith Machine provides a vertical track with built-in safety catches. This permits placing feet slightly forward to isolate quadriceps without tipping backward.',
    setupSteps: [
      'Set the bar height just below shoulder level (around clavicle height).',
      'Step under the bar resting it comfortably on upper traps (not cervical vertebrae).',
      'Place feet about 6-12 inches ahead of the bar line for maximum quad loading with reduced shear on knees.',
      'Rotate wrists to unhook safety catches.'
    ],
    formSteps: [
      'Take a deep breath into your belly, brace abdominals tightly.',
      'Descend by sitting your hips back and down like sitting into a low chair.',
      'Go down until thighs are parallel to the floor or slightly below (crease of hip below knee).',
      'Push the ground away through mid-foot and heels, standing back up forcefully while exhaling.'
    ],
    commonMistakes: [
      'Placing feet directly under the bar which can force excessive knee travel.',
      'Rounding the lower back in the hole (butt wink).',
      'Failing to engage the safety catches prior to starting.'
    ],
    proTip: 'By stepping your feet 8 inches forward on the Smith machine, you can keep your torso upright like a hack squat, directly blasting the teardrop quad muscle.',
    badge: 'Leg Day Anchor',
    defaultMinutes: 25,
    defaultSets: 4,
    defaultReps: 8,
  },
  {
    id: 'cable-crossover-fly',
    name: 'Dual Cable Crossover Chest Fly',
    category: 'machines',
    level: 'Intermediate',
    muscleCategory: 'Chest',
    tagline: 'Peak continuous tension across inner and outer pectoral fibers',
    metScore: 5.5,
    hypertrophyRate: 0.86,
    primaryMuscles: [
      { name: 'Pectoralis Major (Sternal Head)', percentage: 95, color: '#f59e0b' },
      { name: 'Anterior Deltoid', percentage: 40, color: '#fbbf24' },
      { name: 'Biceps (Short Head stabilizer)', percentage: 30, color: '#d97706' },
    ],
    animationType: 'cable_fly',
    overview: 'Unlike dumbbells where tension drops at the top of the movement, cables maintain constant tension throughout the peak squeeze, maximizing metabolic stress in the chest.',
    setupSteps: [
      'Set pulleys to shoulder height or top position depending on upper/lower chest focus.',
      'Attach single stirrup D-handles to each side.',
      'Take a handle in each hand, step forward into a staggered athletic stance.',
      'Keep a slight bend in elbows (~15°) and maintain that static angle throughout.'
    ],
    formSteps: [
      'Lean slightly forward with chest puffed out and core braced.',
      'Bring handles together in a hugging motion out in front of your chest.',
      'Cross wrists or squeeze palms together tightly for 2 seconds at peak contraction.',
      'Open arms back in a wide arc until you feel a deep pectoral stretch, then repeat.'
    ],
    commonMistakes: [
      'Bending and extending elbows like a press rather than maintaining fixed bend.',
      'Allowing shoulders to shrug upwards.',
      'Using excessive weight and lunging forward with body momentum.'
    ],
    proTip: 'Imagine hugging a giant redwood tree trunk. Keep your elbow angle locked so the pectoral muscle does 100% of the movement.',
    badge: 'Peak Chest Squeeze',
    defaultMinutes: 15,
    defaultSets: 3,
    defaultReps: 15,
  },
  {
    id: 'treadmill-incline-walk',
    name: 'Incline Treadmill Fat-Burn Walk (12-3-30 Protocol)',
    category: 'cardio',
    level: 'All Levels',
    muscleCategory: 'Full Body',
    tagline: 'High calorie expenditure, zero joint impact, superior aerobic conditioning',
    metScore: 5.2, // Ramps with incline up to 7.5
    hypertrophyRate: 0.35,
    primaryMuscles: [
      { name: 'Calves (Soleus & Gastrocnemius)', percentage: 75, color: '#f59e0b' },
      { name: 'Gluteus Maximus & Hamstrings', percentage: 70, color: '#fbbf24' },
      { name: 'Cardiovascular Heart Muscle', percentage: 95, color: '#d97706' },
      { name: 'Tibialis Anterior (Shin)', percentage: 65, color: '#b45309' },
    ],
    animationType: 'treadmill_walk',
    overview: 'Walking at an incline increases heart rate into Zone 2/Zone 3 fat oxidation territory without the joint impact of road running. Excellent for preserving muscle mass while cutting body fat.',
    setupSteps: [
      'Step onto side rails before starting treadmill.',
      'Set speed to 3.0 - 3.5 mph (4.8 - 5.6 km/h).',
      'Set incline to 8% - 12% (12% for the iconic 12-3-30 protocol).',
      'Step onto belt smoothly and find your natural stride.'
    ],
    formSteps: [
      'Maintain an upright posture with shoulders relaxed and eyes forward.',
      'Swing arms naturally at your sides — avoid clinging to the front handrails.',
      'Drive into each stride from the heel rolling through the ball of the foot.',
      'Maintain steady nasal or rhythmic mouth breathing throughout the session.'
    ],
    commonMistakes: [
      'Holding onto the top console and leaning back (cancels out 40% of the incline calorie burn!).',
      'Overstriding and landing hard on heels.',
      'Looking down at feet or phone causing neck strain.'
    ],
    proTip: 'Let go of the handrails! Holding the display cancels the mechanical angle and cuts calorie burn by over 30%. Pump your arms naturally.',
    badge: 'Zone 2 Fat Melter',
    defaultMinutes: 30,
    defaultSets: 1,
    defaultReps: 1,
  },
  {
    id: 'concept2-rowing-erg',
    name: 'Concept2 Full-Body Rowing Ergometer',
    category: 'cardio',
    level: 'Intermediate',
    muscleCategory: 'Full Body',
    tagline: 'Engages 86% of total body musculature in one coordinated fluid cycle',
    metScore: 8.5,
    hypertrophyRate: 0.65,
    primaryMuscles: [
      { name: 'Legs & Glutes (Drive phase)', percentage: 90, color: '#f59e0b' },
      { name: 'Back & Lats (Swing phase)', percentage: 85, color: '#fbbf24' },
      { name: 'Core & Abdominals', percentage: 78, color: '#d97706' },
      { name: 'Arms & Forearms', percentage: 70, color: '#b45309' },
    ],
    animationType: 'rowing_machine',
    overview: 'Rowing is one of the most complete aerobic and anaerobic conditioning tools on earth. The stroke cycle demands 60% legs, 20% core, and 20% arms/upper back.',
    setupSteps: [
      'Adjust footplate straps so strap crosses over the ball of your running shoe.',
      'Set damper lever between 3 and 5 (mimics a real racing shell on water).',
      'Grab handle with overhand grip, thumbs tucked under, wrists flat.',
      'Slide forward into the Catch position: shins vertical, arms extended, torso tilted forward at 1 o’clock.'
    ],
    formSteps: [
      'THE DRIVE: Push vigorously through heels with legs first.',
      'Once legs are extended, swing hips open to 11 o’clock.',
      'Finally, draw handle into lower ribcage with elbows passing torso.',
      'THE RECOVERY: Reverse sequence smoothly — Arms extend, body rocks to 1 o’clock, knees bend as seat slides forward.'
    ],
    commonMistakes: [
      'Bending knees before arms have cleared during recovery (leads to handle hitting knees).',
      'Setting damper to 10 assuming it burns more calories (leads to premature fatigue).',
      'Pulling with arms before legs have driven.'
    ],
    proTip: 'Remember the rowing rhythm mantra: Power on the Drive (1 count), Patience on the Recovery (2 counts). Legs -> Body -> Arms, then Arms -> Body -> Legs.',
    badge: '86% Muscle Recruitment',
    defaultMinutes: 20,
    defaultSets: 1,
    defaultReps: 1,
  },
  {
    id: 'dumbbell-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'freeweights',
    level: 'Intermediate',
    muscleCategory: 'Hamstrings',
    tagline: 'Master the posterior chain hip hinge for glute density and hamstring resilience',
    metScore: 6.8,
    hypertrophyRate: 0.93,
    primaryMuscles: [
      { name: 'Hamstrings (Semitendinosus/Biceps Femoris)', percentage: 95, color: '#f59e0b' },
      { name: 'Gluteus Maximus', percentage: 88, color: '#fbbf24' },
      { name: 'Erector Spinae & Lower Back', percentage: 75, color: '#d97706' },
      { name: 'Forearms & Grip', percentage: 50, color: '#b45309' },
    ],
    animationType: 'dumbbell_rdl',
    overview: 'The Romanian Deadlift is the premier exercise for developing the posterior chain. Focusing on hip flexion rather than knee flexion loads the hamstrings in a deep loaded stretch.',
    setupSteps: [
      'Hold dumbbells in front of thighs with an overhand grip.',
      'Stand tall with feet hip-width apart, toes pointing straight forward.',
      'Pull shoulders back, lock lats down, and create a soft unlock at the knees.'
    ],
    formSteps: [
      'Hinge back from hips, sending your pelvis toward the back wall while keeping dumbbells shaving your shins.',
      'Maintain flat neutral spine and tight lats throughout descent.',
      'Lower until you feel a deep hamstring stretch (usually mid-shin level).',
      'Drive hips forward powerfully, squeezing glutes to lock out standing.'
    ],
    commonMistakes: [
      'Squatting down instead of hinging hips back.',
      'Rounding the upper or lower spine to reach lower.',
      'Letting dumbbells drift away from shins.'
    ],
    proTip: 'Think of closing a car door behind you using only your buttocks. The knees only bend slightly; the movement is purely horizontal hip translation.',
    badge: 'Posterior Chain King',
    defaultMinutes: 20,
    defaultSets: 4,
    defaultReps: 10,
  },
  {
    id: 'calisthenics-pullups',
    name: 'Strict Bodyweight Pull-Up / Chin-Up',
    category: 'calisthenics',
    level: 'Intermediate to Advanced',
    muscleCategory: 'Back & Lats',
    tagline: 'The ultimate benchmark of relative bodyweight pulling strength',
    metScore: 8.0,
    hypertrophyRate: 0.96,
    primaryMuscles: [
      { name: 'Latissimus Dorsi', percentage: 96, color: '#f59e0b' },
      { name: 'Biceps & Brachioradialis', percentage: 80, color: '#fbbf24' },
      { name: 'Core & Abdominals (Hollow body)', percentage: 65, color: '#d97706' },
      { name: 'Trapezius (Lower/Middle)', percentage: 60, color: '#b45309' },
    ],
    animationType: 'pullup',
    overview: 'Nothing builds a thick, wide upper back quite like moving your own bodyweight through space. Strict pull-ups require total body irradiation and core stability.',
    setupSteps: [
      'Grasp pull-up bar with overhand grip just outside shoulder width.',
      'Hang with arms completely straight in a dead hang to start.',
      'Brace core, point toes slightly forward into a gymnastics hollow body position.'
    ],
    formSteps: [
      'Depress shoulder blades down before bending elbows.',
      'Pull yourself upward leading with your upper chest toward the bar.',
      'Continue until chin clearly clears the bar level.',
      'Lower under complete control back to full dead hang extension over 2-3 seconds.'
    ],
    commonMistakes: [
      'Kicking legs or kipping to generate momentum.',
      'Short-changing the bottom half and not achieving full arm lockout.',
      'Reaching chin forward like a turtle rather than pulling chest up.'
    ],
    proTip: 'Squeeze your glutes and press your quads together into a hollow body shape. A tight body moves as one solid unit with zero power leaks.',
    badge: 'Relative Strength Master',
    defaultMinutes: 15,
    defaultSets: 4,
    defaultReps: 8,
  },
  {
    id: 'outdoor-brisk-walking',
    name: 'Outdoor Power Walking & Stride Interval',
    category: 'cardio',
    level: 'All Levels',
    muscleCategory: 'Full Body',
    tagline: 'Accessible daily caloric deficit driver with mental clarity and low cortisol',
    metScore: 4.2,
    hypertrophyRate: 0.20,
    primaryMuscles: [
      { name: 'Calves & Soleus', percentage: 60, color: '#f59e0b' },
      { name: 'Glutes & Hip Extensors', percentage: 50, color: '#fbbf24' },
      { name: 'Cardiovascular Aerobic Base', percentage: 75, color: '#d97706' },
    ],
    animationType: 'brisk_walk',
    overview: 'Walking 8,000 to 12,000 steps daily contributes dramatically to NEAT (Non-Exercise Activity Thermogenesis), accelerating fat loss without driving up appetite or systemic recovery fatigue.',
    setupSteps: [
      'Wear supportive walking or running footwear.',
      'Plan a route with varied elevation if available.',
      'Keep head upright, gaze 20 feet ahead, shoulders back.'
    ],
    formSteps: [
      'Walk at a cadence where you can speak in full sentences but feel elevated breathing (100-120 steps/min).',
      'Push off with toes on each stride.',
      'Maintain rhythmic swing with arms bent at 90 degrees.',
      'Incorporate 2-minute faster power strides every 10 minutes.'
    ],
    commonMistakes: [
      'Slouching forward looking down at phone.',
      'Walking at too leisurely a stroll for metabolic benefits.',
      'Neglecting hydration on warm days.'
    ],
    proTip: 'Going for a 15-minute brisk walk immediately following your largest meal blunts postprandial glucose spikes by up to 35% and enhances insulin sensitivity.',
    badge: 'Daily NEAT Champion',
    defaultMinutes: 45,
    defaultSets: 1,
    defaultReps: 1,
  },
  {
    id: 'pec-deck-fly-machine',
    name: 'Pec Deck / Rear Delt Fly Machine',
    category: 'machines',
    level: 'Beginner',
    muscleCategory: 'Chest',
    tagline: 'Isolated horizontal adduction with laser-focused inner chest contraction',
    metScore: 5.2,
    hypertrophyRate: 0.85,
    primaryMuscles: [
      { name: 'Pectoralis Major (Inner/Sternal)', percentage: 92, color: '#f59e0b' },
      { name: 'Anterior Deltoid', percentage: 45, color: '#fbbf24' },
      { name: 'Serratus Anterior', percentage: 35, color: '#d97706' },
    ],
    animationType: 'pec_deck',
    overview: 'The Pec Deck machine stabilizes the torso so all energy directs into chest horizontal adduction. It protects the rotator cuff while allowing deep metabolic pump sets.',
    setupSteps: [
      'Set seat height so horizontal arm pads or handles align with your mid chest.',
      'Adjust arm levers back so you receive a comfortable chest stretch without hyperextending shoulders.',
      'Place forearms flat against pads (or grasp handles) with elbows at 90 degrees.'
    ],
    formSteps: [
      'Puff chest out and press shoulders back against the rear pad.',
      'Bring pads together smoothly in front of your chest until they touch.',
      'Hold the contraction and contract your chest muscles hard for 2 seconds.',
      'Slowly open arms wide over 3 seconds until feeling a deep pectoral stretch.'
    ],
    commonMistakes: [
      'Letting shoulders shrug up toward ears.',
      'Bouncing the pads together violently in the center.',
      'Overstretching past shoulder flexibility limits.'
    ],
    proTip: 'Focus on touching your inner biceps together in front of your sternum at peak contraction for maximal inner chest cleavage recruitment.',
    badge: 'Pec Isolation Gold',
    defaultMinutes: 15,
    defaultSets: 3,
    defaultReps: 12,
  }
];

// Calculation helper for calorie burn and muscle hypertrophy
export function calculateWorkoutImpact(exercise, minutes, userWeightKg = 75, intensity = 'moderate') {
  const intensityMap = {
    light: 0.85,
    moderate: 1.0,
    high: 1.25,
    maximum: 1.45,
  };

  const multiplier = intensityMap[intensity] || 1.0;
  // Standard exercise science formula: Calorie = MET * 3.5 * weightKg / 200 * minutes
  const caloriesBurned = Math.round((exercise.metScore * multiplier * 3.5 * userWeightKg / 200) * minutes);

  // Hypertrophy stimulus index (0 to 100 points scale for the workout session)
  const baseHypertrophy = (exercise.hypertrophyRate || 0.8) * minutes * (multiplier * 1.5);
  const muscleGrowthScore = Math.min(100, Math.round(baseHypertrophy * 1.8));

  // Breakdown per muscle
  const muscleImpact = exercise.primaryMuscles.map(m => ({
    name: m.name,
    activationPercentage: m.percentage,
    stimulusPoints: Math.round((m.percentage / 100) * muscleGrowthScore),
    color: m.color,
  }));

  return {
    caloriesBurned,
    muscleGrowthScore,
    muscleImpact,
    durationMinutes: minutes,
    intensity,
    userWeightKg,
  };
}
