import { CharacterDetail, TempleItem } from "@/api/character";
import { UserCharacterValue } from "@/api/user";
import { TabsLine, TabsLineContent, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs-line";
import CharacterDrawerAssets from "./character-drawer-assets";

interface CharacterDrawerTabsProps {
  loading: boolean;
  characterDetail: CharacterDetail | null;
  userCharacterData: UserCharacterValue | null;
  myTemple: TempleItem | null;
}
/**
 * 角色详情页的选项卡
 * @param {CharacterDrawerTabsProps} props
 * @param {boolean} props.loading - 是否正在加载
 * @param {CharacterDetail | null} props.characterDetail - 角色详情
 * @param {UserCharacterValue | null} props.userCharacterData - 用户角色数据
 * @param {TempleItem | null} props.myTemple - 用户的圣殿数据
 */
export default function CharacterDrawerTabs({ loading, characterDetail, userCharacterData, myTemple }: CharacterDrawerTabsProps) {

  return (
    <div className="pb-2 bg-background">
      <TabsLine defaultValue="assets">
        <div className="sticky top-7.5 z-10 bg-background border-b border-slate-300/30 dark:border-slate-700/30">
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
          <CharacterDrawerAssets
            loading={loading}
            characterDetail={characterDetail}
            userCharacterData={userCharacterData}
            myTemple={myTemple}
          />
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
