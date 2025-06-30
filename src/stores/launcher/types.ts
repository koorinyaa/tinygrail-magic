export interface LauncherState {
  // 按钮位置
  buttonPosition: {
    yPosition: number;
    isOnLeft: boolean;
  };
}

export interface LauncherActions {
  // 设置按钮位置
  setButtonPosition: (position: { yPosition: number; isOnLeft: boolean }) => void;
  // 重置按钮位置
  resetButtonPosition: () => void;
}

export type LauncherStore = LauncherState & LauncherActions;
