import { create } from 'zustand';
import { ThemeState, createThemeSlice } from './slices/theme';
import { PageState, createPageSlice } from './slices/page';
import { UserAssetsState, createUserAssetsSlice } from './slices/user-assets';
import { CharacterSearchDialogState, createCharacterSearchDialogSlice } from './slices/character-search-dialog';
import { CharacterDrawerState, createCharacterDrawerSlice } from './slices/character-drawer';
import { UpdateInfoState, createUpdateInfoSlice } from './slices/update-info';

type StoreState =
  ThemeState &
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