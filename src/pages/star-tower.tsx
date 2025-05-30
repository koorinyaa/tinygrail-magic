import { StarTowerList } from '@/components/star-tower-list';
import { StarTowerLog } from '@/components/star-tower-log';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * 通天塔
 */
export function StarTower() {
  const isMobile = useIsMobile(1280);
  return (
    <div className="flex flex-col w-full h-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full h-full">
        <div className="w-full h-full">
          <StarTowerList />
        </div>
        {!isMobile && (
          <div className="w-90 min-w-90 mt-0">
            <Card className="p-0 gap-0">
              <CardContent className='px-0'>
                <StarTowerLog />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
