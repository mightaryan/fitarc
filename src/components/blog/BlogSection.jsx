import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle2,
  Utensils,
  Home,
  Dumbbell,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  X,
  Play,
} from 'lucide-react';
import {
  INITIAL_BLOG_POSTS,
  BLOG_CATEGORIES,
  countPostWords,
} from '../../data/healthBlogCatalog';
import { mergeManagedCatalog } from '../../utils/adminCatalogHelpers';
import {
  resolveExercisesByIds,
  getFitnessSubTabForExercise,
} from '../../utils/exerciseResolver';
import { useApp } from '../../context/AppContext';

const PAGE_SIZE = 18;

export function BlogSection() {
  const {
    customBlogPosts = [],
    disabledBlogIds = [],
    blogOverrides = {},
    customExercises = [],
    disabledExerciseIds = [],
    exerciseOverrides = {},
    setActiveTab,
    setFitnessSubTab,
    setSelectedExerciseForModal,
    setActiveGuidedSession,
    hasPaidPlan,
    advancedUnlocked,
    openPlanUpgradeModal,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activePost, setActivePost] = useState(null);

  const managedPosts = useMemo(() => {
    return mergeManagedCatalog(INITIAL_BLOG_POSTS, {
      customItems: customBlogPosts,
      disabledIds: disabledBlogIds,
      overrides: blogOverrides,
    });
  }, [customBlogPosts, disabledBlogIds, blogOverrides]);

  const categoryCounts = useMemo(() => {
    const counts = { all: managedPosts.length };
    managedPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [managedPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return managedPosts.filter((post) => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        (post.title || '').toLowerCase().includes(q) ||
        (post.summary || '').toLowerCase().includes(q) ||
        (post.body || '').toLowerCase().includes(q) ||
        (post.tags || []).some((tg) => tg.toLowerCase().includes(q)) ||
        (post.foodsToEat || []).some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [managedPosts, selectedCategory, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    if (!activePost || typeof window === 'undefined') return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePost]);

  const handleOpenPost = (post) => {
    setActivePost(post);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * 1-Click Exercise Redirect directly from any health article straight to that
   * exact exercise studio and detail guide inside FitArc Fitness.
   */
  const handleRedirectToExercise = (ex) => {
    if (!ex) return;
    const isLockedAdv = ex.level === 'Advanced' && !(advancedUnlocked ?? hasPaidPlan);
    if (isLockedAdv) {
      openPlanUpgradeModal?.(`Unlock Advanced exercise "${ex.name}" inside Pro Plans`);
      return;
    }
    const targetSubTab = getFitnessSubTabForExercise(ex);
    setFitnessSubTab?.(targetSubTab);
    setSelectedExerciseForModal?.(ex);
    setActivePost(null);
    setActiveTab('fitness');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryMeta = (catId) =>
    BLOG_CATEGORIES.find((c) => c.id === catId) || BLOG_CATEGORIES[0];

  const activeExercises = useMemo(() => {
    if (!activePost) return [];
    return resolveExercisesByIds(
      activePost.recommendedExerciseIds || [],
      customExercises,
      disabledExerciseIds,
      exerciseOverrides
    );
  }, [activePost, customExercises, disabledExerciseIds, exerciseOverrides]);

  const activePostWordCount = activePost ? countPostWords(activePost) : 0;
  const activeCatMeta = activePost ? getCategoryMeta(activePost.category) : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-16 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Focused Full-Article Reader View when an article is opened */}
      {activePost ? (
        <article className="max-w-4xl mx-auto space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setActivePost(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>All {managedPosts.length} Health Guides</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span
                className="px-2.5 py-1 rounded-full font-bold border"
                style={{
                  color: activeCatMeta?.accent || '#f59e0b',
                  borderColor: `${activeCatMeta?.accent || '#f59e0b'}44`,
                  backgroundColor: `${activeCatMeta?.accent || '#f59e0b'}15`,
                }}
              >
                {activeCatMeta?.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <Clock className="w-3 h-3 text-amber-400" />
                {activePost.readTimeMin || 2} min read · {activePostWordCount} words
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-8 rounded-3xl bg-obsidian-900/90 border border-amber-500/25 shadow-2xl space-y-6">
            <header className="space-y-2.5 border-b border-white/10 pb-5">
              <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                {activePost.title}
              </h1>
              <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed">
                {activePost.summary}
              </p>
              {Array.isArray(activePost.tags) && activePost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePost.tags.map((tg) => (
                    <span
                      key={tg}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Core Explanation Paragraphs */}
            <div className="space-y-4 text-sm sm:text-[15px] text-slate-200 leading-relaxed">
              {String(activePost.body || '')
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            {/* Actionable Split Grid: What Food To Consume + What To Do From Home */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {Array.isArray(activePost.foodsToEat) && activePost.foodsToEat.length > 0 && (
                <section className="p-4 sm:p-5 rounded-2xl bg-emerald-950/25 border border-emerald-500/25 space-y-3">
                  <h2 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span>What Foods To Consume</span>
                  </h2>
                  <ul className="space-y-2">
                    {activePost.foodsToEat.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {Array.isArray(activePost.homeChecklist) && activePost.homeChecklist.length > 0 && (
                <section className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/25 space-y-3">
                  <h2 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>What To Do From Home</span>
                  </h2>
                  <ul className="space-y-2">
                    {activePost.homeChecklist.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* 1-Click Recommended Exercises Section */}
            {activeExercises.length > 0 && (
              <section className="pt-2 space-y-3 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-amber-400" />
                      <span>1-Click Recommended Home Exercises</span>
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      Tap any card to open inside FitArc Fitness, or start all {activeExercises.length} together
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const unlockedList = activeExercises.filter(
                        (ex) => !(ex.level === 'Advanced' && !(advancedUnlocked ?? hasPaidPlan))
                      );
                      if (unlockedList.length === 0) {
                        openPlanUpgradeModal?.('Unlock Advanced workout routines inside Pro Plans');
                        return;
                      }
                      setActiveGuidedSession?.({
                        routineTitle: activePost.title,
                        badge: 'Health Guide Routine',
                        exercises: unlockedList,
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold inline-flex items-center gap-1.5 shadow-gold-glow-sm transition shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Guided Routine ({activeExercises.length})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeExercises.map((ex) => {
                    const locked = ex.level === 'Advanced' && !(advancedUnlocked ?? hasPaidPlan);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleRedirectToExercise(ex)}
                        className="group text-left p-3 rounded-2xl bg-black/55 hover:bg-amber-500/10 border border-white/10 hover:border-amber-400/50 transition flex flex-col justify-between gap-2.5 active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-black/80 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {ex.gifUrl ? (
                              <img
                                src={ex.gifUrl}
                                alt={ex.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Dumbbell className="w-5 h-5 text-amber-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                              {ex.level || 'Beginner'}
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 line-clamp-2 leading-snug">
                              {ex.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px] font-bold text-amber-300">
                          <span className="flex items-center gap-1">
                            {locked ? (
                              <>
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span>Unlock Exercise</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>Open Exercise</span>
                              </>
                            )}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <p className="text-[11px] text-slate-500 pt-2 border-t border-white/5">
              Educational wellness guidance designed for everyday beginners. Consult your physician for personalized diagnoses or medication changes.
            </p>
          </div>
        </article>
      ) : (
        /* Blog Directory & Browse Experience */
        <>
          {/* Hero Header */}
          <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/15 via-obsidian-900 to-emerald-950/35 border border-amber-500/25 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-[11px] font-bold text-amber-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{managedPosts.length} Beginner Health & Home Guides · ≤ 400 Words Each</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  FitArc Health Journal & Home Action Library
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Clear, jargon-free guides for managing blood sugar, BP, cholesterol, stubborn belly fat, PCOS, joint aches, and everyday protein nutrition — each paired with 1-click home exercise redirects.
                </p>
              </div>

              <div className="w-full md:w-80 relative shrink-0">
                <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Search diabetes, BP, oats, PCOS, knee..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black/60 border border-amber-500/25 focus:border-amber-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {BLOG_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition flex items-center gap-1.5 shrink-0 ${
                      active
                        ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow-sm'
                        : 'bg-black/50 text-slate-300 border-white/10 hover:text-white hover:border-amber-500/30'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Articles Grid */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{visiblePosts.length}</strong> of{' '}
              <strong className="text-amber-300">{filteredPosts.length}</strong> health guides
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Includes Foods to Eat + 1-Click Exercises
            </span>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="p-10 rounded-3xl bg-obsidian-900/70 border border-white/10 text-center space-y-2">
              <p className="text-sm font-bold text-white">No health guides matched "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
              >
                Show All {managedPosts.length} Guides
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePosts.map((post) => {
                const catMeta = getCategoryMeta(post.category);
                const firstEx = resolveExercisesByIds(
                  (post.recommendedExerciseIds || []).slice(0, 1),
                  customExercises,
                  disabledExerciseIds,
                  exerciseOverrides
                )[0];

                return (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 hover:border-amber-500/40 transition flex flex-col justify-between gap-4 group"
                  >
                    <div
                      onClick={() => handleOpenPost(post)}
                      className="cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span
                          className="px-2 py-0.5 rounded-full font-bold border truncate"
                          style={{
                            color: catMeta.accent,
                            borderColor: `${catMeta.accent}40`,
                            backgroundColor: `${catMeta.accent}14`,
                          }}
                        >
                          {catMeta.label}
                        </span>
                        <span className="text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {post.readTimeMin || 2} min
                        </span>
                      </div>

                      <h2 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      {/* Quick 1-click primary recommended exercise pill */}
                      {firstEx && (
                        <button
                          type="button"
                          onClick={() => handleRedirectToExercise(firstEx)}
                          className="w-full px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 flex items-center justify-between gap-2 text-left transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Dumbbell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-[11px] font-bold text-amber-200 truncate">
                              Try: {firstEx.name}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenPost(post)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Read Guide & Food Plan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredPosts.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/35 text-xs sm:text-sm font-extrabold transition"
              >
                Load More Guides ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlogSection;
