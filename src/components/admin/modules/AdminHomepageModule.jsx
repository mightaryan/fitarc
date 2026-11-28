import React from 'react';
import {
  LayoutTemplate,
  Sparkles,
  Image,
  Upload,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FitArcLogo } from '../../common/FitArcLogo';
import { INITIAL_SITE_SETTINGS } from '../../../data/adminDefaults';

const LOGO_STYLES = [
  { id: 'kinetic_arc', label: 'Kinetic Arc Crest' },
  { id: 'crown_shield', label: 'Crown Shield' },
  { id: 'flame_core', label: 'HIIT Flame Core' },
  { id: 'minimal_hex', label: 'Minimal Hex Node' },
  { id: 'custom_url', label: 'Custom Image / Upload' },
];

const HOMEPAGE_SECTION_SWITCHES = [
  { key: 'heroSectionEnabled', label: 'Landing Conversion Hero & ₹99 Metrics' },
  { key: 'bodyPartLauncherEnabled', label: 'Body-Part & Duration Workout Launcher' },
  { key: 'activityRingsEnabled', label: '3-Ring Biometric & Activity Summary' },
  { key: 'healthifySuiteEnabled', label: 'Healthify Water, Steps, Sleep & Coach Bar' },
  { key: 'troubleZoneEnabled', label: '30-Day Trouble Zone Challenges' },
  { key: 'quickLaunchpadEnabled', label: 'Quick 1-Tap Launchpad Shortcuts' },
  { key: 'homeFeaturedEnabled', label: 'Curated Workouts For Today Grid' },
  { key: 'aiPlannerEnabled', label: 'AI Exercise & Custom Plan Architect Card' },
  { key: 'pwaInstallEnabled', label: 'iPhone & Android PWA Install Strip' },
];

export function AdminHomepageModule({ onFlash }) {
  const { siteSettings, adminUpdateSiteSettings } = useApp();

  const handleUploadLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        adminUpdateSiteSettings({
          logoStyle: 'custom_url',
          customLogoUrl: reader.result,
        });
        onFlash('Uploaded custom logo & switched Logo Style to Custom Image!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreHeroDefaults = () => {
    adminUpdateSiteSettings({
      brandName: INITIAL_SITE_SETTINGS.brandName,
      tagline: INITIAL_SITE_SETTINGS.tagline,
      logoStyle: INITIAL_SITE_SETTINGS.logoStyle,
      customLogoUrl: '',
      heroBadge: INITIAL_SITE_SETTINGS.heroBadge,
      heroTitle: INITIAL_SITE_SETTINGS.heroTitle,
      heroHighlight: INITIAL_SITE_SETTINGS.heroHighlight,
      heroSubtitle: INITIAL_SITE_SETTINGS.heroSubtitle,
      heroPrimaryCta: INITIAL_SITE_SETTINGS.heroPrimaryCta,
      heroSecondaryCta: INITIAL_SITE_SETTINGS.heroSecondaryCta,
    });
    onFlash('Restored default FitArc logo & homepage hero copy.');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Brand Name & Customizable Logo Studio */}
      <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-900 border border-amber-500/25 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-amber-400" />
              Brand Name, Logo Style &amp; Custom Emblem Upload
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Changes reflect live in Navbar, Footer, Landing Hero, About Page, and Maintenance screen.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRestoreHeroDefaults}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-amber-300 font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Hero &amp; Logo
          </button>
        </div>

        {/* Live Logo Preview */}
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Live Header Preview
            </span>
            <FitArcLogo
              brandName={siteSettings?.brandName || 'FITARC'}
              tagline={siteSettings?.tagline || ''}
              logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
              customLogoUrl={siteSettings?.customLogoUrl || ''}
              showTagline
              size="lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {LOGO_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  adminUpdateSiteSettings({ logoStyle: st.id });
                  onFlash(`Logo style switched to ${st.label}`);
                }}
                className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition ${
                  (siteSettings?.logoStyle || 'kinetic_arc') === st.id
                    ? 'bg-amber-500 text-black border-amber-300'
                    : 'bg-obsidian-850 text-slate-300 border-white/10 hover:border-amber-400/50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Navbar Brand Tagline
            </label>
            <input
              type="text"
              value={siteSettings?.tagline || ''}
              onChange={(e) => adminUpdateSiteSettings({ tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
            />
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Custom Logo Image URL (HTTPS or Data URL)
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png (auto-switches logo style when pasted)"
                value={siteSettings?.customLogoUrl || ''}
                onChange={(e) =>
                  adminUpdateSiteSettings({
                    customLogoUrl: e.target.value,
                    ...(e.target.value ? { logoStyle: 'custom_url' } : {}),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
              />
            </div>
            <label className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 font-bold hover:bg-amber-500/25 cursor-pointer flex items-center justify-center gap-2 transition">
              <Upload className="w-4 h-4" />
              <span>Upload Logo File</span>
              <input type="file" accept="image/*" onChange={handleUploadLogoFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 2. Landing Hero Copy & CTA Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-900 border border-white/10 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-amber-400" />
          Landing Page Hero Copy &amp; Call-to-Action Buttons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Top Hero Pill Badge
            </label>
            <input
              type="text"
              value={siteSettings?.heroBadge || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-amber-300"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Gold Highlight Text
            </label>
            <input
              type="text"
              value={siteSettings?.heroHighlight || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroHighlight: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-amber-300 font-bold"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Main Hero Headline
            </label>
            <input
              type="text"
              value={siteSettings?.heroTitle || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white font-bold"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Hero Subheadline
            </label>
            <textarea
              rows={2}
              value={siteSettings?.heroSubtitle || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-200"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Primary Button Label
            </label>
            <input
              type="text"
              value={siteSettings?.heroPrimaryCta || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroPrimaryCta: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Secondary Button Label
            </label>
            <input
              type="text"
              value={siteSettings?.heroSecondaryCta || ''}
              onChange={(e) => adminUpdateSiteSettings({ heroSecondaryCta: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Toggle Every Homepage Feature Live */}
      <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-900 border border-white/10 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Customize Every Homepage Feature Module (Live ON/OFF)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HOMEPAGE_SECTION_SWITCHES.map((sw) => {
            const enabled = siteSettings?.[sw.key] !== false;
            return (
              <div
                key={sw.key}
                className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${enabled ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                  <span className="font-semibold text-slate-200 truncate">{sw.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    adminUpdateSiteSettings({ [sw.key]: !enabled });
                    onFlash(`${sw.label} -> ${!enabled ? 'VISIBLE' : 'HIDDEN'}`);
                  }}
                  className={`px-3 py-1 rounded-full font-black text-[10px] border shrink-0 transition ${
                    enabled
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default AdminHomepageModule;
