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
  data?: any;
};

export interface PageState {
  currentPage: CurrentPage;
  setCurrentPage: (page: CurrentPage) => void;
  pageContainerRef: RefObject<HTMLDivElement> | null;
  setPageContainerRef: (ref: RefObject<HTMLDivElement>) => void;
  toTop: (top?: number) => void;
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
  pageContainerRef: null,
  setPageContainerRef: (ref) => set({ pageContainerRef: ref }),
  toTop: (top = 0) =>
    set((state) => {
      if (state.pageContainerRef?.current) {
        state.pageContainerRef.current.scrollTop = top;
      }
      return {};
    }),
});
