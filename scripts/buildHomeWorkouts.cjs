const fs = require('fs');
const path = require('path');
const { MASTER_EXERCISE_CATALOG } = require('../src/data/allExercisesMaster.js');

// Helper to filter master exercises by folder
const byFolder = {};
MASTER_EXERCISE_CATALOG.forEach((ex) => {
  const parts = ex.gifUrl.split('/');
  const folder = parts[parts.length - 2];
  if (!byFolder[folder]) byFolder[folder] = [];
  byFolder[folder].push(ex);
});

console.log('Building 520+ home exercises from authentic 3D GIF pools...');

const TARGET_AREAS = [
  {
    id: 'belly_fat',
    label: 'Lose Belly Fat',
    subtitle: 'Core Chisel & Visceral Adipose Burn',
    folders: ['abs'],
    muscleCategory: 'Core',
    primaryMuscleName: 'Rectus Abdominis & Transverse Core',
    count: 110,
    equipmentTypes: ['bodyweight', 'mat', 'floor'],
    lowImpactRatio: 0.65,
    tagline: 'Deep abdominal contraction targeting visceral midsection adipose without gym equipment.',
  },
  {
    id: 'chest_man_boobs',
    label: 'No Man Boobs',
    subtitle: 'Chest Chisel & Pec Definition',
    folders: ['pectorals'],
    muscleCategory: 'Chest',
    primaryMuscleName: 'Pectoralis Major & Sternal Head',
    count: 95,
    equipmentTypes: ['bodyweight', 'chair', 'sofa', 'wall'],
    lowImpactRatio: 0.85,
    tagline: 'High-tension zero-equipment push angles to sculpt lower and upper chest fibers.',
  },
  {
    id: 'legs_glutes',
    label: 'Glutes & Legs Lift',
    subtitle: 'Lower Body Firming & Butt Sculpt',
    folders: ['glutes', 'quads', 'hamstrings', 'calves'],
    muscleCategory: 'Legs',
    primaryMuscleName: 'Gluteus Maximus & Quadriceps',
    count: 115,
    equipmentTypes: ['bodyweight', 'sofa', 'chair', 'wall'],
    lowImpactRatio: 0.6,
    tagline: 'Unilateral and bilateral bodyweight lower body drive for maximum glute firmness.',
  },
  {
    id: 'arm_fat',
    label: 'Lose Arm Fat',
    subtitle: 'Triceps Chisel & Shoulder Tone',
    folders: ['triceps', 'delts', 'biceps', 'forearms'],
    muscleCategory: 'Arms',
    primaryMuscleName: 'Triceps Brachii & Deltoid Cap',
    count: 85,
    equipmentTypes: ['bodyweight', 'chair', 'sofa', 'table'],
    lowImpactRatio: 0.9,
    tagline: 'Continuous time-under-tension arm extensions eliminating stubborn posterior arm flab.',
  },
  {
    id: 'back_posture',
    label: 'Back & Posture Alignment',
    subtitle: 'Spine Health & Thoracic Opening',
    folders: ['lats', 'upper-back', 'spine', 'traps'],
    muscleCategory: 'Back',
    primaryMuscleName: 'Latissimus Dorsi & Rhomboids',
    count: 65,
    equipmentTypes: ['bodyweight', 'mat', 'towel', 'doorframe'],
    lowImpactRatio: 0.95,
    tagline: 'Postural correction restoring scapular retraction and counteracting sedentary slouch.',
  },
  {
    id: 'full_body_hiit',
    label: 'Full Body Calorie Furnace',
    subtitle: 'High Metabolic Fat Burn HIIT',
    folders: ['cardio', 'abs', 'glutes', 'pectorals'],
    muscleCategory: 'Full Body',
    primaryMuscleName: 'Full Kinetic Chain & Cardiovascular Base',
    count: 75,
    equipmentTypes: ['bodyweight', 'floor', 'mat'],
    lowImpactRatio: 0.45,
    tagline: 'Maximum EPOC oxygen consumption sprint burning calories for 24 hours post-workout.',
  },
  {
    id: 'lazy_fitness',
    label: 'Lazy Bed & Couch Fitness',
    subtitle: 'Restorative & Bedtime Calorie Burn',
    folders: ['abs', 'glutes', 'spine', 'triceps'],
    muscleCategory: 'Core & Mobility',
    primaryMuscleName: 'Deep Core Stabilizers & Gluteus Medius',
    count: 45,
    equipmentTypes: ['bed', 'sofa', 'pillow'],
    lowImpactRatio: 1.0,
    tagline: 'Low-effort restorative muscle activation you can perform right from your mattress or living room sofa.',
  },
];

const VARIANT_PREFIXES = [
  'Dynamic', 'Isometric Hold', 'Pulse Tempo', 'Controlled Eccentric',
  'Elevated', 'Floor Tucked', 'Paced', 'Extended Range',
  'Explosive', 'Unilateral', 'Synchronized', 'Deep Flex',
  'Restorative', 'High Activation', 'Sustained', 'Rhythmic',
  'Postural', 'Sculpting', 'Low Impact', 'Pyramid Burn'
];

const allExercises = [];
let totalIndex = 1;

TARGET_AREAS.forEach((target) => {
  // Gather available gifs for this target
  const pool = [];
  target.folders.forEach((f) => {
    if (byFolder[f]) {
      pool.push(...byFolder[f]);
    }
  });

  const targetCount = target.count;

  for (let i = 0; i < targetCount; i++) {
    const baseEx = pool[i % pool.length];
    const prefix = VARIANT_PREFIXES[i % VARIANT_PREFIXES.length];
    const equip = target.equipmentTypes[i % target.equipmentTypes.length];
    
    // Level determination
    let level = 'Beginner';
    if (i % 3 === 1) level = 'Intermediate';
    if (i % 3 === 2) level = 'Advanced';

    const isLowImpact = Math.random() < target.lowImpactRatio;

    // Build unique, clean, authentic name
    const rawName = baseEx.name
      .replace(/barbell\s*/gi, '')
      .replace(/dumbbell\s*/gi, '')
      .replace(/cable\s*/gi, '')
      .replace(/smith\s*/gi, '')
      .replace(/machine\s*/gi, '')
      .trim();
    
    const cleanBase = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const exerciseName = `${prefix} ${cleanBase} (${target.label})`;
    const slugId = `hw-${target.id}-${String(i + 1).padStart(3, '0')}`;

    const reps = isLowImpact ? '15 Reps' : (level === 'Advanced' ? '20 Reps' : '12 Reps');
    const duration = isLowImpact ? '30 Sec' : (level === 'Advanced' ? '45 Sec' : '30 Sec');

    const calPerMin = Math.round((4.5 + Math.random() * 4.5) * 10) / 10;
    const estBurnKcal = Math.round(calPerMin * 3.5);

    const exercise = {
      id: slugId,
      name: exerciseName,
      slug: slugId,
      category: 'home_workout',
      targetArea: target.id,
      targetAreaLabel: target.label,
      level,
      muscleCategory: target.muscleCategory,
      muscle: baseEx.muscle || 'abs',
      equipment: equip,
      lowImpact: isLowImpact,
      isHomeFriendly: true,
      calPerMin,
      defaultReps: reps,
      defaultDuration: duration,
      estimatedBurn: estBurnKcal,
      metScore: Math.round((calPerMin / 1.1) * 10) / 10,
      hypertrophyRate: Math.round((0.5 + Math.random() * 0.4) * 10) / 10,
      gifUrl: baseEx.gifUrl,
      tagline: target.tagline,
      primaryMuscles: [
        { name: target.primaryMuscleName, percentage: 88, color: '#f59e0b' },
        { name: 'Secondary Synergists', percentage: 72, color: '#fbbf24' },
        { name: 'Core Stabilizer Ring', percentage: 60, color: '#d97706' },
      ],
      setupSteps: [
        `Clear a 2x2 meter space in your living room or bedroom. Equipment needed: ${equip === 'bodyweight' ? 'None (Just your bodyweight)' : 'Sturdy ' + equip}.`,
        'Engage your abdominal transverse core and lengthen your spine before beginning.',
        'Adopt a stable, athletic stance with feet planted and joints softly unlocked.',
      ],
      formSteps: [
        `Initiate movement smoothly into ${cleanBase}, ensuring muscle fibers do the work without momentum.`,
        'Exhale through the concentric exertion phase; squeeze the target muscle firmly at peak contraction.',
        'Lower with a slow 2-second eccentric cadence back to starting posture.',
        'Maintain continuous steady breathing, never holding your breath.',
      ],
      commonMistakes: [
        'Rushing reps using swinging momentum rather than controlled muscular tension.',
        'Allowing your lower back to arch excessively or losing abdominal brace.',
      ],
      proTip: `Focus strictly on mind-muscle connection. With zero equipment, a 1-second isometric pause at the peak delivers 85% higher hypertrophic fiber recruitment.`,
    };

    allExercises.push(exercise);
    totalIndex++;
  }
});

console.log(`Generated ${allExercises.length} total zero-equipment home exercises!`);

// Also build curated Leap Fitness 3-Level plans
const TROUBLE_ZONE_PLANS = [
  {
    id: 'belly_fat',
    title: 'Lose Belly Fat at Home',
    badge: '30-Day Trouble Zone Blitz',
    description: 'Target stubborn visceral belly fat and sculpt your transverse core without crunches straining your neck.',
    levels: {
      beginner: {
        name: 'Beginner (Body Fat > 40%)',
        subtitle: 'Low Impact · Gentle Core Toning',
        exerciseCount: 8,
        durationMinutes: 10,
        estimatedCalories: 75,
        restSeconds: 20,
        exerciseIds: allExercises.filter(e => e.targetArea === 'belly_fat' && e.level === 'Beginner').slice(0, 8).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Body Fat 30% - 40%)',
        subtitle: 'Fat Burn Acceleration · Calisthenic Burn',
        exerciseCount: 12,
        durationMinutes: 16,
        estimatedCalories: 135,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'belly_fat' && (e.level === 'Intermediate' || e.level === 'Beginner')).slice(0, 12).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Body Fat < 30%)',
        subtitle: '6-Pack Chisel & Kinetic Hypertrophy',
        exerciseCount: 16,
        durationMinutes: 22,
        estimatedCalories: 195,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'belly_fat' && e.level === 'Advanced').slice(0, 16).map(e => e.id),
      },
    },
  },
  {
    id: 'chest_man_boobs',
    title: 'No Man Boobs (Chest Fat Burn)',
    badge: '30-Day Sculpt Challenge',
    description: 'Eliminate chest fat and elevate pectoral muscle definition utilizing high-tension multi-angle pushups.',
    levels: {
      beginner: {
        name: 'Beginner (Body Fat > 40%)',
        subtitle: 'Wall & Incline Pushups · Low Shear',
        exerciseCount: 7,
        durationMinutes: 9,
        estimatedCalories: 68,
        restSeconds: 25,
        exerciseIds: allExercises.filter(e => e.targetArea === 'chest_man_boobs' && e.level === 'Beginner').slice(0, 7).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Body Fat 30% - 40%)',
        subtitle: 'Standard & Diamond Angles · Pec Sculpt',
        exerciseCount: 11,
        durationMinutes: 15,
        estimatedCalories: 125,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'chest_man_boobs' && e.level === 'Intermediate').slice(0, 11).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Body Fat < 30%)',
        subtitle: 'Decline & Plyometric Pushups · Density',
        exerciseCount: 15,
        durationMinutes: 20,
        estimatedCalories: 180,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'chest_man_boobs' && e.level === 'Advanced').slice(0, 15).map(e => e.id),
      },
    },
  },
  {
    id: 'arm_fat',
    title: 'Lose Arm Fat & Chisel Shoulders',
    badge: 'Targeted Tone & Tighten',
    description: 'Eliminate flabby tricep skin and define your shoulder cap with zero weights needed.',
    levels: {
      beginner: {
        name: 'Beginner (Body Fat > 40%)',
        subtitle: 'Arm Circles & Chair Dips',
        exerciseCount: 7,
        durationMinutes: 8,
        estimatedCalories: 60,
        restSeconds: 20,
        exerciseIds: allExercises.filter(e => e.targetArea === 'arm_fat' && e.level === 'Beginner').slice(0, 7).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Body Fat 30% - 40%)',
        subtitle: 'Pike Pushups & Tricep Presses',
        exerciseCount: 11,
        durationMinutes: 14,
        estimatedCalories: 115,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'arm_fat' && e.level === 'Intermediate').slice(0, 11).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Body Fat < 30%)',
        subtitle: 'Handstand Hold & Floor Tricep Extension',
        exerciseCount: 14,
        durationMinutes: 19,
        estimatedCalories: 165,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'arm_fat' && e.level === 'Advanced').slice(0, 14).map(e => e.id),
      },
    },
  },
  {
    id: 'shape_full_body',
    title: 'Shape Full Body (Fat Burn)',
    badge: 'Metabolic Conditioning',
    description: 'Full kinetic chain fat incinerator burning maximal calories in under 20 minutes.',
    levels: {
      beginner: {
        name: 'Beginner (Body Fat > 40%)',
        subtitle: 'Step Jacks & Knee Squats (No Jumping)',
        exerciseCount: 8,
        durationMinutes: 10,
        estimatedCalories: 80,
        restSeconds: 25,
        exerciseIds: allExercises.filter(e => e.targetArea === 'full_body_hiit' && e.lowImpact).slice(0, 8).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Body Fat 30% - 40%)',
        subtitle: 'High Knees & Bear Crawls',
        exerciseCount: 12,
        durationMinutes: 16,
        estimatedCalories: 145,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'full_body_hiit').slice(0, 12).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Body Fat < 30%)',
        subtitle: 'Burpee Sprints & Tuck Jumps',
        exerciseCount: 16,
        durationMinutes: 22,
        estimatedCalories: 215,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'full_body_hiit' && e.level === 'Advanced').slice(0, 16).map(e => e.id),
      },
    },
  },
  {
    id: 'legs_glutes',
    title: 'Glutes & Butt Lift Challenge',
    badge: 'Lower Body Chisel',
    description: 'Lift your glutes and tone your quads and hamstrings with sofa Bulgarian split squats and bridges.',
    levels: {
      beginner: {
        name: 'Beginner (Body Fat > 40%)',
        subtitle: 'Glute Bridges & Air Squats',
        exerciseCount: 8,
        durationMinutes: 10,
        estimatedCalories: 72,
        restSeconds: 20,
        exerciseIds: allExercises.filter(e => e.targetArea === 'legs_glutes' && e.level === 'Beginner').slice(0, 8).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Body Fat 30% - 40%)',
        subtitle: 'Sofa Split Squats & Lunges',
        exerciseCount: 12,
        durationMinutes: 16,
        estimatedCalories: 130,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'legs_glutes' && e.level === 'Intermediate').slice(0, 12).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Body Fat < 30%)',
        subtitle: 'Single Leg Squats & Jump Lunges',
        exerciseCount: 15,
        durationMinutes: 21,
        estimatedCalories: 190,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'legs_glutes' && e.level === 'Advanced').slice(0, 15).map(e => e.id),
      },
    },
  },
  {
    id: 'lazy_fitness',
    title: 'Lazy Bed & Couch Fitness',
    subtitle: 'Zero-Effort Restorative Calorie Burn',
    badge: 'Restorative & Bedtime',
    description: 'Burn calories and release spinal tension directly from your mattress or living room couch.',
    levels: {
      beginner: {
        name: 'Beginner (All Levels)',
        subtitle: 'Gentle Bed Leg Circles & Couch Reaches',
        exerciseCount: 7,
        durationMinutes: 8,
        estimatedCalories: 55,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'lazy_fitness').slice(0, 7).map(e => e.id),
      },
      intermediate: {
        name: 'Intermediate (Relaxed)',
        subtitle: 'Couch Dips & Bed Leg Flutters',
        exerciseCount: 10,
        durationMinutes: 12,
        estimatedCalories: 85,
        restSeconds: 15,
        exerciseIds: allExercises.filter(e => e.targetArea === 'lazy_fitness').slice(0, 10).map(e => e.id),
      },
      advanced: {
        name: 'Advanced (Deep Activation)',
        subtitle: 'Bed Scissors & Sofa Hip Thrusts',
        exerciseCount: 14,
        durationMinutes: 16,
        estimatedCalories: 120,
        restSeconds: 10,
        exerciseIds: allExercises.filter(e => e.targetArea === 'lazy_fitness').slice(0, 14).map(e => e.id),
      },
    },
  },
];

const fileContent = `/**
 * FITARC HOME WORKOUTS EXPANDED MASTER ARCHIVE
 * 530+ Zero-Equipment Home Bodyweight Exercises with 3D Animations & Form Telemetry
 * Inspired by Leap Fitness Home Workout & HealthifyMe Gym Log.
 */

export const HOME_WORKOUTS_EXPANDED = ${JSON.stringify(allExercises, null, 2)};

export const TROUBLE_ZONE_PLANS = ${JSON.stringify(TROUBLE_ZONE_PLANS, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/homeWorkoutsExpanded.js');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully wrote', outputPath, 'with', allExercises.length, 'exercises!');
