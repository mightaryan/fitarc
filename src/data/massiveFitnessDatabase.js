// Massive 1,000+ Gym Machines, Free Weights, Cardio, Calisthenics & Specialty Equipment Database
// Engineered for fitness freaks, bodybuilders, powerlifters, and athletes.

import { FITNESS_CATALOG as CURATED_FLAGSHIP } from './fitnessData.js';

export const BRANDS = [
  'Hammer Strength',
  'Cybex VR3 / Eagle',
  'Life Fitness Signature',
  'Prime Fitness SmartCam',
  'Arsenal Strength',
  'Panatta Monolith',
  'Atlantis Strength',
  'Watson Gym Equipment',
  'Nautilus Nitro',
  'Matrix Ultra',
  'Technogym Pure Strength',
  'Rogue Monster Rig',
  'Eleiko IPF Certified',
  'Keiser Air Pneumatic',
  'Hoist ROC-IT Dynamic',
  'Sorinex BaseCamp',
  'Precor Discovery',
];

const MUSCLE_BREAKDOWNS = [
  { group: 'Chest', primary: 'Pectoralis Major (Sternal)', sub: ['Upper Clavicular Pec', 'Costal Lower Pec', 'Anterior Deltoid', 'Triceps Brachii'], met: 6.0, rate: 0.92, anim: 'chest_press' },
  { group: 'Back & Lats', primary: 'Latissimus Dorsi', sub: ['Rhomboids', 'Mid Traps', 'Teres Major', 'Biceps Brachii', 'Lower Lat Insertion'], met: 6.2, rate: 0.94, anim: 'lat_pulldown' },
  { group: 'Quads & Glutes', primary: 'Quadriceps (Vastus Lateralis & Medialis)', sub: ['Gluteus Maximus', 'Rectus Femoris', 'Adductor Magnus'], met: 7.5, rate: 0.96, anim: 'leg_press' },
  { group: 'Hamstrings', primary: 'Hamstrings (Biceps Femoris & Semitendinosus)', sub: ['Gluteus Maximus', 'Erector Spinae', 'Adductors'], met: 6.8, rate: 0.91, anim: 'dumbbell_rdl' },
  { group: 'Shoulders', primary: 'Lateral Deltoids (Side Cap)', sub: ['Anterior Delts', 'Rear Delts', 'Upper Traps', 'Triceps'], met: 5.8, rate: 0.88, anim: 'chest_press' },
  { group: 'Arms (Biceps/Triceps)', primary: 'Biceps & Triceps Complex', sub: ['Biceps Long Head', 'Biceps Short Head', 'Triceps Long Head', 'Brachialis'], met: 5.2, rate: 0.86, anim: 'cable_row' },
  { group: 'Core & Abs', primary: 'Rectus Abdominis & Obliques', sub: ['Transverse Abdominis', 'Serratus Anterior', 'Hip Flexors'], met: 5.0, rate: 0.82, anim: 'pullup' },
  { group: 'Full Body', primary: 'Cardiovascular & Posterior Chain', sub: ['Calves', 'Glutes', 'Lats', 'Heart Rate Base'], met: 8.5, rate: 0.70, anim: 'rowing_machine' },
];

const VARIATIONS = [
  { prefix: 'ISO-Lateral', desc: 'Independently pivoting arms allowing asymmetric loading and eliminating dominant-side compensation.' },
  { prefix: 'Converging / Diverging Axis', desc: 'Ergonomic natural human biomechanical arc following joint socket anatomy.' },
  { prefix: 'Plate-Loaded Heavy Leverage', desc: 'Direct mechanical linkage with exponential resistance curve at peak contraction.' },
  { prefix: 'Dual Adjustable Cable with Variable Cam', desc: 'Constant cable tension maintaining continuous metabolic stress throughout complete active ROM.' },
  { prefix: 'Prone Supported', desc: 'Chest or hip supported pad eliminating spinal shear stress for pure target muscle isolation.' },
  { prefix: 'Incline Angle (+30°)', desc: 'Shifts vertical vector focus to clavicular fibers with maximized upper elongation.' },
  { prefix: 'Decline Angle (-15°)', desc: 'Maximizes costal lower insertion fibers with reduced anterior shoulder impingement.' },
  { prefix: 'Pre-Exhaustion Drop Set Protocol', desc: 'High metabolic accumulation technique targeting deep hypertrophy threshold motor units.' },
];

// Generate 1,000+ distinct exercises programmatically while keeping curated high-detail items on top
function generateMassiveCatalog() {
  const catalog = [...CURATED_FLAGSHIP];
  let idCounter = 1;

  for (let b = 0; b < BRANDS.length; b++) {
    const brand = BRANDS[b];

    for (let m = 0; m < MUSCLE_BREAKDOWNS.length; m++) {
      const muscle = MUSCLE_BREAKDOWNS[m];

      for (let v = 0; v < VARIATIONS.length; v++) {
        const variation = VARIATIONS[v];
        idCounter++;

        const exerciseName = `${brand} ${variation.prefix} ${muscle.primary.split(' ')[0]} Machine`;
        const category = b < 10 ? 'machines' : b < 13 ? 'freeweights' : 'cardio';

        catalog.push({
          id: `equip-${idCounter}`,
          name: exerciseName,
          category,
          level: (idCounter % 3 === 0) ? 'Advanced' : (idCounter % 2 === 0) ? 'Intermediate' : 'All Levels',
          muscleCategory: muscle.group,
          equipmentBrand: brand,
          tagline: `${variation.desc} Designed by ${brand}.`,
          metScore: Math.round((muscle.met + (v * 0.15)) * 10) / 10,
          hypertrophyRate: Math.round((muscle.rate + (v * 0.01)) * 100) / 100,
          primaryMuscles: [
            { name: muscle.primary, percentage: 88 + (idCounter % 10), color: '#f59e0b' },
            { name: muscle.sub[0] || 'Stabilizers', percentage: 55 + (idCounter % 8), color: '#fbbf24' },
            { name: muscle.sub[1] || 'Core', percentage: 40 + (idCounter % 6), color: '#d97706' },
          ],
          animationType: muscle.anim,
          overview: `Engineered specifically on the ${brand} biomechanical framework. This ${variation.prefix.toLowerCase()} system ensures pinpoint muscle fiber recruitment along the ${muscle.group} line of pull.`,
          setupSteps: [
            `Adjust the seat / carriage on the ${brand} pin selector to align joint axis with machine pivot point.`,
            `Calibrate starting resistance using calibrated weight stack or 20kg Olympic plates.`,
            `Lock shoulder blades and engage abdominal wall prior to initiating concentric drive.`,
          ],
          formSteps: [
            `Drive through the intended range of motion with a 1-second explosive concentric contraction.`,
            `Hold peak muscular squeeze for a measured 1.5 seconds at full contraction.`,
            `Resist the return load for 3 slow seconds on the eccentric negative to maximize micro-trauma.`,
          ],
          commonMistakes: [
            `Bouncing the weight stack plates or using torso momentum.`,
            `Allowing joint angles to deviate past structural safety stops.`,
            `Failing to control the 3-second negative eccentric phase.`,
          ],
          proTip: `For ${brand} equipment, focus on pulling or pushing through the elbows rather than gripping tightly with hands to reduce forearm fatigue.`,
          badge: `${brand} Flagship`,
          defaultMinutes: 20,
          defaultSets: 4,
          defaultReps: (idCounter % 2 === 0) ? 10 : 12,
        });
      }
    }
  }

  return catalog;
}

export const MASSIVE_FITNESS_CATALOG = generateMassiveCatalog();
