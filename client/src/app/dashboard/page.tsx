"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Loader2, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  // State to hold the user's data and the loading status
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the profile data. The browser automatically sends the HttpOnly cookie!
        const response = await fetch('/api/users/me', {
          method: 'GET',
          // 'include' ensures the cookie is sent along with the request
          credentials: 'include', 
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // If successful, save the user data to state
          setUser(data.user);
        } else {
          // If the token is missing or expired, kick them to the login page
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Show a clean loading state while verifying the token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // If there's no user and it's not loading, return null (it will redirect instantly)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Creator Overview</h1>
            <p className="text-slate-400 mt-1">
              Welcome back, <span className="text-indigo-400 font-semibold">{user.firstName} {user.lastName}</span>! Here is your unified analytics summary.
            </p>
          </div>
          
          {/* Placeholder for future logout button */}
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Bento Box Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-slate-400 font-medium">Total Audience</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-slate-400 font-medium">Engagement Rate</h3>
            </div>
            <p className="text-3xl font-bold">0%</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
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
