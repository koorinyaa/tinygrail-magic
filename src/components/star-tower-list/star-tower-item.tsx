import { CharacterDetail } from '@/api/character';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  getAvatarUrl,
} from '@/lib/utils';
import { useStore } from '@/store';
import { Sparkles } from 'lucide-react';

/**
 * 通天塔角色项
 */
export function StarTowerItem({ data }: { data: CharacterDetail }) {
  const { openCharacterDrawer } = useStore();
  return (
    <div
      className={cn(
        'group relative aspect-square w-full bg-cover bg-top border border-card',
        'overflow-visible cursor-pointer'
      )}
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
          'bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white',
          'group-hover:opacity-0 transition-all duration-300'
        )}
      >
        <div className="absolute bottom-0 w-full px-0.5 pt-4 pb-0.5 text-xs truncate">
          {decodeHTMLEntities(data.Name)}
        </div>
      </div>
      <div
        className={cn(
          'absolute bottom-0 top-0 left-0 right-0 p-1',
          'flex flex-col gap-y-0.5 items-center justify-center',
          'backdrop-blur-xs text-white/90 bg-black/40',
          'opacity-0 group-hover:opacity-100 transition-all duration-300'
        )}
      >
        <div className="w-full flex items-center justify-center overflow-hidden">
          <div className="text-xs truncate">第{data.Rank}位</div>
        </div>
        <div className="w-full flex items-center justify-center overflow-hidden">
          <div className="text-xs font-semibold truncate">
            {decodeHTMLEntities(data.Name)}
          </div>
        </div>
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          title={`星之力 ${formatInteger(data.StarForces)}`}
        >
          <div className="flex flex-row gap-x-0.5 items-center justify-center text-xs text-amber-500 overflow-hidden">
            <Sparkles className="size-3 shrink-0" />
            <span className="truncate">
              {formatInteger(data.StarForces, true)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
