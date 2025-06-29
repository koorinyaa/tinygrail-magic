import { create } from 'zustand';
import { AppStore } from './types';

export const createAppStore = create<AppStore>((set) => ({
  isAppVisible: false,

  showApp: () => set({ isAppVisible: true }),
  hideApp: () => set({ isAppVisible: false }),
  toggleApp: () => set((state) => ({ isAppVisible: !state.isAppVisible })),

  reset: () => set({ isAppVisible: false }),
}));
