"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  return (
    <nav className="glass-morphism sticky top-0 z-50 py-4 mb-8">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <BookOpen size={24} />
          </div>
          LumosLMS
        </Link>

        <div className="flex gap-8 items-center text-slate-400 font-medium">
          <Link href="/" className="text-slate-100 hover:text-primary transition-colors">Courses</Link>
          <Link href="/my-learning" className="hover:text-primary transition-colors">My Learning</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-slate-300">Hello, {user?.name}</span>
               <button onClick={clearAuth} className="hover:text-red-400 p-2 transition-colors">
                 <LogOut size={20} />
               </button>
            </div>
          ) : (
            <Link href="/auth/login" className="bg-primary hover:bg-primary-hover px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary-glow">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
