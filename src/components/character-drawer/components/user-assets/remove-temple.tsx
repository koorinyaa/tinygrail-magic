import { destroyTemple } from '@/api/temple';
import { onTemplesChange } from '@/components/character-drawer/service/user';
import { Button } from '@/components/ui/button';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function RemoveTemple({ onClose }: { onClose: () => void }) {
  const { userAssets, setUserAssets, characterDrawer, setCharacterDrawerData } =
    useStore();
  const [loading, setLoading] = useState(false);

  /**
   * 拆除圣殿
   */
  const handleRemoveTemple = async () => {
    if (!userAssets?.id || !characterDrawer.characterId) return;
    setLoading(true);

    try {
      // 验证用户登录状态
      verifyAuth(setUserAssets);

      const result = await destroyTemple(characterDrawer.characterId);

      if (result.State === 0) {
        toast.success('拆除成功');
        onClose();

        // 获取圣殿变化相关数据
        const {
          characterTemplesData,
          characterLinksData,
          userTempleData,
          userCharacterData,
          characterDetailData,
        } = await onTemplesChange(characterDrawer.characterId, userAssets.name);

        setCharacterDrawerData({
          characterTemples: characterTemplesData,
          characterlinks: characterLinksData,
          userTemple: userTempleData,
          userCharacterData,
          characterDetail: characterDetailData,
        });
      } else {
        toast.warning(result.Message || '拆除失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '拆除失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-lg font-semibold">提示</h2>
        <p className="text-sm text-destructive">
          是否确定要拆除圣殿？（拆除圣殿会扣除星之力和星级，该操作不可逆，请谨慎操作）
        </p>
      </div>
      <div className="flex flex-row gap-x-2">
        <Button
          className="flex-1 h-8 rounded-full"
          variant="destructive"
          disabled={loading}
          onClick={handleRemoveTemple}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          拆除
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
