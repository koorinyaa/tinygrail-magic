export interface LauncherState {
  // 按钮位置
  buttonPosition: {
    yPercent: number;
    isOnLeft: boolean;
  };
}

export interface LauncherActions {
  // 设置按钮位置
  setButtonPosition: (position: { yPercent: number; isOnLeft: boolean }) => void;
  // 重置按钮位置
  resetButtonPosition: () => void;
}

export type LauncherStore = LauncherState & LauncherActions;
