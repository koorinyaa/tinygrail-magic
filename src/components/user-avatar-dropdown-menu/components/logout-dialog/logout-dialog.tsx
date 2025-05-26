import { logout } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn, notifyError } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * 退出登录弹窗
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function LogoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 退出登录
   */
  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await logout();
      if (res.State === 0) {
        window.location.reload();
      } else {
        throw new Error(res.Message ?? '退出登录时出现错误');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '退出登录时出现错误';
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
            <p className="text-sm text-destructive">是否确定退出登录？</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <Button
              variant="destructive"
              className="flex-1 h-8 rounded-lg"
              disabled={loading}
              onClick={async () => {
                await handleLogout();
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
