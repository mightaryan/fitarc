import React, { useState } from 'react';
import {
  Globe,
  Search,
  Share2,
  Code2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { INITIAL_SEO_SETTINGS } from '../../../data/adminDefaults';

const SEO_PAGE_TABS = [
  { id: 'home', label: 'Home (/)' },
  { id: 'fitness', label: 'Fitness (/fitness)' },
  { id: 'food', label: 'Nutrition (/food)' },
  { id: 'shop', label: 'Shop (/shop)' },
  { id: 'dashboard', label: 'Overview (/dashboard)' },
  { id: 'about', label: 'About (/about)' },
  { id: 'admin', label: 'Admin (/admin)' },
];

export function AdminSeoModule({ onFlash }) {
  const { seoSettings, adminUpdateSeoSettings, siteSettings } = useApp();
  const [selectedPage, setSelectedPage] = useState('home');

  const currentSeo = seoSettings?.[selectedPage] || INITIAL_SEO_SETTINGS[selectedPage] || INITIAL_SEO_SETTINGS.home;

  const updateField = (field, value) => {
    adminUpdateSeoSettings(selectedPage, { [field]: value });
  };

  const handleResetPageSeo = () => {
    const def = INITIAL_SEO_SETTINGS[selectedPage];
    if (!def) return;
    adminUpdateSeoSettings(selectedPage, def);
    onFlash(`Restored recommended SEO preset for "${def.pageLabel}".`);
  };

  const handleApplyBestPracticeBoost = () => {
    const brand = siteSettings?.brandName || 'FITARC';
    const def = INITIAL_SEO_SETTINGS[selectedPage] || {};
    adminUpdateSeoSettings(selectedPage, {
      title: `${def.title?.split('|')[0]?.trim() || def.pageLabel} | ${brand}`,
      robots: selectedPage === 'admin' ? 'noindex, nofollow' : 'index, follow',
    });
    onFlash(`Applied ${brand} branded SEO optimization to /${selectedPage === 'home' ? '' : selectedPage}!`);
  };

  const titleLen = (currentSeo.title || '').length;
  const descLen = (currentSeo.description || '').length;

  return (
    <div className="space-y-6 text-xs">
      {/* Page Selector Pills */}
      <div className="p-5 rounded-3xl bg-obsidian-900 border border-amber-500/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Per-Page SEO, Meta Tags, OpenGraph &amp; Schema Studio
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every update injects live into <code>document.title</code>, meta tags, canonical links &amp; JSON-LD structured data on each route.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyBestPracticeBoost}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Brand Auto-Optimize
            </button>
            <button
              type="button"
              onClick={handleResetPageSeo}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Page SEO
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEO_PAGE_TABS.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setSelectedPage(page.id)}
              className={`px-3.5 py-2 rounded-xl border font-bold transition ${
                selectedPage === page.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-300'
                  : 'bg-black/45 text-slate-300 border-white/10 hover:border-amber-400/50'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Editable Meta Inputs */}
        <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-white text-sm">
              Meta Controls — {currentSeo.pageLabel || selectedPage}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synced Live
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Meta Title Tag</span>
              <span className={titleLen > 70 ? 'text-rose-400' : 'text-emerald-400'}>{titleLen} / 65 chars</span>
            </div>
            <input
              type="text"
              value={currentSeo.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-white font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Meta Description</span>
              <span className={descLen > 175 ? 'text-rose-400' : 'text-emerald-400'}>{descLen} / 160 chars</span>
            </div>
            <textarea
              rows={3}
              value={currentSeo.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-200"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Target Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={currentSeo.keywords || ''}
              onChange={(e) => updateField('keywords', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Canonical Path
              </label>
              <input
                type="text"
                value={currentSeo.canonicalPath || '/'}
                onChange={(e) => updateField('canonicalPath', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-amber-300 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Robots Indexing
              </label>
              <select
                value={currentSeo.robots || 'index, follow'}
                onChange={(e) => updateField('robots', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              >
                <option className="bg-obsidian-900" value="index, follow">index, follow</option>
                <option className="bg-obsidian-900" value="noindex, follow">noindex, follow</option>
                <option className="bg-obsidian-900" value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                JSON-LD Schema
              </label>
              <select
                value={currentSeo.schemaType || 'WebPage'}
                onChange={(e) => updateField('schemaType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              >
                <option className="bg-obsidian-900" value="WebApplication">WebApplication</option>
                <option className="bg-obsidian-900" value="Store">Store</option>
                <option className="bg-obsidian-900" value="ExerciseGym">ExerciseGym</option>
                <option className="bg-obsidian-900" value="AboutPage">AboutPage</option>
                <option className="bg-obsidian-900" value="WebPage">WebPage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                OpenGraph Share Title
              </label>
              <input
                type="text"
                value={currentSeo.ogTitle || ''}
                onChange={(e) => updateField('ogTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                OpenGraph Image Path / URL
              </label>
              <input
                type="text"
                value={currentSeo.ogImage || ''}
                onChange={(e) => updateField('ogImage', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-200 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              OpenGraph Description
            </label>
            <input
              type="text"
              value={currentSeo.ogDescription || ''}
              onChange={(e) => updateField('ogDescription', e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-slate-200"
            />
          </div>
        </div>

        {/* Right: Live Search SERP & Social Card Previews */}
        <div className="space-y-4">
          {/* Google SERP Preview */}
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Live Google SERP Preview
            </span>
            <div className="p-4 rounded-2xl bg-[#161922] border border-white/10 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-mono">
                https://fitarc.app{currentSeo.canonicalPath || '/'}
              </div>
              <div className="text-base font-bold text-sky-400 leading-snug">
                {currentSeo.title || 'Page Title'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentSeo.description || 'Meta description preview appears here.'}
              </p>
            </div>
          </div>

          {/* OpenGraph Social Card Preview */}
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> WhatsApp / LinkedIn / X Card Preview
            </span>
            <div className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center gap-3 p-3">
              <img
                src={currentSeo.ogImage || '/icons/icon-192.png'}
                alt="OG Preview"
                className="w-16 h-16 rounded-xl object-cover bg-obsidian-850 border border-amber-500/25 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  {siteSettings?.brandName || 'FITARC'} · {currentSeo.robots}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentSeo.ogTitle || currentSeo.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {currentSeo.ogDescription || currentSeo.description}
                </div>
              </div>
            </div>
          </div>

          {/* JSON-LD Structured Schema Preview */}
          <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Dynamic JSON-LD Schema ({currentSeo.schemaType})
            </span>
            <pre className="p-3 rounded-xl bg-black/70 border border-white/10 text-[10px] text-emerald-300 font-mono overflow-x-auto">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': currentSeo.schemaType || 'WebPage',
    name: currentSeo.ogTitle || currentSeo.title,
    url: `https://fitarc.app${currentSeo.canonicalPath || '/'}`,
    offers: { '@type': 'Offer', price: '99', priceCurrency: 'INR' },
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminSeoModule;
