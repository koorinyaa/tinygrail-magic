import { Skeleton } from '@/components/ui/skeleton';
import { cn, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  CircleFadingArrowUp,
  ImageUp,
  Link,
  MessageSquareText,
  RotateCw,
  Sparkles,
  X,
} from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { CharacterDrawerPopover } from '../character-drawer-popover';
import { AssetRestructure } from './assets-restructure';
import { ChangeTempleImage } from './change-temple-image';
import { Refine } from './refine';
import { toast } from 'sonner';

/**
 * 操作按钮
 */
export function ActionButtons() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { characterDrawer, characterDrawerData } = useStore();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);
  const { userTemple } = characterDrawerData;
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
  } = userTemple || {};

  const buttons = [
    {
      text: '资产重组',
      icon: <Box className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <AssetRestructure
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: true,
    },
    {
      text: '转换星之力',
      icon: <Sparkles className="size-3" />,
      onClick: () => {toast.warning('开发中...')},
      show: !isEmpty(userTemple),
    },
    {
      text: '精炼',
      icon: <CircleFadingArrowUp className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Refine />);
      },
      show:
        !isEmpty(userTemple) &&
        templeLevel > 0 &&
        sacrifices >= 2500 &&
        assets >= 2500,
    },
    {
      text: '修改塔图',
      icon: <ImageUp className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <ChangeTempleImage
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: !isEmpty(userTemple) && templeLevel > 0,
    },
    {
      text: '重置塔图',
      icon: <RotateCw className="size-3" />,
      onClick: () => {toast.warning('开发中...')},
      show: !isEmpty(userTemple) && templeLevel > 0,
    },
    {
      text: 'LINK',
      icon: <Link className="size-3" />,
      onClick: () => {toast.warning('开发中...')},
      show: !isEmpty(userTemple) && templeLevel > 0,
    },
    {
      text: '台词',
      icon: <MessageSquareText className="size-3" />,
      onClick: () => {toast.warning('开发中...')},
      show: !isEmpty(userTemple) && templeLevel > 0,
    },
    {
      text: '拆除圣殿',
      icon: <X className="size-3" />,
      onClick: () => {toast.warning('开发中...')},
      show: !isEmpty(userTemple) && sacrifices === assets,
    },
  ];

  // 检查是否需要显示滚动箭头
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // 滚动到左侧
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  // 滚动到右侧
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // 监听滚动容器变化
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // 初始检查
      checkScrollPosition();

      // 使用函数引用以确保事件监听器能正确移除
      const handleScroll = () => checkScrollPosition();
      scrollContainer.addEventListener('scroll', handleScroll);

      // ResizeObserver 监听容器大小变化
      const resizeObserver = new ResizeObserver(() => {
        checkScrollPosition();
      });
      resizeObserver.observe(scrollContainer);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [buttons]);

  // 内容变化时重新检查滚动状态
  useEffect(() => {
    checkScrollPosition();
  }, [buttons.length, userTemple]);

  if (characterDrawer.loading) {
    return (
      <div
        className="w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5"
        style={{
          scrollbarWidth: 'none',
        }}
      >
        <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="rounded-full w-16 h-6 bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative">
        {showLeftArrow && (
          <div
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10',
              'size-5 flex items-center justify-center',
              'rounded-full cursor-pointer shadow-sm',
              'bg-slate-200/90 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700',
              'transition-all duration-300'
            )}
            onClick={scrollLeft}
          >
            <ChevronLeft className="size-3.5 text-slate-600 dark:text-slate-300" />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5 m-scrollbar-none"
        >
          {buttons.map((button, index) => {
            if (!button.show) return null;
            return (
              <div
                key={index}
                className={cn(
                  'inline-flex items-center justify-center',
                  'bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80',
                  'text-xs rounded-full first:ml-0 py-1 px-2 cursor-pointer',
                  'transition-all duration-300 flex-shrink-0'
                )}
              >
                <span
                  className="flex flex-row items-center justify-center gap-1"
                  onClick={button.onClick}
                >
                  {button.icon}
                  {button.text}
                </span>
              </div>
            );
          })}
        </div>
        {showRightArrow && (
          <div
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10',
              'size-5 flex items-center justify-center',
              'rounded-full cursor-pointer shadow-sm',
              'bg-slate-200/90 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700',
              'transition-all duration-300'
            )}
            onClick={scrollRight}
          >
            <ChevronRight className="size-3.5 text-slate-600 dark:text-slate-300" />
          </div>
        )}
      </div>
      <CharacterDrawerPopover
        open={showPopover}
        onOpenChange={setShowPopover}
        className="flex justify-center"
      >
        {popoverContent}
      </CharacterDrawerPopover>
    </>
  );
}
