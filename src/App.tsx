import Router from '@/routers';
import { HeroUIProvider } from '@heroui/react';
import { HashRouter } from 'react-router-dom';

export default function App() {
  return (
    <HashRouter>
      <HeroUIProvider>
        <Router />
      </HeroUIProvider>
    </HashRouter>
  );
}
