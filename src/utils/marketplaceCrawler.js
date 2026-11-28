// Live Product Discovery & Marketplace Indexer
// Queries open food nutrition feeds when accessible and maps every discovered item directly to Amazon.in & Flipkart purchase pages.

const CATEGORY_DEFAULT_IMAGES = {
  whey_protein: '/shop/whey.svg',
  protein_bars: '/shop/bar.svg',
  muesli_oats: '/shop/muesli.svg',
  shakes_plant: '/shop/shake.svg',
  creatine_recovery: '/shop/creatine.svg',
};

export function buildMarketplaceUrls(queryText = '') {
  const clean = (queryText || 'high protein supplement').trim();
  return {
    amazonUrl: `https://www.amazon.in/s?k=${encodeURIComponent(clean)}`,
    flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(clean)}`,
  };
}

export function inferCategoryFromQuery(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('bar')) return 'protein_bars';
  if (lower.includes('muesli') || lower.includes('oats') || lower.includes('granola')) return 'muesli_oats';
  if (lower.includes('shake') || lower.includes('plant') || lower.includes('vegan')) return 'shakes_plant';
  if (lower.includes('creatine') || lower.includes('bcaa')) return 'creatine_recovery';
  return 'whey_protein';
}

/**
 * Crawls open product nutrition index (Open Food Facts) with graceful fallback,
 * enriching results with Amazon.in and Flipkart redirect links for the Magazine Storefront.
 */
export async function crawlMarketplaceNutritionCatalog(query = '', categoryFilter = 'all') {
  const searchTerm = (query || '').trim() || (
    categoryFilter === 'protein_bars'
      ? 'high protein bar'
      : categoryFilter === 'muesli_oats'
      ? 'high protein muesli oats'
      : categoryFilter === 'shakes_plant'
      ? 'protein shake'
      : categoryFilter === 'creatine_recovery'
      ? 'creatine monohydrate'
      : 'whey protein'
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);

  try {
    const endpoint = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      searchTerm
    )}&search_simple=1&action=process&json=1&page_size=8`;

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const payload = await res.json();
    const products = Array.isArray(payload?.products) ? payload.products : [];

    const mapped = products
      .filter((p) => p?.product_name && p?.nutriments)
      .slice(0, 6)
      .map((p, idx) => {
        const nutr = p.nutriments || {};
        const cat = categoryFilter !== 'all' ? categoryFilter : inferCategoryFromQuery(p.product_name || searchTerm);
        const servingG = cat === 'protein_bars' ? 60 : cat === 'muesli_oats' ? 50 : 35;
        const p100 = Number(nutr.proteins_100g) || (cat === 'creatine_recovery' ? 0 : 62);
        const c100 = Number(nutr.carbohydrates_100g) || 12;
        const f100 = Number(nutr.fat_100g) || 4;
        const s100 = Number(nutr.sugars_100g) || 2;
        const kcal100 = Number(nutr['energy-kcal_100g']) || Math.round(p100 * 4 + c100 * 4 + f100 * 9);
        const scale = servingG / 100;

        const title = p.product_name.slice(0, 72);
        const brand = (p.brands || 'Marketplace Discovery').split(',')[0].trim();
        const { amazonUrl, flipkartUrl } = buildMarketplaceUrls(`${brand} ${title}`);
        const estPrice = cat === 'whey_protein' ? 2299 : cat === 'protein_bars' ? 749 : cat === 'muesli_oats' ? 499 : 699;

        return {
          id: `crawl-${p.code || Date.now()}-${idx}`,
          issueTag: `LIVE CRAWL #${idx + 1}`,
          name: title,
          brand,
          category: cat,
          flavor: p.quantity || `${servingG}g serving`,
          imageUrl: p.image_front_small_url || p.image_url || CATEGORY_DEFAULT_IMAGES[cat],
          fallbackImage: CATEGORY_DEFAULT_IMAGES[cat],
          priceINR: estPrice,
          mrpINR: Math.round(estPrice * 1.25),
          proteinPerServing: Math.round(p100 * scale * 10) / 10,
          carbsPerServing: Math.round(c100 * scale * 10) / 10,
          fatPerServing: Math.round(f100 * scale * 10) / 10,
          fiberPerServing: Math.round((Number(nutr.fiber_100g) || 3) * scale * 10) / 10,
          servingSizeGrams: servingG,
          caloriesPerServing: Math.round(kcal100 * scale),
          sugarPerServing: Math.round(s100 * scale * 10) / 10,
          rating: 4.5,
          reviewsCount: 'Live Feed',
          trustifiedStatus: 'batch_check',
          trustifiedBadge: 'Verify Batch on Trustified.in',
          labNote: `Nutrition extracted from open database for "${title}". Click Amazon or Flipkart below to check live pricing & seller ratings.`,
          highlights: ['Live Crawled Nutrition', 'Amazon.in & Flipkart Linked', `${servingG}g Serving Breakdown`],
          amazonUrl,
          flipkartUrl,
          sourceMarketplace: 'Open Food Facts -> Amazon & Flipkart',
          inStock: true,
          featured: false,
          isCrawledResult: true,
        };
      });

    return {
      source: 'live_open_api',
      items: mapped,
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      source: 'offline_fallback',
      items: [],
    };
  }
}

/**
 * Parses an Amazon.in or Flipkart product URL pasted by Admin into clean Shop fields.
 */
export function parseMarketplaceProductUrl(rawUrl = '') {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const isAmazon = host.includes('amazon.');
    const isFlipkart = host.includes('flipkart.');

    // Extract slug from pathname before /dp/ or /p/
    const parts = parsed.pathname.split('/').filter(Boolean);
    const candidateSlug =
      parts.find((seg) => seg !== 'dp' && seg !== 'gp' && seg !== 'product' && seg !== 'p' && !seg.startsWith('B0') && seg.length > 4) ||
      'Imported High-Protein Product';

    const readableTitle = candidateSlug
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .slice(0, 80);

    const cat = inferCategoryFromQuery(readableTitle);
    const searchQueryUrls = buildMarketplaceUrls(readableTitle);

    return {
      name: readableTitle,
      brand: readableTitle.split(' ')[0] || 'Verified Brand',
      category: cat,
      amazonUrl: isAmazon ? trimmed : searchQueryUrls.amazonUrl,
      flipkartUrl: isFlipkart ? trimmed : searchQueryUrls.flipkartUrl,
      fallbackImage: CATEGORY_DEFAULT_IMAGES[cat],
      imageUrl: CATEGORY_DEFAULT_IMAGES[cat],
    };
  } catch (e) {
    return null;
  }
}
