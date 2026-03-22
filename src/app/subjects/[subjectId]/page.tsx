'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { PlayCircle, Rocket } from 'lucide-react';
import apiClient from '@/lib/apiClient';

export default function SubjectDashboard({ params }: { params: { subjectId: string } }) {
  const router = useRouter();
  const { tree } = useSidebarStore();
  const [loading, setLoading] = useState(true);
  const [resumeVideoId, setResumeVideoId] = useState<number | null>(null);

  useEffect(() => {
    // If we have a tree, auto compute the first locked video or resume location
    if (!tree) return;
    
    const findResumePoint = async () => {
      try {
        const res = await apiClient.get(`/progress/subjects/${params.subjectId}`);
        const lastWatchedId = res.data.last_video_id;

        if (lastWatchedId) {
          setResumeVideoId(lastWatchedId);
        } else {
          // Fallback to first unlocked video in the tree
          const firstSection = tree.sections[0];
          if (firstSection && firstSection.videos.length > 0) {
            setResumeVideoId(firstSection.videos[0].id);
          }
        }
      } catch (err) {
        // Just fail gracefully, user can click sidebar
      } finally {
        setLoading(false);
      }
    };
    
    findResumePoint();
  }, [tree, params.subjectId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="flex h-6 w-6 rounded-full bg-indigo-500 animate-pulse"></span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-100 bg-zinc-950">
      <div className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <Rocket className="mx-auto h-16 w-16 text-indigo-400 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to {tree?.title}</h1>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Ready to master new concepts? Pick up right where you left off or start from the beginning.
          </p>
          
          <button
            onClick={() => resumeVideoId && router.push(`/subjects/${params.subjectId}/video/${resumeVideoId}`)}
            disabled={!resumeVideoId}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle className="h-5 w-5" />
            {resumeVideoId ? 'Resume Learning' : 'Select a lesson to start'}
          </button>
        </div>
      </div>
    </div>
  );
}
