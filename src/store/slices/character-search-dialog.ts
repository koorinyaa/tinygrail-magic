import { StateCreator } from 'zustand';

type CharacterSearchDialog = {
  open: boolean;
}
export interface CharacterSearchDialogState {
  characterSearchDialog: CharacterSearchDialog;
  setCharacterSearchDialog: (characterSearchDialog: CharacterSearchDialog) => void;
}

export const createCharacterSearchDialogSlice: StateCreator<CharacterSearchDialogState> = (set) => ({
  characterSearchDialog: {
    open: false
  },
  setCharacterSearchDialog: (characterSearchDialog) => {
    set({ characterSearchDialog });
  }
});