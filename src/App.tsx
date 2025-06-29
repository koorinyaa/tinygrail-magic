import TinygrailMagicLauncher from '@/components/TinygrailMagicLauncher';
import Router from '@/routers';
import { createAppStore } from '@/stores';
import { HeroUIProvider } from '@heroui/react';

export default function App() {
  const { isAppVisible } = createAppStore();
  return (
    <>
      {isAppVisible ? (
        <HeroUIProvider>
          <Router />
        </HeroUIProvider>
      ) : (
        <TinygrailMagicLauncher />
      )}
    </>
  );
}
