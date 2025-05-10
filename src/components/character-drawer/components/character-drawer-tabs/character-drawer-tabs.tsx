import {
  TabsLine,
  TabsLineContent,
  TabsLineList,
  TabsLineTrigger,
} from '@/components/ui/tabs-line';
import { useStore } from '@/store';
import { CharacterTrading } from '../character-trading';
import { UserAssets } from '../user-assets';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/**
 * 角色抽屉选项卡
 */
export function CharacterDrawerTabs() {
  const isMobile = useIsMobile(448);
  const { characterDrawer } = useStore();
  const { loading = false } = characterDrawer;
  return (
    <div className="pb-2 bg-card">
      <TabsLine defaultValue="assets">
        <div className={cn("sticky z-10 bg-card border-b border-slate-300/30 dark:border-slate-700/30", {
          'top-7': isMobile,
          'top-9': !isMobile
        })}>
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
              value="tab-3"
              disabled={loading}
              className={loading ? undefined : 'cursor-pointer'}
            >
              董事会
            </TabsLineTrigger>
            <TabsLineTrigger
              value="tab-4"
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
        <TabsLineContent value="tab-3">
          <p className="p-4 text-center text-xs text-muted-foreground">
            Content for Tab 3
          </p>
        </TabsLineContent>
        <TabsLineContent value="tab-4">
          <p className="p-4 text-center text-xs text-muted-foreground">
            Content for Tab 4
          </p>
        </TabsLineContent>
      </TabsLine>
    </div>
  );
}
