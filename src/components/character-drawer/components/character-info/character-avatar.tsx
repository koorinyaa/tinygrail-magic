import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DrawerContent,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, getAvatarUrl } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState } from 'react';
import { ModifyAvatar } from './modify-avatar';

/**
 * 角色头像
 */
export function CharacterAvatar() {
  const isMobile = useIsMobile(448);
  const { characterDrawerData } = useStore();
  const { Icon: src = '', Name: name = '' } =
    characterDrawerData.characterDetailData || {};
  const [handleOnly, setHandleOnly] = useState(false);

  return (
    <DrawerNested
      direction={isMobile ? 'bottom' : 'right'}
      handleOnly={handleOnly}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        <div
          className="relative flex size-16 shrink-0 items-center justify-center rounded-full cursor-pointer z-10"
          aria-hidden="true"
          id="avatar"
        >
          <Avatar className="size-16 rounded-full border-2 border-secondary">
            <AvatarImage
              className="object-cover object-top pointer-events-none"
              src={getAvatarUrl(src)}
              alt={name}
            />
            <AvatarFallback className="rounded-full">C</AvatarFallback>
          </Avatar>
        </div>
      </DrawerTrigger>
      <DrawerContent
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        className={cn('bg-card border-none overflow-hidden', {
          'max-w-96 rounded-l-md': !isMobile,
          '!max-h-[90dvh] max-h-[90vh]': isMobile,
        })}
      >
        <VisuallyHidden asChild>
          <DrawerTitle />
        </VisuallyHidden>
        <ModifyAvatar setHandleOnly={setHandleOnly}/>
      </DrawerContent>
    </DrawerNested>
  );
}
