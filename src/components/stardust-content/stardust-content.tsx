import { TempleItem } from '@/api/character';
import { useStardust } from '@/api/magic-item';
import { InputNumber } from '@/components/input-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeLevel from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
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
import { ArrowBigRight, HelpCircle, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * 角色数据
 */
interface CharacterData {
  id: number;
  name: string;
  avatar: string;
  level: number;
  amount: number;
  star: number;
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
  // 加载信息
  const [loadingMsg, setLoadingMsg] = useState('');
  // 数量
  const [amount, setAmount] = useState(0);
  // 退市模式
  const [isStMode, setIsStMode] = useState(false);

  /**
   * 计算效率比例
   */
  const calculateEfficiency = () => {
    if (characterData.level + 1 >= templeData.CharacterLevel) {
      return '1:1';
    }

    const levelDifference = templeData.CharacterLevel - characterData.level - 1;
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

      if (isStMode) {
        setLoadingMsg(`0/${amount}`);
        let count = 0;
        let errMsg = '';
        // 退市模式
        for (let i = 0; i < amount; i++) {
          const response = await useStardust(
            characterData.id,
            templeData.CharacterId,
            1
          );
          if (response.State === 0) {
            count++;
            setLoadingMsg(`${count}/${amount}`);
          } else {
            errMsg = response.Message ?? '星光碎片使用失败';
            break;
          }
        }
        setLoadingMsg('');
        if (count === amount) {
          onOk(`共消耗${count}股`);
        } else {
          toast.warning('执行中断', {
            duration: Infinity,
            cancel: {
              label: '关闭',
              onClick: () => {},
            },
            description: (
              <span>
                {`共消耗${count}股`}
                <br />
                {errMsg}
              </span>
            ),
          });
        }
      } else {
        // 正常模式
        const response = await useStardust(
          characterData.id,
          templeData.CharacterId,
          amount
        );
        if (response.State === 0) {
          onOk(response.Value);
        } else {
          throw new Error(response.Message ?? '星光碎片使用失败');
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '星光碎片使用失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className={cn(
        '"w-full h-fit flex flex-col gap-y-4 items-center"',
        className
      )}
    >
      {loading && loadingMsg && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-y-0.5 z-10">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-xs">{loadingMsg}</span>
        </div>
      )}
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
        {characterData.star < 5 && (
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center justify-evenly h-9 gap-x-1">
              <div className="w-20 text-sm opacity-60">
                退市模式
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="size-3 ml-0.5 opacity-60 cursor-pointer pointer-events-auto" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="px-3 py-2 w-fit z-100"
                    onOpenAutoFocus={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <span className="text-xs">
                      <span className="text-orange-400 dark:text-orange-600">
                        非必要情况请不要开启
                      </span>
                      <br />
                      每次烧1股，可保证低于5星的角色不会进入幻想乡
                    </span>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1 flex justify-end">
                <Switch
                  checked={isStMode}
                  onCheckedChange={setIsStMode}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
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
