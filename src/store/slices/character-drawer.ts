import { CharacterDetail, TempleItem } from '@/api/character';
import { UserCharacterValue } from '@/api/user';
import { StateCreator } from 'zustand';

type CharacterDrawer = {
  open: boolean;
  characterId: number | null; 
}

type CharacterDrawerData = {
  loading?: boolean;
  error?: string | null;
  characterDetail?: CharacterDetail | null;
  userCharacterData?: UserCharacterValue | null;
  characterTemples?: TempleItem[];
  characterlinks?: TempleItem[];
  userTemple?: TempleItem | null;
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