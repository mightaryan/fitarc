import { useState, useEffect } from 'react';

const TAB_TO_PATH = {
  home: '/',
  fitness: '/fitness',
  food: '/food',
  shop: '/shop',
  blog: '/blog',
  dashboard: '/dashboard',
  about: '/about',
};

export function getCurrentPathname() {
  if (typeof window === 'undefined') return '/';
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  return window.location.pathname || '/';
}

export function isAdminPathname(pathname = '/') {
  const clean = (pathname || '/').toLowerCase();
  return clean === '/admin' || clean.startsWith('/admin/');
}

export function getTabFromPathname(pathname = '/') {
  const clean = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/admin' || clean.startsWith('/admin/')) return 'admin';
  if (clean === '/fitness' || clean.startsWith('/fitness/')) return 'fitness';
  if (clean === '/food' || clean.startsWith('/food/')) return 'food';
  if (clean === '/shop' || clean.startsWith('/shop/')) return 'shop';
  if (clean === '/blog' || clean.startsWith('/blog/')) return 'blog';
  if (clean === '/dashboard' || clean.startsWith('/dashboard/')) return 'dashboard';
  if (clean === '/about' || clean.startsWith('/about/')) return 'about';
  return 'home';
}

export function getPathnameForTab(tab = 'home') {
  return TAB_TO_PATH[tab] || '/';
}

export function navigateTo(path = '/') {
  if (typeof window === 'undefined') return;
  const target = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname === target && !window.location.hash) return;
  window.history.pushState({}, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoutePath() {
  const [pathname, setPathname] = useState(() => getCurrentPathname());

  useEffect(() => {
    const sync = () => setPathname(getCurrentPathname());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  return pathname;
}
