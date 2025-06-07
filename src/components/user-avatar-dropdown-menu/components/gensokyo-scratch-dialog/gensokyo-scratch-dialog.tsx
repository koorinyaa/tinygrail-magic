import { DrawCharacterValue } from '@/api/magic-item';
import { askCharacter, getGensokyoScratchCount, scratch } from '@/api/user';
import { Badge } from '@/components/ui/badge';
import BadgeLevel from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { verifyAuth } from '@/lib/auth';
import {
  cn,
  decodeHTMLEntities,
  formatCurrency,
  formatInteger,
  getAvatarUrl,
  notifyError,
} from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * 刮刮乐弹窗
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function GensokyoScratchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setUserAssets, openCharacterDrawer } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 刮刮乐已使用次数
  const [scratchCount, setScratchCount] = useState(0);
  // 刮刮乐结果
  const [scratchResult, setScratchResult] = useState<DrawCharacterValue[]>([]);
  // 已确认
  const [confirmed, setConfirmed] = useState(false);
  // 已售出角色ID记录
  const [soldCharaIds, setSoldCharaIds] = useState<number[]>([]);

  /**
   * 获取用户已使用刮刮乐次数
   */
  const fetchScratchCount = async () => {
    setLoading(true);
    try {
      const res = await getGensokyoScratchCount();
      if (res.State === 0) {
        setScratchCount(res.Value);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取刮刮乐次数失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 组件打开时获取用户已使用刮刮乐次数
  useEffect(() => {
    if (open) {
      fetchScratchCount();
    }
  }, [open]);

  /**
   * 刮刮乐
   */
  const handleScratch = async () => {
    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const res = await scratch(true);
      if (res.State === 0) {
        setScratchResult(res.Value);
        verifyAuth(setUserAssets);
      } else {
        throw new Error(res.Message ?? '刮刮乐执行失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '刮刮乐执行失败';
      notifyError(errMsg);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 出售角色
   */
  const handleSell = async (chara: DrawCharacterValue) => {
    try {
      verifyAuth(setUserAssets);

      const res = await askCharacter(
        chara.Id,
        chara.SellPrice,
        Math.min(chara.Amount, chara.SellAmount)
      );
      if (res.State === 0) {
        toast.success('出售完成', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description: `获得资金 ₵${formatCurrency(
            chara.SellPrice * Math.min(chara.Amount, chara.SellAmount)
          )}`,
        });
        // 更新用户资产
        verifyAuth(setUserAssets);
        // 记录已售出角色ID
        setSoldCharaIds((prev) => [...prev, chara.Id]);
      } else {
        throw new Error(res.Message ?? '出售失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '出售失败';
      notifyError(errMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="p-4 rounded-xl">
        <VisuallyHidden asChild>
          <DialogTitle />
        </VisuallyHidden>
        {confirmed ? (
          <div className="w-full h-fit flex flex-col gap-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-lg font-semibold">刮刮乐</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 min-h-20 !max-h-[calc(80dvh-4.75rem)] !max-h-[calc(80vh-4.75rem)] overflow-auto">
              {scratchResult.map((chara, index) => (
                <div key={index} className="flex flex-col gap-y-1">
                  <div
                    className={cn(
                      'aspect-[3/4] bg-cover bg-top bg-no-repeat',
                      'relative rounded-md',
                      'overflow-hidden cursor-pointer'
                    )}
                    style={{
                      backgroundImage: `url(${getAvatarUrl(
                        chara.Cover,
                        'medium'
                      )})`,
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#00000000]/0 to-[#000000cc] text-white">
                      <div className="absolute bottom-0 w-full px-2 pt-4 pb-1.5">
                        <div
                          className="flex flex-row"
                          onClick={() => {
                            openCharacterDrawer(chara.Id);
                          }}
                        >
                          <span className="text-xs truncate">
                            {decodeHTMLEntities(chara.Name || '')}
                          </span>
                          <BadgeLevel level={chara.Level} />
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute top-1 right-0 scale-80 bg-green-500 dark:bg-green-600 text-white font-bold font-mono rounded-sm"
                      title="数量"
                    >
                      ×{chara.Amount}
                    </Badge>
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    {!soldCharaIds.includes(chara.Id) &&
                      chara.SellPrice > 0 &&
                      chara.SellAmount > 0 && (
                        <Badge
                          variant="outline"
                          className="rounded-sm cursor-pointer"
                          onClick={() => {
                            handleSell(chara);
                          }}
                        >
                          出售(₵{formatCurrency(chara.SellPrice)})
                        </Badge>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-fit flex flex-col gap-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-lg font-semibold">提示</h2>
              <p className="text-sm text-muted-foreground">
                是消费₵{formatInteger(2000 * Math.pow(2, scratchCount))}
                购买一张幻想乡刮刮乐彩票？
              </p>
              <p className="text-xs text-muted-foreground">
                今日已使用：{scratchCount}次
              </p>
            </div>
            <div className="flex flex-row gap-x-2">
              <Button
                className="flex-1 h-8 rounded-lg"
                disabled={loading}
                onClick={async () => {
                  await handleScratch();
                  setConfirmed(true);
                }}
              >
                <LoaderCircleIcon
                  className={cn('-ms-1 animate-spin', { hidden: !loading })}
                  size={16}
                  aria-hidden="true"
                />
                确定
              </Button>
              <Button
                className="flex-1 h-8 rounded-lg"
                variant="secondary"
                disabled={loading}
                onClick={() => {
                  onOpenChange(false);
                }}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
