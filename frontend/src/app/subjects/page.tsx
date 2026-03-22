'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Map, Clock } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.get('/subjects');
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-8 sm:p-12 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500 inline-block pb-2">
            Explore Courses
          </h1>
          <p className="mt-4 text-lg text-zinc-400">Discover premium structured learning paths</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="flex h-4 w-4 rounded-full bg-indigo-500 mr-2 animate-ping"></span>
            Loading courses...
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 shadow-inner">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium text-zinc-300">No courses available</h3>
            <p className="mt-2 text-zinc-500">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all hover:bg-zinc-800/80 hover:shadow-2xl hover:border-zinc-700 h-full">
                  <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                    {subject.thumbnail_url ? (
                      <img 
                        src={subject.thumbnail_url} 
                        alt={subject.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900/40 to-zinc-900">
                        <BookOpen className="h-12 w-12 text-indigo-500/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                      {subject.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-zinc-400 line-clamp-3">
                      {subject.description || 'Dive into structured learning with our meticulously curated course.'}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
                      <div className="flex items-center gap-1.5"><Map className="h-4 w-4"/> Self-paced</div>
                      <div className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> Lifetime</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
