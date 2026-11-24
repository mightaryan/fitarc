// Massive 500+ Food Items & Nutrition Database with Vegetarian / Non-Vegetarian / Vegan Filters
// Designed for fitness freaks, exact gram measurement tracking, and healthy home gastronomy.

import { RECIPES_CATALOG as CURATED_RECIPES } from './foodData';

export const DIET_FILTERS = [
  { id: 'all', label: 'All Items (500+)', icon: 'Sparkles' },
  { id: 'veg', label: 'Vegetarian (Veg)', icon: 'Leaf' },
  { id: 'nonveg', label: 'Non-Vegetarian (Non-Veg)', icon: 'Flame' },
  { id: 'vegan', label: '100% Plant Vegan', icon: 'Sprout' },
  { id: 'eggetarian', label: 'Eggetarian', icon: 'Egg' },
  { id: 'high_protein', label: 'High Protein (>30g)', icon: 'ShieldCheck' },
];

// Base staple items with exact nutritional data per standard serving
const FOOD_STAPLES = [
  // --- NON-VEGETARIAN PROTEINS ---
  { name: 'Organic Chicken Breast', diet: 'nonveg', category: 'lunch', serving: '150g fillet', calories: 247, p: 46, c: 0, f: 5, fib: 0, tag: 'Ultra Lean Leucine Anchor', img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=70' },
  { name: 'Wild Scottish Salmon Fillet', diet: 'nonveg', category: 'dinner', serving: '160g fillet', calories: 332, p: 34, c: 0, f: 20, fib: 0, tag: 'EPA / DHA Omega-3 Gold', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=70' },
  { name: 'Grass-Fed Beef Sirloin Steak', diet: 'nonveg', category: 'dinner', serving: '180g cut', calories: 396, p: 48, c: 0, f: 22, fib: 0, tag: 'Heme Iron & Bio-Creatine', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=70' },
  { name: 'Yellowfin Tuna Steak', diet: 'nonveg', category: 'lunch', serving: '150g portion', calories: 195, p: 44, c: 0, f: 1.5, fib: 0, tag: 'Pure Anabolic Protein', img: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?w=500&auto=format&fit=crop&q=70' },
  { name: 'Lean Ground Turkey (93/7)', diet: 'nonveg', category: 'lunch', serving: '160g patty', calories: 240, p: 35, c: 0, f: 11, fib: 0, tag: 'Clean Low Sodium', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=70' },
  { name: 'Jumbo Tiger Prawns (Steamed)', diet: 'nonveg', category: 'dinner', serving: '150g portion', calories: 148, p: 36, c: 1, f: 1, fib: 0, tag: 'Zero Fat Zinc Boost', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=500&auto=format&fit=crop&q=70' },
  { name: 'Atlantic Cod Fillet (Baked)', diet: 'nonveg', category: 'dinner', serving: '180g fillet', calories: 189, p: 41, c: 0, f: 1.5, fib: 0, tag: 'High Bioavailability', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=70' },

  // --- EGGETARIAN ---
  { name: 'Pasture-Raised Whole Poached Eggs', diet: 'eggetarian', category: 'breakfast', serving: '3 large eggs (150g)', calories: 216, p: 18, c: 1.2, f: 15, fib: 0, tag: 'Choline & Vitamin D3', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=70' },
  { name: 'Pure Liquid Egg Whites', diet: 'eggetarian', category: 'breakfast', serving: '200ml cup', calories: 104, p: 22, c: 1.5, f: 0.4, fib: 0, tag: 'Pure Albumin Leucine', img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=70' },
  { name: 'Egg White Herb Omelet with Spinach', diet: 'eggetarian', category: 'breakfast', serving: '220g plate', calories: 165, p: 26, c: 4, f: 4, fib: 2, tag: 'Fat-Loss Breakfast', img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=70' },

  // --- VEGETARIAN & VEGAN PROTEINS ---
  { name: 'Organic Sprouted Firm Tofu', diet: 'vegan', category: 'lunch', serving: '160g block', calories: 192, p: 24, c: 4, f: 11, fib: 3, tag: 'Isoflavone Plant Protein', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=70' },
  { name: 'Indonesian Fermented Tempeh', diet: 'vegan', category: 'dinner', serving: '150g pan-seared', calories: 290, p: 31, c: 14, f: 16, fib: 9, tag: 'Probiotic Fermented Protein', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=70' },
  { name: 'Traditional Low-Fat Paneer (Cottage Cheese)', diet: 'veg', category: 'dinner', serving: '150g grilled', calories: 315, p: 28, c: 5, f: 20, fib: 0, tag: 'Slow Digesting Casein', img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=70' },
  { name: 'Authentic 0% Icelandic Skyr / Greek Yogurt', diet: 'veg', category: 'breakfast', serving: '200g tub', calories: 130, p: 26, c: 6, f: 0, fib: 0, tag: 'Zero Fat Probiotic Dense', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=70' },
  { name: 'High-Protein Soya Chunks (Textured Veg Protein)', diet: 'vegan', category: 'lunch', serving: '60g dry (yields 180g)', calories: 207, p: 31, c: 20, f: 0.5, fib: 8, tag: '52% Protein Concentration', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=70' },
  { name: 'Green Edamame Pods (Steamed & Salted)', diet: 'vegan', category: 'snacks', serving: '150g cup', calories: 180, p: 17, c: 14, f: 8, fib: 8, tag: 'Folate & Fiber Powerhouse', img: 'https://images.unsplash.com/photo-1546069901-d7f45a4a9094?w=500&auto=format&fit=crop&q=70' },
  { name: 'Vital Wheat Gluten (Seitan Steak)', diet: 'vegan', category: 'dinner', serving: '140g seared', calories: 230, p: 44, c: 8, f: 2.5, fib: 1.5, tag: 'Ultra High Protein Density', img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop&q=70' },

  // --- CLEAN CARBOHYDRATES & WHOLE GRAINS ---
  { name: 'Organic Steamed Tri-Color Quinoa', diet: 'vegan', category: 'lunch', serving: '150g cooked', calories: 180, p: 6.5, c: 32, f: 2.8, fib: 4.5, tag: 'Complete Plant Amino Acids', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=70' },
  { name: 'Roasted Japanese Sweet Potato Cubes', diet: 'vegan', category: 'lunch', serving: '180g portion', calories: 162, p: 3.5, c: 37, f: 0.2, fib: 5.5, tag: 'Low Glycemic Glycogen', img: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500&auto=format&fit=crop&q=70' },
  { name: 'Rolled Whole Grain Oats (Farmed)', diet: 'vegan', category: 'breakfast', serving: '60g dry cup', calories: 228, p: 8.5, c: 39, f: 4.2, fib: 6.5, tag: 'Beta-Glucan Heart Shield', img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=70' },
  { name: 'Aromatic Brown Basmati Rice', diet: 'vegan', category: 'dinner', serving: '150g cooked', calories: 172, p: 4, c: 36, f: 1.2, fib: 2.8, tag: 'Clean Muscle Fuel', img: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=70' },
  { name: 'Artisan Whole-Wheat Sourdough', diet: 'vegan', category: 'breakfast', serving: '80g (2 slices)', calories: 185, p: 7.5, c: 36, f: 1.2, fib: 4.2, tag: 'Fermented Gut Health', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=70' },

  // --- HEALTHY FATS, NUTS & SEEDS ---
  { name: 'Fresh Hass Avocado (Half)', diet: 'vegan', category: 'breakfast', serving: '75g portion', calories: 120, p: 1.5, c: 6.5, f: 11, fib: 5, tag: 'Oleic Monounsaturated Fat', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=70' },
  { name: 'Raw California Walnuts', diet: 'vegan', category: 'snacks', serving: '30g handful', calories: 196, p: 4.5, c: 4, f: 20, fib: 2, tag: 'Plant Alpha-Linolenic Acid', img: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&auto=format&fit=crop&q=70' },
  { name: 'Black Chia Seeds (Pudding base)', diet: 'vegan', category: 'breakfast', serving: '20g (2 tbsp)', calories: 98, p: 3.5, c: 8.5, f: 6.2, fib: 7, tag: 'Soluble Viscous Fiber', img: 'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?w=500&auto=format&fit=crop&q=70' },
  { name: 'Cold-Pressed Extra Virgin Olive Oil', diet: 'vegan', category: 'dinner', serving: '15ml tablespoon', calories: 124, p: 0, c: 0, f: 14, fib: 0, tag: 'Polyphenol Anti-Inflammatory', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=70' },

  // --- VEGETABLES & SUPER GREENS ---
  { name: 'Steamed Tenderstem Broccolini', diet: 'vegan', category: 'dinner', serving: '120g bunch', calories: 42, p: 4.2, c: 7.2, f: 0.6, fib: 4.8, tag: 'Sulforaphane Detoxifier', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=70' },
  { name: 'Charred Green Asparagus Spears', diet: 'vegan', category: 'dinner', serving: '100g (7 spears)', calories: 22, p: 2.4, c: 4, f: 0.2, fib: 2.2, tag: 'Glutathione Kidney Cleanse', img: 'https://images.unsplash.com/photo-1515471204630-d3a3794300e8?w=500&auto=format&fit=crop&q=70' },
  { name: 'Baby Spinach & Arugula Rocket Salad', diet: 'vegan', category: 'lunch', serving: '80g bowl', calories: 18, p: 2.2, c: 2.8, f: 0.3, fib: 2.1, tag: 'Nitric Oxide Blood Flow', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=70' },
  { name: 'Wild Nordic Blueberries', diet: 'vegan', category: 'snacks', serving: '100g cup', calories: 57, p: 0.7, c: 14.5, f: 0.3, fib: 3.5, tag: 'Anthocyanin Brain Shield', img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop&q=70' }
];

// Kitchen Cooking Styles & Preparation Methods
const PREPARATION_STYLES = [
  { method: 'Herb Crusted & Cast-Iron Seared', calOffset: 25, fOffset: 2.5, time: '12 min', diff: 'Easy' },
  { method: 'Slow Poached with Lemon Thyme', calOffset: 5, fOffset: 0.5, time: '10 min', diff: 'Easy' },
  { method: 'Smoked Paprika & Garlic Air-Fried', calOffset: 15, fOffset: 1.5, time: '15 min', diff: 'Easy' },
  { method: 'Fire-Charred Skillet with Himalayan Salt', calOffset: 20, fOffset: 2, time: '8 min', diff: 'Easy' },
  { method: 'Steamed with Cold-Pressed Sesame Drizzle', calOffset: 30, fOffset: 3, time: '10 min', diff: 'Medium' },
  { method: 'Oven-Baked with Dijon Rosemary Glaze', calOffset: 35, fOffset: 2.5, time: '20 min', diff: 'Medium' },
  { method: 'High-Temperature Broiled with Seaweed Flakes', calOffset: 10, fOffset: 1, time: '7 min', diff: 'Easy' },
  { method: 'Chimichurri Infused & Wood Plank Roasted', calOffset: 45, fOffset: 4.5, time: '18 min', diff: 'Medium' },
];

const SIDES_COMBOS = [
  { name: 'Steamed Tri-Color Quinoa & Asparagus', p: 7, c: 34, f: 3, fib: 6, cal: 195, diet: 'vegan' },
  { name: 'Caramelized Sweet Potato & Broccolini', p: 5, c: 42, f: 2, fib: 7, cal: 205, diet: 'vegan' },
  { name: 'Fluffy Brown Basmati Rice & Edamame', p: 10, c: 45, f: 4, fib: 6, cal: 250, diet: 'vegan' },
  { name: 'Garlic Sautéed Kale & Mushrooms', p: 4, c: 10, f: 3, fib: 4, cal: 85, diet: 'vegan' },
  { name: 'Avocado Slices & Radish Shoots', p: 2, c: 7, f: 11, fib: 5, cal: 135, diet: 'vegan' },
  { name: '0% Greek Skyr Dip with Fresh Cucumber', p: 15, c: 4, f: 0, fib: 1, cal: 80, diet: 'veg' },
  { name: 'Poached Egg Crown with Chili Flakes', p: 7, c: 0.5, f: 5, fib: 0, cal: 75, diet: 'eggetarian' },
];

// Generate massive 500+ items catalog
function generateMassiveFoodCatalog() {
  const catalog = [...CURATED_RECIPES];
  let idCounter = 1;

  // Add individual raw food staples
  FOOD_STAPLES.forEach((staple) => {
    idCounter++;
    catalog.push({
      id: `food-staple-${idCounter}`,
      title: staple.name,
      subtitle: `${staple.serving} · ${staple.tag}`,
      category: staple.category,
      diet: staple.diet,
      prepTime: '3 min',
      cookTime: '5 min',
      difficulty: 'Easy',
      servings: 1,
      calories: staple.calories,
      protein: staple.p,
      carbs: staple.c,
      fats: staple.f,
      fiber: staple.fib,
      image: staple.img,
      tags: [staple.tag, staple.diet === 'veg' ? 'Vegetarian' : staple.diet === 'vegan' ? '100% Vegan' : staple.diet === 'eggetarian' ? 'Eggetarian' : 'Non-Vegetarian'],
      description: `Premium grade ${staple.name.toLowerCase()} portioned at exact ${staple.serving}. Bio-available nutrition with zero processed additives.`,
      ingredients: [
        { name: staple.name, measurement: staple.serving, weightGrams: parseInt(staple.serving) || 150, notes: 'Fresh raw weight' },
        { name: 'Maldon Sea Salt & Black Pepper', measurement: 'Pinch to taste', weightGrams: 2, notes: 'Mineral electrolyte' },
      ],
      instructions: [
        `Portion exactly ${staple.serving} on your digital kitchen scale.`,
        `Season with mineral salt and fresh cracked pepper.`,
        `Cook to desired doneness or enjoy raw depending on item.`,
      ],
      chefTips: 'Using a digital gram scale ensures zero caloric estimation error.',
    });
  });

  // Generate prepared gourmet fitness meals combining staples + preparation styles + sides
  for (let s = 0; s < FOOD_STAPLES.length; s++) {
    const staple = FOOD_STAPLES[s];

    for (let p = 0; p < PREPARATION_STYLES.length; p++) {
      const prep = PREPARATION_STYLES[p];
      const side = SIDES_COMBOS[(s + p) % SIDES_COMBOS.length];

      idCounter++;

      // Overall dietary classification
      let mealDiet = staple.diet;
      if (staple.diet === 'nonveg' || side.diet === 'nonveg') {
        mealDiet = 'nonveg';
      } else if (staple.diet === 'eggetarian' || side.diet === 'eggetarian') {
        mealDiet = 'eggetarian';
      } else if (staple.diet === 'veg' || side.diet === 'veg') {
        mealDiet = 'veg';
      } else {
        mealDiet = 'vegan';
      }

      const totalCalories = staple.calories + prep.calOffset + side.cal;
      const totalP = staple.p + side.p;
      const totalC = staple.c + side.c;
      const totalF = Math.round((staple.f + prep.fOffset + side.f) * 10) / 10;
      const totalFib = staple.fib + side.fib;

      catalog.push({
        id: `meal-prep-${idCounter}`,
        title: `${prep.method} ${staple.name}`,
        subtitle: `Served with ${side.name} · High Anabolic Ratio`,
        category: staple.category,
        diet: mealDiet,
        prepTime: '8 min',
        cookTime: prep.time,
        difficulty: prep.diff,
        servings: 1,
        calories: totalCalories,
        protein: totalP,
        carbs: totalC,
        fats: totalF,
        fiber: totalFib,
        image: staple.img,
        tags: [
          mealDiet === 'veg' ? 'Vegetarian' : mealDiet === 'vegan' ? 'Vegan' : mealDiet === 'eggetarian' ? 'Eggetarian' : 'Non-Vegetarian',
          totalP >= 35 ? 'High Protein (>35g)' : 'Clean Macros',
          'Exact Home Recipe'
        ],
        description: `Delicately prepared ${staple.name.toLowerCase()} cooked via ${prep.method.toLowerCase()}, accompanied by warm ${side.name.toLowerCase()}.`,
        ingredients: [
          { name: staple.name, measurement: staple.serving, weightGrams: parseInt(staple.serving) || 150, notes: 'Main protein / whole food' },
          { name: side.name, measurement: '1 side portion', weightGrams: 140, notes: 'Nutrient-rich complex side' },
          { name: 'Extra Virgin Olive Oil / Avocado Oil', measurement: '1 tsp', weightGrams: 5, notes: 'Searing medium' },
          { name: 'Organic Fresh Garlic & Thyme', measurement: '1 clove', weightGrams: 5, notes: 'Aromatic glaze' },
        ],
        instructions: [
          `Heat a heavy skillet or oven to 200°C (400°F).`,
          `Weigh out ${staple.serving} of ${staple.name} and coat lightly with 1 tsp oil and chosen aromatics.`,
          `Cook for ${prep.time} until golden crust develops and interior retains moisture.`,
          `Plate alongside warm ${side.name} and garnish with mineral sea salt flakes.`,
        ],
        chefTips: 'Resting proteins for 3-5 minutes after cooking allows cellular re-absorption of moisture for superior tenderness.',
      });

      // Stop once we surpass 520+ distinct items
      if (catalog.length >= 520) break;
    }

    if (catalog.length >= 520) break;
  }

  return catalog;
}

export const MASSIVE_FOOD_CATALOG = generateMassiveFoodCatalog();
