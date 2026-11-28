// Large Multi-Athlete Vault Database
// Contains 8 detailed athlete profiles with multi-day exercise histories, meal histories, weight progressions, and body fat scans.

export const formatLocalDate = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getRelativeDateString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return formatLocalDate(d);
};

const MEAL_PHOTOS = {
  avocadoEggs: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=75',
  salmonBowl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=75',
  chickenSweetPotato: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=75',
  yogurtParfait: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=75',
  steakQuinoa: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=75',
  oatsBowl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=75',
  tofuGreens: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=75',
  paneerBowl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=75',
  buddhaSalad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=75',
  omelet: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=75',
};

function makeWeights(startW, endW, daysCount = 10) {
  const arr = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const progress = (daysCount - 1 - i) / (daysCount - 1 || 1);
    const val = Math.round((startW + (endW - startW) * progress) * 10) / 10;
    arr.push({
      date: getRelativeDateString(-i),
      weight: val,
      note: i === 0 ? 'Morning fasted check-in' : `Day ${daysCount - i} biometric log`,
    });
  }
  return arr;
}

function wLog(id, daysOffset, exerciseName, category, durationMinutes, intensity, caloriesBurned, muscleGrowthScore, primaryMuscles, loggedAt = '08:30 AM') {
  return {
    id,
    date: getRelativeDateString(daysOffset),
    exerciseId: id,
    exerciseName,
    category,
    durationMinutes,
    intensity,
    caloriesBurned,
    muscleGrowthScore,
    primaryMuscles,
    loggedAt,
  };
}

function mLog(id, daysOffset, mealType, title, calories, protein, carbs, sugar, fats, photoUrl, score = 9.2, loggedAt = '12:45 PM') {
  const grade = score >= 9.2 ? 'A+' : score >= 8.5 ? 'A' : score >= 7.5 ? 'B+' : 'B';
  return {
    id,
    date: getRelativeDateString(daysOffset),
    mealType,
    title,
    calories,
    protein,
    carbs,
    sugar,
    fats,
    fiber: Math.max(3, Math.round(carbs * 0.18)),
    photoUrl,
    rating: {
      score,
      grade,
      badgeText: score >= 9.0 ? 'Golden Standard' : 'High Quality Fuel',
      feedback: `Provides ${protein}g protein and ${sugar}g sugar tuned to metabolic daily budget.`,
    },
    loggedAt,
  };
}

export function createSeededVault() {
  const athletes = [
    // 1. Alex Vance (Default Active User)
    {
      profile: {
        id: 'user_alex',
        name: 'Alex Vance',
        email: 'alex.vance@fitarc.elite',
        phone: '+1 415-890-2341',
        currentWeight: 78.5,
        targetWeight: 74.0,
        startWeight: 82.0,
        height: 182,
        age: 28,
        gender: 'male',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 16.5,
        dailyCalorieTarget: 2200,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        hasPaidPlan: false,
        planBillingCycle: null,
        memberTier: 'Free Starter',
        loginMethod: 'email',
        specialty: 'Beginner Fitness & Nutrition',
        activePlan: null,
        bodyFatHistory: [
          { date: getRelativeDateString(-14), bodyFat: 18.1, method: 'manual', note: 'Baseline entry' },
          { date: getRelativeDateString(-7), bodyFat: 17.2, method: 'ai_scan', note: 'AI torso vision scan' },
          { date: getRelativeDateString(-1), bodyFat: 16.5, method: 'ai_scan', note: 'AI torso vision scan' },
        ],
      },
      weightHistory: makeWeights(80.6, 78.5, 10),
      loggedWorkouts: [
        wLog('alex-w1', 0, 'Cross Body Crunch & Plank Circuit', 'home_workout', 22, 'high', 195, 42, ['Rectus Abdominis', 'Obliques'], '07:15 AM'),
        wLog('alex-w2', 0, 'Surya Namaskar A (Sun Salutation)', 'yoga', 18, 'moderate', 142, 24, ['Spinal Erectors', 'Core'], '08:05 AM'),
        wLog('alex-w3', -1, '400-600 kcal Extreme HIIT Blitz', 'home_workout', 35, 'maximum', 480, 56, ['Full Body', 'Cardiovascular Base'], '06:30 PM'),
        wLog('alex-w4', -2, 'Incline Dumbbell Bench Press (30° Angle)', 'freeweights', 32, 'high', 245, 78, ['Pectoralis Major', 'Triceps'], '05:45 PM'),
        wLog('alex-w5', -3, 'Floor Diamond Push-Up Ladder', 'home_workout', 20, 'high', 165, 58, ['Pectoralis Major', 'Triceps'], '07:30 AM'),
        wLog('alex-w6', -4, 'L-Sit Floor & Core Compression', 'calisthenics', 25, 'high', 210, 64, ['Transverse Abdominis', 'Hip Flexors'], '06:00 PM'),
        wLog('alex-w7', -5, 'Glute Bridge March & Air Squats', 'home_workout', 28, 'moderate', 220, 49, ['Gluteus Maximus', 'Quads'], '07:20 AM'),
        wLog('alex-w8', -6, 'Stability Ball Thoracic Arch & Spine Extension', 'yoga', 16, 'light', 68, 22, ['Spinal Erectors', 'Core'], '09:00 PM'),
      ],
      loggedMeals: [
        mLog('alex-m1', 0, 'breakfast', 'Artisan Sourdough with Avocado & Poached Eggs', 420, 21, 34, 4, 22, MEAL_PHOTOS.avocadoEggs, 9.4, '08:45 AM'),
        mLog('alex-m2', 0, 'lunch', 'Herb-Marinated Chicken Breast with Roasted Sweet Potato', 490, 48, 45, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.7, '01:15 PM'),
        mLog('alex-m3', -1, 'dinner', 'Crispy Skin Scottish Salmon & Golden Quinoa Bowl', 560, 44, 42, 4, 24, MEAL_PHOTOS.salmonBowl, 9.6, '07:45 PM'),
        mLog('alex-m4', -1, 'snacks', 'High-Protein Skyr Parfait with Wild Berries', 310, 28, 36, 9, 5, MEAL_PHOTOS.yogurtParfait, 9.2, '04:20 PM'),
        mLog('alex-m5', -2, 'lunch', 'Seared Grass-Fed Flank Steak with Chimichurri', 590, 52, 38, 3, 23, MEAL_PHOTOS.steakQuinoa, 9.5, '01:30 PM'),
        mLog('alex-m6', -3, 'breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 440, 36, 52, 7, 10, MEAL_PHOTOS.oatsBowl, 9.3, '08:10 AM'),
      ],
      snoozeUntil: null,
    },

    // 2. Priya Sharma (Yoga Mat & Stability Ball Specialist)
    {
      profile: {
        id: 'user_priya',
        name: 'Priya Sharma',
        email: 'priya.sharma@fitarc.elite',
        phone: '+91 98201 44192',
        currentWeight: 58.2,
        targetWeight: 55.0,
        startWeight: 63.0,
        height: 164,
        age: 26,
        gender: 'female',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 21.4,
        dailyCalorieTarget: 1850,
        dailyWorkoutTargetMin: 40,
        dailyWaterTargetLiters: 3.0,
        isLoggedIn: true,
        hasPaidPlan: true,
        planBillingCycle: 'monthly',
        memberTier: 'Gold Elite Pro',
        loginMethod: 'phone',
        specialty: 'Vinyasa Yoga & Mobility Flow',
        activePlan: {
          id: 'yoga-mobility-60',
          targetArea: 'yoga_mobility',
          durationDays: 60,
          workoutLocation: 'yoga',
          title: '60-Day Vinyasa Flow & Posture Overhaul',
          badge: 'Holistic Equilibrium',
          startDate: getRelativeDateString(-18),
          currentDay: 19,
          dailyCalorieDeficit: 350,
          dailySugarLimitGrams: 18,
          workoutDaysPerWeek: 6,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-20), bodyFat: 23.2, method: 'manual', note: 'Starting check' },
          { date: getRelativeDateString(-10), bodyFat: 22.1, method: 'ai_scan', note: 'AI Torso Scan' },
          { date: getRelativeDateString(-1), bodyFat: 21.4, method: 'ai_scan', note: 'Monthly scan' },
        ],
      },
      weightHistory: makeWeights(60.4, 58.2, 10),
      loggedWorkouts: [
        wLog('priya-w1', 0, 'Surya Namaskar B (Ashtanga 17-Flow)', 'yoga', 30, 'moderate', 195, 34, ['Full Kinetic Chain', 'Core', 'Glutes'], '06:40 AM'),
        wLog('priya-w2', 0, 'Setu Bandhasana & Pelvic Mobility Flow', 'yoga', 18, 'light', 86, 22, ['Glutes', 'Spinal Erectors'], '07:20 AM'),
        wLog('priya-w3', -1, 'Utthita Parsvakonasana & Warrior II Flow', 'yoga', 35, 'moderate', 210, 38, ['Obliques', 'Quads', 'Shoulders'], '06:45 AM'),
        wLog('priya-w4', -2, 'Stability Ball Thoracic Arch & Back Extension', 'yoga', 25, 'moderate', 145, 29, ['Spinal Erectors', 'Transverse Core'], '07:10 AM'),
        wLog('priya-w5', -3, 'Paschimottanasana & Spine Stretch Release', 'yoga', 15, 'light', 64, 18, ['Hamstrings', 'Lumbar Spine'], '09:30 PM'),
        wLog('priya-w6', -4, 'Low Impact Sofa Split Squats & Glute Bridge', 'home_workout', 25, 'moderate', 185, 52, ['Glutes', 'Quadriceps'], '05:50 PM'),
        wLog('priya-w7', -5, 'Chandra Namaskar Evening Yin Sequence', 'yoga', 28, 'light', 135, 22, ['Adductors', 'Lumbar Fascia'], '08:15 PM'),
      ],
      loggedMeals: [
        mLog('priya-m1', 0, 'breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 440, 36, 52, 6, 10, MEAL_PHOTOS.oatsBowl, 9.6, '08:20 AM'),
        mLog('priya-m2', 0, 'lunch', 'Traditional Low-Fat Grilled Paneer & Quinoa Greens', 485, 32, 34, 4, 18, MEAL_PHOTOS.paneerBowl, 9.5, '01:05 PM'),
        mLog('priya-m3', -1, 'dinner', 'Organic Sprouted Firm Tofu & Mixed Greens Bowl', 390, 29, 28, 3, 14, MEAL_PHOTOS.tofuGreens, 9.7, '07:30 PM'),
        mLog('priya-m4', -2, 'snacks', 'High-Protein Skyr Parfait with Wild Berries', 310, 28, 36, 8, 5, MEAL_PHOTOS.yogurtParfait, 9.4, '04:30 PM'),
        mLog('priya-m5', -3, 'lunch', 'Mediterranean Roasted Veggie & Chickpea Salad', 410, 21, 44, 5, 13, MEAL_PHOTOS.buddhaSalad, 9.3, '01:15 PM'),
      ],
      snoozeUntil: null,
    },

    // 3. Marcus Sterling (Heavy Hypertrophy & Commercial Gym Specialist)
    {
      profile: {
        id: 'user_marcus',
        name: 'Marcus Sterling',
        email: 'marcus.sterling@fitarc.elite',
        phone: '+1 310-774-9012',
        currentWeight: 91.4,
        targetWeight: 93.0,
        startWeight: 86.5,
        height: 186,
        age: 31,
        gender: 'male',
        unit: 'kg',
        goal: 'muscle_gain',
        bodyFat: 12.8,
        dailyCalorieTarget: 3100,
        dailyWorkoutTargetMin: 60,
        dailyWaterTargetLiters: 4.5,
        isLoggedIn: true,
        hasPaidPlan: true,
        planBillingCycle: 'monthly',
        memberTier: 'Gold Elite Pro',
        loginMethod: 'email',
        specialty: 'Hypertrophy & Strength',
        activePlan: {
          id: 'overall-fat-90',
          targetArea: 'overall_fat',
          durationDays: 90,
          workoutLocation: 'gym',
          title: '90-Day Master Recomposition',
          badge: 'Lean Athletic Aesthetic',
          startDate: getRelativeDateString(-32),
          currentDay: 33,
          dailyCalorieDeficit: 250,
          dailySugarLimitGrams: 30,
          workoutDaysPerWeek: 6,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-28), bodyFat: 13.8, method: 'manual', note: 'Bulk phase start' },
          { date: getRelativeDateString(-14), bodyFat: 13.2, method: 'ai_scan', note: 'AI Torso Scan' },
          { date: getRelativeDateString(-2), bodyFat: 12.8, method: 'ai_scan', note: 'Peak vascularity' },
        ],
      },
      weightHistory: makeWeights(89.6, 91.4, 10),
      loggedWorkouts: [
        wLog('marcus-w1', 0, 'Barbell Bench Press & Incline Dumbbell Pyramid', 'freeweights', 48, 'maximum', 365, 92, ['Pectoralis Major', 'Anterior Delts', 'Triceps'], '06:30 AM'),
        wLog('marcus-w2', 0, 'Weighted Chest Dip on Parallel Cage', 'machines', 20, 'high', 175, 74, ['Lower Pectorals', 'Triceps'], '07:20 AM'),
        wLog('marcus-w3', -1, 'Barbell Clean Grip Front Squat', 'freeweights', 52, 'maximum', 430, 95, ['Quadriceps', 'Gluteus Maximus', 'Core'], '06:30 AM'),
        wLog('marcus-w4', -2, 'Wide-Grip Lat Pulldown & Seated Cable Row', 'cables', 45, 'high', 310, 86, ['Latissimus Dorsi', 'Rhomboids'], '06:30 AM'),
        wLog('marcus-w5', -3, 'Weighted Muscle-Up & Ring Dip Strength Block', 'calisthenics', 40, 'maximum', 340, 89, ['Lats', 'Pecs', 'Biceps'], '07:00 AM'),
        wLog('marcus-w6', -4, 'Romanian Deadlift & Lever Leg Curl', 'freeweights', 48, 'high', 380, 91, ['Hamstrings', 'Glutes', 'Spinal Erectors'], '06:30 AM'),
      ],
      loggedMeals: [
        mLog('marcus-m1', 0, 'breakfast', 'Egg White Herb Omelet + Whole-Grain Sourdough', 610, 48, 52, 4, 18, MEAL_PHOTOS.omelet, 9.8, '08:15 AM'),
        mLog('marcus-m2', 0, 'lunch', 'Seared Grass-Fed Flank Steak with Chimichurri & Rice', 740, 62, 68, 3, 24, MEAL_PHOTOS.steakQuinoa, 9.7, '01:00 PM'),
        mLog('marcus-m3', -1, 'dinner', 'Crispy Atlantic Salmon & Sweet Potato Double Portion', 820, 58, 72, 5, 29, MEAL_PHOTOS.salmonBowl, 9.6, '07:45 PM'),
        mLog('marcus-m4', -1, 'snacks', 'Double Whey Protein Oats & Almond Butter', 540, 44, 58, 8, 12, MEAL_PHOTOS.oatsBowl, 9.3, '04:30 PM'),
      ],
      snoozeUntil: null,
    },

    // 4. Kenji Takahashi (Calisthenics Park & Static Hold Master)
    {
      profile: {
        id: 'user_kenji',
        name: 'Kenji Takahashi',
        email: 'kenji.t@fitarc.elite',
        phone: '+81 90-4122-8871',
        currentWeight: 69.5,
        targetWeight: 70.0,
        startWeight: 67.0,
        height: 174,
        age: 24,
        gender: 'male',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 10.6,
        dailyCalorieTarget: 2650,
        dailyWorkoutTargetMin: 55,
        dailyWaterTargetLiters: 3.5,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'email',
        specialty: 'Planche & Human Flag Mastery',
        activePlan: {
          id: 'calisthenics-60',
          targetArea: 'calisthenics',
          durationDays: 60,
          workoutLocation: 'calisthenics',
          title: '60-Day Relative Power & Muscle-Up Mastery',
          badge: 'Park & Bar Strength',
          startDate: getRelativeDateString(-22),
          currentDay: 23,
          dailyCalorieDeficit: 200,
          dailySugarLimitGrams: 22,
          workoutDaysPerWeek: 5,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-21), bodyFat: 11.4, method: 'manual', note: 'Baseline' },
          { date: getRelativeDateString(-3), bodyFat: 10.6, method: 'ai_scan', note: 'Shredded' },
        ],
      },
      weightHistory: makeWeights(68.2, 69.5, 9),
      loggedWorkouts: [
        wLog('kenji-w1', 0, 'Full Planche & Straddle Maltese Holds', 'calisthenics', 35, 'maximum', 290, 88, ['Anterior Delts', 'Core', 'Pecs'], '04:30 PM'),
        wLog('kenji-w2', 0, 'Kipping Muscle-Up & Explosive L Pull-Ups', 'calisthenics', 25, 'high', 245, 82, ['Latissimus Dorsi', 'Biceps', 'Brachioradialis'], '05:15 PM'),
        wLog('kenji-w3', -1, 'Human Flag Side Isometric & Dragon Flag', 'calisthenics', 42, 'maximum', 355, 91, ['Obliques', 'Serratus Anterior', 'Lats'], '04:45 PM'),
        wLog('kenji-w4', -2, 'Handstand Push-Ups & Ring Dips', 'calisthenics', 40, 'high', 315, 85, ['Shoulders', 'Triceps'], '04:30 PM'),
        wLog('kenji-w5', -3, 'Single-Leg Pistol Squats & Nordic Curls', 'calisthenics', 38, 'high', 295, 79, ['Quads', 'Hamstrings', 'Glutes'], '05:00 PM'),
      ],
      loggedMeals: [
        mLog('kenji-m1', 0, 'lunch', 'Crispy Skin Scottish Salmon & Golden Quinoa Bowl', 590, 46, 52, 4, 22, MEAL_PHOTOS.salmonBowl, 9.7, '12:30 PM'),
        mLog('kenji-m2', -1, 'dinner', 'Herb-Marinated Chicken Breast & Sweet Potato', 520, 48, 48, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.8, '07:30 PM'),
        mLog('kenji-m3', -2, 'breakfast', 'Pasture-Raised Poached Eggs & Avocado Sourdough', 450, 24, 38, 3, 22, MEAL_PHOTOS.avocadoEggs, 9.5, '08:00 AM'),
      ],
      snoozeUntil: null,
    },

    // 5. Elena Rostova (Glute Sculpt & Core Home Workouts)
    {
      profile: {
        id: 'user_elena',
        name: 'Elena Rostova',
        email: 'elena.r@fitarc.elite',
        phone: '+44 7700 900412',
        currentWeight: 62.0,
        targetWeight: 59.0,
        startWeight: 65.8,
        height: 170,
        age: 27,
        gender: 'female',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 18.2,
        dailyCalorieTarget: 1950,
        dailyWorkoutTargetMin: 40,
        dailyWaterTargetLiters: 3.2,
        isLoggedIn: true,
        hasPaidPlan: true,
        planBillingCycle: 'monthly',
        memberTier: 'Gold Elite Pro',
        loginMethod: 'phone',
        specialty: 'Glutes Lift & Pilates Core',
        activePlan: {
          id: 'thigh-fat-30',
          targetArea: 'thigh_fat',
          durationDays: 30,
          workoutLocation: 'home',
          title: '30-Day Thigh & Glute Sculpt',
          badge: 'Sculpt & Lift Sprint',
          startDate: getRelativeDateString(-11),
          currentDay: 12,
          dailyCalorieDeficit: 450,
          dailySugarLimitGrams: 18,
          workoutDaysPerWeek: 5,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-15), bodyFat: 19.6, method: 'manual', note: 'Start' },
          { date: getRelativeDateString(-2), bodyFat: 18.2, method: 'ai_scan', note: 'AI Torso Scan' },
        ],
      },
      weightHistory: makeWeights(64.2, 62.0, 9),
      loggedWorkouts: [
        wLog('elena-w1', 0, 'Sofa Split Squats & Single-Leg Glute Bridge', 'home_workout', 28, 'high', 245, 62, ['Gluteus Maximus', 'Quads'], '08:00 AM'),
        wLog('elena-w2', -1, 'Bridge Pose & Core Transverse Boat Flow', 'yoga', 25, 'moderate', 140, 32, ['Glutes', 'Deep Core'], '07:45 AM'),
        wLog('elena-w3', -2, 'No-Jumping Home Glute & Adductor Torch', 'home_workout', 22, 'moderate', 180, 54, ['Gluteus Medius', 'Adductors'], '06:15 PM'),
        wLog('elena-w4', -3, 'Stability Ball Core & Pelvic Stabilization', 'yoga', 18, 'light', 74, 22, ['Transverse Core', 'Glutes'], '09:30 PM'),
      ],
      loggedMeals: [
        mLog('elena-m1', 0, 'breakfast', 'High-Protein Skyr Parfait with Wild Berries', 310, 28, 36, 9, 5, MEAL_PHOTOS.yogurtParfait, 9.5, '09:10 AM'),
        mLog('elena-m2', -1, 'lunch', 'Crispy Atlantic Salmon & Greens Bowl', 495, 41, 32, 3, 21, MEAL_PHOTOS.salmonBowl, 9.7, '01:20 PM'),
      ],
      snoozeUntil: null,
    },

    // 6. Arjun Kapoor (400-600 kcal Extreme HIIT Transformation)
    {
      profile: {
        id: 'user_arjun',
        name: 'Arjun Kapoor',
        email: 'arjun.kapoor@fitarc.elite',
        phone: '+91 98112 77304',
        currentWeight: 86.2,
        targetWeight: 77.0,
        startWeight: 94.5,
        height: 179,
        age: 30,
        gender: 'male',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 24.5,
        dailyCalorieTarget: 2050,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 4.0,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'phone',
        specialty: '400-600 kcal Extreme HIIT Shred',
        activePlan: {
          id: 'hiit-600-90',
          targetArea: 'hiit_600',
          durationDays: 90,
          workoutLocation: 'home',
          title: '90-Day Extreme Metabolic Conditioning',
          badge: '600 kcal Burn Protocol',
          startDate: getRelativeDateString(-28),
          currentDay: 29,
          dailyCalorieDeficit: 600,
          dailySugarLimitGrams: 15,
          workoutDaysPerWeek: 6,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-28), bodyFat: 28.4, method: 'manual', note: 'Day 1 baseline' },
          { date: getRelativeDateString(-14), bodyFat: 26.2, method: 'ai_scan', note: 'Mid-month check' },
          { date: getRelativeDateString(-1), bodyFat: 24.5, method: 'ai_scan', note: 'Strong progress' },
        ],
      },
      weightHistory: makeWeights(89.5, 86.2, 10),
      loggedWorkouts: [
        wLog('arjun-w1', 0, '400-600 kcal Extreme HIIT Furnace Set', 'home_workout', 40, 'maximum', 540, 62, ['Full Kinetic Chain', 'Cardiovascular Base'], '06:15 AM'),
        wLog('arjun-w2', -1, 'No Man Boobs Multi-Angle Floor Push-Up Circuit', 'home_workout', 26, 'high', 235, 58, ['Pectoralis Major', 'Triceps'], '06:45 AM'),
        wLog('arjun-w3', -2, 'Lose Belly Fat Mountain Climber & Burpee Set', 'home_workout', 35, 'maximum', 465, 55, ['Abs', 'Cardio'], '07:00 PM'),
        wLog('arjun-w4', -3, 'Low-Impact Recovery Stretch & Downward Dog', 'yoga', 20, 'light', 95, 18, ['Spinal Erectors', 'Calves'], '08:30 AM'),
      ],
      loggedMeals: [
        mLog('arjun-m1', 0, 'breakfast', 'Egg White Herb Omelet with Spinach', 280, 32, 8, 2, 12, MEAL_PHOTOS.omelet, 9.6, '08:00 AM'),
        mLog('arjun-m2', 0, 'lunch', 'Traditional Low-Fat Grilled Paneer & Mixed Veggies', 420, 34, 24, 4, 18, MEAL_PHOTOS.paneerBowl, 9.5, '01:15 PM'),
        mLog('arjun-m3', -1, 'dinner', 'Herb-Marinated Chicken Breast & Broccolini', 440, 48, 28, 3, 10, MEAL_PHOTOS.chickenSweetPotato, 9.8, '07:40 PM'),
      ],
      snoozeUntil: null,
    },

    // 7. Maya Lin (Plant Vegan Yoga & Posture Flow)
    {
      profile: {
        id: 'user_maya',
        name: 'Maya Lin',
        email: 'maya.lin@fitarc.elite',
        phone: '+65 9123 4567',
        currentWeight: 54.8,
        targetWeight: 54.0,
        startWeight: 57.5,
        height: 161,
        age: 25,
        gender: 'female',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 19.5,
        dailyCalorieTarget: 1750,
        dailyWorkoutTargetMin: 35,
        dailyWaterTargetLiters: 2.8,
        isLoggedIn: true,
        memberTier: 'Verified Starter',
        loginMethod: 'email',
        specialty: 'Vegan Nutrition & Yin Flow',
        activePlan: {
          id: 'yoga-mobility-30',
          targetArea: 'yoga_mobility',
          durationDays: 30,
          workoutLocation: 'yoga',
          title: '30-Day Yoga Sanctuary & Spine Reset',
          badge: 'Zen Mobility Sprint',
          startDate: getRelativeDateString(-8),
          currentDay: 9,
          dailyCalorieDeficit: 300,
          dailySugarLimitGrams: 18,
          workoutDaysPerWeek: 5,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-10), bodyFat: 20.1, method: 'manual', note: 'Start' },
          { date: getRelativeDateString(-2), bodyFat: 19.5, method: 'ai_scan', note: 'Scan' },
        ],
      },
      weightHistory: makeWeights(56.0, 54.8, 8),
      loggedWorkouts: [
        wLog('maya-w1', 0, 'Morning Prana Awakening Vinyasa Flow', 'yoga', 28, 'moderate', 148, 26, ['Spine', 'Core'], '07:10 AM'),
        wLog('maya-w2', -1, 'Balasana Child Pose & Lat Release', 'yoga', 15, 'light', 58, 16, ['Latissimus Dorsi', 'Lumbar Fascia'], '09:00 PM'),
        wLog('maya-w3', -2, 'Stability Ball Setu Bandhasana Bridge', 'yoga', 22, 'moderate', 132, 34, ['Glutes', 'Hamstrings'], '06:00 PM'),
      ],
      loggedMeals: [
        mLog('maya-m1', 0, 'lunch', 'Organic Sprouted Firm Tofu & Avocado Bowl', 410, 26, 36, 4, 16, MEAL_PHOTOS.tofuGreens, 9.4, '12:30 PM'),
        mLog('maya-m2', -1, 'dinner', 'Quinoa Edamame Power Buddha Salad', 445, 24, 52, 5, 14, MEAL_PHOTOS.buddhaSalad, 9.5, '07:15 PM'),
      ],
      snoozeUntil: null,
    },

    // 8. Dante Vance (Commercial Gym & Conditioning)
    {
      profile: {
        id: 'user_dante',
        name: 'Dante Vance',
        email: 'dante.v@fitarc.elite',
        phone: '+1 212-555-0194',
        currentWeight: 96.0,
        targetWeight: 89.0,
        startWeight: 102.0,
        height: 188,
        age: 34,
        gender: 'male',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 17.8,
        dailyCalorieTarget: 2550,
        dailyWorkoutTargetMin: 55,
        dailyWaterTargetLiters: 4.0,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'email',
        specialty: 'Powerbuilding & Cut',
        activePlan: {
          id: 'back-fat-60',
          targetArea: 'back_fat',
          durationDays: 60,
          workoutLocation: 'gym',
          title: '60-Day Deep Posterior Chain Definition',
          badge: 'Sculpt & Lengthen',
          startDate: getRelativeDateString(-14),
          currentDay: 15,
          dailyCalorieDeficit: 500,
          dailySugarLimitGrams: 20,
          workoutDaysPerWeek: 5,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-14), bodyFat: 19.1, method: 'manual', note: 'Start cut' },
          { date: getRelativeDateString(-1), bodyFat: 17.8, method: 'ai_scan', note: 'AI Torso Scan' },
        ],
      },
      weightHistory: makeWeights(99.2, 96.0, 9),
      loggedWorkouts: [
        wLog('dante-w1', 0, 'Converging Chest Press Machine & Pec Fly', 'machines', 40, 'high', 310, 79, ['Pectoralis Major', 'Anterior Delts'], '06:45 AM'),
        wLog('dante-w2', -1, 'Cable Pull-Through & Hanging Leg Raise', 'cables', 38, 'high', 285, 72, ['Glutes', 'Abs', 'Back'], '05:30 PM'),
      ],
      loggedMeals: [
        mLog('dante-m1', 0, 'lunch', 'Seared Grass-Fed Flank Steak & Wild Rice', 610, 54, 46, 3, 22, MEAL_PHOTOS.steakQuinoa, 9.7, '01:00 PM'),
        mLog('dante-m2', -1, 'dinner', 'Grilled Chicken Breast with Sweet Potato', 490, 48, 45, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.6, '08:00 PM'),
      ],
      snoozeUntil: null,
    },

    // 9. Zara Al-Mansoor (Clean Mediterranean Nutrition & Pilates Endurance)
    {
      profile: {
        id: 'user_zara',
        name: 'Zara Al-Mansoor',
        email: 'zara.m@fitarc.elite',
        phone: '+971 50-882-3109',
        currentWeight: 59.4,
        targetWeight: 58.0,
        startWeight: 63.0,
        height: 168,
        age: 29,
        gender: 'female',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 18.8,
        dailyCalorieTarget: 2050,
        dailyWorkoutTargetMin: 55,
        dailyWaterTargetLiters: 3.4,
        isLoggedIn: true,
        hasPaidPlan: true,
        planBillingCycle: 'monthly',
        memberTier: 'Gold Elite Pro',
        loginMethod: 'email',
        specialty: 'Pilates Core & Endurance',
        activePlan: {
          id: 'yoga-mobility-60',
          targetArea: 'yoga_mobility',
          durationDays: 60,
          workoutLocation: 'yoga',
          title: '60-Day Yoga & Posture Flow',
          badge: 'Endurance Clarity',
          startDate: getRelativeDateString(-25),
          currentDay: 26,
          dailyCalorieDeficit: 250,
          dailySugarLimitGrams: 16,
          workoutDaysPerWeek: 6,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-14), bodyFat: 19.4, method: 'manual', note: 'Check-in' },
          { date: getRelativeDateString(-1), bodyFat: 18.8, method: 'ai_scan', note: 'Scan' },
        ],
      },
      weightHistory: makeWeights(61.2, 59.4, 9),
      loggedWorkouts: [
        wLog('zara-w1', 0, 'Ashtanga Primary Power Flow & Inversion Hold', 'yoga', 58, 'high', 320, 46, ['Core', 'Shoulders', 'Spine'], '06:30 AM'),
        wLog('zara-w2', -1, 'Pilates Hundred & Reverse Table Endurance Set', 'home_workout', 48, 'high', 295, 52, ['Transverse Core', 'Glutes'], '06:45 AM'),
      ],
      loggedMeals: [
        mLog('zara-m1', 0, 'breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 410, 34, 48, 5, 10, MEAL_PHOTOS.oatsBowl, 9.8, '08:00 AM'),
        mLog('zara-m2', 0, 'lunch', 'Crispy Skin Atlantic Salmon & Golden Quinoa Bowl', 520, 44, 40, 3, 20, MEAL_PHOTOS.salmonBowl, 9.9, '01:00 PM'),
        mLog('zara-m3', 0, 'dinner', 'Organic Sprouted Firm Tofu & Mixed Greens Bowl', 390, 29, 28, 3, 14, MEAL_PHOTOS.tofuGreens, 9.7, '07:30 PM'),
      ],
      snoozeUntil: null,
    },

    // 10. Liam O'Connor (Hybrid Strength & Metabolic Conditioning)
    {
      profile: {
        id: 'user_liam',
        name: "Liam O'Connor",
        email: 'liam.oc@fitarc.elite',
        phone: '+353 87-419-2033',
        currentWeight: 82.6,
        targetWeight: 80.5,
        startWeight: 87.2,
        height: 181,
        age: 32,
        gender: 'male',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 13.4,
        dailyCalorieTarget: 2650,
        dailyWorkoutTargetMin: 60,
        dailyWaterTargetLiters: 4.0,
        isLoggedIn: true,
        hasPaidPlan: true,
        planBillingCycle: 'monthly',
        memberTier: 'Gold Elite Pro',
        loginMethod: 'email',
        specialty: 'Hybrid Strength & Conditioning',
        activePlan: {
          id: 'overall-fat-90',
          targetArea: 'overall_fat',
          durationDays: 90,
          workoutLocation: 'gym',
          title: '90-Day Athletic Conditioning',
          badge: 'Engine Builder',
          startDate: getRelativeDateString(-30),
          currentDay: 31,
          dailyCalorieDeficit: 350,
          dailySugarLimitGrams: 20,
          workoutDaysPerWeek: 6,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-14), bodyFat: 14.1, method: 'manual', note: 'Baseline' },
          { date: getRelativeDateString(-2), bodyFat: 13.4, method: 'ai_scan', note: 'Scan' },
        ],
      },
      weightHistory: makeWeights(84.4, 82.6, 9),
      loggedWorkouts: [
        wLog('liam-w1', 0, 'Barbell Front Squat & Sled Conditioning Block', 'freeweights', 64, 'maximum', 510, 93, ['Quadriceps', 'Glutes', 'Cardio'], '06:15 AM'),
        wLog('liam-w2', -1, 'Weighted Pull-Ups & Ring Muscle-Up Density', 'calisthenics', 56, 'maximum', 420, 89, ['Latissimus Dorsi', 'Core'], '06:30 AM'),
      ],
      loggedMeals: [
        mLog('liam-m1', 0, 'breakfast', 'Egg White Herb Omelet + Whole-Grain Sourdough', 540, 44, 46, 4, 16, MEAL_PHOTOS.omelet, 9.7, '08:00 AM'),
        mLog('liam-m2', 0, 'lunch', 'Herb-Marinated Chicken Breast & Sweet Potato', 560, 52, 50, 4, 11, MEAL_PHOTOS.chickenSweetPotato, 9.8, '01:15 PM'),
        mLog('liam-m3', 0, 'dinner', 'Seared Grass-Fed Flank Steak & Wild Rice', 620, 54, 48, 3, 21, MEAL_PHOTOS.steakQuinoa, 9.7, '07:45 PM'),
      ],
      snoozeUntil: null,
    },

    // 11. Nina Kowalski (Consistent Home Bodyweight & Balanced Cut)
    {
      profile: {
        id: 'user_nina',
        name: 'Nina Kowalski',
        email: 'nina.k@fitarc.elite',
        phone: '+48 601-234-891',
        currentWeight: 64.5,
        targetWeight: 61.5,
        startWeight: 67.8,
        height: 171,
        age: 28,
        gender: 'female',
        unit: 'kg',
        goal: 'fat_loss',
        bodyFat: 22.0,
        dailyCalorieTarget: 1900,
        dailyWorkoutTargetMin: 35,
        dailyWaterTargetLiters: 3.0,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'email',
        specialty: 'Home Sculpt & Low-Impact HIIT',
        activePlan: {
          id: 'belly-fat-30',
          targetArea: 'belly_fat',
          durationDays: 30,
          workoutLocation: 'home',
          title: '30-Day Core & Low-Impact Tone',
          badge: 'Consistent Starter',
          startDate: getRelativeDateString(-9),
          currentDay: 10,
          dailyCalorieDeficit: 400,
          dailySugarLimitGrams: 20,
          workoutDaysPerWeek: 4,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-10), bodyFat: 22.8, method: 'manual', note: 'Start' },
          { date: getRelativeDateString(-1), bodyFat: 22.0, method: 'ai_scan', note: 'Progress' },
        ],
      },
      weightHistory: makeWeights(66.0, 64.5, 8),
      loggedWorkouts: [
        wLog('nina-w1', 0, 'Low Impact Standing Oblique Crunch & Squat Circuit', 'home_workout', 22, 'moderate', 165, 42, ['Obliques', 'Quads'], '07:45 AM'),
        wLog('nina-w2', -1, 'Evening Restorative Yin Flow & Bridge Hold', 'yoga', 20, 'light', 110, 24, ['Spine', 'Glutes'], '08:15 PM'),
      ],
      loggedMeals: [
        mLog('nina-m1', 0, 'breakfast', 'High-Protein Skyr Parfait with Wild Berries', 320, 27, 36, 9, 5, MEAL_PHOTOS.yogurtParfait, 9.2, '08:30 AM'),
        mLog('nina-m2', 0, 'lunch', 'Mediterranean Roasted Veggie & Chickpea Salad', 410, 21, 44, 5, 13, MEAL_PHOTOS.buddhaSalad, 9.4, '01:30 PM'),
      ],
      snoozeUntil: null,
    },

    // 12. Rohan Deshmukh (Calisthenics & Clean Vegetarian Recomp)
    {
      profile: {
        id: 'user_rohan',
        name: 'Rohan Deshmukh',
        email: 'rohan.d@fitarc.elite',
        phone: '+91 98220 55108',
        currentWeight: 74.2,
        targetWeight: 72.0,
        startWeight: 78.4,
        height: 176,
        age: 27,
        gender: 'male',
        unit: 'kg',
        goal: 'recomp',
        bodyFat: 15.2,
        dailyCalorieTarget: 2350,
        dailyWorkoutTargetMin: 45,
        dailyWaterTargetLiters: 3.6,
        isLoggedIn: true,
        memberTier: 'Pro Athlete',
        loginMethod: 'phone',
        specialty: 'Calisthenics & Clean Paneer Fuel',
        activePlan: {
          id: 'calisthenics-60',
          targetArea: 'calisthenics',
          durationDays: 60,
          workoutLocation: 'calisthenics',
          title: '60-Day Relative Power Block',
          badge: 'Bodyweight Mastery',
          startDate: getRelativeDateString(-16),
          currentDay: 17,
          dailyCalorieDeficit: 300,
          dailySugarLimitGrams: 18,
          workoutDaysPerWeek: 5,
        },
        bodyFatHistory: [
          { date: getRelativeDateString(-15), bodyFat: 16.0, method: 'manual', note: 'Start' },
          { date: getRelativeDateString(-2), bodyFat: 15.2, method: 'ai_scan', note: 'Check-in' },
        ],
      },
      weightHistory: makeWeights(75.8, 74.2, 8),
      loggedWorkouts: [
        wLog('rohan-w1', 0, 'Archer Push-Ups & L-Sit Compression Hold', 'calisthenics', 36, 'high', 275, 76, ['Pectoralis Major', 'Core'], '07:00 AM'),
        wLog('rohan-w2', -1, 'Hanging Leg Raise & Explosive Pull-Ups', 'calisthenics', 34, 'high', 260, 74, ['Lats', 'Abs'], '06:40 PM'),
      ],
      loggedMeals: [
        mLog('rohan-m1', 0, 'breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 430, 35, 50, 6, 9, MEAL_PHOTOS.oatsBowl, 9.6, '08:15 AM'),
        mLog('rohan-m2', 0, 'lunch', 'Traditional Low-Fat Grilled Paneer & Quinoa Greens', 485, 33, 35, 4, 17, MEAL_PHOTOS.paneerBowl, 9.6, '01:10 PM'),
      ],
      snoozeUntil: null,
    },
  ];

  const historyFillTemplates = {
    user_alex: {
      workouts: [
        ['Belly Fat Vacuum & Standing Oblique Crunches', 'home_workout', 32, 'high', 285, 58, ['Rectus Abdominis', 'Obliques'], '07:05 AM'],
        ['Incline Dumbbell Bench & Cable Crossover Fly', 'freeweights', 44, 'high', 330, 82, ['Pectoralis Major', 'Anterior Delts'], '06:30 PM'],
        ['Morning Flow: Surya Namaskar & Core Plank', 'yoga', 24, 'moderate', 145, 32, ['Spinal Erectors', 'Core'], '07:15 AM'],
        ['Baddha Konasana Butterfly & Hip Opening Flow', 'yoga', 18, 'light', 68, 20, ['Adductors', 'Lumbar Fascia'], '09:10 PM'],
        ['Sofa Bulgarian Split Squat & Glute Thrust', 'home_workout', 36, 'high', 310, 64, ['Quadriceps', 'Gluteus Maximus'], '06:15 PM'],
        ['Wide-Grip Lat Pulldown & Seated Row Dropset', 'cables', 42, 'high', 320, 80, ['Latissimus Dorsi', 'Rhomboids'], '06:45 PM'],
      ],
      meals: [
        ['breakfast', 'Pasture-Raised Poached Eggs & Avocado Sourdough', 430, 24, 34, 3, 22, MEAL_PHOTOS.avocadoEggs, 9.5, '08:15 AM'],
        ['lunch', 'Herb-Marinated Chicken Breast & Sweet Potato', 510, 48, 46, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.7, '01:10 PM'],
        ['dinner', 'Crispy Skin Atlantic Salmon & Quinoa Greens', 540, 44, 42, 4, 21, MEAL_PHOTOS.salmonBowl, 9.6, '07:45 PM'],
        ['snacks', 'High-Protein Skyr Parfait with Wild Berries', 290, 27, 32, 7, 4, MEAL_PHOTOS.yogurtParfait, 9.4, '04:30 PM'],
      ],
    },
    user_priya: {
      workouts: [
        ['Anjaneyasana Crescent Lunge & Pigeon Mobility', 'yoga', 32, 'moderate', 175, 30, ['Hip Flexors', 'Core', 'Spinal Erectors'], '06:50 AM'],
        ['Stability Ball Hollow Hold & Pike Extension', 'yoga', 26, 'moderate', 160, 34, ['Transverse Core', 'Shoulders'], '07:05 AM'],
        ['Ardha Matsyendrasana Seated Spinal Detox Twist', 'yoga', 18, 'light', 72, 22, ['Obliques', 'Spinal Erectors'], '09:15 PM'],
      ],
      meals: [
        ['breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 420, 34, 50, 6, 9, MEAL_PHOTOS.oatsBowl, 9.6, '08:20 AM'],
        ['lunch', 'Traditional Low-Fat Grilled Paneer & Quinoa Greens', 475, 31, 35, 4, 17, MEAL_PHOTOS.paneerBowl, 9.5, '01:15 PM'],
        ['dinner', 'Organic Sprouted Firm Tofu & Mixed Greens Bowl', 395, 28, 30, 3, 14, MEAL_PHOTOS.tofuGreens, 9.7, '07:35 PM'],
        ['snacks', 'Mediterranean Roasted Veggie & Chickpea Salad', 340, 19, 38, 5, 11, MEAL_PHOTOS.buddhaSalad, 9.3, '04:40 PM'],
      ],
    },
    user_marcus: {
      workouts: [
        ['Weighted Push-Up Pyramid & Pec Deck Finishing Set', 'machines', 46, 'maximum', 355, 88, ['Pectoralis Major', 'Triceps'], '06:35 AM'],
        ['Standing Barbell Military Press & Lateral Raise', 'freeweights', 50, 'maximum', 390, 91, ['Deltoids', 'Trapezius', 'Core'], '06:30 AM'],
        ['Hack Squat Deep Tempo & Seated Calf Raise', 'machines', 54, 'maximum', 440, 94, ['Quadriceps', 'Calves'], '06:40 AM'],
      ],
      meals: [
        ['breakfast', 'Egg White Herb Omelet + Whole-Grain Sourdough', 605, 48, 50, 4, 18, MEAL_PHOTOS.omelet, 9.8, '08:15 AM'],
        ['lunch', 'Seared Grass-Fed Flank Steak with Chimichurri & Rice', 735, 61, 66, 3, 24, MEAL_PHOTOS.steakQuinoa, 9.7, '01:05 PM'],
        ['dinner', 'Crispy Atlantic Salmon & Sweet Potato Double Portion', 810, 57, 70, 5, 28, MEAL_PHOTOS.salmonBowl, 9.6, '07:50 PM'],
        ['snacks', 'Double Whey Protein Oats & Almond Butter', 530, 43, 56, 8, 12, MEAL_PHOTOS.oatsBowl, 9.4, '04:35 PM'],
      ],
    },
    user_kenji: {
      workouts: [
        ['Front Lever Negatives & Weighted Pull-Up Cluster', 'calisthenics', 44, 'maximum', 345, 89, ['Latissimus Dorsi', 'Core', 'Biceps'], '04:40 PM'],
        ['Pseudo-Planche Push-Ups & Ring L-Sit Hold', 'calisthenics', 38, 'high', 305, 84, ['Anterior Delts', 'Rectus Abdominis'], '05:00 PM'],
        ['Explosive Box Jumps & Nordic Hamstring Eccentrics', 'calisthenics', 36, 'high', 295, 80, ['Hamstrings', 'Glutes', 'Calves'], '04:30 PM'],
      ],
      meals: [
        ['breakfast', 'Pasture-Raised Poached Eggs & Avocado Sourdough', 460, 25, 38, 3, 22, MEAL_PHOTOS.avocadoEggs, 9.5, '08:05 AM'],
        ['lunch', 'Crispy Skin Scottish Salmon & Golden Quinoa Bowl', 595, 47, 52, 4, 22, MEAL_PHOTOS.salmonBowl, 9.7, '12:35 PM'],
        ['dinner', 'Herb-Marinated Chicken Breast & Sweet Potato', 530, 49, 48, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.8, '07:30 PM'],
      ],
    },
    user_elena: {
      workouts: [
        ['Single-Leg Hip Thrust & Clamshell Burnout Set', 'home_workout', 30, 'high', 240, 60, ['Gluteus Maximus', 'Gluteus Medius'], '08:10 AM'],
        ['Pilates Hundred & Reverse Plank Core Flow', 'yoga', 24, 'moderate', 145, 35, ['Transverse Core', 'Hamstrings'], '07:50 AM'],
        ['No-Jumping Tempo Squat & Reverse Lunge Circuit', 'home_workout', 28, 'high', 225, 58, ['Quadriceps', 'Glutes'], '06:20 PM'],
      ],
      meals: [
        ['breakfast', 'High-Protein Skyr Parfait with Wild Berries', 315, 29, 36, 8, 5, MEAL_PHOTOS.yogurtParfait, 9.5, '09:05 AM'],
        ['lunch', 'Crispy Atlantic Salmon & Greens Bowl', 490, 41, 32, 3, 20, MEAL_PHOTOS.salmonBowl, 9.7, '01:20 PM'],
        ['dinner', 'Mediterranean Roasted Veggie & Chickpea Salad', 385, 21, 42, 4, 12, MEAL_PHOTOS.buddhaSalad, 9.4, '07:30 PM'],
      ],
    },
    user_arjun: {
      workouts: [
        ['400-600 kcal Tabata Burpee & Skater Jump Shred', 'home_workout', 38, 'maximum', 515, 64, ['Full Kinetic Chain', 'Cardiovascular Base'], '06:20 AM'],
        ['Decline Floor Chest Press Push-Up & Plank Jack', 'home_workout', 30, 'high', 285, 56, ['Pectoralis Major', 'Abs'], '06:50 AM'],
        ['Spinal Decompression Sun Flow & Hip Opener', 'yoga', 22, 'light', 110, 20, ['Spinal Erectors', 'Hip Flexors'], '08:30 AM'],
      ],
      meals: [
        ['breakfast', 'Egg White Herb Omelet with Spinach', 290, 33, 9, 2, 12, MEAL_PHOTOS.omelet, 9.6, '08:00 AM'],
        ['lunch', 'Traditional Low-Fat Grilled Paneer & Mixed Veggies', 425, 34, 24, 4, 18, MEAL_PHOTOS.paneerBowl, 9.5, '01:15 PM'],
        ['dinner', 'Herb-Marinated Chicken Breast & Broccolini', 445, 48, 28, 3, 10, MEAL_PHOTOS.chickenSweetPotato, 9.8, '07:40 PM'],
      ],
    },
    user_maya: {
      workouts: [
        ['Virabhadrasana Warrior III & Balance Tree Flow', 'yoga', 30, 'moderate', 155, 28, ['Glutes', 'Spinal Erectors Core'], '07:15 AM'],
        ['Ustrasana Heart Opener & Thoracic Extension', 'yoga', 16, 'light', 66, 20, ['Pectorals', 'Thoracic Spine'], '09:00 PM'],
        ['Stability Ball Locust Back Extension & Child Pose', 'yoga', 25, 'moderate', 138, 32, ['Spinal Erectors', 'Lumbar Fascia'], '06:05 PM'],
      ],
      meals: [
        ['breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 385, 26, 48, 6, 9, MEAL_PHOTOS.oatsBowl, 9.6, '08:15 AM'],
        ['lunch', 'Organic Sprouted Firm Tofu & Avocado Bowl', 415, 26, 36, 4, 16, MEAL_PHOTOS.tofuGreens, 9.5, '12:35 PM'],
        ['dinner', 'Quinoa Edamame Power Buddha Salad', 440, 24, 50, 5, 14, MEAL_PHOTOS.buddhaSalad, 9.6, '07:20 PM'],
      ],
    },
    user_dante: {
      workouts: [
        ['Incline Hammer Strength Press & Cable Tricep Pushdown', 'machines', 45, 'high', 340, 82, ['Pectoralis Major', 'Triceps'], '06:50 AM'],
        ['Chest-Supported T-Bar Row & Rear Delt Machine', 'machines', 42, 'high', 315, 79, ['Latissimus Dorsi', 'Rear Delts'], '05:40 PM'],
        ['Barbell Stiff-Leg Deadlift & Hanging Knee Raise', 'freeweights', 46, 'maximum', 375, 86, ['Hamstrings', 'Lower Back', 'Abs'], '06:40 AM'],
      ],
      meals: [
        ['breakfast', 'Egg White Herb Omelet + Whole-Grain Sourdough', 520, 42, 44, 4, 16, MEAL_PHOTOS.omelet, 9.6, '08:10 AM'],
        ['lunch', 'Seared Grass-Fed Flank Steak & Wild Rice', 610, 54, 46, 3, 22, MEAL_PHOTOS.steakQuinoa, 9.7, '01:05 PM'],
        ['dinner', 'Grilled Chicken Breast with Sweet Potato', 495, 48, 45, 5, 11, MEAL_PHOTOS.chickenSweetPotato, 9.6, '08:00 PM'],
      ],
    },
    user_zara: {
      workouts: [
        ['Pilates Teaser Flow & Core V-Sit Endurance', 'yoga', 54, 'high', 310, 44, ['Transverse Core', 'Hip Flexors'], '06:35 AM'],
        ['Side Angle Sequence & Balance Tree Hold', 'yoga', 50, 'moderate', 265, 36, ['Glutes', 'Obliques', 'Spine'], '06:40 AM'],
        ['Stability Ball Pike & Back Extension Series', 'yoga', 46, 'high', 275, 40, ['Core', 'Spinal Erectors'], '06:30 AM'],
      ],
      meals: [
        ['breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 410, 34, 48, 5, 10, MEAL_PHOTOS.oatsBowl, 9.8, '08:00 AM'],
        ['lunch', 'Crispy Skin Atlantic Salmon & Golden Quinoa Bowl', 520, 44, 40, 3, 20, MEAL_PHOTOS.salmonBowl, 9.9, '01:00 PM'],
        ['dinner', 'Organic Sprouted Firm Tofu & Mixed Greens Bowl', 390, 29, 28, 3, 14, MEAL_PHOTOS.tofuGreens, 9.7, '07:30 PM'],
      ],
    },
    user_liam: {
      workouts: [
        ['Incline Dumbbell Bench & Explosive Push Press', 'freeweights', 62, 'maximum', 485, 92, ['Pectoralis Major', 'Delts'], '06:20 AM'],
        ['Weighted Muscle-Up & Pistol Squat Engine Set', 'calisthenics', 58, 'maximum', 445, 90, ['Lats', 'Quads', 'Core'], '06:15 AM'],
        ['Barbell Romanian Deadlift & Loaded Carry', 'freeweights', 60, 'maximum', 470, 91, ['Hamstrings', 'Glutes', 'Traps'], '06:30 AM'],
      ],
      meals: [
        ['breakfast', 'Egg White Herb Omelet + Whole-Grain Sourdough', 540, 44, 46, 4, 16, MEAL_PHOTOS.omelet, 9.7, '08:00 AM'],
        ['lunch', 'Herb-Marinated Chicken Breast & Sweet Potato', 560, 52, 50, 4, 11, MEAL_PHOTOS.chickenSweetPotato, 9.8, '01:15 PM'],
        ['dinner', 'Seared Grass-Fed Flank Steak & Wild Rice', 620, 54, 48, 3, 21, MEAL_PHOTOS.steakQuinoa, 9.7, '07:45 PM'],
      ],
    },
    user_nina: {
      workouts: [
        ['No-Jumping Home Glute Bridge & Split Squat', 'home_workout', 22, 'moderate', 165, 42, ['Glutes', 'Quads'], '07:50 AM'],
        ['Morning Flow: Surya Namaskar Gentle Mobility', 'yoga', 20, 'light', 110, 24, ['Spine', 'Core'], '08:00 PM'],
      ],
      meals: [
        ['breakfast', 'High-Protein Skyr Parfait with Wild Berries', 320, 27, 36, 9, 5, MEAL_PHOTOS.yogurtParfait, 9.2, '08:30 AM'],
        ['lunch', 'Mediterranean Roasted Veggie & Chickpea Salad', 410, 21, 44, 5, 13, MEAL_PHOTOS.buddhaSalad, 9.4, '01:30 PM'],
      ],
    },
    user_rohan: {
      workouts: [
        ['Handstand Wall Push-Ups & Ring Dip Dropset', 'calisthenics', 36, 'high', 270, 74, ['Deltoids', 'Triceps'], '07:05 AM'],
        ['Explosive Pull-Ups & Hanging L-Sit Raises', 'calisthenics', 35, 'high', 265, 72, ['Lats', 'Abs'], '06:45 PM'],
      ],
      meals: [
        ['breakfast', 'Golden Turmeric Vanilla Overnight Protein Oats', 430, 35, 50, 6, 9, MEAL_PHOTOS.oatsBowl, 9.6, '08:15 AM'],
        ['lunch', 'Traditional Low-Fat Grilled Paneer & Quinoa Greens', 485, 33, 35, 4, 17, MEAL_PHOTOS.paneerBowl, 9.6, '01:10 PM'],
        ['dinner', 'Mediterranean Roasted Veggie & Chickpea Salad', 420, 24, 44, 4, 13, MEAL_PHOTOS.buddhaSalad, 9.5, '07:55 PM'],
      ],
    },
  };

  const vault = {};
  athletes.forEach((a) => {
    const id = a.profile.id;
    const tpl = historyFillTemplates[id] || historyFillTemplates.user_alex;
    const workouts = [...(a.loggedWorkouts || [])];
    const meals = [...(a.loggedMeals || [])];

    for (let offset = 0; offset >= -6; offset -= 1) {
      const targetDate = getRelativeDateString(offset);
      const dayWorkouts = workouts.filter((w) => w.date === targetDate);
      if (dayWorkouts.length === 0) {
        const wSpec = tpl.workouts[Math.abs(offset) % tpl.workouts.length];
        workouts.push(wLog(`${id}-hist-w${Math.abs(offset)}`, offset, ...wSpec));
      }

      const dayMeals = meals.filter((m) => m.date === targetDate);
      const existingSlots = new Set(dayMeals.map((m) => m.mealType));
      const targetSlots = offset === 0 ? 2 : 2;
      if (dayMeals.length < targetSlots) {
        tpl.meals.forEach((mSpec, idx) => {
          const currentCount = meals.filter((m) => m.date === targetDate).length;
          if (currentCount < 2 && !existingSlots.has(mSpec[0])) {
            meals.push(mLog(`${id}-hist-m${Math.abs(offset)}-${idx}`, offset, ...mSpec));
            existingSlots.add(mSpec[0]);
          }
        });
      }
    }

    workouts.sort((x, y) => (y.date || '').localeCompare(x.date || ''));
    meals.sort((x, y) => (y.date || '').localeCompare(x.date || ''));

    vault[id] = {
      ...a,
      loggedWorkouts: workouts,
      loggedMeals: meals,
    };
  });
  return vault;
}

export function upgradeVaultWithSeededHistory(storedVault) {
  const freshSeed = createSeededVault();
  if (!storedVault || typeof storedVault !== 'object') {
    return freshSeed;
  }

  const merged = {};
  Object.entries(storedVault).forEach(([id, entry]) => {
    if (!entry || typeof entry !== 'object') return;
    const seeded = freshSeed[id];
    if (!seeded) {
      merged[id] = entry;
      return;
    }

    const existingWorkouts = Array.isArray(entry.loggedWorkouts) ? entry.loggedWorkouts : [];
    const existingWorkoutIds = new Set(existingWorkouts.map((w) => w.id));
    const existingWorkoutDates = new Set(existingWorkouts.map((w) => w.date));
    const extraWorkouts = (seeded.loggedWorkouts || []).filter(
      (w) => !existingWorkoutIds.has(w.id) && !existingWorkoutDates.has(w.date)
    );

    const existingMeals = Array.isArray(entry.loggedMeals) ? entry.loggedMeals : [];
    const existingMealIds = new Set(existingMeals.map((m) => m.id));
    const mealCountByDate = {};
    existingMeals.forEach((m) => {
      mealCountByDate[m.date] = (mealCountByDate[m.date] || 0) + 1;
    });
    const extraMeals = [];
    (seeded.loggedMeals || []).forEach((m) => {
      if (!existingMealIds.has(m.id) && (mealCountByDate[m.date] || 0) < 2) {
        extraMeals.push(m);
        mealCountByDate[m.date] = (mealCountByDate[m.date] || 0) + 1;
      }
    });

    const combinedWorkouts = [...existingWorkouts, ...extraWorkouts].sort((x, y) =>
      (y.date || '').localeCompare(x.date || '')
    );
    const combinedMeals = [...existingMeals, ...extraMeals].sort((x, y) =>
      (y.date || '').localeCompare(x.date || '')
    );

    merged[id] = {
      ...seeded,
      ...entry,
      profile: {
        ...seeded.profile,
        ...entry.profile,
      },
      weightHistory:
        Array.isArray(entry.weightHistory) && entry.weightHistory.length >= 2
          ? entry.weightHistory
          : seeded.weightHistory,
      loggedWorkouts: combinedWorkouts,
      loggedMeals: combinedMeals,
    };
  });

  Object.entries(freshSeed).forEach(([id, seeded]) => {
    if (!merged[id]) {
      merged[id] = seeded;
    }
  });

  return merged;
}
