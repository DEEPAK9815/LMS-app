'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, BarChart, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <span className="flex h-8 w-8 rounded-full bg-indigo-500 animate-pulse"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 sm:p-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="mx-auto max-w-4xl relative z-10">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              Your Profile
            </h1>
            <p className="mt-4 text-zinc-400 text-lg">Manage your learning journey</p>
          </div>
          <button 
            onClick={() => router.push('/subjects')}
            className="group flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
          >
            <BookOpen className="h-4 w-4" />
            Back to Courses
          </button>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {/* User Details */}
          <div className="md:col-span-1 border border-zinc-800 bg-zinc-900/40 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center shadow-lg">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center p-1 mb-6">
              <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-zinc-100">{user.name}</h2>
            <p className="text-sm text-zinc-400 mt-1">{user.email}</p>

            <button
              onClick={handleLogout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* Progress Overview Placeholder */}
          <div className="md:col-span-2 border border-zinc-800 bg-zinc-900/40 rounded-3xl p-8 backdrop-blur-md shadow-lg flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10">
                <BarChart className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Learning Progress</h3>
                <p className="text-sm text-zinc-400">Your recent activity</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50">
              <p className="text-zinc-500 mb-4">No recent activity detected.</p>
              <button 
                onClick={() => router.push('/subjects')}
                className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
              >
                Start your first course →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
