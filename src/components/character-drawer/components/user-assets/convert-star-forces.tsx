import { convertStarForces, sacrificeCharacter } from '@/api/temple';
import {
  fatchTinygrailCharacterData,
  fetchCharacterPoolAmount,
} from '@/components/character-drawer/service/character';
import {
  onActiveStockChange,
  onTemplesChange,
} from '@/components/character-drawer/service/user';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn, formatInteger, notifyError, sleep } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'sonner';

export function ConvertStarForces({ onClose }: { onClose: () => void }) {
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
  } = characterDrawerData.userTemple || {};
  const { Amount: amount = 0 } = characterDrawerData.userCharacterData || {};
  const { characterId } = characterDrawer || {};
  const [loading, setLoading] = useState(false);
  // 转换数量
  const [convertCount, setConvertCount] = useState(0);
  // 提示消息
  const [message, setMessage] = useState<JSX.Element | string>('');
  // 冲星开关
  const [isStar, setIsStar] = useState(false);
  // 冲星所需的固定资产余量
  const [requiredTempleAmount, setRequiredTempleAmount] = useState(0);
  // 冲星所需的活股数量
  const [requiredStockAmount, setRequiredStockAmount] = useState(0);

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

  useEffect(() => {
    const requiredStarForces = Math.max(0, 10000 - starForces);
    if (requiredStarForces <= 0) {
      setRequiredTempleAmount(0);
      setRequiredStockAmount(0);
    } else {
      if (assets >= requiredStarForces) {
        setRequiredTempleAmount(requiredStarForces);
        setRequiredStockAmount(0);
      } else {
        setRequiredTempleAmount(assets);
        setRequiredStockAmount(Math.ceil((requiredStarForces - assets) / 2));
      }
    }
  }, [assets, starForces]);

  /**
   * 冲星开关变化
   */
  const isStarOnChange = (value: boolean) => {
    setIsStar(value);
    if (value) {
      const needStarForces = Math.max(0, 10000 - starForces);
      if (needStarForces <= 0) {
        setMessage('已经冲过星了');
      } else {
        let message = (
          <span>
            预计消耗
            <span className="px-1 text-green-400 dark:text-green-600">
              {formatInteger(requiredTempleAmount, true)}
            </span>
            固定资产和
            <span className="px-1 text-green-400 dark:text-green-600">
              {formatInteger(requiredStockAmount, true)}
            </span>
            活股
            {amount < requiredStockAmount && assets >= requiredTempleAmount && (
              <span>，可用活股数量不足</span>
            )}
            {assets < requiredTempleAmount && amount >= requiredStockAmount && (
              <span>，可用固定资产余量不足</span>
            )}
            {assets < requiredTempleAmount && amount < requiredStockAmount && (
              <span>，可用固定资产余量不足和活股数量不足</span>
            )}
          </span>
        );
        setMessage(message);
      }
    } else {
      setMessage('');
    }
  };

  /**
   * 转换星之力
   */
  const handleConvertStarForces = async () => {
    if (!characterId || !characterDrawerData.userTemple || !userAssets?.name)
      return;

    setLoading(true);
    try {
      const result = await convertStarForces(characterId, convertCount);

      if (result.State === 0) {
        toast.success(result.Value || '星之力转换成功');
        onClose();

        // 获取圣殿变化相关数据
        const {
          characterTemplesData,
          characterLinksData,
          userTempleData,
          userCharacterData,
          characterDetailData,
        } = await onTemplesChange(characterId, userAssets.name);

        setCharacterDrawerData({
          characterTemples: characterTemplesData,
          characterlinks: characterLinksData,
          userTemple: userTempleData,
          userCharacterData,
          characterDetail: characterDetailData,
        });
      } else {
        throw new Error(result.Message || '星之力转换失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '星之力转换失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 冲星
   */
  const handleFillStar = async () => {
    if (!characterId || !characterDrawerData.userTemple || !userAssets?.name)
      return;

    if (assets < requiredTempleAmount || amount < requiredStockAmount) {
      toast.warning('固定资产或活股数量不足');
      return;
    }

    setLoading(true);
    try {
      // 先转换固定资产为星之力
      if (requiredTempleAmount > 0) {
        const result = await convertStarForces(
          characterId,
          requiredTempleAmount
        );
        if (result.State !== 0) {
          throw new Error(result.Message || '冲星时发生错误');
        }

        //等待100毫秒
        await sleep(100);
      }

      // 循环活股补塔冲星
      if (requiredStockAmount > 0) {
        // 剩余需要使用的活股数量
        let remainingRequiredStockAmount = requiredStockAmount;
        // 计算单次最多可补塔数量
        const singleMaxQuantity = Math.floor(sacrifices / 2);
        while (remainingRequiredStockAmount > 0) {
          // 每次补塔数量
          const singleQuantity = Math.min(
            singleMaxQuantity,
            remainingRequiredStockAmount
          );

          // 补塔
          const sacrificeResult = await sacrificeCharacter(
            characterId,
            singleQuantity,
            false
          );
          if (sacrificeResult.State !== 0) {
            throw new Error(sacrificeResult.Message || '冲星时发生错误');
          }
          //等待100毫秒
          await sleep(100);

          // 转换星之力
          const convertStarForcesResult = await convertStarForces(
            characterId,
            singleQuantity * 2
          );
          if (convertStarForcesResult.State !== 0) {
            throw new Error(
              convertStarForcesResult.Message || '冲星时发生错误'
            );
          }
          //等待100毫秒
          await sleep(100);

          remainingRequiredStockAmount -= singleQuantity;
        }
      }

      toast.success('冲星成功');
      onClose();

      // 获取活股变化相关数据
      const {
        userCharacterData,
        characterBoardMembersData,
        characterUsersPageData,
      } = await onActiveStockChange(
        characterId,
        userAssets.name,
        characterDrawerData.currentCharacterUserPage || 1
      );

      // 获取圣殿变化相关数据
      const {
        characterTemplesData,
        characterLinksData,
        userTempleData,
        characterDetailData,
      } = await onTemplesChange(characterId, userAssets.name);

      // 获取英灵殿数据
      const tinygrailCharacterData = await fatchTinygrailCharacterData(
        characterId
      );

      // 获取奖池数量
      const characterPoolAmount = await fetchCharacterPoolAmount(characterId);

      setCharacterDrawerData({
        userCharacterData,
        characterBoardMembers: characterBoardMembersData,
        currentCharacterUserPageData: characterUsersPageData,
        characterTemples: characterTemplesData,
        characterlinks: characterLinksData,
        userTemple: userTempleData,
        characterDetail: characterDetailData,
        tinygrailCharacterData,
        characterPoolAmount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '冲星时发生错误';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
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
          贡献星之力
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(starForces, true)}
          </span>
        </span>
        <span className="flex-1">
          可用活股
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(amount)}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-y-2 mt-1">
        {!isStar && (
          <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
            <div className="w-24 text-sm opacity-60">转换数量</div>
            <InputNumber
              value={convertCount}
              onChange={(value) => {
                setConvertCount(Math.floor(value) || 0);
              }}
              minValue={0}
              maxValue={Math.max(0, assets)}
            />
          </div>
        )}
        {starForces < 10000 && (
          <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
            <div className="w-24 text-sm opacity-60">冲星</div>
            <div className="flex-1 flex justify-end">
              <Switch checked={isStar} onCheckedChange={isStarOnChange} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <span className="text-xs text-amber-400 dark:text-amber-600">
          {message}
        </span>
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <Button
          className="flex-1 w-full h-8 rounded-full"
          disabled={
            loading ||
            (isStar &&
              (assets < requiredTempleAmount || amount < requiredStockAmount))
          }
          onClick={() => {
            if (isStar) {
              handleFillStar();
            } else {
              handleConvertStarForces();
            }
          }}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          {isStar ? '冲星' : '转换'}
        </Button>
        <Button
          className="flex-1 w-full h-8 rounded-full"
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
