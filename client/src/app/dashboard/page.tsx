"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Activity, Loader2, 
  LogOut, Plus, Instagram, Youtube, Twitter, Globe 
} from 'lucide-react';
import ConnectPlatformModal from '../../components/ConnectPlatformModal';

export default function DashboardPage() {
  const router = useRouter();
  
  // State Management
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const profileData = await profileRes.json();
      
      if (!profileRes.ok) throw new Error("Auth failed");
      setUser(profileData.user);

      // 2. Fetch Platforms
      const platformRes = await fetch('/api/platforms');
      const platformData = await platformRes.json();
      if (platformRes.ok) setPlatforms(platformData.platforms);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CreatorSphere</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-white font-medium">{user?.firstName}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Connect
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* --- STATS OVERVIEW --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Users />} label="Total Audience" value={platforms.reduce((acc, curr) => acc + (curr.followerCount || 0), 0).toLocaleString()} color="indigo" />
          <StatCard icon={<Activity />} label="Avg. Engagement" value="0.0%" color="emerald" />
          <StatCard icon={<LayoutDashboard />} label="Linked Accounts" value={platforms.length} color="blue" />
        </section>

        {/* --- CONNECTED PLATFORMS LIST --- */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Your Channels
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-normal">
              {platforms.length}
            </span>
          </h2>

          {platforms.length === 0 ? (
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-500 mb-4">No platforms connected yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-bold underline"
              >
                Connect your first account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div 
                  key={platform._id} 
                  className="group bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-950 rounded-lg">
                      {getPlatformIcon(platform.platformName)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      ID: {platform.platformId.split('_')[0]}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{platform.handle}</h3>
                  <p className="text-slate-400 text-sm">{platform.platformName.toLowerCase()}</p>
                  
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <span className="text-xs text-slate-500">Synced: Just now</span>
                    <span className="text-sm font-mono text-indigo-400 font-bold">{platform.followerCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal Component */}
        <ConnectPlatformModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchData} 
        />
      </div>
    </div>
  );
}

// Sub-component for clean code
function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-2.5 rounded-lg ${colors[color]}`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
