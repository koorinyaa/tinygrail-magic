import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CharacterContent } from './components/character-content';

/**
 * 角色抽屉
 * @param { HTMLElement | null } container 抽屉容器
 */
export function CharacterDrawer({
  container,
}: {
  container?: HTMLElement | null;
}) {
  const isMobile = useIsMobile(448);
  const { characterDrawer, closeCharacterDrawer, resetCharacterDrawerData } =
    useStore();
  const { open, handleOnly } = characterDrawer;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      resetCharacterDrawerData();
      closeCharacterDrawer();
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? 'bottom' : 'right'}
      handleOnly={handleOnly}
      repositionInputs={false}
      container={container}
    >
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
        <CharacterContent />
      </DrawerContent>
    </Drawer>
  );
}
