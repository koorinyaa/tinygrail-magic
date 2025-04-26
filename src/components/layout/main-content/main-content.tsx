import { verifyAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import TopWeek from "@/pages/top-week";
import { useStore } from "@/store";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ComponentProps, useEffect, useRef, useState } from "react";

export function MainContent({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const { currentPage, setUserAssets } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element>(<div/>);

  const PAGE_COMPONENTS = {
    topWeek: TopWeek,
    starTower: NotFound,
    default: NotFound,
  } as const;

  useEffect(() => {
    verifyAuth(setUserAssets);
    const Component = PAGE_COMPONENTS[currentPage.main.id as keyof typeof PAGE_COMPONENTS] || PAGE_COMPONENTS.default;
    setCurrentComponent(<Component />);
    // 滚动到顶部
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [currentPage.main.id]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "!h-[calc(100dvh-4rem)] h-[calc(100vh-4rem)] md:!h-[calc(100dvh-5rem)] md:h-[calc(100vh-5rem)] w-full px-4 sm:px-6 lg:px-8 py-8 overflow-auto",
        className
      )}
      {...props}
    >
      {currentComponent}
    </div>
  );
}
