import { CharacterPageContent } from '@/components/character-page-content';
import { RecentCharacterLog } from '@/components/recent-character-log';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * 角色
 */
export function CharacterPage() {
  const isMobile = useIsMobile(1280);
  return (
    <div className="flex flex-col w-full max-w-screen-xl m-auto">
      <div className="flex flex-col xl:gap-x-6 xl:flex-row w-full">
        <CharacterPageContent />
        {!isMobile && (
          <div className="w-90 min-w-90 mt-0">
            <Card className="p-0 gap-0">
              <CardContent className="px-0">
                <RecentCharacterLog />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
