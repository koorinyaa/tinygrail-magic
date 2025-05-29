import { TempleItem } from '@/api/character';
import { useStardust } from '@/api/magic-item';
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
  amount: number;
}

/**
 * 星光碎片
 * @param props
 * @param {characterData} props.characterData 角色数据
 * @param {TempleItem} props.templeData 圣殿数据
 * @param {() => void} props.onCancel 取消回调
 * @param {(value: string) => void} props.onOk 确定回调
 * @param {() => void} props.onClose 关闭回调
 * @param {string} props.className 类名
 */
export function StardustContent({
  characterData,
  templeData,
  onCancel,
  onOk,
  onClose,
  className,
}: {
  characterData: CharacterData;
  templeData: TempleItem;
  onCancel: () => void;
  onOk: (value: string) => void;
  onClose: () => void;
  className?: string;
}) {
  const { setUserAssets } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 数量
  const [amount, setAmount] = useState(0);

  /**
   * 计算效率比例
   */
  const calculateEfficiency = () => {
    if (characterData.level >= templeData.CharacterLevel) {
      return '1:1';
    }

    const levelDifference = templeData.CharacterLevel - characterData.level;
    const ratio = Math.min(Math.pow(2, levelDifference), 32);

    return `${ratio}:1`;
  };

  /**
   * 使用星光碎片
   */
  const handleUseStardust = async () => {
    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const response = await useStardust(
        characterData.id,
        templeData.CharacterId,
        amount
      );
      if (response.State === 0) {
        onOk(response.Value);
      } else {
        onClose();
        throw new Error(response.Message ?? '星光碎片使用失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '星光碎片使用失败';
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
        <h2 className="text-lg font-semibold">星光碎片</h2>
      </div>
      <div className="flex-1 flex flex-col w-full gap-y-2">
        <div className="flex flex-row items-center justify-center gap-x-1">
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
              <span>可用持股：{formatInteger(characterData.amount)}</span>
            </div>
            <div className="text-xs opacity-60">
              <span>效率：{calculateEfficiency()}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <ArrowBigRight className="size-4 opacity-40" />
          </div>
          <div className="w-32">
            <TempleCard data={templeData} />
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
            <div className="w-16 text-sm opacity-60">消耗数量</div>
            <div className="flex-1 w-full">
              <InputNumber
                value={amount}
                onChange={(value) => {
                  setAmount(Math.floor(value) ?? 0);
                }}
                minValue={0}
                maxValue={characterData.amount}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-row w-full gap-x-2">
          <Button
            className="flex-1 h-8 rounded-full"
            disabled={loading}
            onClick={handleUseStardust}
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
