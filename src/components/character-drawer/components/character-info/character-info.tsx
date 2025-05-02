import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/store';
import { CharacterAttribute } from './character-attribute';
import { CharacterAvatar } from './character-avatar';
import { CharacterDetailInfo } from './character-detail-info';
import { MoreAction } from './more-action';

/**
 * 角色信息
 */
export function CharacterInfo() {
  const { characterDrawer } = useStore();
  const { loading = false } = characterDrawer;

  if (loading) {
    return (
      <div className="mt-20 p-3 bg-card rounded-md relative">
        <div className="absolute -top-6 left-4 z-10">
          <div className="size-16 rounded-full bg-card">
            <Skeleton className="size-16 rounded-full border-2 border-secondary" />
          </div>
        </div>
        <div className="h-12" />
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col">
            <Skeleton className="h-5 w-24 rounded-sm" />
            <Skeleton className="h-4 w-12 mt-1.5 rounded-sm" />
          </div>
          <Skeleton className="h-10 w-11" />
        </div>
        <div className="flex flex-row flex-wrap items-center mt-2 gap-x-1">
          <Skeleton className="h-5.5 w-10 rounded-sm" />
          <Skeleton className="h-5.5 w-10 rounded-sm" />
          <Skeleton className="h-5.5 w-10 rounded-sm" />
        </div>
        <div className="mt-2 flex flex-col gap-y-1.5">
          <div className="flex flex-row items-center gap-x-1">
            <Skeleton className="flex-1 rounded-sm h-12.5" />
            <Skeleton className="flex-1 rounded-sm h-12.5" />
            <Skeleton className="flex-1 rounded-sm h-12.5" />
            <Skeleton className="flex-1 rounded-sm h-12.5" />
          </div>
          <Skeleton className="h-7 rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 p-3 bg-card rounded-t-md relative">
      <div className="absolute -top-6 left-4">
        <CharacterAvatar />
      </div>
      <div className="h-12 relative">
        <MoreAction />
      </div>
      <CharacterAttribute />
      <CharacterDetailInfo />
    </div>
  );
}
