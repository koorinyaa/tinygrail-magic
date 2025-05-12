import { RefObject } from 'react';
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
  containerRef: RefObject<HTMLDivElement> | null;
  setContainerRef: (ref: RefObject<HTMLDivElement>) => void;
  toTop: () => void;
}

export const createPageSlice: StateCreator<PageState> = (set) => ({
  currentPage: {
    main: {
      title: '每周萌王',
      id: 'topWeek',
    },
    sub: null,
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  containerRef: null,
  setContainerRef: (ref) => set({ containerRef: ref }),
  toTop: () =>
    set((state) => {
      if (state.containerRef?.current) state.containerRef.current.scrollTop = 0;
      return {};
    }),
});
