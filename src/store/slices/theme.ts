import { StateCreator } from 'zustand';

export interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const createThemeSlice: StateCreator<ThemeState> = (set) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    
    // 更新网页主题
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.cookie = `chii_theme=${theme}; path=/; max-age=31536000`;

    // 更新网页主题色
    const meta = document.getElementById('theme-color-meta') as HTMLMetaElement;
    if (meta) {
      meta.content = theme === 'dark' ? '#020618' : '#FFFFFF';
    } else {
      const themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.id = 'theme-color-meta';
      themeColorMeta.content = theme === 'dark' ? '#020618' : '#FFFFFF';
      document.head.appendChild(themeColorMeta);
    }
  }
});