import { changeLine } from '@/api/temple';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { onTemplesChange } from '../../service/user';

/**
 * 光环台词
 */
export function ChangeLine({ onClose }: { onClose: () => void }) {
  const id = useId();
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [line, setLine] = useState<string>(
    characterDrawerData.userTemple?.Line || ''
  );

  useEffect(() => {
    setCharacterDrawer({
      handleOnly: true,
    });

    return () => {
      setCharacterDrawer({
        handleOnly: false,
      });
    };
  }, []);

  /**
   * 处理台词修改
   */
  const handleLineChange = async () => {
    if (!userAssets?.id || !characterDrawer.characterId) return;
    setLoading(true);

    try {
      // 验证用户登录状态
      verifyAuth(setUserAssets);
      const result = await changeLine(characterDrawer.characterId, line);
      if (result.State === 0) {
        toast.success('修改成功');
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
        toast.error(result.Message || '台词修改失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '台词修改失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-2 items-center">
      <Label htmlFor={id}>修改台词</Label>
      <Textarea
        id={id}
        placeholder="请输入台词"
        value={line}
        onChange={(e) => {
          setLine(e.target.value);
        }}
      />
      <div className="flex-1 flex flex-row w-full gap-x-2">
        <Button
          className="flex-1 h-8 rounded-full"
          disabled={loading}
          onClick={handleLineChange}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          修改
        </Button>
        <Button
          className="flex-1 h-8 rounded-full"
          variant="secondary"
          disabled={loading}
          onClick={() => {
            onClose();
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
  );
}
