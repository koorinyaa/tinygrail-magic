import { Badge } from '@/components/ui/badge';
import { UPDATE_URL } from '@/config';
import { ArrowRightIcon } from 'lucide-react';

/**
 * 导航更新提示
 */
export function NavUpdate() {
  return (
    <div className="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg">
      <div className="flex gap-2">
        <p className="grow flex items-center text-sm">
          有新版本
          <Badge className="bg-green-400 dark:bg-green-600 h-4 px-1 ml-1 rounded-full">
            new
          </Badge>
        </p>
        <a
          href={UPDATE_URL}
          target="_black"
          className="group text-sm font-medium whitespace-nowrap"
        >
          更新
          <ArrowRightIcon
            className="ms-1 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
