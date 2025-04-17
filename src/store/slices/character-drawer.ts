import { StateCreator } from 'zustand';

type CharacterDrawer = {
  open: boolean;
  characterId: number | null; 
}
export interface CharacterDrawerState {
  characterDrawer: CharacterDrawer;
  setCharacterDrawer: (CharacterDrawer: CharacterDrawer) => void;
};

export const createCharacterDrawerSlice: StateCreator<CharacterDrawerState> = (set) => ({
  characterDrawer: {
    open: false,
    characterId: null,
  },
  setCharacterDrawer: (characterDrawer) => {
    set({ characterDrawer });
  }
});