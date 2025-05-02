import { StateCreator } from 'zustand';

export type UpdateInfo = {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string | null;
  error?: string;
};

export interface UpdateInfoState {
  updateInfo: UpdateInfo;
  setUpdateInfo: (updateInfo: UpdateInfo) => void;
}

const initialUpdateInfo: UpdateInfo = {
  hasUpdate: false,
  currentVersion: '',
  latestVersion: null,
  error: undefined,
};

export const createUpdateInfoSlice: StateCreator<UpdateInfoState> = (set) => ({
  updateInfo: initialUpdateInfo,
  setUpdateInfo: (updateInfo) => {
    set({ updateInfo });
  },
});
