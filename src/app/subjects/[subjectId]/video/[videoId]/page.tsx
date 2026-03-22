'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useSidebarStore } from '@/store/sidebarStore';
import VideoPlayer from '@/components/Video/VideoPlayer';

interface VideoDetails {
  id: number;
  title: string;
  description: string;
  youtube_video_id: string;
  section_title: string;
  subject_title: string;
  prev_video_id: number | null;
  next_video_id: number | null;
  locked: boolean;
  current_progress: {
    last_position_seconds: number;
    is_completed: boolean;
  };
}

export default function VideoPage({ params }: { params: { subjectId: string, videoId: string } }) {
  const router = useRouter();
  const { markVideoCompleted, fetchTree } = useSidebarStore();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track last sent progress to avoid spamming backend if time hasn't changed much
  const lastSentProgress = useRef<number>(0);

  useEffect(() => {
    let active = true;
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/videos/${params.videoId}`);
        if (!active) return;
        setVideo(res.data);
        lastSentProgress.current = res.data.current_progress?.last_position_seconds || 0;
      } catch (err: any) {
        if (!active) return;
        setError(err.response?.data?.error || 'Failed to load video properties.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchVideoDetails();
    
    return () => { active = false; };
  }, [params.videoId]);

  const handleProgress = async (currentTime: number) => {
    // Only send if difference > 5 seconds
    if (Math.abs(currentTime - lastSentProgress.current) > 5) {
      lastSentProgress.current = currentTime;
      try {
        await apiClient.post(`/progress/videos/${params.videoId}`, {
          last_position: currentTime
        });
      } catch (e) {}
    }
  };

  const handleCompleted = async () => {
    if (!video) return;
    
    // Mark as completed locally to unlock sidebar instantly.
    markVideoCompleted(video.id);

    try {
      await apiClient.post(`/progress/videos/${params.videoId}`, {
        last_position: lastSentProgress.current,
        is_completed: true
      });
      // Optionally navigate next automatically:
      if (video.next_video_id) {
        router.push(`/subjects/${params.subjectId}/video/${video.next_video_id}`);
      }
    } catch (e) {
      console.error('Failed to save completion status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <span className="flex h-8 w-8 rounded-full bg-indigo-500 animate-pulse mix-blend-screen"></span>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-zinc-950">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Access Denied</h2>
          <p className="text-zinc-400 text-sm">{error || "This video is either locked or missing."}</p>
          <button 
            onClick={() => router.push(`/subjects/${params.subjectId}`)}
            className="mt-6 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Return to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full h-auto p-6 sm:p-10 max-w-6xl mx-auto space-y-8 bg-zinc-[0.98]">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {video.section_title}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 flex items-center gap-3">
             {video.title} 
             {video.current_progress?.is_completed && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          </h1>
        </div>
      </div>

      <VideoPlayer
        videoId={video.id}
        youtubeId={video.youtube_video_id}
        startPositionSeconds={lastSentProgress.current}
        onProgress={handleProgress}
        onCompleted={handleCompleted}
      />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-sm backdrop-blur-md">
        <h3 className="text-lg font-bold text-zinc-200 mb-3">About this lesson</h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          {video.description || 'Watch the video to understand the core concepts described by the instructor.'}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 pt-8 pb-12">
        <button
          onClick={() => video.prev_video_id && router.push(`/subjects/${params.subjectId}/video/${video.prev_video_id}`)}
          disabled={!video.prev_video_id}
          className="group flex w-[48%] sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Previous
        </button>
        
        <button
          onClick={() => video.next_video_id && router.push(`/subjects/${params.subjectId}/video/${video.next_video_id}`)}
          disabled={!video.next_video_id}
          className="group flex w-[48%] sm:w-auto items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 hover:scale-[1.02] shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Next Lesson
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
