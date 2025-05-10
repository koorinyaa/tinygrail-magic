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
 * @param {CharacterDetail} characterDetailData 角色详情
 * @param {UserCharacterValue} userCharacterData 用户角色数据
 * @param {TempleItem[]} characterTemplesItems 角色圣殿
 * @param {TempleItem[]} characterLinksItems 角色LINK圣殿
 * @param {TempleItem} userTempleData 用户圣殿
 * @param {number} currentCharacterUsersPage 当前角色持股用户分页
 * @param {CharacterUserPageValue} characterUsersPageData 角色持股用户分页数据
 * @param {CharacterUserValue[]} characterBoardMembersItems 董事会成员
 * @param {TinygrailCharacterValue} tinygrailCharacterData 英灵殿角色数据
 * @param {UserCharacterValue} gensokyoCharacterData 幻想乡角色数据
 * @param {number} characterPoolAmount 奖池数量
 */
export type CharacterDrawerData = {
  characterDetailData?: CharacterDetail | null;
  userCharacterData?: UserCharacterValue | null;
  characterTempleItems?: TempleItem[];
  characterLinkItems?: TempleItem[];
  userTempleData?: TempleItem | null;
  currentCharacterUsersPage?: number;
  characterUsersPageData?: CharacterUserPageValue;
  characterBoardMemberItems?: CharacterUserValue[];
  tinygrailCharacterData?: TinygrailCharacterValue | null;
  gensokyoCharacterData?: UserCharacterValue | null;
  characterPoolAmount?: number;
};

export interface CharacterDrawerState {
  characterDrawer: CharacterDrawer;
  setCharacterDrawer: (CharacterDrawer: CharacterDrawer) => void;
  openCharacterDrawer: (characterId: number) => void;
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
  characterDetailData: null,
  userCharacterData: null,
  characterTempleItems: [],
  characterLinkItems: [],
  userTempleData: null,
  currentCharacterUsersPage: 1,
  characterUsersPageData: undefined,
  characterBoardMemberItems: [],
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
  openCharacterDrawer: (characterId) => {
    set((state) => ({
      characterDrawer: { ...state.characterDrawer, characterId, open: true },
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
