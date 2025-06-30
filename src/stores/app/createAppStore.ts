import { create } from 'zustand';
import { AppStore } from './types';

export const createAppStore = create<AppStore>((set) => ({
  isAppVisible: false,
  appRoot: undefined,

  showApp: () => set({ isAppVisible: true }),
  hideApp: () => set({ isAppVisible: false }),
  toggleApp: () => set((state) => ({ isAppVisible: !state.isAppVisible })),

  setAppRoot: (root: HTMLElement) => set({ appRoot: root }),

  reset: () => set({ isAppVisible: false }),
}));
