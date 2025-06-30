import TinygrailMagicLauncher from '@/components/TinygrailMagicLauncher';
import Router from '@/routers';
import { createAppStore } from '@/stores';
import { initializePage, isTinygrailMagicHash } from '@/utils/initializers';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';

export default function App() {
  const { isAppVisible, showApp } = createAppStore();

  useEffect(() => {
    // 如果当前页面hash值为tinygrailMagic，则直接初始化页面
    if (isTinygrailMagicHash()) {
      console.info('Initializing tinygrail-magic...');
      initializePage();
      showApp();
    }
  }, []);

  return (
    <HashRouter>
      <HeroUIProvider>{isAppVisible ? <Router /> : <TinygrailMagicLauncher />}</HeroUIProvider>
    </HashRouter>
  );
}
