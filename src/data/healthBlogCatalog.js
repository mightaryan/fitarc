import { DIABETES_AND_HEART_POSTS } from './blog/diabetesAndHeartPosts.js';
import { BELLY_FAT_AND_WORKOUT_POSTS } from './blog/bellyFatAndWorkoutPosts.js';
import { NUTRITION_AND_WOMENS_POSTS } from './blog/nutritionAndWomensPosts.js';
import { RECOVERY_AND_SLEEP_POSTS } from './blog/recoveryAndSleepPosts.js';

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Guides', accent: '#f59e0b' },
  { id: 'diabetes', label: 'Diabetes & Blood Sugar', accent: '#38bdf8' },
  { id: 'bp_heart', label: 'BP, Heart & Cholesterol', accent: '#f43f5e' },
  { id: 'belly_fat', label: 'Belly Fat & Metabolism', accent: '#f97316' },
  { id: 'home_workouts', label: 'Home Workouts', accent: '#eab308' },
  { id: 'nutrition_protein', label: 'Food & Protein Swaps', accent: '#10b981' },
  { id: 'womens_metabolic', label: "Women's PCOS & Thyroid", accent: '#c084fc' },
  { id: 'sleep_joints', label: 'Sleep, Posture & Joints', accent: '#2dd4bf' },
];

export const MAX_BLOG_POST_WORDS = 400;

/**
 * Counts every reader-facing word in a blog article so posts strictly stay <= 400 words.
 */
export function countPostWords(post) {
  if (!post || typeof post !== 'object') return 0;
  const parts = [
    post.title || '',
    post.summary || '',
    post.body || '',
    ...(Array.isArray(post.foodsToEat) ? post.foodsToEat : []),
    ...(Array.isArray(post.homeChecklist) ? post.homeChecklist : []),
  ];
  return parts
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export const INITIAL_BLOG_POSTS = [
  ...DIABETES_AND_HEART_POSTS,
  ...BELLY_FAT_AND_WORKOUT_POSTS,
  ...NUTRITION_AND_WOMENS_POSTS,
  ...RECOVERY_AND_SLEEP_POSTS,
];
