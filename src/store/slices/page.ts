import { StateCreator } from 'zustand';

type CurrentPage = {
  main: {
    title: string;
    id: string;
  };
  sub?: {
    title: string;
    id: string;
  } | null;
};

export interface PageState {
  currentPage: CurrentPage;
  setCurrentPage: (page: CurrentPage) => void;
}

export const createPageSlice: StateCreator<PageState> = (set) => ({
  currentPage: {
    main: {
      title: "每周萌王",
      id: "topWeek"
    },
    sub: null,
  },
  setCurrentPage: (page) => set({ currentPage: page }),
});