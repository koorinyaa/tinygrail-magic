import { CharacterDetail } from '@/api/character';
import { StarLevel } from '@/components/star-level';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { getAvatarUrl, cn, formatInteger, decodeHTMLEntities } from '@/lib/utils';
import { useStore } from '@/store';

/**
 * 通天塔角色项
 */
export function StarTowerItem({ data }: { data: CharacterDetail }) {
  const { openCharacterDrawer } = useStore();
  return (
    <HoverCard openDelay={100} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div
          className="relative aspect-square w-full bg-cover bg-top border border-card overflow-hidden cursor-pointer"
          style={{
            backgroundImage: `url(${getAvatarUrl(data.Icon)})`,
          }}
          onClick={() => {
            openCharacterDrawer(data.CharacterId);
          }}
        >
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-8',
              'bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white'
            )}
          >
            <div className="absolute bottom-0 w-full px-0.5 pt-4 pb-0.5 text-xs truncate">
              {decodeHTMLEntities(data.Name)}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-y-1 w-fit p-3">
        <div className="text-sm">第{data.Rank}位</div>
        <div className="text-sm">
          #{data.CharacterId}「{data.Name}」
        </div>
        <div className="text-sm">
          星之力 +{formatInteger(data.StarForces, true)}
        </div>
        <div className="flex flex-row flex-wrap gap-x-0.5 text-amber-300 dark:text-amber-500">
          <StarLevel level={data.Stars} size={4} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
