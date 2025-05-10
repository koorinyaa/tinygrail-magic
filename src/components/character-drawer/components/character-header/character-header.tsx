import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScroll } from '@/hooks/use-scroll';
import { cn, getAvatarUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { RefObject } from 'react';

/**
 * 角色头部
 */
export function CharacterHeader({
  contentRef,
}: {
  contentRef: RefObject<HTMLDivElement>;
}) {
  const isMobile = useIsMobile(448);
  const { scrollPosition } = useScroll(contentRef);
  const { characterDrawerData } = useStore();
  const {
    CharacterId: characterId = 0,
    Icon: icon = '',
    Name: name = '',
  } = characterDrawerData.characterDetailData || {};

  return (
    <div
      className={cn(
        'absolute top-0 left-0 right-0 h-12 px-4 py-2',
        'flex flex-row gap-1 items-center bg-card z-10',
        'border-b border-slate-300/30 dark:border-slate-700/30',
        { 'top-4 h-10 pt-0.5 -mt-0.5': isMobile }
      )}
      style={{
        opacity: Math.max(0, Math.min(1, (scrollPosition - 104) / 40)),
      }}
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Avatar className="size-8 rounded-full border-2 border-secondary">
          <AvatarImage
            className="object-cover object-top pointer-events-none"
            src={getAvatarUrl(icon)}
            alt={name}
          />
          <AvatarFallback className="rounded-full">C</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center mt-0.5 ml-0.5 text-xs text-foreground font-semibold">
          <span className="truncate">{name}</span>
        </div>
        <div className="flex items-center text-xs opacity-60">
          <span className="scale-90">#{characterId}</span>
        </div>
      </div>
    </div>
  );
}
