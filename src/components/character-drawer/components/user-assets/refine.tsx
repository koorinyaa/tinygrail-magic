import { refine } from '@/api/temple';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  formatCurrency,
  formatInteger,
  notifyError,
  sleep,
} from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'sonner';
import { onTemplesChange } from '../../service/user';
import {
  fetchCharacterDetailData,
  fetchCharacterPoolAmount,
  fetchGensokyoCharacterData,
} from '../../service/character';

/**
 * 精炼
 * @param props
 * @param props.onClose 关闭回调
 */
export function Refine() {
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
    StarForces: starForces = 0,
    Refine: refineLevel = 0,
  } = characterDrawerData.userTempleData || {};
  //精炼次数
  const [refineCount, setRefineCount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  /**
   * 精炼
   */
  const handleRefine = async () => {
    if (!characterDrawer.characterId || !userAssets?.name) return;

    setLoading(true);
    try {
      // 验证用户是否登录
      verifyAuth(setUserAssets);

      // 成功次数
      let count = 0;
      // 最后一次成功信息
      let lastMessage = '';

      for (let i = 0; i < refineCount; i++) {
        const result = await refine(characterDrawer.characterId);
        if (result.State === 0) {
          count++;
          lastMessage = result.Value || '';
          if (result.Value.includes('失败')) {
            toast.warning('精炼失败', {
              description: `共精炼${count}次，${result.Value}`,
            });
            return;
          }
        } else {
          toast.warning('精炼中断', {
            description: `共精炼${count}次，${result.Message}`,
          });
          return;
        }

        //等待100毫秒
        await sleep(100);
      }

      toast.success('精炼成功', {
        description: lastMessage,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '精炼过程中出现错误';
      notifyError(errorMessage);
    } finally {
      setLoading(false);

      // 圣殿变化更新相关数据
      onTemplesChange(
        characterDrawer.characterId,
        userAssets.name,
        setCharacterDrawerData
      );

      // 获取幻想乡数据
      const gensokyoCharacterData = await fetchGensokyoCharacterData(
        characterDrawer.characterId
      );
      // 获取奖池数量
      const characterPoolAmount = await fetchCharacterPoolAmount(
        characterDrawer.characterId
      );

      // 获取角色详情
      const characterDetailData = await fetchCharacterDetailData(
        characterDrawer.characterId
      );

      setCharacterDrawerData({
        gensokyoCharacterData,
        characterPoolAmount,
        characterDetailData,
      });

      // 更新余额
      verifyAuth(setUserAssets);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-2">
      <div
        className={cn('flex flex-row gap-x-2 text-xs', {
          hidden: sacrifices <= 0,
        })}
        title="圣殿"
      >
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row">
            <span
              className={cn('flex-1', {
                'text-gray-500 dark:text-gray-600': templeLevel <= 0,
                'text-green-500 dark:text-green-600': templeLevel === 1,
                'text-purple-500 dark:text-purple-600': templeLevel === 2,
                'text-amber-500 dark:text-amber-600': templeLevel === 3,
              })}
            >
              {formatInteger(assets)} / {formatInteger(sacrifices)}
            </span>
            {starForces >= 10000 && (
              <div
                className="w-fit text-amber-300 dark:text-amber-500"
                title="已冲星"
              >
                <AiFillStar className="size-3" />
              </div>
            )}
          </div>
          <Progress
            value={(assets / sacrifices) * 100}
            indicatorColor={cn({
              'bg-gray-500': templeLevel <= 0,
              'bg-green-500 dark:bg-green-600': templeLevel === 1,
              'bg-purple-500 dark:bg-purple-600': templeLevel === 2,
              'bg-amber-500 dark:bg-amber-600': templeLevel === 3,
            })}
            className="h-1"
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 text-xs">
        <span className="flex-1">
          精炼等级
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(refineLevel)}
          </span>
        </span>
        <span className="flex-1">
          余额
          <span className="ml-2 text-green-400 dark:text-green-600">
            ₵{formatCurrency(userAssets?.balance || 0, { useWUnit: true })}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-y-2 mt-1">
        <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
          <div className="w-24 text-sm opacity-60">次数</div>
          <InputNumber
            value={refineCount}
            onChange={(value) => {
              setRefineCount(Math.floor(value) || 0);
            }}
            minValue={0}
            maxValue={Math.max(0, assets - 2500 + 1)}
            className="flex-1"
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <span className="text-xs text-amber-400 dark:text-amber-600">
          连续精炼{refineCount}次，失败停止
        </span>
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <Button
          className="w-full h-8 rounded-full"
          disabled={loading}
          onClick={handleRefine}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          精炼
        </Button>
      </div>
    </div>
  );
}
