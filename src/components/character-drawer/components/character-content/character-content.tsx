import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef } from 'react';
import {
  fatchTinygrailCharacterData,
  fetchCharacterLinkItems,
  fetchCharacterPoolAmount,
  fetchCharacterTempleItems,
  fetchCharacterUsersPageData,
  fetchGensokyoCharacterData,
} from '../../service/character';
import { fetchUserCharacterData, getUserTempleData } from '../../service/user';
import { CharacterBackground } from '../character-background/character-background';
import { CharacterHeader } from '../character-header';
import { CharacterInfo } from '../character-info';
import { CharacterDrawerTabs } from '../character-drawer-tabs';

/**
 * 角色内容
 */
export function CharacterContent() {
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    setCharacterDrawerData,
  } = useStore();
  const { characterId } = characterDrawer;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检查用户登录状态
    verifyAuth(setUserAssets);
    // 初始化数据
    initializePrimaryData();
    // 滚动到顶部
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [characterId, userAssets?.name]);

  /**
   * 初始化主要数据
   */
  const initializePrimaryData = async () => {
    try {
      setCharacterDrawer({ loading: true });

      const userName = userAssets?.name;
      if (!characterId || !userName) return;

      const [
        characterTempleItems,
        characterLinkItems,
        characterUsersPageData,
        userCharacterData,
      ] = await Promise.all([
        fetchCharacterTempleItems(characterId),
        fetchCharacterLinkItems(characterId),
        fetchCharacterUsersPageData(characterId, 1),
        fetchUserCharacterData(characterId, userName),
      ]);

      const userTempleData = await getUserTempleData(
        userCharacterData,
        characterTempleItems,
        characterLinkItems,
        userName
      );

      setCharacterDrawerData({
        characterTempleItems,
        characterLinkItems,
        characterUsersPageData,
        characterBoardMemberItems: characterUsersPageData.Items.slice(0, 10),
        userCharacterData,
        userTempleData,
      });

      initializeSecondaryData();
    } catch (error) {
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.error('初始化角色主要数据失败：未知错误');
      }
      notifyError(errorMessage);
      setCharacterDrawer({ error: errorMessage });
    } finally {
      setCharacterDrawer({ loading: false });
    }
  };

  /**
   * 初始化次要数据
   */
  const initializeSecondaryData = async () => {
    try {
      if (!characterId) return;

      const [
        gensokyoCharacterData,
        tinygrailCharacterData,
        characterPoolAmount,
      ] = await Promise.all([
        fetchGensokyoCharacterData(characterId),
        fatchTinygrailCharacterData(characterId),
        fetchCharacterPoolAmount(characterId),
      ]);

      setCharacterDrawerData({
        gensokyoCharacterData,
        tinygrailCharacterData,
        characterPoolAmount,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('初始化角色次要数据失败：未知错误');
      }
    }
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        'w-full pt-2 overflow-y-auto m-scrollbar-none',
      )}
    >
      <CharacterBackground contentRef={contentRef} />
      <CharacterHeader contentRef={contentRef} />
      <CharacterInfo />
      <CharacterDrawerTabs />
    </div>
  );
}
