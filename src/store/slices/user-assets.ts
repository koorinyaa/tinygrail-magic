import { StateCreator } from 'zustand';

export type UserAssets = {
  id: number;
  name: string;
  avatar: string;
  nickname: string;
  balance: number;
  assets: number;
  type: number;
  state: number;
  lastIndex: number;
  showWeekly: boolean;
  showDaily: boolean;
};

export interface UserAssetsState {
  userAssets: UserAssets | null;
  setUserAssets: (assets: UserAssets | null) => void;
}

const STORAGE_KEY = 'tinygrail-magic:user-assets';

export const createUserAssetsSlice: StateCreator<UserAssetsState> = (set) => ({
  userAssets: null,
  setUserAssets: (userAssets) => {
    set({ userAssets });
    if (userAssets) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAssets));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});