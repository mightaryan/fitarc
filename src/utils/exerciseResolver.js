import { MASTER_EXERCISE_CATALOG } from '../data/allExercisesMaster.js';
import { YOGA_AND_HOME_WORKOUTS } from '../data/yogaAndHomeWorkouts.js';
import { HOME_WORKOUTS_EXPANDED } from '../data/homeWorkoutsExpanded.js';
import { CALISTHENICS_EXERCISES } from '../data/calisthenicsExercises.js';
import { HIIT_CARDIO_EXERCISES } from '../data/hiitAndLeapWorkouts.js';
import { mergeManagedCatalog } from './adminCatalogHelpers.js';

let cachedBaseMap = null;

function getBaseExerciseList() {
  return [
    ...HIIT_CARDIO_EXERCISES,
    ...HOME_WORKOUTS_EXPANDED,
    ...YOGA_AND_HOME_WORKOUTS,
    ...CALISTHENICS_EXERCISES,
    ...MASTER_EXERCISE_CATALOG,
  ];
}

function getBaseExerciseMap() {
  if (cachedBaseMap) return cachedBaseMap;
  const map = new Map();
  getBaseExerciseList().forEach((ex) => {
    if (ex?.id && !map.has(ex.id)) {
      map.set(ex.id, ex);
    }
  });
  cachedBaseMap = map;
  return map;
}

/**
 * Resolves an array of exercise IDs (honoring Admin custom/overrides) into full exercise objects.
 */
export function resolveExercisesByIds(ids = [], customExercises = [], disabledIds = [], overrides = {}) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const baseMap = getBaseExerciseMap();
  const hasAdminMods =
    (Array.isArray(customExercises) && customExercises.length > 0) ||
    (Array.isArray(disabledIds) && disabledIds.length > 0) ||
    (overrides && Object.keys(overrides).length > 0);

  if (!hasAdminMods) {
    return ids.map((id) => baseMap.get(id)).filter(Boolean);
  }

  const candidateBases = ids.map((id) => baseMap.get(id)).filter(Boolean);
  const managed = mergeManagedCatalog(candidateBases, {
    customItems: customExercises,
    disabledIds: disabledIds,
    overrides,
  });
  const managedMap = new Map(managed.map((ex) => [ex.id, ex]));
  return ids.map((id) => managedMap.get(id)).filter(Boolean);
}

/**
 * Determines which FitArc Fitness sub-tab houses a given exercise for 1-click studio redirect.
 */
export function getFitnessSubTabForExercise(ex) {
  if (!ex) return 'hiit_leap';
  if (ex.id?.startsWith('hiit-') || ex.category === 'hiit' || ex.category === 'cardio') {
    return 'hiit_leap';
  }
  if (ex.id?.startsWith('yoga-') || ex.category === 'yoga' || ex.subCategory === 'exercise_ball') {
    return 'yoga';
  }
  if (ex.id?.startsWith('hw-') || ex.category === 'home_workout') {
    return 'home_hub';
  }
  if (ex.id?.startsWith('cali-') || ex.category === 'calisthenics') {
    return 'calisthenics';
  }
  return 'archive';
}

/**
 * Compact curated exercise options for Admin Blog Post editor selectors.
 */
export function getAllCuratedBlogExercises(customExercises = [], disabledIds = [], overrides = {}) {
  const combined = [
    ...HIIT_CARDIO_EXERCISES,
    ...HOME_WORKOUTS_EXPANDED.slice(0, 36),
    ...YOGA_AND_HOME_WORKOUTS.slice(0, 24),
    ...CALISTHENICS_EXERCISES,
  ];
  return mergeManagedCatalog(combined, {
    customItems: customExercises,
    disabledIds,
    overrides,
  });
}
