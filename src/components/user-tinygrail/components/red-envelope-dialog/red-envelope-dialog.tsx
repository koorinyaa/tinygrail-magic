import { sendRedPacket } from '@/api/user';
import { InputNumber } from '@/components/input-number';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn, decodeHTMLEntities, notifyError } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * 发送红包弹窗
 * @param userName 用户名
 * @param open 是否打开
 * @param onOpenChange 打开状态改变回调
 */
export function RedEnvelopeDialog({
  userName,
  nickname,
  open,
  onOpenChange,
}: {
  userName: string;
  nickname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 红包金额
  const [amount, setAmount] = useState(100);
  // 留言
  const [message, setMessage] = useState('');

  /**
   * 发送红包
   */
  const handleSendRedPacket = async () => {
    setLoading(true);

    try {
      const res = await sendRedPacket(userName, amount, message);
      if (res.State === 0) {
        toast.success(res.Value ?? '发送红包完成');
      } else {
        throw new Error(res.Message ?? '发送红包失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '发送红包失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full h-fit flex flex-col gap-y-4 max-w-xs sm:max-w-xs md:max-w-xs p-4 rounded-xl"
        hideCloseButton
      >
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-lg font-semibold">发送红包给{decodeHTMLEntities(nickname)}</h2>
        </div>
        <div className="flex flex-col gap-y-2 mt-1">
          <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
            <div className="w-12 text-sm opacity-60">金额</div>
            <InputNumber
              value={amount}
              onChange={(value) => {
                setAmount(value ? Number(value.toFixed(2)) : 100);
              }}
              minValue={100}
              maxValue={10000}
              className="flex-1"
            />
          </div>
          <div className="flex flex-row items-center justify-evenly h-8 gap-x-1">
            <div className="w-12 text-sm opacity-60">留言</div>
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="请输入留言"
              className="flex-1"
            />
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          <Button
            className="flex-1 h-8 rounded-lg"
            disabled={loading}
            onClick={async () => {
              await handleSendRedPacket();
              onOpenChange(false);
            }}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            发送
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
      </DialogContent>
    </Dialog>
  );
}
