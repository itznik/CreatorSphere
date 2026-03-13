"use client";

import React, { useState } from 'react';
import { X, Instagram, Youtube, Twitter, Send, Loader2 } from 'lucide-react';

const PLATFORMS = [
  { id: 'INSTAGRAM', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'YOUTUBE', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'X', name: 'X (Twitter)', icon: Twitter, color: 'text-sky-400' },
];

export default function ConnectPlatformModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ platformName: 'INSTAGRAM', handle: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/platforms/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, platformId: `manual_${Date.now()}` }),
      });
      if (res.ok) {
        onRefresh(); // Refresh the dashboard data
        onClose();   // Close modal
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Connect Platform</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Select Platform</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, platformName: p.id })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    formData.platformName === p.id 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                  <span className="text-xs text-white font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Account Handle</label>
            <input
              type="text"
              required
              className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none"
              placeholder="@username"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Link Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
