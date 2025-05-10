import { resetTempleImage } from '@/api/temple';
import { onTemplesChange } from '../../service/user';
import { Button } from '@/components/ui/button';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ResetTempleImage({ onClose }: { onClose: () => void }) {
  const { userAssets, setUserAssets, characterDrawer, setCharacterDrawerData } =
    useStore();
  const [loading, setLoading] = useState(false);

  /**
   * 重置圣殿图片
   */
  const handleResetTempleImage = async () => {
    if (!userAssets?.id || !characterDrawer.characterId) return;

    setLoading(true);

    try {
      // 验证用户登录状态
      verifyAuth(setUserAssets);

      const result = await resetTempleImage(
        characterDrawer.characterId,
        userAssets.id
      );
      if (result.State === 0) {
        toast.success('重置圣殿封面完成');

        // 圣殿变化更新相关数据
        onTemplesChange(
          characterDrawer.characterId,
          userAssets.name,
          setCharacterDrawerData
        );
      } else {
        toast.warning(result.Message || '重置圣殿封面失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '重置圣殿封面失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-lg font-semibold">提示</h2>
        <p className="text-sm text-muted-foreground">是否确定重置圣殿图片？</p>
      </div>
      <div className="flex flex-row gap-x-2">
        <Button
          className="flex-1 h-8 rounded-full"
          disabled={loading}
          onClick={handleResetTempleImage}
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
