import TinygrailMagicLauncher from '@/components/TinygrailMagicLauncher';
import Router from '@/routers';
import { createAppStore } from '@/stores';
import { initializePage, isTinygrailMagicHash } from '@/utils/initializers';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';

export default function App() {
  const { isAppVisible, showApp, setAppRoot } = createAppStore();

  // 检查并初始化应用
  const checkInitialization = () => {
    // 如果当前页面hash值为tinygrailMagic，则直接初始化页面
    if (isTinygrailMagicHash()) {
      console.info('Initializing tinygrail-magic...');
      initializePage();
      showApp();
    }
  };

  // 设置应用根元素
  const setupAppRoot = () => {
    const mainContainer = document.getElementById('tinygrailMagicContainer');
    const shadowRoot = mainContainer?.shadowRoot;
    const root = shadowRoot?.getElementById('tinygrailMagicRoot');
    if (root) {
      setAppRoot(root);
    }
  };

  useEffect(() => {
    checkInitialization();
    setupAppRoot();
  }, []);

  return (
    <HashRouter>
      <HeroUIProvider>{isAppVisible ? <Router /> : <TinygrailMagicLauncher />}</HeroUIProvider>
    </HashRouter>
  );
}
