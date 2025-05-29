import { TempleItem } from '@/api/character';
import { useStarbreak } from '@/api/magic-item';
import { InputNumber } from '@/components/input-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import { TempleCard } from '@/components/ui/temple-card';
import { verifyAuth } from '@/lib/auth';
import {
    cn,
    decodeHTMLEntities,
    formatInteger,
    getAvatarUrl,
    notifyError,
    sleep,
} from '@/lib/utils';
import { useStore } from '@/store';
import { ArrowBigRight, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * 角色数据
 */
interface CharacterData {
  id: number;
  name: string;
  avatar: string;
  level: number;
  starForces: number;
}

export function StarbreakContent({
  characterData,
  templeData,
  onCancel,
  onOk,
  className,
}: {
  characterData: CharacterData;
  templeData: TempleItem;
  onCancel: () => void;
  onOk: (count: number) => void;
  className?: string;
}) {
  const { setUserAssets } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 攻击次数
  const [attackCount, setAttackCount] = useState(0);

  /**
   * 计算倍率
   * @returns {number} 倍率
   */
  const calculateRate = (): number => {
    // 如果等级相等，倍率为1
    if (characterData.level === templeData.CharacterLevel) {
      return 1;
    }

    // 如果任意一方等级为0，倍率为0
    if (characterData.level === 0 || templeData.CharacterLevel === 0) {
      return 0;
    }

    // 计算15*lg(a/b)的绝对值
    const ratio = Math.abs(
      15 * Math.log10(characterData.level / templeData.CharacterLevel)
    );

    if (templeData.CharacterLevel > characterData.level) {
      return Number((1 * ratio).toFixed(2));
    } else {
      return Number((1 / ratio).toFixed(2));
    }
  };

  /**
   * 使用闪光结晶
   */
  const handleUseStarbreak = async () => {
    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      let count = 0;
      for (let i = 0; i < attackCount; i++) {
        const response = await useStarbreak(
          templeData.CharacterId,
          characterData.id
        );
        if (response.State === 0) {
          count++;
        } else {
          break;
        }
        await sleep(100);
      }
      onOk(count);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : '闪光结晶使用失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        '"w-full h-fit flex flex-col gap-y-4 items-center"',
        className
      )}
    >
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-lg font-semibold">闪光结晶</h2>
      </div>
      <div className="flex-1 flex flex-col w-full gap-y-2">
        <div className="flex flex-row items-center justify-center gap-x-1">
          <div className="w-32">
            <TempleCard data={templeData} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <ArrowBigRight className="size-4 opacity-40" />
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1">
              <Avatar className="size-12 rounded-full">
                <AvatarImage
                  className="object-cover object-top"
                  src={getAvatarUrl(characterData.avatar)}
                  alt={decodeHTMLEntities(characterData.name)}
                />
                <AvatarFallback className="rounded-lg">C</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center text-sm font-semibold truncate">
              <span>{decodeHTMLEntities(characterData.name)}</span>
              <BadgeLevel level={characterData.level} zeroCount={0} />
            </div>
            <div className="text-xs opacity-60">
              <span>#{characterData.id}</span>
            </div>
            <div className="text-xs opacity-60">
              <span>
                星之力：{formatInteger(characterData.starForces, true)}
              </span>
            </div>
            <div className="text-xs opacity-60">
              <span>倍率：{calculateRate()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
            <div className="w-16 text-sm opacity-60">攻击次数</div>
            <div className="flex-1 w-full">
              <InputNumber
                value={attackCount}
                onChange={(value) => {
                  setAttackCount(Math.floor(value) ?? 0);
                }}
                minValue={0}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-row w-full gap-x-2">
          <Button
            className="flex-1 h-8 rounded-full"
            disabled={loading}
            onClick={handleUseStarbreak}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            开始攻击
          </Button>
          <Button
            className="flex-1 h-8 rounded-full"
            variant="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            重新选择
          </Button>
        </div>
      </div>
    </div>
  );
}
