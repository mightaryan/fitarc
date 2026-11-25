const fs = require('fs');
const path = require('path');
const { MASTER_EXERCISE_CATALOG } = require('../src/data/allExercisesMaster.js');

// Filter pure bodyweight calisthenics (NO gym machinery, NO barbells, NO dumbbells, NO cables)
const calisthenicsList = MASTER_EXERCISE_CATALOG.filter((e) => {
  if (e.equipment !== 'bodyweight') return false;
  const s = (e.name + ' ' + e.slug + ' ' + e.category + ' ' + e.gifUrl).toLowerCase();
  if (
    s.includes('bench') ||
    s.includes('machine') ||
    s.includes('hyperextension') ||
    s.includes('roman') ||
    s.includes('45-side') ||
    s.includes('cable') ||
    s.includes('lever') ||
    s.includes('smith') ||
    s.includes('weighted')
  ) {
    return false;
  }
  return (
    s.includes('pull-up') ||
    s.includes('pull up') ||
    s.includes('chin-up') ||
    s.includes('dip') ||
    s.includes('muscle-up') ||
    s.includes('push-up') ||
    s.includes('push up') ||
    s.includes('dragon flag') ||
    s.includes('l-sit') ||
    s.includes('l sit') ||
    s.includes('inverted row') ||
    s.includes('handstand') ||
    s.includes('planche') ||
    s.includes('flag') ||
    s.includes('plank') ||
    s.includes('squat') ||
    s.includes('hollow')
  );
});

console.log(`Found ${calisthenicsList.length} pure bodyweight calisthenics exercises.`);

const finalCalisthenics = calisthenicsList.map((ex, idx) => {
  const nameLower = ex.name.toLowerCase();
  
  // Categorize Tier
  let tier = 'Foundations (Tier 1)';
  let level = 'Beginner';
  let badge = 'Relative Strength';

  if (
    nameLower.includes('planche') ||
    nameLower.includes('flag') ||
    nameLower.includes('muscle-up') ||
    nameLower.includes('handstand') ||
    nameLower.includes('dragon')
  ) {
    tier = 'Elite Static Holds (Tier 3)';
    level = 'Advanced';
    badge = 'Gymnastic Mastery';
  } else if (
    nameLower.includes('pull-up') ||
    nameLower.includes('pull up') ||
    nameLower.includes('chin-up') ||
    nameLower.includes('dip') ||
    nameLower.includes('l-sit') ||
    nameLower.includes('l sit')
  ) {
    tier = 'Bar & Parallel Mastery (Tier 2)';
    level = 'Intermediate';
    badge = 'Upper Body Pull & Dip';
  } else {
    tier = 'Foundations & Push (Tier 1)';
    level = 'Beginner';
    badge = 'Core & Push Basics';
  }

  return {
    id: `cali-${String(idx + 1).padStart(3, '0')}`,
    name: ex.name,
    slug: ex.slug || `cali-${idx + 1}`,
    category: 'calisthenics',
    discipline: 'calisthenics',
    tier,
    level,
    badge,
    muscleCategory: ex.muscleCategory || 'Calisthenics Core',
    muscle: ex.muscle || 'calisthenics',
    equipment: 'bodyweight',
    equipmentLabel: 'Bodyweight (Pull-up Bar / Parallel Bars / Floor)',
    environment: 'Calisthenics Park / Home Bar',
    isHomeFriendly: true,
    isGymFree: true,
    tagline: `Athletic calisthenic movement developing functional relative power and structural scapular control.`,
    metScore: level === 'Advanced' ? 9.5 : (level === 'Intermediate' ? 8.0 : 6.5),
    hypertrophyRate: 0.88,
    gifUrl: ex.gifUrl,
    primaryMuscles: ex.primaryMuscles || [
      { name: 'Relative Power & Kinetic Chain', percentage: 90, color: '#f59e0b' },
      { name: 'Scapular Stabilizers', percentage: 80, color: '#fbbf24' },
      { name: 'Core Transverse Ring', percentage: 70, color: '#d97706' },
    ],
    setupSteps: [
      'Grip the bar, parallel handles, or ground with active scapular depression and hollow-body pelvic tilt.',
      'Lock core transverse abdominis and squeeze glutes to establish a rigid anatomical lever.',
      'Inhale deeply into diaphragm before initiating kinetic propulsion.',
    ],
    formSteps: [
      'Initiate drive through the primary kinetic chain without swinging or kipping momentum.',
      'Accelerate through concentric apex; squeeze target muscle fibers for 1 full second.',
      'Control the eccentric negative over 2 to 3 seconds, keeping scapular posture engaged.',
      'Maintain continuous steady breathing, exhaling forcefully during peak effort.',
    ],
    commonMistakes: [
      'Using excessive leg kipping or swinging to bypass muscular overload.',
      'Allowing shoulders to shrug into ears (loss of active scapular depression).',
    ],
    proTip: `In calisthenics, your body is the barbell. Squeezing your glutes and pointing your toes engages the entire anterior kinetic chain, making each repetition 40% more neurologically demanding.`,
    defaultMinutes: 15,
    defaultSets: 4,
    defaultReps: level === 'Advanced' ? 5 : (level === 'Intermediate' ? 10 : 15),
  };
});

const fileContent = `/**
 * FITARC CALISTHENICS & RELATIVE STRENGTH ARCHIVE
 * Dedicated 100+ Pure Bodyweight Street Workout, Planche, Dips & Pull-ups
 * 100% Free of Gym Machinery and Weights.
 */

export const CALISTHENICS_EXERCISES = ${JSON.stringify(finalCalisthenics, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/calisthenicsExercises.js'), fileContent, 'utf-8');
console.log(`Successfully generated src/data/calisthenicsExercises.js with ${finalCalisthenics.length} exercises!`);
