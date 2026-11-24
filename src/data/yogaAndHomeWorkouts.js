// Dedicated catalog for Full Body Yoga, Face Yoga, and Zero-Equipment Home Workouts
// Complete with anatomical guidance, targeted muscles, and dark-mode animations.

export const YOGA_AND_HOME_WORKOUTS = [
  // ==========================================
  // FULL BODY YOGA POSES (ASANAS)
  // ==========================================
  {
    id: "yoga-sun-salutation",
    name: "Surya Namaskar (Sun Salutation Flow)",
    slug: "surya-namaskar-flow",
    category: "yoga",
    level: "Beginner",
    muscleCategory: "Yoga & Full Body",
    muscle: "full-body",
    equipment: "bodyweight",
    tagline: "Dynamic 12-asana full body sequence harmonizing spine flexibility and breath.",
    metScore: 4.5,
    hypertrophyRate: 0.3,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/air-bike.gif",
    primaryMuscles: [
      { name: "Spinal Erectors", percentage: 85, color: "#f59e0b" },
      { name: "Hamstrings", percentage: 75, color: "#fbbf24" },
      { name: "Core & Pelvic Floor", percentage: 70, color: "#d97706" }
    ],
    setupSteps: [
      "Stand tall at the top of your mat with feet together in Pranamasana.",
      "Engage pelvic floor and relax shoulders away from ears.",
      "Coordinate each transition with deliberate deep diaphragmatic breathing."
    ],
    formSteps: [
      "Inhale into Hasta Uttanasana (raised arms upward arch).",
      "Exhale folding down into Padahastasana (forward fold, hands beside feet).",
      "Step right foot back into Ashwa Sanchalanasana (equestrian low lunge).",
      "Transition through Adho Mukha Svanasana (Downward Dog) to Ashtanga Namaskara.",
      "Rise gracefully into Bhujangasana (Cobra) and return through the 12-flow cycle."
    ],
    commonMistakes: [
      "Holding breath during transitions.",
      "Overextending the lumbar spine instead of thoracic extension."
    ]
  },
  {
    id: "yoga-downward-dog",
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    slug: "downward-facing-dog",
    category: "yoga",
    level: "Beginner",
    muscleCategory: "Yoga & Full Body",
    muscle: "posterior-chain",
    equipment: "bodyweight",
    tagline: "Inverted V-asana decompressing spine, stretching calves, and building shoulder stability.",
    metScore: 3.8,
    hypertrophyRate: 0.35,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/standing-calf-raise.gif",
    primaryMuscles: [
      { name: "Shoulders & Serratus", percentage: 80, color: "#f59e0b" },
      { name: "Hamstrings & Calves", percentage: 85, color: "#fbbf24" },
      { name: "Latissimus Dorsi", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Start on all fours with hands shoulder-width and knees hip-width apart.",
      "Spread fingers wide and press firmly through pointer finger and thumb knuckles."
    ],
    formSteps: [
      "Tuck toes, exhale and lift knees off floor, sending sit-bones upward toward ceiling.",
      "Pedal heels gently to open calves and hamstrings.",
      "Lengthen spine from tailbone to crown; maintain external shoulder rotation."
    ],
    commonMistakes: [
      "Rounding the lower back; micro-bend knees if hamstrings are tight.",
      "Collapsing weight into wrists without engaging fingers."
    ]
  },
  {
    id: "yoga-warrior-two",
    name: "Warrior II Pose (Virabhadrasana II)",
    slug: "warrior-two-pose",
    category: "yoga",
    level: "Beginner",
    muscleCategory: "Yoga & Full Body",
    muscle: "legs-hips",
    equipment: "bodyweight",
    tagline: "Foundational standing asana developing hip opening, quadriceps endurance, and mental focus.",
    metScore: 4.0,
    hypertrophyRate: 0.4,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abductors/side-bridge-hip-abduction.gif",
    primaryMuscles: [
      { name: "Quadriceps & Adductors", percentage: 85, color: "#f59e0b" },
      { name: "Gluteus Medius", percentage: 70, color: "#fbbf24" },
      { name: "Deltoids", percentage: 60, color: "#d97706" }
    ],
    setupSteps: [
      "Step feet 4 feet apart along the length of your mat.",
      "Turn front foot 90° forward, back foot slightly angled 45° inward."
    ],
    formSteps: [
      "Bend front knee over ankle until front thigh approaches parallel.",
      "Extend arms parallel to floor, reaching actively front and back.",
      "Gaze serenely over front middle finger; keep torso upright and centered."
    ],
    commonMistakes: [
      "Front knee collapsing inward (keep knee tracking over second toe).",
      "Leaning torso forward over front thigh instead of centering pelvis."
    ]
  },
  {
    id: "yoga-cobra-pose",
    name: "Cobra Pose (Bhujangasana)",
    slug: "cobra-pose-bhujangasana",
    category: "yoga",
    level: "Beginner",
    muscleCategory: "Yoga & Full Body",
    muscle: "back",
    equipment: "bodyweight",
    tagline: "Thoracic spine extension opening chest, toning glutes, and relieving sedentary desk posture.",
    metScore: 3.5,
    hypertrophyRate: 0.3,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/assisted-prone-rectus-femoris-stretch.gif",
    primaryMuscles: [
      { name: "Erector Spinae", percentage: 90, color: "#f59e0b" },
      { name: "Pectoral Stretch", percentage: 80, color: "#fbbf24" },
      { name: "Gluteus Maximus", percentage: 60, color: "#d97706" }
    ],
    setupSteps: [
      "Lie prone on floor, tops of feet flat, hands placed under shoulders.",
      "Hug elbows tight against ribcage."
    ],
    formSteps: [
      "Press pubic bone gently into floor and engage thighs.",
      "Inhale and lift chest off mat using back extensor strength, not pushing through hands.",
      "Keep neck long and shoulders pulled down away from ears."
    ],
    commonMistakes: [
      "Compressing the lumbar spine; focus on lifting through upper thoracic chest.",
      "Elbows flaring wide out to sides."
    ]
  },
  {
    id: "yoga-tree-pose",
    name: "Tree Pose Balance (Vrikshasana)",
    slug: "tree-pose-vrikshasana",
    category: "yoga",
    level: "Beginner",
    muscleCategory: "Yoga & Full Body",
    muscle: "balance-core",
    equipment: "bodyweight",
    tagline: "Unilateral standing balance cultivating stabilizer strength and ankle proprioception.",
    metScore: 3.2,
    hypertrophyRate: 0.25,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/standing-calf-raise.gif",
    primaryMuscles: [
      { name: "Ankle Stabilizers & Tibialis", percentage: 85, color: "#f59e0b" },
      { name: "Hip Abductors", percentage: 75, color: "#fbbf24" },
      { name: "Transverse Abdominis", percentage: 70, color: "#d97706" }
    ],
    setupSteps: [
      "Stand tall in Tadasana (Mountain Pose), shifting weight onto left foot.",
      "Find a steady gaze point (Drishti) at eye level."
    ],
    formSteps: [
      "Place right sole against inner left calf or upper inner thigh (avoid direct knee joint).",
      "Press foot and thigh actively into each other to generate midline tension.",
      "Bring hands to heart center (Anjali Mudra) or grow branches overhead."
    ],
    commonMistakes: [
      "Resting foot directly against side of knee joint.",
      "Collapsing weight into standing hip."
    ]
  },

  // ==========================================
  // FACE YOGA & JAWLINE SCULPTING
  // ==========================================
  {
    id: "face-yoga-jawline-sculpt",
    name: "Jawline Sculpt & Neck Lift (Simhasana Platysma)",
    slug: "face-yoga-jawline-sculpt",
    category: "face_yoga",
    level: "Beginner",
    muscleCategory: "Face & Neck",
    muscle: "jawline-neck",
    equipment: "bodyweight",
    tagline: "Targeted resistance for the platysma and digastric muscles to tighten jawline and eliminate double chin.",
    metScore: 2.2,
    hypertrophyRate: 0.2,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/neck/neck-side-stretch.gif",
    primaryMuscles: [
      { name: "Platysma Muscle", percentage: 95, color: "#f59e0b" },
      { name: "Digastric & Hyoid", percentage: 85, color: "#fbbf24" },
      { name: "Sternocleidomastoid", percentage: 70, color: "#d97706" }
    ],
    setupSteps: [
      "Sit upright with spine neutral and shoulders relaxed down.",
      "Gently tilt head back 45° toward ceiling without hyperextending cervical spine."
    ],
    formSteps: [
      "Press the tongue firmly flat against the roof of the mouth.",
      "Protrude lower jaw slightly forward until deep stretch is felt along under-chin.",
      "Hold peak contraction for 5 seconds, swallow gently, and release.",
      "Repeat for 15 controlled micro-repetitions."
    ],
    commonMistakes: [
      "Straining the back of the neck; keep cervical spine supported.",
      "Tensing eyebrows or forehead; keep facial expression serene."
    ]
  },
  {
    id: "face-yoga-cheekbone-lift",
    name: "Cheekbone Sculpt & Zygomaticus Firming",
    slug: "face-yoga-cheekbone-lift",
    category: "face_yoga",
    level: "Beginner",
    muscleCategory: "Face & Neck",
    muscle: "cheeks-midface",
    equipment: "bodyweight",
    tagline: "Natural cheek contour lift activating zygomaticus major to firm mid-face hollows.",
    metScore: 2.0,
    hypertrophyRate: 0.2,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/neck/neck-flexion.gif",
    primaryMuscles: [
      { name: "Zygomaticus Major", percentage: 90, color: "#f59e0b" },
      { name: "Levator Labii", percentage: 80, color: "#fbbf24" },
      { name: "Buccinator", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Sit in front of mirror, relax jaw and breathe through nose.",
      "Place clean index fingers lightly on top of cheek apples as feedback anchors."
    ],
    formSteps: [
      "Form an 'O' shape with lips while pulling upper lip down over front teeth.",
      "Smile with the corners of mouth pushing upward against resistance toward temples.",
      "Pulse cheek muscles upward for 20 reps, feeling fatigue in the midface.",
      "Gently tap cheeks to stimulate lymphatic microcirculation."
    ],
    commonMistakes: [
      "Squinting eyes during contraction.",
      "Pressing too hard with fingertips."
    ]
  },
  {
    id: "face-yoga-forehead-smooth",
    name: "Forehead Smoother & Frontalis Tension Release",
    slug: "face-yoga-forehead-smooth",
    category: "face_yoga",
    level: "Beginner",
    muscleCategory: "Face & Neck",
    muscle: "forehead-brow",
    equipment: "bodyweight",
    tagline: "Acupressure and resistance smoothing horizontal expression lines and releasing stress headaches.",
    metScore: 1.8,
    hypertrophyRate: 0.15,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/neck/neck-side-stretch.gif",
    primaryMuscles: [
      { name: "Frontalis Muscle", percentage: 90, color: "#f59e0b" },
      { name: "Corrugator Supercilii", percentage: 80, color: "#fbbf24" },
      { name: "Temporalis", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Place both hands horizontally across forehead, fingers spread flat.",
      "Apply gentle backward-and-downward anchoring pressure."
    ],
    formSteps: [
      "Attempt to raise eyebrows upward against the firm isometric resistance of hands.",
      "Hold isometric contraction for 8 seconds without allowing skin to crease.",
      "Release, slide fingers out toward temples and breathe deeply.",
      "Repeat 5 cycles to reset neuromuscular tone."
    ],
    commonMistakes: [
      "Allowing skin to fold beneath hands.",
      "Holding breath during isometric hold."
    ]
  },

  // ==========================================
  // HOME WORKOUTS (NO EQUIPMENT)
  // ==========================================
  {
    id: "home-sofa-bulgarian-split-squat",
    name: "Living Room Sofa Bulgarian Split Squat",
    slug: "sofa-bulgarian-split-squat",
    category: "home_workout",
    level: "Intermediate",
    muscleCategory: "Legs",
    muscle: "quadriceps-glutes",
    equipment: "bodyweight",
    tagline: "Pro lower body hypertrophy using couch or chair for supreme unilateral quad and glute burn.",
    metScore: 7.2,
    hypertrophyRate: 0.9,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quadriceps/bodyweight-squat.gif",
    primaryMuscles: [
      { name: "Quadriceps", percentage: 90, color: "#f59e0b" },
      { name: "Gluteus Maximus", percentage: 85, color: "#fbbf24" },
      { name: "Hamstrings", percentage: 55, color: "#d97706" }
    ],
    setupSteps: [
      "Stand 2-3 feet in front of your sofa, bench, or sturdy bed.",
      "Place the top of your rear foot on the edge of the sofa cushion."
    ],
    formSteps: [
      "Lower your body until front thigh is parallel to floor and rear knee hovers above ground.",
      "Keep torso leaning slightly forward at 15° to maximize glute tension.",
      "Drive through the midfoot of front leg to return to standing lockout."
    ],
    commonMistakes: [
      "Front foot too close, causing heel to lift.",
      "Allowing torso to collapse completely forward."
    ]
  },
  {
    id: "home-doorframe-isometric-row",
    name: "Doorframe Isometric Back Row & Lat Squeeze",
    slug: "doorframe-isometric-row",
    category: "home_workout",
    level: "Beginner",
    muscleCategory: "Back",
    muscle: "lats-rhomboids",
    equipment: "bodyweight",
    tagline: "Zero-equipment back workout utilizing any standard doorway for lat and rhomboid definition.",
    metScore: 5.8,
    hypertrophyRate: 0.8,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/pull-up.gif",
    primaryMuscles: [
      { name: "Latissimus Dorsi", percentage: 90, color: "#f59e0b" },
      { name: "Rhomboids & Traps", percentage: 80, color: "#fbbf24" },
      { name: "Biceps Brachii", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Stand in a sturdy doorway, gripping the frame firmly with one or both hands at chest height.",
      "Place toes against the base of the frame and lean back to arm's length."
    ],
    formSteps: [
      "Pull chest firmly toward doorframe by driving elbows backward and squeezing shoulder blades.",
      "Hold peak contraction for a strict 3-second isometric lat squeeze.",
      "Lower under control back to full arm extension."
    ],
    commonMistakes: [
      "Shrugging shoulders into ears instead of pulling downward.",
      "Yanking using momentum rather than controlled muscular contraction."
    ]
  },
  {
    id: "home-diamond-pushups",
    name: "Floor Diamond Push-Up (Triceps & Inner Chest)",
    slug: "floor-diamond-pushup",
    category: "home_workout",
    level: "Intermediate",
    muscleCategory: "Chest",
    muscle: "triceps-chest",
    equipment: "bodyweight",
    tagline: "High-density bodyweight press maximizing lateral triceps and sternal pectoral recruitment.",
    metScore: 6.8,
    hypertrophyRate: 0.85,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/push-up.gif",
    primaryMuscles: [
      { name: "Triceps Brachii", percentage: 92, color: "#f59e0b" },
      { name: "Pectoralis Major (Inner)", percentage: 78, color: "#fbbf24" },
      { name: "Anterior Deltoid", percentage: 60, color: "#d97706" }
    ],
    setupSteps: [
      "Assume standard plank position with feet together or hip-width.",
      "Bring hands together under chest, forming a diamond with index fingers and thumbs."
    ],
    formSteps: [
      "Lower chest toward diamond shape while keeping elbows tucked close to ribcage.",
      "Descend until chest touches or hovers 1 inch above hands.",
      "Explode upward through palms, locking out triceps at the top."
    ],
    commonMistakes: [
      "Sagging hips or piking buttocks into air; keep rigid plank alignment.",
      "Flaring elbows wide (tuck at 30-45° to protect wrist and elbow tendons)."
    ]
  },
  {
    id: "home-glute-bridge-march",
    name: "Floor Glute Bridge Dynamic March",
    slug: "floor-glute-bridge-march",
    category: "home_workout",
    level: "Beginner",
    muscleCategory: "Legs",
    muscle: "glutes-core",
    equipment: "bodyweight",
    tagline: "Anti-rotational pelvic stabilizer firing glutes and sculpting lower abdominal wall.",
    metScore: 5.0,
    hypertrophyRate: 0.7,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abductors/side-bridge-hip-abduction.gif",
    primaryMuscles: [
      { name: "Gluteus Maximus", percentage: 90, color: "#f59e0b" },
      { name: "Transverse Abdominis", percentage: 75, color: "#fbbf24" },
      { name: "Hamstrings", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Lie supine on floor, knees bent 90°, feet flat on floor hip-width apart.",
      "Press arms flat into floor for balance."
    ],
    formSteps: [
      "Drive hips upward into full glute bridge lockout.",
      "While keeping pelvis perfectly level, lift right knee toward chest in a march.",
      "Lower right foot and march left knee, alternating without allowing hips to drop."
    ],
    commonMistakes: [
      "Pelvis tilting or dropping side to side during single-leg support.",
      "Hyperextending lower back instead of squeezing glutes."
    ]
  },
  {
    id: "home-wall-sit-burnout",
    name: "Isometric Wall Sit Quad & Knee Stabilizer",
    slug: "isometric-wall-sit-burnout",
    category: "home_workout",
    level: "Beginner",
    muscleCategory: "Legs",
    muscle: "quadriceps",
    equipment: "bodyweight",
    tagline: "Pure time-under-tension quad endurance strengthening patellar tendons without equipment.",
    metScore: 5.5,
    hypertrophyRate: 0.75,
    gifUrl: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quadriceps/bodyweight-squat.gif",
    primaryMuscles: [
      { name: "Quadriceps (All 4 Heads)", percentage: 95, color: "#f59e0b" },
      { name: "Adductors", percentage: 65, color: "#fbbf24" },
      { name: "Core Stabilizers", percentage: 50, color: "#d97706" }
    ],
    setupSteps: [
      "Lean back flat against any wall, slide down until thighs are parallel to floor.",
      "Ensure knees are bent at exact 90° angle directly over ankles."
    ],
    formSteps: [
      "Keep entire spine, shoulders, and head pressed firmly against wall.",
      "Rest hands on chest or sides (not resting on knees).",
      "Breathe rhythmically and maintain position for 45 to 60 seconds."
    ],
    commonMistakes: [
      "Resting hands on knees to push weight off quads.",
      "Sliding feet forward so knees are not at 90°."
    ]
  }
];
