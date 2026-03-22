import { create } from 'zustand';
import apiClient from '../lib/apiClient';

interface Video {
  id: number;
  title: string;
  order_index: number;
  is_completed: boolean;
  locked: boolean;
}

interface Section {
  id: number;
  title: string;
  order_index: number;
  videos: Video[];
}

interface SubjectTree {
  id: number;
  title: string;
  description: string;
  sections: Section[];
}

interface SidebarState {
  tree: SubjectTree | null;
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: string | number) => Promise<void>;
  markVideoCompleted: (videoId: number) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,
  fetchTree: async (subjectId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/subjects/${subjectId}/tree`);
      set({ tree: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch subject tree', loading: false });
    }
  },
  markVideoCompleted: (videoId) => {
    const { tree } = get();
    if (!tree) return;

    // We do a deep clone update for simple state management without immer here
    const newSections = tree.sections.map(sec => ({
      ...sec,
      videos: sec.videos.map(v => 
        v.id === videoId ? { ...v, is_completed: true } : v
      )
    }));
    
    // Attempting a simple optimistic unlock of the next video
    let unlockNext = false;
    for (const sec of newSections) {
      for (const vid of sec.videos) {
        if (unlockNext) {
          vid.locked = false;
          unlockNext = false;
        }
        if (vid.id === videoId) {
          unlockNext = true;
        }
      }
    }

    set({ tree: { ...tree, sections: newSections } });
  }
}));
