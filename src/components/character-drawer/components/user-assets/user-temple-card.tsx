import { Skeleton } from '@/components/ui/skeleton';
import { TempleCard } from '@/components/ui/temple-card';
import { isEmpty } from '@/lib/utils';
import { useStore } from '@/store';
import { Ban } from 'lucide-react';

export function UserTempleCard() {
  const { characterDrawer, characterDrawerData } = useStore();
  const {
    Assets: assets = 0,
    Sacrifices: sacrifices = 0,
    Cover: cover = '',
    Level: templeLevel = 0,
    Refine: refine = 0,
    StarForces: starForces = 0,
  } = characterDrawerData.userTemple || {};

  if (characterDrawer.loading) {
    return (
      <div className="w-42 max-w-1/2">
        <Skeleton className="w-full h-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="w-42 max-w-1/2">
      {isEmpty(characterDrawerData.userTemple) ? (
        <div className="w-full aspect-[3/4] rounded-sm bg-slate-200 dark:bg-slate-800">
          <div className="flex flex-row gap-1 items-center justify-center h-full opacity-30">
            <Ban className="size-5" />
            <span className="text-lg">待建设</span>
          </div>
        </div>
      ) : (
        <TempleCard
          cover={cover}
          assets={assets}
          sacrifices={sacrifices}
          starForces={starForces}
          templeLevel={templeLevel}
          refine={refine}
          className="w-full rounded-sm overflow-hidden"
        />
      )}
    </div>
  );
}
