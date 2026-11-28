import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, RefreshCw, Link2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SHOP_CATEGORIES } from '../../../data/trustifiedShopCatalog';
import {
  crawlMarketplaceNutritionCatalog,
  parseMarketplaceProductUrl,
} from '../../../utils/marketplaceCrawler';

export function AdminShopModule({ onFlash }) {
  const {
    shopProducts,
    adminUpsertShopItem,
    adminDeleteShopItem,
    adminBulkImportShopItems,
  } = useApp();

  const [editingItem, setEditingItem] = useState(null);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawlQuery, setCrawlQuery] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  const handleImportUrl = (e) => {
    e.preventDefault();
    const parsed = parseMarketplaceProductUrl(crawlUrl);
    if (!parsed) {
      onFlash('Enter a valid https://amazon.in or https://flipkart.com product URL');
      return;
    }
    setEditingItem({
      ...parsed,
      flavor: '1 kg / Pack',
      priceINR: 2199,
      mrpINR: 2799,
      proteinPerServing: 24,
      carbsPerServing: 4,
      fatPerServing: 1.5,
      fiberPerServing: 1,
      servingSizeGrams: 35,
      caloriesPerServing: 130,
      sugarPerServing: 0,
      trustifiedStatus: 'batch_check',
      inStock: true,
    });
    setCrawlUrl('');
    onFlash('Parsed marketplace URL into editor! Review nutrition & save.');
  };

  const handleBulkCrawl = async () => {
    setIsCrawling(true);
    const res = await crawlMarketplaceNutritionCatalog(crawlQuery || 'whey protein bar muesli', 'all');
    setIsCrawling(false);
    if (res.items.length > 0) {
      adminBulkImportShopItems(res.items);
      onFlash(`Crawled & imported ${res.items.length} products into live Shop catalog!`);
    } else {
      onFlash('Open Food Facts feed unreachable offline — curated Trustified™ catalog remains live.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    adminUpsertShopItem(editingItem);
    onFlash(`Saved "${editingItem.name}" live to Magazine Shop!`);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-white">
          Magazine Shop Inventory ({(shopProducts || []).length} SKUs)
        </h3>
        <button
          onClick={() =>
            setEditingItem({
              name: '',
              brand: '',
              category: 'whey_protein',
              flavor: '1 kg',
              imageUrl: '',
              priceINR: 2199,
              mrpINR: 2799,
              proteinPerServing: 26,
              carbsPerServing: 3,
              fatPerServing: 1.5,
              fiberPerServing: 0.5,
              servingSizeGrams: 35,
              caloriesPerServing: 130,
              sugarPerServing: 0,
              trustifiedStatus: 'certified',
              amazonUrl: 'https://www.amazon.in/s?k=Trustified+Whey+Protein',
              flipkartUrl: 'https://www.flipkart.com/search?q=Trustified+Whey+Protein',
              inStock: true,
            })
          }
          className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop Product</span>
        </button>
      </div>

      {/* Marketplace URL Parser & Feed Crawler */}
      <div className="p-4 rounded-2xl bg-obsidian-900 border border-emerald-500/25 grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
        <form onSubmit={handleImportUrl} className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="Paste Amazon.in or Flipkart product URL to parse..."
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold hover:bg-emerald-500/30 shrink-0"
          >
            Parse URL
          </button>
        </form>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Crawl query (e.g. Isolate Whey, Protein Oats)"
            value={crawlQuery}
            onChange={(e) => setCrawlQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl glass-input text-white"
          />
          <button
            type="button"
            onClick={handleBulkCrawl}
            disabled={isCrawling}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Import Feed'}</span>
          </button>
        </div>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-obsidian-900 border border-emerald-400/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-300 uppercase">
              {editingItem.id ? `Edit SKU: ${editingItem.name}` : 'Create New Shop SKU'}
            </span>
            <button type="button" onClick={() => setEditingItem(null)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              required
              type="text"
              placeholder="Product Name"
              value={editingItem.name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="sm:col-span-2 px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              required
              type="text"
              placeholder="Brand Name"
              value={editingItem.brand || ''}
              onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingItem.category || 'whey_protein'}
              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              {SHOP_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option className="bg-obsidian-900" key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price INR"
              value={editingItem.priceINR ?? 1999}
              onChange={(e) => setEditingItem({ ...editingItem, priceINR: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={editingItem.proteinPerServing ?? 24}
              onChange={(e) => setEditingItem({ ...editingItem, proteinPerServing: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Calories (kcal)"
              value={editingItem.caloriesPerServing ?? 130}
              onChange={(e) => setEditingItem({ ...editingItem, caloriesPerServing: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingItem.trustifiedStatus || 'certified'}
              onChange={(e) => setEditingItem({ ...editingItem, trustifiedStatus: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="certified">Trustified™ Certified Pass</option>
              <option className="bg-obsidian-900" value="batch_check">Check Batch on Trustified.in</option>
            </select>
            <input
              type="text"
              placeholder="Product Image URL"
              value={editingItem.imageUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              className="sm:col-span-2 px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="text"
              placeholder="Amazon URL"
              value={editingItem.amazonUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, amazonUrl: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="text"
              placeholder="Flipkart URL"
              value={editingItem.flipkartUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, flipkartUrl: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" /> Save Product SKU
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(shopProducts || []).map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={p.imageUrl || p.fallbackImage || '/shop/whey.svg'}
                alt={p.name}
                onError={(e) => {
                  e.currentTarget.src = p.fallbackImage || '/shop/whey.svg';
                }}
                className="w-12 h-12 rounded-xl object-cover bg-black shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-400">
                  {p.brand} · {p.proteinPerServing}g protein
                </span>
                <h4 className="font-bold text-white truncate">{p.name}</h4>
                <span className="text-[11px] text-slate-400">₹{p.priceINR}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setEditingItem(p)}
                className="p-2 rounded-xl bg-white/5 text-amber-300"
                title="Edit product"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  adminUpsertShopItem({ ...p, inStock: p.inStock === false });
                  onFlash(`${p.name} -> ${p.inStock === false ? 'Live' : 'Hidden'}`);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  p.inStock !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {p.inStock !== false ? 'Live' : 'Hidden'}
              </button>
              <button
                onClick={() => {
                  adminDeleteShopItem(p.id);
                  onFlash(`Deleted product "${p.name}"`);
                }}
                className="p-2 rounded-xl bg-rose-500/15 text-rose-300"
                title="Delete product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
