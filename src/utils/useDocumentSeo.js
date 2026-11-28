import { useEffect } from 'react';

function upsertMeta(attrName, attrValue, content) {
  if (typeof document === 'undefined' || !content) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined' || !href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useDocumentSeo(pageKey = 'home', seoSettings = {}, siteSettings = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const brandName = siteSettings?.brandName || 'FITARC';
    const pageSeo = seoSettings?.[pageKey] || seoSettings?.home || {};

    const title = pageSeo.title || `${brandName} — Precision Fitness, 30-Min HIIT & Nutrition`;
    const description =
      pageSeo.description ||
      siteSettings?.footerDescription ||
      'FitArc combines 3D biomechanical exercises, 30-minute HIIT voice coaching, Healthify-grade diet tracking, plans from ₹99, and Trustified™ nutrition.';
    const keywords = pageSeo.keywords || 'fitarc, hiit workout, body part workouts, ai nutrition, trustified whey protein';
    const robots = pageSeo.robots || 'index, follow';
    const canonicalUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${pageSeo.canonicalPath || '/'}`
        : pageSeo.canonicalPath || '/';

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', brandName);
    upsertMeta('property', 'og:title', pageSeo.ogTitle || title);
    upsertMeta('property', 'og:description', pageSeo.ogDescription || description);
    upsertMeta('property', 'og:url', canonicalUrl);
    if (pageSeo.ogImage) {
      upsertMeta('property', 'og:image', pageSeo.ogImage);
    }
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageSeo.ogTitle || title);
    upsertMeta('name', 'twitter:description', pageSeo.ogDescription || description);
    upsertLink('canonical', canonicalUrl);

    // Structured Data (JSON-LD)
    let scriptEl = document.getElementById('fitarc-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'fitarc-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': pageSeo.schemaType || 'WebApplication',
      name: pageSeo.ogTitle || title,
      description,
      url: canonicalUrl,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, Android, Web',
      offers: {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'INR',
      },
    });
  }, [pageKey, seoSettings, siteSettings]);
}
