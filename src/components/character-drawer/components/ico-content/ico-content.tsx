import { useIsMobile } from '@/hooks/use-mobile';
import { verifyAuth } from '@/lib/auth';
import { notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useRef } from 'react';
import { fatchIcoUsersPageData } from '../../service/character';
import { fatchUserIcoData } from '../../service/user';
import { IcoBackground } from '../ico-background';
import { IcoHeader } from '../ico-header';
import { IcoInfo } from '../ico-info';
import { IcoInvestment } from '../ico-investment';
import { IcoUsers } from '../ico-users';

/**
 * ICO 内容
 */
export function IcoContent() {
  const isMobile = useIsMobile(448);
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    icoDrawerData,
    setIcoDrawerData,
  } = useStore();
  const { Id: icoId = 0 } = icoDrawerData.icoDetailData || {};
  const { characterId } = characterDrawer;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharacterDrawer({ handleOnly: !isMobile });
  }, [isMobile]);

  useEffect(() => {
    if (!icoId) return;

    // 检查用户登录状态
    verifyAuth(setUserAssets);
    // 初始化数据
    initializeData();
    // 滚动到顶部
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [icoId, userAssets?.name]);

  /**
   * 初始化数据
   */
  const initializeData = async () => {
    try {
      setCharacterDrawer({ loading: true });

      const userName = userAssets?.name;
      if (!characterId || !icoId || !userName) return;

      const [icoUsersPageData, userIcoData] = await Promise.all([
        fatchIcoUsersPageData(icoId),
        fatchUserIcoData(icoId),
      ]);

      setIcoDrawerData({
        icoUsersPageData,
        userIcoData,
      });
    } catch (error) {
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.error('初始化ICO数据失败');
      }
      notifyError(errorMessage);
      setCharacterDrawer({ error: errorMessage });
    } finally {
      if (icoId) setCharacterDrawer({ loading: false });
    }
  };

  return (
    <div
      ref={contentRef}
      className="flex flex-col w-full h-full pt-2 overflow-y-auto m-scrollbar-none"
    >
      <IcoBackground contentRef={contentRef} />
      <IcoHeader contentRef={contentRef} />
      <div className="border-b border-border/40">
        <IcoInfo />
      </div>
      <div className="flex-1 h-full bg-card">
        <IcoUsers />
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-card m-shadow-card z-10 p-3 rounded-t-md border-t border-border/40">
        <IcoInvestment />
      </div>
    </div>
  );
}
