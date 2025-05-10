import {
  TabsLine,
  TabsLineContent,
  TabsLineList,
  TabsLineTrigger,
} from '@/components/ui/tabs-line';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { CharacterTemples } from '../character-temples';
import { CharacterTrading } from '../character-trading';
import { CharacterUsers } from '../character-users';
import { UserAssets } from '../user-assets';
import { useEffect, useState } from 'react';

/**
 * 角色抽屉选项卡
 */
export function CharacterDrawerTabs() {
  const isMobile = useIsMobile(448);
  const { characterDrawer } = useStore();
  const { loading = false } = characterDrawer;
  const [currentTab, setCurrentTab] = useState<
    'assets' | 'deal' | 'users' | 'temples'
  >('assets');

  useEffect(() => {
    if (characterDrawer.open) {
      setCurrentTab('assets');
    }
  }, [characterDrawer.characterId]);

  return (
    <div className="pb-2 bg-card">
      <TabsLine
        defaultValue="assets"
        value={currentTab}
        onValueChange={(value) =>
          setCurrentTab(value as 'assets' | 'deal' | 'users' | 'temples')
        }
      >
        <div
          className={cn(
            'sticky z-10 bg-card border-b border-slate-300/30 dark:border-slate-700/30',
            {
              'top-7': isMobile,
              'top-9': !isMobile,
            }
          )}
        >
          <TabsLineList className="h-auto rounded-none bg-transparent p-0">
            <TabsLineTrigger
              value="assets"
              disabled={loading}
              className={loading ? undefined : 'cursor-pointer'}
            >
              资产
            </TabsLineTrigger>
            <TabsLineTrigger
              value="deal"
              disabled={loading}
              className={loading ? undefined : 'cursor-pointer'}
            >
              交易
            </TabsLineTrigger>
            <TabsLineTrigger
              value="users"
              disabled={loading}
              className={loading ? undefined : 'cursor-pointer'}
            >
              董事会
            </TabsLineTrigger>
            <TabsLineTrigger
              value="temples"
              disabled={loading}
              className={loading ? undefined : 'cursor-pointer'}
            >
              圣殿
            </TabsLineTrigger>
          </TabsLineList>
        </div>
        <TabsLineContent value="assets" className="flex flex-col gap-y-2 px-2">
          <UserAssets />
        </TabsLineContent>
        <TabsLineContent value="deal">
          <CharacterTrading />
        </TabsLineContent>
        <TabsLineContent value="users">
          <CharacterUsers />
        </TabsLineContent>
        <TabsLineContent value="temples">
          <CharacterTemples />
        </TabsLineContent>
      </TabsLine>
    </div>
  );
}
