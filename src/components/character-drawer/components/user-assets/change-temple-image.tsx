import { uploadTempleImage } from '@/api/temple';
import { onTemplesChange } from '@/components/character-drawer/service/user';
import { Button } from '@/components/ui/button';
import { UploadImageBrowse } from '@/components/upload-image-browse';
import { FileMetadata } from '@/hooks/use-file-upload';
import { verifyAuth } from '@/lib/auth';
import { cn, notifyError } from '@/lib/utils';
import { useStore } from '@/store';
import { md5 } from 'js-md5';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * 修改圣殿图片
 * @param props
 * @param {() => void} props.onClose 关闭回调
 */
export function ChangeTempleImage({ onClose }: { onClose: () => void }) {
  const {
    userAssets,
    setUserAssets,
    characterDrawer,
    setCharacterDrawer,
    setCharacterDrawerData,
  } = useStore();
  const [image, setImage] = useState<File | FileMetadata>();
  const [loading, setLoading] = useState(false);

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
   * 修改圣殿图片
   */
  const handleUploadTempleImage = async () => {
    if (
      !userAssets?.name ||
      !characterDrawer.characterId ||
      !(image instanceof File)
    )
      return;

    setLoading(true);

    try {
      // 验证用户登录状态
      verifyAuth(setUserAssets);

      // 将File转换为base64的Promise函数
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      // 等待base64转换完成
      const imageBase64 = await fileToBase64(image);

      const hash = md5(imageBase64);
      const result = await uploadTempleImage(
        characterDrawer.characterId,
        imageBase64,
        image.type,
        hash
      );
      if (result.State === 0) {
        toast.success(result.Value);
        onClose();

        // 圣殿变化更新相关数据
        onTemplesChange(
          characterDrawer.characterId,
          userAssets.name,
          setCharacterDrawerData
        );
      } else {
        throw new Error(result.Message || '修改圣殿封面失败');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '修改圣殿封面失败';
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-2">
      <UploadImageBrowse
        onImageChange={(image) => {
          setImage(image);
        }}
        className="rounded-sm cursor-pointer"
      />
      <div className="flex flex-row gap-x-2">
        <Button
          className="flex-1 h-8 rounded-full"
          disabled={loading || !image}
          onClick={handleUploadTempleImage}
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
          onClick={onClose}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          关闭
        </Button>
      </div>
    </div>
  );
}
