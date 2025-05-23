import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { UPDATE_URL } from '@/config';
import { ArrowRightIcon } from 'lucide-react';

/**
 * 导航更新提示
 */
export function NavUpdate() {
  return (
    <div
      className="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg cursor-pointer"
      onClick={() => {
        window.open(UPDATE_URL);
      }}
    >
      <div className="flex gap-2">
        <p className="grow flex items-center text-sm">
          有新版本
          <Badge className="bg-green-400 dark:bg-green-600 h-4 px-1 ml-1 rounded-full">
            new
          </Badge>
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="text-sm font-medium whitespace-nowrap">
              更新
              <ArrowRightIcon
                className="ms-1 -mt-0.5 inline-flex opacity-60"
                size={16}
                aria-hidden="true"
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>版本更新</AlertDialogTitle>
              <AlertDialogDescription>
                更新完成后请刷新页面
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                关闭
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  window.location.reload();
                }}
                className="cursor-pointer"
              >
                刷新
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
