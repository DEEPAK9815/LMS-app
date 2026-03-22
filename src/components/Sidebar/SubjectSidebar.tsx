'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Lock, PlayCircle, BookOpen } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

export default function SubjectSidebar({ subjectId }: { subjectId: string }) {
  const pathname = usePathname();
  const { tree, loading, fetchTree } = useSidebarStore();

  useEffect(() => {
    fetchTree(subjectId);
  }, [subjectId, fetchTree]);

  if (loading) {
    return (
      <aside className="w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center p-6 h-screen overflow-y-auto">
        <span className="flex h-5 w-5 rounded-full bg-indigo-500 animate-pulse"></span>
      </aside>
    );
  }

  if (!tree) return null;

  return (
    <aside className="w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="bg-indigo-500/10 p-2 rounded-lg">
          <BookOpen className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">{tree.title}</h2>
          <p className="text-xs text-zinc-500 line-clamp-1">{tree.description}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pt-4 p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {tree.sections.map((section) => (
          <div key={section.id}>
            <h3 className="mb-3 pl-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.videos.map((video) => {
                const isCurrent = pathname.includes(`/video/${video.id}`);
                return (
                  <li key={video.id}>
                    {video.locked ? (
                      <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors">
                        <Lock className="h-4 w-4 shrink-0 opacity-50" />
                        <span className="line-clamp-2 leading-tight">{video.title}</span>
                      </div>
                    ) : (
                      <Link
                        href={`/subjects/${subjectId}/video/${video.id}`}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all relative ${
                          isCurrent
                            ? 'bg-indigo-500/10 text-indigo-400 font-semibold before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-r-full before:bg-indigo-500'
                            : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100'
                        }`}
                      >
                        {video.is_completed ? (
                          <CheckCircle2 className={`h-4 w-4 shrink-0 transition-colors ${isCurrent ? 'text-indigo-400' : 'text-emerald-500'}`} />
                        ) : (
                          <PlayCircle className={`h-4 w-4 shrink-0 transition-colors ${isCurrent ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                        )}
                        <span className="line-clamp-2 leading-tight">{video.title}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
