import { sacrificeCharacter } from '@/api/temples';
import { InputNumber } from '@/components/input-number';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  cn,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'sonner';
import {
  fatchTinygrailCharacterData,
  fetchCharacterPoolAmount,
  fetchGensokyoCharacterData,
} from '../../service/character';
import { onActiveStockChange, onTemplesChange } from '../../service/user';

/**
 * 资产重组
 * @param props
 * @param {() => void} props.onClose 关闭回调
 */
export function AssetRestructure({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const { name = '' } = userAssets || {};
  const {
    userCharacterData,
    userTemple,
    currentCharacterUserPage = 0,
  } = characterDrawerData;
  const { Total: total = 0, Amount: amount = 0 } = userCharacterData || {};
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Level: templeLevel = 0,
    StarForces: starForces = 0,
  } = userTemple || {};
  // 当前选中的标签页
  const [activeTab, setActiveTab] = useState<'temple' | 'financing'>('temple');
  // 献祭数量
  const [convertAmount, setConvertAmount] = useState(
    sacrifices >= 500 ? 0 : Math.min(100, amount)
  );
  // 股权融资数量
  const [financingAmount, setFinancingAmount] = useState(
    sacrifices >= 500 ? 0 : Math.min(100, amount)
  );

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
   * 献祭
   * @param amount 数量
   */
  const handleSacrifice = async (amount: number) => {
    try {
      const characterId = characterDrawerData.characterDetail?.CharacterId;
      if (!characterId) return;

      const result = await sacrificeCharacter(characterId, amount, false);

      if (result.State === 0) {
        const { Balance: balance = 0, Items: items = [] } = result.Value;

        const description = (
          <span>
            <span className="mr-1">获得</span>
            <span className="text-green-400 dark:text-green-600 mr-2">
              ₵{formatCurrency(balance, { useWUnit: true })}
            </span>
            {items.length > 0 && (
              <span>
                {items.map((item, index) => (
                  <span key={index} className="inline-flex items-center mr-2">
                    <div
                      className="inline-flex size-3 bg-cover bg-center rounded-full mr-1"
                      style={{
                        backgroundImage: `url('${getAvatarUrl(item.Icon)}')`,
                      }}
                    />
                    {item.Name}×{item.Count}
                  </span>
                ))}
              </span>
            )}
          </span>
        );
        toast.success('献祭成功', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description,
        });
        onClose();

        // 获取活股变化相关数据
        const {
          userCharacterData,
          characterBoardMembersData,
          characterUsersPageData,
        } = await onActiveStockChange(
          characterId,
          name,
          currentCharacterUserPage
        );

        // 获取圣殿变化相关数据
        const {
          characterTemplesData,
          characterLinksData,
          userTempleData,
          characterDetailData,
        } = await onTemplesChange(characterId, name);

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
      } else {
        throw new Error(result.Message || '献祭失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '献祭失败';
      notifyError(errorMessage);
    }
  };

  /**
   * 股权融资
   * @param amount 数量
   */
  const handleFinancing = async (amount: number) => {
    try {
      const characterId = characterDrawerData.characterDetail?.CharacterId;
      if (!characterId) return;

      const result = await sacrificeCharacter(characterId, amount, true);

      if (result.State === 0) {
        const { Balance: balance = 0 } = result.Value;

        const description = (
          <span>
            <span className="mr-1">获得</span>
            <span className="text-green-400 dark:text-green-600 mr-1">
              ₵{formatCurrency(balance, { useWUnit: true })}
            </span>
          </span>
        );
        toast.success('股权融资成功', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description,
        });
        onClose();

        // 获取活股变化相关数据
        const {
          userCharacterData,
          characterBoardMembersData,
          characterUsersPageData,
        } = await onActiveStockChange(
          characterId,
          name,
          currentCharacterUserPage
        );

        // 获取幻想乡数据
        const gensokyoCharacterData = await fetchGensokyoCharacterData(
          characterId
        );
        // 获取奖池数量
        const characterPoolAmount = await fetchCharacterPoolAmount(characterId);

        setCharacterDrawerData({
          userCharacterData,
          characterBoardMembers: characterBoardMembersData,
          currentCharacterUserPageData: characterUsersPageData,
          gensokyoCharacterData,
          characterPoolAmount,
        });
      } else {
        throw new Error(result.Message || '股权融资失败');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '股权融资失败';
      notifyError(errorMessage);
    }
  };

  /**
   * 计算献祭数量
   * @param type 类型
   */
  const calculateConvertAmount = (type: 'lv1' | 'lv2' | 'lv3' | 'fill') => {
    if (type === 'lv1' || type === 'lv2' || type === 'lv3') {
      let baseAmount = 0;
      switch (type) {
        case 'lv1':
          baseAmount = 500;
          break;
        case 'lv2':
          baseAmount = 2500;
          break;
        case 'lv3':
          baseAmount = 12500;
          break;
      }

      if (sacrifices === 0) {
        setConvertAmount(baseAmount);
        return;
      }
      if (sacrifices >= baseAmount) {
        setConvertAmount(0);
        return;
      }
      if (assets >= sacrifices) {
        setConvertAmount(baseAmount - sacrifices);
        return;
      }
      if (assets < sacrifices) {
        setConvertAmount(
          Math.floor((sacrifices - assets) / 2) + (baseAmount - sacrifices)
        );
        return;
      }
    }

    if (type === 'fill') {
      setConvertAmount(Math.max(0, Math.floor((sacrifices - assets) / 2)));
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
          持股
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(total)}
          </span>
        </span>
        <span className="flex-1">
          可用活股
          <span className="ml-2 text-green-400 dark:text-green-600">
            {formatInteger(amount)}
          </span>
        </span>
      </div>
      <div className="flex flex-row gap-2">
        <Badge
          variant="secondary"
          className={cn(
            'rounded-sm cursor-pointer',
            'hover:bg-slate-200 dark:hover:bg-slate-700',
            {
              'bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground':
                activeTab === 'temple',
            }
          )}
          onClick={() => setActiveTab('temple')}
        >
          献祭
        </Badge>
        <Badge
          variant="secondary"
          className={cn(
            'rounded-sm cursor-pointer',
            'hover:bg-slate-200 dark:hover:bg-slate-700',
            {
              'bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground':
                activeTab === 'financing',
            }
          )}
          onClick={() => setActiveTab('financing')}
        >
          股权融资
        </Badge>
      </div>
      <div
        className={cn('flex flex-col gap-y-2', {
          hidden: activeTab !== 'temple',
        })}
      >
        <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
          <div className="w-24 text-sm opacity-60">数量</div>
          <InputNumber
            value={convertAmount}
            onChange={(value) => {
              setConvertAmount(Math.floor(value) || 0);
            }}
            minValue={0}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-x-2">
          <Badge
            variant="outline"
            className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={() => {
              calculateConvertAmount('lv1');
            }}
          >
            光辉圣殿
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={() => {
              calculateConvertAmount('lv2');
            }}
          >
            闪耀圣殿
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={() => {
              calculateConvertAmount('lv3');
            }}
          >
            奇迹圣殿
          </Badge>
          {userTemple && (
            <Badge
              variant="outline"
              className="rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={() => {
                calculateConvertAmount('fill');
              }}
            >
              补满
            </Badge>
          )}
        </div>
        {amount < convertAmount && (
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-xs text-amber-400 dark:text-amber-600">
              可用活股数量不足
            </span>
          </div>
        )}
        <div className="flex flex-row items-center gap-x-2">
          <Button
            disabled={amount < convertAmount}
            className="w-full h-8 rounded-full"
            onClick={() => {
              handleSacrifice(convertAmount);
            }}
          >
            献祭
          </Button>
        </div>
      </div>
      <div
        className={cn('flex flex-col gap-y-2', {
          hidden: activeTab !== 'financing',
        })}
      >
        <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
          <div className="w-24 text-sm opacity-60">数量</div>
          <InputNumber
            value={financingAmount}
            onChange={(value) => {
              setFinancingAmount(Math.floor(value) || 0);
            }}
            minValue={0}
            maxValue={amount}
          />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <span className="text-xs text-amber-400 dark:text-amber-600">
            将股份出售给幻想乡获取现金，不会补充固定资产
          </span>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <Button
            disabled={amount < financingAmount}
            className="w-full h-8 rounded-full"
            onClick={() => {
              handleFinancing(financingAmount);
            }}
          >
            融资
          </Button>
        </div>
      </div>
    </div>
  );
}
