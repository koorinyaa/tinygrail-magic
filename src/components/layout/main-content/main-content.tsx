import { verifyAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { NotFound, StarTower, TopWeek, CharacterPage } from '@/pages';
import { useStore } from '@/store';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ComponentProps, useEffect, useRef, useState } from 'react';

export function MainContent({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const { currentPage, setContainerRef, toTop, setUserAssets } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element>(
    <div />
  );

  const PAGE_COMPONENTS = {
    topWeek: TopWeek,
    starTower: StarTower,
    character: CharacterPage,
    default: NotFound,
  } as const;

  useEffect(() => {
    setContainerRef(containerRef);
  }, [containerRef]);

  useEffect(() => {
    verifyAuth(setUserAssets);
    const Component =
      PAGE_COMPONENTS[currentPage.main.id as keyof typeof PAGE_COMPONENTS] ||
      PAGE_COMPONENTS.default;
    setCurrentComponent(<Component />);
    // 滚动到顶部
    toTop();
  }, [currentPage.main.id]);

  return (
    <div
      ref={containerRef}
      className={cn(
        '!h-[calc(100dvh-3.5rem)] h-[calc(100vh-3.5rem)] md:!h-[calc(100dvh-4.5rem)] md:h-[calc(100vh-4.5rem)] w-full px-4 sm:px-6 lg:px-8 py-8 scroll-smooth overflow-auto',
        className
      )}
      {...props}
    >
      {currentComponent}
    </div>
  );
}
