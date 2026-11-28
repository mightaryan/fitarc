import React from 'react';
import { Settings, Sparkles, Globe, Lock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../../utils/i18n';

export function AdminSettingsModule({ onFlash }) {
  const { siteSettings, adminUpdateSiteSettings, language, setLanguage } = useApp();

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-900 border border-amber-500/25 space-y-5 text-xs">
      <h3 className="text-base font-black text-white flex items-center gap-2">
        <Settings className="w-4 h-4 text-amber-400" />
        Website Branding, Footer Copy, Socials &amp; Security
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Website Brand Name
          </label>
          <input
            type="text"
            value={siteSettings?.brandName || ''}
            onChange={(e) => adminUpdateSiteSettings({ brandName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Brand Tagline
          </label>
          <input
            type="text"
            value={siteSettings?.tagline || ''}
            onChange={(e) => adminUpdateSiteSettings({ tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Top Announcement Banner Text
          </label>
          <input
            type="text"
            value={siteSettings?.announcementText || ''}
            onChange={(e) => adminUpdateSiteSettings({ announcementText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-amber-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Footer Brand Mission Description
          </label>
          <input
            type="text"
            value={siteSettings?.footerDescription || ''}
            onChange={(e) => adminUpdateSiteSettings({ footerDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-200"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-pink-300 font-bold block mb-1">
            Instagram URL (Footer Socials)
          </label>
          <input
            type="url"
            value={siteSettings?.socialLinks?.instagram || ''}
            onChange={(e) => adminUpdateSiteSettings({ socialLinks: { instagram: e.target.value } })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-sky-300 font-bold block mb-1">
            LinkedIn URL (Footer Socials)
          </label>
          <input
            type="url"
            value={siteSettings?.socialLinks?.linkedin || ''}
            onChange={(e) => adminUpdateSiteSettings({ socialLinks: { linkedin: e.target.value } })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-rose-300 font-bold block mb-1">
            YouTube URL (Footer Socials)
          </label>
          <input
            type="url"
            value={siteSettings?.socialLinks?.youtube || ''}
            onChange={(e) => adminUpdateSiteSettings({ socialLinks: { youtube: e.target.value } })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block mb-1">
            Admin Portal Passcode
          </label>
          <input
            type="text"
            value={siteSettings?.adminPasscode || ''}
            onChange={(e) => adminUpdateSiteSettings({ adminPasscode: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-amber-200 font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-sky-300 font-bold block mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Default Platform Language (Multilingual)
          </label>
          <select
            value={siteSettings?.defaultLanguage || language || 'en'}
            onChange={(e) => {
              adminUpdateSiteSettings({ defaultLanguage: e.target.value });
              setLanguage?.(e.target.value);
              onFlash(`Switched platform & preview language to ${e.target.value.toUpperCase()}`);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white font-bold"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-obsidian-950 text-white">
                {lang.flag} {lang.native} ({lang.label})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-rose-300 font-bold block mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Advanced Workouts Lock (Free Users)
          </label>
          <button
            type="button"
            onClick={() => {
              const nextLock = siteSettings?.lockAdvancedForFreeUsers === false;
              adminUpdateSiteSettings({ lockAdvancedForFreeUsers: nextLock });
              onFlash(`Advanced Workout Lock for Free Users -> ${nextLock ? 'LOCKED (Paid Only)' : 'UNLOCKED FOR ALL'}`);
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-left font-bold flex items-center justify-between transition ${
              siteSettings?.lockAdvancedForFreeUsers !== false
                ? 'bg-amber-500/15 border-amber-500/35 text-amber-200'
                : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
            }`}
          >
            <span>
              {siteSettings?.lockAdvancedForFreeUsers !== false
                ? 'Locked for Free Users (Upgrade Prompt Active)'
                : 'Unlocked Globally for All Users'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/50">
              {siteSettings?.lockAdvancedForFreeUsers !== false ? 'LOCKED' : 'OPEN'}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={() => onFlash('All Site Branding, Social URLs & Passcode synced live!')}
          className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Save &amp; Sync Live Config</span>
        </button>
      </div>
    </div>
  );
}
