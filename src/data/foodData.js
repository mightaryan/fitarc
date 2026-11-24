// Comprehensive Healthy Home Cooking Database with exact measurements, calories, and macros
// Includes AI Photo Recognition simulation database for meal photo uploads

export const MEAL_CATEGORIES = [
  { id: 'all', label: 'All Recipes' },
  { id: 'breakfast', label: 'Energizing Breakfast' },
  { id: 'lunch', label: 'Clean Power Lunch' },
  { id: 'dinner', label: 'Lean Recovery Dinner' },
  { id: 'snacks', label: 'High-Protein Snacks' },
];

export const RECIPES_CATALOG = [
  {
    id: 'golden-avocado-poached-eggs',
    title: 'Artisan Sourdough with Avocado & Poached Eggs',
    category: 'breakfast',
    subtitle: 'Healthy fats and high bio-available choline for morning focus',
    prepTime: '8 min',
    cookTime: '6 min',
    difficulty: 'Easy',
    servings: 1,
    calories: 420,
    protein: 21,
    carbs: 34,
    fats: 22,
    fiber: 8,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&auto=format&fit=crop&q=80',
    tags: ['High Choline', 'Heart Healthy', 'Sustained Energy'],
    description: 'Crisp toasted artisan whole-grain sourdough layered with fresh crushed Hass avocado, microgreens, and two soft-poached pasture-raised eggs dusted with golden smoked paprika and sea salt flakes.',
    ingredients: [
      { name: 'Artisan Whole-Grain Sourdough Bread', measurement: '2 thick slices', weightGrams: 80, notes: 'Toasted golden' },
      { name: 'Fresh Hass Avocado', measurement: '1/2 medium avocado', weightGrams: 75, notes: 'Ripe, crushed with lime juice' },
      { name: 'Pasture-Raised Eggs', measurement: '2 large eggs', weightGrams: 100, notes: 'Poached soft runny yolk' },
      { name: 'Extra Virgin Olive Oil', measurement: '1 teaspoon', weightGrams: 5, notes: 'Cold-pressed drizzled' },
      { name: 'Microgreens & Radish Shoots', measurement: '1/4 cup', weightGrams: 15, notes: 'Fresh garnish' },
      { name: 'Flaky Maldon Sea Salt & Red Pepper Flakes', measurement: '1/4 tsp', weightGrams: 2, notes: 'To taste' },
    ],
    instructions: [
      'Bring a small pot of water with 1 tbsp apple cider vinegar to a gentle simmer (small bubbles, not a rolling boil).',
      'Crack each fresh egg into a small ramekin. Create a gentle whirlpool in the simmering water with a spoon, then slide the eggs into the center.',
      'Poach for exactly 3 minutes until whites are set and yolks remain golden and liquid. Lift with a slotted spoon onto a paper towel.',
      'Toast sourdough slices in a toaster or lightly brushed skillet until crispy.',
      'In a small bowl, mash the avocado with a fork along with a squeeze of fresh lemon, pinch of sea salt, and black pepper.',
      'Spread the avocado generously across the warm toast. Top with the warm poached eggs.',
      'Garnish with microgreens, red chili flakes, and a delicate drizzle of EVOO.'
    ],
    chefTips: 'Fresh eggs are crucial for clean poaching — the whites hold tighter and create a pristine teardrop shape without wisps.',
    suitableFor: ['Fat Loss', 'Lean Muscle Maintenance', 'Clean Bulking']
  },
  {
    id: 'pan-seared-salmon-quinoa-bowl',
    title: 'Crispy Skin Scottish Salmon & Golden Quinoa Bowl',
    category: 'dinner',
    subtitle: 'Rich in EPA/DHA Omega-3 fatty acids for joint and muscle recovery',
    prepTime: '12 min',
    cookTime: '15 min',
    difficulty: 'Medium',
    servings: 1,
    calories: 560,
    protein: 44,
    carbs: 42,
    fats: 24,
    fiber: 7,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&auto=format&fit=crop&q=80',
    tags: ['Omega-3 Rich', 'Anti-Inflammatory', 'High Protein'],
    description: 'Center-cut wild salmon fillet seared until skin is shatteringly crisp, served over fluffy steamed tri-color quinoa, charred asparagus spears, edamame, and a golden turmeric-ginger glaze.',
    ingredients: [
      { name: 'Wild Scottish Salmon Fillet', measurement: '1 center-cut fillet', weightGrams: 180, notes: 'Skin on, patted bone dry' },
      { name: 'Tri-Color Quinoa (dry)', measurement: '1/3 cup', weightGrams: 60, notes: 'Cooks to approx 150g' },
      { name: 'Fresh Asparagus Spears', measurement: '6 spears', weightGrams: 90, notes: 'Tough ends snapped off' },
      { name: 'Shelled Edamame Beans', measurement: '1/3 cup', weightGrams: 50, notes: 'Steamed' },
      { name: 'Avocado Oil', measurement: '1 teaspoon', weightGrams: 5, notes: 'High smoke point for searing' },
      { name: 'Lemon juice & grated ginger glaze', measurement: '1 tablespoon', weightGrams: 15, notes: 'Low sodium soy/tamari base' }
    ],
    instructions: [
      'Rinse quinoa in a fine-mesh strainer. Combine with 2/3 cup water and a pinch of salt. Bring to boil, cover, reduce to low and simmer 12 minutes until water absorbs, then fluff with fork.',
      'Dry the salmon skin thoroughly with a paper towel — moisture is the enemy of crispy skin. Season generously with sea salt and cracked pepper.',
      'Heat avocado oil in a stainless steel or cast iron skillet over medium-high heat until shimmering.',
      'Place salmon skin-side down. Press gently with a spatula for 10 seconds so the skin makes full contact. Cook undisturbed for 5-6 minutes until 75% cooked through.',
      'Toss asparagus spears in the pan alongside the salmon during the last 3 minutes.',
      'Flip salmon gently and cook for only 60-90 seconds to preserve a juicy, tender medium-rare interior.',
      'Plate the quinoa, layer with steamed edamame and charred asparagus, top with salmon and drizzle ginger-lemon glaze.'
    ],
    chefTips: 'Never flip salmon more than once. Cooking 80% on the skin side renders the subcutaneous fat layer into pure golden crispness.',
    suitableFor: ['Post-Workout Recovery', 'Lean Muscle Gain', 'Brain Health']
  },
  {
    id: 'mediterranean-lemon-herb-chicken-breast',
    title: 'Herb-Marinated Chicken Breast with Roasted Sweet Potato',
    category: 'lunch',
    subtitle: 'Ultra-lean protein paired with low-glycemic complex carbohydrates',
    prepTime: '15 min',
    cookTime: '20 min',
    difficulty: 'Easy',
    servings: 1,
    calories: 490,
    protein: 48,
    carbs: 45,
    fats: 11,
    fiber: 6,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&auto=format&fit=crop&q=80',
    tags: ['Ultra High Protein', 'Low Fat', 'Clean Bulk'],
    description: 'Tender sous-vide or pan-roasted chicken breast marinated with oregano, rosemary, garlic, and freshly squeezed lemon, paired with roasted sweet potato cubes and crisp broccolini.',
    ingredients: [
      { name: 'Organic Chicken Breast Fillet', measurement: '1 large breast', weightGrams: 200, notes: 'Trimmed of visible fat' },
      { name: 'Japanese Sweet Potato', measurement: '1 medium potato', weightGrams: 180, notes: 'Cubed into 1/2 inch pieces' },
      { name: 'Fresh Broccolini', measurement: '4 stalks', weightGrams: 80, notes: 'Trimmed' },
      { name: 'Extra Virgin Olive Oil', measurement: '1 teaspoon', weightGrams: 5, notes: 'For sweet potato roast' },
      { name: 'Garlic Cloves & Fresh Herbs', measurement: '2 cloves + 1 sprig', weightGrams: 10, notes: 'Minced' },
      { name: 'Dijon Mustard & Lemon juice', measurement: '1 tbsp', weightGrams: 15, notes: 'For marinade' }
    ],
    instructions: [
      'Preheat oven or air fryer to 200°C (400°F). Toss sweet potato cubes with 1 tsp olive oil, rosemary, salt and paprika. Roast for 18-20 minutes until edges caramelize.',
      'Whisk minced garlic, lemon juice, Dijon mustard, oregano, and black pepper. Coat chicken breast and let rest for 10 minutes.',
      'Preheat a grill pan or heavy skillet over medium heat. Sear chicken breast for 6 minutes per side until internal temperature reaches 74°C (165°F).',
      'Steam or sauté broccolini for 3 minutes until vibrant green with a slight snap.',
      'Let chicken rest on a cutting board for 5 minutes before slicing to lock in all juices.',
      'Serve sliced chicken fan-style with golden roasted sweet potatoes and broccolini.'
    ],
    chefTips: 'Resting the chicken breast for 5 minutes after cooking keeps 30% more moisture inside rather than leaking out on the plate.',
    suitableFor: ['Fat Loss', 'Muscle Definition', 'Pre-Workout Fuel']
  },
  {
    id: 'superfood-greek-yogurt-parfait',
    title: 'High-Protein Skyr Parfait with Wild Berries & Raw Honey',
    category: 'snacks',
    subtitle: 'Gut-nourishing probiotics, slow-release casein protein, and polyphenol antioxidants',
    prepTime: '5 min',
    cookTime: '0 min',
    difficulty: 'Easy',
    servings: 1,
    calories: 310,
    protein: 28,
    carbs: 36,
    fats: 5,
    fiber: 6,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&auto=format&fit=crop&q=80',
    tags: ['Probiotic Rich', 'Casein Muscle Repair', 'Antioxidant Dense'],
    description: 'Thick strained Icelandic Skyr or Greek Yogurt layered with wild Nordic blueberries, crushed walnuts, chia seeds, and raw honeycomb drizzle.',
    ingredients: [
      { name: 'Authentic 0% Greek Yogurt or Skyr', measurement: '1 cup', weightGrams: 200, notes: 'Dense and creamy' },
      { name: 'Wild Blueberries & Blackberries', measurement: '1/2 cup', weightGrams: 75, notes: 'Fresh or thawed' },
      { name: 'Raw Walnuts (crushed)', measurement: '1 tablespoon', weightGrams: 14, notes: 'Omega-3 brain fuel' },
      { name: 'Black Chia Seeds', measurement: '1 teaspoon', weightGrams: 5, notes: 'Soluble fiber' },
      { name: 'Pure Raw Blossom Honey', measurement: '1 teaspoon', weightGrams: 7, notes: 'Natural enzymes' },
      { name: 'Ground Ceylon Cinnamon', measurement: '1 pinch', weightGrams: 1, notes: 'Insulin sensitizer' }
    ],
    instructions: [
      'Spoon half the Greek yogurt into a chilled glass bowl or mason jar.',
      'Layer with half the wild blueberries and a sprinkle of chia seeds.',
      'Add the remaining Greek yogurt on top, smoothing with the back of a spoon.',
      'Crown with remaining berries, crushed raw walnuts, and dust with Ceylon cinnamon.',
      'Drizzle with raw honey immediately before indulging.'
    ],
    chefTips: 'Ceylon cinnamon helps enhance muscle glucose disposal and keeps blood sugar completely flat after meals.',
    suitableFor: ['Evening Muscle Recovery', 'Midday Energy Boost', 'Breakfast']
  },
  {
    id: 'grass-fed-steak-chimichurri-bowl',
    title: 'Seared Grass-Fed Flank Steak with Chimichurri & Quinoa',
    category: 'dinner',
    subtitle: 'Bio-available heme iron, creatine, and cellular energy synthesis',
    prepTime: '15 min',
    cookTime: '10 min',
    difficulty: 'Medium',
    servings: 1,
    calories: 590,
    protein: 52,
    carbs: 38,
    fats: 23,
    fiber: 5,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
    tags: ['Creatine Loaded', 'Heme Iron', 'Anabolic Recovery'],
    description: 'Thinly sliced grass-fed flank steak seared medium-rare, crowned with fresh homemade parsley-garlic chimichurri, roasted baby peppers, and wild brown rice.',
    ingredients: [
      { name: 'Grass-Fed Beef Flank Steak', measurement: '1 steak portion', weightGrams: 190, notes: 'Brought to room temp' },
      { name: 'Brown Rice & Wild Rice Blend (cooked)', measurement: '1/2 cup', weightGrams: 100, notes: 'Fluffy whole grains' },
      { name: 'Fresh Italian Flat-Leaf Parsley', measurement: '1/4 cup', weightGrams: 15, notes: 'Finely minced' },
      { name: 'Garlic & Red Wine Vinegar', measurement: '1 tbsp vinegar + 1 clove', weightGrams: 15, notes: 'Chimichurri base' },
      { name: 'Cold Pressed EVOO', measurement: '1.5 teaspoon', weightGrams: 7, notes: 'Unfiltered' },
      { name: 'Mini Sweet Bell Peppers', measurement: '3 peppers', weightGrams: 75, notes: 'Blistered' }
    ],
    instructions: [
      'Mix minced parsley, garlic, red wine vinegar, olive oil, oregano, salt, and chili flakes in a bowl to make chimichurri.',
      'Season steak heavily with kosher salt and coarse black pepper.',
      'Heat cast iron pan over high heat until smoking. Sear flank steak for 3-4 minutes per side for medium-rare.',
      'Transfer steak to a cutting board, tent with foil, and let rest for 6-8 minutes.',
      'Slice thinly against the grain at a 45-degree angle to ensure maximum tenderness.',
      'Plate over warm wild rice and blistered peppers, spooning chimichurri over the steak.'
    ],
    chefTips: 'Cutting flank steak AGAINST the grain shortens the muscle fibers, turning a lean cut into melt-in-your-mouth perfection.',
    suitableFor: ['Post-Heavy Lift Recovery', 'Hypertrophy Phase']
  },
  {
    id: 'overnight-chia-protein-oats',
    title: 'Golden Turmeric Vanilla Overnight Protein Oats',
    category: 'breakfast',
    subtitle: 'Sustained glycogen loading with digestive anti-inflammatory spices',
    prepTime: '5 min',
    cookTime: '0 min (Overnight)',
    difficulty: 'Easy',
    servings: 1,
    calories: 440,
    protein: 36,
    carbs: 52,
    fats: 10,
    fiber: 9,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=900&auto=format&fit=crop&q=80',
    tags: ['Pre-Workout Fuel', 'Beta-Glucan Fiber', 'Digestive Health'],
    description: 'Rolled oats soaked in unsweetened almond milk with whey isolate, ground flaxseed, golden turmeric, and sliced banana.',
    ingredients: [
      { name: 'Rolled Whole Grain Oats', measurement: '1/2 cup', weightGrams: 50, notes: 'Old-fashioned non-instant' },
      { name: 'Grass-Fed Vanilla Whey or Plant Isolate', measurement: '1 scoop', weightGrams: 30, notes: '25g pure protein' },
      { name: 'Unsweetened Almond Milk', measurement: '3/4 cup', weightGrams: 180, notes: 'Cold' },
      { name: 'Ground Golden Flaxseed', measurement: '1 tablespoon', weightGrams: 10, notes: 'Lignans & fiber' },
      { name: 'Fresh Banana', measurement: '1/2 banana', weightGrams: 60, notes: 'Sliced' },
      { name: 'Pure Turmeric & Pinch of Black Pepper', measurement: '1/4 tsp', weightGrams: 1, notes: 'Curcumin activation' }
    ],
    instructions: [
      'In a jar or bowl, combine oats, protein powder, flaxseed, turmeric, and black pepper.',
      'Pour almond milk over dry ingredients and stir vigorously with a fork until powder is dissolved.',
      'Seal lid and refrigerate overnight (minimum 4 hours) so oats absorb the liquid and soften completely.',
      'In the morning, top with sliced banana and a dusting of cinnamon.'
    ],
    chefTips: 'The pinch of black pepper contains piperine, which boosts curcumin (turmeric) absorption by up to 2,000%!',
    suitableFor: ['Morning Cardio Prep', 'Busy Workday Prep']
  }
];

// Presets for AI Camera/Photo Meal Analyzer Simulation
export const FOOD_SCAN_PRESETS = [
  {
    dishName: 'Avocado Toast with Two Poached Eggs',
    category: 'breakfast',
    estimatedCalories: 415,
    macros: { protein: 21, carbs: 32, fats: 22, fiber: 8 },
    detectedIngredients: ['Artisan Sourdough', 'Crushed Avocado', 'Poached Eggs', 'Microgreens', 'Chili Flakes'],
    healthGrade: 'A+',
    goldScore: 9.4,
    feedback: 'Excellent balance of bio-available protein and monounsaturated healthy fats. Matches your daily metabolic requirement.',
    sampleImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&auto=format&fit=crop&q=80',
  },
  {
    dishName: 'Grilled Chicken Breast with Sweet Potato & Broccoli',
    category: 'lunch',
    estimatedCalories: 485,
    macros: { protein: 47, carbs: 46, fats: 11, fiber: 7 },
    detectedIngredients: ['Chicken Breast Fillet', 'Roasted Sweet Potato', 'Steamed Broccoli', 'Olive Oil Glaze'],
    healthGrade: 'A+',
    goldScore: 9.8,
    feedback: 'Peak anabolic macronutrient ratio! Over 45g of clean leucine-rich protein and low-GI complex carbs for sustained muscle glycogen.',
    sampleImage: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900&auto=format&fit=crop&q=80',
  },
  {
    dishName: 'Crispy Atlantic Salmon with Brown Rice & Greens',
    category: 'dinner',
    estimatedCalories: 560,
    macros: { protein: 43, carbs: 41, fats: 24, fiber: 6 },
    detectedIngredients: ['Wild Atlantic Salmon', 'Steamed Brown Rice', 'Asparagus', 'Lemon Herb Dressing'],
    healthGrade: 'A+',
    goldScore: 9.6,
    feedback: 'Exceptional micronutrient density with EPA/DHA Omega-3s. Promotes night-time muscle recovery and joint lubrication.',
    sampleImage: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&auto=format&fit=crop&q=80',
  },
  {
    dishName: 'Greek Skyr Yogurt Bowl with Berries & Nuts',
    category: 'snacks',
    estimatedCalories: 320,
    macros: { protein: 29, carbs: 34, fats: 6, fiber: 6 },
    detectedIngredients: ['0% Greek Yogurt', 'Fresh Blueberries', 'Crushed Walnuts', 'Chia Seeds', 'Raw Honey'],
    healthGrade: 'A',
    goldScore: 9.2,
    feedback: 'High protein density with gut microbiome probiotics. Perfect for appetite satiety and muscle preservation.',
    sampleImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&auto=format&fit=crop&q=80',
  },
  {
    dishName: 'Classic Double Cheeseburger with French Fries',
    category: 'lunch',
    estimatedCalories: 980,
    macros: { protein: 34, carbs: 82, fats: 54, fiber: 3 },
    detectedIngredients: ['Beef Patties', 'Cheddar Cheese', 'Brioche Bun', 'Deep Fried Potatoes', 'Mayonnaise Sauce'],
    healthGrade: 'C+',
    goldScore: 5.8,
    feedback: 'Calorically dense meal with elevated saturated fats and refined carbs. We suggest balancing your next meal with a high-protein lean recovery bowl.',
    sampleImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80',
  }
];

// Smart Next-Meal Guidance Recommendations
export const NEXT_MEAL_PROMPTS = [
  {
    id: 'lean_protein',
    title: 'Lean Protein Flush',
    icon: 'ShieldCheck',
    desc: 'Target high protein (>40g) with minimal fats and carbohydrates to maximize muscle protein synthesis.',
    recommendedRecipeId: 'mediterranean-lemon-herb-chicken-breast',
  },
  {
    id: 'low_carb_recovery',
    title: 'Low-Carb Cellular Recovery',
    icon: 'Zap',
    desc: 'Focus on omega-3 healthy fats and antioxidant greens to lower systemic inflammation.',
    recommendedRecipeId: 'pan-seared-salmon-quinoa-bowl',
  },
  {
    id: 'glycogen_refuel',
    title: 'Clean Glycogen Refuel',
    icon: 'Flame',
    desc: 'Balanced complex carbs and protein to reload muscle glycogen before tomorrow’s workout.',
    recommendedRecipeId: 'golden-avocado-poached-eggs',
  },
  {
    id: 'light_gut_rest',
    title: 'Light Gut Rest & Digestion',
    icon: 'Heart',
    desc: 'Fermented probiotic yogurt and high-fiber berries to ease digestion.',
    recommendedRecipeId: 'superfood-greek-yogurt-parfait',
  }
];

// Function to compute dynamic rating based on user's current daily weight and calorie budget
export function evaluateMealNutrition(calories, protein, carbs, fats, userWeightKg = 75, targetDailyCalories = 2200) {
  // Protein density benchmark: ideal is ~0.25 to 0.4g protein per kg of bodyweight per meal
  const targetMealProtein = (userWeightKg * 0.35); // e.g. for 75kg => ~26g protein
  const proteinRatio = Math.min(1.5, protein / targetMealProtein);
  
  // Calorie proportion benchmark: single meal should be ~25% to 35% of daily target
  const idealMealCalorie = targetDailyCalories * 0.30;
  const calDelta = Math.abs(calories - idealMealCalorie) / idealMealCalorie;
  const calScore = Math.max(0.4, 1.0 - (calDelta * 0.5));

  // Compute 1.0 to 10.0 scale
  let rawScore = (proteinRatio * 0.5 + calScore * 0.5) * 10;
  rawScore = Math.min(9.9, Math.max(5.0, rawScore));
  const rounded = Math.round(rawScore * 10) / 10;

  let grade = 'A';
  let badgeText = 'Golden Standard';
  if (rounded >= 9.0) {
    grade = 'A+';
    badgeText = 'Peak Metabolic Match';
  } else if (rounded >= 8.0) {
    grade = 'A';
    badgeText = 'High Quality Fuel';
  } else if (rounded >= 7.0) {
    grade = 'B+';
    badgeText = 'Decent Nutrition';
  } else {
    grade = 'B';
    badgeText = 'Acceptable (Higher Calories)';
  }

  return {
    score: rounded,
    grade,
    badgeText,
    idealMealCalorie: Math.round(idealMealCalorie),
    targetMealProtein: Math.round(targetMealProtein),
    feedback: `Calibrated for your current ${userWeightKg}kg weight: provides ${protein}g protein (target ~${Math.round(targetMealProtein)}g/meal) and ${calories} kcal.`,
  };
}
