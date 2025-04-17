import { StateCreator } from 'zustand';

type UserAssets = {
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

export const createUserAssetsSlice: StateCreator<UserAssetsState> = (set) => ({
  userAssets: null,
  setUserAssets: (userAssets) => {
    set({ userAssets });
  }
});