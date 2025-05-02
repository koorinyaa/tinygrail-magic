import {
  CharacterDetail,
  CharacterUserPageValue,
  CharacterUserValue,
  TempleItem,
} from '@/api/character';
import { TinygrailCharacterValue, UserCharacterValue } from '@/api/user';
import { StateCreator } from 'zustand';

export type CharacterDrawer = {
  open?: boolean;
  characterId?: number | null;
  loading?: boolean;
  error?: string | null;
  handleOnly?: boolean;
};

/**
 * 角色抽屉数据
 * @param {CharacterDetail} characterDetail 角色详情
 * @param {UserCharacterValue} userCharacterData 用户角色数据
 * @param {TempleItem[]} characterTemples 角色圣殿
 * @param {TempleItem[]} characterlinks 角色LINK圣殿
 * @param {TempleItem} userTemple 用户圣殿
 * @param {CharacterUserPageValue} currentCharacterUserPageData 当前角色持股用户分页数据
 * @param {CharacterUserValue[]} characterBoardMembers 董事会成员
 * @param {TinygrailCharacterValue} tinygrailCharacterData 英灵殿角色数据
 * @param {UserCharacterValue} gensokyoCharacterData 幻想乡角色数据
 * @param {number} characterPoolAmount 奖池数量
 */
export type CharacterDrawerData = {
  // TODO: 名称统一
  characterDetail?: CharacterDetail | null;
  userCharacterData?: UserCharacterValue | null;
  characterTemples?: TempleItem[];
  characterlinks?: TempleItem[];
  userTemple?: TempleItem | null;
  currentCharacterUserPage?: number;
  currentCharacterUserPageData?: CharacterUserPageValue;
  characterBoardMembers?: CharacterUserValue[];
  tinygrailCharacterData?: TinygrailCharacterValue | null;
  gensokyoCharacterData?: UserCharacterValue | null;
  characterPoolAmount?: number;
};

export interface CharacterDrawerState {
  characterDrawer: CharacterDrawer;
  setCharacterDrawer: (CharacterDrawer: CharacterDrawer) => void;
  closeCharacterDrawer: () => void;
  characterDrawerData: CharacterDrawerData;
  setCharacterDrawerData: (CharacterDrawerData: CharacterDrawerData) => void;
  resetCharacterDrawerData: () => void;
}

const initialCharacterDrawer: CharacterDrawer = {
  open: false,
  characterId: null,
  loading: false,
  error: null,
  handleOnly: false,
};

const initialCharacterDrawerData: CharacterDrawerData = {
  characterDetail: null,
  userCharacterData: null,
  characterTemples: [],
  characterlinks: [],
  userTemple: null,
  currentCharacterUserPage: 1,
  currentCharacterUserPageData: undefined,
  characterBoardMembers: [],
  tinygrailCharacterData: null,
  gensokyoCharacterData: null,
  characterPoolAmount: 0,
};

export const createCharacterDrawerSlice: StateCreator<CharacterDrawerState> = (
  set
) => ({
  characterDrawer: initialCharacterDrawer,
  setCharacterDrawer: (characterDrawer) => {
    set((state) => ({
      characterDrawer: { ...state.characterDrawer, ...characterDrawer },
    }));
  },
  closeCharacterDrawer: () => {
    set({ characterDrawer: initialCharacterDrawer });
  },
  characterDrawerData: initialCharacterDrawerData,
  setCharacterDrawerData: (characterDrawerData) => {
    set((state) => ({
      characterDrawerData: {
        ...state.characterDrawerData,
        ...characterDrawerData,
      },
    }));
  },
  resetCharacterDrawerData: () => {
    set({ characterDrawerData: initialCharacterDrawerData });
  },
});
