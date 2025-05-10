import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import {
  Box,
  CircleFadingArrowUp,
  Ellipsis,
  ImageUp,
  Link,
  MessageSquareText,
  RotateCw,
  Sparkles,
  X
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { CharacterDrawerPopover } from '../character-drawer-popover';
import { AssetRestructure } from './assets-restructure';
import { ChangeLine } from './change-line';
import { ChangeLink } from './change-link';
import { ChangeTempleImage } from './change-temple-image';
import { ConvertStarForces } from './convert-star-forces';
import { Refine } from './refine';
import { RemoveTemple } from './remove-temple';
import { ResetTempleImage } from './reset-temple-image';

/**
 * 操作按钮
 */
export function ActionButtons() {
  const { characterDrawer, characterDrawerData } = useStore();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverContent, setPopoverContent] = useState<ReactNode>(null);
  const { userTempleData } = characterDrawerData;
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
  } = userTempleData || {};

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
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <ConvertStarForces
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: !isEmpty(userTempleData),
    },
    {
      text: '精炼',
      icon: <CircleFadingArrowUp className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(<Refine />);
      },
      show:
        !isEmpty(userTempleData) &&
        templeLevel > 0 &&
        sacrifices >= 2500 &&
        assets >= 2500,
    },
  ];

  const moreMenuItems = [
    {
      text: '修改圣殿图片',
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
      show: !isEmpty(userTempleData) && templeLevel > 0,
    },
    {
      text: '重置圣殿图片',
      icon: <RotateCw className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <ResetTempleImage
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: !isEmpty(userTempleData),
    },
    {
      text: 'LINK',
      icon: <Link className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <ChangeLink
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: !isEmpty(userTempleData) && templeLevel > 0,
    },
    {
      text: '台词',
      icon: <MessageSquareText className="size-3" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <ChangeLine
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      show: !isEmpty(userTempleData) && templeLevel > 0,
    },
    {
      text: '拆除圣殿',
      icon: <X className="size-3 text-destructive" />,
      onClick: () => {
        setShowPopover(true);
        setPopoverContent(
          <RemoveTemple
            onClose={() => {
              setShowPopover(false);
            }}
          />
        );
      },
      className: 'text-destructive',
      show: !isEmpty(userTempleData) && sacrifices === assets,
    },
  ];

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
        <div className="w-full flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5 m-scrollbar-none">
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
          {moreMenuItems.filter((item) => item.show).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={cn(
                    'inline-flex items-center justify-center size-6',
                    'bg-slate-300/50 dark:bg-slate-700/50 hover:bg-slate-300/80 dark:hover:bg-slate-700/80',
                    'text-xs rounded-full first:ml-0 p-1 cursor-pointer',
                    'transition-all duration-300 flex-shrink-0'
                  )}
                >
                  <span
                    className="flex flex-row items-center justify-center gap-1"
                    onClick={() => {}}
                  >
                    <Ellipsis className="size-3" />
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-64 min-w-36">
                <DropdownMenuGroup>
                  {moreMenuItems.map((item, index) => {
                    if (!item.show) return null;
                    return (
                      <DropdownMenuItem
                        key={index}
                        className={cn(
                          'hover:bg-accent cursor-pointer',
                          item.className
                        )}
                        onClick={item.onClick}
                      >
                        {item.icon}
                        <span>{item.text}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
