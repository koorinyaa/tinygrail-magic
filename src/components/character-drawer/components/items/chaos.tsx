import { useChaos } from '@/api/magic-item';
import { Button } from '@/components/ui/button';
import { verifyAuth } from '@/lib/auth';
import {
    cn,
    decodeHTMLEntities,
    formatCurrency,
    notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    fatchTinygrailCharacterData,
    fetchCharacterPoolAmount,
    fetchGensokyoCharacterData,
} from '../../service/character';
import { onActiveStockChange, onTemplesChange } from '../../service/user';

/**
 * 混沌魔方
 * @param {() => void} onClose 关闭回调
 */
export function Chaos({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setUserAssets,
    openCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { characterDetailData } = characterDrawerData;
  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 使用混沌魔方
   */
  const handleUseChaos = async () => {
    if (!userAssets || !characterDetailData) return;

    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const response = await useChaos(characterDetailData.CharacterId);
      if (response.State === 0) {
        const {
          // 角色ID
          Id,
          // 角色名称
          Name,
          // 数量
          Amount,
          // 买一价
          SellPrice,
        } = response.Value;
        toast.success('使用成功', {
          duration: Infinity,
          cancel: {
            label: '查看',
            onClick: () => {
              openCharacterDrawer(Id);
            },
          },
          description: (
            <span>
              <span>
                获得#{Id}「{decodeHTMLEntities(Name)}」
                <span className='mr-0.5 text-green-400 dark:text-green-600"'>
                  {Amount}
                </span>
                股
              </span>
              <br />
              <span>
                当前买一价
                <span className='mx-0.5 text-green-400 dark:text-green-600"'>
                  ₵{formatCurrency(SellPrice)}
                </span>
              </span>
            </span>
          ),
        });
        onClose();

        // 圣殿变化更新相关数据
        await onTemplesChange(
          characterDetailData.CharacterId,
          userAssets.name,
          setCharacterDrawerData
        );

        // 如果当前角色是目标角色，则更新角色数据
        if (characterDetailData.CharacterId === Id) {
          // 活股变化更新相关数据
          await onActiveStockChange(
            characterDetailData.CharacterId,
            userAssets.name,
            characterDrawerData.currentCharacterUsersPage || 1,
            setCharacterDrawerData
          );

          // 获取幻想乡数据
          const gensokyoCharacterData = await fetchGensokyoCharacterData(
            characterDetailData.CharacterId
          );
          // 获取英灵殿数据
          const tinygrailCharacterData = await fatchTinygrailCharacterData(
            characterDetailData.CharacterId
          );
          // 获取奖池数量
          const characterPoolAmount = await fetchCharacterPoolAmount(
            characterDetailData.CharacterId
          );
          setCharacterDrawerData({
            gensokyoCharacterData,
            tinygrailCharacterData,
            characterPoolAmount,
          });
        }
      } else {
        onClose();
        throw new Error(response.Message || '混沌魔方使用失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '混沌魔方使用失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-4 items-center">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-lg font-semibold">提示</h2>
        <p className="text-sm text-muted-foreground">
          是否消耗「{characterDetailData?.Name}」10点固定资产值使用混沌魔方？
        </p>
      </div>
      <div className="flex-1 flex flex-row w-full gap-x-2">
        <Button
          className="flex-1 h-8 rounded-full"
          disabled={loading}
          onClick={handleUseChaos}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          确定
        </Button>
        <Button
          className="flex-1 h-8 rounded-full"
          variant="secondary"
          disabled={loading}
          onClick={onClose}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          取消
        </Button>
      </div>
    </div>
  );
}
