import { Skeleton } from '@/components/ui/skeleton';

/**
 * 每周萌王卡片骨架组件
 * @param {string} className - 类名
 */
export const TopWeekCardSkeleton = ({ className }: { className?: string }) => (
  <div className={`w-full min-w-32 max-w-60 ${className}`}>
    <Skeleton className="aspect-[3/4] rounded-2xl" />
    <div className="space-y-2 mt-2">
      <Skeleton className="h-4" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);