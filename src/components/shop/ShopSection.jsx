import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Search,
  ExternalLink,
  Star,
  Sparkles,
  CheckCircle2,
  Plus,
  BadgeCheck,
  Info,
  RefreshCw,
  BookOpen,
  Flame,
  Scale,
  ArrowUpRight,
} from 'lucide-react';
import { SHOP_CATEGORIES } from '../../data/trustifiedShopCatalog';
import {
  crawlMarketplaceNutritionCatalog,
  buildMarketplaceUrls,
} from '../../utils/marketplaceCrawler';
import { useApp } from '../../context/AppContext';

export function ShopSection() {
  const { shopProducts, logMeal, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [loggedItemId, setLoggedItemId] = useState(null);

  // Live Marketplace Crawl state
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawledItems, setCrawledItems] = useState([]);
  const [crawlNotice, setCrawlNotice] = useState('');

  const handleMarketplaceCrawl = async (customQuery = null) => {
    const query = (customQuery ?? searchQuery).trim();
    setIsCrawling(true);
    setCrawlNotice('Scanning Trustified Index & open nutrition database...');
    const result = await crawlMarketplaceNutritionCatalog(query, selectedCategory);
    setIsCrawling(false);

    if (result.items.length > 0) {
      setCrawledItems(result.items);
      setCrawlNotice(
        `Synced ${result.items.length} live nutrition matches linked directly to Amazon.in & Flipkart.`
      );
    } else {
      setCrawledItems([]);
      setCrawlNotice(
        query
          ? `Showing curated Trustified™ picks matching "${query}". Use Direct Marketplace Search links below to browse live Amazon & Flipkart prices.`
          : 'All curated Trustified™ SKUs synced with live Amazon.in & Flipkart search redirects.'
      );
    }
  };

  const combinedCatalog = useMemo(() => {
    const curated = (shopProducts || []).filter((item) => item.inStock !== false);
    if (crawledItems.length === 0) return curated;
    const curatedNames = new Set(curated.map((c) => c.name.toLowerCase()));
    const extra = crawledItems.filter((c) => !curatedNames.has(c.name.toLowerCase()));
    return [...curated, ...extra];
  }, [shopProducts, crawledItems]);

  const visibleProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = combinedCatalog.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (certifiedOnly && item.trustifiedStatus !== 'certified') return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.brand || '').toLowerCase().includes(q) ||
        (item.flavor || '').toLowerCase().includes(q) ||
        (item.highlights || []).some((h) => h.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'protein_desc') {
      return [...list].sort((a, b) => (b.proteinPerServing || 0) - (a.proteinPerServing || 0));
    }
    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
    }
    if (sortBy === 'rating_desc') {
      return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return [...list].sort((a, b) => Number(b.featured || false) - Number(a.featured || false));
  }, [combinedCatalog, selectedCategory, searchQuery, certifiedOnly, sortBy]);

  const certifiedCount = useMemo(
    () => (shopProducts || []).filter((p) => p.inStock !== false && p.trustifiedStatus === 'certified').length,
    [shopProducts]
  );

  // Featured cover article for Magazine Masthead Spread
  const coverFeature = useMemo(
    () => visibleProducts.find((p) => p.featured && p.trustifiedStatus === 'certified') || visibleProducts[0] || null,
    [visibleProducts]
  );

  const handleQuickLogProtein = (product) => {
    if (!logMeal) return;
    logMeal({
      title: `${product.brand} — ${product.name}`,
      mealType: 'snack',
      calories: product.caloriesPerServing || 130,
      protein: product.proteinPerServing || 20,
      carbs: product.carbsPerServing ?? 4,
      sugar: product.sugarPerServing ?? 0,
      fats: product.fatPerServing ?? 2,
      fiber: product.fiberPerServing ?? 2,
      photoUrl: product.imageUrl || '/shop/whey.svg',
      score: product.trustifiedStatus === 'certified' ? 9.6 : 8.9,
    });
    setLoggedItemId(product.id);
    setTimeout(() => setLoggedItemId(null), 2000);
  };

  const liveSearchUrls = buildMarketplaceUrls(
    searchQuery.trim() || 'Trustified whey protein bars muesli'
  );

  return (
    <div className="space-y-7 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Standalone Shop Route Header Bar (/shop) */}
      <div className="px-4 py-2.5 rounded-2xl bg-black/55 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
            /shop
          </span>
          <span className="text-slate-300 font-semibold">
            Dedicated High-Protein Magazine &amp; Supplement Storefront
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('food')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition"
          >
            Macro Tracker →
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-semibold hover:bg-amber-500/25 transition"
          >
            ← Back Home
          </button>
        </div>
      </div>

      {/* 1. EDITORIAL MAGAZINE MASTHEAD BANNER */}
      <div className="relative p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e1513] via-obsidian-900 to-[#181209] border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                FITARC NUTRITION MAGAZINE · ISSUE 2026
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Trustified™ Lab-Passed Index
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight font-serif">
              High-Protein <span className="gold-gradient-text font-sans">Supplement &amp; Pantry</span> Edit
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Magazine-curated Whey Isolates, Clean Protein Bars, High-Protein Muesli &amp; Oats, RTD Shakes, and Creatine — inspect full per-serving nutritional profiles below every photograph, then redirect straight to Amazon.in or Flipkart to buy.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-black/55 border border-emerald-500/30 min-w-[145px]">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">
                Lab-Passed Picks
              </span>
              <div className="text-2xl font-black text-white mt-0.5">{certifiedCount}</div>
              <span className="text-[10px] text-slate-400">Eurofins / NABL Screened</span>
            </div>

            <a
              href="https://www.trustified.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 transition active:scale-95"
            >
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block">Verify Batch ID</span>
                <span className="text-[10px] text-emerald-300/80 font-mono">trustified.in ↗</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MARKETPLACE CRAWLER, SEARCH & EDITORIAL FILTERS */}
      <div className="p-4 sm:p-5 rounded-3xl bg-obsidian-900/95 border border-amber-500/25 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMarketplaceCrawl();
                }}
                placeholder="Search & crawl Amazon / Flipkart (e.g. Avvatar, Whey Isolate, Protein Bar, Muesli)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleMarketplaceCrawl()}
              disabled={isCrawling}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black flex items-center gap-1.5 transition active:scale-95 shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
              <span>{isCrawling ? 'Crawling...' : 'Crawl Store Feed'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setCertifiedOnly((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 active:scale-95 ${
                certifiedOnly
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.45)]'
                  : 'bg-black/50 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Trustified™ Only</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-200 cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured" className="bg-obsidian-900">Magazine Featured</option>
              <option value="protein_desc" className="bg-obsidian-900">Highest Protein / Serving</option>
              <option value="price_asc" className="bg-obsidian-900">Lowest Price First (₹)</option>
              <option value="rating_desc" className="bg-obsidian-900">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm'
                  : 'bg-black/50 text-slate-300 border-white/10 hover:border-amber-500/35 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
          <span>
            Magazine Issue Index: <strong className="text-amber-300">{visibleProducts.length}</strong> curated SKUs
            {crawlNotice && <span className="ml-2 text-emerald-400 font-semibold">· {crawlNotice}</span>}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">Direct Live Marketplace Search:</span>
            <a
              href={liveSearchUrls.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/35 text-amber-300 font-bold hover:bg-amber-500/25 flex items-center gap-1"
            >
              <span>Amazon.in</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={liveSearchUrls.flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/35 text-sky-300 font-bold hover:bg-sky-500/25 flex items-center gap-1"
            >
              <span>Flipkart</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. EDITOR'S COVER FEATURE SPREAD (Hero Magazine Feature) */}
      {coverFeature && selectedCategory === 'all' && !searchQuery.trim() && (
        <article className="rounded-3xl bg-obsidian-900 border border-amber-500/35 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Cover Visual */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[340px] bg-gradient-to-b from-white via-slate-50 to-slate-200 overflow-hidden flex items-center justify-center p-6 pb-20">
            <img
              src={coverFeature.imageUrl || coverFeature.fallbackImage || '/shop/whey.svg'}
              alt={coverFeature.name}
              onError={(e) => {
                e.currentTarget.src = coverFeature.fallbackImage || '/shop/whey.svg';
              }}
              className="max-h-[220px] lg:max-h-[250px] w-auto object-contain drop-shadow-2xl hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest">
                EDITOR&apos;S COVER PICK
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                {coverFeature.issueTag || 'FEATURED LAB TESTED'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
                {coverFeature.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{coverFeature.brand} · {coverFeature.flavor}</p>
            </div>
          </div>

          {/* Right Editorial Review + Nutrition + Buy Stack */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {coverFeature.trustifiedBadge}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{coverFeature.rating}</span>
                  <span className="text-slate-400 font-normal">({coverFeature.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-400/60 pl-3">
                &ldquo;{coverFeature.labNote}&rdquo;
              </p>

              {/* Editorial Per-Serving Nutrition Table */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Nutrition Facts Per {coverFeature.servingSizeGrams}g Serving
                  </span>
                  <span className="text-slate-400 font-mono">{coverFeature.caloriesPerServing} kcal</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <span className="text-[9px] text-slate-400 uppercase block">Protein</span>
                    <span className="text-sm font-black text-emerald-300">{coverFeature.proteinPerServing}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-slate-400 uppercase block">Carbs</span>
                    <span className="text-sm font-black text-sky-300">{coverFeature.carbsPerServing ?? 2}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-slate-400 uppercase block">Fat</span>
                    <span className="text-sm font-black text-amber-200">{coverFeature.fatPerServing ?? 1.5}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-slate-400 uppercase block">Sugar</span>
                    <span className="text-sm font-black text-rose-300">{coverFeature.sugarPerServing}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-slate-400 uppercase block">Fiber</span>
                    <span className="text-sm font-black text-slate-200">{coverFeature.fiberPerServing ?? 0.5}g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Buy Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-white">
                    ₹{coverFeature.priceINR?.toLocaleString('en-IN')}
                  </span>
                  {coverFeature.mrpINR > coverFeature.priceINR && (
                    <span className="text-sm text-slate-500 line-through">
                      ₹{coverFeature.mrpINR?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">Available on Amazon.in &amp; Flipkart</span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={coverFeature.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black flex items-center gap-2 shadow-gold-glow-sm transition active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={coverFeature.flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-bold flex items-center gap-2 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Buy on Flipkart</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 4. STRICT 3-TIER MAGAZINE PRODUCT GRID (Product Visual -> Nutritional Panel -> Direct Redirect Buy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product, index) => {
          const isCertified = product.trustifiedStatus === 'certified';
          const discountPct =
            product.mrpINR && product.mrpINR > product.priceINR
              ? Math.round(((product.mrpINR - product.priceINR) / product.mrpINR) * 100)
              : 0;
          const totalMacroWeight = Math.max(
            1,
            (product.proteinPerServing || 0) + (product.carbsPerServing ?? 3) + (product.fatPerServing ?? 1)
          );
          const pPct = Math.round(((product.proteinPerServing || 0) / totalMacroWeight) * 100);
          const cPct = Math.round(((product.carbsPerServing ?? 3) / totalMacroWeight) * 100);

          return (
            <article
              key={product.id}
              className="rounded-3xl bg-obsidian-900 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl group"
            >
              {/* TIER 1 (TOP): MAGAZINE PRODUCT PHOTOGRAPHY & ISSUE HEADER */}
              <div className="relative h-64 bg-gradient-to-b from-white via-slate-50 to-slate-200 overflow-hidden border-b border-white/10 flex items-center justify-center px-4 pt-9 pb-20">
                <img
                  src={product.imageUrl || product.fallbackImage || '/shop/whey.svg'}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = product.fallbackImage || '/shop/whey.svg';
                  }}
                  className="max-h-36 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090b10] via-black/90 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border flex items-center gap-1 ${
                      isCertified
                        ? 'bg-emerald-950/85 text-emerald-300 border-emerald-400/50'
                        : 'bg-amber-950/85 text-amber-300 border-amber-400/50'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[175px]">{product.trustifiedBadge}</span>
                  </span>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 border border-white/15 text-[11px] font-bold text-amber-300 backdrop-blur-md shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Bottom Over-Image Issue Title */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-amber-300 block">
                    {product.issueTag || `ISSUE ${String(index + 1).padStart(2, '0')} · ${product.brand}`}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition leading-snug line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {product.brand} · {product.flavor}
                  </p>
                </div>
              </div>

              {/* TIER 2 (MIDDLE — BELOW PRODUCT PHOTO): FULL NUTRITIONAL BREAKDOWN */}
              <div className="p-4 sm:p-5 bg-obsidian-950/75 border-b border-white/10 space-y-3 flex-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Nutrition Per {product.servingSizeGrams}g Serving
                  </span>
                  <span className="font-mono text-slate-300">{product.caloriesPerServing} kcal</span>
                </div>

                {/* 6-Cell Macro Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                    <span className="text-[9px] uppercase text-slate-400 block">Protein</span>
                    <span className="text-sm font-black text-emerald-300">
                      {product.proteinPerServing > 0 ? `${product.proteinPerServing}g` : 'Pure 3g'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-center">
                    <span className="text-[9px] uppercase text-slate-400 block">Carbs / Fiber</span>
                    <span className="text-xs font-extrabold text-sky-300">
                      {product.carbsPerServing ?? 3}g / {product.fiberPerServing ?? 0.5}g
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-amber-500/20 text-center">
                    <span className="text-[9px] uppercase text-slate-400 block">Sugar / Fat</span>
                    <span className="text-xs font-extrabold text-amber-300">
                      {product.sugarPerServing}g / {product.fatPerServing ?? 1}g
                    </span>
                  </div>
                </div>

                {/* Macro Visual Density Strip */}
                {product.proteinPerServing > 0 && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                      <div className="h-full bg-emerald-400" style={{ width: `${pPct}%` }} title="Protein" />
                      <div className="h-full bg-sky-400" style={{ width: `${cPct}%` }} title="Carbs" />
                      <div className="h-full bg-amber-400 flex-1" title="Fats" />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span className="text-emerald-400">{pPct}% Protein Ratio</span>
                      <span>Lab Check: {isCertified ? 'Passed' : 'Verify Batch'}</span>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-300 leading-relaxed bg-black/45 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                  {product.labNote}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {(product.highlights || []).slice(0, 3).map((hl, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300"
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* TIER 3 (BOTTOM — BELOW NUTRITION): PRICE & DIRECT AMAZON / FLIPKART REDIRECT */}
              <div className="p-4 sm:p-5 bg-black/55 space-y-3">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">
                        ₹{product.priceINR?.toLocaleString('en-IN')}
                      </span>
                      {discountPct > 0 && (
                        <>
                          <span className="text-xs text-slate-500 line-through">
                            ₹{product.mrpINR?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-400">
                            {discountPct}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Direct Marketplace Fulfillment
                    </span>
                  </div>

                  {product.proteinPerServing > 0 && (
                    <button
                      type="button"
                      onClick={() => handleQuickLogProtein(product)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition flex items-center gap-1 active:scale-95 ${
                        loggedItemId === product.id
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Log 1 serving to FitArc Food Diary"
                    >
                      {loggedItemId === product.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logged</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log Macro</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Direct Marketplace Buy Redirects */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-gold-glow-sm transition active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy Amazon</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                  <a
                    href={product.flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/45 text-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Buy Flipkart</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visibleProducts.length === 0 && (
        <div className="p-12 rounded-3xl bg-obsidian-900 border border-white/10 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-amber-400/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No catalog items match that filter</h3>
          <p className="text-xs text-slate-400">
            Click &ldquo;Crawl Store Feed&rdquo; to search open nutrition databases or browse live results on Amazon &amp; Flipkart:
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <a
              href={liveSearchUrls.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black flex items-center gap-1.5"
            >
              <span>Search Amazon.in ↗</span>
            </a>
            <a
              href={liveSearchUrls.flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-500/25 border border-sky-400/45 text-sky-200 text-xs font-bold flex items-center gap-1.5"
            >
              <span>Search Flipkart ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Disclaimer Footer Strip */}
      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-2.5 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Trustified™ certification status reflects blind lab test campaigns curated by Trustified.in. Always inspect seller authenticity &amp; manufacturing batch number on Amazon.in or Flipkart upon checkout.
        </span>
      </div>
    </div>
  );
}
