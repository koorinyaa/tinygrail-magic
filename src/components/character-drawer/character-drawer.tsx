import { IcoContent } from '@/components/character-drawer/components/ico-content';
import { fetchCharacterDetailData } from '@/components/character-drawer/service/character';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect } from 'react';
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
  const {
    characterDrawer,
    setCharacterDrawer,
    closeCharacterDrawer,
    setCharacterDrawerData,
    setIcoDrawerData,
  } = useStore();
  const { open, handleOnly, type: characterType } = characterDrawer;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeCharacterDrawer();
    }
  };

  useEffect(() => {
    initializeData();
  }, [characterDrawer.characterId]);

  /**
   * 初始化数据
   */
  const initializeData = async () => {
    if (!characterDrawer.characterId) return;

    try {
      const characterDetailData = await fetchCharacterDetailData(
        characterDrawer.characterId
      );
      if ('Current' in characterDetailData) {
        // 已上市
        setCharacterDrawer({
          type: 'character',
        });
        setCharacterDrawerData({
          characterDetailData,
        });
      } else {
        // ico
        setCharacterDrawer({
          type: 'ico',
        });
        setIcoDrawerData({
          icoDetailData: characterDetailData,
        });
      }
    } catch (error) {
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.error('初始化角色数据失败');
      }
      notifyError(errorMessage);
      setCharacterDrawer({ error: errorMessage });
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
        {characterType === 'character' ? <CharacterContent /> : <IcoContent />}
      </DrawerContent>
    </Drawer>
  );
}
