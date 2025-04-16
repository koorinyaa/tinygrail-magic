import { createContext, ReactNode, useContext, useReducer } from 'react';

type AppState = {
  theme: 'light' | 'dark' | 'system';
  pageState: {
    isLoading: boolean;
    error: string | null;
  };
  currentPage: {
    main: {
      title: string
      id: string
    },
    sub: {
      title: string
      id: string
    } | null,
  };
  characterDrawer: {
    open: boolean
    characterId: number | null
  };
  characterSearchDialog: {
    open: boolean
  };
  userAssets: {
    id: number;
    name: string;
    avatar: string;
    nickname: string;
    balance: number;
    assets: number;
    type: number;
    state: number;
    lastIndex: number;
    showWeekly: boolean;
    showDaily: boolean;
  };
};

const initialState: AppState = {
  theme: document.documentElement.getAttribute('data-theme') === "dark" ? "dark" : "light",
  pageState: {
    isLoading: false,
    error: null
  },
  currentPage: {
    main: {
      title: "每周萌王",
      id: "topWeek"
    },
    sub: null,
  },
  characterDrawer: {
    open: false,
    characterId: null,
  },
  characterSearchDialog: {
    open: false,
  },
  userAssets: {
    id: 0,
    name: "",
    avatar: "",
    nickname: "",
    balance: 0,
    assets: 0,
    type: 0,
    state: 0,
    lastIndex: 0,
    showWeekly: false,
    showDaily: false,
  },
};

type Action = {
  type: string;
  payload?: any;
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((state: AppState, action: Action) => {
    switch (action.type) {
      case "SET_THEME":
        return { ...state, theme: action.payload };
      case "SET_LOADING":
        return { ...state, pageState: { ...state.pageState, isLoading: action.payload } };
      case "SET_CURRENTPAGE":
        return { ...state, currentPage: { ...state.currentPage, ...action.payload } };
      case "SET_CHARACTER_DRAWER":
        return { ...state, characterDrawer: action.payload };
      case "SET_CHARACTER_SEARCH_DIALOG":
        return {...state, characterSearchDialog: { open: action.payload } };
      case 'SET_USER_ASSETS':
        return {
          ...state,
          userAssets: {
            ...state.userAssets,
            ...action.payload
          }
        };
      default:
        return state;
    }
  }, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(AppStateContext)

  if (context === undefined)
    throw new Error("appStateContext初始化失败")

  return context
}