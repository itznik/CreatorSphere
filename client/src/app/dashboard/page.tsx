"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Activity, Loader2, 
  LogOut, Plus, Instagram, Youtube, Twitter, Globe, RefreshCw 
} from 'lucide-react';
import ConnectPlatformModal from '@/components/ConnectPlatformModal';

export default function DashboardPage() {
  const router = useRouter();
  
  // State Management
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(null); // Tracks which ID is syncing

  // Helper to map platform names to icons
  const getPlatformIcon = (name) => {
    switch (name) {
      case 'INSTAGRAM': return <Instagram className="text-pink-500" />;
      case 'YOUTUBE': return <Youtube className="text-red-500" />;
      case 'X': return <Twitter className="text-sky-400" />;
      default: return <Globe className="text-slate-400" />;
    }
  };

  const fetchData = async () => {
    try {
      // 1. Fetch Profile
      const profileRes = await fetch('/api/users/me');
      
      // 2. Fetch Platforms
      const platformRes = await fetch('/api/platforms');

      // Safety check for HTML responses
      const isJson = (res) => res.headers.get("content-type")?.includes("application/json");
      if (!isJson(profileRes) || !isJson(platformRes)) {
        console.error("Backend returned HTML. Check routes.");
        router.push('/login');
        return;
      }

      const profileData = await profileRes.json();
      const platformData = await platformRes.json();
      
      if (profileRes.ok) setUser(profileData.user);
      if (platformRes.ok) setPlatforms(platformData.platforms);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (platformId) => {
    setIsSyncing(platformId);
    try {
      const res = await fetch(`/api/platforms/${platformId}/sync`, {
        method: 'PUT',
      });
      if (res.ok) {
        await fetchData(); // Refresh all data to show updated follower counts
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Calculated Stats
  const totalAudience = platforms.reduce((acc, curr) => acc + (curr.followerCount || 0), 0);
  const linkedAccounts = platforms.length;
  const engagementRate = linkedAccounts > 0 ? "4.2%" : "0.0%";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP NAVIGATION --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              CreatorSphere
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-indigo-400 font-medium">{user?.firstName}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Connect
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* --- STATS OVERVIEW --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Users />} label="Total Audience" value={totalAudience.toLocaleString()} color="indigo" />
          <StatCard icon={<Activity />} label="Avg. Engagement" value={engagementRate} color="emerald" />
          <StatCard icon={<LayoutDashboard />} label="Linked Accounts" value={linkedAccounts} color="blue" />
        </section>

        {/* --- CONNECTED PLATFORMS LIST --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Your Channels
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-normal">
                {platforms.length}
              </span>
            </h2>
          </div>

          {platforms.length === 0 ? (
            <div className="border-2 border-dashed border-slate-800 rounded-3xl p-16 text-center bg-slate-900/20">
              <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                <Plus className="text-slate-500" />
              </div>
              <p className="text-slate-400 mb-2 font-medium">No platforms connected yet.</p>
              <p className="text-slate-600 text-sm mb-6">Link your social media to see unified analytics.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-bold bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20 transition-all"
              >
                Connect First Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => (
                <div 
                  key={platform._id} 
                  className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-3xl hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {getPlatformIcon(platform.platformName)}
                    </div>
                    <button 
                      onClick={() => handleSync(platform._id)}
                      disabled={isSyncing === platform._id}
                      className="p-2 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-slate-500 ${isSyncing === platform._id ? 'animate-spin text-indigo-400' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xl tracking-tight">{platform.handle}</h3>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                      {platform.platformName}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Followers</p>
                      <p className="text-2xl font-mono font-bold text-white">
                        {platform.followerCount?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Status</p>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <ConnectPlatformModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchData} 
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
