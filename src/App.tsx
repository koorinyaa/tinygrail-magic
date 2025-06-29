import Router from '@/routers';
import { HeroUIProvider } from '@heroui/react';

export default function App() {
  return (
    <HeroUIProvider>
      <Router />
    </HeroUIProvider>
  );
}
