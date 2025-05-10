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

  /**
   * 点击查看用户持股数
   */
  const fatchUserCharacterData = async () => {
    if (!characterDrawer.characterId) return;
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
    }
  };
  return (
    <div className="flex flex-row gap-x-1.5">
      <Avatar className="size-10 rounded-full border-2 border-secondary">
        <AvatarImage
          className="object-cover object-top pointer-events-none"
          src={getAvatarUrl(userData.Avatar)}
        />
        <AvatarFallback className="rounded-full">U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center gap-y-0.5 text-xs overflow-hidden">
        <div className="flex flex-row gap-x-1 truncate">
          <span className="opacity-60">{index === 1 ? '主席' : index}</span>
          {decodeHTMLEntities(userData.Nickname)}
        </div>
        <Badge
          variant="secondary"
          className={cn('px-1 py-0 rounded-sm', {
            'cursor-pointer': userData.Balance <= 0,
          })}
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
            '点击查看'
          )}
        </Badge>
      </div>
    </div>
  );
}
