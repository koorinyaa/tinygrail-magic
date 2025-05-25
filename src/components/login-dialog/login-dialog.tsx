import { AUTHORIZE_URL } from '@/api/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { verifyAuth } from '@/lib/auth';
import { isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import { useEffect } from 'react';

export function LoginDialog() {
  const STORAGE_KEY = 'tinygrail-magic:user-assets';
  const storedUserAssets = localStorage.getItem(STORAGE_KEY);
  const userAssets = storedUserAssets ? JSON.parse(storedUserAssets) : null;
  const { setUserAssets } = useStore();

  useEffect(() => {
    if (isEmpty(userAssets)) {
      const intervalId = setInterval(() => {
        verifyAuth(setUserAssets);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [userAssets]);

  return (
    <Dialog open={isEmpty(userAssets)}>
      <DialogContent className="p-4 rounded-xl" hideCloseButton>
        <div className="w-full h-fit flex flex-col gap-y-4">
          <div className="flex flex-col space-y-2 text-center">
            <h2 className="text-lg font-semibold">小圣杯未授权</h2>
            <p className="text-sm text-muted-foreground">
              需要授权后才能进行操作
            </p>
          </div>
          <div className="flex flex-row gap-x-2">
            <Button
              className="flex-1 h-8 rounded-lg cursor-pointer"
              onClick={() => {
                window.open(AUTHORIZE_URL);
              }}
            >
              点击授权
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 rounded-lg cursor-pointer"
              onClick={() => {
                window.location.reload();
              }}
            >
              返回bangumi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
