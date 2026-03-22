"use client";
import Link from "next/link";
import { Clock, Star, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Course {
  id: number;
  title: string;
  instructor?: string;
  category?: string;
  thumbnail_url?: string;
  is_published?: boolean;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-dark-card border border-dark-border rounded-3xl overflow-hidden flex flex-col h-full hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="backdrop-blur-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Free
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold text-indigo-400 tracking-wide uppercase">Development</span>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star size={12} fill="currentColor" />
            <span className="font-bold">4.9</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>12h 45m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>1.2k path</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-black text-slate-100">FREE</span>
          <Link
            href={`/subjects/${course.id}`}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-700"
          >
            Explore <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
