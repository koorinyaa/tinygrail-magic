import { initICO } from '@/api/character';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 未上市角色
 * @param {() => void} initializeData 初始化数据
 */
export function CharacterUnlisted({
  initializeData,
}: {
  initializeData: () => void;
}) {
  const isMobile = useIsMobile(448);
  const { setUserAssets, characterDrawer, setCharacterDrawer } = useStore();
  const { characterId } = characterDrawer;
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 注资金额
  const [amount, setAmount] = useState(10000);

  useEffect(() => {
    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: isMobile ? false : true,
    });
  }, [isMobile]);

  /**
   * 启动ICO
   */
  const handleInitICO = async () => {
    if (!characterId) return;
    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const res = await initICO(characterId, amount);
      if (res.State === 0) {
        initializeData();
      } else {
        throw new Error(res.Message || '启动ICO失败');
      }
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : '启动ICO失败';
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3 flex flex-col gap-y-2">
      <div className="text-sm opacity-60">
        #{characterId}未上市，点击启动按钮，加入“小圣杯”的争夺！
      </div>
      <div className="flex flex-row gap-x-1">
        <InputNumber
          value={amount}
          onChange={(value) => {
            setAmount(value ? Number(value.toFixed(2)) : 0);
          }}
          minValue={10000}
          className="flex-1"
        />
        <Button disabled={loading} onClick={handleInitICO} className="h-8">
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          启动ICO
        </Button>
      </div>
    </div>
  );
}
