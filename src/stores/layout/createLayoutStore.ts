import { createStorageKey } from '@/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LayoutStore } from './types';

export const createLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      sidebar: {
        isOpen: true,
      },

      openSidebar: () => set({ sidebar: { isOpen: true } }),
      closeSidebar: () => set({ sidebar: { isOpen: false } }),
      toggleSidebar: () =>
        set((state) => ({
          sidebar: { isOpen: !state.sidebar.isOpen },
        })),
      setSidebarOpen: (isOpen) => set({ sidebar: { isOpen } }),
    }),
    {
      name: createStorageKey('layout'),
      //   partialize: (state) => ({ sidebar: state.sidebar }),
    },
  ),
);
