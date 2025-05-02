import { CurrentTopWeekItem } from '@/api/character';
import { cn, getAvatarUrl, getCoverUrl, isEmpty } from '@/lib/utils';

/**
 * 封面区域组件
 * @param props
 * @param {CurrentTopWeekItem} props.data - 角色数据
 * @param {number} props.rank - 排名
 */
export function Cover({ data, rank }: { data: CurrentTopWeekItem; rank: number }) {
  const { Avatar: avatar, Cover: cover } = data;

  return (
    <div className={cn('w-full', cover && 'cursor-pointer')}>
      <img
        src={cover ? getCoverUrl(cover, 'medium') : getAvatarUrl(avatar)}
        className={cn('w-full aspect-[3/4] object-cover pointer-events-none', {
          'blur-lg': isEmpty(cover),
        })}
      />
      {!cover && (
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-2/3 justify-center items-center 
                w-1/2 min-w-16 aspect-square rounded-full overflow-hidden bg-cover bg-top"
          style={{ backgroundImage: `url('${getAvatarUrl(avatar)}')` }}
        />
      )}
      <div
        className={cn(
          'absolute left-0 top-0 flex items-center justify-center size-6 pb-0.5 pr-0.5',
          'text-white text-xs font-bold font-mono',
          'rounded-br-full',
          {
            'bg-amber-500 dark:bg-amber-600': rank <= 3,
            'bg-purple-500 dark:bg-purple-600': rank > 3 && rank <= 6,
            'bg-green-500 dark:bg-green-600': rank > 6,
          }
        )}
      >
        {rank}
      </div>
    </div>
  );
}
