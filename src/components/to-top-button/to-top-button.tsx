import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { ArrowUpToLine } from 'lucide-react';

/**
 * 回到顶部按钮
 * @param props
 * @param props.className 自定义类名
 */
export function ToTopButton({ className }: { className?: string }) {
  const { toTop } = useStore();

  return (
    <button
      onClick={() => {
        toTop();
      }}
      className={cn(
        'bg-card text-foreground/80 p-2 rounded-full shadow-lg transition-colors cursor-pointer',
        className
      )}
      title="返回顶部"
    >
      <ArrowUpToLine className="size-4" />
    </button>
  );
}
