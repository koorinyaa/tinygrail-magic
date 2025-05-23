import { FloatingButtons } from '@/components/floating-buttons';
import { verifyAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  CharacterPage,
  ICOPage,
  LastTemplesPage,
  MyTinygrailPage,
  NotFound,
  RankIngList,
  StarTower,
  TopWeek,
  UserTinygrailPage,
} from '@/pages';
import { useStore } from '@/store';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ComponentProps, useEffect, useRef, useState } from 'react';

export function MainContent({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const { currentPage, setPageContainerRef, toTop, setUserAssets } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element>(
    <div />
  );

  const PAGE_COMPONENTS = {
    topWeek: TopWeek,
    starTower: StarTower,
    character: CharacterPage,
    ico: ICOPage,
    ranking: RankIngList,
    lastTemples: LastTemplesPage,
    'my-tinygrail': MyTinygrailPage,
    'user-tinygrail': UserTinygrailPage,
    default: NotFound,
  } as const;

  useEffect(() => {
    setPageContainerRef(containerRef);
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
        '!h-[calc(100dvh-3.5rem)] h-[calc(100vh-3.5rem)] md:!h-[calc(100dvh-4.5rem)] md:h-[calc(100vh-4.5rem)]',
        'w-full px-4 sm:px-6 lg:px-8 py-8 scroll-smooth overflow-auto',
        {
          'px-0 sm:px-0 lg:px-0 py-0':
            currentPage.main.id === 'my-tinygrail' ||
            currentPage.main.id === 'user-tinygrail',
        },
        className
      )}
      {...props}
    >
      {currentComponent}
      <FloatingButtons />
    </div>
  );
}
