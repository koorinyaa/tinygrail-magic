import { StateCreator } from 'zustand';

export interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const createThemeSlice: StateCreator<ThemeState> = (set) => ({
  theme: 'light',
  setTheme: (theme) => {
    set({ theme });

    // 更新网页主题
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.cookie = `chii_theme=${theme}; path=/; max-age=31536000`;
  },
});
