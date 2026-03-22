'use client';

import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';

export default function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subjectId: string };
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-[0.98]">
      <SubjectSidebar subjectId={params.subjectId} />
      <main className="flex-1 overflow-y-auto bg-zinc-950/90 w-full relative">
        {children}
      </main>
    </div>
  );
}
