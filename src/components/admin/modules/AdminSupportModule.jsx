import React, { useState } from 'react';
import {
  LifeBuoy,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Send,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export function AdminSupportModule({ onFlash }) {
  const {
    supportTickets,
    adminReplySupportTicket,
    adminUpdateTicketStatus,
    adminDeleteSupportTicket,
    siteSettings,
    adminUpdateSiteSettings,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [replyDrafts, setReplyDrafts] = useState({});

  const visibleTickets = (supportTickets || []).filter(
    (tk) => statusFilter === 'All' || tk.status === statusFilter
  );

  const openCount = (supportTickets || []).filter((tk) => tk.status === 'Open').length;
  const resolvedCount = (supportTickets || []).filter((tk) => tk.status === 'Resolved').length;

  return (
    <div className="space-y-5 text-xs">
      {/* Support Contact Channel Settings */}
      <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-amber-500/25 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            Vault Support Channel Details
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
              {openCount} Open
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              {resolvedCount} Resolved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" /> Support Email
            </label>
            <input
              type="email"
              value={siteSettings?.supportEmail || 'support@fitarc.app'}
              onChange={(e) => adminUpdateSiteSettings({ supportEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" /> WhatsApp Support
            </label>
            <input
              type="text"
              value={siteSettings?.supportWhatsapp || '+91 98765 43210'}
              onChange={(e) => adminUpdateSiteSettings({ supportWhatsapp: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" /> Active Support Hours
            </label>
            <input
              type="text"
              value={siteSettings?.supportHours || 'Mon–Sat · 9:00 AM – 8:00 PM IST'}
              onChange={(e) => adminUpdateSiteSettings({ supportHours: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition ${
              statusFilter === st
                ? 'bg-amber-500 text-black border-amber-300'
                : 'bg-obsidian-900 text-slate-300 border-white/10 hover:border-amber-400/40'
            }`}
          >
            {st} ({st === 'All' ? supportTickets?.length || 0 : (supportTickets || []).filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {visibleTickets.map((tk) => {
          const draft = replyDrafts[tk.id] ?? tk.adminReply ?? '';
          return (
            <div
              key={tk.id}
              className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-amber-400">{tk.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold">
                      {tk.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tk.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                          : tk.status === 'In Progress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/35'
                      }`}
                    >
                      {tk.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-1">{tk.subject}</h4>
                  <p className="text-[11px] text-slate-400">
                    From <strong className="text-slate-200">{tk.userName}</strong> ({tk.userEmail}) · {tk.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={tk.status}
                    onChange={(e) => {
                      adminUpdateTicketStatus(tk.id, e.target.value);
                      onFlash(`Ticket ${tk.id} status set to ${e.target.value}`);
                    }}
                    className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] font-bold text-slate-200"
                  >
                    <option className="bg-obsidian-900" value="Open">Open</option>
                    <option className="bg-obsidian-900" value="In Progress">In Progress</option>
                    <option className="bg-obsidian-900" value="Resolved">Resolved</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      adminDeleteSupportTicket(tk.id);
                      onFlash(`Deleted support ticket ${tk.id}`);
                    }}
                    className="p-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-slate-200 leading-relaxed">
                {tk.message}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Write official reply shown inside athlete Vault -> Help & Support..."
                  value={draft}
                  onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [tk.id]: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!draft.trim()) return;
                    adminReplySupportTicket(tk.id, draft.trim(), 'Resolved');
                    onFlash(`Replied to ${tk.id} and marked Resolved`);
                  }}
                  className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply &amp; Resolve</span>
                </button>
              </div>
              {tk.adminReply && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Last Reply ({tk.updatedAt}): {tk.adminReply}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
