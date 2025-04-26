import { TabsLine, TabsLineContent, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs-line";
import { useStore } from "@/store";
import CharacterDrawerAssets from "./character-drawer-assets";

/**
 * 角色详情页的选项卡
 */
export default function CharacterDrawerTabs() {
  const { characterDrawerData } = useStore();
  const {
    loading = false,
  } = characterDrawerData;

  return (
    <div className="pb-2 bg-card">
      <TabsLine defaultValue="assets">
        <div className="sticky top-7.5 z-10 bg-card border-b border-slate-300/30 dark:border-slate-700/30">
          <TabsLineList className="h-auto rounded-none bg-transparent p-0">
            <TabsLineTrigger value="assets" disabled={loading}>
              资产
            </TabsLineTrigger>
            <TabsLineTrigger value="tab-2" disabled={loading}>
              交易
            </TabsLineTrigger>
            <TabsLineTrigger value="tab-3" disabled={loading}>
              圣殿
            </TabsLineTrigger>
          </TabsLineList>
        </div>
        <TabsLineContent value="assets" className="flex flex-col gap-y-2 px-2">
          <CharacterDrawerAssets />
        </TabsLineContent>
        <TabsLineContent value="tab-2">
          <p className="p-4 text-center text-xs text-muted-foreground">Content for Tab 2</p>
        </TabsLineContent>
        <TabsLineContent value="tab-3">
          <p className="p-4 text-center text-xs text-muted-foreground">Content for Tab 3</p>
        </TabsLineContent>
      </TabsLine>
    </div>
  )
}
