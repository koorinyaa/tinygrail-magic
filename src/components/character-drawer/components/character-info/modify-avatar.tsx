import { CharacterUserValue, uploadCharacterAvatar } from '@/api/character';
import { AvatarCropper } from '@/components/avatar-cropper';
import { Button } from '@/components/ui/button';
import { UploadImageButton } from '@/components/ui/upload-image-button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  cn,
  getAvatarUrl,
  isEmpty,
  notifyError,
  resizeImage,
} from '@/lib/utils';
import { useStore } from '@/store';
import { md5 } from 'js-md5';
import { CircleAlert, LoaderCircleIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FixedCropperRef } from 'react-advanced-cropper';
import { toast } from 'sonner';
import { fetchCharacterDetailData } from '../../service/character';
import { DrawerClose } from '@/components/ui/drawer';

/**
 * 更换头像
 */
export function ModifyAvatar({
  setHandleOnly,
}: {
  setHandleOnly?: (handleOnly: boolean) => void;
}) {
  const isMobile = useIsMobile(448);
  const {
    userAssets,
    characterDrawerData,
    setCharacterDrawerData,
  } = useStore();
  const cropperRef = useRef<FixedCropperRef>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    type?: string;
    url: string | null;
  } | null>(null);
  const {
    CharacterId: characterId = 0,
    Icon: src = '',
    Name: name = '',
  } = characterDrawerData.characterDetailData || {};

  useEffect(() => {
    setHandleOnly?.(!isEmpty(uploadedImage?.url));
  }, [uploadedImage?.url]);

  /**
   * 判断用户是否活跃
   */
  const isActive = (boardMember: CharacterUserValue) => {
    const lastActiveDate = new Date(boardMember.LastActiveDate);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff < 5 && boardMember.State !== 666;
  };

  /**
   * 判断当前用户是否有修改头像权限
   */
  const canEditAvatar = (): boolean => {
    const { characterBoardMemberItems = [] } = characterDrawerData;

    // 641给自己的vip通道
    if (userAssets?.id === 702) return true;

    if (characterBoardMemberItems.length <= 0) return false;

    if (
      !characterBoardMemberItems.some(
        (boardMember) => boardMember.Name === userAssets?.name
      )
    )
      return false;

    // 筛选可编辑头像的董事会成员
    const editableBoardMembers = isActive(characterBoardMemberItems[0])
      ? [characterBoardMemberItems[0]]
      : characterBoardMemberItems.filter((boardMember) => isActive(boardMember));

    // 判断当前用户是否在可编辑列表中
    return editableBoardMembers.some(
      (boardMember) => boardMember?.Name === userAssets?.name
    );
  };

  /**
   * 上传头像
   */
  const handleUploadAvatar = async () => {
    if (cropperRef.current) {
      const dataUrl = cropperRef.current.getCanvas()?.toDataURL('image/png');
      if (dataUrl) {
        setLoading(true);
        try {
          const processedDataUrl = await resizeImage(dataUrl, {
            width: 256,
            height: 256,
            type: 'image/jpeg',
            smoothing: true,
            quality: 'high',
          });
          const hash = md5(processedDataUrl);
          const result = await uploadCharacterAvatar(
            characterId,
            processedDataUrl,
            hash
          );
          0;
          if (result.State === 0) {
            toast.success('头像更换成功');
            fetchCharacterDetailData(characterId).then(
              (characterDetailData) => {
                if ('Current' in characterDetailData) {
                  setCharacterDrawerData({
                    characterDetailData,
                  });
                }
              }
            );
          } else {
            throw new Error(result.Message || '头像更换失败');
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : '头像更换失败';
          notifyError(errMsg);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  if (isEmpty(uploadedImage?.url)) {
    return (
      <div
        className={cn('flex flex-col py-4 gap-y-2 overflow-y-auto', {
          'pt-2': isMobile,
        })}
      >
        <div className="flex justify-center">
          <img
            src={getAvatarUrl(src, 'medium')}
            alt={name}
            className="size-48 object-cover object-top rounded-sm m-shadow-card pointer-events-none"
          />
        </div>
        <div className="flex flex-col gap-y-2 items-center">
          <UploadImageButton
            disabled={!canEditAvatar()}
            onImageChange={(url, type) => {
              setUploadedImage({ url, type });
            }}
            className={cn(
              'flex items-center justify-center w-32 rounded-md text-foreground',
              {
                'bg-slate-300/40 hover:bg-slate-300/60 dark:bg-slate-700/50 dark:hover:bg-slate-700/80':
                  canEditAvatar(),
                'bg-slate-200 hover:bg-slate-200 dark:bg-slate-800/50 hover:dark:bg-slate-800/50':
                  !canEditAvatar(),
              }
            )}
          >
            更换头像
          </UploadImageButton>
          <div
            className={cn(
              'flex gap-x-1 items-center justify-center text-xs text-foreground/60',
              { hidden: canEditAvatar() }
            )}
          >
            <CircleAlert className="size-3 inline-block opacity-50" />
            <span>只有满足条件的董事会成员才有更换头像的权限</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col p-2 gap-y-2', { 'pt-0': isMobile })}>
      <div className="flex flex-col rounded-md overflow-hidden">
        <AvatarCropper
          cropperRef={cropperRef}
          src={uploadedImage && uploadedImage.url}
        />
      </div>
      <div className="flex gap-x-2 justify-center">
        <DrawerClose asChild>
          <Button
            variant="secondary"
            onClick={handleUploadAvatar}
            disabled={loading}
            className={cn(
              'flex-1 flex items-center justify-center w-full rounded-md text-sm cursor-pointer',
              'bg-slate-300/40 hover:bg-slate-300/60 dark:bg-slate-700/50 dark:hover:bg-slate-700/80'
            )}
          >
            <LoaderCircleIcon
              className={cn('-ms-1 animate-spin', { hidden: !loading })}
              size={16}
              aria-hidden="true"
            />
            确定
          </Button>
        </DrawerClose>
        <UploadImageButton
          disabled={!canEditAvatar() || loading}
          onImageChange={(url, type) => {
            setUploadedImage({ url, type });
          }}
          className={cn(
            'flex-1 flex items-center justify-center w-32 rounded-md text-foreground',
            {
              'bg-slate-300/40 hover:bg-slate-300/60 dark:bg-slate-700/50 dark:hover:bg-slate-700/80':
                canEditAvatar(),
              'bg-slate-200 hover:bg-slate-200 dark:bg-slate-800/50 hover:dark:bg-slate-800/50':
                !canEditAvatar(),
            }
          )}
        >
          <LoaderCircleIcon
            className={cn('-ms-1 animate-spin', { hidden: !loading })}
            size={16}
            aria-hidden="true"
          />
          重新上传
        </UploadImageButton>
      </div>
    </div>
  );
}
