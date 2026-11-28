import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share,
  PlusSquare,
  X,
  Apple,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PWA_INSTALLED_KEY = 'FITARC_PWA_INSTALLED';

function detectIsAppInstalled() {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(PWA_INSTALLED_KEY) === '1') return true;
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true;
    return standalone;
  } catch (e) {
    return false;
  }
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(() =>
    typeof window !== 'undefined' ? window.__fitarcInstallPrompt || null : null
  );
  const [isInstalled, setIsInstalled] = useState(() => detectIsAppInstalled());
  const [platform, setPlatform] = useState('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');
    setIsInstalled(detectIsAppInstalled());

    const handleReady = () => setDeferredPrompt(window.__fitarcInstallPrompt || null);
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.__fitarcInstallPrompt = e;
      setDeferredPrompt(e);
    };
    const handleInstalled = () => {
      try {
        localStorage.setItem(PWA_INSTALLED_KEY, '1');
      } catch (e) {}
      setIsInstalled(true);
      window.__fitarcInstallPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('fitarc:pwa-installable', handleReady);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('fitarc:pwa-installable', handleReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    const promptEvt = deferredPrompt || (typeof window !== 'undefined' ? window.__fitarcInstallPrompt : null);
    if (!promptEvt) return { outcome: 'manual' };
    try {
      await promptEvt.prompt();
      const choice = await promptEvt.userChoice;
      if (choice?.outcome === 'accepted') {
        try {
          localStorage.setItem(PWA_INSTALLED_KEY, '1');
        } catch (e) {}
        setIsInstalled(true);
        window.__fitarcInstallPrompt = null;
        setDeferredPrompt(null);
      }
      return choice;
    } catch (e) {
      return { outcome: 'error' };
    }
  };

  const markAsInstalled = () => {
    try {
      localStorage.setItem(PWA_INSTALLED_KEY, '1');
    } catch (e) {}
    setIsInstalled(true);
  };

  return { deferredPrompt, isInstalled, platform, triggerInstall, markAsInstalled };
}

export function PwaInstallPrompt({ compact = false }) {
  const { siteSettings } = useApp();
  const { deferredPrompt, isInstalled, platform, triggerInstall, markAsInstalled } = usePwaInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Strictly visible ONLY to users who have NOT installed this app yet
  if (isInstalled || siteSettings?.pwaInstallEnabled === false) return null;

  const appName = siteSettings?.brandName || 'FITARC';

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const res = await triggerInstall();
      if (res?.outcome === 'accepted') return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{platform === 'ios' ? 'Add iPhone Shortcut' : 'Install Mobile App'}</span>
        </button>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-obsidian-850 via-[#10141c] to-amber-950/20 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center shrink-0 shadow-gold-glow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Not Installed Yet
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Works Offline
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                Install {appName} App on iPhone or Android
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add to your Home Screen for one-tap fullscreen workouts &amp; voice timer access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallClick}
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-gold-glow-sm active:scale-95 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{deferredPrompt ? 'Install App Now' : 'Get Phone Shortcut'}</span>
          </button>
        </div>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 p-6 space-y-5 text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Home Screen App Shortcut
                  </span>
                  <h4 className="text-base font-black text-white">Install {appName}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-amber-300" />
                  <span>iPhone / iPad (Safari)</span>
                </div>
                <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>Open in <strong>Safari</strong>.</li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>Tap</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">
                      <Share className="w-3 h-3" /> Share
                    </span>
                    <span>at the bottom.</span>
                  </li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>Choose</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      <PlusSquare className="w-3 h-3" /> Add to Home Screen
                    </span>
                    <span>→ <strong>Add</strong>.</span>
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Android (Chrome / Edge)</span>
                </div>
                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={triggerInstall}
                    className="gold-btn w-full py-2.5 rounded-xl font-black text-xs"
                  >
                    Tap to Install App
                  </button>
                ) : (
                  <p className="text-slate-300 leading-relaxed">
                    Tap Chrome menu (<strong>⋮</strong>) → <strong className="text-white">Install app</strong>.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  markAsInstalled();
                  setShowGuideModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 transition"
              >
                Already Installed
              </button>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default PwaInstallPrompt;
