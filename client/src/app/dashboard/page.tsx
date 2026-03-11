import React from 'react';
import { LayoutDashboard, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Creator Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back. Here is your unified analytics summary.</p>
        </div>

        {/* Bento Box Stats Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-slate-400 font-medium">Total Audience</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-slate-400 font-medium">Engagement Rate</h3>
            </div>
            <p className="text-3xl font-bold">0%</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-slate-400 font-medium">Connected Platforms</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

        </div>

      </div>
    </div>
  );
}
