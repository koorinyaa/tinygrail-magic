import { IcoUserItem } from '@/api/character';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  getAvatarUrl,
} from '@/lib/utils';

/**
 * ico用户Item
 * @param props 参数
 * @param props.data 数据
 * @param props.index 序号
 */
export function UserItem({
  data,
  index,
}: {
  data: IcoUserItem;
  index: number;
}) {
  return (
    <div className="flex flex-row gap-x-1.5">
      <div className="relative">
        <Avatar
          className={cn('size-10 rounded-full border-2 border-secondary', {
            'border-red-600': data.State === 666,
          })}
        >
          <AvatarImage
            className="object-cover object-top pointer-events-none"
            src={getAvatarUrl(data.Avatar)}
          />
          <AvatarFallback className="rounded-full">U</AvatarFallback>
        </Avatar>
        {data.LastIndex > 0 && (
          <Badge className="bg-yellow-500 dark:bg-yellow-600 text-white absolute -top-1.5 -left-2.5 size-7 rounded-full border-2 border-card px-1 scale-70">
            #{data.LastIndex}
          </Badge>
        )}
      </div>
      <div className="flex flex-col justify-center gap-y-0.5 text-xs overflow-hidden">
        <div className="flex flex-row gap-x-1">
          <span className="opacity-60 text-nowrap">{index}</span>
          <span className="truncate">{decodeHTMLEntities(data.NickName)}</span>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'flex items-center justify-center px-1.5 py-0 h-4 rounded-sm'
          )}
        >
          <span>
            <span>+{data.Amount > 0 ? formatInteger(data.Amount) : '???'}</span>
          </span>
        </Badge>
      </div>
    </div>
  );
}
