import { createStorageKey } from '@/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LauncherStore } from './types';

// 默认按钮位置
const DEFAULT_BUTTON_POSITION = {
  yPercent: -30, // 默认在垂直中上位置
  isOnLeft: false, // 默认靠右
};

export const createLauncherStore = create<LauncherStore>()(
  persist(
    (set) => ({
      buttonPosition: DEFAULT_BUTTON_POSITION,

      setButtonPosition: (position) => set({ buttonPosition: position }),
      resetButtonPosition: () => set({ buttonPosition: DEFAULT_BUTTON_POSITION }),
    }),
    {
      name: createStorageKey('launcher'),
    },
  ),
);
