export interface LayoutState {
  // 侧边栏状态
  sidebar: {
    isOpen: boolean; // 是否展开
  };
}

export interface LayoutActions {
  openSidebar: () => void; // 打开侧边栏
  closeSidebar: () => void; // 关闭侧边栏
  toggleSidebar: () => void; // 切换侧边栏状态
  setSidebarOpen: (isOpen: boolean) => void; // 直接设置侧边栏状态
}

export type LayoutStore = LayoutState & LayoutActions;
