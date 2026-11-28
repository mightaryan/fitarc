import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  X,
  BookOpen,
  Sparkles,
  Check,
  AlertTriangle,
  Dumbbell,
} from 'lucide-react';
import {
  INITIAL_BLOG_POSTS,
  BLOG_CATEGORIES,
  MAX_BLOG_POST_WORDS,
  countPostWords,
} from '../../../data/healthBlogCatalog';
import { mergeManagedCatalog } from '../../../utils/adminCatalogHelpers';
import { getAllCuratedBlogExercises } from '../../../utils/exerciseResolver';
import { useApp } from '../../../context/AppContext';

const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  category: 'diabetes',
  summary: '',
  body: '',
  readTimeMin: 2,
  tagsText: 'Home Care, Beginners',
  foodsText: '',
  checklistText: '',
  recommendedExerciseIds: ['hiit-low-impact-march-lunge', 'cali-010'],
};

export function AdminBlogModule({ onFlash }) {
  const {
    customBlogPosts = [],
    disabledBlogIds = [],
    blogOverrides = {},
    adminUpsertBlogPost,
    adminToggleBlogDisabled,
    adminDeleteCustomBlogPost,
    adminResetBlogOverride,
    customExercises = [],
    disabledExerciseIds = [],
    exerciseOverrides = {},
  } = useApp();

  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'custom' | 'hidden'
  const [pageLimit, setPageLimit] = useState(30);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [exerciseSearch, setExerciseSearch] = useState('');

  const allPosts = useMemo(() => {
    const merged = mergeManagedCatalog(INITIAL_BLOG_POSTS, {
      customItems: customBlogPosts,
      disabledIds: [], // keep hidden visible for admin toggle
      overrides: blogOverrides,
    });
    return merged.map((post) => ({
      ...post,
      isDisabled: disabledBlogIds.includes(post.id),
      hasOverride: Boolean(blogOverrides[post.id]),
      wordCount: countPostWords(post),
    }));
  }, [customBlogPosts, disabledBlogIds, blogOverrides]);

  const curatedExercises = useMemo(
    () => getAllCuratedBlogExercises(customExercises, disabledExerciseIds, exerciseOverrides),
    [customExercises, disabledExerciseIds, exerciseOverrides]
  );

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPosts.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (statusFilter === 'custom' && !p.isCustom) return false;
      if (statusFilter === 'hidden' && !p.isDisabled) return false;
      if (!q) return true;
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.summary || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    });
  }, [allPosts, query, catFilter, statusFilter]);

  const draftPreviewObj = useMemo(
    () => ({
      title: form.title,
      summary: form.summary,
      body: form.body,
      foodsToEat: form.foodsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      homeChecklist: form.checklistText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }),
    [form.title, form.summary, form.body, form.foodsText, form.checklistText]
  );

  const draftWordCount = countPostWords(draftPreviewObj);
  const isOverWordLimit = draftWordCount > MAX_BLOG_POST_WORDS;

  const filteredExerciseChoices = useMemo(() => {
    const q = exerciseSearch.trim().toLowerCase();
    return curatedExercises
      .filter((ex) => {
        if (!q) return true;
        return (
          (ex.name || '').toLowerCase().includes(q) ||
          (ex.muscleCategory || '').toLowerCase().includes(q) ||
          (ex.id || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 24);
  }, [curatedExercises, exerciseSearch]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setExerciseSearch('');
    setIsEditorOpen(true);
  };

  const openEditModal = (post) => {
    setForm({
      id: post.id,
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'diabetes',
      summary: post.summary || '',
      body: post.body || '',
      readTimeMin: post.readTimeMin || 2,
      tagsText: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      foodsText: Array.isArray(post.foodsToEat) ? post.foodsToEat.join('\n') : '',
      checklistText: Array.isArray(post.homeChecklist) ? post.homeChecklist.join('\n') : '',
      recommendedExerciseIds: Array.isArray(post.recommendedExerciseIds)
        ? [...post.recommendedExerciseIds]
        : ['hiit-low-impact-march-lunge'],
    });
    setExerciseSearch('');
    setIsEditorOpen(true);
  };

  const toggleRecommendedEx = (exId) => {
    setForm((prev) => {
      const exists = prev.recommendedExerciseIds.includes(exId);
      const next = exists
        ? prev.recommendedExerciseIds.filter((id) => id !== exId)
        : prev.recommendedExerciseIds.length < 4
        ? [...prev.recommendedExerciseIds, exId]
        : [...prev.recommendedExerciseIds.slice(1), exId];
      return { ...prev, recommendedExerciseIds: next };
    });
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      onFlash?.('Article title and body guidance are required', 'warning');
      return;
    }
    if (isOverWordLimit) {
      onFlash?.(`Please keep article <= ${MAX_BLOG_POST_WORDS} words (currently ${draftWordCount})`, 'warning');
      return;
    }
    adminUpsertBlogPost({
      id: form.id || undefined,
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      summary: form.summary.trim(),
      body: form.body.trim(),
      readTimeMin: Number(form.readTimeMin) || 2,
      tags: form.tagsText,
      foodsToEat: form.foodsText,
      homeChecklist: form.checklistText,
      recommendedExerciseIds:
        form.recommendedExerciseIds.length > 0
          ? form.recommendedExerciseIds
          : ['hiit-low-impact-march-lunge'],
    });
    setIsEditorOpen(false);
    onFlash?.(form.id ? 'Blog article updated live' : 'New health guide published to /blog');
  };

  const visibleRows = filteredPosts.slice(0, pageLimit);

  return (
    <div className="space-y-5">
      {/* Header Stats & Actions */}
      <div className="bg-obsidian-800/75 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Health Blog & Exercise Guide CMS</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {allPosts.length} Total Guides ({customBlogPosts.length} Custom · {disabledBlogIds.length} Hidden) · Strictly ≤ {MAX_BLOG_POST_WORDS} words each with 1-click exercise redirects.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-gold-glow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Guide</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-obsidian-800/65 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 210+ health articles (diabetes, cholesterol, belly fat, PCOS, food)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All (${allPosts.length})` },
              { id: 'custom', label: `Custom (${customBlogPosts.length})` },
              { id: 'hidden', label: `Hidden (${disabledBlogIds.length})` },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition ${
                  statusFilter === st.id
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCatFilter(c.id);
                setPageLimit(30);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition border ${
                catFilter === c.id
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table/List */}
      <div className="space-y-2.5">
        {visibleRows.map((post) => (
          <div
            key={post.id}
            className={`p-3.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
              post.isDisabled
                ? 'bg-rose-950/20 border-rose-500/20 opacity-75'
                : 'bg-obsidian-800/60 border-white/10 hover:border-amber-500/30'
            }`}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                  {post.category.replace('_', ' ')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold border ${
                    post.wordCount <= MAX_BLOG_POST_WORDS
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {post.wordCount} words
                </span>
                <span className="text-slate-500">
                  {post.recommendedExerciseIds?.length || 0} linked exercises
                </span>
                {post.isCustom && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold">
                    Custom
                  </span>
                )}
                {post.hasOverride && !post.isCustom && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                    Edited
                  </span>
                )}
                {post.isDisabled && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-white truncate">{post.title}</p>
              <p className="text-xs text-slate-400 line-clamp-1">{post.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(post)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-xs font-semibold text-slate-200 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  adminToggleBlogDisabled(post.id);
                  onFlash?.(post.isDisabled ? 'Article restored to /blog' : 'Article hidden from public');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1"
              >
                {post.isDisabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Restore</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hide</span>
                  </>
                )}
              </button>
              {post.hasOverride && !post.isCustom && (
                <button
                  onClick={() => {
                    adminResetBlogOverride(post.id);
                    onFlash?.('Restored original editorial text');
                  }}
                  title="Reset editorial override"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 text-cyan-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              {post.isCustom && (
                <button
                  onClick={() => {
                    adminDeleteCustomBlogPost(post.id);
                    onFlash?.('Custom article deleted', 'warning');
                  }}
                  title="Delete custom post"
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length > pageLimit && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPageLimit((p) => p + 30)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/15 text-xs font-bold text-amber-300 transition"
          >
            Load More ({filteredPosts.length - pageLimit} remaining)
          </button>
        </div>
      )}

      {/* Create / Edit Post Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-3xl bg-obsidian-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-4">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {form.id ? 'Edit Health Guide Article' : 'Create New Health & Fitness Post'}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    isOverWordLimit
                      ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                      : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                  }`}
                >
                  {draftWordCount} / {MAX_BLOG_POST_WORDS} words
                </span>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              {isOverWordLimit && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    FitArc articles are strictly capped at {MAX_BLOG_POST_WORDS} total words for rapid beginner reading. Trim {draftWordCount - MAX_BLOG_POST_WORDS} words before saving.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Why a 10-Min Walk Lowers Blood Sugar"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Health Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">1-Line Summary *</label>
                <input
                  type="text"
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Crisp beginner takeaway in one clear sentence..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Article Body (Why it happens + Practical guidance) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Write two crisp, practical paragraphs..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    What Foods To Consume (1 item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={form.foodsText}
                    onChange={(e) => setForm({ ...form, foodsText: e.target.value })}
                    placeholder={'1 bowl cucumber salad before lunch\nMoong dal + paneer protein anchor'}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    What To Do From Home (1 step per line)
                  </label>
                  <textarea
                    rows={3}
                    value={form.checklistText}
                    onChange={(e) => setForm({ ...form, checklistText: e.target.value })}
                    placeholder={'Walk briskly 10 minutes post dinner\nPractice Box Breathing before bed'}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Linked 1-Click Recommended Exercises */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>1-Click Recommended Exercises (max 4 · selected: {form.recommendedExerciseIds.length})</span>
                  </label>
                  <input
                    type="text"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    placeholder="Filter exercises to link..."
                    className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-[11px] text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {filteredExerciseChoices.map((ex) => {
                    const selected = form.recommendedExerciseIds.includes(ex.id);
                    return (
                      <button
                        type="button"
                        key={ex.id}
                        onClick={() => toggleRecommendedEx(ex.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] flex items-center justify-between border transition ${
                          selected
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-bold'
                            : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07]'
                        }`}
                      >
                        <span className="truncate">{ex.name}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tagsText}
                    onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Read Time (mins)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.readTimeMin}
                    onChange={(e) => setForm({ ...form, readTimeMin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOverWordLimit}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-extrabold transition"
                >
                  {form.id ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminBlogModule;
