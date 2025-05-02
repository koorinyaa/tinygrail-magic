import { Link } from '@/components/link';
import { CharacterDrawerPopover } from '../character-drawer-popover';
import { cn, isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

/**
 * LINK按钮
 */
export function LinkButton() {
  const { characterDrawer, characterDrawerData, setCharacterDrawer } = useStore();
  const { Link: link } = characterDrawerData.userTemple || {};
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <>
      <div
        className={cn('flex flex-col items-center justify-center -mr-2 py-1', {
          hidden: isEmpty(link) || characterDrawer.loading,
        })}
      >
        <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
        <div
          className="flex cursor-pointer
              text-xs text-slate-500/80 dark:text-slate-400/80 
              hover:text-slate-600 dark:hover:text-slate-300"
          onClick={() => setPopoverOpen(true)}
        >
          <span className="[writing-mode:vertical-lr] origin-center rotate-180">
            LINK
          </span>
        </div>
        <div className="h-full w-px bg-slate-300/60 dark:bg-slate-700/60 relative flex items-center justify-center" />
      </div>
      <CharacterDrawerPopover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        className="flex justify-center h-52"
      >
        <div className="absolute top-2 right-3">
          <div
            className="flex items-center justify-center text-xs opacity-80 hover:opacity-100 cursor-pointer"
            onClick={() => {
              setPopoverOpen(false);
              setCharacterDrawer({
                open: true,
                characterId: link?.CharacterId || null,
              });
            }}
          >
            跳转至
            <span className="text-blue-600">
              {link?.Name}
              <ArrowUpRight className="size-4 mb-px inline-block" />
            </span>
          </div>
        </div>
        {characterDrawerData.userTemple && link && (
          <Link link1={characterDrawerData.userTemple} link2={link} />
        )}
      </CharacterDrawerPopover>
    </>
  );
}
