export interface AppState {
  // 应用主界面状态
  isAppVisible: boolean;
  appRoot: HTMLElement | undefined;
}

export interface AppActions {
  showApp: () => void; // 显示应用
  hideApp: () => void; // 隐藏应用
  toggleApp: () => void; // 切换应用显示状态

  setAppRoot: (root: HTMLElement) => void; // 设置应用根元素

  // 重置所有状态
  reset: () => void;
}

export type AppStore = AppState & AppActions;
