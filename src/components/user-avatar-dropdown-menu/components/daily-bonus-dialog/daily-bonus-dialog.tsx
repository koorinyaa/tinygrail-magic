import { claimBonusDaily } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * 每日奖励弹窗
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function DailyBonusDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setUserAssets } = useStore();
  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 领取每日奖励
   */
  const handleClaimBonusDaily = async () => {
    setLoading(true);

    try {
      verifyAuth(setUserAssets);

      const res = await claimBonusDaily();
      if (res.State === 0) {
        toast.success('领取成功', {
          duration: Infinity,
          cancel: {
            label: '关闭',
            onClick: () => {},
          },
          description: res.Value || '',
        });
        verifyAuth(setUserAssets);
      } else {
        throw new Error(res.Message ?? '领取每日奖励失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '领取每日奖励失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="p-4 rounded-xl">
        <VisuallyHidden asChild>
          <DialogTitle />
        </VisuallyHidden>
        <div className="w-full h-fit flex flex-col gap-y-4">
          <div className="flex flex-col space-y-2 text-center">
            <h2 className="text-lg font-semibold">提示</h2>
            <p className="text-sm text-muted-foreground">
              是否确定领取每日奖励？
            </p>
          </div>
          <div className="flex flex-row gap-x-2">
            <Button
              className="flex-1 h-8 rounded-lg"
              disabled={loading}
              onClick={async () => {
                await handleClaimBonusDaily();
                onOpenChange(false);
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
      </DialogContent>
    </Dialog>
  );
}
