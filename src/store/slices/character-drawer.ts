import { CharacterDetail, CharacterUserValue, TempleItem } from '@/api/character';
import { TinygrailCharacterValue, UserCharacterValue } from '@/api/user';
import { StateCreator } from 'zustand';

type CharacterDrawer = {
  open: boolean;
  characterId: number | null; 
}

/**
 * 角色详情页数据
 * @param {boolean} loading 是否正在加载
 * @param {string} error 错误信息
 * @param {CharacterDetail} characterDetail 角色详情
 * @param {UserCharacterValue} userCharacterData 用户角色数据
 * @param {TempleItem[]} characterTemples 角色圣殿
 * @param {TempleItem[]} characterlinks 角色LINK圣殿
 * @param {TempleItem} userTemple 用户圣殿
 * @param {CharacterUserValue[]} currentCharacterUserPages 当前角色持股用户分页数据
 * @param {CharacterUserValue[]} characterBoardMembers 董事会成员
 * @param {TinygrailCharacterValue} tinygrailCharacterData 英灵殿角色数据
 * @param {UserCharacterValue} gensokyoCharacterData 幻想乡角色数据
 * @param {number} characterPoolAmount 奖池数量
 */
type CharacterDrawerData = {
  loading?: boolean;
  error?: string | null;
  characterDetail?: CharacterDetail | null;
  userCharacterData?: UserCharacterValue | null;
  characterTemples?: TempleItem[];
  characterlinks?: TempleItem[];
  userTemple?: TempleItem | null;
  currentCharacterUserPages?: CharacterUserValue[];
  characterBoardMembers?: CharacterUserValue[];
  tinygrailCharacterData?: TinygrailCharacterValue | null;
  gensokyoCharacterData?: UserCharacterValue | null;
  characterPoolAmount?: number;
}

export interface CharacterDrawerState {
  characterDrawer: CharacterDrawer;
  setCharacterDrawer: (CharacterDrawer: CharacterDrawer) => void;
  characterDrawerData: CharacterDrawerData;
  setCharacterDrawerData: (CharacterDrawerData: CharacterDrawerData) => void;
  resetCharacterDrawerData: () => void;
};

const initialCharacterDrawerData: CharacterDrawerData = {
  loading: false,
  error: null,
  characterDetail: null,
  userCharacterData: null,
  characterTemples: [],
  characterlinks: [],
  userTemple: null,
  currentCharacterUserPages: [],
  characterBoardMembers: [],
  tinygrailCharacterData: null,
  gensokyoCharacterData: null,
  characterPoolAmount: 0,
};

export const createCharacterDrawerSlice: StateCreator<CharacterDrawerState> = (set) => ({
  characterDrawer: {
    open: false,
    characterId: null,
  },
  setCharacterDrawer: (characterDrawer) => {
    set({ characterDrawer });
  },
  characterDrawerData: initialCharacterDrawerData,
  setCharacterDrawerData: (characterDrawerData) => {
    set((state) => ({
      characterDrawerData: { ...state.characterDrawerData, ...characterDrawerData }
    }));
  },
  resetCharacterDrawerData: () => {
    set({ characterDrawerData: initialCharacterDrawerData });
  }
});