import { AUTHORIZE_URL } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isEmpty } from "@/lib/utils";
import { verifyAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useStore } from "@/store";

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
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>小圣杯未授权</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            需要授权后才能进行此操作
          </p>
          <Button
            className="rounded-full"
            onClick={() => {
              window.open(AUTHORIZE_URL);
            }}
          >
            点击授权
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}