import React, { useState } from 'react';
import { DollarSign, Award, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export function AdminPaymentsModule({ onFlash }) {
  const {
    profilesVault,
    siteSettings,
    paymentTransactions,
    adminUpdateSiteSettings,
    adminUpdateTransactionStatus,
    adminRecordManualPayment,
    adminDeleteTransaction,
  } = useApp();

  const usersList = Object.entries(profilesVault || {}).map(([id, e]) => ({ id, ...e.profile }));

  const [manualPayForm, setManualPayForm] = useState({
    userId: usersList[0]?.id || 'user_alex',
    itemName: 'Manual Gold Elite Upgrade',
    tierGranted: 'Gold Elite Pro',
    amountINR: '2499',
    method: 'Admin Direct Grant',
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-amber-500/25 space-y-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Payment Gateway &amp; Promo Settings
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Provider</label>
              <input
                type="text"
                value={siteSettings?.paymentGateway?.provider || ''}
                onChange={(e) => adminUpdateSiteSettings({ paymentGateway: { provider: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Merchant UPI ID</label>
              <input
                type="text"
                value={siteSettings?.paymentGateway?.upiId || ''}
                onChange={(e) => adminUpdateSiteSettings({ paymentGateway: { upiId: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Active Promo Code</label>
              <input
                type="text"
                value={siteSettings?.paymentGateway?.promoCode || ''}
                onChange={(e) =>
                  adminUpdateSiteSettings({ paymentGateway: { promoCode: e.target.value.toUpperCase() } })
                }
                className="w-full px-3 py-2 rounded-xl glass-input text-amber-300 font-mono uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Promo Discount (%)</label>
              <input
                type="number"
                value={siteSettings?.paymentGateway?.promoDiscountPercent ?? 20}
                onChange={(e) =>
                  adminUpdateSiteSettings({
                    paymentGateway: { promoDiscountPercent: Number(e.target.value) || 0 },
                  })
                }
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const matched = usersList.find((u) => u.id === manualPayForm.userId);
            adminRecordManualPayment({
              ...manualPayForm,
              userName: matched?.name || 'Athlete',
              userEmail: matched?.email || '',
            });
            onFlash(`Recorded ₹${manualPayForm.amountINR} invoice & granted ${manualPayForm.tierGranted}!`);
          }}
          className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3"
        >
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Record Manual Payment / Comp Grant
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <select
              value={manualPayForm.userId}
              onChange={(e) => setManualPayForm({ ...manualPayForm, userId: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              {usersList.map((u) => (
                <option className="bg-obsidian-900" key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount INR"
              value={manualPayForm.amountINR}
              onChange={(e) => setManualPayForm({ ...manualPayForm, amountINR: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="text"
              placeholder="Plan / Item Description"
              value={manualPayForm.itemName}
              onChange={(e) => setManualPayForm({ ...manualPayForm, itemName: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={manualPayForm.tierGranted}
              onChange={(e) => setManualPayForm({ ...manualPayForm, tierGranted: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-amber-300"
            >
              <option className="bg-obsidian-900" value="Pro Athlete">Pro Athlete</option>
              <option className="bg-obsidian-900" value="Gold Elite Pro">Gold Elite Pro</option>
            </select>
          </div>
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black">
            Record Payment &amp; Grant Tier
          </button>
        </form>
      </div>

      {/* Invoice Ledger */}
      <div className="space-y-2.5">
        {(paymentTransactions || []).map((trx) => (
          <div
            key={trx.id}
            className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400">{trx.id}</span>
                <span className="text-slate-500">· {trx.createdAt}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    trx.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : trx.status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {trx.status}
                </span>
              </div>
              <div className="font-extrabold text-white">
                {trx.userName} — {trx.itemName}
              </div>
              <div className="text-[11px] text-slate-400">
                Method: {trx.method} · Tier: {trx.tierGranted}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-base font-black text-white mr-2">
                ₹{Number(trx.amountINR).toLocaleString('en-IN')}
              </span>
              {trx.status !== 'Completed' && (
                <button
                  onClick={() => {
                    adminUpdateTransactionStatus(trx.id, 'Completed');
                    onFlash(`Approved ${trx.id} and activated ${trx.tierGranted}!`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-bold hover:bg-emerald-500/30"
                >
                  Approve
                </button>
              )}
              {trx.status === 'Completed' && (
                <button
                  onClick={() => {
                    adminUpdateTransactionStatus(trx.id, 'Refunded');
                    onFlash(`Marked ${trx.id} as Refunded`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold"
                >
                  Refund
                </button>
              )}
              <button
                onClick={() => {
                  adminDeleteTransaction(trx.id);
                  onFlash(`Deleted invoice ${trx.id}`);
                }}
                className="p-2 rounded-xl bg-rose-500/15 text-rose-300"
                title="Delete transaction"
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
