import {
  CharacterDetail,
  CharacterICOItem,
  CharacterUserPageValue,
  CharacterUserValue,
  IcoUsersPageValue,
  TempleItem,
} from '@/api/character';
import {
  TinygrailCharacterValue,
  UserCharacterValue,
  UserIcoValue,
} from '@/api/user';
import { StateCreator } from 'zustand';

export type CharacterDrawer = {
  open?: boolean;
  characterId?: number | null;
  loading?: boolean;
  error?: string | null;
  handleOnly?: boolean;
  type?: 'character' | 'ico' | 'unlisted';
};

/**
 * 角色抽屉数据
 * @param {CharacterDetail} characterDetailData 角色详情
 * @param {UserCharacterValue} userCharacterData 用户角色数据
 * @param {TempleItem[]} characterTempleItems 角色圣殿
 * @param {TempleItem[]} characterLinkItems 角色LINK圣殿
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

/**
 * ICO数据
 * @param {CharacterICOItem} icoDetailData ICO详情
 * @param {number} currentICOUsersPage 当前ICO用户分页
 * @param {IcoUsersPageValue} icoUsersPageData ICO用户分页数据
 * @param {UserIcoValue} userIcoData 用户ICO数据
 */
export type ICODrawerData = {
  icoDetailData?: CharacterICOItem | null;
  currentICOUsersPage?: number;
  icoUsersPageData?: IcoUsersPageValue | null;
  userIcoData?: UserIcoValue | null;
};

export interface CharacterDrawerState {
  characterDrawer: CharacterDrawer;
  setCharacterDrawer: (CharacterDrawer: CharacterDrawer) => void;
  openCharacterDrawer: (
    characterId: number,
    type?: 'character' | 'ico'
  ) => void;
  closeCharacterDrawer: () => void;
  characterDrawerData: CharacterDrawerData;
  setCharacterDrawerData: (CharacterDrawerData: CharacterDrawerData) => void;
  resetCharacterDrawerData: () => void;
  icoDrawerData: ICODrawerData;
  setIcoDrawerData: (ICODrawerData: ICODrawerData) => void;
  resetIcoDrawerData: () => void;
}

const initialCharacterDrawer: CharacterDrawer = {
  open: false,
  characterId: null,
  loading: false,
  error: null,
  handleOnly: false,
  type: 'character',
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

const initialICODrawerData: ICODrawerData = {
  icoDetailData: null,
  currentICOUsersPage: 1,
  icoUsersPageData: null,
  userIcoData: null,
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
  openCharacterDrawer: (characterId, type = 'character') => {
    set((state) => ({
      characterDrawer: {
        ...state.characterDrawer,
        characterId,
        open: true,
        loading: true,
        type,
      },
    }));
  },
  closeCharacterDrawer: () => {
    set({
      characterDrawer: initialCharacterDrawer,
      characterDrawerData: initialCharacterDrawerData,
      icoDrawerData: initialICODrawerData,
    });
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
  icoDrawerData: initialICODrawerData,
  setIcoDrawerData: (icoDrawerData) => {
    set((state) => ({
      icoDrawerData: {
        ...state.icoDrawerData,
        ...icoDrawerData,
      },
    }));
  },
  resetIcoDrawerData: () => {
    set({ icoDrawerData: initialICODrawerData });
  },
});
