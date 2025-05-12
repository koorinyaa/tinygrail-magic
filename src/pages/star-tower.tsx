import { StarTowerList } from '@/components/star-tower-list';
import { StarTowerLog } from '@/components/star-tower-log';

/**
 * 通天塔
 */
export function StarTower() {
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <StarTowerList />
        <StarTowerLog />
      </div>
    </div>
  );
}
