import { getUserAssets, UserAssets } from '@/api/user';
import { RedEnvelopeDialog } from '@/components/red-envelope-dialog';
import { APP_VERSION } from '@/config';
import { notifyError } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function NavFooter() {
  // 作者信息
  const [authorInfo, setAuthorInfo] = useState<UserAssets | null>(null);
  // 打赏弹窗
  const [openRedEnvelopeDialog, setOpenRedEnvelopeDialog] = useState(false);

  useEffect(() => {
    fatchAuthorInfo();
  }, []);

  // 获取作者信息
  const fatchAuthorInfo = async () => {
    try {
      const res = await getUserAssets('mtcode');
      if (res.State === 0) {
        setAuthorInfo(res.Value);
      } else {
        throw new Error(res.Message ?? '获取作者信息失败');
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : '获取作者信息失败';
      notifyError(errMsg);
    }
  };

  return (
    <>
      <div className="text-xs text-center p-2">
        <span title="当前版本" className="opacity-80">
          {APP_VERSION}
        </span>
        <span className="mx-1 opacity-80">·</span>
        <span
          title="打赏作者"
          className="cursor-pointer opacity-80 hover:opacity-100"
          onClick={() => setOpenRedEnvelopeDialog(true)}
        >
          打赏
        </span>
        <span className="mx-1 opacity-80">·</span>
        <a
          href="https://github.com/koorinyaa/tinygrail-magic"
          target="_black"
          className="cursor-pointer opacity-80 hover:opacity-100"
        >
          GitHub
        </a>
      </div>
      <RedEnvelopeDialog
        userName={authorInfo?.Name ?? ''}
        nickname={authorInfo?.Nickname ?? ''}
        open={openRedEnvelopeDialog && !!authorInfo}
        onOpenChange={setOpenRedEnvelopeDialog}
      />
    </>
  );
}
