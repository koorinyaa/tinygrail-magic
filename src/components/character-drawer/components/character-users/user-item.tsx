import { CharacterUserValue } from '@/api/character';
import { getUserCharacterData } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  cn,
  decodeHTMLEntities,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * 持股用户Item
 * @param props 参数
 * @param props.data 数据
 * @param props.characterTotal 流通量
 * @param props.index 序号
 */
export function UserItem({
  data,
  characterTotal,
  index,
}: {
  data: CharacterUserValue;
  characterTotal: number;
  index: number;
}) {
  const { characterDrawer } = useStore();
  const [userData, setUserData] = useState<CharacterUserValue>({ ...data });
  const [loading, setLoading] = useState(false);

  /**
   * 点击查看用户持股数
   */
  const fatchUserCharacterData = async () => {
    if (!characterDrawer.characterId) return;

    setLoading(true);
    try {
      const resp = await getUserCharacterData(
        characterDrawer.characterId,
        data.Name
      );
      if (resp.State === 0) {
        setUserData({ ...userData, Balance: resp.Value.Total });
      } else {
        throw new Error(resp.Message || '获取用户持股数失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '获取用户持股数失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 判断用户是否活跃
   */
  const isActive = (LastActiveDate: string) => {
    const date = new Date(LastActiveDate);

    // 日期无效
    if (isNaN(date.getTime())) {
      return false;
    }
    // 封禁状态
    if (data.State === 666) {
      return false;
    }

    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff < 5;
  };

  return (
    <div className="flex flex-row gap-x-1.5">
      <div className="relative">
        <Avatar
          className={cn('size-10 rounded-full border-2 border-secondary', {
            'border-red-600': userData.State === 666,
          })}
        >
          <AvatarImage
            className="object-cover object-top pointer-events-none"
            src={getAvatarUrl(userData.Avatar)}
          />
          <AvatarFallback className="rounded-full">U</AvatarFallback>
        </Avatar>
        {userData.LastIndex > 0 && (
          <Badge className="bg-yellow-500 dark:bg-yellow-600 text-white absolute -top-1.5 -left-2.5 size-7 rounded-full border-2 border-card px-1 scale-70">
            #{userData.LastIndex}
          </Badge>
        )}
      </div>
      <div className="flex flex-col justify-center gap-y-0.5 text-xs overflow-hidden">
        <div className="flex flex-row gap-x-1">
          <span className="opacity-60 text-nowrap">
            {index === 1 ? '主席' : index}
          </span>
          <span
            className={cn('truncate', {
              'text-red-600': userData.State === 666,
            })}
          >
            {decodeHTMLEntities(userData.Nickname)}
          </span>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'flex items-center justify-center px-1.5 py-0 h-4 rounded-sm',
            {
              'cursor-pointer': userData.Balance <= 0,
              'bg-purple-400 dark:bg-purple-700 text-purple-800 dark:text-purple-200':
                index <= 10 && isActive(userData.LastActiveDate),
              'bg-amber-400 dark:bg-amber-700 text-amber-800 dark:text-amber-200':
                index === 1 && isActive(userData.LastActiveDate),
              'bg-green-400 dark:bg-green-700 text-green-800 dark:text-green-200':
                index > 10 && isActive(userData.LastActiveDate),
            }
          )}
          onClick={() => {
            if (userData.Balance <= 0) {
              fatchUserCharacterData();
            }
          }}
        >
          {userData.Balance > 0 ? (
            <span>
              <span>{formatInteger(userData.Balance)}</span>
              <span className="ml-1.5">
                {((userData.Balance / characterTotal) * 100).toFixed(2)}%
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center min-w-12">
              <LoaderCircleIcon
                className={cn('-ms-1 animate-spin', { hidden: !loading })}
                size={12}
                aria-hidden="true"
              />
              <span
                className={cn({
                  hidden: loading,
                })}
              >
                点击查看
              </span>
            </span>
          )}
        </Badge>
      </div>
    </div>
  );
}
