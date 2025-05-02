import { create } from 'zustand';
import {
  CharacterDrawerState,
  createCharacterDrawerSlice,
} from './slices/character-drawer';
import {
  CharacterSearchDialogState,
  createCharacterSearchDialogSlice,
} from './slices/character-search-dialog';
import { PageState, createPageSlice } from './slices/page';
import { ThemeState, createThemeSlice } from './slices/theme';
import { UpdateInfoState, createUpdateInfoSlice } from './slices/update-info';
import { UserAssetsState, createUserAssetsSlice } from './slices/user-assets';

type StoreState = ThemeState &
  PageState &
  UserAssetsState &
  CharacterSearchDialogState &
  CharacterDrawerState &
  UpdateInfoState;

export const useStore = create<StoreState>()((...args) => ({
  ...createThemeSlice(...args),
  ...createPageSlice(...args),
  ...createUserAssetsSlice(...args),
  ...createCharacterSearchDialogSlice(...args),
  ...createCharacterDrawerSlice(...args),
  ...createUpdateInfoSlice(...args),
}));
