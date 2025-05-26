import { getUserAssets } from '@/api/user';
import { CharacterDrawer } from '@/components/character-drawer';
import { CharacterSearchDialog } from '@/components/character-search-dialog';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { MainContent } from '@/components/layout/main-content';
import { LoginDialog } from '@/components/login-dialog';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { checkForUpdates } from '@/lib/update-checker';
import { decodeHTMLEntities } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const {
    theme,
    setTheme,
    setCurrentPage,
    setUpdateInfo,
    openCharacterDrawer,
  } = useStore();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initTheme();
    handleCheckUpdate();
    initPage();
  }, []);

  /**
   * 初始化主题
   */
  const initTheme = () => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light'
    );
  };

  /**
   * 检查更新
   */
  const handleCheckUpdate = () => {
    checkForUpdates().then((result) => {
      setUpdateInfo(result);
    });
  };

  /**
   * 初始化页面
   */
  const initPage = () => {
    const path = window.location.pathname;
    // 角色页面
    if (path.startsWith('/character/')) {
      const characterId = path.split('/').filter(Boolean).pop();
      if (!isNaN(Number(characterId))) {
        openCharacterDrawer(Number(characterId));
      }
    }
    // 用户页面
    if (path.startsWith('/user/')) {
      const userName = path.split('/').filter(Boolean).pop();
      if (userName) {
        getUserAssets(userName).then((result) => {
          if (result.State === 0) {
            setCurrentPage({
              main: {
                title: `${decodeHTMLEntities(result.Value.Nickname)}的小圣杯`,
                id: 'user-tinygrail',
              },
              data: {
                userName: userName,
              },
            });
          }
        });
      }
    }
  };

  return (
    <div ref={rootRef} className="w-screen !h-dvh h-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <MainContent />
        </SidebarInset>
      </SidebarProvider>
      <Toaster
        richColors
        theme={theme}
        visibleToasts={5}
        position="top-right"
        toastOptions={{
          style: {
            pointerEvents: 'auto',
          },
        }}
      />
      <CharacterDrawer container={rootRef.current} />
      <CharacterSearchDialog container={rootRef.current} />
      <LoginDialog />
    </div>
  );
}
