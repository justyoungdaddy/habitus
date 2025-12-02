import { create } from 'zustand';
import { VisualTheme } from './types';

interface AppState {
  theme: VisualTheme;
  setTheme: (theme: VisualTheme) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'default',
  setTheme: (theme) => set({ theme }),
}));
